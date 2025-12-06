import AuthRepository from "../repositories/AuthRepository";
import {UserNotExists} from "../exceptions/UserNotExists";
import {User} from "../models/User";
import JWTService from "./JWTService";
import DocumentRepository from "../repositories/DocumentRepository";
import {generateRandomString} from "../helpers/helper";
import {DocumentUserAccessResponseDTO} from "../dto/response/DocumentUserAccessResponseDTO";
import {MyDocument} from "../models/MyDocument";
import {UserTokenDTO} from "../dto/UserTokenDTO";
import {DocumentAccess} from "../models/DocumentAccess";
import {DocumentAccessRequestDTO} from "../dto/request/DocumentAccessRequestDTO";
import {DocumentResponseDTO} from "../dto/response/DocumentResponseDTO";

class DocumentService {
    private repo = DocumentRepository;
    private jwtService = JWTService;

    async createDocument(userToken: UserTokenDTO): Promise<DocumentResponseDTO> {
        const document_id = generateRandomString(10);
        const document = await this.repo.createDocument(document_id, userToken.id);
        const documentAccess: DocumentAccessRequestDTO = {document_id: document.id, user_id: userToken.id, read_access: true, write_access: true};
        await this.repo.addUserAccessToDocument(documentAccess);
        return DocumentResponseDTO.fromDocument(document);
    }

    async getDocument(document_key: string): Promise<MyDocument> {
        return this.repo.getDocument(document_key);
    }

    async getUserAccess(token: string, document_key: string): Promise<DocumentUserAccessResponseDTO> {
        const userToken = this.jwtService.validateToken(token);
        const document = await this.getDocument(document_key);
        const userAccess = await this.repo.getDocumentUserAccess(document_key, userToken.id);

        return DocumentUserAccessResponseDTO.fromDocumentAndUserAccess(document, userAccess);
    }

    async getUserAccessForAnyone(document_key: string): Promise<DocumentUserAccessResponseDTO> {
        const document = await this.getDocument(document_key);
        return DocumentUserAccessResponseDTO.fromDocument(document);
    }
}

export default new DocumentService();