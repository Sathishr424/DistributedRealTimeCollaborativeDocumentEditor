import { pool } from "../config/database/connection";
import {ServerError} from "../exceptions/ServerError";
import {User} from "../models/User";
import {UserNotExists} from "../exceptions/UserNotExists";

class UserRepository {
    async getUser(email: string): Promise<User[]> {
        try {
            const [rows] = await pool.query<User[]>("SELECT * FROM users WHERE email=? LIMIT 1", [email]);
            return rows;
        } catch(err) {
            throw new ServerError(err);
        }
    }
}

export default new UserRepository();