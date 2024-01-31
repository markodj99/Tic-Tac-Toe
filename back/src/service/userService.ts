import Joi from "joi";
import User from "../models/user";
import UserRepo from "../repo/userRepo";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { LoginParams, LoginResult, RegisterParams, RegistrationResult, ValidateParamsResult } from "../types/graphqlTypes";

class UserService{
    private userRepo: UserRepo;
    private loginValidationSchema;
    private registerValidationSchema;
    private saltNum:number;
    private privateKey:string;
    private expiresIn:string;

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

        dotenv.config();
        this.saltNum = process.env.SALT ? parseInt(process.env.SALT, 10) : 10;
        this.privateKey = process.env.PRIVATE_KEY || 'key';
        this.expiresIn = process.env.EXPIRES_IN || '1h';
    }

    async processLogin(params:LoginParams):Promise<LoginResult> {
        const loginParamsResult:ValidateParamsResult = await this.validateLoginParams(params);
        if (!loginParamsResult.result) return { success: false, message: loginParamsResult.message };

        const user:User | null = await this.userRepo.getUserByEmail(params.email);
        if (!user) return { success: false, message: 'Wrong email or password, please try again.' };

        const passwordsMatch:boolean = await bcrypt.compare(params.password, user.getDataValue('password'));
        if (!passwordsMatch)  return { success: false, message: 'Wrong password or password, please try again.' };
        return { success: true, message: this.generateJWT(user.getDataValue('id'), user.getDataValue('username')) };
    }

    private async validateLoginParams(params:LoginParams):Promise<ValidateParamsResult> {
        const validation = this.loginValidationSchema.validate(params);
        if(validation.error) return { result: false, message: validation.error.details[0].message };
        return { result: true, message: 'Valid request.' };
    }

    private generateJWT(id:number, username:string):string {
        return jwt.sign({
            id: id,
            username: username
        },
        this.privateKey, {
            expiresIn: this.expiresIn
        });
    }

    async processRegister(params:RegisterParams):Promise<RegistrationResult> {
        const loginParamsResult:ValidateParamsResult = await this.validateRegisterParams(params);
        if (!loginParamsResult.result) return { success: false, message: loginParamsResult.message };
        if (params.password !== params.repeatpassword) return { success: false, message: 'Passwords must match.' };

        if (await this.userRepo.getUserByEmail(params.email)) return { success: false, message: 'Email already in use. Login instead.' };
        if (await this.userRepo.getUserByUsername(params.username)) return { success: false, message: 'Username taken. Please try another one.' };

        params.password = await this.createHashedPassword(params.password);
        const response = await this.userRepo.createNewUser(params);
        if (response)  return { success: true, message: 'You\'ve successfully registered. Proceed to login page.' };
        return { success: false, message: 'Something went wrong. Please try again later.' };
    }

    private async createHashedPassword(password:string):Promise<string> {
        const salt:string = await bcrypt.genSalt(this.saltNum);
        return await bcrypt.hash(password, salt);
    }

    private async validateRegisterParams(params:RegisterParams):Promise<ValidateParamsResult> {
        const validation = this.registerValidationSchema.validate(params);
        if(validation.error) return { result: false, message: validation.error.details[0].message };
        if (params.password !== params.repeatpassword) return { result: false, message: 'Passwords must match.' };
        return { result: true, message: 'Valid request.' };
    }
}

export default UserService;
