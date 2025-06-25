<template>
  <button class="btn btn-primary btn-sm py-2" :style="{ backgroundColor: '#33304e', borderColor: '#33304e' }" @click="$emit('click')">
    <i class="bi bi-plus-circle me-1"></i> Thêm mới
  </button>
</template>
<script setup>
// No props needed, emits click event
</script>
