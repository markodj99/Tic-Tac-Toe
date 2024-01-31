import UserService from "../service/userService";
import { RegistrationResult } from "../types/graphqlTypes";

class UserController{
    private userService: UserService

    constructor(userService:UserService) {
        this.userService = userService;
    }

    // async login(req:Request, res:Response) {
    //     try {
    //         const response:CustomUserRouterResponse = await this.userService.processLogin(req.body);
    //         return res.status(response.statusCode).json({message: response.message});
    //     } catch (error) {
    //         console.error('Error while logging in the user:', error);
    //         return res.status(500).json({message: 'Something went wrong. Please try again later.'});
    //     }
    // }

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
}

export default UserController;
