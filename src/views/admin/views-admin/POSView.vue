<template>
  <div class="pos-layout">
    <div class="pos-main">
      <PosHeader @add-product="handleAddProduct" />
      <PosOrderList
        :order-items="orderItems"
        @update-quantity="handleUpdateQuantity"
        @remove-item="handleRemoveItem"
        @clear-order="handleClearOrder"
      />
    </div>
    <div class="pos-sidebar">
      <PosCustomerInfo
        :selected-customer-data="selectedCustomer"
        @customer-selected="handleCustomerSelected"
        @customer-changed="handleCustomerChanged"
      />
      <PosOrderSummary
        :key="`summary-${orderItems.length}-${
          selectedCustomer?.userId || 'guest'
        }`"
        :order-items="orderItems"
        :applied-vouchers="appliedVouchers"
        :calculation="orderCalculation"
      />
      <PosPayment
        :total-amount="finalTotal"
        :order-items="orderItems"
        @voucher-applied="handleVoucherApplied"
        @voucher-removed="handleVoucherRemoved"
        @payment-confirmed="handlePaymentConfirmed"
      />
    </div>

    <!-- Loading overlay -->
    <div v-if="isProcessing" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <div class="loading-text">{{ loadingMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import PosCustomerInfo from "../../client/pos/PosCustomerInfo.vue";
import PosHeader from "../../client/pos/PosHeader.vue";
import PosOrderList from "../../client/pos/PosOrderList.vue";
import PosOrderSummary from "../../client/pos/PosOrderSummary.vue";
import PosPayment from "../../client/pos/PosPayment.vue";
import {
  createCounterOrder,
  calculateCounterOrder,
} from "@/services/admin/counterSales";
import { getUserId } from "@/utils/utils.js";
import Swal from "sweetalert2";

// State
const orderItems = ref([]);
const selectedCustomer = ref(null);
const appliedVouchers = ref([]);
const orderCalculation = ref(null);
const isProcessing = ref(false);
const loadingMessage = ref("");

// Computed
const subtotal = computed(() => {
  if (orderCalculation.value?.subtotal) {
    return orderCalculation.value.subtotal;
  }
  return orderItems.value.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);
});

const totalVoucherDiscount = computed(() => {
  if (orderCalculation.value?.discountAmount) {
    return orderCalculation.value.discountAmount;
  }
  return appliedVouchers.value.reduce((sum, voucher) => {
    return sum + (voucher.discountAmount || 0);
  }, 0);
});

const finalTotal = computed(() => {
  if (orderCalculation.value?.totalAmount) {
    return orderCalculation.value.totalAmount;
  }
  return Math.max(0, subtotal.value - totalVoucherDiscount.value);
});

// Methods
function handleAddProduct(book) {
  const id = book.id || book.bookId;
  const existing = orderItems.value.find((i) => i.bookId === id);
  const unitPrice =
    book.unitPrice != null
      ? Number(book.unitPrice)
      : book.isFlashSale && book.flashSalePrice != null
      ? Number(book.flashSalePrice)
      : Number(book.normalPrice) || 0;

  if (existing) {
    existing.quantity += 1;
  } else {
    orderItems.value.push({
      bookId: id,
      title: book.title,
      bookCode: book.bookCode,
      unitPrice,
      normalPrice: Number(book.normalPrice) || 0,
      flashSalePrice:
        book.flashSalePrice != null ? Number(book.flashSalePrice) : null,
      isFlashSale: !!book.isFlashSale,
      stockQuantity: book.stockQuantity,
      coverImageUrl: book.coverImageUrl,
      quantity: 1,
    });
  }
  console.log("Product added, orderItems:", orderItems.value);

  // Auto calculate if we have customer
  if (selectedCustomer.value) {
    calculateOrder();
  }

  // Force re-render để đảm bảo UI cập nhật
  nextTick(() => {
    console.log("Product added, orderItems count:", orderItems.value.length);
  });
}

const handleUpdateQuantity = (index, newQuantity) => {
  if (index >= 0 && index < orderItems.value.length) {
    orderItems.value[index].quantity = newQuantity;

    // Auto calculate if we have customer
    if (selectedCustomer.value) {
      calculateOrder();
    }
  }
};

const handleRemoveItem = (index) => {
  if (index >= 0 && index < orderItems.value.length) {
    const item = orderItems.value[index];
    orderItems.value.splice(index, 1);
    showToast("info", `Đã xóa ${item.title || item.name} khỏi đơn hàng`);

    // Auto calculate if we have customer
    if (selectedCustomer.value) {
      calculateOrder();
    }
  }
};

const handleClearOrder = () => {
  Swal.fire({
    title: "Xác nhận xóa đơn hàng",
    text: "Bạn có chắc chắn muốn xóa toàn bộ đơn hàng?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      resetAll(); // Reset cả khách hàng khi xóa đơn hàng thủ công
      showToast("success", "Đã xóa đơn hàng");
    }
  });
};

const handleCustomerSelected = (customer) => {
  selectedCustomer.value = customer;
  console.log("Customer selected in POSView:", customer);

  // Auto calculate when customer is selected
  if (orderItems.value.length > 0) {
    calculateOrder();
  }
};

const handleCustomerChanged = () => {
  selectedCustomer.value = null;
  orderCalculation.value = null;
  appliedVouchers.value = [];
  console.log("Customer changed/cleared in POSView");
};

const handleVoucherApplied = (voucher) => {
  appliedVouchers.value.push(voucher);
  calculateOrder();
};

const handleVoucherRemoved = (voucher) => {
  const index = appliedVouchers.value.findIndex((v) => v.id === voucher.id);
  if (index !== -1) {
    appliedVouchers.value.splice(index, 1);
    calculateOrder();
  }
};

const calculateOrder = async () => {
  if (!selectedCustomer.value || orderItems.value.length === 0) {
    orderCalculation.value = null;
    return;
  }

  try {
    isProcessing.value = true;
    loadingMessage.value = "Đang tính toán đơn hàng...";

    const orderData = buildOrderData();
    const response = await calculateCounterOrder(orderData);

    if (response.status === 200) {
      orderCalculation.value = response.data;

      // Update applied vouchers with calculated discounts
      if (response.data.appliedVouchers) {
        appliedVouchers.value = response.data.appliedVouchers;
      }
    }
  } catch (error) {
    console.error("Error calculating order:", error);
    orderCalculation.value = null;
    if (error.response?.data?.message) {
      showToast("error", error.response.data.message);
    }
  } finally {
    isProcessing.value = false;
  }
};

const handlePaymentConfirmed = async (paymentData) => {
  console.log("Payment confirmation started:", {
    hasCustomer: !!selectedCustomer.value,
    customerData: selectedCustomer.value,
    orderItemsCount: orderItems.value.length,
    orderItems: orderItems.value,
  });

  if (!selectedCustomer.value || orderItems.value.length === 0) {
    const errorMsg = !selectedCustomer.value
      ? "Vui lòng chọn khách hàng"
      : "Vui lòng thêm sản phẩm vào đơn hàng";
    showToast("error", errorMsg);
    return;
  }

  try {
    isProcessing.value = true;
    loadingMessage.value = "Đang xử lý thanh toán...";

    const orderData = buildOrderData();
    orderData.paymentMethod = paymentData.paymentMethod;
    orderData.notes = paymentData.notes;
    orderData.customerPaid = paymentData.customerPaid;
    orderData.changeAmount = paymentData.changeAmount;

    console.log("Order Data being sent:", orderData);

    const response = await createCounterOrder(orderData);

    if (response.status === 200) {
      // Tắt loading ngay sau khi tạo đơn thành công
      isProcessing.value = false;

      // Success
      let paymentInfo = "";
      if (paymentData.paymentMethod === "CASH") {
        paymentInfo = `
          <p><strong>Tiền khách đưa:</strong> ${formatCurrency(
            paymentData.customerPaid
          )}</p>
          ${
            paymentData.changeAmount > 0
              ? `<p><strong>Tiền thừa:</strong> ${formatCurrency(
                  paymentData.changeAmount
                )}</p>`
              : ""
          }
        `;
      }

      await Swal.fire({
        title: "Thanh toán thành công!",
        html: `
          <div class="text-left">
            <p><strong>Mã đơn hàng:</strong> ${response.data.orderCode}</p>
            <p><strong>Khách hàng:</strong> ${response.data.customerName}</p>
            <p><strong>Tổng tiền:</strong> ${formatCurrency(
              response.data.totalAmount
            )}</p>
            <p><strong>Phương thức:</strong> ${
              response.data.paymentMethod === "CASH"
                ? "Tiền mặt"
                : "Chuyển khoản"
            }</p>
            ${paymentInfo}
            <hr style="margin: 15px 0;">
            <p style="color: #059669; font-weight: 500;">
              <i class="bi bi-info-circle"></i> 
              Khách hàng có thể tiếp tục mua sắm mà không cần chọn lại!
            </p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Tiếp tục bán hàng",
        confirmButtonColor: "#00bfae",
        showCancelButton: true,
        cancelButtonText: "Đổi khách hàng",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          // Nếu chọn "Đổi khách hàng" thì reset tất cả
          resetAll();
        }
        // Nếu chọn "Tiếp tục bán hàng" thì chỉ reset đơn hàng (đã làm ở resetOrder())
      });

      // Reset form for new order
      resetOrder();
    }
  } catch (error) {
    console.error("Error creating counter order:", error);

    let errorMessage = "Có lỗi xảy ra khi tạo đơn hàng";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    Swal.fire({
      title: "Lỗi thanh toán",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Đóng",
    });
  } finally {
    // Chỉ tắt loading nếu chưa được tắt (trường hợp lỗi)
    if (isProcessing.value) {
      isProcessing.value = false;
    }
  }
};

