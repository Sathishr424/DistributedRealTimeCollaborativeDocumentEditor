import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import {RequestValidation} from "../../interfaces/RequestValidation";

export class LogoutUserDTO implements RequestValidation {
    @IsNotEmpty({ message: 'Token is required.' })
    public token!: string;
}