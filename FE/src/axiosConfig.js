// src/axiosConfig.js
import axios from 'axios';
import { getToken, getGoogleToken } from './components/Login/app/static';

const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const baseURL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

const instance = axios.create({
    baseURL,
});

instance.interceptors.request.use(
    (config) => {
        const token = getToken() || getGoogleToken();
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
