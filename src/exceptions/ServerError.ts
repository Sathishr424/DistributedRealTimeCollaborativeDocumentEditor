import {AppError} from "../errors/AppError";

export class ServerError extends AppError {
    constructor(err: any) {
        super("Server error", 500);
    }
}