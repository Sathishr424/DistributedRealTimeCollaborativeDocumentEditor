import {Request} from "express";
import JWTService from "./JWTService";
import DocumentRepository from "../repositories/DocumentRepository";
import {documentPath, generateRandomString, getBearerToken} from "../helpers/helper";
import {DocumentUserAccessResponseDTO} from "../dto/response/DocumentUserAccessResponseDTO";
import {UserTokenDTO} from "../dto/UserTokenDTO";
import {DocumentAccessRequestDTO} from "../dto/request/DocumentAccessRequestDTO";
import {DocumentResponseDTO} from "../dto/response/DocumentResponseDTO";
import * as fs from "node:fs";
import {TokenNotFound} from "../exceptions/TokenNotFound";
import {ServerError} from "../exceptions/ServerError";
import UserRepository from "../repositories/UserRepository";
import {UserNotTheOwner} from "../exceptions/UserNotTheOwner";
import {DocumentAccessUpdateDTO} from "../dto/request/DocumentAccessUpdateDTO";

class DocumentService {
    private repo = DocumentRepository;
    private jwtService = JWTService;
    private userRepo = UserRepository;

    async createDocument(userToken: UserTokenDTO): Promise<DocumentResponseDTO> {
        const document_id = generateRandomString(10);
        const document = await this.repo.createDocument(document_id, userToken.id);
        const documentAccess: DocumentAccessRequestDTO = {document_id: document.id, user_id: userToken.id, read_access: true, write_access: true};
        await this.repo.addUserAccessToDocument(documentAccess);

        fs.writeFileSync(documentPath(document.document_key), "");

        return DocumentResponseDTO.fromDocument(document);
    }
    
    async updateDocumentAccess(userToken: UserTokenDTO, documentAccess: DocumentAccessUpdateDTO) {
        const document = await this.repo.getDocument(documentAccess.document_key);

        if (document.owner !== userToken.id) throw new UserNotTheOwner();
        return await this.repo.updateDocumentAccess(userToken.id, documentAccess);
    }

    async getUserAccess(token: string, document_key: string): Promise<DocumentUserAccessResponseDTO> {
        const userToken = this.jwtService.validateToken(token);
        const document = await this.repo.getDocument(document_key);
        const userAccess = await this.repo.getDocumentUserAccess(document_key, userToken.id);

        return DocumentUserAccessResponseDTO.fromDocumentAndUserAccess(document, userAccess);
    }

    async getUserAccessForAnyone(document_key: string): Promise<DocumentUserAccessResponseDTO> {
        const document = await this.repo.getDocument(document_key);
        return DocumentUserAccessResponseDTO.fromDocument(document);
    }
}

export default new DocumentService();