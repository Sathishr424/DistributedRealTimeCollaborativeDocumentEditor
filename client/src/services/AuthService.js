import APIRequest from "./APIRequest";
import JWTService from "./JWTService";

class AuthService {
    async getUserData() {
        try {
            return await APIRequest.request("api/users/me", "GET", {});
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async isUserLoggedIn() {
        try {
            let data = await this.getUserData();
            return data !== null && data.email !== undefined;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            let data = await APIRequest.request("api/auth/login", "POST", { email, password });
            if (data.token !== undefined) {
                JWTService.storeToken(data.token);
            }
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async register(email, username, password) {
        try {
            return await APIRequest.request("api/auth/register", "POST", {email, username, password});
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