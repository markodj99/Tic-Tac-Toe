import express, { Router } from "express";
import SinglePlayerController from "../controllerstemp/singlePlayerController";
import SinglePlayerService from "../servicestemp/singlePlayerService";
import SinglePlayerRepo from "../repostemp/singlePlayerRepo";
import auth from "../middleware/auth";

const singlePlayerController:SinglePlayerController = new SinglePlayerController(new SinglePlayerService(new SinglePlayerRepo()));
const singlePlayerRouter:Router = express.Router();

singlePlayerRouter.get('/create-or-get', auth,  singlePlayerController.createOrGetGame.bind(singlePlayerController));
singlePlayerRouter.put('/set-symbol', auth,  singlePlayerController.setSymbol.bind(singlePlayerController));
singlePlayerRouter.put('/make-move', auth,  singlePlayerController.makeMove.bind(singlePlayerController));
singlePlayerRouter.get('/get-all-finished', auth,  singlePlayerController.getAllFinished.bind(singlePlayerController));
singlePlayerRouter.get('/get-one-finished/:id', auth, singlePlayerController.getOneFinished.bind(singlePlayerController));

export default singlePlayerRouter;
