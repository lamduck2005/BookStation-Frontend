<template>
  <div class="container cart-container">
    <div class="row">
      <div class="col-8">
        <div class="cart-header d-flex align-items-end mb-3">
          <h2 class="cart-title mb-0">GIỎ HÀNG</h2>
          <span class="cart-count ms-2">({{ cartItems.length }} sản phẩm)</span>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="mt-2">Đang tải giỏ hàng...</div>
        </div>
        
        <!-- Empty cart -->
        <div v-else-if="cartItems.length === 0" class="text-center py-5">
          <i class="fa fa-shopping-cart text-muted" style="font-size: 4rem;"></i>
          <h4 class="mt-3 text-muted">Giỏ hàng trống</h4>
          <p class="text-muted">Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <button class="btn btn-primary" @click="$router.push('/')">
            Tiếp tục mua sắm
          </button>
        </div>
        
        <!-- Cart items -->
        <div v-else>
          <div class="cart-select-all-row d-flex align-items-center px-3 py-2 mb-3 rounded">
            <input 
              type="checkbox" 
              id="selectAll" 
              class="custom-checkbox me-3" 
              :checked="allSelected"
              @change="toggleSelectAll"
            />
            <label for="selectAll" class="mb-0 flex-grow-1 fw-medium">
              Chọn tất cả <span class="text-secondary">({{ cartItems.length }} sản phẩm)</span>
            </label>
            <div class="text-center fw-bold text-secondary" style="min-width: 120px;">Số lượng</div>
            <div class="text-center fw-bold text-secondary" style="min-width: 120px;">Thành tiền</div>
            <div style="min-width: 50px;"></div> <!-- Space for delete button -->
          </div>
          
          <div class="box bg-white rounded p-3">
            <div 
              v-for="item in cartItems" 
              :key="item.id"
              class="cart-item d-flex align-items-center py-3 border-bottom"
            >
              <input 
                type="checkbox" 
                :checked="selectedItems.includes(item.id)"
                @change="toggleItemSelection(item.id)"
                class="custom-checkbox me-3" 
              />
              <div class="cart-img-container me-3">
                <img 
                  :src="item.book?.imageUrl || 'https://via.placeholder.com/150x150?text=No+Image'" 
                  :alt="item.book?.title || 'Sản phẩm'" 
                  class="cart-img me-3" 
                  width="150" 
                  height="150"
                />
                <div v-if="item.isFlashSale" class="flash-sale-badge">
                  <i class="fa fa-bolt"></i> FLASH SALE
                </div>
              </div>
              <div class="product-info flex-grow-1 me-3">
                <div class="fw-normal mb-2">
                  {{ item.book?.title || 'Tên sản phẩm không có' }}
                </div>
                <div class="fw-bold text-danger" style="font-size: 1.1rem;">
                  {{ formatPrice(item.unitPrice) }}
                </div>
                <div v-if="item.savedAmount > 0" class="text-success small">
                  Tiết kiệm: {{ formatPrice(item.savedAmount) }}
                </div>
              </div>
              <div class="cart-qty-group d-flex align-items-center justify-content-center" style="min-width: 120px;">
                <button 
                  class="btn btn-light px-2 py-1 border"
                  @click="decreaseQuantity(item)"
                  :disabled="item.quantity <= 1"
                >-</button>
                <span class="mx-2">{{ item.quantity }}</span>
                <button 
                  class="btn btn-light px-2 py-1 border"
                  @click="increaseQuantity(item)"
                >+</button>
              </div>
              <div class="cart-price text-danger fw-bold text-end" style="min-width: 120px;">
                {{ formatPrice(item.totalPrice) }}
              </div>
              <button 
                class="btn btn-link text-secondary fs-4 ms-2"
                @click="removeItem(item.id)"
              >
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-4">
        <!-- Khuyến mãi section -->
        <div class="promotion-box bg-white rounded p-3 mb-3 shadow-sm">
          <div class="d-flex align-items-center mb-2">
            <i class="fa fa-gift text-primary me-2"></i>
            <span class="fw-bold text-primary">KHUYẾN MÃI</span>
            <span class="ms-auto text-primary">Xem thêm ></span>
          </div>
          <div class="promotion-item p-2 mb-2 rounded" style="background: #f0f8ff; border-left: 3px solid #007bff;">
            <div class="fw-bold" style="font-size: 0.9rem;">Mã Giảm 10K - Toàn Sàn</div>
            <div class="text-muted" style="font-size: 0.8rem;">Đơn hàng từ 130k - Không bao gồm giá trị của các sản phẩm sau Manga, Ngoại...</div>
            <div class="text-muted" style="font-size: 0.8rem;">HSD: 31/07/2025</div>
            <div class="progress mt-1" style="height: 4px;">
              <div class="progress-bar bg-primary" style="width: 60%"></div>
            </div>
            <div class="text-muted" style="font-size: 0.8rem;">Mua thêm {{ formatPrice(Math.max(0, 130000 - totalAmount)) }}</div>
          </div>
          <button class="btn btn-primary btn-sm w-100">Mua thêm</button>
          
          <div class="mt-2 text-primary" style="font-size: 0.9rem;">
            <i class="fa fa-info-circle me-1"></i>
            3 khuyến mãi đủ điều kiện
          </div>
          <div class="text-muted" style="font-size: 0.8rem;">
            Có thể áp dụng đồng thời nhiều...
          </div>
          
          <!-- Nhận quà section -->
          <div class="mt-3 p-2 rounded" style="background: #fff8f0; border: 1px solid #ffc107;">
            <div class="d-flex align-items-center">
              <i class="fa fa-gift text-warning me-2"></i>
              <span class="fw-bold text-warning">Nhận quà (0/1)</span>
              <span class="ms-auto">
                <span class="badge bg-danger rounded-circle">1</span>
                <span class="text-warning ms-1">Chọn quà ></span>
              </span>
            </div>
          </div>
        </div>

        <!-- Cart summary -->
        <div class="cart-summary bg-white rounded p-3 shadow-sm">
          <div class="d-flex justify-content-between mb-2">
            <span>Thành tiền</span>
            <span>{{ formatPrice(totalAmount) }}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Phí vận chuyển (Giao hàng tiêu chuẩn)</span>
            <span>{{ formatPrice(shippingFee) }}</span>
          </div>
          <div v-if="totalSavedAmount > 0" class="d-flex justify-content-between mb-2">
            <span class="text-success">Tiết kiệm</span>
            <span class="text-success">-{{ formatPrice(totalSavedAmount) }}</span>
          </div>
          <hr class="my-2" />
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fw-bold" style="font-size: 1.1rem;">Tổng Số Tiền (gồm VAT)</span>
            <span class="text-danger fw-bold" style="font-size: 1.4rem;">{{ formatPrice(totalAmount + shippingFee) }}</span>
          </div>
          <button 
            class="btn btn-danger w-100 fw-bold py-2 mb-2" 
            style="font-size: 1.1rem; border-radius: 8px;" 
            @click="goToCheckout"
            :disabled="selectedItems.length === 0"
          >
            THANH TOÁN ({{ selectedItems.length }})
          </button>
          <div class="text-center" style="font-size: 0.85rem; color: #d32f2f;">
            (Giảm giá trên web chỉ áp dụng cho bán lẻ)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCartItems, updateCartItem, removeCartItem } from '@/services/client/cart.js'
