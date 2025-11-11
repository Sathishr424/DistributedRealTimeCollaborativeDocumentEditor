export class EmailExistsException extends Error {
    public readonly statusCode: number = 401;
    public readonly message: string;
    constructor() {
        super();
    }
}