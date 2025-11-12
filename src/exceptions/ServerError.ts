import {AppError} from "../errors/AppError";

export class ServerError extends AppError {
    constructor() {
        super("Server error", 500);
    }
}