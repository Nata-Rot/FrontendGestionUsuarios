<!-- src/components/LoginForm.vue -->
<template>
    <div class="login-form">
      <h2 class="form-title">Iniciar Sesión</h2>
      
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.correoElectronico" 
            required
            placeholder="ejemplo@correo.com"
            :class="{ 'error': validationErrors.correoElectronico }"
          >
          <span v-if="validationErrors.correoElectronico" class="error-text">
            {{ validationErrors.correoElectronico }}
          </span>
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.contrasena" 
            required
            placeholder="Ingrese su contraseña"
            :class="{ 'error': validationErrors.contrasena }"
          >
          <span v-if="validationErrors.contrasena" class="error-text">
            {{ validationErrors.contrasena }}
          </span>
        </div>
        
        <button 
          type="submit" 
          class="btn-submit"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue';
  import { useAuthStore } from '../stores/auth';
  
  const authStore = useAuthStore();
  
  const form = reactive({
    correoElectronico: '',
    contrasena: ''
  });
  
  const validationErrors = reactive({
    correoElectronico: '',
    contrasena: ''
  });
  
  const validateForm = () => {
    let isValid = true;
    
    // Validar correo
    if (!form.correoElectronico) {
      validationErrors.correoElectronico = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correoElectronico)) {
      validationErrors.correoElectronico = 'Ingrese un correo electrónico válido';
      isValid = false;
    } else {
      validationErrors.correoElectronico = '';
    }
    
    // Validar contraseña
    if (!form.contrasena) {
      validationErrors.contrasena = 'La contraseña es requerida';
      isValid = false;
    } else if (form.contrasena.length < 6) {
      validationErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    } else {
      validationErrors.contrasena = '';
    }
    
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      await authStore.login(form);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
    }
  };
  </script>
  
  <style scoped>
  .login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }
  
  .form-title {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  input.error {
    border-color: #e74c3c;
  }
  
  .error-text {
    display: block;
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .error-message {
    background-color: #fdecea;
    color: #e74c3c;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .btn-submit {
    width: 100%;
    padding: 0.75rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-submit:hover {
    background-color: #2980b9;
  }
  
  .btn-submit:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
  </style>