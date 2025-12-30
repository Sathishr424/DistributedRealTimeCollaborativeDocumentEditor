import {pool} from "../config/database/connection";
import {ServerError} from "../exceptions/ServerError";
import {User} from "../models/User";
import {UserNotExists} from "../exceptions/UserNotExists";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {DocumentResponseDTO} from "../dto/response/DocumentResponseDTO";
import {MyDocument} from "../models/MyDocument";
import {DocumentAccess} from "../models/DocumentAccess";
import {DocumentNotFoundException} from "../exceptions/DocumentNotFoundException";
import {DocumentAccessRequestDTO} from "../dto/request/DocumentAccessRequestDTO";
import {DocumentAccessUpdateDTO} from "../dto/request/DocumentAccessUpdateDTO";

interface Count extends RowDataPacket {
    count: number;
}

class DocumentRepository {
    async createDocument(document_key: string, user_id: number): Promise<MyDocument> {
        try {
            const [result] = await pool.execute<ResultSetHeader>("INSERT INTO documents (`document_key`, `owner`) VALUES (?,?)", [document_key, user_id]);
            const newId = result.insertId;
            return this.getDocumentById(newId);
        } catch (err) {
            throw new ServerError(err);
        }
    }

    async getDocumentById(document_id: number): Promise<MyDocument> {
        try {
            const [rows] = await pool.execute<MyDocument[]>("SELECT * FROM documents WHERE id=?", [document_id]);
            if (rows.length === 0) {
                throw new DocumentNotFoundException();
            }
            return rows[0];
        } catch (err) {
            if (err instanceof DocumentNotFoundException) throw err;
            throw new ServerError(err);
        }
    }

    async getDocument(document_key: string): Promise<MyDocument> {
        try {
            const [rows] = await pool.execute<MyDocument[]>("SELECT * FROM documents WHERE document_key=?", [document_key]);
            if (rows.length === 0) {
                throw new DocumentNotFoundException();
            }
            return rows[0];
        } catch (err) {
            if (err instanceof DocumentNotFoundException) throw err;
            throw new ServerError(err);
        }
    }

    async updateDocumentAccess(user_id: number, documentAccess: DocumentAccessUpdateDTO) {
        try {
            const {document_key, read_access, write_access} = documentAccess;
            await pool.execute<DocumentAccess[]>("UPDATE documents SET is_read_access_public=?, is_write_access_public=? WHERE document_key=? AND owner=?", [read_access, write_access, document_key, user_id]);
            return true;
        } catch (err) {
            throw new ServerError(err);
        }
    }

    async getDocumentUserAccess(document_key: string, user_id: number): Promise<DocumentAccess> {
        try {
            const [rows] = await pool.execute<DocumentAccess[]>("SELECT * FROM documentaccess WHERE document_id IN (SELECT id FROM documents WHERE document_key=?) AND user_id=?", [document_key, user_id]);
            if (rows.length > 0) {
                return rows[0];
            }
            return {
                document_id: -1,
                user_id: user_id,
                read_access: false,
                write_access: false
            } as DocumentAccess;
        } catch (err) {
            throw new ServerError(err);
        }
    }

    async getDocumentUserAccessByDocumentId(document_id: string, user_id: number): Promise<DocumentAccess> {
        try {
            const [rows] = await pool.execute<DocumentAccess[]>("SELECT * FROM documentaccess WHERE document_id=? AND user_id=?", [document_id, user_id]);
            if (rows.length > 0) {
                return rows[0];
            }
            return {
                document_id: -1,
                user_id: user_id,
                read_access: false,
                write_access: false
            } as DocumentAccess;
        } catch (err) {
            throw new ServerError(err);
        }
    }

    async addUserAccessToDocument(documentAccessRequest: DocumentAccessRequestDTO): Promise<DocumentAccess> {
        try {
            const {document_id, user_id, read_access, write_access} = documentAccessRequest;
            const [rows] = await pool.execute<DocumentAccess[]>("INSERT INTO documentaccess (document_id, user_id, read_access, write_access) VALUES (?,?,?,?)", [document_id, user_id, read_access, write_access]);
            return rows[0];
        } catch (err) {
            throw new ServerError(err);
        }
    }
}

export default new DocumentRepository();