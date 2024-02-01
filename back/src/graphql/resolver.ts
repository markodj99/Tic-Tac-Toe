import { Request } from 'express';
import { GameListData, GameState, HasGameResponse, JoinGameResponse, RegistrationResult, SPGameResponse, SinglePlayer, UpdatedGameStatus, UserModel } from '../types/graphqlTypes';
import UserController from "../controller/userController";
import UserService from "../service/userService";
import UserRepo from "../repo/userRepo";
import SinglePlayerController from '../controller/singlePlayerController';
import SinglePlayerService from '../service/singlePlayerService';
import SinglePlayerRepo from '../repo/singlePlayerRepo';
import MultiPlayerController from "../controller/multiPlayerController";
import MultiPlayerService from "../service/multiPlayerService";
import MultiPlayerRepo from "../repo/multiPlayerRepo";
import { Socket } from 'socket.io';
import { io } from '../app';

const userController:UserController = new UserController(new UserService(new UserRepo()));
const singlePlayerController:SinglePlayerController = new SinglePlayerController(new SinglePlayerService(new SinglePlayerRepo()));
const multiPlayerController:MultiPlayerController = new MultiPlayerController(new MultiPlayerService(new MultiPlayerRepo()));

const resolvers = {
    Query: {
      getUser: async (
        parent: any,
        args: { userId: number },
        context: any
      ): Promise<UserModel> => {
        return await userController.getFinishedGames(args.userId);
      },
      getOrCreateSinglePlayer: async (
        parent: any,
        args: { userId: number },
        context: any
      ): Promise<SinglePlayer> => {
        return await singlePlayerController.createOrGetGame(args.userId);
      },
      hasGame: async (
        parent: any,
        args: { userId: number },
        context: any
      ): Promise<HasGameResponse> => {
        return await multiPlayerController.hasGame(args.userId);
      },
      getExistingGames: async (
        parent: any,
        context: any
      ): Promise<GameListData[]> => {
        return await multiPlayerController.getAllExistingGames();
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
      },
      createNewGame: async (
        parent: any,
        args: { userId:number, creatorSymbol: string },
        req: Request
      ):Promise<HasGameResponse> => {
        return await multiPlayerController.createNewGame(args.userId, args.creatorSymbol);
      },
      joinGame: async (
        parent: any,
        args: { userId:number, gameId: number },
        req: Request
      ):Promise<JoinGameResponse> => {
        return await multiPlayerController.joinGame(args.userId, args.gameId);
      }
    }
};

export function onConnect(socket: Socket) {
  try {
      socket.on('joinGame', (gameId: number) => {
          socket.join(gameId.toString());
      });
  } catch (error) {
      console.error('Error when user tried to join the game:', error);
  }

  try {
      socket.on('getState', async (gameId: string) => {
          const gameState:GameState = await multiPlayerController.getState(gameId);
          io.to(gameId).emit('getStateResponse', gameState);
      });
  } catch (error) {
      console.error('Error when user tried to get game state:', error);
  }

  try {
      socket.on('makeMove', async (gameId: string, userId:number, boardState:string[], moves:string[]) => {
          const newGameState:UpdatedGameStatus = await multiPlayerController.makeMove(gameId, userId, boardState, moves);
          io.to(gameId).emit('makeMoveResponse', newGameState);
      });
  } catch (error) {
      console.error('Error when user tried to make a move:', error);
  }

  try {
      socket.on('disconnect', () => {
          socket.rooms.forEach((room) => {
              socket.leave(room);
          });
      });
  } catch (error) {
      console.error('Error when user tried to disconnect game:', error);
  }
}

export { resolvers };