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
          <i class="fa fa-shopping-cart text-muted" style="font-size: 4rem"></i>
          <h4 class="mt-3 text-muted">Giỏ hàng trống</h4>
          <p class="text-muted">
            <span v-if="!getUserId()">Vui lòng <button class="btn btn-link p-0" @click="router.push('/login')">đăng nhập</button> để mua hàng</span>
            <span v-else>Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</span>
          </p>
          <button v-if="getUserId()" class="btn btn-primary" @click="router.push('/')">Tiếp tục mua sắm</button>
        </div>

        <!-- Cart items -->
        <div v-else>
          <div
            class="cart-select-all-row d-flex align-items-center px-3 py-2 mb-3 rounded"
          >
            <input
              type="checkbox"
              id="selectAll"
              class="custom-checkbox me-3"
              :checked="allSelected"
              @change="toggleSelectAll"
            />
            <label for="selectAll" class="mb-0 flex-grow-1 fw-medium">
              Chọn tất cả
              <span class="text-secondary"
                >({{ cartItems.length }} sản phẩm)</span
              >
            </label>
            <div
              class="text-center fw-bold text-secondary"
              style="min-width: 120px"
            >
              Số lượng
            </div>
            <div
              class="text-center fw-bold text-secondary"
              style="min-width: 120px"
            >
              Thành tiền
            </div>
            <div style="min-width: 50px"></div>
            <!-- Space for delete button -->
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
                  :src="
                    item.bookImageUrl ||
                    'https://via.placeholder.com/150x150?text=No+Image'
                  "
                  :alt="item.bookName || 'Sản phẩm'"
                  class="cart-img me-3"
                  width="150"
                  height="150"
                />
                <div
                  v-if="item.itemType === 'FLASH_SALE'"
                  class="flash-sale-badge"
                >
                  <i class="fa fa-bolt"></i> FLASH SALE
                </div>
              </div>
              <div class="product-info flex-grow-1 me-3">
                <div class="fw-normal mb-2">
                  {{ item.bookName || "Tên sản phẩm không có" }}
                </div>
                <div class="fw-bold text-danger" style="font-size: 1.1rem">
                  {{ formatPrice(item.unitPrice) }}
                </div>
                <div
                  v-if="
                    item.flashSalePrice && item.bookPrice > item.flashSalePrice
                  "
                  class="text-success small"
                >
                  Tiết kiệm:
                  {{ formatPrice(item.bookPrice - item.flashSalePrice) }} ({{
                    item.flashSaleDiscount
                  }}%)
                </div>
                <div
                  v-if="item.itemType === 'FLASH_SALE'"
                  class="text-secondary small"
                >
                  {{ item.flashSaleName }}
                  <div
                    v-if="
                      item.flashSaleEndTime &&
                      !item.flashSaleExpired &&
                      countdownTexts[item.id]
                    "
                    class="flash-sale-countdown-text mt-1"
                  >
                    <i class="fa fa-bolt"></i> Kết thúc sau:
                    {{ countdownTexts[item.id] }}
                  </div>
                </div>
                <div v-if="item.stockWarning" class="text-danger small mt-1">
                  {{ item.stockWarning }}
                </div>
                <div
                  v-if="item.stockLimited && item.availableStock"
                  class="text-warning small mt-1"
                >
                  <i class="fa fa-exclamation-triangle me-1"></i>
                  Còn {{ item.availableStock }} sản phẩm
                </div>
              </div>
              <div
                class="cart-qty-group d-flex align-items-center justify-content-center"
                style="min-width: 120px"
              >
                <button
                  class="btn btn-light px-2 py-1 border"
                  @click.prevent.stop="decreaseQuantity(item)"
                  :disabled="item.quantity <= 1"
                  type="button"
                >
                  -
                </button>
                <input
                  type="text"
                  class="mx-2 text-center"
                  style="
                    width: 50px;
                    border: 1px solid #ddd;
                    padding: 0.25rem;
                    appearance: textfield;
                  "
                  :value="item.quantity"
                  @change="updateQuantity(item, $event)"
                  @keypress="numberOnly($event)"
                />
                <button
                  class="btn btn-light px-2 py-1 border"
                  @click.prevent.stop="increaseQuantity(item)"
                  :disabled="item.quantity >= (item.maxAvailableQuantity || 99)"
                  :title="
                    item.quantity >= (item.maxAvailableQuantity || 99)
                      ? 'Đã đạt giới hạn mua'
                      : ''
                  "
                  type="button"
                >
                  +
                </button>
              </div>
              <div
                class="cart-price text-danger fw-bold text-end"
                style="min-width: 120px"
              >
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
        

        <!-- Cart summary -->
        <div class="cart-summary bg-white rounded p-3 mt-4 shadow-sm">
          <div class="mb-3">
            <h5 class="fw-bold text-primary" style="font-size: 1.2rem;">
              Thông tin đơn hàng
            </h5>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Thành tiền</span>
            <span>{{ formatPrice(totalAmount) }}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Phí vận chuyển (Giao hàng tiêu chuẩn)</span>
            <span>{{ formatPrice(shippingFee) }}</span>
          </div>
          <div
            v-if="totalSavedAmount > 0"
            class="d-flex justify-content-between mb-2"
          >
            <span class="text-success">Tiết kiệm</span>
            <span class="text-success"
              >-{{ formatPrice(totalSavedAmount) }}</span
            >
          </div>
          <hr class="my-2" />
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fw-bold" style="font-size: 1.1rem"
              >Tổng Số Tiền (gồm VAT)</span
            >
            <span class="text-danger fw-bold" style="font-size: 1.4rem">{{
              formatPrice(totalAmount + shippingFee)
            }}</span>
          </div>
          <button
            class="btn btn-danger w-100 fw-bold py-2 mb-2"
            style="font-size: 1.1rem; border-radius: 8px"
            @click="goToCheckout"
            :disabled="selectedItems.length === 0 || sessionCreating"
          >
            <span v-if="sessionCreating">
              <i class="fa fa-spinner fa-spin me-2"></i>
              Đang xử lý...
            </span>
            <span v-else>
              THANH TOÁN ({{ selectedItems.length }})
            </span>
          </button>
          <div class="text-center" style="font-size: 0.85rem; color: #d32f2f">
            (Giảm giá trên web chỉ áp dụng cho bán lẻ)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCartItems, updateCartItem, removeCartItem, selectCartItem, validateCart } from '@/services/client/cart.js'
