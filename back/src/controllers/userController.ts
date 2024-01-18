import { Request, Response } from "express";
import UserService from "../services/userService";
import { CustomResponse } from "../config/types";

class UserController{
    private userService: UserService

    constructor(userService:UserService) {
        this.userService = userService;
    }

    public async login(req:Request, res:Response) {
        try {
            const response:CustomResponse = await this.userService.processLogin(req.body);
            return res.status(response.statusCode).json({messsage: response.message});
        } catch (error) {
            console.error('Error while logging in the user:', error);
            return res.status(500).json({messsage: 'Something went wrong. Please try again later.'});
        }
    }

    async register(req:Request, res:Response) {
        try {
            const response:CustomResponse = await this.userService.processRegister(req.body);
            return res.status(response.statusCode).json({messsage: response.message});
        } catch (error) {
            console.error('Error while registering the new user:', error);
            return res.status(500).json({messsage:'Something went wrong. Please try again later.'});
        }
    }
}

export default UserController;
