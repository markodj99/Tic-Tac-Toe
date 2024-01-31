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
