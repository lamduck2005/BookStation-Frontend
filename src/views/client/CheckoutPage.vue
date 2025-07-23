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
            <!-- Thanh toán khi nhận hàng (COD) - Mặc định -->
            <div class="d-flex align-items-center mb-2 p-2 border rounded" :class="{ 'border-primary bg-light': session?.paymentMethod === 'COD' || !session?.paymentMethod }">
              <div class="form-check me-2">
                <input 
                  class="form-check-input" 
                  type="radio" 
                  name="payment" 
                  id="cod" 
                  :checked="session?.paymentMethod === 'COD' || !session?.paymentMethod"
                  @change="updateSessionPaymentMethod('COD')"
                >
                <label class="form-check-label" for="cod"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <div class="me-2 d-flex align-items-center justify-content-center" style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; background-color: #28a745;">
                  <i class="fas fa-money-bill-wave" style="font-size: 14px; color: white;"></i>
                </div>
                <div>
                  <div class="small">
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <span class="badge bg-success ms-2" style="font-size: 10px;">Mặc định</span>
                  </div>
                  <div class="text-muted" style="font-size: 11px;">
                    Thanh toán bằng tiền mặt khi nhận hàng
                  </div>
                </div>
              </div>
            </div>

            <!-- Chuyển khoản ngân hàng -->
            <!-- <div class="d-flex align-items-center mb-2 p-2 border rounded" :class="{ 'border-primary bg-light': session?.paymentMethod === 'BANK_TRANSFER' }">
              <div class="form-check me-2">
                <input 
                  class="form-check-input" 
                  type="radio" 
                  name="payment" 
                  id="bank" 
                  :checked="session?.paymentMethod === 'BANK_TRANSFER'"
                  @change="updateSessionPaymentMethod('BANK_TRANSFER')"
                >
                <label class="form-check-label" for="bank"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <div class="me-2 d-flex align-items-center justify-content-center" style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; background-color: #007bff;">
                  <i class="fas fa-university" style="font-size: 14px; color: white;"></i>
                </div>
                <div>
                  <div class="small">
                    <strong>Chuyển khoản ngân hàng</strong>
                  </div>
                  <div class="text-muted" style="font-size: 11px;">
                    Chuyển khoản trước khi giao hàng
                  </div>
                </div>
              </div>
            </div> -->

            <!-- VNPay -->
            <div class="d-flex align-items-center mb-2 p-2 border rounded" :class="{ 'border-primary bg-light': session?.paymentMethod === 'VNPAY' }">
              <div class="form-check me-2">
                <input 
                  class="form-check-input" 
                  type="radio" 
                  name="payment" 
                  id="vnpay" 
                  :checked="session?.paymentMethod === 'VNPAY'"
                  @change="updateSessionPaymentMethod('VNPAY')"
                >
                <label class="form-check-label" for="vnpay"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPay" class="me-2" style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; padding: 3px;">
                <div>
                  <div class="small">
                    <strong>Ví điện tử VNPAY</strong>
                  </div>
                  <div class="text-muted" style="font-size: 11px;">
                    Thanh toán online qua VNPAY
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
            <h6 class="mb-0 text-uppercase fw-bold text-primary">
              Thành viên BookStation
            </h6>
          </div>
          <div class="card-body py-3">
            <!-- B-Point -->
            <div class="mb-3">
              <div
                class="d-flex align-items-center justify-content-between mb-2"
              >
                <div class="small">
                  <strong>Số B-Point hiện có:</strong>
                  <span class="text-warning ms-1">0</span>
                </div>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="usePoints"
                />
                <label class="form-check-label small" for="usePoints">
                  Sử dụng B-point để thanh toán
                </label>
              </div>
            </div>

            <!-- Freeship -->
            <div class="mb-3">
              <div
                class="d-flex align-items-center justify-content-between mb-2"
              >
                <div class="small">
                  <strong>Số lần freeship:</strong>
                  <span class="text-warning ms-1">0 lần</span>
                </div>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="useFreeship"
                />
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
            <h6 class="mb-0 text-uppercase fw-bold">
              Mã khuyến mãi/Mã quà tặng
            </h6>
          </div>
          <div class="card-body py-3">
            <div class="row">
              <div class="col-8">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Nhập mã khuyến mãi/Quà tặng"
                  v-model="couponCode"
                  style="font-size: 14px"
                />
              </div>
              <div class="col-4">
                <button
                  class="btn btn-primary btn-sm w-100"
                  @click="applyCoupon"
                  style="font-size: 14px"
                >
                  Áp dụng
                </button>
              </div>
            </div>
            <div class="mt-2">
              <button
                class="btn btn-link p-0 text-primary text-decoration-none small"
                @click="showVoucherList = true"
              >
                Chọn mã khuyến mãi
              </button>
            </div>
            <!-- Modal chọn voucher -->
            <div v-if="showVoucherList" class="voucher-modal-overlay">
              <div class="voucher-modal card shadow p-3">
                <div class="d-flex align-items-center mb-3">
                  <span class="fw-bold text-primary me-2"
                    ><i class="fas fa-ticket-alt"></i> CHỌN MÃ KHUYẾN MÃI</span
                  >
                  <span class="small text-muted"
                    >Có thể áp dụng đồng thời nhiều mã</span
                  >
                  <button
                    class="btn btn-sm btn-outline-secondary ms-auto"
                    @click="showVoucherList = false"
                  >
                    Đóng
                  </button>
                </div>
                <input
                  type="text"
                  class="form-control form-control-sm mb-2"
                  v-model="voucherSearch"
                  placeholder="Tìm kiếm mã..."
                />
                <div v-if="filteredVouchers.length > 0">
                  <div
                    v-for="voucher in filteredVouchers"
                    :key="voucher.id || voucher.code"
                    class="voucher-item border rounded p-2 mb-2 d-flex align-items-center justify-content-between"
                    :style="{
                      background: selectedVouchers.some(
                        (v) => v.code === voucher.code
                      )
                        ? '#e3f2fd'
                        : '#fff',
                    }"
                  >
                    <div>
                      <div class="fw-bold">
                        {{ voucher.name || voucher.code }}
                      </div>
                      <div class="small text-muted">
                        {{ voucher.description }}
                      </div>
                      <div class="small">
                        HSD:
                        {{
                          new Date(voucher.endTime).toLocaleDateString("vi-VN")
                        }}
                      </div>
                    </div>
                    <button
                      class="btn btn-sm"
                      :class="
                        selectedVouchers.some((v) => v.code === voucher.code)
                          ? 'btn-danger'
                          : 'btn-primary'
                      "
                      @click="toggleVoucher(voucher)"
                    >
                      {{
                        selectedVouchers.some((v) => v.code === voucher.code)
                          ? "Bỏ chọn"
                          : "Chọn"
                      }}
                    </button>
                  </div>
                </div>
                <div v-else class="text-muted small">
                  Không tìm thấy mã phù hợp
                </div>
                <div class="mt-3 text-end">
                  <button
                    class="btn btn-primary"
                    @click="showVoucherList = false"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
            <!-- Hiển thị list voucher đã chọn -->
            <div v-if="selectedVouchers.length > 0" class="mt-2">
              <div class="fw-bold small mb-1">Voucher đã chọn:</div>
              <div class="d-flex flex-wrap gap-2">
                <span
                  v-for="voucher in selectedVouchers"
                  :key="voucher.code"
                  class="badge bg-primary text-white d-flex align-items-center"
                >
                  {{ voucher.code }}
                  <button
                    class="btn btn-sm btn-link text-white ms-1 p-0"
                    style="font-size: 13px"
                    @click="toggleVoucher(voucher)"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </span>
              </div>
            </div>
            <div class="text-muted small mt-1">
              Có thể áp dụng đồng thời nhiều mã
            </div>

            <!-- Nhận quà section -->
            <div
              class="mt-3 p-2"
              style="background-color: #f8f9fa; border-radius: 6px"
            >
              <div class="d-flex align-items-center">
                <i class="fas fa-gift text-primary me-2"></i>
                <div class="flex-grow-1">
                  <div class="small fw-bold text-primary">Nhận quà</div>
                  <div class="text-muted" style="font-size: 12px">
                    Đơn hàng của bạn chưa đủ điều kiện nhận quà
                  </div>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm"
                  @click="selectGift"
                >
                  <span style="font-size: 12px">Chọn quà</span>
                  <i
                    class="fas fa-chevron-right ms-1"
                    style="font-size: 10px"
                  ></i>
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

        <!-- Ghi chú đơn hàng -->
        <div class="card mb-3">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">Ghi chú cho đơn hàng</h6>
          </div>
          <div class="card-body py-3">
            <textarea 
              class="form-control" 
              rows="3" 
              placeholder="Nhập ghi chú cho đơn hàng (tùy chọn)..."
              :value="session?.notes || ''"
              @blur="updateSessionNotes($event.target.value)"
            ></textarea>
            <div class="small text-muted mt-2">
              <i class="fas fa-info-circle me-1"></i>
              Ghi chú sẽ được gửi đến người bán để hỗ trợ giao hàng tốt hơn
            </div>
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
              <div
                class="d-flex justify-content-between align-items-center mb-1"
              >
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
        <hr class="my-2" style="border-color: #dee2e6" />

        <!-- Phần điều khoản và nút thanh toán ở dưới -->
        <div class="row align-items-center">
          <div class="col-12 col-md-6">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="agree"
                checked
              />
              <label class="form-check-label small" for="agree">
                Bằng việc tiến hành Mua hàng, bạn đã đồng ý với
                <a href="#" class="text-primary"
                  >Điều khoản & Điều kiện của BookStation.com</a
                >
              </label>
            </div>
          </div>
          <div class="col-12 col-md-6 text-center text-md-end">
            <button
              class="btn btn-danger px-4 py-2 fw-bold"
              @click="processPayment"
            >
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
  recalculateSessionPricing,
  updateCheckoutSession,
  createVNPayPaymentUrl
} from '@/services/client/checkout.js'
import { getAddresses } from '@/services/client/address.js'
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

