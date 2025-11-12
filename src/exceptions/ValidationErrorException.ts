import {AppError} from "../errors/AppError";

export class ValidationErrorException extends AppError {
    constructor(errors: string[]) {
        super(errors.join(", "), 400);
    }
}