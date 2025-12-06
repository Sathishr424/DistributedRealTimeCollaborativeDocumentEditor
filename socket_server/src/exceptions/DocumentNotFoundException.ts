import {AppError} from "../errors/AppError";

export class DocumentNotFoundException extends AppError {
    constructor() {
        super("Document not found", 404);
    }
}