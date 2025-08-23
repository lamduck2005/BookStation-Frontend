<template>
  <!-- filepath: d:\BookStation-Frontend\src\views\admin\set-up\Account.vue -->
  <div class="account-container">
    <div class="account-wrapper">
      <!-- Header với avatar và thông tin cơ bản -->
      <div class="account-header">
        <div class="avatar-section">
          <img
            src="/src/assets/img/avatar.png"
            alt="Avatar người dùng"
            class="user-avatar"
           
          />
        </div>
        <div class="header-info">
          <h2 class="user-name">
            {{ userProfile.full_name || "Chưa có tên" }}
          </h2>
          <p class="user-email">{{ userProfile.email }}</p>
          <div class="user-meta">
            <span class="user-id">ID: {{ userProfile.user_id || "N/A" }}</span>
            <span class="user-role">
              {{ getRoleInVietnamese(userProfile.role_name) }}
            </span>
          </div>
        </div>
        <button class="edit-btn" @click="toggleEditMode">
          {{ isEditMode ? "Hủy" : "Chỉnh sửa" }}
        </button>
      </div>

      <!-- Form thông tin -->
      <div class="account-form">
        <div class="form-row">
          <!-- Cột trái -->
          <div class="form-column">
            <div class="form-group">
              <label class="form-label">Họ và tên</label>
              <input
                type="text"
                class="form-input"
                placeholder="Nhập họ và tên"
                v-model="editData.full_name"
                :disabled="!isEditMode"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-input"
                placeholder="Nhập địa chỉ email"
                v-model="editData.email"
                :disabled="!isEditMode"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Số điện thoại</label>
              <input
                type="text"
                class="form-input"
                placeholder="Nhập số điện thoại"
                v-model="editData.phone_number"
                :disabled="!isEditMode"
              />
            </div>
          </div>

          <!-- Cột phải -->
          <div class="form-column">
            <div class="form-group">
              <label class="form-label">Vai trò</label>
              <input
                type="text"
                class="form-input"
                :value="getRoleInVietnamese(userProfile.role_name)"
                disabled
                readonly
              />
            </div>

            <div class="form-group">
              <label class="form-label">Trạng thái</label>
              <select
                class="form-input"
                v-model="editData.status"
                :disabled="!isEditMode"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
                <option value="BANNED">Bị khóa</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Ngày tạo</label>
              <input
                type="text"
                class="form-input"
                :value="formatDate(userProfile.created_at)"
                disabled
                readonly
              />
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="form-actions" v-if="isEditMode">
          <button class="btn-save" @click="saveProfile">
            <i class="bi bi-check-lg me-2"></i>
            Lưu thay đổi
          </button>
          <button class="btn-cancel" @click="cancelEdit">
            <i class="bi bi-x-lg me-2"></i>
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// filepath: d:\BookStation-Frontend\src\views\admin\set-up\Account.vue
import { ref, onMounted } from "vue";
import { getUserId } from "@/utils/utils.js";
import { getProfile, updateProfile } from "@/services/admin/user.js";
import Swal from "sweetalert2";

// Reactive data
const userProfile = ref({});
const editData = ref({});
const isEditMode = ref(false);
const loading = ref(false);

// Lấy profile khi component mount
onMounted(() => {
  loadProfile();
});

// Load profile từ API
async function loadProfile() {
  loading.value = true;
  try {
    const userId = getUserId();
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy thông tin người dùng!",
      });
      return;
    }

    console.log("Calling API with user ID:", userId);

    const response = await getProfile(userId);
    console.log("Full API response:", response);

    if (
      response &&
      response.data &&
      response.data.status === 200 &&
      response.data.data
    ) {
      const apiData = response.data.data;
      console.log("API data:", apiData);

      userProfile.value = {
        user_id: apiData.user_id,
        full_name: apiData.full_name || "",
        email: apiData.email || "",
        phone_number: apiData.phone_number || "",
        role_name: apiData.role_name || "",
        status: apiData.status || "ACTIVE",
        created_at: apiData.created_at || "",
      };

      // Copy data để edit
      editData.value = { ...userProfile.value };
      console.log("Mapped user data:", userProfile.value);
    } else {
      console.error("Invalid response structure:", response);
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Không thể tải thông tin hồ sơ!",
    });
  } finally {
    loading.value = false;
  }
}