import { getAddresses } from '@/services/client/address.js'
import { calcShippingFee, DEFAULT_SHIPPING_FEE } from '@/services/client/shippingFee.js'
import { createSessionFromCart } from '@/services/client/checkout.js'
import { getUserId } from '@/utils/utils.js'
import { showNotification } from '@/utils/notification.js'
import { showQuickConfirm, showToast } from '@/utils/swalHelper.js'
import { createFlashSaleManager, formatCountdownTime } from '@/utils/flashSaleUtils.js'

const router = useRouter()

// Reactive state
const cartItems = ref([])
const loading = ref(true)
const selectedItems = ref([])
const shippingFee = ref(0)

// Address states to tính phí ship
const addresses = ref([])
const selectedAddress = ref(null)
const addressLoading = ref(false)

const flashSaleManager = ref(null)
const countdownTexts = ref({})
const sessionCreating = ref(false)

// Computed properties
const allSelected = computed(() => {
  return cartItems.value.length > 0 && selectedItems.value.length === cartItems.value.length
})

const totalAmount = computed(() => {
  return selectedItems.value.reduce((total, itemId) => {
    const item = cartItems.value.find(i => i.id === itemId)
    return total + (item ? item.totalPrice : 0)
  }, 0)
})

const totalSavedAmount = computed(() => {
  return selectedItems.value.reduce((total, itemId) => {
    const item = cartItems.value.find(i => i.id === itemId)
    let savedAmount = 0;
    if (item && item.flashSalePrice && item.bookPrice > item.flashSalePrice) {
      savedAmount = (item.bookPrice - item.flashSalePrice) * item.quantity;
    }
    return total + savedAmount;
  }, 0)
})

// Helper: danh sách item (quantity) đang được tính ship
const shipItems = computed(() => {
  return cartItems.value
    .filter(item => selectedItems.value.includes(item.id))
    .map(item => ({ quantity: item.quantity }))
})

