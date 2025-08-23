<template>
  <div
    v-if="show"
    class="order-detail-popup"
    :style="popupPosition"
    @mouseenter="$emit('keep-open')"
  >
    <div class="popup-header">
      <i class="bi bi-file-earmark-text me-2"></i>
      <span>Chi tiết đơn hàng #{{ orderDetail?.orderCode || orderDetail?.code }}</span>
      <button class="btn btn-sm btn-light ms-auto" @click="closePopup" title="Đóng" style="line-height:1">×</button>
    </div>
    <div class="popup-body" v-if="orderDetail">
      <div v-if="loading" class="text-center py-2">
        <div class="spinner-border spinner-border-sm text-primary"></div>
        <small class="d-block text-muted mt-1">Đang tải...</small>
      </div>
      <div v-else class="order-detail-compact">
        <!-- Order Header Info -->
        <div class="order-detail-header mb-3">
          <div class="info-section mb-2">
            <h6 class="section-title">
              <i class="bi bi-receipt me-2"></i>Thông tin đơn hàng
            </h6>
            <p><strong>Mã đơn hàng:</strong> {{ orderDetail.orderCode || orderDetail.code }}</p>
            <p><strong>Loại đơn hàng:</strong> 
              <span class="badge bg-info ms-2">{{ formatOrderType(orderDetail.orderType) }}</span>
            </p>
            <p><strong>Trạng thái:</strong> 
              <StatusLabel 
                :status="orderDetail.orderStatus" 
                :statusText="orderDetail.orderStatusDisplay"
                :statusClass="getOrderStatusClass(orderDetail.orderStatus)"
              />
            </p>
            <p><strong>Ngày tạo:</strong> {{ formatDate(orderDetail.createdAt) }}</p>
            <p><strong>Cập nhật lần cuối:</strong> {{ formatDate(orderDetail.updatedAt) }}</p>
            <p v-if="orderDetail.notes"><strong>Ghi chú:</strong> {{ orderDetail.notes }}</p>
          </div>
          <div class="info-section mb-2">
            <h6 class="section-title">
              <i class="bi bi-person me-2"></i>Thông tin khách hàng
            </h6>
            <p><strong>Tên:</strong> {{ orderDetail.userName }}</p>
            <p><strong>Email:</strong> {{ orderDetail.userEmail }}</p>
            <p v-if="orderDetail.addressDetail">
              <strong>Địa chỉ giao hàng:</strong><br>
              <span class="text-muted">{{ orderDetail.addressDetail }}</span>
            </p>
          </div>
        </div>

        <!-- Order Items -->
        <div class="mb-3">
          <h6 class="section-title">
            <i class="bi bi-bag me-2"></i>Sản phẩm trong đơn hàng
          </h6>
          <div class="order-items-container">
            <div v-for="item in orderDetail.itemDetails || orderDetail.orderDetails" 
                 :key="item.id || item.bookId" 
                 class="order-item-detail">
              <div class="item-row">
                <img 
                  :src="item.bookImage || '/src/assets/img/book-placeholder.svg'" 
                  :alt="item.bookName || item.bookTitle"
                  class="item-thumbnail"
                  @error="$event.target.src = '/src/assets/img/book-placeholder.svg'"
                >
                <div class="item-info">
                  <h6 class="item-name">{{ item.bookName || item.bookTitle }}</h6>
                  <p class="item-code text-muted small">Mã sách: {{ item.bookCode }}</p>
                  <div v-if="item.isFlashSale" class="flash-sale-badge">
                    <i class="bi bi-fire"></i>
                    {{ item.flashSaleName }}
                  </div>
                </div>
                <div class="price-info">
                  <div v-if="item.originalPrice && item.isFlashSale">
                    <span class="original-price text-muted text-decoration-line-through small d-block">
                      {{ formatCurrency(item.originalPrice) }}
                    </span>
                    <strong class="sale-price text-danger">
                      {{ formatCurrency(item.unitPrice) }}
                    </strong>
                    <div class="badge bg-success small mt-1">
                      Tiết kiệm {{ formatCurrency(item.savedAmount || (item.originalPrice - item.unitPrice)) }}
                    </div>
                  </div>
                  <div v-else>
                    <strong>{{ formatCurrency(item.unitPrice) }}</strong>
                  </div>
                </div>
                <div class="quantity-info">
                  <span class="quantity-badge">{{ item.quantity }}</span>
                </div>
                <div class="total-info">
                  <strong class="item-total">{{ formatCurrency(item.itemTotal || item.totalPrice) }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vouchers Section -->
        <div class="mb-3" v-if="(orderDetail.vouchers && orderDetail.vouchers.length > 0) || 
                                 (orderDetail.voucherDiscountAmount > 0) || 
                                 (orderDetail.discountAmount > 0) ||
                                 (orderDetail.regularVoucherDiscount > 0) || 
                                 (orderDetail.shippingVoucherDiscount > 0) ||
                                 (orderDetail.totalVoucherDiscount > 0)">
          <h6 class="section-title">
            <i class="bi bi-ticket-perforated me-2"></i>Vouchers đã áp dụng
          </h6>
          <div class="voucher-list">
            <!-- Display vouchers from vouchers array -->
            <template v-if="orderDetail.vouchers && orderDetail.vouchers.length > 0">
              <div v-for="voucher in orderDetail.vouchers" :key="voucher.id" class="voucher-item-detail">
                <div class="voucher-header">
                  <div class="voucher-code">{{ voucher.code }}</div>
                  <div class="voucher-discount">-{{ formatCurrency(voucher.discountAmount || orderDetail.voucherDiscountAmount || orderDetail.discountAmount) }}</div>
                </div>
                <div class="voucher-name">{{ voucher.name }}</div>
              </div>
            </template>
            <!-- Fallback voucher info -->
            <template v-else>
              <div v-if="orderDetail.voucherDiscountAmount > 0" class="voucher-item-detail">
                <div class="voucher-header">
                  <div class="voucher-code">{{ orderDetail.voucherCode || 'PRODUCT_DISCOUNT' }}</div>
                  <div class="voucher-discount">-{{ formatCurrency(orderDetail.voucherDiscountAmount) }}</div>
                </div>
                <div class="voucher-name">Voucher giảm giá sản phẩm</div>
              </div>
            </template>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary-section">
          <h6 class="section-title mb-2">
            <i class="bi bi-calculator me-2"></i>Chi tiết thanh toán
          </h6>
          <div class="summary-table">
            <div class="summary-row">
              <span>Tạm tính sản phẩm:</span>
              <span>{{ formatCurrency(orderDetail.subtotal || calculateOrderSubtotal(orderDetail)) }}</span>
            </div>
            <div class="summary-row" v-if="orderDetail.shippingFee > 0">
              <span>Phí vận chuyển:</span>
              <span>{{ formatCurrency(orderDetail.shippingFee) }}</span>
            </div>
            <div class="summary-row discount" v-if="orderDetail.voucherDiscountAmount > 0">
              <span>
                <i class="bi bi-ticket-perforated me-1"></i>
                Giảm giá voucher:
              </span>
              <span>-{{ formatCurrency(orderDetail.voucherDiscountAmount) }}</span>
            </div>
            <div class="summary-row total">
              <span><strong>Tổng cộng:</strong></span>
              <span><strong>{{ formatCurrency(orderDetail.totalAmount) }}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-3">
      <i class="bi bi-exclamation-circle text-warning me-1"></i>
      <span class="text-muted">Không thể tải chi tiết đơn hàng</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { getOrderById } from '@/services/admin/order';
import StatusLabel from '@/components/common/StatusLabel.vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  orderId: { type: [Number, String], default: null },
  mousePosition: { type: Object, default: () => ({ x: 0, y: 0 }) }
});

