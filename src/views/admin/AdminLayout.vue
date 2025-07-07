<template>
  <div class="body">
    <div class="dashboard-container">
      <SidebarA :isSidebarClosed="isSidebarClosed" @toggleSidebar="handleSidebarToggle" />
      <div class="main" :class="{ 'sidebar-closed': isSidebarClosed }">
        <NavA />
        <CustomBreadcrumb/>
        <div class="router">
          <router-view />
        </div>
        <!-- Main Footer Section Begins  -->
        <!-- <FooterA /> -->
        <!-- Main Footer Section Ends  -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import FooterA from "./components-admin/FooterA.vue";
import NavA from "./components-admin/NavigationBar.vue";
import SidebarA from "./components-admin/Sidebar.vue";
import Breadcrumb from './components-admin/CustomBreadcrumb.vue';
import CustomBreadcrumb from './components-admin/CustomBreadcrumb.vue';

const isSidebarClosed = ref(false)
function handleSidebarToggle(val) {
  isSidebarClosed.value = val
}
</script>


<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}
.main {
  flex: 1;
  transition: margin-left 0.3s;
  overflow-x: auto;
  /* margin-left: 250px; */
}
.main.sidebar-closed {
  margin-left: 0px;
}
.router {
  padding: 0.1rem 1rem;
  min-height: calc(100vh - 60px);
  overflow-x: auto;
}

/* Ensure tables can scroll horizontally */
.router :deep(.table-responsive) {
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch;
}

/* Custom scrollbar for better UX */
.main::-webkit-scrollbar,
.router::-webkit-scrollbar,
.table-responsive::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.main::-webkit-scrollbar-track,
.router::-webkit-scrollbar-track,
.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.main::-webkit-scrollbar-thumb,
.router::-webkit-scrollbar-thumb,
.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.main::-webkit-scrollbar-thumb:hover,
.router::-webkit-scrollbar-thumb:hover,
.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
