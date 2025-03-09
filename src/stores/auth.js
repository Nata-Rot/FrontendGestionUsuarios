// src/stores/auth.js
import { defineStore } from 'pinia';
import { authService } from '../services/api';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Usuario actual
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },
  actions: {
    async login(credentials) {
      try {
        this.loading = true;
        this.error = null;
        
        const data = await authService.login(credentials);
        
        this.user = {
          id: data.id,
          nombre: data.nombre,
          apellidos: data.apellidos
        };
        this.token = data.token;
        
        // Guardar en localStorage
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);
        
        router.push('/gestion-usuarios');
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al iniciar sesión';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    }
  }
});
