import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:44348/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;