class JWTService {
    getToken() {
        return localStorage.getItem('authToken') || "";
    }

    storeToken(newToken: string) {
        localStorage.setItem('authToken', newToken);
    }

    removeToken() {
        localStorage.removeItem('authToken');
    }
}

export default new JWTService();