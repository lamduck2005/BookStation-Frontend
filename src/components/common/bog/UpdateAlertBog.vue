<template>
  <div class="alert alert-warning" role="alert">
    Bạn vui lòng cập nhật thông tin tài khoản:
    <a href="#" class="alert-link" @click.prevent="$emit('update-info')">
      Cập nhật thông tin ngay
    </a>
  </div>
</template>

<script>
export default {
  name: 'UpdateAlert',
  emits: ['update-info']
}
</script>

<style scoped>
.alert-warning {
  margin-top: 20px;
  background-color: #fff3cd;
  border-color: #ffeeba;
}
</style>
