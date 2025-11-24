import { pool } from "../config/database/connection";
import {ServerError} from "../exceptions/ServerError";
import {User} from "../models/User";
import {UserNotExists} from "../exceptions/UserNotExists";
import {RowDataPacket} from "mysql2";

interface Count extends RowDataPacket {
    count: number;
}

class UserRepository {
    async getUser(email: string): Promise<User[]> {
        try {
            const [rows] = await pool.query<User[]>("SELECT * FROM users WHERE email=? LIMIT 1", [email]);
            return rows;
        } catch(err) {
            throw new ServerError(err);
        }
    }

    async isUserExists(email: string): Promise<boolean> {
        const [rows] = await pool.query<Count[]>("SELECT COUNT(id) as count FROM users WHERE email=?", [email]);
        return rows.length > 0 && rows[0].count > 0;
    }
}

export default new UserRepository();