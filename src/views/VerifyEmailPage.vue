<template>
  <div class="verify-email-container">
    <div class="verify-email-card">
      <div class="loading-section">
        <div class="spinner"></div>
        <p>Đang xác thực email...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { verifyEmail } from '@/services/auth.js';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();

const handleVerifyEmail = async () => {
  try {
    const token = route.query.token;
    
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Token xác thực không hợp lệ',
        confirmButtonText: 'Đăng nhập',
        allowOutsideClick: false
      }).then(() => {
        router.push('/auth');
      });
      return;
    }
    
    const response = await verifyEmail(token);
    
    // Lấy status và message từ response
    const { status, message } = response.data;
    
    if (status === 200 || status === 201) {
      // Thành công - tự động chuyển hướng sau 10 giây
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: message || 'Email đã được xác thực thành công!',
        confirmButtonText: 'Đăng nhập ngay',
        allowOutsideClick: false,
        timer: 10000,
        timerProgressBar: true
      }).then(() => {
        router.push('/auth');
      });
      
      // Tự động chuyển hướng sau 10 giây
      setTimeout(() => {
        router.push('/auth');
      }, 10000);
    } else {
      // Có lỗi - hiển thị nút thử lại hoặc đóng
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: message || 'Có lỗi xảy ra khi xác thực email',
        showCancelButton: true,
        confirmButtonText: 'Thử lại',
        cancelButtonText: 'Đóng',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          // Nút "Thử lại" - reload lại trang
          window.location.reload();
        } else {
          // Nút "Đóng" - chuyển hướng sang auth
          router.push('/auth');
        }
      });
    }
  } catch (error) {
    console.error('Lỗi xác thực email:', error);
    
    // Lấy message từ error response nếu có
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xác thực email';
    
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: errorMessage,
      showCancelButton: true,
      confirmButtonText: 'Thử lại',
      cancelButtonText: 'Đóng',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        // Nút "Thử lại" - reload lại trang
        window.location.reload();
      } else {
        // Nút "Đóng" - chuyển hướng sang auth
        router.push('/auth');
      }
    });
  }
};

onMounted(() => {
  handleVerifyEmail();
});
</script>

<style scoped>
.verify-email-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
}

.verify-email-card {
  background: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.loading-section {
  padding: 20px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-section p {
  color: #666;
  font-size: 16px;
  margin: 0;
}
</style>
