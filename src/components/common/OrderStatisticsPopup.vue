<template>
  <!--  Order Statistics Details Popup -->
  <div 
    v-if="show" 
    class="order-stats-popup-overlay" 
    @click="closePopup"
  >
    <div 
      class="order-stats-popup" 
      :style="popupStyle"
      @click.stop
    >
      <!-- Header -->
      <div class="popup-header">
        <div class="popup-title">
          <i class="bi bi-calendar-event me-2"></i>
          <span>{{ formattedSelectedDate }}</span>
        </div>
        
      </div>

      <!-- Body -->
      <div class="popup-body">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải chi tiết đơn hàng...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
        </div>

        <!-- Data State -->
        <div v-else-if="detailsData && detailsData.length > 0">
          <!-- Summary Stats Row -->
           

          <!-- Orders List -->
          <div class="orders-list">
            <h6 class="list-title">
              <i class="bi bi-list-ul me-2"></i>
              Chi tiết từng đơn hàng
            </h6>
            
            <div class="orders-container">
              <div 
                v-for="(order, index) in detailsData" 
                :key="order.orderCode"
                class="order-item"
              >
                <!-- Rank Badge -->
                <div class="rank-badge" :class="getRankBadgeClass(index + 1)">
                  #{{ index + 1 }}
                </div>

                <!-- Order Info -->
                <div class="order-info">
                  <div class="order-header">
                    <h6 class="order-code" :title="order.orderCode">
                      {{ order.orderCode }}
                    </h6>
                    
                  </div>
                  
                  <div class="order-meta">
                    <div class="customer-info">
                      <i class="bi bi-person me-1"></i>
                      <strong>{{ order.customerName }}</strong>
                    </div>
                    <div class="customer-email" v-if="order.customerEmail">
                      <i class="bi bi-envelope me-1"></i>
                      <span>{{ order.customerEmail }}</span>
                    </div>
                    <div class="order-date">
                      <i class="bi bi-clock me-1"></i>
                      <span>{{ formatTimestamp(order.createdAt) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Order Stats -->
                <div class="order-stats">
                  <!-- Total Amount -->
                  <div class="stat-item">
                    <div class="stat-label">Tổng tiền</div>
                    <div class="stat-value">
                      {{ formatCurrency(order.totalAmount) }}
                    </div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Doanh thu thuần</div>
                    <div class="stat-value text-success">
                      {{ formatCurrency(order.netRevenue) }}
                    </div>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="product-info" v-if="order.productInfo">
                  <div class="stat-label">Sản phẩm</div>
                  <div class="product-text" :title="order.productInfo">
                    {{ order.productInfo }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Data State -->
        <div v-else class="text-center py-4">
          <i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
          <h6 class="text-muted mt-2">Không có dữ liệu</h6>
          <p class="text-muted">Không tìm thấy đơn hàng nào cho ngày này</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { getOrderStatsDetails, formatCurrency, formatOrderStatus, getOrderStatusClass } from '@/services/admin/orderStatistics';

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  selectedDate: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  period: {
    type: String, // day/week/month/year
    required: true
  },
  mousePosition: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
});

// Emits
const emit = defineEmits(['close', 'limitChange']);

// Reactive data
const detailsData = ref([]);
const loading = ref(false);
const error = ref('');
const selectedLimit = ref(10);

// Computed
const formattedSelectedDate = computed(() => {
  if (!props.selectedDate) return '';
  
  const date = new Date(props.selectedDate);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('vi-VN', options);
});

const totalOrders = computed(() => {
  return detailsData.value.length;
});

const totalRevenue = computed(() => {
  return detailsData.value.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
});

const averageOrderValue = computed(() => {
  if (totalOrders.value === 0) return 0;
  return totalRevenue.value / totalOrders.value;
});

const popupStyle = computed(() => {
  // Positioning based on mouse click
  const { x, y } = props.mousePosition;
  
  // Ensure popup doesn't go off screen
  const maxWidth = window.innerWidth - 50;
  const maxHeight = window.innerHeight - 50;
  
  let left = x + 20;
  let top = y + 20;
  
  // Adjust if going off right edge
  if (left + 600 > maxWidth) {
    left = x - 620;
  }
  
  // Adjust if going off bottom edge
  if (top + 600 > maxHeight) {
    top = y - 620;
  }
  
  // Ensure minimum positioning
  left = Math.max(25, left);
  top = Math.max(25, top);
  
  return {
    left: `${left}px`,
    top: `${top}px`
  };
});

// Methods
const fetchDetails = async () => {
  if (!props.selectedDate || !props.period) return;
  
  try {
    loading.value = true;
    error.value = '';
    
    console.log('📊 Fetching order statistics details:', {
      period: props.period,
      date: props.selectedDate,
      limit: selectedLimit.value
    });
    
    const response = await getOrderStatsDetails(props.period, props.selectedDate, selectedLimit.value);
    
    if (response && response.status === 200 && response.data) {
      detailsData.value = response.data;
      console.log('✅ Details data loaded:', detailsData.value);
    } else {
      throw new Error(response.message || 'Failed to fetch details');
    }
  } catch (err) {
    console.error('❌ Error fetching details:', err);
    error.value = err.response?.data?.message || err.message || 'Không thể tải chi tiết thống kê đơn hàng';
    detailsData.value = [];
  } finally {
    loading.value = false;
  }
};

const closePopup = () => {
  emit('close');
};

const onLimitChange = () => {
  emit('limitChange', selectedLimit.value);
  fetchDetails();
};

const getRankBadgeClass = (rank) => {
  if (rank === 1) return 'rank-gold';
  if (rank === 2) return 'rank-silver';
  if (rank === 3) return 'rank-bronze';
  return 'rank-default';
};

const getStatusClass = (status) => {
  return getOrderStatusClass(status);
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Watchers
watch(() => props.show, (newShow) => {
  if (newShow) {
    fetchDetails();
  } else {
    // Reset data when closing
    detailsData.value = [];
    error.value = '';
  }
});

watch(() => [props.selectedDate, props.period], () => {
  if (props.show) {
    fetchDetails();
  }
});
</script>

<style scoped>
.order-stats-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.order-stats-popup {
  position: absolute;
  width: 700px;
  max-width: calc(100vw - 50px);
  max-height: calc(100vh - 50px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  animation: popupSlideIn 0.3s ease-out;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.popup-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-title {
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.popup-controls {
  display: flex;
  align-items: center;
}

.popup-controls .form-select {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.875rem;
  min-width: 120px;
}

.popup-controls .form-select:focus {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

.popup-body {
  padding: 1.25rem;
  max-height: 500px;
  overflow-y: auto;
}

/* --- Summary Stat Modern Gradient Card --- */
.summary-stat {
  background: linear-gradient(120deg, #6a93ff 0%, #a4e0ff 100%);
  color: #fff;
  padding: 0.8rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;
  box-shadow: 0 2px 12px 0 rgba(106,147,255,0.08), 0 1px 3px 0 rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
  transition: transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s;
}
.summary-stat.bg-success {
  background: linear-gradient(120deg, #43e97b 0%, #38f9d7 100%);
}
.summary-stat.bg-info {
  background: linear-gradient(120deg, #43c6ac 0%, #191654 100%);
}
.summary-stat:hover {
  transform: translateY(-3px) scale(1.025);
  box-shadow: 0 8px 32px 0 rgba(106,147,255,0.18), 0 3px 12px 0 rgba(0,0,0,0.08);
  z-index: 2;
}
.summary-stat i {
  font-size: 1.7rem;
  margin-right: 0.7rem;
  opacity: 1;
  background: rgba(255,255,255,0.18);
  border-radius: 50%;
  padding: 0.32rem 0.45rem;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.06);
  transition: background 0.2s;
}
.summary-stat:hover i {
  background: rgba(255,255,255,0.28);
}
.stat-info h6 {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.93;
  letter-spacing: 0.5px;
  font-weight: 500;
}
.stat-info h4 {
  margin: 0;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #fff 60%, #e0eaff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 1px 4px rgba(106,147,255,0.10);
}

.list-title {
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.orders-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.orders-container::-webkit-scrollbar {
  width: 6px;
}

.orders-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.orders-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.orders-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.order-item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  background: #fafbfc;
  transition: all 0.2s ease;
}

.order-item:hover {
  background: white;
  border-color: #cbd5e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.rank-badge {
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  width: fit-content;
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #744210;
}

.rank-silver {
  background: linear-gradient(135deg, #c0c0c0, #e5e7eb);
  color: #374151;
}

.rank-bronze {
  background: linear-gradient(135deg, #cd7f32, #d97706);
  color: white;
}

.rank-default {
  background: linear-gradient(135deg, #6b7280, #9ca3af);
  color: white;
}

.order-info {
  flex: 1;
  margin-bottom: 1rem;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.order-code {
  font-weight: 600;
  margin: 0;
  color: #2d3748;
  font-size: 0.95rem;
}

.order-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-meta > div {
  font-size: 0.8rem;
  color: #718096;
  display: flex;
  align-items: center;
}

.customer-info {
  font-weight: 500;
}

.order-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.product-info {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.product-text {
  font-size: 0.8rem;
  color: #4a5568;
  line-height: 1.4;
  max-height: 3.6em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Order Status Classes */
.status-pending {
  background: #fed7d7;
  color: #9b2c2c;
}

.status-confirmed {
  background: #bee3f8;
  color: #2a69ac;
}

.status-processing {
  background: #fef5e7;
  color: #975a16;
}

.status-shipped {
  background: #e6fffa;
  color: #234e52;
}

.status-delivered {
  background: #c6f6d5;
  color: #22543d;
}

.status-canceled {
  background: #fed7d7;
  color: #9b2c2c;
}

.status-refunded {
  background: #e9d8fd;
  color: #553c9a;
}

.status-default {
  background: #e2e8f0;
  color: #4a5568;
}

/* Responsive */
@media (max-width: 768px) {
  .order-stats-popup {
    width: calc(100vw - 20px);
    left: 10px !important;
    top: 10px !important;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .order-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .popup-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .popup-controls .form-select {
    min-width: 100px;
  }
}
</style>
