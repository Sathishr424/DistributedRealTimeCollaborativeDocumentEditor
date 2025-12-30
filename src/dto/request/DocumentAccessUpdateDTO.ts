import {RequestValidation} from "../../interfaces/RequestValidation";
import {IsNotEmpty, IsBoolean} from "class-validator";

export class DocumentAccessUpdateDTO implements RequestValidation {
    @IsNotEmpty({ message: 'document_key is required.' })
    public document_key!: string;

    @IsBoolean({ message: 'read_access must be a boolean.' })
    public read_access!: boolean;

    @IsBoolean({ message: 'write_access must be a boolean.' })
    public write_access!: boolean;
}