const updateShippingFee = async () => {
  shippingFee.value = await calcShippingFee(selectedAddress.value || {}, shipItems.value)
}

// Methods
const loadCartItems = async () => {
  try {
    loading.value = true
    const userId = getUserId()
    if (!userId) {
      showToast('warning', 'Vui lòng đăng nhập để xem giỏ hàng')
      router.push('/login')
      return
    }
    
    const response = await getCartItems(userId)
    if (response.status === 200 && response.data?.data) {
      cartItems.value = response.data.data
      
      // Tự động chọn các items đã được selected từ backend
      selectedItems.value = cartItems.value
        .filter(item => item.selected)
        .map(item => item.id)
      
      console.log('✅ Cart items loaded:', cartItems.value)
      console.log('✅ Selected items:', selectedItems.value)
      
      // Setup flash sale countdowns
      setupFlashSaleCountdowns()
    } else {
      cartItems.value = []
      selectedItems.value = []
    }
  } catch (error) {
    console.error('❌ Error loading cart items:', error)
    showToast('error', 'Không thể tải giỏ hàng')
  } finally {
    loading.value = false
    await updateShippingFee()
  }
}

const toggleSelectAll = async () => {
  try {
    const userId = getUserId()
    if (!userId) return
    
    const newSelectedState = !allSelected.value
    
    // Update từng item một cách tuần tự
    for (const item of cartItems.value) {
      await selectCartItem(item.id, newSelectedState)
    }
    
    // Cập nhật UI
    if (newSelectedState) {
      selectedItems.value = cartItems.value.map(item => item.id)
    } else {
      selectedItems.value = []
    }
    
    // Cập nhật selected state trong cartItems
    cartItems.value.forEach(item => {
      item.selected = newSelectedState
    })
    
  } catch (error) {
    console.error('❌ Error toggling select all:', error)
    showToast('error', 'Không thể cập nhật lựa chọn')
  }
}

const toggleItemSelection = async (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (!item) return
  
  try {
    const isSelected = selectedItems.value.includes(itemId)
    const newSelectedState = !isSelected
    
    await selectCartItem(itemId, newSelectedState)
    
    // Cập nhật UI
    if (newSelectedState) {
      selectedItems.value.push(itemId)
    } else {
      selectedItems.value = selectedItems.value.filter(id => id !== itemId)
    }
    
    // Cập nhật selected state trong item
    item.selected = newSelectedState
    
  } catch (err) {
    console.error('❌ Error toggling item selection:', err)
    showToast('error', 'Không thể cập nhật lựa chọn sản phẩm')
  }
}

const increaseQuantity = (item) => {
  console.log('Tăng số lượng cho item:', item.id, 'số lượng hiện tại:', item.quantity)
  
  const index = cartItems.value.findIndex(cartItem => cartItem.id === item.id)
  if (index > -1) {
    cartItems.value[index].quantity++
    cartItems.value[index].totalPrice = cartItems.value[index].quantity * cartItems.value[index].unitPrice
    updateQuantityDebounced(item, cartItems.value[index].quantity)
  }
}

const decreaseQuantity = (item) => {
  console.log('Giảm số lượng cho item:', item.id, 'số lượng hiện tại:', item.quantity)
  if (item.quantity <= 1) return
  
  const index = cartItems.value.findIndex(cartItem => cartItem.id === item.id)
  if (index > -1) {
    cartItems.value[index].quantity--
    cartItems.value[index].totalPrice = cartItems.value[index].quantity * cartItems.value[index].unitPrice
    updateQuantityDebounced(item, cartItems.value[index].quantity)
  }
}

const updateQuantity = async (item, event) => {
  const newQuantity = parseInt(event.target.value)
  
  if (isNaN(newQuantity) || newQuantity < 1) {
    event.target.value = item.quantity
    return
  }
  
  const maxQuantity = item.maxAvailableQuantity || 99
  if (newQuantity > maxQuantity) {
    showToast('warning', `Số lượng không được vượt quá ${maxQuantity}`)
    event.target.value = item.quantity
    return
  }
  
  try {
    await updateCartItem(item.id, newQuantity)
    const index = cartItems.value.findIndex(cartItem => cartItem.id === item.id)
    if (index > -1) {
      cartItems.value[index].quantity = newQuantity
      cartItems.value[index].totalPrice = newQuantity * cartItems.value[index].unitPrice
    }
  } catch (error) {
    console.error('❌ Error updating quantity:', error)
    event.target.value = item.quantity
    showToast('error', 'Không thể cập nhật số lượng')
  }
}

