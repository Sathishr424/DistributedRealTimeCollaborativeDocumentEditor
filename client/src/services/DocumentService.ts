import APIRequest from "./APIRequest";
import JWTService from "./JWTService";
import {
    DocumentAccessResponseDTO,
    DocumentResponseDTO, DocumentUpdateAccessRequestDTO,
    LoginRequestDTO,
    RegisterRequestDTO,
    UserResponseDTO
} from "../dto/DTOs";

class DocumentService {
    async createDocument(): Promise<DocumentResponseDTO> {
        try {
            return await APIRequest.request("api/document/create", "POST", {});
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getDocumentAccess(document_key: string): Promise<DocumentAccessResponseDTO> {
        try {
            return await APIRequest.request(`api/document/user_access/${document_key}`, "GET", {});
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateDocumentAccess(updateDocumentAccess: DocumentUpdateAccessRequestDTO) {
        console.log(updateDocumentAccess);
        try {
            return await APIRequest.request(`api/document/user_access`, "PUT", updateDocumentAccess);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new DocumentService();