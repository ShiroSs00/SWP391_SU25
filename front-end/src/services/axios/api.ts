import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://swp391-su25.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add any custom logic here before the request is sent
        // For example, you can add an authorization token if needed
        const token = localStorage.getItem('token');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default api;