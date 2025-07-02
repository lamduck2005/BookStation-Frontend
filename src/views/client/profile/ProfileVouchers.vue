<template>
  <div class="profile-vouchers">
    <!-- Warning Alert -->
    <div class="alert alert-warning d-flex align-items-center mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span>Bạn vui lòng cắp nhật thông tin tài khoản:</span>
      <a href="#" class="ms-2 text-primary fw-bold">Cắp nhật thông tin ngay</a>
    </div>

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
      <div v-if="filteredVouchers.length === 0" class="no-vouchers">
        <div class="empty-state">
          <i class="bi bi-ticket-perforated text-muted"></i>
          <p class="text-muted">{{ getEmptyMessage() }}</p>
        </div>
      </div>

      <div v-else class="row">
        <div v-for="voucher in filteredVouchers" :key="voucher.id" class="col-lg-6 mb-4">
          <div class="voucher-card" :class="{ expired: voucher.status === 'expired' }">
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
                <small class="text-muted">HSD: {{ formatDate(voucher.expiryDate) }}</small>
              </div>
            </div>

            <!-- Voucher Actions -->
            <div class="voucher-actions">
              <button class="btn btn-sm btn-primary" @click="viewVoucherDetails(voucher)">
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('available')

const voucherTabs = [
  { key: 'available', label: 'Voucher của tôi' },
  { key: 'partner', label: 'Voucher đối tác' }
]

// Fake vouchers data
const vouchers = ref([
  {
    id: 1,
    title: 'Mã Giảm 10K - Toàn Sàn',
    description: 'Đơn hàng từ 130k - Không bao gồm giá ưu đãi của các sản phẩm sau Manga, Ngoại Văn...',
    code: 'FHS10KT07',
    expiryDate: '2025-07-31',
    type: 'discount',
    category: 'available',
    status: 'active'
  },
  {
    id: 2,
    title: 'Mã Giảm 20K - Toàn Sàn',
    description: 'Đơn hàng từ 249k - Không bao gồm giá ưu đãi của các sản phẩm sau Manga, Ngoại Văn...',
    code: 'FHS20KT07',
    expiryDate: '2025-07-31',
    type: 'discount',
    category: 'available',
    status: 'active'
  },
  {
    id: 3,
    title: 'Mã Giảm 40K - Toàn Sàn',
    description: 'Đơn hàng từ 499k - Không bao gồm giá ưu đãi của các sản phẩm sau Manga, Ngoại Văn...',
    code: 'FHS40KT07',
    expiryDate: '2025-07-31',
    type: 'discount',
    category: 'available',
    status: 'active'
  },
  {
    id: 4,
    title: 'Mã Giảm 80K - Toàn Sàn',
    description: 'Đơn hàng từ 999k - Không bao gồm giá ưu đãi của các sản phẩm sau Manga, Ngoại...',
    code: 'FHS80KT07',
    expiryDate: '2025-07-31',
    type: 'discount',
    category: 'available',
    status: 'active'
  },
  {
    id: 5,
    title: 'Mã Giảm 10% - VPP & DCHS',
    description: 'Giảm tối đa 50K cho ĐH từ 100k',
    code: 'VPP10PCT07',
    expiryDate: '2025-07-31',
    type: 'percent',
    category: 'available',
    status: 'active'
  },
  {
    id: 6,
    title: 'Mã Giảm 20K - Sách Thiếu Nhi',
    description: 'Đơn hàng từ 210k',
    code: 'STN20KT07',
    expiryDate: '2025-07-31',
    type: 'discount',
    category: 'available',
    status: 'active'
  },
  // Partner vouchers
  {
    id: 7,
    title: 'Voucher Shopee - Giảm 15K',
    description: 'Áp dụng cho đơn hàng từ 200k trên Shopee',
    code: 'SHOPEE15K',
    expiryDate: '2025-08-15',
    type: 'partner',
    category: 'partner',
    status: 'active'
  },
  {
    id: 8,
    title: 'Voucher Grab - Miễn phí vận chuyển',
    description: 'Miễn phí giao hàng cho đơn hàng sách',
    code: 'GRABFREE',
    expiryDate: '2025-07-20',
    type: 'freeship',
    category: 'partner',
    status: 'active'
  }
])

// Computed filtered vouchers
const filteredVouchers = computed(() => {
  return vouchers.value.filter(voucher => voucher.category === activeTab.value)
})

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

// Get empty message
const getEmptyMessage = () => {
  return activeTab.value === 'available' 
    ? 'Bạn chưa có voucher nào.' 
    : 'Không có voucher đối tác nào khả dụng.'
}

// Copy voucher code
const copyVoucherCode = (code) => {
  navigator.clipboard.writeText(code).then(() => {
    alert(`Đã copy mã voucher: ${code}`)
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = code
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert(`Đã copy mã voucher: ${code}`)
  })
}

// View voucher details
const viewVoucherDetails = (voucher) => {
  alert(`Chi tiết voucher: ${voucher.title}\nMã: ${voucher.code}\nMô tả: ${voucher.description}`)
}
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
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
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
  font-family: 'Courier New', monospace;
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