const buildOrderData = () => {
  const orderDetails = orderItems.value.map((item) => ({
    bookId: item.bookId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    flashSaleItemId: item.flashSaleItemId,
  }));

  const voucherIds = appliedVouchers.value.map((v) => v.id);

  return {
    userId: selectedCustomer.value.userId,
    customerName: selectedCustomer.value.customerName,
    customerPhone: selectedCustomer.value.customerPhone,
    staffId: getUserId(),
    orderDetails: orderDetails,
    voucherIds: voucherIds,
    subtotal: subtotal.value,
    totalAmount: finalTotal.value,
  };
};

const resetOrder = () => {
  console.log(
    "Resetting order, keeping customer:",
    selectedCustomer.value?.customerName
  );
  orderItems.value = [];
  // Không reset selectedCustomer để khách hàng có thể mua tiếp
  // selectedCustomer.value = null;
  appliedVouchers.value = [];
  orderCalculation.value = null;

  // Force re-render của các component để đảm bảo UI được cập nhật
  nextTick(() => {
    console.log("Order reset completed, UI should update");
  });
};

const resetAll = () => {
  console.log("Resetting all including customer");
  orderItems.value = [];
  selectedCustomer.value = null;
  appliedVouchers.value = [];
  orderCalculation.value = null;
};

