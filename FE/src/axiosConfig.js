// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api', // Adjust the baseURL to match your backend URL
});

export default instance;
