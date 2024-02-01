import MultiPlayerService from "../service/multiPlayerService";
import { GameListData, GameState, HasGameResponse, JoinGameResponse, UpdatedGameStatus } from "../types/graphqlTypes";

class MultiPlayerController{
    private multiPlayerService: MultiPlayerService

    constructor(multiPlayerService:MultiPlayerService) {
        this.multiPlayerService = multiPlayerService;
    }
    
    async hasGame(userId:number):Promise<HasGameResponse> {
        try {
            return await this.multiPlayerService.hasGame(userId);
        } catch (error) {
            console.error('Error while checking user mp game status:', error);
            throw new Error('Error while checking user mp game status.');
        }
    }

    async createNewGame(userId:number, creatorSymbol:string):Promise<HasGameResponse> {
        try {
            return await this.multiPlayerService.createNewGame(userId, creatorSymbol);
        } catch (error) {
            console.error('Error while creating new mp game:', error);
            throw new Error('Error while creating new mp game.');
        }
    }

    async getAllExistingGames():Promise<GameListData[]> {
        try {
            return await this.multiPlayerService.getAllExistingGames();
        } catch (error) {
            console.error('Error while creating or getting sp game:', error);
            return [];
        }
    }

    async joinGame(userId:number, gameId:number):Promise<JoinGameResponse> {
        try {
            return await this.multiPlayerService.joinGame(userId, gameId);
        } catch (error) {
            console.error('Error while joining mp game:', error);
            return {
                condition: false,
                gameId: -1
            };
        }
    }

    async getState(gameId:string):Promise<GameState> {
        try {
            return await this.multiPlayerService.getState(gameId);
        } catch (error) {
            console.error('Error when user tried to get game state:', error);
            throw error;
        }
    }

    async makeMove(gameId: string, userId:number, boardState:string[], moves:string[]):Promise<UpdatedGameStatus> {
        try {
            return await this.multiPlayerService.makeMove(gameId, userId, boardState, moves);
        } catch (error) {
            console.error('Error when user tried to make a move:', error);
            throw error;
        }
    }
}

export default MultiPlayerController;
