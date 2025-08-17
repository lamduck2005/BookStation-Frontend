<template>
  <div class="profile-sidebar">
    <!-- User Rank Card -->
    <div class="rank-card">
      <div class="rank-badge">Thành viên Bạc</div>
              <div class="rank-points">B-Point tích lũy 0</div>
      <div class="rank-progress">
        Thêm <span class="highlight">30.000</span> để nâng hạng Vàng
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="profile-nav">
      <ul class="nav-list">
        <!-- Account Information -->
        <li class="nav-item">
          <button class="nav-button" @click="toggleAccountMenu">
            <i class="bi bi-person"></i>
            <span>Thông tin tài khoản</span>
            <i class="bi bi-chevron-down chevron" :class="{ rotate: accountMenuOpen }"></i>
          </button>
          <ul v-show="accountMenuOpen" class="submenu">
            <li><RouterLink to="/profile/info" class="submenu-link">Hồ sơ cá nhân</RouterLink></li>
            <li><RouterLink to="/profile/addresses" class="submenu-link">Địa chỉ</RouterLink></li>
            <li><RouterLink to="/profile/change-password" class="submenu-link">Đổi mật khẩu</RouterLink></li>
            <li><RouterLink to="/profile/vouchers" class="submenu-link text-danger">Ưu đãi thành viên</RouterLink></li>
          </ul>
        </li>

        <!-- Orders -->
        <li class="nav-item">
          <RouterLink to="/profile/orders" class="nav-link">
            <i class="bi bi-journal-text"></i>
            <span>Đơn hàng của tôi</span>
          </RouterLink>
        </li>

        <!-- Vouchers -->
        <li class="nav-item">
          <RouterLink to="/profile/vouchers" class="nav-link">
            <i class="bi bi-ticket"></i>
            <span>Ví voucher</span>
          </RouterLink>
        </li>

        <!-- B-Point -->
        <li class="nav-item">
          <RouterLink to="/profile/fpoint" class="nav-link">
            <i class="bi bi-coin"></i>
            <span>B-Point / Freeship</span>
          </RouterLink>
        </li>

        <!-- Notifications -->
        <li class="nav-item">
          <RouterLink to="/profile/notifications" class="nav-link">
            <i class="bi bi-bell"></i>
            <span>Thông Báo</span>
          </RouterLink>
        </li>

        <!-- Favorites -->
        <li class="nav-item">
          <RouterLink to="/profile/favorites" class="nav-link">
            <i class="bi bi-heart"></i>
            <span>Sản phẩm yêu thích</span>
          </RouterLink>
        </li>

        <!-- Reviews -->
        <li class="nav-item">
          <RouterLink to="/profile/reviews" class="nav-link">
            <i class="bi bi-chat-square-text"></i>
            <span>Đánh giá của tôi</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const accountMenuOpen = ref(true)

const toggleAccountMenu = () => {
  accountMenuOpen.value = !accountMenuOpen.value
}

console.log('ProfileSidebar component loaded')
</script>

<style scoped>
.profile-sidebar {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 20px;
}

/* Rank Card */
.rank-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
}

.rank-badge {
  background: #e0e3e7;
  color: #555;
  font-weight: 600;
  border-radius: 16px;
  padding: 6px 16px;
  font-size: 14px;
  margin-bottom: 8px;
}

.rank-points {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 4px;
}

.rank-progress {
  color: #6c757d;
  font-size: 13px;
  text-align: center;
}

.rank-progress .highlight {
  color: #dc3545;
  font-weight: 600;
}

/* Navigation */
.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 2px;
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: #dc3545;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:hover {
  color: #b02a37;
}

.nav-button .chevron {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.nav-button .chevron.rotate {
  transform: rotate(180deg);
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #dc3545;
}

.nav-link.router-link-active {
  color: #dc3545;
  font-weight: 600;
}

.nav-button i,
.nav-link i {
  font-size: 18px;
  margin-right: 12px;
  width: 20px;
}

/* Submenu */
.submenu {
  list-style: none;
  padding: 0 0 8px 32px;
  margin: 0;
}

.submenu li {
  margin-bottom: 4px;
}

.submenu-link {
  display: block;
  padding: 8px 0;
  font-size: 15px;
  color: #495057;
  text-decoration: none;
  transition: color 0.2s ease;
}

.submenu-link:hover {
  color: #dc3545;
}

.submenu-link.router-link-active {
  color: #dc3545;
  font-weight: 500;
}

.submenu-link.text-danger {
  color: #dc3545;
}
</style>
