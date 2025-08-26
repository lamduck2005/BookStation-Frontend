<template>
  <div class="pos-customer-info">
    <div class="section-header">
      <h6 class="section-title">
        <i class="bi bi-person"></i>
        Thông tin khách hàng
      </h6>
    </div>

    <!-- Chọn loại khách -->
    <div class="customer-type-selector" v-if="!selectedCustomer">
      <button
        class="customer-type-btn"
        :class="{ active: customerType === 'guest' }"
        @click="setCustomerType('guest')"
      >
        <i class="bi bi-person"></i>
        Khách vãng lai
      </button>
      <button
        class="customer-type-btn"
        :class="{ active: customerType === 'registered' }"
        @click="setCustomerType('registered')"
      >
        <i class="bi bi-person-check"></i>
        Khách có tài khoản
      </button>
    </div>

    <!-- Form nhập thông tin khách vãng lai -->
    <div
      v-if="customerType === 'guest' && !selectedCustomer"
      class="guest-form"
    >
      <div class="form-group">
        <label class="form-label">Tên khách hàng *</label>
        <input
          v-model="guestInfo.customerName"
          class="form-input"
          placeholder="Nhập họ và tên khách hàng"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-label">Số điện thoại *</label>
        <input
          v-model="guestInfo.customerPhone"
          class="form-input"
          placeholder="Nhập số điện thoại"
          pattern="[0-9]{10}"
          required
        />
      </div>
      <button
        class="save-btn"
        @click="saveGuestInfo"
        :disabled="!guestInfo.customerName || !guestInfo.customerPhone"
      >
        <i class="bi bi-check-lg"></i>
        Xác nhận
      </button>
    </div>

    <!-- Tìm kiếm khách hàng có tài khoản -->
    <div
      v-if="customerType === 'registered' && !selectedCustomer"
      class="customer-search"
    >
      <div class="form-group">
        <label class="form-label">Tìm kiếm khách hàng</label>
        <div class="search-input-wrap">
          <input
            v-model="searchTerm"
            class="form-input"
            placeholder="Nhập số điện thoại hoặc tên khách hàng"
            @input="searchCustomers"
            @focus="showDropdown = true"
          />
          <i class="bi bi-search search-icon"></i>
        </div>
      </div>

      <!-- Dropdown kết quả tìm kiếm -->
      <div
        v-if="showDropdown && searchResults.length > 0"
        class="search-dropdown"
      >
        <div
          v-for="customer in searchResults"
          :key="customer.id"
          class="customer-option"
          @click="selectRegisteredCustomer(customer)"
        >
          <div class="customer-avatar">
            {{ getInitials(customer.fullName) }}
          </div>
          <div class="customer-details">
            <div class="customer-name">{{ customer.fullName }}</div>
            <div class="customer-phone">{{ customer.phoneNumber }}</div>
            <div class="customer-email" v-if="customer.email">
              {{ customer.email }}
            </div>
          </div>
        </div>
      </div>

      <!-- Thông báo không tìm thấy -->
      <div
        v-if="showDropdown && searchTerm && searchResults.length === 0"
        class="no-results"
      >
        <i class="bi bi-search"></i>
        <span>Không tìm thấy khách hàng nào</span>
      </div>
    </div>

    <!-- Hiển thị thông tin khách đã chọn -->
    <div v-if="selectedCustomer" class="selected-customer">
      <div class="customer-card">
        <div class="customer-info">
          <div class="customer-avatar">
            <i v-if="selectedCustomer.isGuest" class="bi bi-person"></i>
            <span v-else>{{
              getInitials(
                selectedCustomer.customerName || selectedCustomer.fullName
              )
            }}</span>
          </div>
          <div class="customer-details">
            <div class="customer-name">
              {{ selectedCustomer.customerName || selectedCustomer.fullName }}
              <span v-if="selectedCustomer.isGuest" class="guest-badge"
                >Vãng lai</span
              >
            </div>
            <div class="customer-phone">
              <i class="bi bi-telephone"></i>
              {{
                selectedCustomer.customerPhone || selectedCustomer.phoneNumber
              }}
            </div>
            <div v-if="selectedCustomer.email" class="customer-email">
              <i class="bi bi-envelope"></i>
              {{ selectedCustomer.email }}
            </div>
          </div>
        </div>
        <button class="change-btn" @click="changeCustomer">
          <i class="bi bi-arrow-repeat"></i>
          Đổi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { userpos } from "@/services/admin/user";
import { addretailer } from "@/services/admin/user"; // Thêm dòng này

// Props
const props = defineProps({
  selectedCustomerData: {
    type: Object,
    default: null,
  },
});

// Emit để gửi thông tin khách hàng lên component cha
const emit = defineEmits(["customer-selected", "customer-changed"]);

// Data
const customerType = ref("guest"); // 'guest' | 'registered'
const selectedCustomer = ref(null);
const showDropdown = ref(false);

// Guest info
const guestInfo = ref({
  customerName: "",
  customerPhone: "",
});

