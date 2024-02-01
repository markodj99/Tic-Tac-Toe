import SinglePlayerService from "../service/singlePlayerService";
import { SPGameResponse, SinglePlayer } from "../types/graphqlTypes";

class SinglePlayerController{
    private singlePlayerService: SinglePlayerService

    constructor(singlePlayerService:SinglePlayerService) {
        this.singlePlayerService = singlePlayerService;
    }

    async createOrGetGame(userId:number):Promise<SinglePlayer> {
        try {
            return await this.singlePlayerService.createOrGetGame(userId);
        } catch (error) {
            console.error('Error while creating or getting sp game:', error);
            throw new Error('Error while creating or getting sp game.');
        }
    }

    async setSymbol(userId:number, computerSymbol:string):Promise<boolean> {
        try {
            return await this.singlePlayerService.setSymbol(userId, computerSymbol);
        } catch (error) {
            console.error('Error while creating or getting sp game:', error);
            return false;
        }
    }

    async makeMove(userId:number, updatedBoardState:string[], updatedMoves:string[]):Promise<SPGameResponse> {
        try {
            return await this.singlePlayerService.makeMove(userId, updatedBoardState, updatedMoves);
        } catch (error) {
            console.error('Error while making sp game move:', error);
            throw new Error('Error while making sp game move.');
        }
    }
}

export default SinglePlayerController;
