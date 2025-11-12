import {hash, compare} from "bcrypt";
import {ServerError} from "../exceptions/ServerError";
import {Request} from "express";
import {TokenNotFound} from "../exceptions/TokenNotFound";


export async function hashPassword(password: string) {
    try {
        return await hash(password, 10);
    } catch (err) {
        throw new ServerError(err);
    }
}

export async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await compare(password, hashedPassword);
    } catch (err) {
        throw new ServerError(err);
    }
}

export function getBearerToken(req: Request): string {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    throw new TokenNotFound();
}