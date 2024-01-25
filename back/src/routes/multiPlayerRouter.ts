import express, { Router } from "express";
import MultiPlayerController from "../controllers/multiPlayerController";
import MultiPlayerService from "../services/multiPlayerService";
import MultiPlayerRepo from "../repos/multiPlayerRepo";
import auth from "../middleware/auth";
import { Socket } from 'socket.io';
import { io } from '../app';
import { GameState, UpdatedGameStatus } from "../config/types";

const multiPlayerController:MultiPlayerController = new MultiPlayerController(new MultiPlayerService(new MultiPlayerRepo()));
const multiPlayerRouter:Router = express.Router();

multiPlayerRouter.get('/has-game', auth,  multiPlayerController.hasGame.bind(multiPlayerController));
multiPlayerRouter.post('/create-new', auth,  multiPlayerController.createNewGame.bind(multiPlayerController));
multiPlayerRouter.get('/get-all-existing-games', auth,  multiPlayerController.getAllExistingGames.bind(multiPlayerController));
multiPlayerRouter.post('/join-game', auth,  multiPlayerController.joinGame.bind(multiPlayerController));

export default multiPlayerRouter;

export function onConnect(socket: Socket) {
    socket.on('joinGame', (gameId: number) => {
        socket.join(gameId.toString());
    });

    socket.on('getState', async (gameId: string, token:string) => {
        const gameState:GameState = await multiPlayerController.getState(gameId, token);
        socket.emit('getStateResponse', gameState);
    });

    socket.on('makeMove', async (gameId: string, token:string, boardState:string[], moves:string[]) => {
        const newGameState:UpdatedGameStatus = await multiPlayerController.makeMove(gameId, token, boardState, moves);
        io.to(gameId).emit('makeMoveResponse', newGameState);
    });

    socket.on('disconnect', () => {
        socket.rooms.forEach((room) => {
            socket.leave(room);
        });
    });
}
