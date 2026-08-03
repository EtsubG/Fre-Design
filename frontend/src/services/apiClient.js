import axios from 'axios';

/**
 * Centralized Axios instance for future Node.js + Express + MongoDB REST API.
 * API base URL is read from environment variables so endpoints are never hardcoded.
 * Until the backend is live, services fall back to mock data (see services/*).
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fere_design_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = {
      message: error.response?.data?.message || 'An unexpected error occurred.',
      status: error.response?.status || 0,
      data: error.response?.data || null,
    };
    return Promise.reject(normalized);
  },
);

export default apiClient;
