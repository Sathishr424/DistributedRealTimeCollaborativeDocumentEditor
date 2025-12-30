export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface RegisterRequestDTO {
    email: string;
    username: string;
    password: string;
}

export interface RegisterRequestDTO {
    email: string;
    username: string;
    password: string;
}

export interface UserResponseDTO {
    email: string;
    username: string;
    id: number;
}

export interface DocumentResponseDTO {
    id: number;
    document_key: string;
    is_write_access_public: boolean;
    is_read_access_public: boolean;
    owner: number;
}

export interface DocumentDTO {
    id: number;
    owner: number;
    document_key: string;
    read_access: boolean;
    write_access: boolean;
}

export interface DocumentAccessResponseDTO {
    document: DocumentDTO
    document_key: string;
    read_access: boolean;
    write_access: boolean;
}

export interface DocumentUpdateAccessRequestDTO {
    document_key: string;
    read_access: boolean;
    write_access: boolean;
}