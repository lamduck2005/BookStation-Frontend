<template>
  <nav>
    <form action="#">
      <div class="input-group">
        <input type="text" class="input-field" placeholder="Tìm kiếm..." />
        <button class="btn" type="button">
          <i class="bx bx-search-big"></i>
        </button>
      </div>
    </form>
    <div class="nav-content">
      <ul class="nav-account">
        <li class="user-link">
          <a href="#">
            <img
              src="../../../assets/img/avatar.png"
              alt="account"
              class="avatar"
            />
          </a>
          <div class="user-link-dropdown">
            <a href="#" class="user-dropdown">
              <i class="bx bxs-user"></i>
              <span>Hồ sơ</span>
            </a>
            <a href="#" class="user-dropdown">
              <i class="bx bxs-chart-line"></i>
              <span>Phân tích</span>
            </a>
            <a href="#" class="user-dropdown">
              <i class="bx bxs-cog"></i>
              <span>Cài đặt</span>
            </a>
            
            <div class="divider"></div>
            <a href="#" class="user-dropdown" @click="handleLogout">
              <i class='bxr  bx-arrow-out-right-square-half'  ></i> 
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
import { clearAuth } from '@/utils/utils';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  showQuickConfirm('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', 'question', 'Đăng xuất', 'Hủy', 'btn-danger', 'btn-secondary').then((result) => {
    if (result.isConfirmed) {
      showToast('success', 'Đăng xuất thành công');
      clearAuth();
      router.push('/auth');
    }
  });
}
</script>

<style scoped>
nav {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 0.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* border-radius: 12px; */
}

.input-group {
  display: flex;
  align-items: center;
  background: #f1f3f6;
  border-radius: 8px;
  padding: 2px 8px;
}

.input-field {
  border: none;
  background: transparent;
  padding: 8px 10px;
  outline: none;
  font-size: 1rem;
  width: 280px;
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

.user-link-dropdown {
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>
