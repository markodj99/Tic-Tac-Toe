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

export interface CustomResponse {
    statusCode: number,
    message: string
}
