import {User} from "../models/User";
import jwt from "jsonwebtoken";
import {ServerError} from "../exceptions/ServerError";
import {UserTokenDTO} from "../dto/UserTokenDTO";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET as string;

class JWTService {
    async generateToken(user: User): Promise<string> {
        return await this.signToken(user);
    }

    validateToken(token: string): UserTokenDTO {
        return this.validate(token);
    }

    private signToken(user: UserTokenDTO): Promise<string> {
        return new Promise(resolve => {
            jwt.sign(user, JWT_SECRET, { expiresIn: '1h' }, (err, token: string | undefined) => {
                if (err || token === undefined) throw new ServerError();
                resolve(token);
            })
        });
    }

    private validate(token: string): UserTokenDTO {
        try {
            return jwt.verify(token, JWT_SECRET) as UserTokenDTO;
        } catch (err) {
            throw new ServerError();
        }
    }
}

export default new JWTService();