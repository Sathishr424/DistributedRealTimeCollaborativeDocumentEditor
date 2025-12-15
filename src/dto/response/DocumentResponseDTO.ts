import {MyDocument} from "../../models/MyDocument";
import fs from "node:fs";
import {documentPath} from "../../helpers/helper";

export class DocumentResponseDTO {
    id!: number;
    document_key!: string;
    is_write_access_public!: boolean;
    is_read_access_public!: boolean;
    data!: string;
    owner!: number;

    public static fromDocument(document: MyDocument): DocumentResponseDTO {
        const dto = new DocumentResponseDTO();
        dto.id = document.id;
        dto.document_key = document.document_key;
        dto.is_write_access_public = document.is_write_access_public;
        dto.is_read_access_public = document.is_read_access_public;
        dto.owner = document.owner;
        dto.data = fs.readFileSync(documentPath(document.document_key), 'utf8') as string;
        return dto;
    }
}