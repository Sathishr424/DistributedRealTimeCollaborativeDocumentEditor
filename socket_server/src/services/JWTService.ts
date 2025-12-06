import {User} from "../models/User";
import jwt from "jsonwebtoken";
import {ServerError} from "../exceptions/ServerError";
import {UserTokenDTO} from "../dto/UserTokenDTO";
import UserRepository from "../repositories/UserRepository";
import {UserNotExists} from "../exceptions/UserNotExists";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRETKEY as string;


class JWTService {
    private userRepo = UserRepository;

    async generateToken(user: User): Promise<string> {
        return await this.signToken(user);
    }

    validateToken(token: string): UserTokenDTO {
        return this.validate(token);
    }

    async validateAndVerifyToken(token: string): Promise<UserTokenDTO> {
        const userToken = this.validate(token);
        await this.verifyToken(userToken);
        return userToken;
    }

    async verifyToken(userToken: UserTokenDTO): Promise<UserTokenDTO> {
        if (!(await this.userRepo.isUserExists(userToken.email))) {
            throw new UserNotExists();
        }
        return userToken;
    }

    private signToken(user: UserTokenDTO): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(user, JWT_SECRET, { expiresIn: '24h' }, (err, token: string | undefined) => {
                if (err || token === undefined) {
                    console.log(err);
                    return reject(new ServerError(err));
                }
                resolve(token);
            })
        });
    }

    private validate(token: string): UserTokenDTO {
        try {
            return jwt.verify(token, JWT_SECRET) as UserTokenDTO;
        } catch (err) {
            throw new ServerError(err);
        }
    }
}

export default new JWTService();