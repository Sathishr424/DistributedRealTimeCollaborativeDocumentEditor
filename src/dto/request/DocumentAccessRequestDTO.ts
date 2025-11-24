import { RowDataPacket } from "mysql2";

export interface DocumentAccessRequestDTO {
    document_id: number;
    user_id: number;
    read_access: boolean;
    write_access: boolean;
}