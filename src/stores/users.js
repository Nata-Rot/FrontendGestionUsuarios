import { defineStore } from 'pinia';
import { userService } from '../services/api';

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    selectedUser: null,
    loading: false,
    error: null
  }),
  
  getters: {
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id);
    },
    
    userClassifications: (state) => {
      return state.users.map(user => ({
        ...user,
        clasificacion: user.tipoUsuario,
        puntajeColor: getPuntajeColor(user.puntaje)
      }));
    }
  },
  
  actions: {
    async fetchUsers() {
      try {
        this.loading = true;
        this.error = null;
        const users = await userService.getAll();
        this.users = users;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al obtener usuarios';
        console.error('Error fetching users:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async createUser(userData) {
      try {
        this.loading = true;
        this.error = null;
        const newUser = await userService.create(userData);
        this.users.push(newUser);
        return newUser;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear usuario';
        console.error('Error creating user:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateUser(id, userData) {
      try {
        this.loading = true;
        this.error = null;
        await userService.update(id, userData);
        // Actualizar el usuario en el array local
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...userData };
        }
        await this.fetchUsers(); // Recargar la lista para obtener los datos actualizados
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar usuario';
        console.error('Error updating user:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteUser(id) {
      try {
        this.loading = true;
        this.error = null;
        await userService.delete(id);
        this.users = this.users.filter(user => user.id !== id);
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar usuario';
        console.error('Error deleting user:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    selectUser(user) {
      this.selectedUser = user;
    },
    
    clearSelectedUser() {
      this.selectedUser = null;
    }
  }
});

function getPuntajeColor(puntaje) {
  if (puntaje >= 60) return 'green';
  if (puntaje >= 30) return 'orange';
  return 'red';
}