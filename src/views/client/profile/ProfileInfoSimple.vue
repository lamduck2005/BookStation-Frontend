<template>
  <div class="profile-info">
    <h2>Hồ sơ cá nhân</h2>
    <p>Đây là trang thông tin cá nhân của bạn.</p>
    
    <!-- Simple Stats Card -->
    <div class="stats-card">
      <h3>Thống kê tài khoản</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">F-Point hiện có</span>
          <span class="stat-value">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Freeship hiện có</span>
          <span class="stat-value">0 lần</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Số đơn hàng</span>
          <span class="stat-value">0 đơn hàng</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Đã thanh toán</span>
          <span class="stat-value">0 đ</span>
        </div>
      </div>
    </div>

    <!-- Profile Form -->
    <div class="profile-form">
      <h3>Thông tin cá nhân</h3>
      <form>
        <div class="form-row">
          <div class="form-group">
            <label>Họ *</label>
            <input type="text" class="form-control" placeholder="Nhập họ">
          </div>
          <div class="form-group">
            <label>Tên *</label>
            <input type="text" class="form-control" placeholder="Nhập tên">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Email *</label>
            <input type="email" class="form-control" placeholder="Nhập email">
          </div>
          <div class="form-group">
            <label>Số điện thoại *</label>
            <input type="tel" class="form-control" placeholder="Nhập số điện thoại">
          </div>
        </div>

        <button type="submit" class="btn-primary">Cập nhật thông tin</button>
      </form>
    </div>
  </div>
</template>

<script setup>
// Simple Profile Info component
console.log('ProfileInfo component loaded')
</script>

<style scoped>
.profile-info {
  padding: 20px;
}

.stats-card {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #dc3545;
}

.profile-form {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #333;
}

.form-control {
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 16px;
}

.btn-primary:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .stats-grid,
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
