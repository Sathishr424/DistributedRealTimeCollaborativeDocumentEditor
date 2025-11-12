import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import {RequestValidation} from "../interfaces/RequestValidation";
import {ValidationErrorException} from "../exceptions/ValidationErrorException";

export function validationMiddleware(type: any): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        // 1. Transform plain JS object (req.body) into an instance of the DTO class
        const dtoInstance = plainToInstance(type, req.body);

        // 2. Run validation against the DTO instance
        validate(dtoInstance).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                // 3. Format errors for a clean response
                const message = errors.map((error: ValidationError) => {
                    return Object.values(error.constraints || {})
                }).flat();

                throw new ValidationErrorException(message);

            } else {
                req.body = dtoInstance;
                next();
            }
        });
    };
}