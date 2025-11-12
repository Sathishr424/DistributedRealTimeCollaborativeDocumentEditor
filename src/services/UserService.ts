import AuthRepository from "../repositories/AuthRepository";
import {UserNotExists} from "../exceptions/UserNotExists";
import {User} from "../models/User";
import JWTService from "./JWTService";
import {UserResponseDTO} from "../dto/response/UserResponseDTO";
import UserRepository from "../repositories/UserRepository";

class UserService {
    private repo = UserRepository;
    private jwtService = JWTService;

    async getUser(token: string): Promise<UserResponseDTO> {
        const userTokenDTO = this.jwtService.validateToken(token);
        const users = <User[]>await this.repo.getUser(userTokenDTO.email);
        if (users.length == 0)  throw new UserNotExists();

        return UserResponseDTO.fromUser(users[0]);
    }
}

export default new UserService();