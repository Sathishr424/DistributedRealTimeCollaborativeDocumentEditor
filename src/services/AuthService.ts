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

class AuthService {
    private repo = AuthRepository;
    private jwtService = JWTService;

    async register(userDTO: RegisterUserDTO) {
        const user_exist: boolean = <boolean>await this.repo.isUserExist(userDTO.email);
        if (user_exist)  throw new EmailExistsException();

        const password_hash: string = await hashPassword(userDTO.password);

        await this.repo.registerUser(userDTO.email, userDTO.username, password_hash);
    }

    async login(userDTO: LoginUserDTO) {
        const users = <User[]>await this.repo.getUser(userDTO.email);
        if (users.length == 0)  throw new UserNotExists();
        let user = users[0];

        if (!(await checkPassword(userDTO.password, user.password))) throw new WrongCredentials();

        return await this.jwtService.generateToken(user)
    }

    async logout(token: string) {
        const user: UserTokenDTO = this.jwtService.validateToken(token);
        await this.repo.deleteUserToken(user.id);
    }

    async getUserId(token: string): Promise<number> {
        const user: UserTokenDTO = this.jwtService.validateToken(token);
        return user.id;
    }
}

export default new AuthService();