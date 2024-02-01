export interface RegistrationResult {
    success: boolean;
    message: string;
}

export interface LoginResult {
    success: boolean;
    message: string;
}

export interface RegisterParams {
    username: string,
    email: string;
    password: string,
    repeatpassword: string
}

export interface ValidateParamsResult {
    result: boolean,
    message: string
}

export interface LoginParams {
    email: string;
    password: string
}

export interface SinglePlayer {
    id?:number,
    playerId?:number
    moves?:string[],
    computerSymbol?:string,
    winner?:string,
    boardState?:string[],
    Player?:User
}

export interface User {
    id?:number,
    username?:string,
    email?:string,
    password?:string,
    SinglePlayerGames?:SinglePlayer[],
    //MultiPlayerCreatedGames: [MultiPlayerTTT]
    //MultiPlayerJoinedGames: [MultiPlayerTTT]
}

export interface SPGameResponse {
    moves: string[],
    computerSymbol: string,
    boardState: string[],
    winner: string
}

export interface NewBoard{
    newBoardState: string[],
    newMoves: string[]
}
