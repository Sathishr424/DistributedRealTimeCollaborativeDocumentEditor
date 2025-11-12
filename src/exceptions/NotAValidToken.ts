import {AppError} from "../errors/AppError";

export class ServerError extends AppError {
    constructor() {
        super("Token not valid", 401);
    }
}