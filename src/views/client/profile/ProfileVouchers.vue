<template>
  <div class="profile-vouchers">
    <!-- Warning Alert
    <div class="alert alert-warning d-flex align-items-center mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span>Bạn vui lòng cắp nhật thông tin tài khoản:</span>
      <a href="#" class="ms-2 text-primary fw-bold">Cắp nhật thông tin ngay</a>
    </div> -->

    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Ví voucher</h2>
    </div>

    <!-- Voucher Tabs -->
    <div class="voucher-tabs mb-4">
      <button
        v-for="tab in voucherTabs"
        :key="tab.key"
        class="voucher-tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Vouchers List -->
    <div class="vouchers-list">
      <div v-if="loading" class="text-center my-4">Đang tải voucher...</div>
      <!-- <div v-if="error" class="alert alert-danger">{{ error }}</div> -->

      <div v-if="filteredVouchers.length === 0" class="no-vouchers">
        <div class="empty-state">
          <i class="bi bi-ticket-perforated text-muted"></i>
          <p class="text-muted">{{ getEmptyMessage() }}</p>
        </div>
      </div>

      <div v-else class="row">
        <div
          v-for="voucher in filteredVouchers"
          :key="voucher.id"
          class="col-lg-6 mb-4"
        >
          <div
            class="voucher-card"
            :class="{ expired: voucher.status === 'expired' }"
          >
            <!-- Voucher Icon -->
            <div class="voucher-icon">
              <div class="icon-bg" :class="voucher.type">
                <i class="bi bi-ticket-perforated"></i>
              </div>
            </div>

            <!-- Voucher Content -->
            <div class="voucher-content">
              <h5 class="voucher-title">{{ voucher.title }}</h5>
              <p class="voucher-description">{{ voucher.description }}</p>

              <div class="voucher-code">
                <span class="code-label">
                  <i class="bi bi-upc-scan me-1"></i>
                  {{ voucher.code }}
                </span>
              </div>

              <div class="voucher-expiry">
                <small class="text-muted"
                  >HSD: {{ formatDate(voucher.expiryDate) }}</small
                >
              </div>
            </div>

            <!-- Voucher Actions -->
            <div class="voucher-actions">
              <button
                class="btn btn-sm btn-primary"
                @click="viewVoucherDetails(voucher)"
              >
                Chi tiết
              </button>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="copyVoucherCode(voucher.code)"
              >
                Copy mã
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Voucher Detail Form Modal -->
    <div v-if="showDetail" class="voucher-detail-modal">
      <div class="voucher-detail-content">
        <h4>Chi tiết voucher</h4>
        <div><strong>Tên:</strong> {{ selectedVoucher.title }}</div>
        <div><strong>Mã:</strong> {{ selectedVoucher.code }}</div>
        <div><strong>Mô tả:</strong> {{ selectedVoucher.description }}</div>
        <div>
          <strong>HSD:</strong> {{ formatDate(selectedVoucher.expiryDate) }}
        </div>
        <button class="btn btn-secondary mt-3" @click="closeDetail">
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getUserId } from "@/utils/utils";
import {
  getVoucherWithNewUserId,
  getUserVoucher,
} from "@/services/client/userVoucher";
import { showToast } from "@/utils/swalHelper";

const activeTab = ref("available");
const voucherTabs = [
  { key: "available", label: "Voucher của tôi" },
];
const voucherChannel = new BroadcastChannel("voucher-status");

const vouchers = ref([]);
const loading = ref(false);
const error = ref(null);

// Lấy voucher từ API khi mounted
onMounted(async () => {
  loading.value = true;
  try {
    const res = await getUserVoucher(getUserId());
    let data = Array.isArray(res.data) ? res.data : [];
    // Gán thêm các trường cần thiết cho UI
    data = data.map((voucher) => ({
      ...voucher,
      title: voucher.name, // dùng name làm title
      expiryDate: voucher.endTime, // dùng endTime làm expiryDate
      category: "available", // hoặc "partner" nếu là voucher đối tác
      status: voucher.status === 1 ? "active" : "expired",
    }));
    vouchers.value = data;
  } catch (err) {
    error.value = "Không thể tải voucher.";
  } finally {
    loading.value = false;
  }
});

