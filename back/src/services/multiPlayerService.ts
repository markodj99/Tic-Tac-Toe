import { GameListData, GameState, HasGameResponse, MpGameDisplayData, MpGameList, UpdatedGameStatus } from "../config/types";
import MultiPlayerTTT from "../models/multiPlayerTTT";
import SinglePlayerTTT from "../models/singlePlayerTTT";
import User from "../models/user";
import MultiPlayerRepo from "../repos/multiPlayerRepo";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

class MultiPlayerService{
    private multiPlayerRepo: MultiPlayerRepo;
    private winningCombos:number[][];
    private privateKey:string;

    constructor(multiPlayerRepo:MultiPlayerRepo) {
        this.multiPlayerRepo = multiPlayerRepo;
        this.winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        dotenv.config();
        this.privateKey = process.env.PRIVATEKEY || 'key';
    }

    async hasGame(token:string):Promise<HasGameResponse> {
        const userId = this.getUserId(token);
        const game:MultiPlayerTTT | null = await this.multiPlayerRepo.getOngoingGameByUserId(userId);

        return {
            condition: game !== null,
            gameId: game?.get('id') as number
        };
    }

    async createNewGame(token:string, creatorSymbol:string):Promise<HasGameResponse> {
        const userId = this.getUserId(token);
        const joinerSymbol = creatorSymbol === 'X' ? 'O' : 'X';
        const game:SinglePlayerTTT = await this.multiPlayerRepo.createNewGame(userId, creatorSymbol, joinerSymbol);

        return {
            condition: game !== null,
            gameId: game?.get('id') as number
        };
    }

    async getAllExistingGames():Promise<GameListData[]> {
        const games:MultiPlayerTTT[] = await this.multiPlayerRepo.getAllExistingGames();
        const filteredGames:GameListData[] = games.map((game, index) => {
            const creator = game.get('Creator') as User;
            return {
              index,
              gameId: game.get('id') as number,
              creatorName: creator.get('username') as string,
              creatorSymbol: game.get('creatorSymbol') as string,
              yourSymbol: game.get('joinerSymbol') as string,
            };
        });
        
        return filteredGames;
    }

    async joinGame(token:string, gameId:number):Promise<boolean> {
        const joinerId = this.getUserId(token);
        let game:MultiPlayerTTT | null = await this.multiPlayerRepo.getGameById(gameId);
        const response:MultiPlayerTTT | null = await this.multiPlayerRepo.updateGame(game, {
            id: gameId,
            joinerId: joinerId
        });
        
        return  response !== null;
    }

    private getUserId(token:string):number {
        const decoded:any = jwt.verify(token, this.privateKey); // sigurno uvek ima id property
        return decoded.id;
    }

    async getState(gameId:string, token:string):Promise<GameState> {
        const userId = this.getUserId(token);
        const game:MultiPlayerTTT | null = await this.multiPlayerRepo.getGameById(parseInt(gameId, 10));

        return {
            moves: game?.get('moves') as string[],
            boardState: game?.get('boardState') as string [],
            turnToMove: (game?.get('turnToMove') === 'creator' && game?.get('creatorId') === userId) ||
                        (game?.get('turnToMove') === 'joiner' && game?.get('joinerId') === userId),
            symbol: game?.get('creatorId') === userId ? game?.get('creatorSymbol') as string : game?.get('joinerSymbol') as string,
            player: game?.get('creatorId') === userId ? 'creator' : 'joiner',
            canPlay: game?.get('joinerId') !== null,
            playerId: userId
        };
    }

    async makeMove(gameId: string, token:string, boardState:string[], moves:string[]):Promise<UpdatedGameStatus> {
        const userId = this.getUserId(token);
        const game:MultiPlayerTTT | null = await this.multiPlayerRepo.getGameById(parseInt(gameId, 10));

        const winner = this.checkWinner(boardState);
        if (winner !== 'null') return await this.winnerCase(game, boardState, moves, userId, winner);
        if (this.isDraw(boardState)) return await this.draw(boardState, moves, game);

        const turnToMove = game?.get('turnToMove') === 'creator' ? 'joiner' : 'creator';
        const updatedGame = await this.multiPlayerRepo.updateGame(game, {
            boardState: boardState,
            moves: moves,
            turnToMove: turnToMove
        });
        const turnToMoveId = game?.get('turnToMove') === 'creator' ? updatedGame?.get('creatorId') as number : updatedGame?.get('joinerId') as number;

        return {
            boardState: boardState,
            moves: moves,
            winner: -1,
            turnToMove: turnToMoveId
        }
    }

