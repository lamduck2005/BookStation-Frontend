<template>
  <div class="pos-order-summary">
    <div class="summary-header">
      <h6 class="summary-title">
        <i class="bi bi-calculator"></i>
        Tóm tắt đơn hàng
      </h6>
    </div>
    
    <div class="summary-content">
      <div class="summary-row">
        <span class="summary-label">
          Tạm tính ({{ orderItems.length }} sản phẩm):
        </span>
        <span class="summary-value">{{ formatCurrency(subtotal) }}</span>
      </div>
      
      <div v-if="appliedVouchers.length > 0" class="voucher-section">
        <div class="summary-row voucher-header">
          <span class="summary-label">
            <i class="bi bi-ticket-perforated"></i>
            Voucher đã áp dụng:
          </span>
        </div>
        <div 
          v-for="voucher in appliedVouchers" 
          :key="voucher.id"
          class="voucher-item"
        >
          <div class="voucher-info">
            <span class="voucher-name">{{ voucher.name }}</span>
            <span class="voucher-code">{{ voucher.code }}</span>
          </div>
          <span class="voucher-discount">-{{ formatCurrency(voucher.discountAmount) }}</span>
        </div>
        <div class="summary-row total-discount">
          <span class="summary-label">Tổng giảm giá:</span>
          <span class="summary-value discount">-{{ formatCurrency(totalVoucherDiscount) }}</span>
        </div>
      </div>
      
      <div class="summary-divider"></div>
      
      <div class="summary-row total-row">
        <span class="total-label">Khách phải trả:</span>
        <span class="total-amount">{{ formatCurrency(finalTotal) }}</span>
      </div>
      
      <!-- Flash sale savings -->
      <div v-if="totalFlashSaleSavings > 0" class="savings-info">
        <i class="bi bi-lightning-fill"></i>
        Tiết kiệm từ Flash Sale nếu khách có tài khoản: {{ formatCurrency(totalFlashSaleSavings) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  orderItems: {
    type: Array,
    default: () => []
  },
  appliedVouchers: {
    type: Array,
    default: () => []
  },
  calculation: {
    type: Object,
    default: () => null
  }
});

// Computed values
const subtotal = computed(() => {
  // Ưu tiên sử dụng subtotal từ API calculation nếu có
  if (props.calculation?.subtotal) {
    return props.calculation.subtotal;
  }
  // Fallback: tính từ orderItems
  return props.orderItems.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
});

const totalVoucherDiscount = computed(() => {
  if (props.calculation?.discountAmount) {
    return props.calculation.discountAmount;
  }
  return props.appliedVouchers.reduce((sum, voucher) => {
    return sum + (voucher.discountAmount || 0);
  }, 0);
});

const finalTotal = computed(() => {
  // Ưu tiên sử dụng totalAmount từ API calculation nếu có
  if (props.calculation?.totalAmount !== undefined && props.calculation?.totalAmount !== null) {
    console.log("🔥 PosOrderSummary using totalAmount from API:", props.calculation.totalAmount);
    return props.calculation.totalAmount;
  }
  // Fallback: tính toán từ subtotal và voucher discount
  const fallbackTotal = Math.max(0, subtotal.value - totalVoucherDiscount.value);
  console.log("🔥 PosOrderSummary using fallback calculation:", fallbackTotal);
  console.log("🔥 PosOrderSummary calculation prop:", props.calculation);
  return fallbackTotal;
});

const totalFlashSaleSavings = computed(() => {
  return props.orderItems.reduce((sum, item) => {
    if (item.isFlashSale && (item.originalPrice || item.normalPrice)) {
      const originalPrice = item.originalPrice || item.normalPrice;
      const savings = (originalPrice - item.unitPrice) * item.quantity;
      return sum + savings;
    }
    return sum;
  }, 0);
});

// Methods
const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
</script>

<style scoped>
.pos-order-summary {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* Xóa margin-bottom vì đã có gap trong sidebar */
  flex-shrink: 0; /* Thêm để đảm bảo component không bị thu nhỏ */
  min-height: 120px; /* Thêm min-height để đảm bảo luôn hiển thị */
}

.summary-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-content {
  padding: 16px 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.summary-label {
  color: #64748b;
  font-size: 14px;
}

.summary-value {
  font-weight: 500;
  color: #1e293b;
}

.voucher-section {
  margin: 16px 0;
  padding: 12px;
  background: #fef3f2;
  border-radius: 8px;
  border: 1px solid #fed7d7;
}

.voucher-header .summary-label {
  color: #dc2626;
  font-weight: 500;
}

.voucher-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 8px 0;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #fecaca;
}

.voucher-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.voucher-name {
  font-weight: 500;
  color: #991b1b;
  font-size: 13px;
}

.voucher-code {
  font-size: 11px;
  color: #7f1d1d;
  font-family: monospace;
  background: #fef2f2;
  padding: 2px 4px;
  border-radius: 3px;
}

.voucher-discount {
  font-weight: 600;
  color: #dc2626;
  font-size: 13px;
}

.total-discount .summary-label {
  font-weight: 500;
}

.summary-value.discount {
  color: #dc2626;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 16px 0;
}

.total-row {
  margin-bottom: 0;
}

.total-label {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: #059669;
}

.savings-info {
  margin-top: 12px;
  padding: 8px 12px;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 6px;
  color: #92400e;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.savings-info i {
  color: #f59e0b;
}

/* Responsive */
@media (max-width: 768px) {
  .summary-content {
    padding: 12px 16px;
  }
  
  .voucher-section {
    padding: 8px;
  }
  
  .total-amount {
    font-size: 16px;
  }
}
</style>