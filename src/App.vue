<script setup>
import { RouterView } from 'vue-router';
import HomePage from './views/client/HomePage.vue';
import NotificationDropdown from './components/common/NotificationDropdown.vue';
import NotificationsPage from './views/client/NotificationsPage.vue';
import DemoPage from './views/client/DemoPage.vue';
</script>

<template>
  <RouterView />
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

/* Enable custom scrollbar globally */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Ensure table responsive containers can scroll */
.table-responsive {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
}

/* Fix for Bootstrap table responsive on small screens */
@media (max-width: 1200px) {
    .table-responsive {
        overflow-x: auto !important;
        display: block;
        width: 100%;
        white-space: nowrap;
    }
    
    .table-responsive table {
        min-width: 1000px; /* Ensure minimum width for proper scrolling */
    }
}
</style>
