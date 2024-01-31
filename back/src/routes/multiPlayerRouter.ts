import express, { Router } from "express";
import MultiPlayerController from "../controllerstemp/multiPlayerController";
import MultiPlayerService from "../servicestemp/multiPlayerService";
import MultiPlayerRepo from "../repostemp/multiPlayerRepo";
import auth from "../middleware/auth";
import { Socket } from 'socket.io';
import { io } from '../app';
import { GameState, UpdatedGameStatus } from "../types/types";

const multiPlayerController:MultiPlayerController = new MultiPlayerController(new MultiPlayerService(new MultiPlayerRepo()));
const multiPlayerRouter:Router = express.Router();

multiPlayerRouter.get('/has-game', auth,  multiPlayerController.hasGame.bind(multiPlayerController));
multiPlayerRouter.post('/create-new', auth,  multiPlayerController.createNewGame.bind(multiPlayerController));
multiPlayerRouter.get('/get-all-existing-games', auth,  multiPlayerController.getAllExistingGames.bind(multiPlayerController));
multiPlayerRouter.post('/join-game', auth,  multiPlayerController.joinGame.bind(multiPlayerController));
multiPlayerRouter.get('/get-all-finished', auth,  multiPlayerController.getAllFinished.bind(multiPlayerController));
multiPlayerRouter.get('/get-one-finished/:id', auth,  multiPlayerController.getOneFinished.bind(multiPlayerController));

export default multiPlayerRouter;

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
