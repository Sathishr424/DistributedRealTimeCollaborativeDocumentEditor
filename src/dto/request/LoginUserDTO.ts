import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import {RequestValidation} from "../../interfaces/RequestValidation";

export class LoginUserDTO implements RequestValidation {
    @IsEmail({}, { message: 'Invalid email format.' })
    @IsNotEmpty({ message: 'Email is required.' })
    public email!: string;

    @IsNotEmpty({ message: 'Password is required.' })
    public password!: string;
}