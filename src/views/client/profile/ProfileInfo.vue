<template>
  <div class="profile-info">
    <!-- Warning Alert -->
    <div class="alert alert-warning d-flex align-items-center mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span>Bạn vui lòng cập nhật thông tin tài khoản:</span>
      <a href="#" class="ms-2 text-primary fw-bold">Cập nhật thông tin ngay</a>
    </div>

    <!-- User Benefits & Stats Card -->
    <div class="benefits-stats-card mb-4">
      <!-- Mascot -->
      <div class="mascot-section">
        <div class="mascot-bg">
          <img src="/src/assets/img/duck.png" alt="Mascot" class="mascot-img" />
        </div>
      </div>

      <!-- Benefits & Stats Content -->
      <div class="stats-content">
        <div class="row">
          <div class="col-md-6">
            <h4 class="section-title">Ưu đãi của bạn</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">F-Point hiện có</span>
                <span class="stat-value text-danger">{{ userStats.fPoints || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Freeship hiện có</span>
                <span class="stat-value text-danger">{{ userStats.freeship || 0 }} lần</span>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <h4 class="section-title">Thành tích năm 2025</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Số đơn hàng</span>
                <span class="stat-value text-danger">{{ userStats.orders || 0 }} đơn hàng</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Đã thanh toán</span>
                <span class="stat-value text-danger">{{ userStats.totalPaid || 0 }} đ</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Member Tier Progress -->
        <div class="member-tier-section mt-4">
          <h5 class="tier-title">Quyền lợi thành viên tại Fahasa.com</h5>
          <div class="tier-progress">
            <div class="tier-tabs">
              <div class="tier-tab" :class="{ active: currentTier === 'bronze' }">
                <div class="tier-icon bronze">
                  <i class="bi bi-circle-fill"></i>
                </div>
                <span>Hạng Bạc</span>
              </div>
              <div class="tier-tab" :class="{ active: currentTier === 'silver' }">
                <div class="tier-icon silver">
                  <i class="bi bi-circle-fill"></i>
                </div>
                <span>Hạng Vàng</span>
              </div>
              <div class="tier-tab" :class="{ active: currentTier === 'gold' }">
                <div class="tier-icon gold">
                  <i class="bi bi-gem"></i>
                </div>
                <span>Kim cương</span>
              </div>
            </div>
            
            <div class="tier-benefits">
              <div class="benefit-row">
                <span class="benefit-label">- Quà tặng sinh nhật:</span>
                <span class="benefit-status denied">✗</span>
              </div>
              <div class="benefit-row">
                <span class="benefit-label">- Ưu đãi freeship và mã giảm giá:</span>
                <span class="benefit-status denied">✗</span>
              </div>
              <div class="benefit-row">
                <span class="benefit-label">- Tỉ lệ tích lũy F-Point trên giá trị đơn hàng:</span>
                <span class="benefit-status">0,5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Form -->
    <div class="profile-form-card">
      <h3 class="form-title mb-4">Hồ sơ cá nhân</h3>
      
      <form @submit.prevent="updateProfile">
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Họ *</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="profileData.lastName"
              placeholder="Vũ"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Tên *</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="profileData.firstName"
              placeholder="Linh"
              required
            />
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Số điện thoại *</label>
            <div class="input-group">
              <input 
                type="tel" 
                class="form-control" 
                v-model="profileData.phone"
                placeholder="0346447583"
                required
              />
              <button class="btn btn-outline-primary" type="button">Thay đổi</button>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Email *</label>
            <div class="input-group">
              <input 
                type="email" 
                class="form-control" 
                v-model="profileData.email"
                placeholder="Chưa có email"
                required
              />
              <button class="btn btn-outline-primary" type="button">Thêm mới</button>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Giới tính</label>
            <select class="form-select" v-model="profileData.gender">
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Ngày sinh</label>
            <input 
              type="date" 
              class="form-control" 
              v-model="profileData.birthday"
            />
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12">
            <label class="form-label">Địa chỉ</label>
            <textarea 
              class="form-control" 
              rows="3" 
              v-model="profileData.address"
              placeholder="Nhập địa chỉ của bạn"
            ></textarea>
          </div>
        </div>

        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-danger px-4">
            Cập nhật thông tin
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// User stats data
const userStats = reactive({
  fPoints: 0,
  freeship: 0,
  orders: 0,
  totalPaid: 0
})

// Profile form data
const profileData = reactive({
  lastName: 'Vũ',
  firstName: 'Linh', 
  email: '',
  phone: '0346447583',
  gender: '',
  birthday: '',
  address: ''
})

// Methods
const updateProfile = () => {
  console.log('Updating profile:', profileData)
  // Add your API call here
}
</script>

<style scoped>
.profile-info {
  padding: 0;
}

/* Alert */
.alert-warning {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  color: #856404;
}

/* Benefits & Stats Card */
.benefits-stats-card {
  background: linear-gradient(135deg, #a5b4fc 0%, #e0e7ff 100%);
  border-radius: 16px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mascot-section {
  position: absolute;
  right: 32px;
  top: 32px;
}

.mascot-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.stats-content {
  position: relative;
  z-index: 2;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.7);
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
}

.discover-more {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

/* Profile Form Card */
.profile-form-card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-control, .form-select {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.input-group .btn {
  border: 1px solid #ddd;
  border-left: none;
  border-radius: 0 6px 6px 0;
  font-size: 14px;
  padding: 12px 16px;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  padding: 12px 32px;
  font-weight: 500;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

/* Responsive */
@media (max-width: 768px) {
  .benefits-stats-card {
    padding: 24px 16px;
  }
  
  .mascot-section {
    position: static;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .mascot-img {
    width: 80px;
    height: 80px;
  }
  
  .profile-form-card {
    padding: 24px 16px;
  }
  
  .stat-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
