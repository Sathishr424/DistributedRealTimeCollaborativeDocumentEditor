
import {RequestValidation} from "../../interfaces/RequestValidation";
import {IsNotEmpty} from "class-validator";

export class RequestUserTokenDTO implements RequestValidation {
    @IsNotEmpty({ message: 'Token is required.' })
    public token!: string;
}