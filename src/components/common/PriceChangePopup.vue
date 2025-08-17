<template>
  <div
    v-if="show"
    class="price-change-modal"
    @click="close"
  >
    <div
      class="price-change-content"
      @click.stop
    >
      <div class="change-header">
        <h5 class="mb-0">
          <i class="fas fa-exclamation-triangle me-2 text-warning"></i>
          Thông báo thay đổi giá
        </h5>
        <button
          type="button"
          class="btn-close"
          @click="close"
        ></button>
      </div>
      
      <div class="change-body">
        <div class="alert alert-warning border-0 mb-3">
          <h6 class="alert-heading mb-2">
            <i class="fas fa-info-circle me-2"></i>
            Giá sản phẩm đã được cập nhật
          </h6>
          <p class="mb-0">
            Chúng tôi phát hiện giá một số sản phẩm trong đơn hàng của bạn đã thay đổi. 
            Vui lòng xem chi tiết bên dưới và quyết định có tiếp tục mua không.
          </p>
        </div>

        <!-- Comparison table -->
        <div class="price-comparison mb-4">
          <h6 class="text-primary mb-3">
            <i class="fas fa-balance-scale me-2"></i>
            So sánh giá trước và sau
          </h6>
          
          <div class="comparison-table">
            <!-- Subtotal comparison -->
            <div class="comparison-row">
              <span class="label">Thành tiền sản phẩm:</span>
              <div class="price-values">
                <span class="old-price">{{ formatPrice(priceChanges.oldSubtotal) }}</span>
                <i class="fas fa-arrow-right mx-2 text-muted"></i>
                <span class="new-price">{{ formatPrice(priceChanges.newSubtotal) }}</span>
              </div>
            </div>
            
            <!-- Voucher discount comparison if applicable -->
            <div v-if="priceChanges.oldVoucherDiscount > 0 || priceChanges.newVoucherDiscount > 0" class="comparison-row voucher-row">
              <span class="label">
                <i class="fas fa-ticket-alt me-1 text-success"></i>
                Tổng giảm giá voucher:
              </span>
              <div class="price-values">
                <span class="old-discount">-{{ formatPrice(priceChanges.oldVoucherDiscount) }}</span>
                <i class="fas fa-arrow-right mx-2 text-muted"></i>
                <span class="new-discount">-{{ formatPrice(priceChanges.newVoucherDiscount) }}</span>
              </div>
            </div>
            
            <!-- Shipping fee -->
            <div class="comparison-row">
              <span class="label">Phí vận chuyển:</span>
              <div class="price-values">
                <span class="shipping-fee">{{ formatPrice(priceChanges.shippingFee) }}</span>
              </div>
            </div>
            
            <!-- Total comparison -->
            <div class="comparison-row total-row">
              <span class="label">Tổng thanh toán:</span>
              <div class="price-values">
                <span class="old-total">{{ formatPrice(priceChanges.oldTotal) }}</span>
                <i class="fas fa-arrow-right mx-2 text-muted"></i>
                <span class="new-total">{{ formatPrice(priceChanges.newTotal) }}</span>
                <span class="price-difference" :class="priceDifferenceClass">
                  ({{ priceDifferenceText }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Changed items details -->
        <div v-if="changedItems && changedItems.length > 0" class="changed-items mb-4">
          <h6 class="text-primary mb-3">
            <i class="fas fa-list me-2"></i>
            Sản phẩm có thay đổi
          </h6>
          
          <div class="items-list">
            <div 
              v-for="item in changedItems" 
              :key="item.bookId"
              class="item-change-card mb-2"
            >
              <div class="d-flex align-items-center">
                <img 
                  :src="item.bookImage || '/src/assets/img/book-placeholder.svg'" 
                  alt="Product" 
                  class="item-image me-3"
                >
                <div class="item-details flex-grow-1">
                  <div class="item-name fw-bold">{{ item.bookTitle }}</div>
                  <div class="item-quantity text-muted small">Số lượng: {{ item.quantity }}</div>
                  <div class="item-price-change">
                    <span class="old-price small">{{ formatPrice(item.oldUnitPrice) }}</span>
                    <i class="fas fa-arrow-right mx-1 text-muted small"></i>
                    <span class="new-price small fw-bold">{{ formatPrice(item.newUnitPrice) }}</span>
                    <span v-if="item.changeReason" class="change-reason badge bg-info ms-2">
                      {{ item.changeReason }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Voucher info if applicable -->
        <div v-if="appliedVouchers && appliedVouchers.length > 0" class="voucher-info mb-4">
          <h6 class="text-success mb-3">
            <i class="fas fa-ticket-alt me-2"></i>
            Voucher đang áp dụng
          </h6>
          
          <div class="voucher-list">
            <div 
              v-for="voucher in appliedVouchers" 
              :key="voucher.id"
              class="voucher-item mb-2"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="voucher-code fw-bold text-primary">{{ voucher.code }}</span>
                  <span class="voucher-name ms-2">{{ voucher.name }}</span>
                </div>
                <span class="voucher-discount text-success fw-bold">
                  {{ getVoucherDiscountText(voucher) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reasons for price change -->
        <div class="change-reasons">
          <h6 class="text-info mb-3">
            <i class="fas fa-question-circle me-2"></i>
            Tại sao giá thay đổi?
          </h6>
          
          <div class="reasons-list">
            <div class="reason-item">
              <i class="fas fa-bolt text-warning me-2"></i>
              <strong>Flash Sale:</strong> Chương trình khuyến mãi có thể đã bắt đầu hoặc kết thúc
            </div>
            <div class="reason-item">
              <i class="fas fa-chart-line text-primary me-2"></i>
              <strong>Điều chỉnh giá:</strong> Cập nhật giá bán để phù hợp với thị trường
            </div>
            <div class="reason-item">
              <i class="fas fa-warehouse text-secondary me-2"></i>
              <strong>Tình trạng kho:</strong> Số lượng tồn kho ảnh hưởng đến chính sách giá
            </div>
            <div class="reason-item">
              <i class="fas fa-tag text-success me-2"></i>
              <strong>Voucher:</strong> Điều kiện áp dụng voucher có thể đã thay đổi
            </div>
          </div>
        </div>
      </div>
      
      <div class="change-footer">
        <div class="d-flex justify-content-between align-items-center">
          <div class="warning-note">
            <small class="text-muted">
              <i class="fas fa-clock me-1"></i>
              Giá có thể tiếp tục thay đổi nếu bạn không hoàn thành đặt hàng sớm
            </small>
          </div>
          <div class="action-buttons">
            <button 
              type="button" 
              class="btn btn-outline-secondary me-2"
              @click="close"
            >
              <i class="fas fa-shopping-cart me-1"></i>
              Quay lại giỏ hàng
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="acceptChanges"
            >
              <i class="fas fa-check me-1"></i>
              Tiếp tục mua hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  priceChanges: {
    type: Object,
    required: true,
    default: () => ({
      oldSubtotal: 0,
      newSubtotal: 0,
      oldVoucherDiscount: 0,
      newVoucherDiscount: 0,
      oldTotal: 0,
      newTotal: 0,
      shippingFee: 0
    })
  },
  changedItems: {
    type: Array,
    default: () => []
  },
  appliedVouchers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'accept-changes', 'go-back-to-cart'])

const formatPrice = (price) => {
  if (!price) return '0 ₫'
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
}

const priceDifference = computed(() => {
  return props.priceChanges.newTotal - props.priceChanges.oldTotal
})

const priceDifferenceClass = computed(() => {
  if (priceDifference.value > 0) return 'text-danger'
  if (priceDifference.value < 0) return 'text-success'
  return 'text-muted'
})

const priceDifferenceText = computed(() => {
  if (priceDifference.value === 0) return 'Không đổi'
  const prefix = priceDifference.value > 0 ? '+' : ''
  return `${prefix}${formatPrice(Math.abs(priceDifference.value))}`
})

const close = () => {
  emit('close')
}

const acceptChanges = () => {
  emit('accept-changes')
}

const getVoucherDiscountText = (voucher) => {
  if (!voucher) return ''
  
  // Nếu có discountInfo từ selectedVouchers cũ
  if (voucher.discountInfo) {
    return voucher.discountInfo
  }
  
  // Nếu có thông tin từ selectedVouchers trong response validate
  if (voucher.discountType && voucher.discountValue) {
    if (voucher.discountType === 'PERCENTAGE') {
      return `Giảm ${voucher.discountValue}%`
    } else if (voucher.discountType === 'FIXED_AMOUNT') {
      return `Giảm ${formatPrice(voucher.discountValue)}`
    }
  }
  
  // Fallback
  return voucher.name || 'Voucher được áp dụng'
}
</script>

<style scoped>
.price-change-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1070;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

.price-change-content {
  background: white;
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideInScale 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInScale {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.change-header {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  padding: 1.5rem;
  border-bottom: 3px solid #ffc107;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.change-header h5 {
  color: #856404;
  font-weight: 700;
  margin: 0;
}

.change-header .btn-close {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #856404;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.change-header .btn-close:hover {
  background: rgba(255, 193, 7, 0.2);
  transform: scale(1.1);
}

.change-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.comparison-table {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.comparison-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.comparison-row:last-child {
  border-bottom: none;
}

.comparison-row .label {
  font-weight: 600;
  color: #495057;
}

.price-values {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.old-price, .old-discount, .old-total {
  text-decoration: line-through;
  color: #6c757d;
  font-size: 0.9rem;
}

.new-price, .new-discount, .new-total {
  font-weight: 700;
  color: #dc3545;
}

.new-discount {
  color: #28a745;
}

.voucher-row {
  background: rgba(40, 167, 69, 0.05);
  border-radius: 8px;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid rgba(40, 167, 69, 0.2);
}

.voucher-row .label {
  color: #28a745;
  font-weight: 700;
}

.shipping-fee {
  font-weight: 600;
  color: #6c757d;
}

.total-row {
  border-top: 2px solid #ffc107;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-size: 1.1rem;
}

.total-row .new-total {
  font-size: 1.2rem;
  color: #dc3545;
}

.price-difference {
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.item-change-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.item-change-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.item-image {
  width: 50px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.item-name {
  color: #495057;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.item-quantity {
  margin-bottom: 0.5rem;
}

.item-price-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.change-reason {
  font-size: 0.7rem;
}

.voucher-item {
  background: #e8f5e8;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 0.75rem;
}

.voucher-code {
  font-size: 0.9rem;
}

.voucher-name {
  font-size: 0.8rem;
  color: #6c757d;
}

.voucher-discount {
  font-size: 0.9rem;
}

.reasons-list {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.reason-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.4;
}

.reason-item:last-child {
  margin-bottom: 0;
}

.change-footer {
  background: #f8f9fa;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.warning-note {
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-buttons .btn {
  border-radius: 25px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-buttons .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-buttons .btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border-color: #007bff;
}

.action-buttons .btn-primary:hover {
  background: linear-gradient(135deg, #0056b3 0%, #007bff 100%);
}

/* Custom scrollbar */
.change-body::-webkit-scrollbar {
  width: 8px;
}

.change-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.change-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  border-radius: 10px;
}

.change-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #e0a800 0%, #ffc107 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .price-change-content {
    margin: 0.5rem;
    max-width: calc(100% - 1rem);
    border-radius: 15px;
  }
  
  .change-header {
    padding: 1rem;
  }
  
  .change-body {
    padding: 1rem;
  }
  
  .comparison-table {
    padding: 1rem;
  }
  
  .change-footer {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: center;
  }
  
  .action-buttons .btn {
    flex: 1;
    min-width: 120px;
  }
  
  .comparison-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .price-values {
    align-self: flex-end;
  }
}

@media (max-width: 576px) {
  .change-header h5 {
    font-size: 1rem;
  }
  
  .item-change-card {
    padding: 0.75rem;
  }
  
  .item-image {
    width: 40px;
    height: 50px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .btn {
    width: 100%;
  }
}
</style>
