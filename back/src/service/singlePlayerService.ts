import SinglePlayerRepo from "../repo/singlePlayerRepo";
import SinglePlayerTTT from "../models/singlePlayerTTT";
import { SPGameResponse, SinglePlayer, NewBoard } from "../types/graphqlTypes";

class SinglePlayerService{
    private singlePlayerRepo: SinglePlayerRepo;
    private winningCombos:number[][];

    constructor(singlePlayerRepo:SinglePlayerRepo) {
        this.singlePlayerRepo = singlePlayerRepo;
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

    async createOrGetGame(userId:number):Promise<SinglePlayer> {
        let game:SinglePlayerTTT | null;
        if (await this.singlePlayerRepo.hasOngoingGame(userId)) game = await this.singlePlayerRepo.getOngoingGameByUserId(userId);
        else game = await this.singlePlayerRepo.createNewGame(userId);
        
        return {
            moves: game?.get('moves') as string[],
            computerSymbol: game?.get('computerSymbol') as string,
            boardState: game?.get('boardState') as string[],
            winner: game?.get('winner') as string
        };
    }

    async setSymbol(userId:number, computerSymbol:string):Promise<boolean> {
        let game:SinglePlayerTTT | null = await this.singlePlayerRepo.getOngoingGameByUserId(userId);
        const response:SinglePlayerTTT | null = await this.singlePlayerRepo.updateGame(game, {computerSymbol: computerSymbol});
        
        return response ? true : false;
    }

    async makeMove(userId:number, boardState:string[], moves:string[]):Promise<SPGameResponse> {
        let game:SinglePlayerTTT | null = await this.singlePlayerRepo.getOngoingGameByUserId(userId);
        const computerSymbol:string = game?.get('computerSymbol') as string;

        const winner = this.checkWinner(boardState);
        if (winner !== 'null') return await this.winnerCase(boardState, moves, winner, computerSymbol, game);
        if (this.isDraw(boardState)) return await this.draw(boardState, moves, game);
        return await this.winnerOrDraw(boardState, moves, game, computerSymbol);
    }

    private async winnerCase(boardState:string[], moves:string[], winner:string, computerSymbol:string,
        game:SinglePlayerTTT | null):Promise<SPGameResponse> {

        let actualWinner:string = winner === computerSymbol ? 'computer' : 'user';
        const response:SinglePlayerTTT | null = await this.singlePlayerRepo.updateGame(game, {
            winner: actualWinner,
            boardState: boardState,
            moves: moves
        });
        
        return {
            moves: response?.get('moves') as string[],
            computerSymbol: response?.get('computerSymbol') as string,
            boardState: response?.get('boardState') as string[],
            winner: response?.get('winner') as string
        }
    }

    private async winnerOrDraw(boardState:string[], moves:string[], game:SinglePlayerTTT | null,
        computerSymbol:string):Promise<SPGameResponse> {

        const {newBoardState, newMoves} = this.generateRandomComputerMove(boardState, moves, game?.get('computerSymbol') as string);
        
        const winner = this.checkWinner(newBoardState);
        if (winner !== 'null') this.winnerCase(newBoardState, moves, winner, computerSymbol, game);
        if(this.isDraw(newBoardState)) return await this.draw(newBoardState, newMoves, game);

        const response:SinglePlayerTTT | null = await this.singlePlayerRepo.updateGame(game, {
            boardState: newBoardState,
            moves: newMoves
        });
        
        return {
            moves: response?.get('moves') as string[],
            computerSymbol: response?.get('computerSymbol') as string,
            boardState: response?.get('boardState') as string[],
            winner: response?.get('winner') as string
        }
    }

    private async draw(boardState:string[], moves:string[], game:SinglePlayerTTT | null):Promise<SPGameResponse> {
        const response = await this.singlePlayerRepo.updateGame(game, {
            boardState: boardState,
            moves: moves,
            winner: 'draw'
        });

        return {
            moves: response?.get('moves') as string[],
            computerSymbol: response?.get('computerSymbol') as string,
            boardState: response?.get('boardState') as string[],
            winner: response?.get('winner') as string
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

    private generateRandomComputerMove(boardState:string[], moves:string[], computerSymbol:string):NewBoard {
        const nullIndexes: number[] = boardState.map((value, index) => value === 'null' ? index : -1).filter(index => index !== -1);
        const randomIndex: number = nullIndexes[Math.floor(Math.random() * nullIndexes.length)];
        
        let newBoardState:string[] = boardState.slice();
        newBoardState[randomIndex] = computerSymbol;

        let newMoves:string[] = moves.slice();
        for(let i = 0; i < newMoves.length; i++)
        {
          if(newMoves[i] === 'null') {
            newMoves[i] = `${i + 1}C_${computerSymbol}_${randomIndex}`;
            break;
          }
        }

        return {newBoardState: newBoardState, newMoves: newMoves};
    }

    // async getAllFinished(token:string):Promise<SpGameList[]> {
    //     const userId = this.getUserId(token);
    //     const games:SinglePlayerTTT[] = await this.singlePlayerRepo.getAllFinishedByUserId(userId);
        
    //     const filteredGames:SpGameList[] = games.map((game, index) => {
    //         const userSymbol = game.get('computerSymbol') === 'X' ? 'O' : 'X';

    //         return {
    //           index,
    //           gameId: game.get('id') as number,
    //           winner: game.get('winner') as string,
    //           yourSymbol: userSymbol,
    //           computerSymbol: game.get('computerSymbol') as string,
    //           updatedAt: game.get('updatedAt') as string
    //         };
    //     });
        
    //     return filteredGames;
    // }

    // async getOneFinished(gameId:number):Promise<SpGameDisplayData> {
    //     const game:SinglePlayerTTT | null = await this.singlePlayerRepo.getFinishedGameById(gameId);
        
    //     return {
    //         moves: game?.get('moves') as string[],
    //         computerSymbol: game?.get('computerSymbol') as string,
    //         winner: game?.get('winner') as string
    //     };
    // }
}

export default SinglePlayerService;
