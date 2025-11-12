import { pool } from "../config/database/connection";
import {ServerError} from "../exceptions/ServerError";
import {User} from "../models/User";
import {UserNotExists} from "../exceptions/UserNotExists";

class AuthRepository {
    async isUserExist(email: string): Promise<boolean> {
        try {
            const [rows] = await pool.query<User[]>("SELECT * FROM users WHERE email=? LIMIT 1", [email]);
            return rows.length > 0;
        } catch(err) {
            throw new ServerError();
        }
    }

    async getUser(email: string): Promise<User[]> {
        try {
            const [rows] = await pool.query<User[]>("SELECT * FROM users WHERE email=? LIMIT 1", [email]);
            return rows;
        } catch(err) {
            throw new ServerError();
        }
    }

    async registerUser(email: string, username: string, password: string) {
        try {
            await pool.execute("INSERT INTO users (`email`, `username`, `password`) VALUES (?,?,?)", [email, username, password]);
        } catch (err) {
            throw new ServerError();
        }
    }

    async deleteUserToken(user_id: number) {
        try {
            await pool.execute("UPDATE users SET refreshToken=\"\" WHERE `id`=?", [user_id]);
        } catch (err) {
            throw new ServerError();
        }
    }
}

export default new AuthRepository();