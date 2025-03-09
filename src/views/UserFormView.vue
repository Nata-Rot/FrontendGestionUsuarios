<template>
  <div class="app-container">
    <div class="form-wrapper">
      <h1 class="app-title">{{ isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h1>
      <UserForm 
        :user="selectedUser" 
        @saved="handleSaved" 
        @cancel="handleCancel" 
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/users';
import UserForm from '../components/UserForm.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const userId = computed(() => route.params.id ? parseInt(route.params.id) : null);
const isEditing = computed(() => !!userId.value);
const selectedUser = computed(() => userId.value ? userStore.getUserById(userId.value) : null);

onMounted(async () => {
  if (isEditing.value && !selectedUser.value) {
    try {
      await userStore.fetchUsers();
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      router.push('/users');
    }
  }
});

const handleSaved = () => {
  router.push('/users');
};

const handleCancel = () => {
  router.push('/users');
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

.form-wrapper {
  width: 100%;
  max-width: 800px;
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