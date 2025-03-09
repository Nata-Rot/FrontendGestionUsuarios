import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/gestion-usuarios',
    name: 'user-management',
    component: LoginView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/gestion-usuarios');
  } else {
    next();
  }
});

export default router;