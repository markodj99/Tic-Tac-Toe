import { Request } from 'express';
import { AuthContext, Context, GameListData, GameState, HasGameResponse, JoinGameResponse, RegistrationResult, SPGameResponse, SinglePlayer, UpdatedGameStatus, UserModel } from '../types/graphqlTypes';
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
import { GraphQLError } from 'graphql';
import { ApolloError } from 'apollo-server-express';

const userController:UserController = new UserController(new UserService(new UserRepo()));
const singlePlayerController:SinglePlayerController = new SinglePlayerController(new SinglePlayerService(new SinglePlayerRepo()));
const multiPlayerController:MultiPlayerController = new MultiPlayerController(new MultiPlayerService(new MultiPlayerRepo()));

interface ResolverContext extends Context, AuthContext {}

const resolvers = {
    Query: {
      getUser: async (
        parent:any,
        args: { userId: number },
        context: ResolverContext,
        info: any
      ): Promise<UserModel> => {
        if (context.token) return await userController.getFinishedGames(args.userId);
        throw new ApolloError('You are not authenticated to access this data.', 'UNAUTHENTICATED');
      },
      getOrCreateSinglePlayer: async (
        parent: any,
        args: { userId: number },
        context: ResolverContext,
        info: any
      ): Promise<SinglePlayer> => {
        if (context.token) return await singlePlayerController.createOrGetGame(args.userId);
        throw new ApolloError('You are not authenticated to access this data.', 'UNAUTHENTICATED');
      },
      hasGame: async (
        parent: any,
        args: { userId: number },
        context: ResolverContext,
        info: any
      ): Promise<HasGameResponse> => {
        if (context.token) return await multiPlayerController.hasGame(args.userId);
        throw new ApolloError('You are not authenticated to access this data.', 'UNAUTHENTICATED');
      },
      getExistingGames: async (
        parent: any,
        args: any,
        context: ResolverContext,
        info: any
      ): Promise<GameListData[]> => {
        if (context.token) return await multiPlayerController.getAllExistingGames();
        throw new ApolloError('You are not authenticated to access this data.', 'UNAUTHENTICATED');
      }
    },
    Mutation: {
      registerUser: async (
        parent: any,
        args: { username: string; email: string; password: string, repeatpassword: string },
        context: ResolverContext,
        info: any
      ):Promise<RegistrationResult> => {
        return await userController.register(args.username, args.email, args.password, args.repeatpassword);
      },
      loginUser: async (
        parent: any,
        args: { email: string; password: string },
        context: ResolverContext,
        info: any
      ):Promise<RegistrationResult> => {
        return await userController.login(args.email, args.password);
      },
      setSymbol: async (
        parent: any,
        args: { userId:number, computerSymbol: string },
        context: ResolverContext,
        info: any
      ):Promise<boolean> => {
        if (context.token) return await singlePlayerController.setSymbol(args.userId, args.computerSymbol);
        throw new ApolloError('You are not authenticated to access this data.', 'UNAUTHENTICATED');
      },
      makeMove: async (
        parent: any,
        args: { userId:number, updatedBoardState:string[], updatedMoves:string[] },
        context: ResolverContext,
        info: any
      ):Promise<SPGameResponse> => {
        if (context.token) return await singlePlayerController.makeMove(args.userId, args.updatedBoardState, args.updatedMoves);
        throw new ApolloError('You are not authenticated to access this data.', 'UNAUTHENTICATED');
      },
      createNewGame: async (
        parent: any,
        args: { userId:number, creatorSymbol: string },
        context: ResolverContext,
        info: any
      ):Promise<HasGameResponse> => {
        if (context.token) return await multiPlayerController.createNewGame(args.userId, args.creatorSymbol);
        throw new ApolloError('You are not authenticated to access this data.', 'UNAUTHENTICATED');
      },
      joinGame: async (
        parent: any,
        args: { userId:number, gameId: number },
        context: ResolverContext,
        info: any
      ):Promise<JoinGameResponse> => {
        if (context.token) return await multiPlayerController.joinGame(args.userId, args.gameId);
        throw new ApolloError('You are not authenticated to access this data.', 'UNAUTHENTICATED');
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
