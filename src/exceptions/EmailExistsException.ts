import {AppError} from "../errors/AppError";

export class EmailExistsException extends AppError {
    constructor() {
        super("Email already in use", 409);
    }
}