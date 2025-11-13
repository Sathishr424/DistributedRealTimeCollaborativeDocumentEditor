import APIRequest from "./APIRequest";
import JWTService from "./JWTService";
import {LoginRequestDTO, RegisterRequestDTO, UserResponseDTO} from "../dto/DTOs";

class AuthService {
    async getUserData(): Promise<UserResponseDTO> {
        try {
            return await APIRequest.request("api/users/me", "GET", {});
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async isUserLoggedIn() {
        try {
            let data: UserResponseDTO = await this.getUserData();
            return data !== null && data.email !== undefined;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async login(request: LoginRequestDTO) {
        try {
            let data = await APIRequest.request("api/auth/login", "POST", { email: request.email, password: request.password });
            if (data.token !== undefined) {
                JWTService.storeToken(data.token);
            }
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async register(request: RegisterRequestDTO) {
        try {
            return await APIRequest.request("api/auth/register", "POST", {email: request.email, username: request.username, password: request.password});
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async logout() {
        try {
            let data = await APIRequest.request("api/auth/logout", "POST", {  });
            JWTService.removeToken();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new AuthService();