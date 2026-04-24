import axios from 'axios';
import { DEPLOYED_URL } from '../api/api';
const api = axios.create({
    baseURL: DEPLOYED_URL || 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' },
});
console.log(`hitting ${api.defaults.baseURL}`);

// Attach Clerk session token to every request
api.interceptors.request.use(async (config) => {
    try {
        // window.__clerk__ is set by ClerkProvider
        if (window.Clerk?.session) {
            const token = await window.Clerk.session.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch {
        // proceed without token
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Request failed';
        return Promise.reject(new Error(message));
    }
);

export default api;
