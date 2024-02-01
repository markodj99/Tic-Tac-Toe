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

    // async getAllFinished(req:Request, res:Response) {
    //     try {
    //         const token:string = req.headers['authorization'] === undefined ? 'no-token' : req.headers['authorization'];
    //         const response:SpGameList[] = await this.singlePlayerService.getAllFinished(token);
    //         return res.status(200).json({data: response});
    //     } catch (error) {
    //         console.error('Error while getting all finished sp games:', error);
    //         return res.status(500).json({message: 'Something went wrong. Please try again later.'});
    //     }
    // }
    
    // async getOneFinished(req:Request, res:Response) {
    //     try {
    //         const response:SpGameDisplayData = await this.singlePlayerService.getOneFinished(parseInt(req.params.id, 10));
    //         return res.status(200).json(response);
    //     } catch (error) {
    //         console.error('Error while getting finished sp games', error);
    //         return res.status(500).json({message: 'Something went wrong. Please try again later.'});
    //     }
    // }
}

export default SinglePlayerController;
