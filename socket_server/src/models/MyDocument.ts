import { RowDataPacket } from "mysql2";

export interface MyDocument extends RowDataPacket {
    id: number;
    document_key: string;
    is_write_access_public: boolean;
    is_read_access_public: boolean;
    owner: number;
}