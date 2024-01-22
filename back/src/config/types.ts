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
