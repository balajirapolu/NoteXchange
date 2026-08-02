import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to attach Authorization header if token exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('notexchange_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
