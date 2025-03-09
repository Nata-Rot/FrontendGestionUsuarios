<script setup>
// No necesitas importar HelloWorld ni TheWelcome
// El router se encargará de cargar los componentes según la ruta
</script>

<template>
  <!-- Elimina todo el contenido anterior y usa solo router-view -->
  <router-view />
</template>

<style>
/* Puedes mantener algunos estilos globales si lo deseas */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>