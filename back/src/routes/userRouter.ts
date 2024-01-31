import express, { Router } from "express";
import UserController from "../controller/userController";
import UserService from "../servicestemp/userService";
import UserRepo from "../repostemp/userRepo";

const userController:UserController = new UserController(new UserService(new UserRepo()));
const userRouter:Router = express.Router();

userRouter.post('/login', userController.login.bind(userController));
userRouter.post('/register', userController.register.bind(userController));

export default userRouter;
