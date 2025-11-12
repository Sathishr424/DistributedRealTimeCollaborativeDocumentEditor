import {AppError} from "../errors/AppError";

export class NotAValidToken extends AppError {
    constructor() {
        super("Token not valid", 401);
    }
}