// Chuyển đổi role sang tiếng Việt
function getRoleInVietnamese(roleName) {
  const roleMap = {
    ADMIN: "Quản trị viên",
    STAFF: "Nhân viên",
    CUSTOMER: "Khách hàng",
    USER: "Người dùng",
    MANAGER: "Quản lý",
    MODERATOR: "Điều hành viên",
  };

  return roleMap[roleName] || roleName || "Chưa có vai trò";
}

// Toggle edit mode
function toggleEditMode() {
  if (isEditMode.value) {
    // Cancel edit
    editData.value = { ...userProfile.value };
  }
  isEditMode.value = !isEditMode.value;
}

// Save profile
async function saveProfile() {
  try {
    const userId = getUserId();

    // Validate dữ liệu trước khi gửi
    if (!editData.value.full_name || !editData.value.email) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng điền đầy đủ họ tên và email!",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.value.email.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Định dạng email không đúng!",
      });
      return;
    }

    // Gửi dữ liệu theo đúng định dạng Entity User
    const updateData = {
      fullName: editData.value.full_name?.trim(), // ✅ Đổi thành camelCase
      phoneNumber: editData.value.phone_number?.trim() || "", // ✅ Đổi thành camelCase
      email: editData.value.email?.trim(),
      status:
        editData.value.status === "ACTIVE"
          ? 1
          : editData.value.status === "INACTIVE"
          ? 0
          : 2, // ✅ Chuyển đổi status sang Byte
    };

    console.log("Sending update data:", updateData);
    console.log("JSON stringify:", JSON.stringify(updateData));

    const response = await updateProfile(userId, updateData);
    console.log("Server response:", response);

    if (response.data && response.data.status === 200) {
      // Tắt edit mode trước
      isEditMode.value = false;

      // Load lại data từ server
      await loadProfile();

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật hồ sơ thành công!",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      throw new Error(response.data?.message || "Update failed");
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    console.error("Error response:", error.response?.data);

    let errorMessage = "Không thể cập nhật hồ sơ!";

    if (error.response) {
      const errorData = error.response.data;
      switch (error.response.status) {
        case 400:
          errorMessage =
            errorData?.message ||
            "Dữ liệu không hợp lệ! Vui lòng kiểm tra lại thông tin.";
          break;
        case 401:
          errorMessage = "Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại.";
          break;
        case 403:
          errorMessage = "Bạn không có quyền thực hiện thao tác này!";
          break;
        case 404:
          errorMessage = "Không tìm thấy người dùng!";
          break;
        case 500:
          errorMessage = "Lỗi server, vui lòng thử lại sau!";
          break;
        default:
          errorMessage = errorData?.message || "Có lỗi xảy ra!";
      }
    } else if (error.request) {
      errorMessage =
        "Không thể kết nối đến server! Vui lòng kiểm tra kết nối mạng.";
    }

    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: errorMessage,
    });
  }
}

// Cancel edit
function cancelEdit() {
  editData.value = { ...userProfile.value };
  isEditMode.value = false;
}

// Format date
function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN");
}
</script>

<style scoped>
.account-container {
  width: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
}

.account-wrapper {
  width: 100%;
  background: white;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
}

/* Header */
.account-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 3rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
  position: relative;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.header-info {
  flex: 1;
}

.user-name {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
}

.user-email {
  margin: 0 0 0.25rem 0;
  opacity: 0.9;
  font-size: 1.125rem;
}

.user-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 0.5rem;
}

.user-id {
  background: rgba(255, 255, 255, 0.15);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Courier New", monospace;
}

.user-role {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Form */
.account-form {
  padding: 3rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #374151;
  font-size: 1rem;
}

.form-input {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

/* Action buttons */
.form-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-end;
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid #e5e7eb;
}

.btn-save,
.btn-cancel {
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 1rem;
  border: none;
}

.btn-save {
  background: #10b981;
  color: white;
}

.btn-save:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-cancel {
  background: #ef4444;
  color: white;
}

.btn-cancel:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 1200px) {
  .form-row {
    gap: 2rem;
  }

  .account-header {
    padding: 2rem;
  }

  .account-form {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .account-container {
    padding: 0;
  }

  .account-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
  }

  .user-avatar {
    width: 80px;
    height: 80px;
  }

  .user-name {
    font-size: 1.5rem;
  }

  .user-meta {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .account-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
