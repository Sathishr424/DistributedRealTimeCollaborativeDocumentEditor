import {JwtPayload} from "jsonwebtoken";

export interface UserTokenDTO extends JwtPayload {
    email: string;
    id: number;
}