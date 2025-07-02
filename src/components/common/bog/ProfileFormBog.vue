<template>
  <div class="section">
    <h5>Hồ sơ cá nhân</h5>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">Họ tên</label>
        <input
          v-model="localProfile.name"
          type="text"
          class="form-control"
          :placeholder="localProfile.name || 'Nhập họ'"
        />
      </div>
      <!-- <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input v-model="localProfile.phone" type="text" class="form-control" :value="localProfile.phone || '0336122352'">
      </div> -->
      <button type="submit" class="btn btn-primary">Thay đổi</button>
    </form>
  </div>
</template>

<script>
export default{
  name: 'ProfileFormBog',
  emits: ['profile-form-bog'],
}
</script>

<style scoped>
.section {
  background-color: #fff;
  padding: 15px;
  margin-top: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-weight: bold;
}
</style>
