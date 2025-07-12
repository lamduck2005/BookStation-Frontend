<template>
  <div class="container-fluid py-3">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-2">Đang tải thông tin thanh toán...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger text-center">
      <h5>❌ Có lỗi xảy ra</h5>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="$router.push('/cart')">Quay lại giỏ hàng</button>
    </div>

    <!-- Main content -->
    <div v-else class="row justify-content-center">
      <div class="col-12 col-xl-9">
        <!-- Session info -->
        <!-- Đã xoá phần hiển thị Phiên thanh toán, Tổng cộng, Sản phẩm -->

        <!-- Validation errors -->
        <div v-if="validationErrors && validationErrors.length > 0" class="alert alert-warning">
          <h6>⚠️ Có vấn đề cần kiểm tra:</h6>
          <ul class="mb-0">
            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
          </ul>
          <button class="btn btn-outline-warning btn-sm mt-2" @click="validateSession">
            🔄 Kiểm tra lại
          </button>
        </div>

        <!-- Địa chỉ giao hàng -->
        <div class="card mb-3">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">Địa chỉ giao hàng</h6>
          </div>
          <div class="card-body py-3">
            <!-- Loading state cho địa chỉ -->
            <div v-if="addressLoading" class="text-center py-3">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <span class="ms-2 small">Đang tải địa chỉ...</span>
            </div>
            
            <!-- Có địa chỉ -->
            <div v-else-if="selectedAddress" class="position-relative">
              <!-- Địa chỉ đã chọn -->
              <div class="d-flex">
                <!-- Radio button -->
                <div class="form-check me-2 align-self-start mt-1">
                  <input class="form-check-input" type="radio" name="address" checked>
                </div>
                
                <!-- Thông tin địa chỉ -->
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center mb-1">
                    <strong class="me-2">{{ selectedAddress.recipientName }}</strong>
                    <span class="text-muted">{{ selectedAddress.phoneNumber }}</span>
                  </div>
                  <div class="text-muted small">
                    {{ formatFullAddress(selectedAddress) }}
                  </div>
                  <div v-if="selectedAddress.isDefault" class="mt-1">
                    <span class="badge bg-primary" style="font-size: 10px;">Mặc định</span>
                  </div>
                </div>
                
                <!-- Nút sửa/thay đổi -->
                <div class="align-self-start">
                  <button class="btn btn-link text-primary p-0 text-decoration-none small" @click="showAddressModal = true">
                    Sửa
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Không có địa chỉ -->
            <div v-else class="text-center py-3">
              <div class="text-muted mb-2">
                <i class="fas fa-map-marker-alt me-2"></i>
                Bạn chưa có địa chỉ giao hàng
              </div>
              <button class="btn btn-primary btn-sm" @click="showAddressModal = true">
                <i class="fas fa-plus me-1"></i>
                Thêm địa chỉ
              </button>
            </div>
          </div>
        </div>

        <!-- Phương thức vận chuyển -->
        <div class="card mb-3">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">Phương thức vận chuyển</h6>
          </div>
          <div class="card-body py-3">
            <div class="alert alert-info text-center">
              <i class="fas fa-info-circle me-2"></i>
              Chức năng chọn phương thức vận chuyển sẽ được triển khai trong phiên bản tiếp theo
            </div>
          </div>
        </div>

        <!-- Phương thức thanh toán -->
        <div class="card mb-3">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">Phương thức thanh toán</h6>
          </div>
          <div class="card-body py-3">
            <!-- ZaloPay -->
            <div class="d-flex align-items-center mb-2 p-2 border rounded">
              <div class="form-check me-2">
                <input class="form-check-input" type="radio" name="payment" id="zalopay" checked>
                <label class="form-check-label" for="zalopay"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <img src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/zalopay.png" alt="ZaloPay" class="me-2" style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; padding: 3px;">
                <div>
                  <div class="small">
                    <strong>Ví ZaloPay</strong> 
                    <span class="text-primary ms-1" style="font-size: 11px;">Chi tiết</span>
                  </div>
                  <div class="text-warning" style="font-size: 11px;">
                    <strong>Nhập mã: ZLPFHS - Giảm 20K cho đơn hàng từ 300K</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- VNPay -->
            <div class="d-flex align-items-center mb-2 p-2 border rounded">
              <div class="form-check me-2">
                <input class="form-check-input" type="radio" name="payment" id="vnpay">
                <label class="form-check-label" for="vnpay"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPay" class="me-2" style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; padding: 3px;">
                <div>
                  <div class="small">
                    <strong>VNPAY</strong> 
                    <span class="text-primary ms-1" style="font-size: 11px;">Chi tiết</span>
                  </div>
                  <div class="text-warning" style="font-size: 11px;">
                    <strong>Nhập mã: VNPAYFHS - Giảm 40K cho đơn hàng từ 200K</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- ShopeePay -->
            <div class="d-flex align-items-center mb-2 p-2 border rounded">
              <div class="form-check me-2">
                <input class="form-check-input" type="radio" name="payment" id="shopeepay">
                <label class="form-check-label" for="shopeepay"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <img src="https://down-vn.img.susercontent.com/file/d4bbea4570b93bfd5fc652ca82a262a8" alt="ShopeePay" class="me-2" style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; padding: 3px;">
                <div>
                  <div class="small">
                    <strong>Ví ShopeePay</strong> 
                    <span class="text-primary ms-1" style="font-size: 11px;">Chi tiết</span>
                  </div>
                  <div class="text-warning" style="font-size: 11px;">
                    <strong>Nhập mã: SPPFHS0725 - Giảm ngay 20K cho đơn hàng từ 30K trên Ví ShopeePay</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Momo -->
            <div class="d-flex align-items-center mb-2 p-2 border rounded">
              <div class="form-check me-2">
                <input class="form-check-input" type="radio" name="payment" id="momo">
                <label class="form-check-label" for="momo"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <img src="https://developers.momo.vn/v3/assets/images/square-logo.svg" alt="Momo" class="me-2" style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; padding: 3px;">
                <div>
                  <div class="small">
                    <strong>Ví Momo</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- ATM / Internet Banking -->
            <div class="d-flex align-items-center mb-2 p-2 border rounded">
              <div class="form-check me-2">
                <input class="form-check-input" type="radio" name="payment" id="atm">
                <label class="form-check-label" for="atm"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <div class="me-2 d-flex align-items-center justify-content-center" style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; background-color: #f8f9fa;">
                  <i class="fas fa-university" style="font-size: 14px; color: #6c757d;"></i>
                </div>
                <div>
                  <div class="small">
                    <strong>ATM / Internet Banking</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Visa / Master / JCB -->
            <div class="d-flex align-items-center mb-2 p-2 border rounded">
              <div class="form-check me-2">
                <input class="form-check-input" type="radio" name="payment" id="visa">
                <label class="form-check-label" for="visa"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <div class="me-2 d-flex align-items-center justify-content-center" style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; background-color: #f8f9fa;">
                  <i class="fas fa-credit-card" style="font-size: 14px; color: #6c757d;"></i>
                </div>
                <div>
                  <div class="small">
                    <strong>Visa / Master / JCB</strong> 
                    <span class="text-primary ms-1" style="font-size: 11px;">Chi tiết</span>
                  </div>
                  <div class="text-warning" style="font-size: 11px;">
                    <strong>Nhập mã: VPBFHS50K - Giảm Ngay 50K cho ĐH từ 400K khi thanh toán bằng thẻ tín dụng VPBank</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Thanh toán bằng tiền mặt khi nhận hàng -->
            <div class="d-flex align-items-center mb-2 p-2 border rounded">
              <div class="form-check me-2">
                <input class="form-check-input" type="radio" name="payment" id="cod">
                <label class="form-check-label" for="cod"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <div class="me-2 d-flex align-items-center justify-content-center" style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; background-color: #f8f9fa;">
                  <i class="fas fa-money-bill-wave" style="font-size: 14px; color: #6c757d;"></i>
                </div>
                <div>
                  <div class="small">
                    <strong>Thanh toán bằng tiền mặt khi nhận hàng</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- Thành viên BookStation -->
        <div class="card mb-3">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold text-primary">Thành viên BookStation</h6>
          </div>
          <div class="card-body py-3">
            <!-- B-Point -->
            <div class="mb-3">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="small">
                  <strong>Số B-Point hiện có:</strong> 
                  <span class="text-warning ms-1">0</span>
                </div>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="usePoints">
                <label class="form-check-label small" for="usePoints">
                  Sử dụng B-point để thanh toán
                </label>
              </div>
            </div>

            <!-- Freeship -->
            <div class="mb-3">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="small">
                  <strong>Số lần freeship:</strong> 
                  <span class="text-warning ms-1">0 lần</span>
                </div>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="useFreeship">
                <label class="form-check-label small" for="useFreeship">
                  Sử dụng freeship
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Mã khuyến mãi/Mã quà tặng -->
        <div class="card mb-3">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">Mã khuyến mãi/Mã quà tặng</h6>
          </div>
          <div class="card-body py-3">
            <div class="row">
              <div class="col-8">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  placeholder="Nhập mã khuyến mãi/Quà tặng"
                  v-model="couponCode"
                  style="font-size: 14px;"
                >
              </div>
              <div class="col-4">
                <button 
                  class="btn btn-primary btn-sm w-100" 
                  @click="applyCoupon"
                  style="font-size: 14px;"
                >
                  Áp dụng
                </button>
              </div>
            </div>
            <div class="mt-2">
              <button class="btn btn-link p-0 text-primary text-decoration-none small">
                Chọn mã khuyến mãi
              </button>
            </div>
            <div class="text-muted small mt-1">
              Có thể áp dụng đồng thời nhiều mã
            </div>
            
            <!-- Nhận quà section -->
            <div class="mt-3 p-2" style="background-color: #f8f9fa; border-radius: 6px;">
              <div class="d-flex align-items-center">
                <i class="fas fa-gift text-primary me-2"></i>
                <div class="flex-grow-1">
                  <div class="small fw-bold text-primary">Nhận quà</div>
                  <div class="text-muted" style="font-size: 12px;">
                    Đơn hàng của bạn chưa đủ điều kiện nhận quà
                  </div>
                </div>
                <button class="btn btn-outline-primary btn-sm">
                  <span style="font-size: 12px;">Chọn quà</span>
                  <i class="fas fa-chevron-right ms-1" style="font-size: 10px;"></i>
                </button>
              </div>
            </div>
          </div>
        </div>


        <!-- Kiểm tra lại đơn hàng -->
        <div class="card mb-5">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">Kiểm tra lại đơn hàng</h6>
          </div>
          <div class="card-body py-3">
            <div v-if="session && session.checkoutItems && session.checkoutItems.length > 0">

              <div v-for="item in session.checkoutItems" :key="item.bookId" class="d-flex align-items-start mb-3">
                <img 
                  :src="item.bookImage || '/src/assets/img/login/frontImg.jpg'" 
                  alt="Product" 
                  class="me-3" 
                  style="width: 80px; height: 100px; object-fit: cover; border-radius: 4px;"
                >
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="small flex-grow-1 me-3" style="line-height: 1.4;">
                      <strong>{{ item.bookTitle }}</strong>
                      <span v-if="item.isOutOfStock" class="badge bg-danger ms-2">Hết hàng</span>
                      <span v-if="item.isFlashSale" class="badge bg-warning ms-2">Flash Sale</span>
                    </div>
                    <div class="small text-muted text-nowrap me-3">
                      {{ formatPrice(item.unitPrice) }}
                    </div>
                    <div class="small text-muted text-nowrap me-3">
                      {{ item.quantity }}
                    </div>
                    <div class="small fw-bold text-nowrap">
                      {{ formatPrice(item.totalPrice) }}
                    </div>
                  </div>
                </div>
              </div>
             
            </div>
            <div v-else class="text-center text-muted">Không có sản phẩm nào trong đơn hàng.</div>
          </div>
        </div>

        <!-- Đồng ý điều khoản -->
        <!-- Đã chuyển xuống thanh dưới -->
      </div>
    </div>
    

    <!-- Thanh tổng tiền cố định ở dưới -->
    <div class="fixed-bottom bg-white border-top shadow-lg">
      <div class="container-fluid py-3">
        <!-- Phần tổng tiền ở trên -->
        <div class="row justify-content-end mb-2">
          <div class="col-auto">
            <div class="text-end">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="small text-muted me-3">Thành tiền</span>
                <span class="fw-bold small">{{ formatPrice(session?.subtotal || 0) }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="small text-muted me-3">Phí vận chuyển (Giao hàng tiêu chuẩn)</span>
                <span class="fw-bold small">{{ formatPrice(session?.shippingFee || 20000) }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="small text-muted me-3">Tổng Số Tiền (gồm VAT)</span>
                <span class="fw-bold text-warning">{{ formatPrice(session?.totalAmount || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Đường kẻ ngăn cách -->
        <hr class="my-2" style="border-color: #dee2e6;">
        
        <!-- Phần điều khoản và nút thanh toán ở dưới -->
        <div class="row align-items-center">
          <div class="col-12 col-md-6">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="agree" checked>
              <label class="form-check-label small" for="agree">
                Bằng việc tiến hành Mua hàng, bạn đã đồng ý với 
                <a href="#" class="text-primary">Điều khoản & Điều kiện của BookStation.com</a>
              </label>
            </div>
          </div>
          <div class="col-12 col-md-6 text-center text-md-end">
            <button class="btn btn-danger px-4 py-2 fw-bold" @click="processPayment">
              Xác nhận thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Padding để tránh bị che bởi thanh cố định -->
    <div style="height: 120px;"></div>

    <!-- Modal chọn địa chỉ -->
    <div class="modal fade" :class="{ show: showAddressModal }" :style="{ display: showAddressModal ? 'block' : 'none' }" tabindex="-1" @click.self="showAddressModal = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chọn địa chỉ giao hàng</h5>
            <button type="button" class="btn-close" @click="showAddressModal = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="addresses.length === 0" class="text-center py-3">
              <div class="text-muted">Bạn chưa có địa chỉ nào</div>
              <button class="btn btn-primary btn-sm mt-2">
                <i class="fas fa-plus me-1"></i>
                Thêm địa chỉ mới
              </button>
            </div>
            <div v-else>
              <div v-for="address in addresses" :key="address.id" class="border rounded p-3 mb-2" :class="{ 'border-primary': selectedAddress?.id === address.id }" @click="selectAddress(address)" style="cursor: pointer;">
                <div class="d-flex">
                  <div class="form-check me-2 align-self-start mt-1">
                    <input class="form-check-input" type="radio" name="modalAddress" :checked="selectedAddress?.id === address.id">
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-1">
                      <strong class="me-2">{{ address.recipientName }}</strong>
                      <span class="text-muted">{{ address.phoneNumber }}</span>
                      <span v-if="address.isDefault" class="badge bg-primary ms-2" style="font-size: 10px;">Mặc định</span>
                    </div>
                    <div class="text-muted small">
                      {{ formatFullAddress(address) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddressModal = false">Hủy</button>
            <button type="button" class="btn btn-primary" @click="showAddressModal = false">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal backdrop -->
    <div v-if="showAddressModal" class="modal-backdrop fade show"></div>
  
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  getCheckoutSession,
  getLatestCheckoutSession,
  validateCheckoutSession,
  createOrderFromSession,
  recalculateSessionPricing
} from '@/services/client/checkout.js'
import { getDefaultAddress, getAddresses } from '@/services/client/address.js'
import { getUserId } from '@/utils/utils.js'
import { showToast } from '@/utils/swalHelper.js'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const orderLoading = ref(false)
const session = ref(null)
const sessionId = ref(null)
const error = ref(null)
const validationErrors = ref([])
const agreed = ref(true)
const couponCode = ref('')

// Address related states
const selectedAddress = ref(null)
const addresses = ref([])
const addressLoading = ref(false)
const showAddressModal = ref(false)

let validationTimer = null

const formatPrice = (price) => {
  if (!price) return '0 ₫'
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
}

const loadLatestSession = async (userId) => {
  try {
    loading.value = true
    error.value = null
    const response = await getLatestCheckoutSession(userId)
    if (response.status === 200 && response.data) {
      session.value = response.data.data // <-- đúng cấu trúc
      sessionId.value = response.data.data.id
       console.log(
    'session:', session.value,
    'checkoutItems:', session.value?.checkoutItems,
    'length:', session.value?.checkoutItems?.length,
    'condition:', !!(session.value && session.value.checkoutItems && session.value.checkoutItems.length > 0)
  )
      await validateSession()
    } else {
      throw new Error('Không tìm thấy phiên thanh toán mới nhất.')
    }
  } catch (err) {
    console.error('Error loading latest checkout session:', err)
    const errorMessage = err.response?.data?.message || err.message
    if (err.response?.status === 404) {
      error.value = 'Không có phiên thanh toán nào. Vui lòng quay lại giỏ hàng.'
    } else {
      error.value = errorMessage || 'Không thể tải thông tin thanh toán.'
    }
  } finally {
    loading.value = false
  }
}

const validateSession = async () => {
  try {
    const userId = getUserId()
    const id = session.value?.id
    if (!userId || !id) return
    const response = await validateCheckoutSession(id, userId)
    if (response.status === 200) {
      validationErrors.value = []
      if (response.data) {
        session.value = response.data.data
        sessionId.value = response.data.data.id
      }
    } else {
      throw new Error('Validation failed')
    }
  } catch (err) {
    console.error('Validation error:', err)
    const errorMessage = err.response?.data?.message || err.message
    if (errorMessage && errorMessage.includes('❌')) {
      const errors = errorMessage.replace('❌ Có lỗi khi kiểm tra đơn hàng: ', '').split('; ')
      validationErrors.value = errors.filter(e => e.trim())
    } else {
      validationErrors.value = [errorMessage || 'Có lỗi khi kiểm tra đơn hàng']
    }
  }
}

const setupValidationTimer = () => {
  validationTimer = setInterval(async () => {
    if (session.value && session.value.isActive) {
      await validateSession()
    }
  }, 30000)
}

const processPayment = async () => {
  if (!agreed.value) {
    showToast('warning', 'Vui lòng đồng ý với điều khoản và điều kiện!')
    return
  }
  if (!session.value || !session.value.isActive) {
    showToast('error', 'Phiên thanh toán không hợp lệ hoặc đã hết hạn')
    return
  }
  if (validationErrors.value.length > 0) {
    showToast('warning', 'Vui lòng kiểm tra và sửa các lỗi trước khi đặt hàng')
    return
  }
  try {
    orderLoading.value = true
    const userId = getUserId()
    await validateSession()
    if (validationErrors.value.length > 0) {
      showToast('error', 'Có lỗi trong đơn hàng. Vui lòng kiểm tra lại.')
      return
    }
    const response = await createOrderFromSession(sessionId.value, userId)
    if (response.status === 201 && response.data) {
      const orderId = response.data
      showToast('success', `Đặt hàng thành công! Mã đơn hàng: ${orderId}`)
      router.push(`/order/success/${orderId}`)
    } else {
      throw new Error('Invalid response from order creation')
    }
  } catch (err) {
    console.error('Error creating order:', err)
    const errorMessage = err.response?.data?.message || err.message
    if (err.response?.status === 400) {
      if (errorMessage.includes('hết hàng')) {
        showToast('error', 'Một số sản phẩm đã hết hàng. Vui lòng cập nhật lại giỏ hàng.')
      } else if (errorMessage.includes('flash sale')) {
        showToast('error', 'Flash sale đã kết thúc. Giá sản phẩm có thể đã thay đổi.')
      } else if (errorMessage.includes('voucher')) {
        showToast('error', 'Voucher không hợp lệ hoặc đã hết hạn.')
      } else if (errorMessage.includes('hết hạn')) {
        showToast('error', 'Phiên thanh toán đã hết hạn. Vui lòng tạo phiên mới.')
        router.push('/cart')
      } else {
        showToast('error', errorMessage)
      }
      await loadLatestSession(getUserId())
    } else if (err.response?.status === 401) {
      showToast('error', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      router.push('/login')
    } else {
      showToast('error', 'Lỗi hệ thống. Vui lòng thử lại sau.')
    }
  } finally {
    orderLoading.value = false
  }
}

const recalculateOrder = async () => {
  try {
    const userId = getUserId()
    const response = await recalculateSessionPricing(sessionId.value, userId)
    if (response.status === 200 && response.data) {
      session.value = response.data
      showToast('success', 'Đã cập nhật lại giá đơn hàng')
    }
  } catch (err) {
    console.error('Error recalculating order:', err)
    showToast('error', 'Không thể cập nhật lại giá đơn hàng')
  }
}

// Address functions
const loadAddresses = async () => {
  try {
    addressLoading.value = true
    const userId = getUserId()
    if (!userId) return
    
    const addressData = await getAddresses(userId)
    if (addressData.success && addressData.data) {
      addresses.value = addressData.data
      // Tìm địa chỉ mặc định hoặc lấy địa chỉ đầu tiên
      selectedAddress.value = addressData.data.find(addr => addr.isDefault) || addressData.data[0] || null
    }
  } catch (err) {
    console.error('Error loading addresses:', err)
    // Không hiển thị toast error vì có thể user chưa có địa chỉ nào
  } finally {
    addressLoading.value = false
  }
}

const formatFullAddress = (address) => {
  if (!address) return ''
  const parts = [
    address.addressDetail,
    address.wardName,
    address.districtName,
    address.provinceName
  ].filter(Boolean)
  return parts.join(', ')
}

const applyCoupon = () => {
  if (!couponCode.value.trim()) {
    showToast('warning', 'Vui lòng nhập mã khuyến mãi')
    return
  }
  // TODO: Implement coupon application logic
  showToast('info', 'Chức năng áp dụng mã khuyến mãi sẽ được triển khai sớm')
}

const selectAddress = (address) => {
  selectedAddress.value = address
}

// Lắng nghe sự kiện storage để reload giữa các tab
// ...existing code...

onMounted(async () => {
  const userId = getUserId()
  if (!userId) {
    error.value = 'Vui lòng đăng nhập để tiếp tục.'
    loading.value = false
    router.push('/login')
    return
  }
  
  // Load checkout session và addresses song song
  await Promise.all([
    loadLatestSession(userId),
    loadAddresses()
  ])
  
  setupValidationTimer()
})
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 1.5rem;
}

.form-check-input:checked {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.modal {
  background: rgba(0, 0, 0, 0.5);
}

.modal.show {
  display: block !important;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}

.border-primary {
  border-color: #0d6efd !important;
  background-color: rgba(13, 110, 253, 0.05);
}

.text-warning {
  color: #ffc107 !important;
}

/* Fixed bottom bar */
.fixed-bottom {
  z-index: 1030;
}

/* Border dashed style */
.border-dashed {
  border-style: dashed !important;
  border-color: #dc3545 !important;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .container-fluid {
    padding: 0.5rem;
  }
  
  .card-body {
    padding: 0.5rem;
  }
  
  .fixed-bottom .row:first-child {
    flex-direction: column;
    align-items: center;
  }
  
  .fixed-bottom .row:last-child {
    flex-direction: column;
  }
  
  .fixed-bottom .col-md-6:first-child {
    margin-bottom: 0.5rem;
  }
  
  .fixed-bottom {
    padding: 0.75rem 0;
  }
  
  .fixed-bottom .d-flex {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* Hover effects */
.border:hover {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* Additional styles */
.text-primary {
  color: #007bff !important;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

/* Gift section styling */
.fas.fa-gift {
  font-size: 16px;
}

/* Product image styling */
.card-body img {
  border: 1px solid #e0e0e0;
}

/* Form control styling */
.form-control-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
}

/* Icon styling for payment methods */
.fas.fa-university,
.fas.fa-credit-card,
.fas.fa-money-bill-wave {
  color: #6c757d;
}

/* Checkbox styling */
.form-check-input {
  margin-top: 0.25rem;
}

/* Card header with primary color */
.card-header h6.text-primary {
  color: #007bff !important;
}
</style>
