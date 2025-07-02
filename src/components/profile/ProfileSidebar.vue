<template>
  <div class="profile-sidebar">
    <!-- User Info Card -->
    <div class="user-info-card">
      <div class="user-avatar">
        <div class="crown-icon">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="28" cy="28" r="26" fill="#F4F6F8" stroke="#D1D5DB" stroke-width="2"/>
            <path d="M28 16L32 28H24L28 16Z" fill="#B0B6BE"/>
            <circle cx="28" cy="36" r="6" fill="#B0B6BE"/>
          </svg>
        </div>
      </div>
      <div class="user-name">Vũ Linh</div>
      <div class="user-rank">
        <span class="rank-badge">Thành viên Bạc</span>
      </div>
      <div class="user-points">F-Point tích lũy 0</div>
      <div class="rank-progress">
        Thêm <span class="highlight">30.000</span> để nâng hạng Vàng
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="profile-nav">
      <ul class="nav-menu">
        <!-- Account Information Group -->
        <li class="nav-group">
          <button class="nav-group-btn" @click="toggleAccountMenu">
            <i class="bi bi-person-circle"></i>
            <span>Thông tin tài khoản</span>
            <i class="bi bi-chevron-down dropdown-icon" :class="{ 'rotate': isAccountMenuOpen }"></i>
          </button>
          <ul class="nav-submenu" :class="{ 'show': isAccountMenuOpen }">
            <li><RouterLink to="/profile/info" class="nav-sublink">Hồ sơ cá nhân</RouterLink></li>
            <li><RouterLink to="/profile/addresses" class="nav-sublink">Số địa chỉ</RouterLink></li>
            <li><RouterLink to="/profile/change-password" class="nav-sublink">Đổi mật khẩu</RouterLink></li>
            <li><RouterLink to="/profile/invoice" class="nav-sublink">Thông tin xuất hóa đơn GTGT</RouterLink></li>
            <li><RouterLink to="/profile/benefits" class="nav-sublink member-benefits">Ưu đãi thành viên</RouterLink></li>
          </ul>
        </li>

        <!-- Other Menu Items -->
        <li class="nav-item">
          <RouterLink to="/profile/orders" class="nav-link">
            <i class="bi bi-journal-text"></i>
            <span>Đơn hàng của tôi</span>
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/profile/vouchers" class="nav-link">
            <i class="bi bi-ticket-perforated"></i>
            <span>Ví voucher</span>
            <span class="voucher-count" v-if="voucherCount">{{ voucherCount }}</span>
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/profile/fpoint" class="nav-link">
            <i class="bi bi-coin"></i>
            <span>Tài Khoản F-Point / Freeship</span>
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/profile/notifications" class="nav-link">
            <i class="bi bi-bell"></i>
            <span>Thông Báo</span>
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/profile/favorites" class="nav-link">
            <i class="bi bi-heart"></i>
            <span>Sản phẩm yêu thích</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isAccountMenuOpen = ref(true)
const voucherCount = ref(37)

const toggleAccountMenu = () => {
  isAccountMenuOpen.value = !isAccountMenuOpen.value
}
</script>

<style scoped>
.profile-sidebar {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: sticky;
  top: 20px;
}

/* User Info Card */
.user-info-card {
  padding: 24px 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.user-avatar {
  margin-bottom: 12px;
}

.crown-icon {
  display: inline-block;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.rank-badge {
  background: #e8e8e8;
  color: #666;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.user-points {
  font-size: 14px;
  color: #666;
  margin: 8px 0 4px 0;
}

.rank-progress {
  font-size: 13px;
  color: #666;
}

.rank-progress .highlight {
  color: #dc3545;
  font-weight: 600;
}

/* Navigation */
.nav-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-group {
  border-bottom: 1px solid #f0f0f0;
}

.nav-group-btn {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #dc3545;
  transition: all 0.2s ease;
}

.nav-group-btn:hover {
  background-color: #f8f9fa;
}

.nav-group-btn i:first-child {
  font-size: 16px;
  margin-right: 12px;
  width: 16px;
}

.nav-group-btn span {
  flex: 1;
}

.dropdown-icon {
  font-size: 12px;
  transition: transform 0.2s ease;
}

.dropdown-icon.rotate {
  transform: rotate(180deg);
}

.nav-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #f8f9fa;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.nav-submenu.show {
  max-height: 300px;
}

.nav-submenu li {
  border-bottom: 1px solid #e9ecef;
}

.nav-submenu li:last-child {
  border-bottom: none;
}

.nav-sublink {
  display: block;
  padding: 12px 20px 12px 48px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.nav-sublink:hover {
  color: #dc3545;
  background-color: #fff;
}

.nav-sublink.router-link-active {
  color: #dc3545;
  font-weight: 500;
}

.nav-sublink.member-benefits {
  color: #dc3545;
  font-weight: 500;
}

.nav-item {
  border-bottom: 1px solid #f0f0f0;
}

.nav-item:last-child {
  border-bottom: none;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  color: #333;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #dc3545;
  background-color: #f8f9fa;
}

.nav-link.router-link-active {
  color: #dc3545;
  background-color: #f8f9fa;
  font-weight: 600;
}

.nav-link i {
  font-size: 16px;
  margin-right: 12px;
  width: 16px;
}

.voucher-count {
  background: #dc3545;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-sidebar {
    margin-bottom: 20px;
  }
}
</style>
