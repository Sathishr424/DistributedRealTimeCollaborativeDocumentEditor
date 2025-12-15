import {hash, compare} from "bcrypt";
import {ServerError} from "../exceptions/ServerError";
import {Request} from "express";
import {TokenNotFound} from "../exceptions/TokenNotFound";
import path from "node:path";


export async function hashPassword(password: string) {
    try {
        return await hash(password, 10);
    } catch (err) {
        throw new ServerError(err);
    }
}

export function documentPath(documentKey: string) {
    return path.join(process.cwd(), process.env.DOCUMENT_PATH as string, documentKey);
}


export async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await compare(password, hashedPassword);
    } catch (err) {
        throw new ServerError(err);
    }
}

export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}