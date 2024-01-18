import express, { Router } from "express";
import UserController from "../controllers/userController";
import UserService from "../services/userService";
import UserRepo from "../repos/userRepo";


const userController:UserController = new UserController(new UserService(new UserRepo()));
const userRouter:Router = express.Router();

userRouter.post('/login', userController.login.bind(userController));
userRouter.post('/register', userController.register.bind(userController));

export default userRouter;
