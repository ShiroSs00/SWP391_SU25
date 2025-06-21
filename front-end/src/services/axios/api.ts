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
        // Lấy token đúng key đã lưu (authToken)
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default api;