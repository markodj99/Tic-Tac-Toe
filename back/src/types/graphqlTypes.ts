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
    index?:number,
    id?:number,
    playerId?:number
    moves?:string[],
    computerSymbol?:string,
    yourSymbol?: string,
    winner?:string,
    boardState?:string[],
    Player?:UserModel,
    updatedAt?: string
}

export interface MultiPlayer {
    index?:number,
    id?:number,
    creatorId?:number,
    joinerId?:number,
    creatorSymbol?:string,
    joinerSymbol?:string,
    yourSymbol?:string,
    opponentSymbol?:string,
    turnToMove?:string,
    moves?:string[],
    winner?:number,
    winnerString?:string,
    boardState?:string[],
    Creator?:UserModel,
    Joiner?:UserModel,
    updatedAt?: string
}

export interface UserModel {
    id?:number,
    username?:string,
    email?:string,
    password?:string,
    SinglePlayerGames?:SinglePlayer[],
    MultiPlayerCreatedGames?: MultiPlayer[],
    MultiPlayerJoinedGames?: MultiPlayer[]
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

export interface HasGameResponse {
    condition: boolean,
    gameId: number
}

export interface GameListData {
    index: number,
    gameId: number,
    creatorName: string,
    creatorSymbol: string,
    yourSymbol: string
}

export interface JoinGameResponse {
    condition: boolean,
    gameId: number
}

export interface GameState {
    creatorId: number,
    joinerId: number,
    creatorSymbol: string,
    joinerSymbol: string,
    turnToMove: number,
    moves: string[],
    boardState: string[]
}

export interface UpdatedGameStatus {
    boardState: string[],
    moves: string[],
    winner: number,
    turnToMove: number
}
