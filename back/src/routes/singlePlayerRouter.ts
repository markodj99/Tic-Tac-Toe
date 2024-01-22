import express, { Router } from "express";
import SinglePlayerController from "../controllers/singlePlayerController";
import SinglePlayerService from "../services/singlePlayerService";
import SinglePlayerRepo from "../repos/singlePlayerRepo";
import auth from "../middleware/auth";

const singlePlayerController:SinglePlayerController = new SinglePlayerController(new SinglePlayerService(new SinglePlayerRepo()));
const singlePlayerRouter:Router = express.Router();

singlePlayerRouter.get('/create-or-get', auth,  singlePlayerController.createOrGetGame.bind(singlePlayerController));
singlePlayerRouter.put('/set-symbol', auth,  singlePlayerController.setSymbol.bind(singlePlayerController));
singlePlayerRouter.put('/make-move', auth,  singlePlayerController.makeMove.bind(singlePlayerController));

export default singlePlayerRouter;