const formatCurrency = (amount) => {
  if (!amount) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const showToast = (icon, title) => {
  Swal.fire({
    icon: icon,
    title: title,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

// Keyboard shortcuts
const handleKeyDown = (event) => {
  // F2 - Focus search
  if (event.key === "F2") {
    event.preventDefault();
    document.querySelector(".pos-search")?.focus();
  }
  // F6 - Focus voucher
  else if (event.key === "F6") {
    event.preventDefault();
    document.querySelector(".voucher-input")?.focus();
  }
  // F9 - Confirm payment
  else if (event.key === "F9") {
    event.preventDefault();
    document.querySelector(".confirm-btn")?.click();
  }
  // Escape - Clear focus
  else if (event.key === "Escape") {
    document.activeElement?.blur();
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
  console.log("POS System initialized");
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.pos-layout {
  display: flex;
  height: 100vh;
  background: #f8fafd;
  gap: 16px;
  padding: 16px;
}

.pos-main {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.pos-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px; /* Giảm gap từ 16px xuống 12px */
  min-width: 350px;
  max-width: 400px;
  height: calc(100vh - 32px);
  overflow-y: auto; /* Cho phép scroll dọc */
  overflow-x: hidden; /* Ẩn scroll ngang */
  padding-right: 4px; /* Thêm padding cho scrollbar */
}

/* Đảm bảo các component trong sidebar có flex-shrink phù hợp */
.pos-sidebar > * {
  flex-shrink: 0; /* Ngăn các component bị thu nhỏ */
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #00bfae;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #374151;
  font-weight: 500;
  font-size: 16px;
}

/* Responsive design */
@media (max-width: 1400px) {
  .pos-sidebar {
    min-width: 320px;
    max-width: 350px;
  }

  .pos-sidebar > * {
    flex-shrink: 0;
  }
}

@media (max-width: 1200px) {
  .pos-sidebar {
    min-width: 300px;
    max-width: 320px;
    gap: 8px; /* Giảm gap để tiết kiệm không gian */
  }

  .pos-layout {
    gap: 12px;
    padding: 12px;
  }

  .pos-sidebar > * {
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .pos-layout {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    padding: 8px;
    gap: 8px;
  }

  .pos-main {
    flex: none;
  }

  .pos-sidebar {
    flex: none;
    min-width: unset;
    max-width: unset;
    height: auto;
    max-height: 70vh;
    gap: 6px;
  }

  .pos-sidebar > * {
    flex-shrink: 0;
  }
}

/* Print styles for receipts */
@media print {
  .pos-layout {
    display: none;
  }
}

/* Focus management for accessibility */
.pos-layout :focus {
  outline: 2px solid #00bfae;
  outline-offset: 2px;
}

/* Smooth transitions */
.pos-main > *,
.pos-sidebar > * {
  transition: all 0.3s ease;
}

/* Custom scrollbars */
.pos-sidebar::-webkit-scrollbar {
  width: 6px;
}

.pos-sidebar::-webkit-scrollbar-track {
  background: #f8fafd;
  border-radius: 3px;
}

.pos-sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.pos-sidebar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Custom scrollbars for other elements */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