// Debounced function for quantity updates
let debounceTimer = null
const updateQuantityDebounced = (item, newQuantity) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    try {
      await updateCartItem(item.id, newQuantity)
    } catch (error) {
      console.error('❌ Error updating quantity:', error)
      await loadCartItems() // Reload on error
    }
  }, 500)
}

const removeItem = async (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  const productName = item?.bookName || 'sản phẩm này'
  
  const result = await showQuickConfirm(
    `Bạn có chắc muốn xóa "${productName}" khỏi giỏ hàng?`,
    'Xóa sản phẩm',
    'Xóa',
    'Hủy',
    'question'
  )
  
  if (!result.isConfirmed) {
    return
  }
  
  try {
    await removeCartItem(itemId)
    cartItems.value = cartItems.value.filter(item => item.id !== itemId)
    selectedItems.value = selectedItems.value.filter(id => id !== itemId)
    showToast('success', 'Đã xóa sản phẩm khỏi giỏ hàng')
  } catch (error) {
    console.error('❌ Error removing item:', error)
    showToast('error', 'Không thể xóa sản phẩm')
  }
}

const formatPrice = (price) => {
  if (!price) return '0 đ'
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
}

const numberOnly = (event) => {
  const keyCode = event.keyCode || event.which
  if (keyCode < 48 || keyCode > 57) {
    event.preventDefault()
  }
}

const setupFlashSaleCountdowns = () => {
  if (flashSaleManager.value) {
    flashSaleManager.value.stopAllCountdowns()
  }
  
  console.log('Setting up flash sale countdowns for items:', cartItems.value)
  
  const flashSaleItems = cartItems.value.filter(item => 
    item.itemType === 'FLASH_SALE' && 
    item.flashSaleEndTime && 
    !item.flashSaleExpired
  )
  
  console.log('Flash sale items to setup countdown:', flashSaleItems)
  
  if (flashSaleItems.length === 0) {
    console.log('No flash sale items found')
    return
  }
  
  flashSaleManager.value = createFlashSaleManager(
    flashSaleItems.map(item => ({
      id: item.id,
      endTime: item.flashSaleEndTime
    })),
    (itemId, timeLeft) => {
      countdownTexts.value[itemId] = formatCountdownTime(timeLeft)
    },
    (itemId) => {
      console.log(`⏰ Flash sale expired for item ${itemId}`)
      reloadCartAfterFlashSaleExpired(itemId)
    }
  )
  
  console.log('Flash sale manager created:', flashSaleManager.value)
}

const reloadCartAfterFlashSaleExpired = async (expiredItemId) => {
  try {
    console.log(`🔄 Reloading cart after flash sale expired for item ${expiredItemId}`)
    await loadCartItems()
    setupFlashSaleCountdowns()
    showToast('info', 'Flash sale đã kết thúc, giá sản phẩm đã được cập nhật')
  } catch (error) {
    console.error('❌ Error reloading cart after flash sale expired:', error)
  }
}

