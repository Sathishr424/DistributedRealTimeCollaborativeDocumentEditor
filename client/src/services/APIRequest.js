import axios from "axios";
import JWTService from "./JWTService";

class APIRequest {

    #getAuthHeaders() {
        const token = JWTService.getToken();
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
        return {};
    }

    #postRequest(url, data) {
        return new Promise((resolve, reject) => {
            axios.post(`${import.meta.env.VITE_API_URL}/${url}`, data, {
                headers: this.#getAuthHeaders(),
            }).then(res => {
                resolve(res.data);
            }).catch(e => {
                reject(e)
            })
        })
    }

    #putRequest(url, data) {
        return new Promise((resolve, reject) => {
            axios.put(`${import.meta.env.VITE_API_URL}/${url}`, data, {
                headers: this.#getAuthHeaders(),
            }).then(res => {
                resolve(res.data);
            }).catch(e => {
                reject(e)
            })
        })
    }

    #getRequest(url) {
        return new Promise((resolve, reject) => {
            axios.get(`${import.meta.env.VITE_API_URL}/${url}`, {
                headers: this.#getAuthHeaders(),
            }).then(res => {
                resolve(res.data);
            }).catch(e => {
                reject(e);
            })
        })
    }

    request(url, method, data) {
        if (method === 'POST') return this.#postRequest(url, data);
        else if (method === 'GET') return this.#getRequest(url)
        else if (method === 'PUT') return this.#putRequest(url, data);

        throw new Error(`Unsupported HTTP method: ${method}`);
    }
}

export default new APIRequest();