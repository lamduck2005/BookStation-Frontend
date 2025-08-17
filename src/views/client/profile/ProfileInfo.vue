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
      

      <!-- Benefits & Stats Content -->
      <div class="stats-content">
        <div class="row">
          <div class="col-md-6">
            <h4 class="section-title">Ưu đãi của bạn</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">B-Point hiện có</span>
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
            <h4 class="section-title">Thành tích của bạn</h4>
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
        <!-- <div class="member-tier-section mt-4">
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
                  >- Tỉ lệ tích lũy B-Point trên giá trị đơn hàng:</span
                >
                <span class="benefit-status">0,5%</span>
              </div>
            </div>
          </div>
        </div> -->
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
              <input type="text" class="form-control" v-model="user.email" />
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
import { getUserFromToken, getUserId } from "@/utils/utils";
// Import các hàm lấy thông tin từ token

// --- Ref duy nhất để chứa toàn bộ thông tin người dùng ---
const user = ref(null);
const userId = ref(getUserId()); // Lấy ID người dùng từ token
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
    const currentUserId = getUserId();
    if (!currentUserId) {
      setAlert(
        "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
        "alert-danger"
      );
      return;
    }

    console.log("Calling API with user ID:", currentUserId);

    // ✅ SỬA: Xử lý response đúng cách
    const response = await getProfile(currentUserId);
    console.log("Full API response:", response);

    // ✅ Kiểm tra response structure và extract data
    if (
      response &&
      response.data &&
      response.data.status === 200 &&
      response.data.data
    ) {
      const apiData = response.data.data;
      console.log("API data:", apiData);

      // ✅ Map tất cả fields cần thiết cho UI
      user.value = {
        // Basic profile fields
        id: apiData.user_id || currentUserId,
        email: apiData.email || "",
        fullName: apiData.full_name || "",
        phoneNumber: apiData.phone_number || "",

        // Stats fields (lấy từ API hoặc default)
        totalPoint: apiData.total_point || 0,
        totalSpent: apiData.total_spent || 0,

        // ✅ CẦN THIẾT cho UI - nếu API có thì lấy, không thì default
        freeship: apiData.freeship || 0, // Hiển thị trong template
        orders: apiData.total_orders || 0, // Hiển thị trong template
      };

      console.log("Mapped user data:", user.value);

      
    } else {
      // ✅ SỬA: Xử lý khi response không đúng structure
      console.error("Invalid response structure:", response);
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("Lỗi khi tải thông tin cá nhân:", error);
    setAlert("Không thể tải thông tin cá nhân từ server.", "alert-danger");
  }
});

// Hàm cập nhật thông tin
const update = async () => {
  // ✅ Validation như cũ
  if (!user.value.fullName || !user.value.phoneNumber || !user.value.email) {
    showToast("warning", "Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.value.email)) {
    showToast("warning", "Vui lòng nhập đúng định dạng email.");
    return;
  }

  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(user.value.phoneNumber)) {
    showToast(
      "warning",
      "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số."
    );
    return;
  }

  // ✅ Sử dụng ID từ token
  const userId = getUserId();
  if (!userId) {
    showToast(
      "error",
      "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
    );
    return;
  }

  try {
    // ✅ SỬA: Chỉ gửi thông tin cần thiết, không gửi stats
    const updateData = {
      fullName: user.value.fullName,
      phoneNumber: user.value.phoneNumber,
      email: user.value.email,
    };

    console.log("Update data being sent:", updateData);

    const response = await updateProfile(userId, updateData);

    console.log("Update response:", response);

    if (response.data && response.data.status === 200) {
      showToast("success", "Cập nhật thông tin thành công!");

      // ✅ Cập nhật token nếu cần (nếu backend trả về token mới)
      if (response.data.newToken) {
        localStorage.setItem("authToken", response.data.newToken);
      }

      // ✅ Reload lại thông tin sau khi update thành công
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      showToast("error", response.data.message || "Đã có lỗi xảy ra.");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);

    // ✅ Log chi tiết lỗi để debug
    console.error("Error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // ✅ Hiển thị lỗi cụ thể từ backend
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.";

    showToast("error", errorMessage);
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