    private async winnerCase(game:MultiPlayerTTT | null, boardState:string[], moves:string[], userId:number, winner:string):Promise<UpdatedGameStatus> {
        const actualWinner = winner === game?.get('creatorSymbol') ? game?.get('creatorId') as number : game?.get('joinerId') as number;
        const updatedGame:MultiPlayerTTT | null = await this.multiPlayerRepo.updateGame(game, {
            winner: actualWinner,
            boardState: boardState,
            moves: moves
        });

        game?.get('creatorId') as number;
        game?.get('joinerId') as number;

        return {
            boardState: boardState,
            moves: moves,
            winner: actualWinner,
            turnToMove: -1
        }
    }

    private async draw(boardState:string[], moves:string[], game:MultiPlayerTTT | null):Promise<UpdatedGameStatus> {
        const _ = await this.multiPlayerRepo.updateGame(game, {
            boardState: boardState,
            moves: moves,
            winner: 0
        });

        return {
            boardState: boardState,
            moves: moves,
            winner: 0,
            turnToMove: -1
        };
    }

    private checkWinner(boardState:string[]):string {
        for (let combo of this.winningCombos) {
            const [a, b, c] = combo;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) return boardState[a];
        }
        return 'null';
    }

    private isDraw(boardState:string[]){
        for (let i = 0; i < boardState.length; i++) if (boardState[i] === 'null') return false;
        return true;
    }

    async getAllFinished(token:string):Promise<MpGameList[]> {
        const userId = this.getUserId(token);
        const games:SinglePlayerTTT[] = await this.multiPlayerRepo.getAllFinishedByUserId(userId);

        const filteredGames:MpGameList[] = games.map((game, index) => {
            const creator = (game.get('Creator') as User).get('username') as string;
            const joiner = (game.get('Joiner') as User).get('username') as string;
            const joinerId = game.get('joinerId');

            let winner = '';
            const winnerDb = game.get('winner') as number;
            if (winnerDb === 0) winner = 'Draw';
            else if (winnerDb === userId) winner = 'You';
            else {
                if (joinerId === userId) winner = creator;
                else winner = joiner;
            }

            const yourSymboll:string = joinerId === userId ? game.get('joinerSymbol') as string : game.get('creatorSymbol') as string;
            const opponentSymboll:string = joinerId === userId ? game.get('creatorSymbol') as string : game.get('joinerSymbol') as string;

            const opponent = joinerId === userId ? creator : joiner;

            return {
              index,
              gameId: game.get('id') as number,
              winner: winner,
              yourSymbol: yourSymboll,
              opponentSymbol: opponentSymboll,
              opponent: opponent,
              updatedAt: game.get('updatedAt') as string
            };
        });
        
        return filteredGames;
    }

    async getOneFinished(gameId:number, token:string):Promise<MpGameDisplayData> {
        const userId = this.getUserId(token);
        const game:SinglePlayerTTT | null = await this.multiPlayerRepo.getFinishedGameById(gameId);
        
        const creator = (game?.get('Creator') as User).get('username') as string;
        const joiner = (game?.get('Joiner') as User).get('username') as string;
        const joinerId = game?.get('joinerId');

        let winner = '';
        const winnerDb = game?.get('winner') as number;
        if (winnerDb === 0) winner = 'draw';
        else if (winnerDb === userId) winner = 'you';
        else {
            if (joinerId === userId) winner = creator;
            else winner = joiner;
        }

        const yourSymboll:string = joinerId === userId ? game?.get('joinerSymbol') as string : game?.get('creatorSymbol') as string;
        const opponentSymboll:string = joinerId === userId ? game?.get('creatorSymbol') as string : game?.get('joinerSymbol') as string;

        const opponent = joinerId === userId ? creator : joiner;

        return {
            moves: game?.get('moves') as string[],
            winner: winner,
            yourSymbol: yourSymboll,
            opponentSymbol: opponentSymboll,
            opponent: opponent
        };
    }
}

export default MultiPlayerService;
