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

export interface DocumentAccessResponseDTO {
    document_key: string;
    read_access: boolean;
    write_access: boolean;
}