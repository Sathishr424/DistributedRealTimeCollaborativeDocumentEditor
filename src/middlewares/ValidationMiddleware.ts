import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import {RequestValidation} from "../interfaces/RequestValidation";
import {ValidationErrorException} from "../exceptions/ValidationErrorException";

export function validationMiddleware(type: any): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 1. Transform plain JS object (req.body) into an instance of the DTO class
            const dtoInstance = plainToInstance(type, req.body);
            const errors: ValidationError[] = await validate(dtoInstance); // 👈 Use await

            if (errors.length > 0) {
                const message = errors.map((error: ValidationError) => {
                    return Object.values(error.constraints || {})
                }).flat();

                const validationError = new ValidationErrorException(message);

                return next(validationError); // 👈 Correct way to signal an error
            }

            req.body = dtoInstance;
            next();
        } catch (error) {
            next(error);
        }
    };
}