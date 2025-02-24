import axios from 'axios';

const API_URL = process.env.API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const register = (name, email, mobile, password) => {
  return api.post('/auth/register', { name, email, mobile, password });
};

export const getProfile = () => {
  return api.get('/auth/me');
};

// User API
export const searchUsers = (query) => {
  return api.get(`/users/search?query=${encodeURIComponent(query)}`);
};

export const getConversations = () => {
  return api.get('/users/conversations');
};

export const getMessages = (userId) => {
  return api.get(`/users/${userId}/messages`);
};

export const getPendingMessages = () => {
  return api.get('/users/pending-messages');
};

export default api;