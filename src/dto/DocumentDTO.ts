import {MyDocument} from "../models/MyDocument";

export class DocumentDTO {
    id!: number;
    owner!: number;
    read_access!: boolean;
    write_access!: boolean;

    public static fromDocument(document: MyDocument) {
        const dto = new DocumentDTO();
        dto.id = document.id;
        dto.owner = document.owner;
        dto.read_access = Boolean(document.is_read_access_public);
        dto.write_access = Boolean(document.is_write_access_public);
        return dto;
    }
}