// Main checkout function - theo document cần validate cart trước
const goToCheckout = async () => {
  const userId = getUserId()
  if (!userId) {
    showToast('warning', 'Vui lòng đăng nhập để thanh toán')
    router.push('/login')
    return
  }
  
  if (selectedItems.value.length === 0) {
    showToast('warning', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán')
    return
  }
  
  try {
    sessionCreating.value = true
    console.log('🛒 Starting checkout process for selected items:', selectedItems.value)
    
    // Bước 1: Validate cart trước khi checkout
    console.log('🔍 Validating cart...')
    const validateResponse = await validateCart(userId)
    
    if (validateResponse.status !== 200) {
      throw new Error('Giỏ hàng có sản phẩm không hợp lệ')
    }
    
    // Bước 2: Tạo checkout session từ cart  
    console.log('📝 Creating checkout session from cart...')
    const response = await createSessionFromCart(userId)
    
    if ((response.status === 201 || response.status === 200) && response.data?.data) {
      console.log('✅ Checkout session created:', response.data.data)
      showToast('success', 'Đã tạo phiên thanh toán!')
      
      // Navigate to checkout page
      router.push('/checkout')
    } else {
      throw new Error(response.message || 'Không thể tạo phiên thanh toán')
    }
  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    
    let errorMessage = error.message || 'Không thể tạo phiên thanh toán. Vui lòng thử lại.'
    
    // Xử lý các lỗi đặc biệt theo document
    if (error.message?.includes('trống')) {
      errorMessage = 'Giỏ hàng trống, không thể thanh toán'
    } else if (error.message?.includes('không có sản phẩm nào được chọn')) {
      errorMessage = 'Không có sản phẩm nào được chọn để checkout'
    } else if (error.message?.includes('hết hàng')) {
      errorMessage = 'Có sản phẩm đã hết hàng, vui lòng cập nhật giỏ hàng'
      // Reload cart to update stock status
      await loadCartItems()
    }
    
    showToast('error', errorMessage)
  } finally {
    sessionCreating.value = false
  }
}

// Watchers để cập nhật phí ship khi thay đổi dữ liệu liên quan
watch([selectedAddress, shipItems], () => {
  updateShippingFee()
})

// Load addresses
const loadAddresses = async () => {
  try {
    addressLoading.value = true
    const response = await getAddresses()
    if (response.status === 200 && response.data?.data) {
      addresses.value = response.data.data
      // Chọn địa chỉ mặc định
      selectedAddress.value = addresses.value.find(a => a.isDefault) || addresses.value[0] || null
    }
  } catch (e) {
    console.error('Lỗi load địa chỉ:', e)
  } finally {
    addressLoading.value = false
    await updateShippingFee()
  }
}

// Lifecycle hooks
onMounted(async () => {
  await Promise.all([loadCartItems(), loadAddresses()])
})

onBeforeUnmount(() => {
  if (flashSaleManager.value) {
    flashSaleManager.value.stopAllCountdowns()
  }
})
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-size: 0.95rem;
}

.cart-summary .btn {
  border-radius: 6px;
}

.cart-img-container {
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
  color: #ffd700 !important; 
  background: rgba(255, 215, 0, 0.1);
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
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.box {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
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

/* Voucher Modal UI nâng cấp */
.voucher-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}
.voucher-modal {
  max-width: 700px;
  min-width: 350px;
  width: 100%;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  margin: 40px auto;
}
.voucher-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px 32px;
  min-height: 110px;
  font-size: 1.1rem;
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.voucher-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px) scale(1.01);
}
.voucher-badge {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: #ffe0b2;
  color: #a05a00;
}
.voucher-badge-shipping {
  background: #e3f2fd !important;
  color: #1976d2 !important;
}
/* Voucher trạng thái UI giống ảnh mẫu */
.voucher-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  min-height: 100px;
  font-size: 1.05rem;
  transition: box-shadow 0.2s, transform 0.2s, border 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
  position: relative;
}
.voucher-card-active {
  border-color: #ffc46b;
  background: #fffbe7;
  box-shadow: 0 4px 16px rgba(255, 196, 107, 0.1);
}
.voucher-card-inactive {
  border-color: #e0e0e0;
  background: #f7f7f7;
  filter: grayscale(0.3) brightness(0.97);
  opacity: 0.7;
}
.voucher-card-disabled {
  pointer-events: none;
  opacity: 0.6;
}
.voucher-badge {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  margin-right: 16px;
  flex-shrink: 0;
  border: 2.5px solid #ffe0b2;
  background: #ffe0b2;
  color: #a05a00;
  position: relative;
}
.voucher-badge-active {
  background: #ffe0b2;
  border-color: #ffc46b;
  color: #a05a00;
}
.voucher-badge-inactive {
  background: #e0e0e0;
  border-color: #bdbdbd;
  color: #888;
}
.voucher-badge-label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 2px;
  color: inherit;
}
</style>
