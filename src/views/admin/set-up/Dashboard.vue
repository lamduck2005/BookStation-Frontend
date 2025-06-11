<script setup lang="ts">
import Card_Report from "./Card_Report.vue";
import Charts_Report from "./Charts_Report.vue";
import Table_User from "./Table_User.vue";
</script>

<template>
  <div class="content">
    <h2 class="mt-0 fw-bold">Admin Dashboard</h2>
    <div class="dashboard-container">
      <!-- Main Cards Section -->
      <div class="main-cards">
        <Card_Report />
      </div>
      <!-- Charts Section -->
      <div class="reports">
        <Charts_Report />
      </div>
    </div>
    <h2 class="mt-4">Statistics Reports</h2>
    <!-- Table for User Management -->
    <Table_User />
  </div>
</template>
