import { Request, Response } from "express";
import MultiPlayerService from "../services/multiPlayerService";
import { GameListData, GameState, HasGameResponse, UpdatedGameStatus } from "../config/types";

class MultiPlayerController{
    private multiPlayerService: MultiPlayerService

    constructor(multiPlayerService:MultiPlayerService) {
        this.multiPlayerService = multiPlayerService;
    }
    
    async hasGame(req:Request, res:Response) {
        try {
            const token:string = req.headers['authorization'] === undefined ? 'no-token' : req.headers['authorization'];
            const response:HasGameResponse = await this.multiPlayerService.hasGame(token);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error while creating or getting sp game:', error);
            return res.status(500).json({message: 'Something went wrong. Please try again later.'});
        }
    }

    async createNewGame(req:Request, res:Response) {
        try {
            const token:string = req.headers['authorization'] === undefined ? 'no-token' : req.headers['authorization'];
            const response:HasGameResponse = await this.multiPlayerService.createNewGame(token, req.body.creatorSymbol);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error while creating or getting sp game:', error);
            return res.status(500).json({message: 'Something went wrong. Please try again later.'});
        }
    }

    async getAllExistingGames(req:Request, res:Response) {
        try {
            const response:GameListData[] = await this.multiPlayerService.getAllExistingGames();
            return res.status(200).json({data: response});
        } catch (error) {
            console.error('Error while creating or getting sp game:', error);
            return res.status(500).json({message: 'Something went wrong. Please try again later.'});
        }
    }

    async joinGame(req:Request, res:Response) {
        try {
            const token:string = req.headers['authorization'] === undefined ? 'no-token' : req.headers['authorization'];
            const response:boolean = await this.multiPlayerService.joinGame(token, req.body.gameId);
            return res.status(200).json({gameJoined: response});
        } catch (error) {
            console.error('Error while creating or getting sp game:', error);
            return res.status(500).json({message: 'Something went wrong. Please try again later.'});
        }
    }

    async getState(gameId:string, token:string):Promise<GameState> {
        return await this.multiPlayerService.getState(gameId, token);
    }

    async makeMove(gameId: string, token:string, boardState:string[], moves:string[]):Promise<UpdatedGameStatus> {
        return await this.multiPlayerService.makeMove(gameId, token, boardState, moves);
    }
}

export default MultiPlayerController;
