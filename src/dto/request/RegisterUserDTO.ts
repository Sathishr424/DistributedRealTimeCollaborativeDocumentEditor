import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import {RequestValidation} from "../../interfaces/RequestValidation";

export class RegisterUserDTO implements RequestValidation {
    @IsEmail({}, { message: 'Invalid email format.' })
    @IsNotEmpty({ message: 'Email is required.' })
    public email!: string;

    @IsNotEmpty({ message: 'Username is required.' })
    @MinLength(3, { message: 'Username must be at least 3 characters.' })
    @MaxLength(20, { message: 'Username cannot exceed 20 characters.' })
    public username!: string;

    @IsNotEmpty({ message: 'Password is required.' })
    @MinLength(4, { message: 'Password must be at least 4 characters.' })
    public password!: string;
}