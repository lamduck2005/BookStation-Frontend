<template>
  <div class="pos-order-list">
    <div class="order-list-header">
      <span class="order-title">
        <i class="bi bi-cart3"></i>
        Đơn hàng tại quầy
      </span>
      <button class="clear-order-btn" @click="clearOrder" v-if="orderItems.length > 0">
        <i class="bi bi-trash"></i>
      </button>
    </div>
    
    <div class="order-content">
      <!-- Hiển thị khi chưa có sản phẩm -->
      <div v-if="orderItems.length === 0" class="empty-order">
        <div class="empty-icon">
          <i class="bi bi-cart-plus"></i>
        </div>
        <div class="empty-text">
          <div class="empty-title">Đơn hàng trống</div>
          <div class="empty-subtitle">Tìm kiếm và thêm sản phẩm vào đơn hàng</div>
        </div>
      </div>
      
      <!-- Danh sách sản phẩm -->
      <div v-else class="order-items">
        <div 
          v-for="(item, index) in orderItems" 
          :key="item.bookId || index"
          class="order-item"
        >
          <div class="item-image">
            <img
              v-if="item.coverImageUrl"
              :src="item.coverImageUrl"
              :alt="item.title || item.name"
              class="product-image"
            />
            <div v-else class="no-image">
              <i class="bi bi-book"></i>
            </div>
          </div>
          
          <div class="item-details">
            <div class="item-name">{{ item.name || "Tên sách không xác định"   }}</div>
            <div class="item-code">{{ item.bookCode }}</div>
            <div class="item-price-info">
              <span v-if="item.isFlashSale" class="flash-sale-badge">
                <i class="bi bi-lightning-fill"></i> Flash Sale
              </span>
              <div class="price-display">
                <span class="current-price">{{ formatCurrency(item.unitPrice) }}</span>
                <span v-if="item.isFlashSale" class="original-price">
                  {{ formatCurrency(item.originalPrice || item.normalPrice) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="item-controls">
            <div class="quantity-controls">
              <button 
                class="qty-btn minus" 
                @click="decreaseQuantity(index)"
                :disabled="item.quantity <= 1"
              >
                <i class="bi bi-dash"></i>
              </button>
              <input 
                v-model.number="item.quantity"
                class="qty-input"
                type="number"
                min="1"
                :max="item.stockQuantity || 999"
                @input="updateQuantity(index, $event)"
                @blur="validateQuantity(index)"
              />
              <button 
                class="qty-btn plus" 
                @click="increaseQuantity(index)"
                :disabled="item.quantity >= (item.stockQuantity || 999)"
              >
                <i class="bi bi-plus"></i>
              </button>
            </div>
            
            <div class="item-total">
              {{ formatCurrency(item.quantity * item.unitPrice) }}
            </div>
            
            <button class="remove-btn" @click="removeItem(index)">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props để nhận dữ liệu từ component cha
const props = defineProps({
  orderItems: {
    type: Array,
    default: () => []
  }
});

// Emit để gửi sự kiện lên component cha
const emit = defineEmits(['update-quantity', 'remove-item', 'clear-order']);

// Methods
const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const increaseQuantity = (index) => {
  const item = props.orderItems[index];
  const newQuantity = item.quantity + 1;
  const maxQuantity = item.stockQuantity || 999;
  
  if (newQuantity <= maxQuantity) {
    emit('update-quantity', index, newQuantity);
  }
};

const decreaseQuantity = (index) => {
  const item = props.orderItems[index];
  const newQuantity = item.quantity - 1;
  
  if (newQuantity >= 1) {
    emit('update-quantity', index, newQuantity);
  }
};

const updateQuantity = (index, event) => {
  const newQuantity = parseInt(event.target.value) || 1;
  const item = props.orderItems[index];
  const maxQuantity = item.stockQuantity || 999;
  
  if (newQuantity >= 1 && newQuantity <= maxQuantity) {
    emit('update-quantity', index, newQuantity);
  }
};

const validateQuantity = (index) => {
  const item = props.orderItems[index];
  if (item.quantity < 1) {
    emit('update-quantity', index, 1);
  } else if (item.quantity > (item.stockQuantity || 999)) {
    emit('update-quantity', index, item.stockQuantity || 999);
  }
};

const removeItem = (index) => {
  emit('remove-item', index);
};

const clearOrder = () => {
  emit('clear-order');
};
</script>

<style scoped>
.pos-order-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.order-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #00bfae 0%, #009688 100%);
  color: white;
}

.order-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-order-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.clear-order-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.order-content {
  flex: 1;
  overflow-y: auto;
}

/* Empty state */
.empty-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  height: 300px;
}

.empty-icon {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: 14px;
  color: #94a3b8;
}

/* Order items */
.order-items {
  padding: 16px;
}

.order-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  background: #fff;
}

.order-item:hover {
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.item-image {
  flex-shrink: 0;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.no-image {
  width: 60px;
  height: 60px;
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #94a3b8;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-code {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
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
  margin-bottom: 4px;
}

.price-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-price {
  font-weight: 600;
  color: #059669;
}

.original-price {
  font-size: 12px;
  color: #94a3b8;
  text-decoration: line-through;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.qty-btn {
  background: #f8f9fa;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
  color: #475569;
}

.qty-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-input {
  border: none;
  width: 50px;
  height: 32px;
  text-align: center;
  font-weight: 500;
  outline: none;
  background: white;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.qty-input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.item-total {
  font-weight: 700;
  color: #059669;
  font-size: 14px;
}

.remove-btn {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
}

.remove-btn:hover {
  background: #fecaca;
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .order-item {
    padding: 12px;
    gap: 8px;
  }
  
  .product-image,
  .no-image {
    width: 48px;
    height: 48px;
  }
  
  .item-name {
    font-size: 14px;
  }
  
  .quantity-controls {
    transform: scale(0.9);
  }
}
</style>