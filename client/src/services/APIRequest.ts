import axios from "axios";
import JWTService from "./JWTService";

const API_URL = import.meta.env.VITE_API_URL;

class APIRequest {

    #getAuthHeaders() {
        const token = JWTService.getToken();
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
        return {};
    }

    #postRequest(url: string, data: any) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${url}`, data, {
                headers: this.#getAuthHeaders(),
            }).then(res => {
                resolve(res.data);
            }).catch(e => {
                reject(e)
            })
        })
    }

    #putRequest(url: string, data: any) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${url}`, data, {
                headers: this.#getAuthHeaders(),
            }).then(res => {
                resolve(res.data);
            }).catch(e => {
                reject(e)
            })
        })
    }

    #getRequest(url: string) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${url}`, {
                headers: this.#getAuthHeaders(),
            }).then(res => {
                resolve(res.data);
            }).catch(e => {
                reject(e);
            })
        })
    }

    request(url: string, method: string, data: any): Promise<any> {
        if (method === 'POST') return this.#postRequest(url, data);
        else if (method === 'GET') return this.#getRequest(url)
        else if (method === 'PUT') return this.#putRequest(url, data);

        throw new Error(`Unsupported HTTP method: ${method}`);
    }
}

export default new APIRequest();