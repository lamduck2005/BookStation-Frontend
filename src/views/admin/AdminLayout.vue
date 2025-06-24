<template>
  <div class="body">
    <div class="dashboard-container">
      <SidebarA :isSidebarClosed="isSidebarClosed" @toggleSidebar="handleSidebarToggle" />
      <div class="main" :class="{ 'sidebar-closed': isSidebarClosed }">
        <!-- Main Navigation Section Begins  -->
        <!-- <NavA /> -->
        <!-- Main Navigation Section Ends  -->
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
import NavA from "./components-admin/NavA.vue";
import SidebarA from "./components-admin/Sidebar.vue";

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
  /* margin-left: 250px; */
}
.main.sidebar-closed {
  margin-left: 0px;
}
.router {
  padding: 0.1rem 1rem;
  min-height: calc(100vh - 60px);
}
</style>
