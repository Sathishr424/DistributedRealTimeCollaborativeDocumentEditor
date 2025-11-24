import {MyDocument} from "../../models/MyDocument";
import {DocumentAccess} from "../../models/DocumentAccess";

export class DocumentUserAccessResponseDTO {
    document_key!: string;
    read_access!: boolean;
    write_access!: boolean;

    public static fromDocumentAndUserAccess(document: MyDocument, documentAccess: DocumentAccess): DocumentUserAccessResponseDTO {
        const dto = new DocumentUserAccessResponseDTO();
        dto.document_key = document.document_key;
        dto.read_access = document.is_read_access_public || documentAccess.read_access;
        dto.write_access = document.is_write_access_public || documentAccess.write_access;
        return dto;
    }

    public static fromDocument(document: MyDocument): DocumentUserAccessResponseDTO {
        const dto = new DocumentUserAccessResponseDTO();
        dto.document_key = document.document_key;
        dto.read_access = document.is_read_access_public;
        dto.write_access = document.is_write_access_public;
        return dto;
    }
}