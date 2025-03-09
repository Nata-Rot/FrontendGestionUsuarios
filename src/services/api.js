// src/services/api.js
import axios from 'axios';

const API_URL = 'https://localhost:7102/api';  // Ajusta según tu configuración

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/Usuarios/login', credentials);
    return response.data;
  }
};

export const userService = {
  getAll: async () => {
    const response = await api.get('/Usuarios');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/Usuarios/${id}`);
    return response.data;
  },
  create: async (user) => {
    const response = await api.post('/Usuarios', user);
    return response.data;
  },
  update: async (id, user) => {
    const response = await api.put(`/Usuarios/${id}`, user);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/Usuarios/${id}`);
    return response.data;
  }
};

export default api;