const emit = defineEmits(['close','keep-open']);
const orderDetail = ref(null);
const loading = ref(false);

const POPUP_WIDTH = 450;
const POPUP_HEIGHT = 620;
const GAP = 8;

const popupPosition = computed(() => {
  if (!props.show) return { display: 'none' };
  const vpW = window.innerWidth;
  const vpH = window.innerHeight;
  let x = props.mousePosition.x;
  let y = props.mousePosition.y;
  let left = x + 330 + GAP;
  if (left + POPUP_WIDTH > vpW - 8) left = x - POPUP_WIDTH - GAP;
  if (left < 8) left = 8;
  let top = y - 150;
  if (top + POPUP_HEIGHT > vpH - 8) top = vpH - POPUP_HEIGHT - 8;
  if (top < 8) top = 8;
  return { position:'fixed', left:left+'px', top:top+'px', zIndex:100060 };
});

watch(() => [props.show, props.orderId], async ([show, orderId]) => { 
  if (show && orderId) await fetchOrderDetails(orderId); 
}, { immediate: true });

const fetchOrderDetails = async (orderId) => {
  loading.value = true; 
  orderDetail.value = null;
  try { 
    console.log('Fetching order details for ID:', orderId);
    const response = await getOrderById(orderId); 
    orderDetail.value = response.data || response;
    console.log('Order detail loaded successfully:', orderDetail.value);
    loading.value = false;
  } catch (e) { 
    console.error('Lỗi lấy chi tiết đơn hàng:', e); 
    orderDetail.value = null;
    loading.value = false;
  }
};

const closePopup = () => emit('close');

