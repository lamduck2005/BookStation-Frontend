<template>
  <div class="profile-change-password">
    <!-- Warning Alert -->
    <div class="alert alert-warning d-flex align-items-center mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span>Bạn vui lòng cắp nhật thông tin tài khoản:</span>
      <a href="#" class="ms-2 text-primary fw-bold">Cắp nhật thông tin ngay</a>
    </div>

    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Đổi mật khẩu</h2>
    </div>

    <!-- Change Password Form -->
    <div class="change-password-form-card">
      <form @submit.prevent="changePassword">
        <div class="mb-4">
          <label for="currentPassword" class="form-label">Mật khẩu hiện tại *</label>
          <div class="input-group">
            <input 
              :type="showCurrentPassword ? 'text' : 'password'" 
              class="form-control" 
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              placeholder="Mật khẩu hiện tại"
              required
            />
            <button 
              class="btn btn-outline-secondary" 
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label for="newPassword" class="form-label">Mật khẩu mới *</label>
          <div class="input-group">
            <input 
              :type="showNewPassword ? 'text' : 'password'" 
              class="form-control" 
              id="newPassword"
              v-model="passwordForm.newPassword"
              placeholder="Mật khẩu mới"
              required
            />
            <button 
              class="btn btn-outline-secondary" 
              type="button"
              @click="showNewPassword = !showNewPassword"
            >
              <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <div class="password-requirements mt-2">
            <small class="text-muted">
              Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
            </small>
          </div>
        </div>

        <div class="mb-4">
          <label for="confirmPassword" class="form-label">Nhập lại mật khẩu mới *</label>
          <div class="input-group">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              class="form-control" 
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              required
            />
            <button 
              class="btn btn-outline-secondary" 
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <div v-if="passwordForm.confirmPassword && !passwordsMatch" class="mt-2">
            <small class="text-danger">Mật khẩu xác nhận không khớp</small>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-save" :disabled="!canSubmit">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>

    <!-- Security Tips -->
    <div class="security-tips mt-4">
      <h5 class="tips-title">
        <i class="bi bi-shield-check me-2"></i>
        Mẹo bảo mật
      </h5>
      <ul class="tips-list">
        <li>Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
        <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
        <li>Không sử dụng thông tin cá nhân dễ đoán</li>
        <li>Thay đổi mật khẩu định kỳ để tăng cường bảo mật</li>
        <li>Không chia sẻ mật khẩu với người khác</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { updateUserPass,fetchUserDetail } from '@/services/admin/user'
import { getUserId } from '@/utils/utils'
import { showToast } from '@/utils/swalHelper'

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Check if passwords match
const passwordsMatch = computed(() => {
  return passwordForm.newPassword === passwordForm.confirmPassword
})

// Check if form can be submitted
const canSubmit = computed(() => {
  return passwordForm.currentPassword &&
         passwordForm.newPassword &&
         passwordForm.confirmPassword &&
         passwordsMatch.value &&
         passwordForm.newPassword.length >= 6
})

// Validate password strength
const isPasswordStrong = (password) => {
  const strongPassword = /^.{6,}$/
  return strongPassword.test(password)
}

// Change password
const changePassword = async () => {
  if (!canSubmit.value) return;

  if (!isPasswordStrong(passwordForm.newPassword)) {
    // alert('Mật khẩu không đủ mạnh. Vui lòng sử dụng mật khẩu có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
    showToast('error', 'Mật khẩu không đủ mạnh', 'Vui lòng sử dụng mật khẩu có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
    return;
  }

  try {
    const userID = getUserId(); // Lấy ID người dùng từ localStorage hoặc cookie

    const res = await updateUserPass(userID, passwordForm.currentPassword, passwordForm.newPassword);

    if (res.data === true) {
      // alert('Đổi mật khẩu thành công!');
      showToast('success', 'Đổi mật khẩu thành công!');
      Object.assign(passwordForm, {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      showToast('warning','Mật khẩu hiện tại không đúng hoặc trùng mật khẩu cũ!');
    }

  } catch (error) {
    alert('Lỗi khi đổi mật khẩu. Vui lòng thử lại sau.');
    console.error(error);
  }
}

</script>

<style scoped>
.profile-change-password {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.change-password-form-card {
  padding-top: 24px;
  max-width: 500px;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.input-group .form-control {
  border-right: none;
}

.input-group .btn-outline-secondary {
  border-left: none;
  border-color: #ddd;
  color: #666;
}

.input-group .btn-outline-secondary:hover {
  background: #f8f9fa;
  border-color: #ddd;
  color: #333;
}

.form-control {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-control::placeholder {
  color: #999;
}

.password-requirements {
  font-size: 12px;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.btn-save {
  background: #dc3545;
  border: none;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.btn-save:hover:not(:disabled) {
  background: #c82333;
}

.btn-save:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.security-tips {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #28a745;
}

.tips-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.tips-title i {
  color: #28a745;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
}

.tips-list li {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.tips-list li:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .profile-change-password {
    padding: 16px;
  }
  
  .change-password-form-card {
    max-width: none;
  }
  
  .form-actions {
    margin-top: 24px;
  }
  
  .btn-save {
    width: 100%;
  }
}
</style>
