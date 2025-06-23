<template>
  <div class="body">
    <div class="dashboard-container">
      <!-- Main Sidebar Section Begins  -->
      <SidebarA />
      <div class="main">
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
import FooterA from "./components-admin/FooterA.vue";
import NavA from "./components-admin/NavA.vue";
import SidebarA from "./components-admin/SidebarA.vue";
</script>
<style scoped>
.router {
  padding: 0.1rem;
  min-height: calc(100vh - 60px);
}
</style>
