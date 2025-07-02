<template>
  <div class="sidebar">
    <div class="rank-box">
      <div class="rank-icon">
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="28"
            cy="28"
            r="26"
            fill="#F4F6F8"
            stroke="#D1D5DB"
            stroke-width="2"
          />
          <path d="M28 16L32 28H24L28 16Z" fill="#B0B6BE" />
          <circle cx="28" cy="36" r="6" fill="#B0B6BE" />
        </svg>
      </div>
      <div class="rank-label" title="Thành viên Bạc">Thành viên Bạc</div>
      <div class="rank-desc">F-Point tích lũy 0</div>
      <div class="rank-progress">
        Thêm <span class="highlight">30.000</span> để nâng hạng Vàng
      </div>
    </div>
    <ul class="account-menu">
      <li>
        <button class="menu-group" @click="toggleAccountMenu">
          <i class="bi bi-person"></i>
          <span :class="{ active: accountMenuOpen }">Thông tin tài khoản</span>
          <i
            class="bi bi-chevron-down chevron"
            :class="{ rotate: accountMenuOpen }"
          ></i>
        </button>
        <ul v-show="accountMenuOpen" class="submenu">
          <li><router-link to="/info">Hồ sơ cá nhân</router-link></li>
          <li><router-link to="/addresses">Số địa chỉ</router-link></li>
          <li><router-link to="/change-password">Đổi mật khẩu</router-link></li>
          <li>
            <router-link to="/invoice-info"
              >Thông tin xuất hóa đơn GTGT</router-link
            >
          </li>
          <li>
            <router-link to="/member-benefit" class="text-danger"
              >Ưu đãi thành viên</router-link
            >
          </li>
        </ul>
      </li>
      <li>
        <router-link to="/orders">
          <i class="bi bi-journal-text"></i>
          <span>Đơn hàng của tôi</span>
        </router-link>
      </li>
      <li>
        <router-link to="/vouchers">
          <i class="bi bi-ticket"></i>
          <span>Ví voucher</span>
          <span class="badge badge-danger">{{ voucherCount }}</span>
        </router-link>
      </li>
      <li>
        <router-link to="/fpoint">
          <i class="bi bi-coin"></i>
          <span>Tài Khoản F-Point / Freeship</span>
        </router-link>
      </li>
      <li>
        <router-link to="/notifications">
          <i class="bi bi-bell"></i>
          <span>Thông Báo</span>
        </router-link>
      </li>
      <li>
        <router-link to="/favorites">
          <i class="bi bi-heart"></i>
          <span>Sản phẩm yêu thích</span>
        </router-link>
      </li>
      <li>
        <router-link to="/book-series">
          <i class="bi bi-book"></i>
          <span>Sách theo bộ</span>
        </router-link>
      </li>
      <li>
        <router-link to="/my-reviews">
          <i class="bi bi-chat-square-text"></i>
          <span>Nhận xét của tôi</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SidebarBog",
  emits: ["side-bar-bog"],
  data() {
    return {
      accountMenuOpen: true,
      voucherCount: 0, // Giá trị mặc định, không cần truyền từ cha
    };
  },
  methods: {
    toggleAccountMenu() {
      this.accountMenuOpen = !this.accountMenuOpen;
    },
  },
};
</script>

<style scoped>
.sidebar {
  background-color: #fff;
  padding: 24px 20px;
  height: 100vh;
  position: fixed;
  width: 320px;
  top: 50px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.1), 0 1.5px 6px 0 rgba(0, 0, 0, 0.08);
}
.rank-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  padding: 20px 10px 16px 10px;
  margin-bottom: 24px;
  width: 100%;
}
.rank-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 8px;
}
.rank-label {
  background: #e0e3e7;
  color: #555;
  font-weight: 600;
  border-radius: 16px;
  padding: 4px 18px;
  font-size: 15px;
  margin-bottom: 4px;
  margin-top: 2px;
  cursor: pointer;
}
.rank-desc {
  color: #888;
  font-size: 14px;
  margin-bottom: 2px;
}
.rank-progress {
  color: #888;
  font-size: 13px;
}
.rank-progress .highlight {
  color: #dc3545;
  font-weight: 600;
}
.account-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.account-menu > li {
  margin-bottom: 2px;
}
.menu-group {
  background: none;
  border: none;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #d32f2f;
  padding: 8px 0 8px 0;
  cursor: pointer;
  outline: none;
}
.menu-group .chevron {
  margin-left: auto;
  transition: transform 0.2s;
}
.menu-group .chevron.rotate {
  transform: rotate(180deg);
}
.menu-group span.active {
  color: #d32f2f;
}
.submenu {
  list-style: none;
  padding-left: 32px;
  margin: 0 0 8px 0;
}
.submenu li {
  margin-bottom: 2px;
}
.submenu a {
  color: #222;
  font-size: 15px;
  text-decoration: none;
  display: block;
  padding: 4px 0;
}
.submenu a.text-danger {
  color: #d32f2f;
}
.account-menu > li > a,
.account-menu > li > router-link {
  display: flex;
  align-items: center;
  color: #222;
  font-size: 16px;
  text-decoration: none;
  padding: 8px 0;
  font-weight: 500;
}
.account-menu > li > a:hover,
.account-menu > li > router-link:hover {
  color: #d32f2f;
}
.account-menu i {
  font-size: 20px;
  margin-right: 10px;
}
.badge-danger {
  background-color: #dc3545;
  color: #fff;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 13px;
  margin-left: 8px;
  font-weight: 600;
}
</style>
