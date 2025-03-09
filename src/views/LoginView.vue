<!-- src/views/LoginView.vue -->
<template>
    <div class="login-container">
      <div class="login-box">
        <h1 class="app-title">Sistema de Gestión de Usuarios</h1>
        <LoginForm />
      </div>
    </div>
  </template>
  
  <script setup>
  import LoginForm from '../components/LoginForm.vue';
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f7fa;
  }
  
  .login-box {
    width: 100%;
    max-width: 500px;
    padding: 2rem;
  }
  
  .app-title {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
    font-size: 1.75rem;
  }
  </style>