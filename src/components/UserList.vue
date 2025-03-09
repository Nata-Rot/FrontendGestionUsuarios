<template>
  <div class="user-list-container">
    <div class="list-header">
      <h2 class="section-title">Lista Usuarios</h2>
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
    
    <div v-else class="table-container">
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
            <td class="puntaje-column">
              <span
                class="puntaje-badge"
                :style="{ backgroundColor: getPuntajeColor(user.puntaje) }"
              >
                {{ user.puntaje }}
              </span>
            </td>
            <td class="actions-column">
              <div class="action-buttons">
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
              </div>
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
  import { ref, computed, onMounted } from 'vue';
  import { useUserStore } from '../stores/users';
  
  const emit = defineEmits(['create', 'edit']);
  const userStore = useUserStore();
  
  const users = computed(() => userStore.users);
  
  const showDeleteModal = ref(false);
  const userToDelete = ref(null);
  const deleting = ref(false);
  
  // Cargar usuarios al montar el componente
  onMounted(() => {
    userStore.fetchUsers();
  });
  
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
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
  }
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eaeaea;
  }
  
  .section-title {
    margin: 0;
    color: #2c3e50;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .btn-add {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.9rem;
  }
  
  .btn-add:hover {
    background-color: #2980b9;
  }
  
  .table-container {
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #ecf0f1;
  }
  
  .users-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  
  .users-table th,
  .users-table td {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid #ecf0f1;
  }
  
  .users-table th {
    background-color: #f7f9fa;
    font-weight: 600;
    color: #34495e;
    white-space: nowrap;
  }
  
  .users-table tr:hover {
    background-color: #f8f9fa;
  }
  
  .actions-column {
    white-space: nowrap;
    width: 180px;
  }
  
  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .tipo-column {
    width: 120px;
    text-align: center;
  }
  
  .puntaje-column {
    width: 80px;
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
  
  .btn-edit,
  .btn-delete {
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s;
    min-width: 80px;
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
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 8px;
    padding: 1.8rem;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .modal-content h4 {
    margin-top: 0;
    color: #2c3e50;
    font-size: 1.25rem;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    gap: 1rem;
  }
  
  .btn-cancel {
    background-color: #ecf0f1;
    color: #7f8c8d;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: 500;
  }
  
  .btn-cancel:hover {
    background-color: #bdc3c7;
  }
  
  .btn-confirm-delete {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: 500;
  }
  
  .btn-confirm-delete:hover {
    background-color: #c0392b;
  }
  
  .btn-confirm-delete:disabled {
    background-color: #e57373;
    cursor: not-allowed;
  }
</style>