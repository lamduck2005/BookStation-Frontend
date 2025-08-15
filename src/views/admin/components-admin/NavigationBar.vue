<template>
  <nav>
    <form action="#">
      <div class="input-group">
        <Multiselect 
          v-model="selectedRoute"
          :options="adminRoutes"
          :searchable="true"
          :internal-search="true"
          :close-on-select="true"
          :clear-on-select="false"
          label="name"
          track-by="path"
          placeholder="Tìm kiếm chức năng... (Ctrl+Shift+F)"
          @select="navigateToRoute"
          @keydown="handleKeydown"
        >
          <!-- Tùy chỉnh hiển thị option -->
          <template v-slot:option="{ option }">
            <div class="d-flex flex-column">
              <strong>{{ option.name }}</strong>
              <small class="text-muted">{{ option.path }}</small>
            </div>
          </template>
        </Multiselect>
        
        <!-- Thông tin bổ sung cùng dòng -->
        <div class="nav-info">
          <div class="current-date">
            <i class="bx bx-calendar me-1"></i>
            {{ currentDate }}
          </div>
          <div class="current-time">
            <i class="bx bx-time me-1"></i>
            {{ currentTime }}
          </div>
        </div>
      </div>
    </form>
    <div class="nav-content">
      <div v-if="userInfo" class="user-info d-flex align-items-center">
        <span class="">Xin chào, <i class="fw-bold">{{ userInfo.fullName || userInfo.email }}</i>.</span>
      </div>
      <ul class="nav-account">
        <li class="user-link">
          <a href="#">
            <img src="../../../assets/img/avatar.png" alt="account" class="avatar" />
          </a>
          <div class="user-link-dropdown">
            <router-link to="/admin/account" class="user-dropdown">
              <i class="bx bxs-user"></i>
              <span>Hồ sơ</span>
            </router-link>
            <router-link to="/admin/dashboard" class="user-dropdown">
              <i class="bx bxs-chart-line"></i>
              <span>Tổng quan</span>
            </router-link>
            <!-- <a href="#" class="user-dropdown">
              <i class="bx bxs-cog"></i>
              <span>Cài đặt</span>
            </a> -->

            <div class="divider"></div>
            <a href="#" class="user-dropdown" @click="handleLogout">
              <i class='bxr  bx-arrow-out-right-square-half'></i>
              <span>Đăng xuất</span>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { showQuickConfirm, showToast } from '@/utils/swalHelper';
import { clearAuth, getUserFromToken } from '@/utils/utils';
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
// import Multiselect from '@vueform/multiselect';

const router = useRouter();
const userInfo = ref(null);
const selectedRoute = ref(null);
const currentTime = ref('');
const currentDate = ref('');

// Cập nhật thời gian
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  currentDate.value = now.toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Lấy routes từ router
const adminRoutes = computed(() => {
  const routes = router.getRoutes();
  return routes
    .filter(route => route.path.startsWith('/admin') && route.name && route.name !== 'admin')
    .map(route => ({
      path: route.path,
      name: route.name
    }));
});

// Hàm điều hướng đến route
const navigateToRoute = (route) => {
  if (route) {
    router.push(route.path);
    selectedRoute.value = null; // Reset selection
  }
};

// Hàm xử lý phím tắt Ctrl+Shift+F
const handleKeydown = (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'F') {
    event.preventDefault();
    // Focus vào Multiselect
    const multiselectInput = document.querySelector('.multiselect__input');
    if (multiselectInput) {
      multiselectInput.focus();
    }
  }
};



const handleLogout = () => {
  showQuickConfirm('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', 'question', 'Đăng xuất', 'Hủy', 'btn-danger', 'btn-secondary').then((result) => {
    if (result.isConfirmed) {
      showToast('success', 'Đăng xuất thành công');
      clearAuth();
      router.push('/auth');
    }
  });
}

const handleGetUserInfo = async () => {
  userInfo.value = await getUserFromToken();
}

onMounted(() => {
  handleGetUserInfo();
  
  // Thêm event listener cho phím tắt
  document.addEventListener('keydown', handleKeydown);
  // Cập nhật thời gian mỗi giây
  setInterval(updateTime, 1000);
  updateTime(); // Hiển thị lần đầu khi component được mount
});

onUnmounted(() => {
  // Cleanup event listener
  document.removeEventListener('keydown', handleKeydown);
});

</script>

<style scoped>
@import '@/assets/css/vue-multiselect.css';

nav {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 0.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* border-radius: 12px; */
}

.input-group {
  display: flex;
  align-items: center;
  background: transparent;
  border-radius: 8px;
  padding: 0;
  position: relative;
  width: 100%;
  max-width: 600px;
  gap: 15px;
}

/* Multiselect styling */
.input-group .multiselect {
  min-height: 42px;
  border-radius: 8px;
  background: #f1f3f6;
  flex: 1;
  min-width: 280px;
}

.input-group .multiselect__tags {
  border: none;
  background: transparent;
  padding: 8px 10px;
  min-height: 42px;
}

.input-group .multiselect__input {
  background: transparent;
  font-size: 1rem;
  color: #333;
}

.input-group .multiselect__placeholder {
  color: #9ca3af;
  font-size: 0.875rem;
  padding-top: 0;
  margin-bottom: 0;
}

.input-group .multiselect__single {
  color: #333;
  font-size: 1rem;
  padding: 0;
  margin-bottom: 0;
}

.btn {
  background: #4f8cff;
  border: none;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
}

.btn:hover {
  background: #2563eb;
}

.nav-content {
  display: flex;
  align-items: center;
}

.nav-account {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

.user-link {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4f8cff;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.avatar:hover {
  box-shadow: 0 0 0 3px #e0e7ff;
}

.user-info {
  margin-right: 10px;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.user-link-dropdown {
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  min-width: 180px;
  z-index: 100;
  padding: 10px 0;
}

.user-link:hover .user-link-dropdown,
.user-link .user-link-dropdown:hover {
  display: block;
}

.user-dropdown {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  transition: background 0.18s;
  cursor: pointer;
}

.user-dropdown i {
  margin-right: 10px;
  font-size: 1.2rem;
}

.user-dropdown:hover {
  background: #f1f5fa;
  color: #2563eb;
}

.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}

/* Thông tin bổ sung */
.nav-info {
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;
  gap: 10px;
  flex-shrink: 0;
}

.current-time,
.current-date {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: #f8fafc;
  border-radius: 6px;
  transition: all 0.2s;
  white-space: nowrap;
}

.current-time i,
.current-date i {
  margin-right: 5px;
  font-size: 1rem;
  color: #4f8cff;
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  nav {
    padding: 0.5rem 1rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .input-group {
    width: 100%;
    max-width: 100%;
    flex-direction: column;
    gap: 10px;
  }
  
  .input-group .multiselect {
    min-width: 100%;
  }
  
  .nav-info {
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .current-time,
  .current-date {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
  
  .nav-content {
    width: 100%;
    justify-content: center;
  }
}
</style>
