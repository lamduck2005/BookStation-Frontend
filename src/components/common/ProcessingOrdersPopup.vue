<template>
  <div
    v-if="show"
    class="processing-popup-wrapper"
    :style="popupWrapperPosition"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
  >
    <!-- Vùng an toàn để chuột có thể di chuyển -->
    <div class="popup-safe-zone"></div>
    
    <div class="processing-popup">
      <div class="popup-header">
        <i class="bi bi-hourglass-split me-1"></i>
        <span>{{ message || 'Đang xử lý: ' + totalProcessingQuantity + ' cuốn' }}</span>
      </div>
      
      <div class="popup-body">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-2">
          <div class="spinner-border spinner-border-sm text-primary"></div>
          <small class="d-block text-muted mt-1">Đang tải...</small>
        </div>

        <!-- Orders List -->
        <div v-else-if="orders.length > 0" class="orders-list">
          <div
            v-for="order in orders"
            :key="order.orderId"
            class="order-item"
          >
            <div class="order-info">
              <div class="info-row">
                <span class="label">ID:</span>
                <span class="value">{{ order.orderId }}</span>
              </div>
              <div class="info-row">
                <span class="label">Mã đơn:</span>
                <span 
                  class="value order-code order-code-hover"
                  @mouseenter="showOrderDetail($event, order.orderId)"
                  @mouseleave="hideOrderDetail"
                  :title="'Hover để xem chi tiết đơn hàng'"
                >
                  {{ order.orderCode }}
                </span>
              </div>
              <div class="info-row">
                <span class="label">Số lượng:</span>
                <span class="value quantity">{{ order.processingQuantity }} cuốn</span>
              </div>
              <div class="info-row">
                <span class="label">Trạng thái:</span>
                <span class="value status">
                  <span class="badge bg-warning text-dark">{{ order.statusDisplay }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-2">
          <i class="bi bi-check-circle text-success me-1"></i>
          <span class="text-muted">Không có đơn hàng đang xử lý</span>
        </div>
      </div>
    </div>

    <!-- Order Detail Popup -->
    <OrderDetailPopup
      :show="showOrderDetailPopup"
      :order-id="selectedOrderId"
      :mouse-position="orderDetailMousePosition"
      @close="hideOrderDetail"
      @keep-open="() => { isHoveringAny.value = true; emit('keep-open'); }"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { getBookProcessingOrders } from '@/services/admin/book';
import OrderDetailPopup from './OrderDetailPopup.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  bookId: {
    type: [Number, String],
    default: null
  },
  bookInfo: {
    type: Object,
    default: () => ({})
  },
  mousePosition: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
});

const emit = defineEmits(['close','keep-open']);

const orders = ref([]);
const loading = ref(false);
const message = ref('');

// State for order detail popup
const showOrderDetailPopup = ref(false);
const selectedOrderId = ref(null);
const orderDetailMousePosition = ref({ x: 0, y: 0 });

const isHoveringAny = ref(false);

// **GIẢI PHÁP CHÍNH**: Vị trí wrapper cố định HOÀN TOÀN
const popupWrapperPosition = computed(() => {
  if (!props.show) return { display: 'none' };
  const x = props.mousePosition.x;
  const y = props.mousePosition.y;
  const offsetX = window.innerWidth - x < 350 ? -370 : 10;
  // Move wrapper higher so popup appears above cursor instead of below
  const offsetY = -220; // was -15; now raise
  return {
    position: 'fixed',
    left: x + offsetX + 'px',
    top: y + offsetY + 'px',
    zIndex: 9999,
    width: '350px',
    height: '470px'
  };
});

// Computed total processing quantity
const totalProcessingQuantity = computed(() => {
  return orders.value.reduce((total, order) => total + (order.processingQuantity || 0), 0);
});

// Watch for bookId changes to fetch data
watch(() => [props.show, props.bookId], async ([show, bookId]) => {
  if (show && bookId) {
    await fetchProcessingOrders(bookId);
  }
}, { immediate: true });

const fetchProcessingOrders = async (bookId) => {
  loading.value = true;
  orders.value = [];
  message.value = '';
  
  try {
    const response = await getBookProcessingOrders(bookId);
    message.value = response.message || '';
    orders.value = response.data || [];
  } catch (err) {
    console.error('Lỗi khi lấy đơn hàng đang xử lý:', err);
    orders.value = [];
    message.value = '';
  } finally {
    loading.value = false;
  }
};

const closePopup = () => {
  hideOrderDetail();
  emit('close');
};

const handleMouseEnter = () => { isHoveringAny.value = true; emit('keep-open'); };

let leaveTimeout = null;

const handleMouseLeave = () => {
  isHoveringAny.value = false;
  if (leaveTimeout) clearTimeout(leaveTimeout);
  leaveTimeout = setTimeout(()=> { if(!isHoveringAny.value) closePopup(); }, 400);
};

// Show order detail popup when hover on order code
const showOrderDetail = (event, orderId) => {
  orderDetailMousePosition.value = { x: event.clientX, y: event.clientY };
  selectedOrderId.value = orderId;
  showOrderDetailPopup.value = true;
};

const hideOrderDetail = () => {
  showOrderDetailPopup.value = false;
  selectedOrderId.value = null;
};

const getStatusClass = (status) => {
  const statusClasses = {
    'PENDING': 'bg-warning',
    'CONFIRMED': 'bg-info', 
    'PROCESSING': 'bg-success',
    'SHIPPED': 'bg-primary',
    'CANCELLED': 'bg-danger',
    'REFUND_REQUESTED': 'bg-warning',
    'REFUND_APPROVED': 'bg-success',
    'REFUNDED': 'bg-secondary',
    'RETURNED': 'bg-dark'
  };
  return `badge ${statusClasses[status] || 'bg-secondary'}`;
};
</script>

<style scoped>
/* WRAPPER: Vùng hover lớn và cố định */
.processing-popup-wrapper {
  pointer-events: auto;
}

/* VÙNG AN TOÀN: Để chuột có thể di chuyển mà không mất popup */
.popup-safe-zone {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: transparent;
  z-index: 1;
}

/* POPUP CHÍNH: Vị trí cố định trong wrapper */
.processing-popup {
  position: absolute;
  top: 45px;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e9ecef;
  width: 320px;
  max-height: 400px;
  overflow: hidden;
  font-size: 12px;
  animation: fadeInUp 0.15s ease-out;
  z-index: 2;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popup-header {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: white;
  padding: 10px 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: 13px;
}

.popup-body {
  max-height: 350px;
  overflow-y: auto;
  padding: 12px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 10px;
  transition: all 0.15s ease;
  background: #fafbfc;
}

.order-item:hover {
  border-color: #007bff;
  background: #f0f8ff;
  transform: translateY(-1px);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-weight: 600;
  color: #495057;
  font-size: 11px;
  min-width: 70px;
}

.value {
  font-size: 11px;
  color: #212529;
  text-align: right;
  flex: 1;
}

.order-code {
  font-family: 'Courier New', monospace;
  color: #0066cc;
  font-weight: 600;
}

.order-code-hover {
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.order-code-hover:hover {
  background: #e3f2fd;
  color: #1565c0;
  transform: scale(1.02);
}

.quantity {
  color: #28a745;
  font-weight: 600;
}

.status .badge {
  font-size: 9px;
  padding: 3px 8px;
  border-radius: 12px;
}

/* Scrollbar */
.popup-body::-webkit-scrollbar {
  width: 4px;
}

.popup-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.popup-body::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.popup-body::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* Badge colors */
.badge {
  color: white !important;
}
</style>
