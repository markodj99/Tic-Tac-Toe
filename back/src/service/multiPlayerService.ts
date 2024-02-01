import MultiPlayerTTT from "../models/multiPlayerTTT";
import SinglePlayerTTT from "../models/singlePlayerTTT";
import User from "../models/user";
import MultiPlayerRepo from "../repo/multiPlayerRepo";
import { GameListData, GameState, HasGameResponse, JoinGameResponse, UpdatedGameStatus } from "../types/graphqlTypes";

class MultiPlayerService{
    private multiPlayerRepo: MultiPlayerRepo;
    private winningCombos:number[][];

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
    }

    async hasGame(userId:number):Promise<HasGameResponse> {
        const game:MultiPlayerTTT | null = await this.multiPlayerRepo.getOngoingGameByUserId(userId);

        return {
            condition: game !== null,
            gameId: game?.get('id') === undefined ? -1 : game?.get('id') as number
        };
    }

    async createNewGame(userId:number, creatorSymbol:string):Promise<HasGameResponse> {
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

    async joinGame(userId:number, gameId:number):Promise<JoinGameResponse> {
        let game:MultiPlayerTTT | null = await this.multiPlayerRepo.getGameById(gameId);
        const response:MultiPlayerTTT | null = await this.multiPlayerRepo.updateGame(game, {
            id: gameId,
            joinerId: userId
        });
        
        return {
            condition: response !== null,
            gameId: gameId
        };
    }

    async getState(gameId:string):Promise<GameState> {
        const game:MultiPlayerTTT | null = await this.multiPlayerRepo.getGameById(parseInt(gameId, 10));
        let joiner = 'null';
        if ((game?.get('Joiner') as User) !== null) joiner = (game?.get('Joiner') as User).get('username') as string;
        const turnToMoveId = game?.get('turnToMove') === 'creator' ? game?.get('creatorId') as number : game?.get('joinerId') as number;

        return {
            creatorId: game?.get('creatorId') as number,
            joinerId: (game?.get('joinerId') as number) === null ? -1 : (game?.get('joinerId') as number),
            creatorSymbol: game?.get('creatorSymbol') as string,
            joinerSymbol: game?.get('joinerSymbol') as string,
            turnToMove: turnToMoveId,
            moves: game?.get('moves') as string[],
            boardState: game?.get('boardState') as string [],
        };
    }

    async makeMove(gameId: string, userId:number, boardState:string[], moves:string[]):Promise<UpdatedGameStatus> {
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
}

export default MultiPlayerService;
