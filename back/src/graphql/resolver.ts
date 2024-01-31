import { Request } from 'express';
import { RegistrationResult } from '../types/graphqlTypes';
import UserController from "../controller/userController";
import UserService from "../service/userService";
import UserRepo from "../repo/userRepo";

const userController:UserController = new UserController(new UserService(new UserRepo()));

const resolvers = {
    Query: {
    },
    Mutation: {
      registerUser: async (
        parent: any,
        args: { username: string; email: string; password: string, repeatpassword: string },
        req: Request
      ):Promise<RegistrationResult> => {
        return await userController.register(args.username, args.email, args.password, args.repeatpassword);
      },
      loginUser: async (
        parent: any,
        args: { email: string; password: string },
        req: Request
      ):Promise<RegistrationResult> => {
        return await userController.login(args.email, args.password);
      }
    },
};
  
export { resolvers };