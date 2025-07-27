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
          <div v-if="showVoucherResults && voucherSearchResults.length > 0" class="voucher-dropdown">
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
              <span class="voucher-discount">-{{ formatCurrency(voucher.discountAmount) }}</span>
            </div>
            <button class="remove-voucher-btn" @click="removeVoucher(voucher.id)">
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
              class="form-input"
              type="number"
              :placeholder="formatCurrency(totalAmount)"
              @input="calculateChange"
            />
          </div>
          <div class="payment-summary">
            <div class="summary-row">
              <span>Tiền thừa trả khách:</span>
              <span class="change-amount">{{ formatCurrency(changeAmount) }}</span>
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
      @click="confirmPayment"
      :disabled="!canConfirmPayment"
    >
      <i class="bi bi-check-circle"></i>
      Xác nhận thanh toán (F9)
      <span class="payment-amount">{{ formatCurrency(totalAmount) }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { searchVouchers as searchVouchersAPI } from '@/services/admin/counterSales';

// Props
const props = defineProps({
  totalAmount: {
    type: Number,
    default: 0
  },
  orderItems: {
    type: Array,
    default: () => []
  }
});

// Emit events
const emit = defineEmits(['voucher-applied', 'voucher-removed', 'payment-confirmed']);

// Data
const paymentMethod = ref('CASH');
const orderNotes = ref('');
const customerPaid = ref(0);
const changeAmount = ref(0);

// Voucher states
const voucherSearchTerm = ref('');
const voucherSearchResults = ref([]);
const appliedVouchers = ref([]);
const showVoucherResults = ref(false);
let voucherSearchTimeout = null;

// Computed
const canConfirmPayment = computed(() => {
  if (!props.orderItems.length) return false;
  if (paymentMethod.value === 'CASH') {
    return customerPaid.value >= props.totalAmount;
  }
  return true;
});

// Methods
const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const calculateChange = () => {
  const paid = Number(customerPaid.value) || 0;
  const total = Number(props.totalAmount) || 0;
  changeAmount.value = Math.max(0, paid - total);
  console.log('Calculating change:', { paid, total, change: changeAmount.value });
};

const onVoucherSearch = async () => {
  if (voucherSearchTimeout) {
    clearTimeout(voucherSearchTimeout);
  }
  
  voucherSearchTimeout = setTimeout(async () => {
    if (voucherSearchTerm.value.trim().length >= 2) {
      try {
        const response = await searchVouchersAPI(voucherSearchTerm.value.trim(), 5);
        voucherSearchResults.value = response.data || [];
        showVoucherResults.value = true;
      } catch (error) {
        console.error('Error searching vouchers:', error);
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
    const voucher = vouchers.find(v => v.code.toLowerCase() === code.toLowerCase());
    
    if (voucher) {
      applyVoucher(voucher);
    } else {
      alert('Không tìm thấy voucher với mã: ' + code);
    }
  } catch (error) {
    console.error('Error applying voucher by code:', error);
    alert('Lỗi khi áp dụng voucher');
  }
};

const applyVoucher = (voucher) => {
  if (appliedVouchers.value.find(v => v.id === voucher.id)) {
    alert('Voucher này đã được áp dụng');
    return;
  }
  
  if (voucher.minOrderValue && props.totalAmount < voucher.minOrderValue) {
    alert(`Đơn hàng tối thiểu ${formatCurrency(voucher.minOrderValue)} để sử dụng voucher này`);
    return;
  }
  
  let discountAmount = 0;
  if (voucher.discountType === 'PERCENTAGE') {
    discountAmount = (props.totalAmount * voucher.discountPercentage) / 100;
    if (voucher.maxDiscountValue) {
      discountAmount = Math.min(discountAmount, voucher.maxDiscountValue);
    }
  } else {
    discountAmount = voucher.discountAmount;
  }
  
  const voucherWithDiscount = {
    ...voucher,
    discountAmount: discountAmount
  };
  
  appliedVouchers.value.push(voucherWithDiscount);
  emit('voucher-applied', voucherWithDiscount);
  
  voucherSearchTerm.value = '';
  voucherSearchResults.value = [];
  showVoucherResults.value = false;
};

const removeVoucher = (voucherId) => {
  const index = appliedVouchers.value.findIndex(v => v.id === voucherId);
  if (index !== -1) {
    const removedVoucher = appliedVouchers.value.splice(index, 1)[0];
    emit('voucher-removed', removedVoucher);
  }
};

const confirmPayment = () => {
  if (!canConfirmPayment.value) {
    if (paymentMethod.value === 'CASH' && customerPaid.value < props.totalAmount) {
      alert('Số tiền khách đưa phải lớn hơn hoặc bằng tổng tiền đơn hàng');
      return;
    }
    return;
  }
  
  const paymentData = {
    paymentMethod: paymentMethod.value,
    notes: orderNotes.value.trim(),
    appliedVouchers: appliedVouchers.value,
    customerPaid: paymentMethod.value === 'CASH' ? Number(customerPaid.value) : props.totalAmount,
    changeAmount: paymentMethod.value === 'CASH' ? Number(changeAmount.value) : 0
  };
  
  console.log('Payment data being emitted:', paymentData);
  
  emit('payment-confirmed', paymentData);
};

const handleClickOutside = (event) => {
  const voucherSection = event.target.closest('.voucher-section');
  if (!voucherSection) {
    showVoucherResults.value = false;
  }
};

watch(() => props.totalAmount, (newTotal) => {
  if (paymentMethod.value === 'CASH' && newTotal > 0) {
    // Chỉ cập nhật customerPaid nếu chưa có giá trị hoặc nhỏ hơn tổng tiền
    if (!customerPaid.value || customerPaid.value < newTotal) {
      customerPaid.value = newTotal;
    }
    calculateChange();
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F6') {
      e.preventDefault();
      document.querySelector('.voucher-input')?.focus();
    } else if (e.key === 'F9') {
      e.preventDefault();
      confirmPayment();
    }
  });
  
  if (props.totalAmount > 0) {
    customerPaid.value = props.totalAmount;
    calculateChange();
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
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
</style>