voucherChannel.onmessage = (event) => {
  if (event.data === "updated") {
    fetchVouchers();
    console.log("Đã nhận sự kiện voucher-status-updated qua BroadcastChannel");
  }
};
const filteredVouchers = computed(() =>
  vouchers.value.filter((voucher) => voucher.category === activeTab.value)
);

const formatDate = (dateValue) => {
  const date = new Date(Number(dateValue));
  return date.toLocaleDateString("vi-VN");
};

const getEmptyMessage = () => {
  return activeTab.value === "available"
    ? "Bạn chưa có voucher nào."
    : "Không có voucher đối tác nào khả dụng.";
};

// Copy voucher code
const copyVoucherCode = (code) => {
  navigator.clipboard
    .writeText(code)
    .then(() => {
      showToast("success", `Đã copy mã voucher: ${code}`);
    })
    .catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showToast("success", `Đã copy mã voucher: ${code}`);
    });
};

// Hiển thị form chi tiết voucher
const showDetail = ref(false);
const selectedVoucher = ref(null);

const viewVoucherDetails = (voucher) => {
  selectedVoucher.value = voucher;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  selectedVoucher.value = null;
};

const fetchVouchers = async () => {
  loading.value = true;
  try {
    const res = await getUserVoucher(getUserId());
    let data = Array.isArray(res.data) ? res.data : [];
    data = data.map((voucher) => ({
      ...voucher,
      title: voucher.name,
      expiryDate: voucher.endTime,
      category: "available",
      status: voucher.status === 1 ? "active" : "expired",
    }));
    vouchers.value = data;
  } catch (err) {
    error.value = "Không thể tải voucher.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.profile-vouchers {
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

.voucher-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e9ecef;
}

.voucher-tab {
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s ease;
}

.voucher-tab:hover {
  color: #333;
}

.voucher-tab.active {
  color: #dc3545;
  border-bottom-color: #dc3545;
}

.vouchers-list {
  margin-top: 24px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
}

.voucher-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  height: 100%;
}

.voucher-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.voucher-card.expired {
  background: #f8f9fa;
  color: #6c757d;
}

.voucher-icon {
  flex-shrink: 0;
}

.icon-bg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  font-size: 24px;
}

.icon-bg.discount {
  background: rgba(255, 255, 255, 0.2);
}

.icon-bg.percent {
  background: rgba(255, 255, 255, 0.2);
}

.icon-bg.freeship {
  background: rgba(255, 255, 255, 0.2);
}

.icon-bg.partner {
  background: rgba(255, 255, 255, 0.2);
}

.voucher-content {
  flex: 1;
  min-width: 0;
}

.voucher-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: inherit;
}

.voucher-description {
  font-size: 13px;
  line-height: 1.4;
  margin: 0 0 12px 0;
  opacity: 0.9;
}

.voucher-code {
  margin-bottom: 8px;
}

.code-label {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Courier New", monospace;
}

.voucher-expiry {
  font-size: 12px;
  opacity: 0.8;
}

.voucher-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.voucher-actions .btn {
  min-width: 80px;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 4px;
}

.voucher-actions .btn-primary {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.voucher-actions .btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.voucher-actions .btn-outline-secondary {
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  background: transparent;
}

.voucher-actions .btn-outline-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.voucher-card.expired .voucher-actions .btn {
  border-color: #6c757d;
  color: #6c757d;
}

.voucher-card.expired .voucher-actions .btn:hover {
  background: #6c757d;
  color: white;
}

.voucher-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.voucher-detail-content {
  background: #fff;
  padding: 32px 24px;
  border-radius: 8px;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .profile-vouchers {
    padding: 16px;
  }

  .voucher-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .voucher-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
