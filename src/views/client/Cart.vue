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
          <p class="text-muted">
            <span v-if="!getUserId()">Vui lòng <button class="btn btn-link p-0" @click="$router.push('/login')">đăng nhập</button> để mua hàng</span>
            <span v-else>Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</span>
          </p>
          <button v-if="getUserId()" class="btn btn-primary" @click="$router.push('/')">Tiếp tục mua sắm</button>
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
                :checked="item.selected"
                @change="toggleItemSelection(item.id)"
                class="custom-checkbox me-3" 
              />
              <div class="cart-img-container me-3">
                <img 
                  :src="item.bookImageUrl || 'https://via.placeholder.com/150x150?text=No+Image'" 
                  :alt="item.bookName || 'Sản phẩm'" 
                  class="cart-img me-3" 
                  width="150" 
                  height="150"
                />
                <div v-if="item.itemType === 'FLASH_SALE'" class="flash-sale-badge">
                  <i class="fa fa-bolt"></i> FLASH SALE
                </div>
              </div>
              <div class="product-info flex-grow-1 me-3">
                <div class="fw-normal mb-2">
                  {{ item.bookName || 'Tên sản phẩm không có' }}
                </div>
                <div class="fw-bold text-danger" style="font-size: 1.1rem;">
                  {{ formatPrice(item.unitPrice) }}
                </div>
                <div v-if="item.flashSalePrice && item.bookPrice > item.flashSalePrice" class="text-success small">
                  Tiết kiệm: {{ formatPrice(item.bookPrice - item.flashSalePrice) }} ({{ item.flashSaleDiscount }}%)
                </div>
                <div v-if="item.itemType === 'FLASH_SALE'" class="text-secondary small">
                  {{ item.flashSaleName }}
                  <div v-if="item.flashSaleEndTime && !item.flashSaleExpired && countdownTexts[item.id]" class="flash-sale-countdown-text mt-1">
                    <i class="fa fa-bolt"></i> Kết thúc sau: {{ countdownTexts[item.id] }}
                  </div>
                </div>
                <div v-if="item.stockWarning" class="text-danger small mt-1">
                  {{ item.stockWarning }}
                </div>
                <div v-if="item.stockLimited && item.availableStock" class="text-warning small mt-1">
                  <i class="fa fa-exclamation-triangle me-1"></i>
                  Còn {{ item.availableStock }} sản phẩm
                </div>
              </div>
              <div class="cart-qty-group d-flex align-items-center justify-content-center" style="min-width: 120px;">
                <button 
                  class="btn btn-light px-2 py-1 border"
                  @click.prevent.stop="decreaseQuantity(item)"
                  :disabled="item.quantity <= 1"
                  type="button"
                >-</button>
                <input
                  type="text"
                  class="mx-2 text-center"
                  style="width: 50px; border: 1px solid #ddd; padding: 0.25rem; appearance: textfield;"
                  :value="item.quantity"
                  @change="updateQuantity(item, $event)"
                  @keypress="numberOnly($event)"
                />
                <button 
                  class="btn btn-light px-2 py-1 border"
                  @click.prevent.stop="increaseQuantity(item)"
                  :disabled="item.quantity >= (item.maxAvailableQuantity || 99)"
                  :title="item.quantity >= (item.maxAvailableQuantity || 99) ? 'Đã đạt giới hạn mua' : ''"
                  type="button"
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
import { ref } from 'vue'
import { getCartItems, updateCartItem, removeCartItem } from '@/services/client/cart.js'
import { selectCartItem } from '@/services/client/cart.js'
import { createSessionFromCart } from '@/services/client/checkout.js'
import { getUserId } from '@/utils/utils.js'
import { showNotification } from '@/utils/notification.js'
import { showQuickConfirm, showToast } from '@/utils/swalHelper.js'
import { createFlashSaleManager, formatCountdownTime } from '@/utils/flashSaleUtils.js'

