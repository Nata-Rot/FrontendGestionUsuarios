<template>
    <div class="user-form">
      <h3 class="form-title">{{ isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h3>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input 
            type="text" 
            id="nombre" 
            v-model="form.nombre" 
            required
            :class="{ 'error': validationErrors.nombre }"
          >
          <span v-if="validationErrors.nombre" class="error-text">
            {{ validationErrors.nombre }}
          </span>
        </div>
        
        <div class="form-group">
          <label for="apellidos">Apellidos</label>
          <input 
            type="text" 
            id="apellidos" 
            v-model="form.apellidos" 
            required
            :class="{ 'error': validationErrors.apellidos }"
          >
          <span v-if="validationErrors.apellidos" class="error-text">
            {{ validationErrors.apellidos }}
          </span>
        </div>
        
        <div class="form-group" v-if="!isEditing">
          <label for="cedula">Cédula</label>
          <input 
            type="text" 
            id="cedula" 
            v-model="form.cedula" 
            required
            :class="{ 'error': validationErrors.cedula }"
          >
          <span v-if="validationErrors.cedula" class="error-text">
            {{ validationErrors.cedula }}
          </span>
        </div>
        
        <div class="form-group">
          <label for="correo">Correo Electrónico</label>
          <input 
            type="email" 
            id="correo" 
            v-model="form.correoElectronico" 
            required
            :class="{ 'error': validationErrors.correoElectronico }"
          >
          <span v-if="validationErrors.correoElectronico" class="error-text">
            {{ validationErrors.correoElectronico }}
          </span>
        </div>
        
        <div class="form-group" v-if="!isEditing">
          <label for="contrasena">Contraseña</label>
          <input 
            type="password" 
            id="contrasena" 
            v-model="form.contrasena" 
            required
            :class="{ 'error': validationErrors.contrasena }"
          >
          <span v-if="validationErrors.contrasena" class="error-text">
            {{ validationErrors.contrasena }}
          </span>
        </div>
        
        <div class="form-actions">
          <button 
            type="button" 
            class="btn-cancel"
            @click="onCancel"
          >
            Cancelar
          </button>
          
          <button 
            type="submit" 
            class="btn-submit"
            :disabled="loading"
          >
            {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed, onMounted } from 'vue';
  import { useUserStore } from '../stores/users';
  
  const props = defineProps({
    user: {
      type: Object,
      default: null
    }
  });
  
  const emit = defineEmits(['saved', 'cancel']);
  
  const userStore = useUserStore();
  const loading = ref(false);
  const errorMessage = ref('');
  
  const isEditing = computed(() => !!props.user);
  
  const form = reactive({
    nombre: '',
    apellidos: '',
    cedula: '',
    correoElectronico: '',
    contrasena: ''
  });
  
  const validationErrors = reactive({
    nombre: '',
    apellidos: '',
    cedula: '',
    correoElectronico: '',
    contrasena: ''
  });
  
  onMounted(() => {
    if (props.user) {
      form.nombre = props.user.nombre;
      form.apellidos = props.user.apellidos;
      form.correoElectronico = props.user.correoElectronico;
    }
  });
  
  const validateForm = () => {
    let isValid = true;
    
    if (!form.nombre) {
      validationErrors.nombre = 'El nombre es requerido';
      isValid = false;
    } else {
      validationErrors.nombre = '';
    }
    
    if (!form.apellidos) {
      validationErrors.apellidos = 'Los apellidos son requeridos';
      isValid = false;
    } else {
      validationErrors.apellidos = '';
    }
    
    if (!isEditing.value && !form.cedula) {
      validationErrors.cedula = 'La cédula es requerida';
      isValid = false;
    } else {
      validationErrors.cedula = '';
    }
    
    if (!form.correoElectronico) {
      validationErrors.correoElectronico = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correoElectronico)) {
      validationErrors.correoElectronico = 'Ingrese un correo electrónico válido';
      isValid = false;
    } else {
      validationErrors.correoElectronico = '';
    }
    
    if (!isEditing.value) {
      if (!form.contrasena) {
        validationErrors.contrasena = 'La contraseña es requerida';
        isValid = false;
      } else if (form.contrasena.length < 6) {
        validationErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
        isValid = false;
      } else {
        validationErrors.contrasena = '';
      }
    }
    
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      loading.value = true;
      errorMessage.value = '';
      
      if (isEditing.value) {
        await userStore.updateUser(props.user.id, {
          nombre: form.nombre,
          apellidos: form.apellidos,
          correoElectronico: form.correoElectronico
        });
      } else {
        await userStore.createUser({
          nombre: form.nombre,
          apellidos: form.apellidos,
          cedula: form.cedula,
          correoElectronico: form.correoElectronico,
          contrasena: form.contrasena
        });
      }
      
      emit('saved');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      errorMessage.value = error.response?.data?.message || 'Error al guardar el usuario';
    } finally {
      loading.value = false;
    }
  };
  
  const onCancel = () => {
    emit('cancel');
  };
  </script>
  
  <style scoped>
  .user-form {
    background-color: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
  }
  
  .form-title {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #2c3e50;
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
    font-size: 0.95rem;
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
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
  }
  
  .btn-cancel, .btn-submit {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-submit {
    background-color: #2ecc71;
    color: white;
    border: none;
  }
  
  .btn-submit:hover {
    background-color: #27ae60;
  }
  
  .btn-submit:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
  
  .btn-cancel {
    background-color: transparent;
    color: #7f8c8d;
    border: 1px solid #ddd;
  }
  
  .btn-cancel:hover {
    background-color: #f5f5f5;
  }
  </style>