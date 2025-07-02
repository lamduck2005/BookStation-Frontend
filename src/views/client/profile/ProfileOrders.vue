<template>
  <div class="profile-orders">
    <!-- Warning Alert -->
    <div class="alert alert-warning d-flex align-items-center mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span>Bạn vui lòng cắp nhật thông tin tài khoản:</span>
      <a href="#" class="ms-2 text-primary fw-bold">Cắp nhật thông tin ngay</a>
    </div>

    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Đơn hàng của tôi</h2>
    </div>

    <!-- Order Status Tabs -->
    <div class="order-tabs mb-4">
      <button 
        v-for="tab in orderTabs" 
        :key="tab.key"
        class="order-tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <span class="tab-count" v-if="tab.count > 0">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Orders List -->
    <div class="orders-list">
      <div v-if="filteredOrders.length === 0" class="no-orders">
        <div class="empty-state">
          <i class="bi bi-journal-text text-muted"></i>
          <p class="text-muted">{{ getEmptyMessage() }}</p>
        </div>
      </div>

      <div v-else>
        <div v-for="order in filteredOrders" :key="order.id" class="order-card mb-4">
          <!-- Order Header -->
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-status" :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <div class="order-date">
              {{ formatDate(order.date) }}
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <div class="item-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="item-info">
                <h6 class="item-name">{{ item.name }}</h6>
                <p class="item-quantity">{{ item.quantity }} sản phẩm</p>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="order-footer">
            <div class="order-total">
              <span class="total-label">Tổng tiền:</span>
              <span class="total-amount">{{ formatCurrency(order.total) }}</span>
            </div>
            <div class="order-actions">
              <button 
                v-if="order.status === 'cancelled'" 
                class="btn btn-outline-danger btn-sm"
                @click="cancelOrder(order.id)"
              >
                Hủy đơn
              </button>
              <button class="btn btn-primary btn-sm" @click="viewOrderDetail(order.id)">
                {{ order.status === 'cancelled' ? 'Mua lại' : 'Xem chi tiết' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('all')

const orderTabs = [
  { key: 'all', label: 'Tất cả', count: 5 },
  { key: 'pending', label: 'Chờ thanh toán', count: 0 },
  { key: 'processing', label: 'Đang xử lý', count: 0 },
  { key: 'shipping', label: 'Đang giao', count: 0 },
  { key: 'completed', label: 'Hoàn tất', count: 0 },
  { key: 'cancelled', label: 'Bị hủy', count: 5 },
  { key: 'returned', label: 'Đổi trả', count: 0 }
]

// Fake orders data
const orders = ref([
  {
    id: '103658057',
    date: '2025-04-11T17:12:00',
    status: 'cancelled',
    total: 351890,
    items: [
      {
        id: 1,
        name: 'Giáo Trình Chuẩn YCT 1 - Sách Bài Tập',
        quantity: 6,
        image: '/src/assets/img/duck.png'
      }
    ]
  },
  {
    id: '103655306',
    date: '2025-04-06T16:43:00',
    status: 'cancelled',
    total: 351890,
    items: [
      {
        id: 1,
        name: 'Giáo Trình Chuẩn YCT 1 - Sách Bài Tập',
        quantity: 6,
        image: '/src/assets/img/duck.png'
      }
    ]
  },
  {
    id: '103655105',
    date: '2025-04-06T16:40:00',
    status: 'cancelled',
    total: 58648,
    items: [
      {
        id: 1,
        name: 'Combo Sách Giáo Khoa Lớp 1',
        quantity: 1,
        image: '/src/assets/img/duck.png'
      }
    ]
  },
  {
    id: '103655004',
    date: '2025-04-06T16:38:00',
    status: 'cancelled',
    total: 175944,
    items: [
      {
        id: 1,
        name: 'Bộ Sách Văn Học Kinh Điển',
        quantity: 3,
        image: '/src/assets/img/duck.png'
      }
    ]
  },
  {
    id: '103654903',
    date: '2025-04-06T16:35:00',
    status: 'cancelled',
    total: 234520,
    items: [
      {
        id: 1,
        name: 'Sách Thiếu Nhi Hay Nhất',
        quantity: 2,
        image: '/src/assets/img/duck.png'
      }
    ]
  }
])

// Computed filtered orders
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(order => order.status === activeTab.value)
})

// Get status class
const getStatusClass = (status) => {
  const statusClasses = {
    pending: 'status-pending',
    processing: 'status-processing',
    shipping: 'status-shipping',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
    returned: 'status-returned'
  }
  return statusClasses[status] || ''
}

// Get status text
const getStatusText = (status) => {
  const statusTexts = {
    pending: 'Chờ thanh toán',
    processing: 'Đang xử lý',
    shipping: 'Đang giao',
    completed: 'Hoàn tất',
    cancelled: 'Bị hủy',
    returned: 'Đổi trả'
  }
  return statusTexts[status] || status
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN') + ' - ' + date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
}

// Get empty message
const getEmptyMessage = () => {
  const messages = {
    all: 'Bạn chưa có đơn hàng nào.',
    pending: 'Không có đơn hàng chờ thanh toán.',
    processing: 'Không có đơn hàng đang xử lý.',
    shipping: 'Không có đơn hàng đang giao.',
    completed: 'Không có đơn hàng hoàn tất.',
    cancelled: 'Không có đơn hàng bị hủy.',
    returned: 'Không có đơn hàng đổi trả.'
  }
  return messages[activeTab.value] || 'Không có đơn hàng.'
}

// Cancel order
const cancelOrder = (orderId) => {
  if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'cancelled'
    }
  }
}

// View order detail
const viewOrderDetail = (orderId) => {
  // TODO: Navigate to order detail page
  console.log('View order detail:', orderId)
}
</script>

<style scoped>
.profile-orders {
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

.order-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e9ecef;
  overflow-x: auto;
}

.order-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s ease;
}

.order-tab:hover {
  color: #333;
}

.order-tab.active {
  color: #dc3545;
  border-bottom-color: #dc3545;
}

.tab-count {
  background: #dc3545;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
}

.orders-list {
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

.order-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-id {
  font-size: 16px;
  font-weight: 600;
  color: #2196f3;
}

.order-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-processing {
  background: #cce5ff;
  color: #004085;
}

.status-shipping {
  background: #d1ecf1;
  color: #0c5460;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-returned {
  background: #ffeaa7;
  color: #856404;
}

.order-date {
  font-size: 14px;
  color: #666;
}

.order-items {
  padding: 20px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.item-quantity {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-label {
  font-size: 14px;
  color: #666;
}

.total-amount {
  font-size: 16px;
  font-weight: 600;
  color: #dc3545;
}

.order-actions {
  display: flex;
  gap: 12px;
}

.btn-sm {
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .profile-orders {
    padding: 16px;
  }
  
  .order-tabs {
    gap: 0;
  }
  
  .order-tab {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .order-header,
  .order-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .order-info {
    justify-content: space-between;
  }
  
  .order-actions {
    justify-content: flex-end;
  }
}
</style>
