<template>
  <div class="profile-layout">
    <div class="container-fluid py-4">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2">
          <ProfileSidebar />
        </div>
        
        <!-- Main Content -->
        <div class="col-md-9 col-lg-10">
          <div class="profile-content">
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
</script>

<style scoped>
.profile-layout {
  background-color: #ccd5db;
  min-height: 100vh;
}

.profile-content {
  background-color: transparent;
  padding: 0;
}

@media (max-width: 768px) {
  .col-md-3 {
    margin-bottom: 20px;
  }
}
</style>
