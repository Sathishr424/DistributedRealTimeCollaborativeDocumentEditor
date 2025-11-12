import {AppError} from "../errors/AppError";

export class UserNotExists extends AppError {
    constructor() {
        super("User not exists", 401);
    }
}