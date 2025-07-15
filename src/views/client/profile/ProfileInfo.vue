<template>
  <div class="profile-info">
    <!-- DYNAMIC ALERT BLOCK -->
    <div
      v-if="alert.message"
      :class="['alert', alert.type, 'd-flex', 'align-items-center', 'mb-4']"
      role="alert"
    >
      <i :class="['bi', alert.icon, 'me-2']"></i>
      <span>{{ alert.message }}</span>
    </div>

    <!-- User Benefits & Stats Card -->
    <div v-if="user" class="benefits-stats-card mb-4">
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
                <span class="stat-value text-danger">{{
                  user.totalPoint || 0
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Freeship hiện có</span>
                <span class="stat-value text-danger"
                  >{{ user.freeship || 0 }} lần</span
                >
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <h4 class="section-title">Thành tích năm 2025</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Số đơn hàng</span>
                <span class="stat-value text-danger"
                  >{{ user.orders || 0 }} đơn hàng</span
                >
              </div>
              <div class="stat-item">
                <span class="stat-label">Đã thanh toán</span>
                <span class="stat-value text-danger"
                  >{{ user.totalSpent || 0 }} đ</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Member Tier Progress -->
        <div class="member-tier-section mt-4">
          <h5 class="tier-title">Quyền lợi thành viên tại Fahasa.com</h5>
          <div class="tier-progress">
            <div class="tier-tabs">
              <div
                class="tier-tab"
                :class="{ active: currentTier === 'bronze' }"
              >
                <div class="tier-icon bronze">
                  <i class="bi bi-circle-fill"></i>
                </div>
                <span>Hạng Bạc</span>
              </div>
              <div
                class="tier-tab"
                :class="{ active: currentTier === 'silver' }"
              >
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
                <span class="benefit-label"
                  >- Ưu đãi freeship và mã giảm giá:</span
                >
                <span class="benefit-status denied">✗</span>
              </div>
              <div class="benefit-row">
                <span class="benefit-label"
                  >- Tỉ lệ tích lũy F-Point trên giá trị đơn hàng:</span
                >
                <span class="benefit-status">0,5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Form -->
    <div v-if="user" class="profile-form-card">
      <h3 class="form-title mb-4">Hồ sơ cá nhân</h3>

      <form @submit.prevent="update">
        <div class="row mb-3">
          <div class="col-12">
            <label class="form-label">Họ và tên *</label>
            <input type="text" class="form-control" v-model="user.fullName" />
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-md-6">
            <label class="form-label">Số điện thoại *</label>
            <input
              type="tel"
              class="form-control"
              v-model="user.phoneNumber"
              placeholder="Chưa có số điện thoại"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Email *</label>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="user.email"
                placeholder="Chưa có email"
              />
              <!-- <button class="btn btn-outline-primary" type="button">
                Thêm mới
              </button> -->
            </div>
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
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { getProfile, updateProfile } from "@/services/admin/user";
import { showToast } from "@/utils/swalHelper";
// --- Ref duy nhất để chứa toàn bộ thông tin người dùng ---
const user = ref(null);

// --- Alert State ---
const alert = ref({
  message: "",
  type: "",
  icon: "",
});

// Hàm để hiển thị thông báo
const setAlert = (message, type = "alert-warning") => {
  alert.value.message = message;
  alert.value.type = type;
  if (type === "alert-success") {
    alert.value.icon = "bi-check-circle-fill";
  } else if (type === "alert-danger") {
    alert.value.icon = "bi-x-circle-fill";
  } else {
    alert.value.icon = "bi-exclamation-triangle-fill";
  }

  if (type === "alert-success" || type === "alert-danger") {
    setTimeout(() => {
      alert.value.message = "";
    }, 5000);
  }
};

// Lấy dữ liệu ban đầu
onMounted(async () => {
  try {
    const response = await getProfile();
    if (response.data && response.data.data) {
      user.value = response.data.data;
      console.log("Dữ liệu người dùng:", user.value);

      console.log("Thông tin người dùng:", user.value);
      // Kiểm tra nếu thông tin chưa đầy đủ thì hiển thị cảnh báo
      if (!user.value.phoneNumber || !user.value.fullName) {
        setAlert("Bạn vui lòng cập nhật đầy đủ thông tin tài khoản.");
      }
    }
  } catch (error) {
    console.error("Lỗi khi tải thông tin cá nhân:", error);
    setAlert("Không thể tải thông tin cá nhân.", "alert-danger");
  }
});

// Hàm cập nhật thông tin
const update = async () => {
  // Kiểm tra các trường bắt buộc
  if (!user.value.fullName || !user.value.phoneNumber || !user.value.email) {
    // Swal.fire({
    //   icon: "warning",
    //   title: "Thiếu thông tin",
    //   text: "Vui lòng nhập đầy đủ họ tên, số điện thoại và email.",
    // });
    showToast("warning", "Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  // Kiểm tra định dạng email đơn giản
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.value.email)) {
    // Swal.fire({
    //   icon: "warning",
    //   title: "Email không hợp lệ",
    //   text: "Vui lòng nhập đúng định dạng email.",
    // });
    showToast("warning", "Vui lòng nhập đúng định dạng email.");
    return;
  }

  // Kiểm tra số điện thoại (10 số, chỉ chứa số)
  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(user.value.phoneNumber)) {
    showToast(
      "warning",
      "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số."
    );
    return;
  }

  console.log("Dữ liệu cập nhật:", user.value);
  if (!user.value || !user.value.id) {
    // Swal.fire({
    //   icon: "error",
    //   title: "Lỗi",
    //   text: "Không tìm thấy thông tin người dùng để cập nhật.",
    // });
    showToast("error", "Không tìm thấy thông tin người dùng để cập nhật.");
    return;
  }

  try {
    const response = await updateProfile(user.value.id, user.value);
    console.log("Response từ cập nhật:", response);
    if (response.data && response.data.status === 200) {
      // Swal.fire({
      //   icon: "success",
      //   title: "Cập nhật thành công!",
      //   toast: true,
      //   position: "top-end",
      //   showConfirmButton: false,
      //   timer: 3000,
      //   timerProgressBar: true,
      // });
      showToast("success", "Cập nhật thông tin thành công!");
    } else {
      // Swal.fire({
      //   icon: "error",
      //   title: "Cập nhật thất bại",
      //   text: response.data.message || "Đã có lỗi xảy ra.",
      // });
      showToast("error", response.data.message || "Đã có lỗi xảy ra.");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    // Swal.fire({
    //   icon: "error",
    //   title: "Lỗi",
    //   text: "Đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.",
    // });
    showToast("error", "Đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.");
  }
};
</script>

<style scoped>
.profile-info {
  padding: 0;
}

/* Alert Styling */
.alert-warning {
  background-color: #fff3cd;
  border-color: #ffeeba;
  color: #856404;
}
.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}
.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
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

.form-control,
.form-select {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
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
