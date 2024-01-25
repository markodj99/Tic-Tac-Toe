export interface LoginParams {
    email: string;
    password: string
}

export interface ValidateParamsResult {
    result: boolean,
    message: string
}

export interface RegisterParams {
    username: string,
    email: string;
    password: string,
    repeatpassword: string
}

export interface CustomUserRouterResponse {
    statusCode: number,
    message: string
}

export interface CustomSPGameRouterResponse {
    moves: string[],
    computerSymbol: string,
    boardState: string[],
    winner: string
}

export interface NewBoard{
    newBoardState: string[],
    newMoves: string[]
}

export interface GameListData {
    index: number,
    gameId: number,
    creatorName: string,
    creatorSymbol: string,
    yourSymbol: string
}

export interface HasGameResponse {
    condition: boolean,
    gameId: number
}

export interface GameState {
    moves: string[],
    boardState: string[],
    turnToMove: boolean,
    symbol: string,
    player: string,
    canPlay: boolean,
    playerId: number
}

export interface UpdatedGameStatus {
    boardState: string[],
    moves: string[],
    winner: number,
    turnToMove: number
}