import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Asegurarse de que la verificación de autenticación ocurra antes del montaje
const token = localStorage.getItem('token')
const isAuthenticated = token !== null

// Redirigir según el estado de autenticación inicial
if (window.location.pathname === '/' || window.location.pathname === '/login') {
  if (isAuthenticated) {
    router.push('/users')
  }
} else if (window.location.pathname !== '/login' && !isAuthenticated) {
  router.push('/login')
}

app.mount('#app')