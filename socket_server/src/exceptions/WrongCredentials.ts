import {AppError} from "../errors/AppError";

export class WrongCredentials extends AppError {
    constructor() {
        super("Wrong credentials", 401);
    }
}