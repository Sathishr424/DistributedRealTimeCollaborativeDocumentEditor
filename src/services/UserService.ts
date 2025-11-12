import AuthRepository from "../repositories/AuthRepository";
import {RegisterUserDTO} from "../dto/request/RegisterUserDTO";
import {EmailExistsException} from "../exceptions/EmailExistsException";
import {checkPassword, hashPassword} from "../helpers/helper";
import {LoginUserDTO} from "../dto/request/LoginUserDTO";
import {UserNotExists} from "../exceptions/UserNotExists";
import {User} from "../models/User";
import {WrongCredentials} from "../exceptions/WrongCredentials";
import JWTService from "./JWTService";
import {UserTokenDTO} from "../dto/UserTokenDTO";
import {RequestUserTokenDTO} from "../dto/request/RequestUserTokenDTO";

class UserService {
    private repo = AuthRepository;
    private jwtService = JWTService;

    async getUser(token: string) {
        const userTokenDTO = this.jwtService.validateToken(token);
        const users = <User[]>await this.repo.getUser(userTokenDTO.email);
        if (users.length == 0)  throw new UserNotExists();

        return users[0];
    }
}

export default new UserService();