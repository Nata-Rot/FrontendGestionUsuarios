<template>
    <div class="app-container">
      <div class="user-list-wrapper">
        <div class="header-container">
          <h1 class="app-title">Usuarios Registrados</h1>
          <button @click="logout" class="logout-button" title="Cerrar sesión">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
        <UserList @create="handleCreateUser" @edit="handleEditUser" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import UserList from '../components/UserList.vue';
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const handleCreateUser = () => {
    // Lógica para crear nuevo usuario - podría abrir un formulario o modal
    console.log('Crear nuevo usuario');
  };
  
  const handleEditUser = (user) => {
    // Lógica para editar usuario seleccionado
    console.log('Editar usuario:', user);
  };
  
  const logout = () => {
    authStore.logout();
  };
  </script>
  
  <style scoped>
  .app-container {
    min-height: 100vh;
    background-color: #f5f7fa;
    padding: 2rem;
    display: flex;
    justify-content: center;
  }
  
  .user-list-wrapper {
    width: 100%;
    max-width: 1200px;
  }
  
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .app-title {
    text-align: center;
    color: #2c3e50;
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
  }
  
  .logout-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e74c3c;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .logout-button:hover {
    background-color: #c0392b;
  }
  
  @media (max-width: 768px) {
    .app-container {
      padding: 1rem;
    }
    
    .header-container {
      flex-direction: row;
      align-items: center;
    }
    
    .app-title {
      font-size: 1.5rem;
    }
  
    .logout-button {
      width: 36px;
      height: 36px;
    }
  }
  </style>