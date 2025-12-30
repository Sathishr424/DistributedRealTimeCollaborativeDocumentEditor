import {AppError} from "../errors/AppError";

export class UserNotTheOwner extends AppError {
    constructor() {
        super("User not the owner, cannot update document", 401);
    }
}