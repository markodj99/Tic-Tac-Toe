import Joi from "joi";
import User from "../models/user";
import UserRepo from "../repos/userRepo";
import { LoginParams, RegisterParams, ValidateParamsResult, CustomResponse } from "../config/types";

class UserService{
    private userRepo: UserRepo;
    private loginValidationSchema;
    private registerValidationSchema;

    constructor(userRepo:UserRepo) {
        this.userRepo = userRepo;
        this.loginValidationSchema = Joi.object({
            email: Joi.string().email().max(255).required(),
            password: Joi.string().min(8).max(255).required()
        });
        this.registerValidationSchema = Joi.object({
            username: Joi.string().min(7).max(255).required(),
            email: Joi.string().email().max(255).required(),
            password: Joi.string().min(8).max(255).required(),
            repeatpassword: Joi.string().min(8).max(255).required(),
        });
    }

    async processLogin(params:LoginParams):Promise<CustomResponse> {
        const loginParamsResult:ValidateParamsResult = await this.validateLoginParams(params);
        if (!loginParamsResult.result) return { statusCode: 400, message: loginParamsResult.message };

        const user:User | null = await this.userRepo.getUserByEmail(params.email);
        if (!user) return { statusCode: 400, message: 'Wrong email, please try again.' };

        // to do heshiranje passworda i jwt
        if (user.getDataValue('password') !== params.password) return { statusCode: 400, message: 'Wrong password, please try again.' };
        return { statusCode: 200, message: 'Welcome back.' };
    }

    private async validateLoginParams(params:LoginParams):Promise<ValidateParamsResult> {
        const validation = this.loginValidationSchema.validate(params);
        if(validation.error) return { result: false, message: validation.error.details[0].message };
        return { result: true, message: 'Valid request.' };
    }

    async processRegister(params:RegisterParams):Promise<CustomResponse> {
        const loginParamsResult:ValidateParamsResult = await this.validateRegisterParams(params);
        if (!loginParamsResult.result) return { statusCode: 400, message: loginParamsResult.message };
        if (params.password !== params.repeatpassword) return { statusCode: 400, message: 'Passwords must match.' };

        if (await this.userRepo.getUserByEmail(params.email)) return { statusCode: 400, message: 'Email already in use. Login instead.' };
        if (await this.userRepo.getUserByUsername(params.username)) return { statusCode: 400, message: 'Username taken. Please try another one.' };

        //to do heshiranje passworda
        const response = await this.userRepo.createNewUser(params);
        if (response)  return { statusCode: 200, message: 'You\'ve successfully registered.' };
        return { statusCode: 500, message: 'Something went wrong. Please try again later.' };
    }

    private async validateRegisterParams(params:RegisterParams):Promise<ValidateParamsResult> {
        const validation = this.registerValidationSchema.validate(params);
        if(validation.error) return { result: false, message: validation.error.details[0].message };
        if (params.password !== params.repeatpassword) return { result: false, message: 'Passwords must match.' };
        return { result: true, message: 'Valid request.' };
    }
}

export default UserService;
