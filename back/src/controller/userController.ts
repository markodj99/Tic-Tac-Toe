import UserService from "../service/userService";
import { LoginResult, RegistrationResult, UserModel } from "../types/graphqlTypes";

class UserController{
    private userService: UserService

    constructor(userService:UserService) {
        this.userService = userService;
    }

    async login(email:string, password:string):Promise<LoginResult> {
        try {
            return await this.userService.processLogin({email, password});
        } catch (error) {
            console.error('Error while logging in the user:', error);
            return {
                success: false,
                message:'Something went wrong. Please try again later.'
            };
        }
    }

    async register(username:string, email:string, password:string, repeatpassword:string):Promise<RegistrationResult> {
        try {
            return await this.userService.processRegister({username, email, password, repeatpassword});
        } catch (error) {
            console.error('Error while registering the new user:', error);
            return {
                success: false,
                message:'Something went wrong. Please try again later.'
            };
        }
    }

    async getFinishedGames(userId:number):Promise<UserModel> {
        try {
            return await this.userService.getFinishedGames(userId);
        } catch (error) {
            console.error('Error while getting finished games:', error);
            throw new Error('Error while getting finished games.');
        }
    }
}

export default UserController;