const formatCurrency = (amount) => { 
  if (!amount) return '0 ₫'; 
  return new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(amount); 
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Chưa có';
  const date = new Date(timestamp);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatOrderType = (type) => {
  const typeMap = {
    'NORMAL': 'Thường',
    'ONLINE': 'Đơn online',
    'COUNTER': 'Đơn tại quầy',
    'EVENT_GIFT': 'Quà sự kiện',
    'PROMOTIONAL': 'Khuyến mãi',
    'SAMPLE': 'Mẫu'
  };
  return typeMap[type] || type;
};

const formatOrderStatus = (status) => {
  const statusMap = {
    'PENDING': 'Chờ xử lý',
    'CONFIRMED': 'Đã xác nhận',
    'PROCESSING': 'Đang xử lý',
    'SHIPPED': 'Đã giao',
    'DELIVERED': 'Đã nhận',
    'CANCELLED': 'Đã hủy',
    'REFUND_REQUESTED': 'Yêu cầu hoàn hàng',
    'REFUNDED': 'Đã hoàn tiền'
  };
  return statusMap[status] || status;
};

const getOrderStatusClass = (status) => {
  const statusClasses = {
    'PENDING': 'bg-warning text-dark',
    'CONFIRMED': 'bg-info text-white',
    'PROCESSING': 'bg-primary text-white',
    'SHIPPED': 'bg-success text-white',
    'DELIVERED': 'bg-success text-white',
    'CANCELLED': 'bg-danger text-white',
    'REFUNDED': 'bg-secondary text-white'
  };
  return statusClasses[status] || 'bg-secondary text-white';
};

const calculateOrderSubtotal = (order) => {
  if (!order || !order.orderDetails) return 0;
  return order.orderDetails.reduce((sum, item) => {
    return sum + ((item.quantity || 0) * (item.unitPrice || 0));
  }, 0);
};
</script>

<style scoped>
.order-detail-popup { 
  background: white; 
  border-radius: 10px; 
  box-shadow: 0 12px 48px rgba(0,0,0,0.3); 
  border: 1px solid #e9ecef; 
  width: 450px; 
  max-height: 620px; 
  overflow: hidden; 
  font-size: 12px; 
  animation: slideInRight 0.18s ease-out; 
  cursor: default; 
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.popup-header { 
  background: #f8f9fa; 
  padding: 8px 12px; 
  font-weight: 600; 
  display: flex; 
  align-items: center; 
  font-size: 13px; 
  border-bottom: 1px solid #e9ecef; 
}

.popup-header .btn { 
  font-size: 16px; 
  padding: 4px 8px; 
  line-height: 1;
}

.popup-body { 
  max-height: 580px; 
  overflow-y: auto; 
  padding: 12px; 
}

.section-title {
  color: #495057;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.info-section p {
  margin-bottom: 4px;
  font-size: 11px;
  line-height: 1.4;
}

.order-items-container {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.order-item-detail {
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.order-item-detail:last-child {
  border-bottom: none;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-thumbnail {
  width: 40px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 2px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-code {
  font-size: 10px;
  margin-bottom: 2px;
}

.flash-sale-badge {
  font-size: 9px;
  color: #dc3545;
  font-weight: 600;
}

.price-info {
  text-align: right;
  min-width: 80px;
}

.original-price {
  font-size: 10px;
}

.sale-price {
  font-size: 11px;
}

.quantity-info {
  text-align: center;
  min-width: 40px;
}

.quantity-badge {
  background: #007bff;
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
}

.total-info {
  text-align: right;
  min-width: 80px;
}

.item-total {
  font-size: 11px;
  color: #28a745;
}

.voucher-list {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 8px;
  background: #f8f9fa;
}

.voucher-item-detail {
  margin-bottom: 8px;
  padding: 6px 8px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #007bff;
}

.voucher-item-detail:last-child {
  margin-bottom: 0;
}

.voucher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.voucher-code {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  font-weight: 600;
  color: #0066cc;
}

.voucher-discount {
  font-size: 10px;
  color: #28a745;
  font-weight: 600;
}

.voucher-name {
  font-size: 10px;
  color: #495057;
  font-weight: 500;
}

.summary-table {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 8px;
  background: #f8f9fa;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
  font-size: 11px;
}

.summary-row.discount {
  color: #28a745;
}

.summary-row.total {
  border-top: 1px solid #dee2e6;
  padding-top: 6px;
  margin-top: 4px;
  font-weight: 700;
  font-size: 12px;
}

.badge {
  font-size: 9px;
  padding: 2px 6px;
}

.popup-body::-webkit-scrollbar {
  width: 6px;
}

.popup-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.popup-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.popup-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.order-items-container::-webkit-scrollbar {
  width: 4px;
}

.order-items-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.order-items-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}
</style>
