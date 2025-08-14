<template>
  <button @click="$emit('quick-login')" class="quick-admin-btn">
    Vào nhanh admin(test)
  </button>
</template>

<script setup>
// Không cần props, chỉ emit event
</script>

<style scoped>
.quick-admin-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 10px 0px 0px;
}
.quick-admin-btn:hover {
  background: #1565c0;
}
</style>