// Registered customer search
const searchTerm = ref("");
const searchResults = ref([]);
let searchTimeout = null;

// Methods
const setCustomerType = (type) => {
  customerType.value = type;
  selectedCustomer.value = null;
  emit("customer-changed", null);

  // Reset forms
  if (type === "guest") {
    guestInfo.value = { customerName: "", customerPhone: "" };
  } else {
    searchTerm.value = "";
    searchResults.value = [];
  }
  showDropdown.value = false;
};

const saveGuestInfo = async () => {
  if (!guestInfo.value.customerName || !guestInfo.value.customerPhone) {
    return;
  }

  // Validate phone number (basic validation)
  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(guestInfo.value.customerPhone)) {
    alert(
      "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại 10 chữ số bắt đầu bằng 0."
    );
    return;
  }

  // Gọi API thêm khách vãng lai
  try {
    const response = await addretailer({
      fullName: guestInfo.value.customerName.trim(),
      phoneNumber: guestInfo.value.customerPhone.trim(),
    });
    const data = response.data?.data || {};
    const guestCustomer = {
      userId: data.id || null,
      customerName: data.fullName || guestInfo.value.customerName.trim(),
      customerPhone: data.phoneNumber || guestInfo.value.customerPhone.trim(),
      isGuest: true,
    };
    selectedCustomer.value = guestCustomer;
    emit("customer-selected", guestCustomer);
  } catch (error) {
    alert("Có lỗi khi thêm khách vãng lai!");
    console.error(error);
  }
};

const searchCustomers = async () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(async () => {
    if (searchTerm.value.trim().length >= 2) {
      try {
        const response = await userpos(searchTerm.value.trim());
        searchResults.value = response.data?.data || [];
      } catch (error) {
        console.error("Error searching customers:", error);
        searchResults.value = [];
      }
    } else {
      searchResults.value = [];
    }
  }, 300);
};

const selectRegisteredCustomer = (customer) => {
  const registeredCustomer = {
    userId: customer.id,
    customerName: customer.fullName,
    customerPhone: customer.phoneNumber,
    email: customer.email,
    fullName: customer.fullName,
    phoneNumber: customer.phoneNumber,
    isGuest: false,
  };

  selectedCustomer.value = registeredCustomer;
  showDropdown.value = false;
  emit("customer-selected", registeredCustomer);
};

const changeCustomer = () => {
  selectedCustomer.value = null;
  emit("customer-changed", null);

  // Reset forms
  if (customerType.value === "guest") {
    guestInfo.value = { customerName: "", customerPhone: "" };
  } else {
    searchTerm.value = "";
    searchResults.value = [];
  }
  showDropdown.value = false;
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Click outside to close dropdown
const handleClickOutside = (event) => {
  const container = event.target.closest(".customer-search");
  if (!container) {
    showDropdown.value = false;
  }
};

// Watch for changes from parent component
watch(
  () => props.selectedCustomerData,
  (newCustomer) => {
    selectedCustomer.value = newCustomer;
    if (newCustomer) {
      if (newCustomer.isGuest) {
        customerType.value = "guest";
        guestInfo.value = {
          customerName: newCustomer.customerName,
          customerPhone: newCustomer.customerPhone,
        };
      } else {
        customerType.value = "registered";
      }
    }
  },
  { immediate: true }
);

// Lifecycle
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});

// Watch for search term changes
watch(searchTerm, () => {
  if (searchTerm.value.trim()) {
    showDropdown.value = true;
    searchCustomers();
  } else {
    showDropdown.value = false;
    searchResults.value = [];
  }
});
</script>

<style scoped>
.pos-customer-info {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.customer-type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}

.customer-type-btn {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
}

.customer-type-btn:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.customer-type-btn.active {
  background: #e6f7f4;
  border-color: #00bfae;
  color: #00bfae;
}

.guest-form,
.customer-search {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  /* Thêm dòng này để dropdown bám sát input */
  position: relative;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: #00bfae;
  box-shadow: 0 0 0 0.2rem rgba(0, 191, 174, 0.25);
}

.search-input-wrap {
  position: relative;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
}

.save-btn {
  background: #00bfae;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  align-self: flex-end;
}

.save-btn:hover:not(:disabled) {
  background: #009688;
  transform: translateY(-1px);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.customer-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #f1f5f9;
}

.customer-option:last-child {
  border-bottom: none;
}

.customer-option:hover {
  background: #f8f9fa;
}

.no-results {
  padding: 16px;
  text-align: center;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.selected-customer {
  background: #f0fdf4;
  border-radius: 8px;
  padding: 16px;
}

.customer-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.customer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e6f7f4;
  color: #00bfae;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.customer-details {
  flex: 1;
  min-width: 0;
}

.customer-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.guest-badge {
  background: #fbbf24;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.customer-phone,
.customer-email {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.change-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.change-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .customer-type-selector {
    grid-template-columns: 1fr;
  }

  .customer-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .change-btn {
    align-self: stretch;
    justify-content: center;
  }
}
</style>
