import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import {RequestValidation} from "../interfaces/RequestValidation";
import {ValidationErrorException} from "../exceptions/ValidationErrorException";

export function validationMiddleware(type: any): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dtoInstance = plainToInstance(type, req.body);
            const errors: ValidationError[] = await validate(dtoInstance);

            if (errors.length > 0) {
                const message = errors.map((error: ValidationError) => {
                    return Object.values(error.constraints || {})
                }).flat();

                const validationError = new ValidationErrorException(message);

                return next(validationError);
            }

            req.body = dtoInstance;
            next();
        } catch (error) {
            next(error);
        }
    };
}