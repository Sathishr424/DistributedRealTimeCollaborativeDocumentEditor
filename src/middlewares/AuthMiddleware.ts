import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import {RequestValidation} from "../interfaces/RequestValidation";
import {ValidationErrorException} from "../exceptions/ValidationErrorException";
import {getBearerToken} from "../helpers/helper";
import JWTService from "../services/JWTService";

export function authMiddleware(): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = getBearerToken(req.headers.authorization);
            req.body.userToken = await JWTService.validateAndVerifyToken(token);
            next();
        } catch (error) {
            next(error);
        }
    };
}