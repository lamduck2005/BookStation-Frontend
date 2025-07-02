<template>
  <div class="profile-notifications">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Thông báo của tôi</h2>
    </div>
    
    <!-- Notification Component - Fullsize -->
    <div class="card shadow-sm">
      <NotificationComponent 
        mode="fullsize" 
        title="Thông báo"
        height="600px"
        max-height="800px"
        :items-per-page="12"
      />
    </div>
  </div>
</template>

<script setup>
import NotificationComponent from '@/components/common/NotificationComponent.vue'
</script>

<style scoped>
.profile-notifications {
  padding: 20px 0;
}
</style>