// Voucher related states
const showVoucherList = ref(false)
const voucherSearch = ref('')
const selectedVouchers = ref([])
const filteredVouchers = ref([])

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
    
    console.log('🔍 Response from getLatestCheckoutSession:', response)
    
    // Fix: Kiểm tra đúng cấu trúc response
    if (response.status === 200 && response.data?.data) {
      session.value = response.data.data
      sessionId.value = response.data.data.id
      
      console.log('✅ Latest session loaded hi:', {
        sessionId: sessionId.value,
        session: session.value,
        checkoutItems: session.value?.checkoutItems,
        length: session.value?.checkoutItems?.length,
        isActive: session.value?.isActive
      })
      
      // Lấy địa chỉ từ session nếu có, nếu không thì lấy địa chỉ mặc định
      if (session.value.addressId) {
        // Tìm địa chỉ trong danh sách addresses đã load
        const foundAddress = addresses.value.find(addr => addr.id === session.value.addressId)
        if (foundAddress) {
          selectedAddress.value = foundAddress
        }
      } else {
        // Nếu session chưa có địa chỉ, tự động cập nhật với địa chỉ mặc định
        await setDefaultAddressToSession()
      }
      
      // Fix: Validate session nhưng không để nó block loading
      try {
        await validateSession()
      } catch (validateError) {
        console.warn('⚠️ Validation error (non-blocking):', validateError)
      }
    } else {
      throw new Error('Không tìm thấy phiên thanh toán mới nhất.')
    }
  } catch (err) {
    console.error('❌ Error loading latest checkout session:', err)
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
    
    console.log('🔍 Validate session response:', response)
    
    if (response.status === 200) {
      validationErrors.value = []
      // Fix: Kiểm tra đúng structure response.data?.data
      if (response.data?.data) {
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
    
    // Validate session một lần nữa trước khi tạo đơn hàng
    console.log('🔍 Final validation before order creation...')
    await validateSession()
    if (validationErrors.value.length > 0) {
      showToast('error', 'Có lỗi trong đơn hàng. Vui lòng kiểm tra lại.')
      return
    }
    
    // Đảm bảo có phương thức thanh toán, mặc định là COD
    if (!session.value.paymentMethod) {
      console.log('💳 Setting default payment method to COD...')
      await updateSessionPaymentMethod('COD')
    } else if (session.value.paymentMethod === 'VNPAY') {
      const response = await createVNPayPaymentUrl(sessionId.value, userId)
      if(response.data.data) {
        const paymentUrl = response.data.data
        window.location.href = paymentUrl
      } else {
        showToast('error', 'Có lỗi khi thanh toán bằng VNPay, vui lòng thử lại.')
      }
      return
    }
    // Tạo đơn hàng từ session
    console.log('📝 Creating order from session...')
    const response = await createOrderFromSession(sessionId.value, userId)
    
    if (response.status === 201 && response.data) {
      const orderId = response.data
      console.log('🎉 Order created successfully:', orderId)
      showToast('success', `Đặt hàng thành công! Mã đơn hàng: ${orderId}`)
      
      // Chuyển đến trang thành công
      router.push(`/order/success/${orderId}`)
    } else {
      throw new Error('Invalid response from order creation')
    }
  } catch (err) {
    console.error('❌ Error creating order:', err)
    const errorMessage = err.response?.data?.message || err.message
    
    if (err.response?.status === 400) {
      if (errorMessage.includes('hết hàng')) {
        showToast('error', 'Một số sản phẩm đã hết hàng. Vui lòng cập nhật lại giỏ hàng.')
      } else if (errorMessage.includes('flash sale') || errorMessage.includes('Flash sale')) {
        showToast('error', 'Flash sale đã kết thúc. Giá sản phẩm có thể đã thay đổi.')
        // Reload session để cập nhật giá mới
        await loadLatestSession(getUserId())
      } else if (errorMessage.includes('voucher') || errorMessage.includes('Voucher')) {
        showToast('error', 'Voucher có vấn đề. ' + errorMessage)
        // Reload session để cập nhật trạng thái voucher
        await loadLatestSession(getUserId())
      } else if (errorMessage.includes('hết hạn')) {
        showToast('error', 'Phiên thanh toán đã hết hạn. Vui lòng tạo lại từ giỏ hàng.')
        router.push('/cart')
      } else {
        showToast('error', errorMessage || 'Có lỗi khi tạo đơn hàng.')
        // Reload session để cập nhật trạng thái
        await loadLatestSession(getUserId())
      }
    } else if (err.response?.status === 401) {
      showToast('error', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      router.push('/login')
    } else {
      showToast('error', errorMessage || 'Có lỗi khi tạo đơn hàng.')
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
    
    const response = await getAddresses()
    if (response.status === 200 && response.data?.data) {
      addresses.value = response.data.data
      console.log('✅ Addresses loaded:', addresses.value)
      
      // Tìm và set địa chỉ mặc định nếu chưa có selectedAddress
      if (!selectedAddress.value) {
        const defaultAddr = addresses.value.find(addr => addr.isDefault)
        if (defaultAddr) {
          selectedAddress.value = defaultAddr
          console.log('✅ Default address found:', defaultAddr)
        } else if (addresses.value.length > 0) {
          selectedAddress.value = addresses.value[0]
          console.log('✅ Using first address as default:', addresses.value[0])
        }
      }
    }
  } catch (err) {
    console.error('❌ Error loading addresses:', err)
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

const selectAddress = async (address) => {
  selectedAddress.value = address
  showAddressModal.value = false
  
  // Cập nhật địa chỉ vào session
  if (sessionId.value && address?.id) {
    await updateSessionAddress(address.id)
  }
}

// Helper function để lấy items từ session hiện tại - LUÔN LUÔN CẦN THIẾT khi update session
const getCurrentSessionItems = () => {
  if (!session.value?.checkoutItems) {
    console.warn('⚠️ No checkout items found in session')
    return []
  }
  
  return session.value.checkoutItems.map(item => ({
    bookId: item.bookId,
    quantity: item.quantity
  }))
}

// Function để set địa chỉ mặc định vào session
const setDefaultAddressToSession = async () => {
  try {
    // Tìm địa chỉ mặc định trong danh sách địa chỉ
    const defaultAddr = addresses.value.find(addr => addr.isDefault)
    if (defaultAddr && sessionId.value) {
      const userId = getUserId()
      
      // QUAN TRỌNG: Phải truyền items theo document
      const updateData = {
        items: getCurrentSessionItems(),
        addressId: defaultAddr.id
      }
      
      console.log('📝 Updating session with default address:', updateData)
      const response = await updateCheckoutSession(sessionId.value, userId, updateData)
      
      if (response.status === 200 && response.data?.data) {
        session.value = response.data.data
        selectedAddress.value = defaultAddr // Fix: Dùng defaultAddr thay vì response.data.data.address
        console.log('✅ Default address set to session:', defaultAddr.id)
      }
    }
  } catch (error) {
    console.error('❌ Error setting default address to session:', error)
  }
}

// Function để cập nhật địa chỉ giao hàng
const updateSessionAddress = async (addressId) => {
  try {
    const userId = getUserId()
    if (!sessionId.value || !userId) return
    
    // QUAN TRỌNG: Phải truyền items theo document
    const updateData = {
      items: getCurrentSessionItems(),
      addressId: addressId
    }
    
    console.log('📝 Updating session address:', updateData)
    const response = await updateCheckoutSession(sessionId.value, userId, updateData)
    
    if (response.status === 200 && response.data?.data) {
      session.value = response.data.data
      // Fix: Tìm địa chỉ trong danh sách addresses thay vì dùng response.data.data.address
      selectedAddress.value = addresses.value.find(addr => addr.id === addressId)
      showToast('success', 'Địa chỉ giao hàng đã được cập nhật')
    }
  } catch (error) {
    console.error('❌ Error updating session address:', error)
    showToast('error', 'Không thể cập nhật địa chỉ giao hàng')
  }
}

// Function để cập nhật phương thức thanh toán  
const updateSessionPaymentMethod = async (paymentMethod) => {
  try {
    const userId = getUserId()
    if (!sessionId.value || !userId) return
    
    // QUAN TRỌNG: Phải truyền items theo document
    const updateData = {
      items: getCurrentSessionItems(),
      paymentMethod: paymentMethod
    }
    
    console.log('📝 Updating session payment method:', updateData)
    const response = await updateCheckoutSession(sessionId.value, userId, updateData)
    
    if (response.status === 200 && response.data?.data) {
      session.value = response.data.data
      showToast('success', 'Phương thức thanh toán đã được cập nhật')
    }
  } catch (error) {
    console.error('❌ Error updating payment method:', error)
    showToast('error', 'Không thể cập nhật phương thức thanh toán')
  }
}

// Function để cập nhật voucher
const updateSessionVouchers = async (voucherIds) => {
  try {
    const userId = getUserId()
    if (!sessionId.value || !userId) return
    
    // QUAN TRỌNG: Phải truyền items theo document
    const updateData = {
      items: getCurrentSessionItems(),
      selectedVoucherIds: voucherIds
    }
    
    console.log('📝 Updating session vouchers:', updateData)
    const response = await updateCheckoutSession(sessionId.value, userId, updateData)
    
    if (response.status === 200 && response.data?.data) {
      session.value = response.data.data
      showToast('success', 'Voucher đã được cập nhật')
    }
  } catch (error) {
    console.error('❌ Error updating vouchers:', error)
    showToast('error', 'Không thể cập nhật voucher')
  }
}

// Function để cập nhật ghi chú
const updateSessionNotes = async (notes) => {
  try {
    const userId = getUserId()
    if (!sessionId.value || !userId) return
    
    // QUAN TRỌNG: Phải truyền items theo document
    const updateData = {
      items: getCurrentSessionItems(),
      notes: notes
    }
    
    console.log('📝 Updating session notes:', updateData)
    const response = await updateCheckoutSession(sessionId.value, userId, updateData)
    
    if (response.status === 200 && response.data?.data) {
      session.value = response.data.data
      showToast('success', 'Ghi chú đã được cập nhật')
    }
  } catch (error) {
    console.error('❌ Error updating notes:', error)
    showToast('error', 'Không thể cập nhật ghi chú')
  }
}

// Voucher functions
const toggleVoucher = (voucher) => {
  const index = selectedVouchers.value.findIndex(v => v.code === voucher.code)
  if (index > -1) {
    selectedVouchers.value.splice(index, 1)
  } else {
    selectedVouchers.value.push(voucher)
  }
  // TODO: Update session vouchers when implemented
}

const selectGift = () => {
  showToast('info', 'Chức năng chọn quà sẽ được triển khai sớm')
}

// Lắng nghe sự kiện storage để reload giữa các tab
window.addEventListener('storage', (event) => {
  if (event.key === 'checkoutSession' || event.key === 'userInfo') {
    console.log('🔄 Reloading due to storage event:', event.key)
    location.reload()
  }
})

onMounted(async () => {
  const userId = getUserId()
  if (!userId) {
    error.value = 'Vui lòng đăng nhập để tiếp tục.'
    loading.value = false
    showToast('error', 'Vui lòng đăng nhập để tiếp tục')
    router.push('/login')
    return
  }
  
  console.log('🚀 Loading checkout page for user:', userId)
  
  // Load addresses và checkout session song song
  await Promise.all([
    loadAddresses(),
    loadLatestSession(userId)
  ])
  
  setupValidationTimer()
})
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

/* Voucher modal styling */
.voucher-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voucher-modal {
  max-width: 500px;
  width: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.voucher-item {
  transition: background 0.2s;
}

.voucher-item:hover {
  background: #f1f8ff;
}
</style>