export default {
  name: 'Cart',
  data() {
    return {
      cartItems: [],
      loading: true,
      selectedItems: [],
      shippingFee: 20000,
      flashSaleManager: null,
      countdownTexts: {},
      sessionCreating: false // trạng thái tạo session
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
        let savedAmount = 0;
        if (item && item.flashSalePrice && item.bookPrice > item.flashSalePrice) {
          savedAmount = (item.bookPrice - item.flashSalePrice) * item.quantity;
        }
        return total + savedAmount;
      }, 0)
    }
  },
  async mounted() {
    await this.loadCartItems()
    this.setupFlashSaleCountdowns()
    // Tạo session checkout mới khi vào cart lần đầu
    await this.createCheckoutSession()
    
    // Debug: Kiểm tra dữ liệu flash sale
    console.log('=== FLASH SALE DEBUG ===')
    console.log('Cart items loaded:', this.cartItems)
    this.cartItems.forEach(item => {
      if (item.itemType === 'FLASH_SALE') {
        console.log(`Flash Sale Item ${item.id}:`, {
          name: item.bookName,
          endTime: item.flashSaleEndTime,
          endTimeDate: new Date(item.flashSaleEndTime),
          currentTime: Date.now(),
          currentTimeDate: new Date(),
          isExpired: item.flashSaleExpired,
          timeRemaining: item.flashSaleEndTime - Date.now()
        })
      }
    })
    console.log('Countdown texts:', this.countdownTexts)
    console.log('=====================')
  },
  beforeUnmount() {
    if (this.flashSaleManager) {
      this.flashSaleManager.stopAllCountdowns()
    }
  },
  methods: {
    async createCheckoutSession() {
      // Tạo session checkout mới mỗi khi có thay đổi sản phẩm
      const userId = getUserId()
      if (!userId || this.selectedItems.length === 0) return
      this.sessionCreating = true
      try {
        await createSessionFromCart(userId)
      } catch (err) {
        console.error('Error creating checkout session:', err)
      } finally {
        this.sessionCreating = false
      }
    },
    async loadCartItems() {
      try {
        this.loading = true
        const userId = getUserId()
        if (!userId) {
          // Chưa đăng nhập, giỏ hàng trống
          this.cartItems = []
          this.selectedItems = []
          return
        }
        const response = await getCartItems(userId)
        if (response.status === 200) {
          this.cartItems = response.data.data || []
          // Đảm bảo các sản phẩm có đầy đủ thông tin cần thiết
          this.cartItems = this.cartItems.map(item => ({
            ...item,
            maxAvailableQuantity: item.maxAvailableQuantity || 99
          }))
          // Mặc định chọn tất cả items
          this.selectedItems = this.cartItems.map(item => item.id)
          // Setup countdown cho flash sales
          this.setupFlashSaleCountdowns()
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
      // Tạo session mới khi thay đổi tick chọn
      this.createCheckoutSession()
    },
    
    async toggleItemSelection(itemId) {
      const item = this.cartItems.find(item => item.id === itemId)
      if (!item) return
      try {
        const response = await selectCartItem(itemId)
        // Backend trả về trạng thái mới, cập nhật lại item.selected
        if (response.status === 200 && response.data?.data) {
          item.selected = response.data.data.selected
        } else {
          // Nếu không trả về thì tự đảo trạng thái
          item.selected = !item.selected
        }
      } catch (err) {
        console.error('Error updating selected state:', err)
        showToast('error', 'Không thể cập nhật trạng thái chọn sản phẩm')
      }
      // Tạo session mới khi thay đổi tick chọn
      this.createCheckoutSession()
    },
    
    increaseQuantity(item) {
      console.log('Tăng số lượng cho item:', item.id, 'số lượng hiện tại:', item.quantity)
      
      // Tăng số lượng trước để UI phản hồi ngay lập tức
      const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id)
      if (index > -1) {
        const newQuantity = this.cartItems[index].quantity + 1
        const oldQuantity = this.cartItems[index].quantity
        const oldTotalPrice = this.cartItems[index].totalPrice
        this.cartItems[index].quantity = newQuantity
        const unitPrice = this.cartItems[index].unitPrice
        this.cartItems[index].totalPrice = unitPrice * newQuantity
        updateCartItem(item.id, newQuantity)
          .then(response => {
            if (response.status === 200) {
              const updatedItem = response.data.data
              this.cartItems[index].quantity = updatedItem.quantity
              this.cartItems[index].totalPrice = updatedItem.totalPrice
              this.cartItems[index].unitPrice = updatedItem.unitPrice
              if (updatedItem.flashSalePrice) {
                this.cartItems[index].flashSalePrice = updatedItem.flashSalePrice
              }
              showToast('success', 'Đã cập nhật số lượng', 'center', true, 300)
              // Tạo session mới khi thay đổi số lượng
              this.createCheckoutSession()
            }
          })
          .catch(error => {
            this.cartItems[index].quantity = oldQuantity
            this.cartItems[index].totalPrice = oldTotalPrice
            showToast('error', 'Không thể cập nhật số lượng')
          })
      }
    },
    
    decreaseQuantity(item) {
      console.log('Giảm số lượng cho item:', item.id, 'số lượng hiện tại:', item.quantity)
      if (item.quantity <= 1) return
      
      // Giảm số lượng trước để UI phản hồi ngay lập tức
      const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id)
      if (index > -1) {
        const newQuantity = this.cartItems[index].quantity - 1
        const oldQuantity = this.cartItems[index].quantity
        this.cartItems[index].quantity = newQuantity
        updateCartItem(item.id, newQuantity)
          .then(response => {
            if (response.status === 200) {
              const updatedItem = response.data.data
              this.cartItems[index].quantity = updatedItem.quantity
              this.cartItems[index].totalPrice = updatedItem.totalPrice
              this.cartItems[index].unitPrice = updatedItem.unitPrice
              if (updatedItem.flashSalePrice) {
                this.cartItems[index].flashSalePrice = updatedItem.flashSalePrice
              }
              showToast('success', 'Đã cập nhật số lượng', 'center', true, 300)
              // Tạo session mới khi thay đổi số lượng
              this.createCheckoutSession()
            }
          })
          .catch(error => {
            this.cartItems[index].quantity = oldQuantity
            showToast('error', 'Không thể cập nhật số lượng')
          })
      }
    },
    
    async updateQuantity(item, event) {
      const newQuantity = parseInt(event.target.value)
      
      // Kiểm tra giá trị hợp lệ
      if (isNaN(newQuantity) || newQuantity < 1) {
        event.target.value = item.quantity
        return
      }
      
      // Kiểm tra giới hạn tối đa (nếu có)
      const maxQuantity = item.maxAvailableQuantity || 99
      if (newQuantity > maxQuantity) {
        event.target.value = maxQuantity
        showToast('warning', `Số lượng tối đa có thể mua là ${maxQuantity}`)
        return
      }
      try {
        const response = await updateCartItem(item.id, newQuantity)
        if (response.status === 200) {
          const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id)
          if (index > -1) {
            const updatedItem = response.data.data
            this.cartItems[index].quantity = updatedItem.quantity
            this.cartItems[index].totalPrice = updatedItem.totalPrice
            this.cartItems[index].unitPrice = updatedItem.unitPrice
            if (updatedItem.flashSalePrice) {
              this.cartItems[index].flashSalePrice = updatedItem.flashSalePrice
            }
            showToast('success', 'Đã cập nhật số lượng', 'center', true, 300)
            // Tạo session mới khi thay đổi số lượng
            this.createCheckoutSession()
          }
        }
      } catch (error) {
        console.error('Error updating quantity:', error)
        showToast('error', 'Không thể cập nhật số lượng')
        event.target.value = item.quantity
      }
    },
    
    async removeItem(itemId) {
      // Tìm thông tin sản phẩm để hiển thị
      const item = this.cartItems.find(item => item.id === itemId)
      const productName = item?.bookName || 'sản phẩm này'
      
      // Hiển thị SweetAlert2 để xác nhận xóa với tên sách thực
      const result = await showQuickConfirm(
        'Xóa sách khỏi giỏ hàng?', 
        `Bạn có chắc muốn xóa sách "${productName}" khỏi giỏ hàng không?`,
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
          // Tạo session mới khi xóa sản phẩm
          this.createCheckoutSession()
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
    
    setupFlashSaleCountdowns() {
      // Dọn dẹp manager cũ nếu có
      if (this.flashSaleManager) {
        this.flashSaleManager.stopAllCountdowns()
      }
      
      console.log('Setting up flash sale countdowns for items:', this.cartItems)
      
      // Lọc các items có flash sale hợp lệ
      const flashSaleItems = this.cartItems.filter(item => 
        item.itemType === 'FLASH_SALE' && 
        item.flashSaleEndTime && 
        !item.flashSaleExpired &&
        item.flashSaleEndTime > Date.now()
      )
      
      console.log('Flash sale items to setup countdown:', flashSaleItems)
      
      if (flashSaleItems.length === 0) {
        console.log('No valid flash sale items found')
        return
      }
      
      // Tạo manager mới
      this.flashSaleManager = createFlashSaleManager(
        flashSaleItems,
        // Callback khi flash sale hết hạn
        (expiredItem) => {
          console.log('Flash sale expired for item:', expiredItem.id)
          // Đánh dấu item đã hết hạn
          const index = this.cartItems.findIndex(item => item.id === expiredItem.id)
          if (index > -1) {
            this.cartItems[index].flashSaleExpired = true
          }
          // Xóa countdown text
          delete this.countdownTexts[expiredItem.id]
          // Gọi lại API để cập nhật giá
          this.reloadCartAfterFlashSaleExpired(expiredItem)
        },
        // Callback cập nhật countdown text (sử dụng format compact)
        (itemId, countdownText) => {
          console.log('Updating countdown for item:', itemId, 'text:', countdownText)
          // Vue 3: Trigger reactivity bằng cách tạo object mới
          this.countdownTexts = {
            ...this.countdownTexts,
            [itemId]: countdownText
          }
          console.log('Current countdownTexts:', this.countdownTexts)
        },
        'compact' // Sử dụng format compact cho gọn gàng hơn
      )
      
      console.log('Flash sale manager created:', this.flashSaleManager)
    },
    
    async reloadCartAfterFlashSaleExpired(expiredItem) {
      try {
        console.log('Reloading cart after flash sale expired for item:', expiredItem.bookName)
        showToast('info', `Flash sale cho "${expiredItem.bookName}" đã kết thúc. Đang cập nhật giá...`)
        
        // Reload cart items để cập nhật giá mới
        const response = await getCartItems(1)
        
        if (response.status === 200) {
          const oldCartItems = [...this.cartItems]
          this.cartItems = response.data.data || []
          
          // Giữ nguyên selected items
          this.selectedItems = this.selectedItems.filter(itemId => 
            this.cartItems.some(item => item.id === itemId)
          )
          
          // Tìm item đã cập nhật để so sánh giá
          const updatedItem = this.cartItems.find(item => 
            item.bookId === expiredItem.bookId && item.id === expiredItem.id
          )
          
          if (updatedItem && updatedItem.unitPrice !== expiredItem.unitPrice) {
            showToast('warning', `Giá sản phẩm "${expiredItem.bookName}" đã được cập nhật từ ${this.formatPrice(expiredItem.unitPrice)} thành ${this.formatPrice(updatedItem.unitPrice)}`)
          }
          
          // Setup lại countdown cho các flash sale còn lại
          this.setupFlashSaleCountdowns()
        }
      } catch (error) {
        console.error('Error reloading cart after flash sale expired:', error)
        showToast('error', 'Không thể cập nhật giá sau khi flash sale kết thúc')
      }
    },
    
    async goToCheckout() {
      if (this.selectedItems.length === 0) {
        showToast('warning', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán')
        return
      }
      const userId = getUserId()
      if (!userId) {
        showToast('error', 'Vui lòng đăng nhập để tiếp tục thanh toán')
        this.$router.push('/login')
        return
      }
      // Chỉ cần chuyển hướng sang trang checkout, bên đó sẽ tự lấy session mới nhất
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
  box-shadow: 0 2px 6px rgba(255, 71, 87, 0.4);
}

.flash-sale-badge i {
  font-size: 0.6rem;
  animation: flash 1.5s infinite;
}

.flash-sale-countdown-text {
  color: #ffd700 !important; /* Màu vàng đậm */
  background: rgba(255, 215, 0, 0.1); /* Background vàng nhạt */
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #ffd700;
  font-weight: 600;
  white-space: nowrap;
  font-size: 0.8rem;
  display: inline-block;
}

.flash-sale-countdown-text i {
  color: #ffb300 !important;
  animation: pulse 1s infinite;
  margin-right: 2px;
}

@keyframes flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.box {
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.product-info {
  max-width: calc(100% - 400px);
}

.cart-qty-group {
  flex-shrink: 0;
}

.cart-price {
  flex-shrink: 0;
  white-space: nowrap;
}

.cart-item {
  align-items: stretch;
  min-height: 160px;
}

.promotion-box {
  border: 1px solid #e0e0e0;
}

/* Ẩn nút lên xuống của input số lượng */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
