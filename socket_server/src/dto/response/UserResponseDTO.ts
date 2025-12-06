import {User} from "../../models/User";

export class UserResponseDTO {
    id!: number;
    email!: string;
    username!: string;

    public static fromUser(user: User): UserResponseDTO {
        const dto = new UserResponseDTO();
        dto.id = user.id;
        dto.username = user.username;
        dto.email = user.email;
        return dto;
    }
}