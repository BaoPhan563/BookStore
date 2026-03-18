// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    // Adjust the baseURL to match your backend URL
    // baseURL: 'http://localhost:3000/api', 
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
});

export default instance;
