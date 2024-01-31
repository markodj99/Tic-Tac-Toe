import { Request } from 'express';
import { RegistrationResult } from '../types/graphqlTypes';

import UserController from "../controller/userController";
import UserService from "../service/userService";
import UserRepo from "../repo/userRepo";
const userController:UserController = new UserController(new UserService(new UserRepo()));


const users = [
    { id: '1', username: 'john_doe', email: 'john@example.com' },
    { id: '2', username: 'jane_doe', email: 'jane@example.com' },
  ];
  


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
      }
    },
};
  
export { resolvers };