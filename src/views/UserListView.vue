<template>
    <div class="app-container">
      <div class="user-list-wrapper">
        <h1 class="app-title">Usuarios Registrados</h1>
        <UserList @create="handleCreateUser" @edit="handleEditUser" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import UserList from '../components/UserList.vue';
  
  const handleCreateUser = () => {
    // Lógica para crear nuevo usuario - podría abrir un formulario o modal
    console.log('Crear nuevo usuario');
  };
  
  const handleEditUser = (user) => {
    // Lógica para editar usuario seleccionado
    console.log('Editar usuario:', user);
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
  
  .app-title {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    .app-container {
      padding: 1rem;
    }
    
    .app-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }
  </style>