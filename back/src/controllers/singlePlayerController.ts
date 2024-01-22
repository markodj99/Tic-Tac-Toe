import { Request, Response } from "express";
import SinglePlayerService from "../services/singlePlayerService";
import { CustomSPGameRouterResponse } from "../config/types";

class SinglePlayerController{
    private singlePlayerService: SinglePlayerService

    constructor(singlePlayerService:SinglePlayerService) {
        this.singlePlayerService = singlePlayerService;
    }

    async createOrGetGame(req:Request, res:Response) {
        try {
            const token:string = req.headers['authorization'] === undefined ? 'no-token' : req.headers['authorization'];
            const response:CustomSPGameRouterResponse = await this.singlePlayerService.createOrGetGame(token);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error while creating or getting sp game:', error);
            return res.status(500).json({message: 'Something went wrong. Please try again later.'});
        }
    }

    async setSymbol(req:Request, res:Response) {
        try {
            const token:string = req.headers['authorization'] === undefined ? 'no-token' : req.headers['authorization'];
            const response:number = await this.singlePlayerService.setSymbol(token, req.body.computerSymbol);
            return res.status(response).json({message: response ? 'Good' : 'Bad'});
        } catch (error) {
            console.error('Error while creating or getting sp game:', error);
            return res.status(500).json({message: 'Something went wrong. Please try again later.'});
        }
    }

    async makeMove(req:Request, res:Response) {
        try {
            const token:string = req.headers['authorization'] === undefined ? 'no-token' : req.headers['authorization'];
            const response:CustomSPGameRouterResponse = await this.singlePlayerService.makeMove(token, req.body.boardState, req.body.moves);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error while creating or getting sp game:', error);
            return res.status(500).json({message: 'Something went wrong. Please try again later.'});
        }
    }
}

export default SinglePlayerController;
