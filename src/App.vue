<script setup>
import { RouterView } from 'vue-router';
import HomePage from './views/client/HomePage.vue';
</script>

<template>
  <!-- <RouterView /> -->
  <HomePage />
</template>

<style>
/* Global styles */
body {
    background: #ffffff !important;
    font-family: 'Arial', sans-serif;
}

* {
    box-sizing: border-box;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #dc3545;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #c82333;
}
</style>
