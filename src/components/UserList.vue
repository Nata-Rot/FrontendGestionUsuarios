<!-- src/components/UserList.vue -->
<template>
  <div class="user-list-container">
    <div class="list-header">
      <h2 class="list-title">Lista de Usuarios</h2>
      <button class="btn-new-user" @click="handleNewUser">
        <span>Nuevo Usuario</span>
      </button>
    </div>
    
    <div v-if="userStore.loading" class="loading-container">
      <p>Cargando usuarios...</p>
    </div>
    
    <div v-else-if="userStore.error" class="error-container">
      <p>{{ userStore.error }}</p>
      <button class="btn-retry" @click="loadUsers">Reintentar</button>
    </div>
    
    <div v-else-if="userStore.users.length === 0" class="empty-container">
      <p>No hay usuarios registrados</p>
    </div>
    
    <div v-else class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Correo Electrónico</th>
            <th>Cédula</th>
            <th>Último Acceso</th>
            <th>Tipo</th>
            <th>Puntaje</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userStore.users" :key="user.id">
            <td>{{ user.nombre }}</td>
            <td>{{ user.apellidos }}</td>
            <td>{{ user.correoElectronico }}</td>
            <td>{{ user.cedula }}</td>
            <td>{{ formatDate(user.fechaUltimoAcceso) }}</td>
            <td class="tipo-column">
              <span 
                class="tipo-badge" 
                :class="getTipoClass(user.tipoUsuario)"
              >
                {{ user.tipoUsuario }}
              </span>
            </td>
            <td class="puntaje-column">
              <span
                class="puntaje-badge"
                :style="{ backgroundColor: getPuntajeColor(user.puntaje) }"
              >
                {{ user.puntaje }}
              </span>
            </td>
            <td class="actions-cell">
              <button 
                class="btn-action btn-edit" 
                @click="handleEditUser(user)"
                title="Editar usuario"
              >
                Editar
              </button>
              <button 
                class="btn-action btn-delete" 
                @click="handleDeleteUser(user)"
                title="Eliminar usuario"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal de confirmación para eliminar usuario -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-container">
        <h3 class="modal-title">Confirmar eliminación</h3>
        <p class="modal-message">
          ¿Está seguro que desea eliminar al usuario 
          <strong>{{ userToDelete?.nombre }} {{ userToDelete?.apellidos }}</strong>?
        </p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="cancelDelete">Cancelar</button>
          <button 
            class="btn-confirm-delete" 
            @click="confirmDelete"
            :disabled="deleteLoading"
          >
            {{ deleteLoading ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/users';

const router = useRouter();
const userStore = useUserStore();

// Estado para el modal de eliminación
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const deleteLoading = ref(false);

onMounted(() => {
  loadUsers();
});

const loadUsers = async () => {
  try {
    await userStore.fetchUsers();
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
};

const handleNewUser = () => {
  router.push('/users/new');
};

const handleEditUser = (user) => {
  router.push(`/users/${user.id}/edit`);
};

const handleDeleteUser = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;
  
  try {
    deleteLoading.value = true;
    const success = await userStore.deleteUser(userToDelete.value.id);
    
    if (success) {
      showDeleteModal.value = false;
      userToDelete.value = null;
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
  } finally {
    deleteLoading.value = false;
  }
};

// Funciones para formato y estilos de las nuevas columnas
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
</script>

<style scoped>
  .user-list-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    position: relative;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .list-title {
    font-size: 1.5rem;
    margin: 0;
    color: #2c3e50;
  }

  .btn-new-user {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
  }

  .btn-new-user:hover {
    background-color: #2980b9;
  }

  .loading-container, .error-container, .empty-container {
    text-align: center;
    padding: 2rem;
    color: #7f8c8d;
  }

  .error-container {
    color: #e74c3c;
  }

  .btn-retry {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    margin-top: 1rem;
    cursor: pointer;
  }

  .users-table-container {
    overflow-x: auto;
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;
  }

  .users-table th, .users-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ecf0f1;
  }

  .users-table th {
    font-weight: 600;
    color: #34495e;
    background-color: #f8f9fa;
  }

  .users-table tr:hover {
    background-color: #f9f9f9;
  }

  .actions-cell {
    display: flex;
    gap: 0.5rem;
  }

  .btn-action {
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    border: none;
  }

  .btn-edit {
    background-color: #f39c12;
    color: white;
  }

  .btn-edit:hover {
    background-color: #e67e22;
  }

  .btn-delete {
    background-color: #e74c3c;
    color: white;
  }

  .btn-delete:hover {
    background-color: #c0392b;
  }

  /* Estilos para las nuevas columnas */
  .tipo-column {
    text-align: center;
  }

  .tipo-badge {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 500;
    color: white;
    white-space: nowrap;
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

  .puntaje-column {
    text-align: center;
  }

  .puntaje-badge {
    display: inline-block;
    padding: 0.3rem 0.6rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 500;
    color: white;
    min-width: 2.5rem;
    text-align: center;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .modal-container {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-title {
    margin-top: 0;
    color: #e74c3c;
  }

  .modal-message {
    margin: 1rem 0;
    line-height: 1.5;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .btn-cancel, .btn-confirm-delete {
    padding: 0.75rem 1.25rem;
    border-radius: 4px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
  }

  .btn-cancel {
    background-color: #ecf0f1;
    color: #7f8c8d;
    border: none;
  }

  .btn-cancel:hover {
    background-color: #bdc3c7;
  }

  .btn-confirm-delete {
    background-color: #e74c3c;
    color: white;
    border: none;
  }

  .btn-confirm-delete:hover {
    background-color: #c0392b;
  }

  .btn-confirm-delete:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .list-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .actions-cell {
      flex-direction: column;
    }
    
    .btn-action {
      width: 100%;
    }
  }
</style>