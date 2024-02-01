import { Request } from 'express';
import { RegistrationResult, SPGameResponse, SinglePlayer } from '../types/graphqlTypes';
import UserController from "../controller/userController";
import UserService from "../service/userService";
import UserRepo from "../repo/userRepo";
import SinglePlayerController from '../controller/singlePlayerController';
import SinglePlayerService from '../service/singlePlayerService';
import SinglePlayerRepo from '../repo/singlePlayerRepo';

const userController:UserController = new UserController(new UserService(new UserRepo()));
const singlePlayerController:SinglePlayerController = new SinglePlayerController(new SinglePlayerService(new SinglePlayerRepo()));

const resolvers = {
    Query: {
      getOrCreateSinglePlayer: async (
        parent: any,
        args: { userId: number },
        context: any
      ): Promise<SinglePlayer> => {
        return await singlePlayerController.createOrGetGame(args.userId);
      }
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
      },
      setSymbol: async (
        parent: any,
        args: { userId:number, computerSymbol: string },
        req: Request
      ):Promise<boolean> => {
        return await singlePlayerController.setSymbol(args.userId, args.computerSymbol);
      },
      makeMove: async (
        parent: any,
        args: { userId:number, updatedBoardState:string[], updatedMoves:string[] },
        req: Request
      ):Promise<SPGameResponse> => {
        return await singlePlayerController.makeMove(args.userId, args.updatedBoardState, args.updatedMoves);
      }
    }
};
  
export { resolvers };