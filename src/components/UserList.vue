<template>
    <div class="user-list-container">
      <div class="list-header">
        <h3>Usuarios Registrados</h3>
        <button class="btn-add" @click="$emit('create')">Nuevo Usuario</button>
      </div>
      
      <div v-if="userStore.loading" class="loading">
        Cargando usuarios...
      </div>
      
      <div v-else-if="userStore.error" class="error-message">
        {{ userStore.error }}
      </div>
      
      <div v-else-if="users.length === 0" class="empty-state">
        No hay usuarios registrados
      </div>
      
      <div v-else class="table-responsive">
        <table class="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Correo</th>
              <th>Último Acceso</th>
              <th>Tipo</th>
              <th>Puntaje</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.nombre }} {{ user.apellidos }}</td>
              <td>{{ user.cedula }}</td>
              <td>{{ user.correoElectronico }}</td>
              <td>{{ formatDate(user.fechaUltimoAcceso) }}</td>
              <td class="tipo-column">
                <span 
                  class="tipo-badge" 
                  :class="getTipoClass(user.tipoUsuario)"
                >
                  {{ user.tipoUsuario }}
                </span>
              </td>
              <td>
                <span
                  class="puntaje-badge"
                  :style="{ backgroundColor: getPuntajeColor(user.puntaje) }"
                >
                  {{ user.puntaje }}
                </span>
              </td>
              <td class="actions-column">
                <button 
                  class="btn-edit" 
                  @click="$emit('edit', user)"
                  title="Editar usuario"
                >
                  Editar
                </button>
                <button 
                  class="btn-delete" 
                  @click="confirmDelete(user)"
                  title="Eliminar usuario"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Modal de confirmación para eliminar -->
      <div v-if="showDeleteModal" class="delete-modal">
        <div class="modal-content">
          <h4>Confirmar eliminación</h4>
          <p>¿Está seguro que desea eliminar al usuario <strong>{{ userToDelete?.nombre }} {{ userToDelete?.apellidos }}</strong>?</p>
          <div class="modal-actions">
            <button 
              class="btn-cancel" 
              @click="showDeleteModal = false"
            >
              Cancelar
            </button>
            <button 
              class="btn-confirm-delete" 
              @click="handleDelete"
              :disabled="deleting"
            >
              {{ deleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useUserStore } from '../stores/users';
  
  const emit = defineEmits(['create', 'edit']);
  const userStore = useUserStore();
  
  const users = computed(() => userStore.users);
  
  const showDeleteModal = ref(false);
  const userToDelete = ref(null);
  const deleting = ref(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getTipoClass = (tipo) => {
    const classMap = {
      'Hechicero': 'hechicero',
      'Luchador': 'luchador',
      'Explorador': 'explorador',
      'Olvidado': 'olvidado'
    };
    
    return classMap[tipo] || '';
  };
  
  const getPuntajeColor = (puntaje) => {
    if (puntaje >= 60) return '#27ae60';
    if (puntaje >= 30) return '#f39c12';
    return '#e74c3c';
  };
  
  const confirmDelete = (user) => {
    userToDelete.value = user;
    showDeleteModal.value = true;
  };
  
  const handleDelete = async () => {
    if (!userToDelete.value) return;
    
    try {
      deleting.value = true;
      await userStore.deleteUser(userToDelete.value.id);
      showDeleteModal.value = false;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    } finally {
      deleting.value = false;
      userToDelete.value = null;
    }
  };
  </script>
  
  <style scoped>
  .user-list-container {
    width: 100%;
  }
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .list-header h3 {
    margin: 0;
    color: #2c3e50;
  }
  
  .btn-add {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-add:hover {
    background-color: #2980b9;
  }
  
  .table-responsive {
    overflow-x: auto;
  }
  
  .users-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  
  .users-table th,
  .users-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #ecf0f1;
  }
  
  .users-table th {
    background-color: #f7f9fa;
    font-weight: 600;
    color: #34495e;
  }
  
  .users-table tr:hover {
    background-color: #f8f9fa;
  }
  
  .actions-column {
    white-space: nowrap;
    width: 150px;
  }
  
  .tipo-column {
    width: 120px;
  }
  
  .tipo-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 500;
    color: white;
  }
  
  .hechicero {
    background-color: #8e44ad;
  }
  
  .luchador {
    background-color: #d35400;
  }
  
  .explorador {
    background-color: #16a085;
  }
  
  .olvidado {
    background-color: #7f8c8d;
  }
  
  .puntaje-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 500;
    color: white;
  }
  
  .btn-edit,
  .btn-delete {
    padding: 0.35rem 0.6rem;
    border-radius: 4px;
    font-size: 0.85rem;
    margin-right: 0.5rem;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s;
  }
  
  .btn-edit {
    background-color: #3498db;
    color: white;
  }
  
  .btn-edit:hover {
    background-color: #2980b9;
  }
  
  .btn-delete {
    background-color: #e74c3c;
    color: white;
  }
  
  .btn-delete:hover {
    background-color: #c0392b;
  }
  
  .loading,
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #7f8c8d;
  }
  
  .error-message {
    background-color: #fdecea;
    color: #e74c3c;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  /* Estilos para el modal de confirmación */
  .delete-modal {
    position: fixed;
    top: 0;
  }
  </style>