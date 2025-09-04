<template>
  <div class="pos-payment">
    <!-- Scrollable content -->
    <div class="payment-content">
      <!-- Voucher Section -->
      <div class="voucher-section">
        <div class="section-header">
          <h6 class="section-title">
            <i class="bi bi-ticket-perforated"></i>
            Voucher
          </h6>
        </div>

        <div class="voucher-search">
          <div class="search-input-wrap">
            <input
              v-model="voucherSearchTerm"
              class="voucher-input"
              placeholder="Nhập mã voucher (F6)"
              @input="onVoucherSearch"
              @keyup.enter="applyVoucherByCode"
            />
            <button class="search-voucher-btn" @click="onVoucherSearch">
              <i class="bi bi-search"></i>
            </button>
          </div>

          <!-- Voucher search results -->
          <div
            v-if="showVoucherResults && voucherSearchResults.length > 0"
            class="voucher-dropdown"
          >
            <div
              v-for="voucher in voucherSearchResults"
              :key="voucher.id"
              class="voucher-option"
              @click="applyVoucher(voucher)"
            >
              <div class="voucher-info">
                <div class="voucher-name">{{ voucher.name }}</div>
                <div class="voucher-code">{{ voucher.code }}</div>
                <div class="voucher-desc">{{ voucher.description }}</div>
              </div>
              <div class="voucher-value">
                <span v-if="voucher.discountType === 'PERCENTAGE'">
                  -{{ voucher.discountPercentage }}%
                </span>
                <span v-else>
                  -{{ formatCurrency(voucher.discountAmount) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Applied vouchers -->
        <div v-if="appliedVouchers.length > 0" class="applied-vouchers">
          <div
            v-for="voucher in appliedVouchers"
            :key="voucher.id"
            class="applied-voucher"
          >
            <div class="voucher-details">
              <span class="voucher-name">{{ voucher.name }}</span>
              <span class="voucher-discount"
                >-{{ formatCurrency(voucher.discountAmount) }}</span
              >
            </div>
            <button
              class="remove-voucher-btn"
              @click="removeVoucher(voucher.id)"
            >
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="payment-section">
        <div class="section-header">
          <h6 class="section-title">
            <i class="bi bi-credit-card"></i>
            Phương thức thanh toán
          </h6>
        </div>

        <div class="payment-methods">
          <button
            class="pay-method"
            :class="{ active: paymentMethod === 'CASH' }"
            @click="paymentMethod = 'CASH'"
          >
            <i class="bi bi-cash"></i>
            Tiền mặt
          </button>
          <button
            class="pay-method"
            :class="{ active: paymentMethod === 'BANK_TRANSFER' }"
            @click="paymentMethod = 'BANK_TRANSFER'"
          >
            <i class="bi bi-bank"></i>
            Chuyển khoản
          </button>
        </div>

        <!-- Cash payment details -->
        <div v-if="paymentMethod === 'CASH'" class="cash-details">
          <div class="form-group">
            <label class="form-label">Tiền khách đưa</label>
            <input
              v-model.number="customerPaid"
              class="form-input editable-input"
              type="number"
              :placeholder="`Mặc định: ${formatCurrency(totalAmount)}`"
              min="0"
              step="1000"
              @input="calculateChange"
              @focus="$event.target.select()"
            />
            <div class="input-note">
              <i class="bi bi-info-circle"></i>
              Có thể chỉnh sửa số tiền khách đưa
            </div>
          </div>

          <div class="payment-summary">
            <div class="summary-row">
              <span>Tiền thừa trả khách:</span>
              <span
                class="change-amount"
                :class="{ negative: changeAmount < 0 }"
              >
                {{ formatCurrency(changeAmount) }}
              </span>
            </div>

            <!-- Cảnh báo khi thiếu tiền -->
            <div v-if="changeAmount < 0" class="insufficient-warning">
              <i class="bi bi-exclamation-triangle"></i>
              Thiếu {{ formatCurrency(Math.abs(changeAmount)) }}
            </div>
          </div>
        </div>

        <!-- Invoice checkbox -->
        <div class="invoice-section">
          <div class="invoice-checkbox">
            <label class="checkbox-container">
              <input
                v-model="wantInvoice"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkmark"></span>
              <span class="checkbox-label">
                <i class="bi bi-receipt"></i>
                Khách hàng muốn lấy hóa đơn PDF
              </span>
            </label>
            <div v-if="wantInvoice" class="invoice-note">
              <i class="bi bi-info-circle"></i>
              Hóa đơn sẽ được tự động tải xuống sau khi thanh toán thành công
            </div>
          </div>
        </div>

        <!-- Order notes -->
        <div class="form-group">
          <label class="form-label">Ghi chú đơn hàng</label>
          <textarea
            v-model="orderNotes"
            class="form-textarea"
            placeholder="Nhập ghi chú cho đơn hàng..."
            rows="2"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Confirm Payment Button -->
    <button
      class="confirm-btn"
      @click="showConfirmationPopup"
      :disabled="!canConfirmPayment"
    >
      <i class="bi bi-check-circle"></i>
      Xác nhận thanh toán (F9)
      <span class="payment-amount">{{ formatCurrency(totalAmount) }}</span>
    </button>

    <!-- Payment Confirmation Popup -->
    <div
      v-if="showConfirmPopup"
      class="popup-overlay"
      @click="closeConfirmPopup"
    >
      <div class="confirm-popup" @click.stop>
        <div class="popup-header">
          <h4 class="popup-title">
            <i class="bi bi-exclamation-circle"></i>
            Xác nhận thanh toán
          </h4>
          <button class="close-btn" @click="closeConfirmPopup">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div class="popup-content">
          <div class="confirmation-message">
            <p>
              Vui lòng kiểm tra lại thông tin đơn hàng trước khi thanh toán:
            </p>
          </div>

          <!-- Order Items Summary -->
          <div class="order-summary">
            <h5 class="summary-title">Chi tiết đơn hàng:</h5>
            <div class="items-list">
              <div
                v-for="item in orderItems"
                :key="item.bookId"
                class="item-row"
              >
                <div class="item-info">
                  <div class="item-name">{{ item.title || item.name }}</div>
                  <div class="item-details">
                    <div class="item-code">{{ item.bookCode }}</div>
                    <div class="item-price-detail">
                      {{ item.quantity }} × {{ formatCurrency(item.unitPrice) }}
                    </div>
                    <div v-if="item.isFlashSale" class="flash-sale-badge">
                      <i class="bi bi-lightning-fill"></i> Flash Sale
                    </div>
                  </div>
                </div>
                <div class="item-total">
                  {{ formatCurrency(item.quantity * item.unitPrice) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Applied Vouchers -->
          <div v-if="appliedVouchers.length > 0" class="vouchers-summary">
            <h5 class="summary-title">Voucher áp dụng:</h5>
            <div
              class="voucher-item"
              v-for="voucher in appliedVouchers"
              :key="voucher.id"
            >
              <span class="voucher-name">{{ voucher.name }}</span>
              <span class="voucher-discount"
                >-{{ formatCurrency(voucher.discountAmount) }}</span
              >
            </div>
          </div>

          <!-- Payment Summary -->
          <div class="payment-summary-popup">
            <div class="summary-row">
              <span>Tổng tiền hàng:</span>
              <span>{{ formatCurrency(calculateSubtotal()) }}</span>
            </div>
            <div
              v-if="totalVoucherDiscount > 0"
              class="summary-row discount-row"
            >
              <span>Giảm giá voucher:</span>
              <span>-{{ formatCurrency(totalVoucherDiscount) }}</span>
            </div>
            <div class="summary-row total-row">
              <span>Tổng thanh toán:</span>
              <span>{{ formatCurrency(totalAmount) }}</span>
            </div>
          </div>

          <!-- Payment Method Info -->
          <div class="payment-method-info">
            <h5 class="summary-title">Phương thức thanh toán:</h5>
            <div class="method-details">
              <i
                :class="paymentMethod === 'CASH' ? 'bi bi-cash' : 'bi bi-bank'"
              ></i>
              <span>{{
                paymentMethod === "CASH" ? "Tiền mặt" : "Chuyển khoản"
              }}</span>
            </div>

            <div v-if="paymentMethod === 'CASH'" class="cash-info">
              <div class="cash-row">
                <span>Tiền khách đưa:</span>
                <span>{{ formatCurrency(customerPaid) }}</span>
              </div>
              <div class="cash-row" v-if="changeAmount > 0">
                <span>Tiền thừa:</span>
                <span>{{ formatCurrency(changeAmount) }}</span>
              </div>
            </div>

            <!-- QR Code cho BANK_TRANSFER -->
            <div
              v-if="paymentMethod === 'BANK_TRANSFER'"
              class="qr-popup-section"
            >
              <div v-if="isGeneratingQr" class="qr-loading">
                <i class="bi bi-arrow-repeat"></i> Đang tạo mã QR...
              </div>
              <div v-else-if="qrImage" class="qr-image-container">
                <img :src="qrImage" alt="QR Code" class="qr-image-popup" />
                <p class="qr-info">Quét mã QR để thanh toán</p>
              </div>
              <div v-else class="qr-error">
                <i class="bi bi-exclamation-triangle"></i>
                Không thể tạo mã QR
              </div>
            </div>
          </div>

          <!-- Invoice Info -->
          <div v-if="wantInvoice" class="invoice-info">
            <h5 class="summary-title">
              <i class="bi bi-receipt"></i>
              Hóa đơn:
            </h5>
            <div class="invoice-details">
              <i class="bi bi-check-circle text-success"></i>
              <span>Sẽ tự động tải xuống hóa đơn PDF sau khi thanh toán</span>
            </div>
          </div>

          <!-- Order Notes -->
          <div v-if="orderNotes.trim()" class="notes-info">
            <h5 class="summary-title">Ghi chú:</h5>
            <p class="notes-text">{{ orderNotes }}</p>
          </div>
        </div>

        <div class="popup-footer">
          <button class="cancel-btn" @click="closeConfirmPopup">
            <i class="bi bi-x-circle"></i>
            Hủy
          </button>
          <button class="proceed-btn" @click="proceedPayment">
            <i class="bi bi-check-circle"></i>
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { searchVouchers as searchVouchersAPI } from "@/services/admin/counterSales";
import { generateQr } from "@/services/admin/qr";

// Props
const props = defineProps({
  totalAmount: {
    type: Number,
    default: 0,
  },
  orderItems: {
    type: Array,
    default: () => [],
  },
  selectedCustomer: {
    type: Object,
    default: null,
  },
  appliedVouchers: {
    type: Array,
    default: () => [],
  },
});

// Emit events
const emit = defineEmits([
  "voucher-applied",
  "voucher-removed",
  "payment-confirmed",
]);

// Data
const paymentMethod = ref("CASH");
const orderNotes = ref("");
const customerPaid = ref(0);
const changeAmount = ref(0);
const showConfirmPopup = ref(false);
const wantInvoice = ref(false); // New state for invoice checkbox

// Voucher data
const voucherSearchTerm = ref("");
const voucherSearchResults = ref([]);
const showVoucherResults = ref(false);
const appliedVouchers = ref(props.appliedVouchers || []);
let voucherSearchTimeout = null;

// QR data
const qrImage = ref(null);
const isGeneratingQr = ref(false);

// Computed
const totalVoucherDiscount = computed(() => {
  return appliedVouchers.value.reduce(
    (total, voucher) => total + voucher.discountAmount,
    0
  );
});

// CHỈ GIỮ LẠI 1 HÀM canConfirmPayment
const canConfirmPayment = computed(() => {
  console.log("🔍 Payment validation:", {
    hasItems: !!props.orderItems?.length,
    hasCustomer: !!props.selectedCustomer,
    customerType: props.selectedCustomer
      ? {
          isAnonymous: props.selectedCustomer.isAnonymous,
          isGuest: props.selectedCustomer.isGuest,
          hasUserId: !!props.selectedCustomer.userId,
        }
      : null,
  });

  // 1. Kiểm tra sản phẩm
  if (!props.orderItems?.length) {
    return false;
  }

  // 2. Kiểm tra tổng tiền
  if (!props.totalAmount || props.totalAmount <= 0) {
    return false;
  }

  // 3. Kiểm tra khách hàng
  if (!props.selectedCustomer) {
    return false;
  }

  const customer = props.selectedCustomer;

  // 4. Kiểm tra loại khách hàng
  if (customer.isAnonymous === true) {
    return true;
  }

  if (
    customer.isGuest === true &&
    customer.customerName &&
    customer.customerPhone
  ) {
    return true;
  }

  if (customer.userId && !customer.isGuest && !customer.isAnonymous) {
    return true;
  }

  return false;
});

// Methods
const formatCurrency = (amount) => {
  if (!amount) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const calculateSubtotal = () => {
  return props.orderItems.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0
  );
};

const calculateChange = () => {
  const paid = Number(customerPaid.value) || 0;
  const total = Number(props.totalAmount) || 0;
  changeAmount.value = Math.max(0, paid - total);

  console.log("🧮 Change calculation:", {
    paid,
    total,
    change: changeAmount.value,
  });
};

// Watchers - CHỈ GIỮ LẠI 1 WATCHER CHO MỖI THUỘC TÍNH
watch(
  () => props.totalAmount,
  (newTotal) => {
    // CHỈ TỰ ĐỘNG FILL KHI CÓ TỔNG TIỀN VÀ CHƯA CÓ GIÁ TRỊ
    if (newTotal > 0 && customerPaid.value === 0) {
      customerPaid.value = newTotal;
      calculateChange();
      console.log("🔄 Auto-filled customer paid:", newTotal);
    }
    // NẾU TỔNG TIỀN = 0 THÌ RESET VỀ 0
    else if (newTotal === 0) {
      customerPaid.value = 0;
      changeAmount.value = 0;
      console.log("🔄 Reset customer paid to 0");
    }
  },
  { immediate: true }
);

// CHỈ GIỮ LẠI 1 WATCHER CHO paymentMethod
watch(paymentMethod, (newMethod) => {
  if (
    newMethod === "CASH" &&
    props.totalAmount > 0 &&
    customerPaid.value === 0
  ) {
    customerPaid.value = props.totalAmount;
    calculateChange();
  } else if (newMethod === "BANK_TRANSFER") {
    generateQrCode();
  }
});

// Hàm tạo QR với thông tin tài khoản thực tế
const generateQrCode = async () => {
  isGeneratingQr.value = true;
  try {
    const params = {
      amount: props.totalAmount.toString(),
      addInfo: orderNotes.value.trim() || "Thanh toan don hang BookStation",
      accountNumber: "1028549215",
      accountName: "DOAN THE PHONG",
      bankCode: "970418",
    };

    console.log("🔄 QR params:", params);

    const qrResponse = await generateQr(params);

    console.log("✅ QR response received:", qrResponse);
    console.log("📊 QR response type:", typeof qrResponse);

    // qrResponse bây giờ là object có cấu trúc: { data: "url_string", message: "...", status: 200 }
    if (qrResponse && qrResponse.data) {
      const qrUrl = qrResponse.data;

      console.log("📊 QR URL type:", typeof qrUrl);
      console.log("📊 QR URL:", qrUrl);

      if (
        qrUrl &&
        typeof qrUrl === "string" &&
        qrUrl.startsWith("https://img.vietqr.io/")
      ) {
        qrImage.value = qrUrl; // Lưu URL trực tiếp
        console.log("✅ QR image URL set successfully");
      } else {
        console.error("❌ Invalid QR URL format:", qrUrl);
        alert("URL QR không đúng định dạng");
      }
    } else {
      console.error("❌ No data in QR response:", qrResponse);
      alert("Lỗi: Không nhận được URL QR");
    }
  } catch (error) {
    console.error("❌ QR generation error:", error);
    alert("Lỗi khi tạo mã QR thanh toán: " + error.message);
  } finally {
    isGeneratingQr.value = false;
  }
};
// Watcher cho appliedVouchers từ props
watch(
  () => props.appliedVouchers,
  (newVouchers) => {
    appliedVouchers.value = newVouchers || [];
  },
  { immediate: true, deep: true }
);

// Voucher methods
const onVoucherSearch = async () => {
  if (voucherSearchTimeout) {
    clearTimeout(voucherSearchTimeout);
  }

  voucherSearchTimeout = setTimeout(async () => {
    if (voucherSearchTerm.value.trim().length >= 2) {
      try {
        const response = await searchVouchersAPI(
          voucherSearchTerm.value.trim(),
          5
        );
        voucherSearchResults.value = response.data || [];
        showVoucherResults.value = true;
      } catch (error) {
        console.error("Error searching vouchers:", error);
        voucherSearchResults.value = [];
      }
    } else {
      voucherSearchResults.value = [];
      showVoucherResults.value = false;
    }
  }, 300);
};

const applyVoucherByCode = async () => {
  const code = voucherSearchTerm.value.trim();
  if (!code) return;

  try {
    const response = await searchVouchersAPI(code, 1);
    const vouchers = response.data || [];
    const voucher = vouchers.find(
      (v) => v.code.toLowerCase() === code.toLowerCase()
    );

    if (voucher) {
      applyVoucher(voucher);
    } else {
      alert("Không tìm thấy voucher với mã: " + code);
    }
  } catch (error) {
    console.error("Error applying voucher by code:", error);
    alert("Lỗi khi áp dụng voucher");
  }
};

const applyVoucher = (voucher) => {
  if (appliedVouchers.value.find((v) => v.id === voucher.id)) {
    alert("Voucher này đã được áp dụng");
    return;
  }

  if (voucher.minOrderValue && props.totalAmount < voucher.minOrderValue) {
    alert(
      `Đơn hàng tối thiểu ${formatCurrency(
        voucher.minOrderValue
      )} để sử dụng voucher này`
    );
    return;
  }

  let discountAmount = 0;
  if (voucher.discountType === "PERCENTAGE") {
    discountAmount = (props.totalAmount * voucher.discountPercentage) / 100;
    if (voucher.maxDiscountValue) {
      discountAmount = Math.min(discountAmount, voucher.maxDiscountValue);
    }
  } else {
    discountAmount = voucher.discountAmount;
  }

  const voucherWithDiscount = {
    ...voucher,
    discountAmount: discountAmount,
  };

  appliedVouchers.value.push(voucherWithDiscount);
  emit("voucher-applied", voucherWithDiscount);

  voucherSearchTerm.value = "";
  voucherSearchResults.value = [];
  showVoucherResults.value = false;
};

const removeVoucher = (voucherId) => {
  const index = appliedVouchers.value.findIndex((v) => v.id === voucherId);
  if (index !== -1) {
    const removedVoucher = appliedVouchers.value.splice(index, 1)[0];
    emit("voucher-removed", removedVoucher);
  }
};

// Payment methods
const showConfirmationPopup = () => {
  // Đảm bảo tiền khách đưa ít nhất bằng tổng tiền
  if (
    paymentMethod.value === "CASH" &&
    customerPaid.value < props.totalAmount
  ) {
    customerPaid.value = props.totalAmount;
    calculateChange();
  }

  if (!canConfirmPayment.value) {
    console.log("❌ Cannot show popup - validation failed");
    return;
  }

  showConfirmPopup.value = true;
};

const closeConfirmPopup = () => {
  showConfirmPopup.value = false;
};

const resetPaymentForm = () => {
  customerPaid.value = 0;
  changeAmount.value = 0;
  orderNotes.value = "";
  paymentMethod.value = "CASH";
  voucherSearchTerm.value = "";
  voucherSearchResults.value = [];
  showVoucherResults.value = false;
  appliedVouchers.value = [];
  qrImage.value = null;
  wantInvoice.value = false; // Reset invoice checkbox

  console.log("💰 Payment form reset to default values");
};

const proceedPayment = () => {
  // Kiểm tra tiền mặt trước khi xác nhận
  if (paymentMethod.value === "CASH") {
    const paid = Number(customerPaid.value) || 0;
    const total = Number(props.totalAmount) || 0;

    if (paid < total) {
      alert(
        `Tiền khách đưa không đủ!\nCần: ${total.toLocaleString(
          "vi-VN"
        )} ₫\nĐã nhận: ${paid.toLocaleString("vi-VN")} ₫`
      );
      return;
    }
  }

  const paymentData = {
    paymentMethod: paymentMethod.value,
    notes: orderNotes.value.trim(),
    appliedVouchers: appliedVouchers.value,
    customerPaid:
      paymentMethod.value === "CASH"
        ? Number(customerPaid.value)
        : props.totalAmount,
    changeAmount:
      paymentMethod.value === "CASH" ? Number(changeAmount.value) : 0,
    wantInvoice: wantInvoice.value, // Add invoice info to payment data
  };

  console.log("Payment data being emitted:", paymentData);

  showConfirmPopup.value = false;
  emit("payment-confirmed", paymentData);

  // RESET FORM SAU KHI THANH TOÁN THÀNH CÔNG
  setTimeout(() => {
    resetPaymentForm();
  }, 100); // Delay nhỏ để đảm bảo emit đã hoàn thành
};

// Thêm defineExpose để parent component có thể gọi reset
defineExpose({
  resetPaymentForm,
});

// Event handlers
const handleClickOutside = (event) => {
  const voucherSection = event.target.closest(".voucher-section");
  if (!voucherSection) {
    showVoucherResults.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  document.addEventListener("keydown", (e) => {
    if (e.key === "F6") {
      e.preventDefault();
      document.querySelector(".voucher-input")?.focus();
    } else if (e.key === "F9") {
      e.preventDefault();
      showConfirmationPopup();
    } else if (e.key === "Escape" && showConfirmPopup.value) {
      e.preventDefault();
      closeConfirmPopup();
    }
  });

  // Tự động điền tiền khách đưa ngay khi mount
  if (props.totalAmount > 0) {
    customerPaid.value = props.totalAmount;
    calculateChange();
    console.log("🚀 Initial auto-fill customer paid:", props.totalAmount);
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  if (voucherSearchTimeout) {
    clearTimeout(voucherSearchTimeout);
  }
});
</script>

<style scoped>
.pos-payment {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: auto; /* Thay đổi từ 100% thành auto */
  min-height: 200px; /* Giảm từ 250px xuống 200px */
  max-height: 500px; /* Giảm từ 600px xuống 500px */
  flex-shrink: 0; /* Thêm để đảm bảo component không bị thu nhỏ */
}

.payment-content {
  flex: 1;
  overflow-y: auto;
}

.voucher-section,
.payment-section {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.section-header {
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.voucher-search {
  position: relative;
}

.search-input-wrap {
  display: flex;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.voucher-input {
  flex: 1;
  padding: 10px 12px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-voucher-btn {
  background: #00bfae;
  color: white;
  border: none;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-voucher-btn:hover {
  background: #009688;
}

.voucher-dropdown {
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

.voucher-option {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #f1f5f9;
}

.voucher-option:last-child {
  border-bottom: none;
}

.voucher-option:hover {
  background: #f8f9fa;
}

.voucher-info {
  flex: 1;
  min-width: 0;
}

.voucher-name {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
  font-size: 13px;
}

.voucher-code {
  font-size: 11px;
  color: #64748b;
  font-family: monospace;
  background: #f1f5f9;
  padding: 2px 4px;
  border-radius: 3px;
  margin-bottom: 2px;
  display: inline-block;
}

.voucher-desc {
  font-size: 11px;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.voucher-value {
  font-weight: 600;
  color: #dc2626;
  font-size: 13px;
  margin-left: 8px;
}

.applied-vouchers {
  margin-top: 12px;
}

.applied-voucher {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 6px;
}

.voucher-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.applied-voucher .voucher-name {
  font-size: 12px;
  font-weight: 500;
  color: #991b1b;
}

.voucher-discount {
  font-size: 11px;
  font-weight: 600;
  color: #dc2626;
}

.remove-voucher-btn {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.remove-voucher-btn:hover {
  background: #fecaca;
}

.payment-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}

.pay-method {
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

.pay-method:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.pay-method.active {
  background: #e6f7f4;
  border-color: #00bfae;
  color: #00bfae;
}

.cash-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  font-size: 13px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
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

.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  outline: none;
  resize: vertical;
  min-height: 60px;
}

.form-textarea:focus {
  border-color: #00bfae;
  box-shadow: 0 0 0 0.2rem rgba(0, 191, 174, 0.25);
}

.payment-summary {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #64748b;
  font-size: 14px;
}

.change-amount {
  font-weight: 600;
  color: #059669;
}

.confirm-btn {
  background: linear-gradient(135deg, #00bfae 0%, #009688 100%);
  color: white;
  border: none;
  border-radius: 0;
  padding: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
}

.confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #009688 0%, #00796b 100%);
  transform: translateY(-1px);
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.payment-amount {
  font-size: 18px;
  font-weight: 700;
  margin-left: 8px;
}

@media (max-width: 768px) {
  .voucher-section,
  .payment-section {
    padding: 12px 16px;
  }

  .payment-methods {
    grid-template-columns: 1fr;
  }

  .confirm-btn {
    padding: 16px;
    font-size: 14px;
  }

  .payment-amount {
    font-size: 16px;
  }
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.confirm-popup {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: popupSlideIn 0.3s ease-out;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 2px solid #f1f5f9;
  background: linear-gradient(135deg, #00bfae 0%, #009688 100%);
  color: white;
}

.popup-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.confirmation-message {
  text-align: center;
  margin-bottom: 20px;
}

.confirmation-message p {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.order-summary,
.vouchers-summary,
.payment-summary-popup,
.payment-method-info,
.notes-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.summary-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.item-row:last-child {
  border-bottom: none;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
}

.item-details {
  font-size: 12px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-code {
  font-family: monospace;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  color: #64748b;
  align-self: flex-start;
}

.item-price-detail {
  font-size: 12px;
  color: #64748b;
}

.flash-sale-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
}

.item-total {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-left: 12px;
}

.voucher-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.voucher-name {
  font-size: 13px;
  color: #374151;
}

.voucher-discount {
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
}

.payment-summary-popup .summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.discount-row {
  color: #dc2626;
}

.total-row {
  border-top: 2px solid #e5e7eb;
  padding-top: 12px;
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
}

.payment-method-info .method-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  margin-bottom: 8px;
}

.cash-info {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
}

.cash-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;
}

.cash-row:first-child {
  color: #374151;
}

.cash-row:last-child {
  color: #059669;
  font-weight: 600;
}

.notes-text {
  background: white;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.popup-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 2px solid #f1f5f9;
  background: #fafbfc;
}

.cancel-btn,
.proceed-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.cancel-btn {
  background: #f8f9fa;
  border: 2px solid #e5e7eb;
  color: #64748b;
}

.cancel-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.proceed-btn {
  background: linear-gradient(135deg, #00bfae 0%, #009688 100%);
  border: none;
  color: white;
}

.proceed-btn:hover {
  background: linear-gradient(135deg, #009688 0%, #00796b 100%);
  transform: translateY(-1px);
}

.qr-code-section {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  text-align: center;
}

.qr-code {
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}

.qr-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.no-qr-info {
  font-size: 14px;
  color: #64748b;
  margin-top: 8px;
}

/* QR Section Styles */
.qr-section {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.qr-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.qr-content {
  text-align: center;
}

.qr-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.qr-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.qr-image {
  width: min(300px, 80vw); /* Tối đa 300px hoặc 80% chiều rộng màn hình */
  height: min(300px, 80vw);
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  object-fit: contain;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .qr-image {
    width: min(250px, 70vw);
    height: min(250px, 70vw);
  }
}

.qr-info {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.qr-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #dc2626;
  font-size: 14px;
}

/* QR trong popup - Full size */
.qr-popup-section {
  background: linear-gradient(135deg, #f8fffe 0%, #f0fdfa 100%);
  border-radius: 12px;
  padding: 24px;
  margin-top: 16px;
  text-align: center;
  border: 2px solid #00bfae20;
  box-shadow: 0 4px 12px rgba(0, 191, 174, 0.1);
}

.qr-image-popup {
  width: 280px; /* Tăng từ 200px lên 280px */
  height: 280px; /* Tăng từ 200px lên 280px */
  border: 3px solid #00bfae;
  border-radius: 12px;
  object-fit: contain;
  margin: 0 auto 16px auto;
  box-shadow: 0 8px 24px rgba(0, 191, 174, 0.2);
  transition: transform 0.3s ease;
}

.qr-image-popup:hover {
  transform: scale(1.02);
}

.qr-popup-section .qr-info {
  font-size: 16px; /* Tăng từ 13px lên 16px */
  color: #00796b;
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.qr-popup-section .qr-info::before {
  content: "📱";
  font-size: 18px;
}

/* Tăng kích thước popup để chứa QR lớn hơn */
.confirm-popup {
  background: white;
  border-radius: 16px;
  width: 95%; /* Tăng từ 90% lên 95% */
  max-width: 650px; /* Tăng từ 600px lên 650px */
  max-height: 90vh; /* Tăng từ 85vh lên 90vh */
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: popupSlideIn 0.3s ease-out;
}

/* Responsive cho màn hình nhỏ */
@media (max-width: 768px) {
  .qr-image-popup {
    width: 240px; /* Tăng từ 160px lên 240px */
    height: 240px;
  }

  .qr-popup-section {
    padding: 20px;
  }

  .confirm-popup {
    width: 95%;
    max-width: none;
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .qr-image-popup {
    width: 200px;
    height: 200px;
  }

  .qr-popup-section {
    padding: 16px;
  }
}

/* Animation cho loading */
.qr-popup-section .qr-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
  font-size: 16px; /* Tăng từ 14px lên 16px */
  padding: 24px; /* Tăng từ 20px lên 24px */
}

.qr-popup-section .qr-loading i {
  animation: spin 1s linear infinite;
  font-size: 20px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.qr-popup-section .qr-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #dc2626;
  font-size: 16px; /* Tăng từ 14px lên 16px */
  padding: 24px; /* Tăng từ 20px lên 24px */
}

/* Invoice checkbox styles */
.invoice-section {
  margin: 16px 0;
  padding: 12px;
  background: #f8fffe;
  border: 1px solid #00bfae20;
  border-radius: 8px;
}

.invoice-checkbox {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  font-size: 14px;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 20px;
  width: 20px;
  background-color: #fff;
  border: 2px solid #00bfae;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-container:hover .checkmark {
  background-color: #f0fdfa;
}

.checkbox-container .checkbox-input:checked ~ .checkmark {
  background-color: #00bfae;
  border-color: #00bfae;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container .checkbox-input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-label {
  color: #374151;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-label i {
  color: #00bfae;
  font-size: 16px;
}

.invoice-note {
  margin-left: 32px;
  font-size: 12px;
  color: #059669;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #ecfdf5;
  border-radius: 6px;
  border: 1px solid #a7f3d0;
}

.invoice-note i {
  color: #059669;
  font-size: 14px;
}

/* Styles for invoice info in popup */
.invoice-info {
  background: #f0fdf4;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 2px solid #bbf7d0;
}

.invoice-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #166534;
}

.text-success {
  color: #16a34a !important;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .checkbox-container {
    font-size: 13px;
  }

  .invoice-note {
    margin-left: 24px;
    font-size: 11px;
  }
}
</style>
