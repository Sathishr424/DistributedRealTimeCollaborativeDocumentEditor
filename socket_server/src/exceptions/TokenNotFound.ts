import {AppError} from "../errors/AppError";

export class TokenNotFound extends AppError {
    constructor() {
        super("Token not found", 401);
    }
}