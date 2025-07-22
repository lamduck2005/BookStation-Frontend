<template>
  <div class="profile-sidebar">
    <!-- User Info Card -->
    <div class="user-info-card">
      <div class="user-avatar">
        <div class="crown-icon" :class="rankClass">
          <i class="bxr bx-crown" style="font-size: 48px"></i>
        </div>
      </div>
      <div class="user-name" v-if="user && user.full_name">
        {{ user.full_name }}
      </div>
      <div
        class="user-rank"
        v-if="userRank && userRank.rank"
        :class="rankClass"
      >
        <span class="rank-badge">Thành viên {{ userRank.rank.rankName }}</span>
      </div>
      <div class="user-points" v-if="user && user.total_point !== undefined">
        F-Point tích lũy {{ user.total_point }}
      </div>
      <!-- <div class="rank-progress">
        Thêm <span class="highlight">30.000</span> để nâng hạng Vàng
      </div> -->
      <div class="rank-progress" v-if="nextRankMessage">
        {{ nextRankMessage }}
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
            <i
              class="bi bi-chevron-down dropdown-icon"
              :class="{ rotate: isAccountMenuOpen }"
            ></i>
          </button>
          <ul class="nav-submenu" :class="{ show: isAccountMenuOpen }">
            <li>
              <RouterLink to="/profile/info" class="nav-sublink"
                >Hồ sơ cá nhân</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/profile/addresses" class="nav-sublink"
                >Số địa chỉ</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/profile/change-password" class="nav-sublink"
                >Đổi mật khẩu</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/profile/invoice" class="nav-sublink"
                >Thông tin xuất hóa đơn GTGT</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/profile/benefits"
                class="nav-sublink member-benefits"
                >Ưu đãi thành viên</RouterLink
              >
            </li>
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
            <span class="voucher-count" v-if="voucherCount">{{
              voucherCount
            }}</span>
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
import { ref, onMounted, computed } from "vue";
import {
  getProfile,
  fetchUserDetail,
  getUserRank,
} from "@/services/admin/user";
import { getUserId } from "@/utils/utils";

const isAccountMenuOpen = ref(true);
const voucherCount = ref(37);
const user = ref(null);
const userRank = ref({ rank: { rankName: "Vô Hạng" } });

// Define the setAlert function
const setAlert = (message, type = "alert-warning") => {
  console.log(`[${type.toUpperCase()}]: ${message}`);
  // Optionally, you can implement a UI alert system here
};
console.log(userRank.value);

// Fetch user data on mount
onMounted(async () => {
  try {
    const response = await fetchUserDetail(getUserId());
    if (response.data && response.data.data) {
      user.value = response.data.data;
      console.log("Dữ liệu người dùng:", user.value);

      // Check if user data is incomplete
      if (!user.value.phoneNumber || !user.value.fullName) {
        setAlert("Bạn vui lòng cập nhật đầy đủ thông tin tài khoản.");
      }
    }
  } catch (error) {
    console.error("Lỗi khi tải thông tin cá nhân:", error);
    setAlert("Không thể tải thông tin cá nhân.", "alert-danger");
  }
});
// alert(getUserId());

onMounted(async () => {
  try {
    const response = await getUserRank(getUserId());
    console.log("Dữ liệu trả về từ API:", response.data);
    const rankList = response.data?.data;

    if (Array.isArray(rankList)) {
      const activeRank = rankList.find((data) => data.status === 1);
      if (activeRank) {
        userRank.value = activeRank; // ✅ gán đúng object
        console.log("Dữ liệu hạng người dùng:", userRank.value);
      }
    } else {
      console.warn("Không tìm thấy dữ liệu hạng người dùng.");
    }
  } catch (error) {
    console.error("Lỗi khi tải thông tin hạng người dùng:", error);
    setAlert("Không thể tải thông tin hạng người dùng.", "alert-danger");
  }
});

const toggleAccountMenu = () => {
  isAccountMenuOpen.value = !isAccountMenuOpen.value;
};

const rankClass = computed(() => {
  if (userRank.value.rank.rankName === "BẠC") {
    return "rank-silver";
  } else if (userRank.value.rank.rankName === "VÀNG") {
    return "rank-gold";
  } else if (userRank.value.rank.rankName === "KIM CƯƠNG") {
    return "rank-diamond";
  }
  return "";
});

const nextRankMessage = computed(() => {
  const point = user.value?.total_point ?? 0;
  const currentRank = userRank.value.rank.rankName;

  if (currentRank === "KIM CƯƠNG") return ""; // Đã max rank

  if (point < 1000) {
    return `Cần thêm ${1000 - point} point để lên hạng BẠC`;
  } else if (point < 30000) {
    return `Cần thêm ${30000 - point} point để lên hạng VÀNG`;
  } else if (point < 150000) {
    return `Cần thêm ${150000 - point} point để lên hạng KIM CƯƠNG`;
  }else if (point => 150000) {
    return `Bạn đã đạt được thành tự người chinh phục đỉnh cao`;
  }

  return "";
});
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

/* .rank-progress {
  font-size: 13px;
  color: #666;
} */

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

.rank-silver .rank-badge {
  background: #d9d3d3; /* Màu bạc */
  color: #333;
}

.rank-gold .rank-badge {
  background: #ffd700; /* Màu vàng */
  color: #333;
}

.rank-diamond .rank-badge {
  background: #b9f2ff; /* Màu kim cương */
  color: #333;
}

.crown-icon.rank-silver i {
  color: #c0c0c0; /* bạc */
}

.crown-icon.rank-gold i {
  color: #ffd700; /* vàng */
}

.crown-icon.rank-diamond i {
  color: #00bcd4; /* xanh kim cương */
}
.rank-progress {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}
</style>