import { showNotification } from '@/utils/notification.js'
import { showQuickConfirm, showToast } from '@/utils/swalHelper.js'

export default {
  name: 'Cart',
  data() {
    return {
      cartItems: [],
      loading: true,
      selectedItems: [],
      shippingFee: 20000
    }
  },
  computed: {
    allSelected() {
      return this.cartItems.length > 0 && this.selectedItems.length === this.cartItems.length
    },
    totalAmount() {
      return this.selectedItems.reduce((total, itemId) => {
        const item = this.cartItems.find(item => item.id === itemId)
        return total + (item ? item.totalPrice : 0)
      }, 0)
    },
    totalSavedAmount() {
      return this.selectedItems.reduce((total, itemId) => {
        const item = this.cartItems.find(item => item.id === itemId)
        return total + (item ? (item.savedAmount || 0) : 0)
      }, 0)
    }
  },
  async mounted() {
    await this.loadCartItems()
  },
  methods: {
    async loadCartItems() {
      try {
        this.loading = true
        // Tạm thời sử dụng userId = 1, sau này sẽ lấy từ auth
        const response = await getCartItems(1)
        
        if (response.status === 200) {
          this.cartItems = response.data.data || []
          // Mặc định chọn tất cả items
          this.selectedItems = this.cartItems.map(item => item.id)
        }
      } catch (error) {
        console.error('Error loading cart items:', error)
        showToast('error', 'Không thể tải giỏ hàng')
      } finally {
        this.loading = false
      }
    },
    
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedItems = []
      } else {
        this.selectedItems = this.cartItems.map(item => item.id)
      }
    },
    
    toggleItemSelection(itemId) {
      const index = this.selectedItems.indexOf(itemId)
      if (index > -1) {
        this.selectedItems.splice(index, 1)
      } else {
        this.selectedItems.push(itemId)
      }
    },
    
    async increaseQuantity(item) {
      try {
        const newQuantity = item.quantity + 1
        const response = await updateCartItem(item.id, newQuantity)
        
        if (response.status === 200) {
          // Cập nhật local state
          const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id)
          if (index > -1) {
            this.cartItems[index].quantity = newQuantity
            this.cartItems[index].totalPrice = response.data.data.totalPrice
          }
        }
      } catch (error) {
        console.error('Error updating quantity:', error)
        showToast('error', 'Không thể cập nhật số lượng')
      }
    },
    
    async decreaseQuantity(item) {
      if (item.quantity <= 1) return
      
      try {
        const newQuantity = item.quantity - 1
        const response = await updateCartItem(item.id, newQuantity)
        
        if (response.status === 200) {
          // Cập nhật local state
          const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id)
          if (index > -1) {
            this.cartItems[index].quantity = newQuantity
            this.cartItems[index].totalPrice = response.data.data.totalPrice
          }
        }
      } catch (error) {
        console.error('Error updating quantity:', error)
        showToast('error', 'Không thể cập nhật số lượng')
      }
    },
    
    async removeItem(itemId) {
      // Tìm thông tin sản phẩm để hiển thị
      const item = this.cartItems.find(item => item.id === itemId)
      const productName = item?.book?.title || 'sản phẩm này'
      
      // Hiển thị SweetAlert2 để xác nhận xóa
      const result = await showQuickConfirm(
        'Xóa sản phẩm?', 
        `Bạn có chắc muốn xóa "${productName}" khỏi giỏ hàng không?`,
        'warning',
        'Xóa sản phẩm',
        'Hủy',
        'btn-danger',
        'btn-secondary'
      )
      
      // Nếu không đồng ý xóa
      if (!result.isConfirmed) {
        return
      }
      
      try {
        const response = await removeCartItem(itemId)
        
        if (response.status === 200) {
          // Xóa khỏi local state
          const index = this.cartItems.findIndex(item => item.id === itemId)
          if (index > -1) {
            this.cartItems.splice(index, 1)
          }
          
          // Xóa khỏi selected items
          const selectedIndex = this.selectedItems.indexOf(itemId)
          if (selectedIndex > -1) {
            this.selectedItems.splice(selectedIndex, 1)
          }
          
          // Hiển thị thông báo xóa thành công ở giữa màn hình
          showToast('success', 'Đã xóa sản phẩm khỏi giỏ hàng')
        }
      } catch (error) {
        console.error('Error removing item:', error)
        showToast('error', 'Không thể xóa sản phẩm')
      }
    },
    
    formatPrice(price) {
      if (!price) return '0 đ'
      return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
    },
    
    goToCheckout() {
      if (this.selectedItems.length === 0) {
        showToast('warning', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán')
        return
      }
      
      // Lưu selected items vào localStorage để sử dụng ở checkout
      localStorage.setItem('checkoutItems', JSON.stringify(this.selectedItems))
      
      // Chuyển hướng sang trang thanh toán
      this.$router.push('/checkout')
    }
  }
}
</script>

