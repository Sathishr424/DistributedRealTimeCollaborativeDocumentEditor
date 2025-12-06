import {AppError} from "../errors/AppError";

export class ServerError extends AppError {
    constructor(err: any) {
        console.log(err);
        super("Server error", 500);
    }
}