<style scoped>
.cart-container {
  max-width: 1400px;
  margin: 24px auto;  
  background: #f5f5f5;
  border-radius: 8px;
  padding: 24px 32px;
  box-shadow: none;
}

.cart-header {
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
}

.cart-title {
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: #222;
}

.cart-count {
  font-size: 1rem;
  color: #444;
  font-weight: 400;
}

.cart-select-all-row {
  background: #fafafa;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 44px;
}

.custom-checkbox {
  width: 24px;
  height: 24px;
  accent-color: #d32f2f;
  border-radius: 4px;
  margin-top: 0;
  margin-bottom: 0;
}

.cart-summary {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  font-size: 0.95rem;
}

.cart-summary .btn {
  border-radius: 6px;
}

.cart-img-container{
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  position: relative;
}

.cart-img {
  width: 140px !important;
  height: 140px !important;
  object-fit: cover;
  border-radius: 4px;
}

.flash-sale-badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 2px;
}

.flash-sale-badge i {
  font-size: 0.6rem;
}

.product-info {
  max-width: calc(100% - 400px); /* Để đảm bảo không chiếm hết không gian */
}

.cart-qty-group {
  flex-shrink: 0;
}

.cart-price {
  flex-shrink: 0;
  white-space: nowrap; /* Không cho phép xuống dòng */
}

.cart-item {
  align-items: stretch;
  min-height: 160px;
}

.promotion-box {
  border: 1px solid #e0e0e0;
}

.box {
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
</style>
