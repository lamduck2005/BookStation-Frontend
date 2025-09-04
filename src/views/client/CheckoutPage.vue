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
              <span class="ms-2 small">Đang tải địa chỉ....</span>
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
                  <button class="btn btn-link text-primary p-0 text-decoration-none small"
                    @click="showAddressModal = true">
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



        <!-- Phương thức thanh toán -->
        <div class="card mb-3">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">Phương thức thanh toán</h6>
          </div>
          <div class="card-body py-3">
            <!-- Thanh toán khi nhận hàng (COD) - Mặc định -->
            <div class="d-flex align-items-center mb-2 p-2 border rounded"
              :class="{ 'border-primary bg-light': session?.paymentMethod === 'COD' || !session?.paymentMethod }">
              <div class="form-check me-2">
                <input class="form-check-input" type="radio" name="payment" id="cod"
                  :checked="session?.paymentMethod === 'COD' || !session?.paymentMethod"
                  @change="handlePaymentMethodChange('COD')">
                <label class="form-check-label" for="cod"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <div class="me-2 d-flex align-items-center justify-content-center"
                  style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; background-color: #28a745;">
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



            <!-- VNPay -->
            <div class="d-flex align-items-center mb-2 p-2 border rounded"
              :class="{ 'border-primary bg-light': session?.paymentMethod === 'VNPAY' }">
              <div class="form-check me-2">
                <input class="form-check-input" type="radio" name="payment" id="vnpay"
                  :checked="session?.paymentMethod === 'VNPAY'" @change="handlePaymentMethodChange('VNPAY')">
                <label class="form-check-label" for="vnpay"></label>
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPay"
                  class="me-2"
                  style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 3px; padding: 3px;">
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

        <!-- Mã khuyến mãi/Mã quà tặng -->
        <div class="card mb-3">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">
              Mã khuyến mãi/Mã quà tặng
            </h6>
          </div>
          <div class="card-body py-3">
            <div class="row">
              <!-- <div class="col-8">
                <input type="text" class="form-control form-control-sm" placeholder="Nhập mã khuyến mãi/Quà tặng"
                  v-model="couponCode" style="font-size: 14px" />
              </div>
              <div class="col-4">
                <button class="btn btn-primary btn-sm w-100" @click="applyCoupon" style="font-size: 14px">
                  Áp dụng
                </button>
              </div> -->
            </div>
            <div class="mt-2">
              <button class="btn btn-primary p-3" @click="openVoucherModal">
                <i class="fas fa-ticket-alt me-1"></i>Chọn mã giảm giá
              </button>
            </div>
            <!-- Modal chọn voucher -->
            <div v-if="showVoucherList" class="modal fade show d-block" style="z-index: 1055; background-color: rgba(0,0,0,0.5);" tabindex="-1" @click.self="showVoucherList = false">
              <div class="modal-dialog modal-lg modal-dialog-centered" style="max-height: 90vh; margin: 5vh auto;">
                <div class="modal-content" style="max-height: 90vh; display: flex; flex-direction: column;">
                  <div class="modal-header border-bottom-0" style="flex-shrink: 0;">
                    <h5 class="modal-title text-primary">
                      <i class="fas fa-ticket-alt me-2"></i>
                      Chọn mã khuyến mãi
                    </h5>
                    <button type="button" class="btn-close" @click="showVoucherList = false"></button>
                  </div>
                  <div class="modal-body" style="flex: 1; overflow-y: auto; max-height: calc(90vh - 140px);">
                    <!-- Thông tin giới hạn -->
                    <div class="alert alert-info border-0" role="alert">
                      <i class="fas fa-info-circle me-2"></i>
                      <strong>Lưu ý:</strong> Tối đa 2 voucher: 1 Giảm giá vận chuyển + 1 Giảm giá sản phẩm
                    </div>

                    <!-- Loading state -->
                    <div v-if="voucherLoading" class="text-center py-4">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                      <p class="mt-2 text-muted">Đang tải voucher...</p>
                    </div>

                    <!-- Search voucher -->
                    <div v-else class="mb-3">
                      <div class="input-group">
                        <span class="input-group-text bg-light border-end-0">
                          <i class="fas fa-search text-muted"></i>
                        </span>
                        <input 
                          type="text" 
                          class="form-control border-start-0" 
                          v-model="voucherSearch"
                          placeholder="Tìm kiếm mã voucher..." 
                          style="box-shadow: none;"
                        />
                      </div>
                    </div>

                    <!-- Voucher list -->
                    <div v-if="!voucherLoading">
                      <div v-if="filteredVouchers.length === 0 && userVouchers.length === 0" class="text-center py-4">
                        <i class="fas fa-ticket-alt text-muted" style="font-size: 48px;"></i>
                        <p class="text-muted mt-3">Bạn chưa có voucher khả dụng nào</p>
                      </div>
                      
                      <div v-else-if="filteredVouchersComputed.length === 0" class="text-center py-4">
                        <i class="fas fa-search text-muted" style="font-size: 48px;"></i>
                        <p class="text-muted mt-3">Không tìm thấy voucher phù hợp</p>
                      </div>

                      <div v-else class="voucher-list">
                        <div 
                          v-for="voucher in filteredVouchersComputed" 
                          :key="voucher.id"
                          class="voucher-card mb-3"
                          :class="{ 
                            'selected': isVoucherSelected(voucher.id),
                            'disabled': !canSelectVoucher(voucher) && !isVoucherSelected(voucher.id)
                          }"
                          @click="toggleVoucherSelection(voucher)"
                        >
                          <div class="card border-0 shadow-sm h-100" style="transition: all 0.3s ease;">
                            <div class="card-body p-3">
                              <div class="voucher-content">
                                <div class="row">
                                  <div class="col-md-8">
                                    <div class="voucher-header mb-2">
                                      <h6 class="voucher-name text-primary fw-bold mb-1">
                                        {{ voucher.code }} - {{ voucher.name }}
                                      </h6>
                                      <p class="voucher-description text-muted small mb-2">{{ voucher.description }}</p>
                                    </div>
                                    <div class="voucher-badges">
                                      <span class="badge bg-info me-2">{{ voucher.categoryVi }}</span>
                                      <span class="badge bg-secondary me-2">{{ voucher.discountTypeVi }}</span>
                                      <span class="text-success fw-bold">{{ voucher.discountInfo }}</span>
                                      <div v-if="voucher.minimumOrderValue" class="mt-1">
                                        <small class="text-muted">
                                          Đơn tối thiểu: {{ formatPrice(voucher.minimumOrderValue) }}
                                        </small>
                                        <!-- Hiển thị trạng thái voucher -->
                                        <div v-if="!canSelectVoucher(voucher) && !isVoucherSelected(voucher.id)" class="mt-1">
                                          <small class="text-danger fw-bold">
                                            <i class="fas fa-exclamation-triangle me-1"></i>
                                            {{ getVoucherStatusMessage(voucher) }}
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-md-4 text-end">
                                    <div class="voucher-usage mb-2">
                                      <div class="small text-muted">Còn lại:</div>
                                      <div class="fw-bold text-success">{{ voucher.remainingUses }}/{{ voucher.usageLimit }}</div>
                                    </div>
                                    <div class="voucher-expire">
                                      <div class="small text-muted">Hết hạn:</div>
                                      <div class="small fw-bold text-warning">{{ voucher.expireDate }}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer border-top-0 bg-light" style="flex-shrink: 0;">
                    <div class="d-flex justify-content-between align-items-center w-100">
                      <div class="selected-count">
                        <small class="text-muted">
                          Đã chọn: {{ selectedVouchers.length }}/2 voucher
                        </small>
                      </div>
                      <div>
                        <button type="button" class="btn btn-outline-secondary me-2" @click="clearVoucherSelection">
                          Xóa tất cả
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Hiển thị list voucher đã chọn -->
            <div v-if="selectedVouchers.length > 0" class="mt-3">
              <div class="fw-bold small mb-2 text-primary">
                <i class="fas fa-check-circle me-1"></i>Voucher đã chọn:
              </div>
              <div class="selected-vouchers">
                <div 
                  v-for="voucher in selectedVouchers" 
                  :key="voucher.id"
                  class="selected-voucher-item mb-2"
                >
                  <div class="card border-primary bg-light">
                    <div class="card-body p-2">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="flex-grow-1">
                          <div class="fw-bold text-primary small">{{ voucher.code }} - {{ voucher.name }}</div>
                          <div class="text-muted" style="font-size: 11px;">{{ voucher.discountInfo }}</div>
                        </div>
                        <button 
                          class="btn btn-sm btn-outline-danger border-0 p-1" 
                          @click="removeVoucher(voucher)"
                          title="Xóa voucher"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-muted small mt-1">
              <i class="fas fa-info-circle me-1"></i>
              Tối đa 2 voucher: 1 Giảm giá vận chuyển + 1 Giảm giá sản phẩm
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
                <img :src="item.bookImage || '/src/assets/img/login/frontImg.jpg'" alt="Product" class="me-3"
                  style="width: 80px; height: 100px; object-fit: cover; border-radius: 4px;">
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
            <textarea class="form-control" rows="3" placeholder="Nhập ghi chú cho đơn hàng (tùy chọn)..."
              :value="session?.notes || ''" @blur="handleNotesChange($event.target.value)"></textarea>
            <div class="small text-muted mt-2">
              <i class="fas fa-info-circle me-1"></i>
              Ghi chú sẽ được gửi đến người bán để hỗ trợ giao hàng tốt hơn
            </div>
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
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="small text-muted me-3">Thành tiền</span>
              <span class="fw-bold small">{{ formatPrice(session?.subtotal || 0) }}</span>
            </div>
            <div v-if="(session?.totalVoucherDiscount && session.totalVoucherDiscount > 0) || (session?.totalDiscount && session.totalDiscount > 0)" class="d-flex justify-content-between align-items-center mb-1">
              <span class="small text-muted me-3">Giảm giá voucher</span>
              <span class="fw-bold small text-success">-{{ formatPrice(session?.totalVoucherDiscount || session?.totalDiscount || 0) }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="small text-muted me-3">Phí vận chuyển (Giao hàng tiêu chuẩn)</span>
              <span class="fw-bold small">{{ formatPrice(session?.shippingFee || 20000) }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="small text-muted me-3">Tổng Số Tiền </span>
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
            <input class="form-check-input" type="checkbox" id="agree" checked />
            <label class="form-check-label small" for="agree">
              Bằng việc tiến hành Mua hàng, bạn đã đồng ý với
              <RouterLink to="/policies" class="text-primary">Điều khoản & Điều kiện của BookStation.com</RouterLink>
            </label>
          </div>
        </div>
        <div class="col-12 col-md-6 text-center text-md-end">
          <button class="btn btn-danger px-4 py-2 fw-bold" @click="handleShowPaymentConfirmation">
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Padding để tránh bị che bởi thanh cố định -->
  <div style="height: 120px;"></div>

  <!-- Modal chọn địa chỉ -->
  <div class="modal fade" :class="{ show: showAddressModal }" :style="{ display: showAddressModal ? 'block' : 'none' }"
    tabindex="-1" @click.self="showAddressModal = false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Chọn địa chỉ giao hàng</h5>
          <button type="button" class="btn-close" @click="showAddressModal = false"></button>
        </div>
        <div class="modal-body">
          <div  v-if="addresses.length === 0" class="py-3 text-center text-muted">Bạn chưa có địa chỉ nào</div>
          <div v-else>
            <div v-for="address in addresses" :key="address.id" class="border rounded p-3 mb-2"
              :class="{ 'border-primary': selectedAddress?.id === address.id }" @click="selectAddress(address)"
              style="cursor: pointer;">
              <div class="d-flex">
                <div class="form-check me-2 align-self-start mt-1">
                  <input class="form-check-input" type="radio" name="modalAddress"
                    :checked="selectedAddress?.id === address.id">
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center mb-1">
                    <strong class="me-2">{{ address.recipientName }}</strong>
                    <span class="text-muted">{{ address.phoneNumber }}</span>
                    <span v-if="address.isDefault" class="badge bg-primary ms-2" style="font-size: 10px;">Mặc
                      định</span>
                  </div>
                  <div class="text-muted small">
                    {{ formatFullAddress(address) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- nut them dia chi -->
          <div class="text-center">
            <button class="btn btn-primary btn-sm mt-2" @click="redirectToAddressPage">
              <i class="fas fa-plus me-1"></i>
              Thêm địa chỉ mới
            </button>
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
  <div v-if="showAddressModal || showVoucherList || showPaymentConfirmation || showOrderLimitExceeded || showPolicyPreview" class="modal-backdrop fade show"></div>

  <!-- Payment Confirmation Modal -->
  <div 
    v-if="showPaymentConfirmation"
    class="payment-confirmation-modal"
    @click="showPaymentConfirmation = false"
  >
    <div 
      class="payment-confirmation-content"
      @click.stop
    >
      <div class="confirmation-header">
        <h5 class="mb-0">
          <i class="bi bi-shield-check me-2 text-success"></i>
          Xác nhận đặt hàng
        </h5>
        <button
          type="button"
          class="btn-close"
          @click="showPaymentConfirmation = false"
        ></button>
      </div>
      
      <div class="confirmation-body">
        <div class="order-summary mb-4">
          <h6 class="text-primary mb-3">
            <i class="bi bi-cart-check me-2"></i>
            Thông tin đơn hàng
          </h6>
          
          <div class="summary-row">
            <span>Số sản phẩm:</span>
            <span class="fw-bold">{{ session?.checkoutItems?.length || 0 }} sản phẩm</span>
          </div>
          
          <div class="summary-row">
            <span>Thành tiền:</span>
            <span>{{ formatPrice(session?.subtotal || 0) }}</span>
          </div>
          
          <div v-if="(session?.totalVoucherDiscount && session.totalVoucherDiscount > 0) || (session?.totalDiscount && session.totalDiscount > 0)" class="summary-row">
            <span>Giảm giá voucher:</span>
            <span class="text-success">-{{ formatPrice(session?.totalVoucherDiscount || session?.totalDiscount || 0) }}</span>
          </div>
          
          <div class="summary-row">
            <span>Phí vận chuyển:</span>
            <span>{{ formatPrice(session?.shippingFee || 20000) }}</span>
          </div>
          
          <div class="summary-row total-row">
            <span>Tổng thanh toán:</span>
            <span class="fw-bold text-danger fs-5">{{ formatPrice(session?.totalAmount || 0) }}</span>
          </div>
        </div>
        
        <div class="policy-notice">
          <div class="alert alert-info">
            <div class="d-flex align-items-start">
              <i class="bi bi-info-circle-fill me-2 mt-1"></i>
              <div>
                <strong>Vui lòng đọc kỹ chính sách của BookStation</strong>
                <p class="mb-2 small">
                  Bằng việc xác nhận đặt hàng, bạn đồng ý với các điều khoản và chính sách của chúng tôi.
                </p>
                <span 
                  class="policy-link"
                  @click="showPolicyPreview = true"
                  style="cursor: pointer; user-select: none;"
                >
                  <i class="bi bi-shield-check me-1"></i>
                  Xem chính sách
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="confirmation-actions">
          <button 
            type="button" 
            class="btn btn-outline-secondary me-2"
            @click="showPaymentConfirmation = false"
          >
            <i class="bi bi-arrow-left me-1"></i>
            Quay lại
          </button>
          <button 
            type="button" 
            class="btn btn-danger px-4"
            @click="confirmAndPay"
            :disabled="orderLoading"
          >
            <span v-if="orderLoading">
              <i class="spinner-border spinner-border-sm me-2"></i>
              Đang xử lý...
            </span>
            <span v-else>
              <i class="bi bi-check-circle me-1"></i>
              Xác nhận đặt hàng
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Policy Preview Modal -->
  <PolicyPreviewModal 
    :show="showPolicyPreview" 
    @close="showPolicyPreview = false" 
  />

  <!-- Price Change Popup -->
  <PriceChangePopup
    :show="showPriceChangePopup"
    :priceChanges="priceChanges"
    :changedItems="changedItems"
    :appliedVouchers="appliedVouchers"
    @close="closePriceChangePopup"
    @accept-changes="acceptPriceChanges"
  />

  <!-- Order Limit Exceeded Popup -->
  <div 
    v-if="showOrderLimitExceeded"
    class="modal fade show d-block"
    style="z-index: 1050;"
    @click="showOrderLimitExceeded = false"
  >
    <div 
      class="modal-dialog modal-dialog-centered"
      @click.stop
    >
      <div class="modal-content border-0 shadow">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Vượt quá giới hạn đặt hàng
          </h5>
          <button 
            type="button" 
            class="btn-close btn-close-white" 
            @click="showOrderLimitExceeded = false"
          ></button>
        </div>
        <div class="modal-body">
          <div class="text-center mb-3">
            <i class="bi bi-exclamation-circle text-danger" style="font-size: 3rem;"></i>
          </div>
          <div class="alert alert-warning">
            <h6 class="alert-heading">Thông báo từ hệ thống</h6>
            <p class="mb-2">
              Theo 
              <a 
                href="#" 
                class="text-primary text-decoration-underline fw-bold"
                @click.prevent="showPolicyPreview = true"
              >
                chính sách
              </a> 
              của BookStation, đơn hàng có tổng giá trị vượt quá 
              <strong class="text-danger">100.000.000 ₫</strong> không thể đặt hàng online.
            </p>
            <p class="mb-2">
              Tổng giá trị đơn hàng hiện tại: 
              <strong class="text-danger">{{ formatPrice(session?.totalAmount || 0) }}</strong>
            </p>
            <hr>
            <p class="mb-0 small">
              <i class="bi bi-info-circle me-1"></i>
              Vui lòng đọc kỹ 
              <a 
                href="#" 
                class="text-primary text-decoration-underline"
                @click.prevent="showPolicyPreview = true"
              >
                chính sách đặt hàng
              </a> 
              hoặc liên hệ với chúng tôi để được hỗ trợ.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-outline-secondary" 
            @click="showOrderLimitExceeded = false"
          >
            Đóng
          </button>
          <button 
            type="button" 
            class="btn btn-primary"
            @click="$router.push('/cart')"
          >
            <i class="bi bi-cart me-1"></i>
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    </div>
  </div>

</template>


<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
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
import { calcShippingFee } from '@/services/client/shippingFee.js'
import { getUserAvailableVouchers } from '@/services/admin/order.js'
import PolicyPreviewModal from '@/components/common/PolicyPreviewModal.vue'
import PriceChangePopup from '@/components/common/PriceChangePopup.vue'
import Swal from 'sweetalert2'

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
const userVouchers = ref([])
const voucherLoading = ref(false)

// Payment confirmation states
const showPaymentConfirmation = ref(false)
const showPolicyPreview = ref(false)
const showOrderLimitExceeded = ref(false)

// Price change popup states
const showPriceChangePopup = ref(false)
const priceChanges = ref({
  oldSubtotal: 0,
  newSubtotal: 0,
  oldVoucherDiscount: 0,
  newVoucherDiscount: 0,
  oldTotal: 0,
  newTotal: 0,
  shippingFee: 0
})
const changedItems = ref([])
const appliedVouchers = ref([])

// Lưu snapshot ban đầu của session khi load
const initialSessionSnapshot = ref(null)

const handleShowPaymentConfirmation = async () => {
  // Kiểm tra địa chỉ trước tiên
  if (!selectedAddress.value) {
    showToast('warning', 'Vui lòng chọn địa chỉ giao hàng trước khi thanh toán!')
    return
  }
  
  // Kiểm tra giới hạn 100 triệu trước khi validate
  const totalAmount = session.value?.totalAmount || 0
  const limitAmount = 100000000 // 100 triệu
  
  if (totalAmount > limitAmount) {
    showOrderLimitExceeded.value = true
    return
  }
  
  // Validate trước khi hiển thị popup xác nhận
  const noChanges = await validateWithPriceCheck()
  // Chỉ hiển thị popup xác nhận nếu KHÔNG có thay đổi giá
  // Nếu có thay đổi giá, PriceChangePopup sẽ hiển thị và user quyết định
  if (noChanges) {
    showPaymentConfirmation.value = true
  }
}

// Shipping Fee auto-calc
const updateShippingFee = async () => {
  if (!session.value) return
  const fee = await calcShippingFee(selectedAddress.value, session.value.checkoutItems || [])
  session.value.shippingFee = fee
  await updateSessionShippingFee(fee)
}

let validationTimer = null

const formatPrice = (price) => {
  if (!price) return '0 ₫'
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
}

// Function để validate và kiểm tra thay đổi giá
const validateWithPriceCheck = async () => {
  try {
    // Lưu trữ giá trước khi validate
    const oldSubtotal = session.value?.subtotal || 0
    const oldVoucherDiscount = session.value?.totalVoucherDiscount || session.value?.totalDiscount || 0
    const oldTotal = session.value?.totalAmount || 0
    const oldItems = [...(session.value?.checkoutItems || [])]

    console.log('🔍 Before validate - Current session state:', {
      oldSubtotal,
      oldVoucherDiscount,
      oldTotal,
      oldItems: oldItems.map(item => ({ 
        bookId: item.bookId, 
        unitPrice: item.unitPrice, 
        originalPrice: item.originalPrice,
        totalPrice: item.totalPrice
      }))
    })

    // Thực hiện validate
    await validateSession()

    // So sánh giá sau validate
    const newSubtotal = session.value?.subtotal || 0
    const newVoucherDiscount = session.value?.totalVoucherDiscount || session.value?.totalDiscount || 0
    const newTotal = session.value?.totalAmount || 0
    const newItems = [...(session.value?.checkoutItems || [])]

    console.log('🔍 After validate - New session state:', {
      newSubtotal,
      newVoucherDiscount,
      newTotal,
      newItems: newItems.map(item => ({ 
        bookId: item.bookId, 
        unitPrice: item.unitPrice, 
        originalPrice: item.originalPrice,
        totalPrice: item.totalPrice
      }))
    })

    // Kiểm tra xem có thay đổi giá không - so với lần validate trước
    const hasSubtotalChange = Math.abs(oldSubtotal - newSubtotal) > 0
    const hasVoucherChange = Math.abs(oldVoucherDiscount - newVoucherDiscount) > 0
    const hasTotalChange = Math.abs(oldTotal - newTotal) > 0

    // Kiểm tra thay đổi giá từng sản phẩm
    let hasItemPriceChange = false
    const itemChanges = []
    
    oldItems.forEach(oldItem => {
      const newItem = newItems.find(item => item.bookId === oldItem.bookId)
      if (newItem) {
        const unitPriceChanged = Math.abs(oldItem.unitPrice - newItem.unitPrice) > 0
        const totalPriceChanged = Math.abs(oldItem.totalPrice - newItem.totalPrice) > 0
        
        console.log(`🔍 Item comparison for ${newItem.bookTitle}:`, {
          oldUnitPrice: oldItem.unitPrice,
          newUnitPrice: newItem.unitPrice,
          unitPriceChanged,
          oldTotalPrice: oldItem.totalPrice,
          newTotalPrice: newItem.totalPrice,
          totalPriceChanged,
          isFlashSale: newItem.isFlashSale,
          originalPrice: newItem.originalPrice
        })
        
        if (unitPriceChanged || totalPriceChanged) {
          hasItemPriceChange = true
          itemChanges.push({
            bookId: newItem.bookId,
            bookTitle: newItem.bookTitle,
            bookImage: newItem.bookImage,
            quantity: newItem.quantity,
            oldUnitPrice: oldItem.unitPrice,
            newUnitPrice: newItem.unitPrice,
            oldTotalPrice: oldItem.totalPrice,
            newTotalPrice: newItem.totalPrice,
            changeReason: newItem.isFlashSale ? 'Flash Sale' : 
                         newItem.unitPrice < oldItem.unitPrice ? 'Giảm giá' : 'Tăng giá'
          })
        }
      }
    })

    console.log('🔍 Price change detection:', {
      hasSubtotalChange,
      hasVoucherChange,
      hasTotalChange,
      hasItemPriceChange,
      itemChanges: itemChanges.length
    })

    // Nếu có BẤT KỲ thay đổi nào thì hiển thị popup
    if (hasSubtotalChange || hasVoucherChange || hasTotalChange || hasItemPriceChange) {
      console.log('🚨 PRICE CHANGES DETECTED! Details:', {
        oldSubtotal, newSubtotal, subtotalDiff: newSubtotal - oldSubtotal,
        oldVoucherDiscount, newVoucherDiscount, voucherDiff: newVoucherDiscount - oldVoucherDiscount,
        oldTotal, newTotal, totalDiff: newTotal - oldTotal,
        itemChanges
      })

      // Cập nhật dữ liệu cho popup
      priceChanges.value = {
        oldSubtotal,
        newSubtotal,
        oldVoucherDiscount,
        newVoucherDiscount,
        oldTotal,
        newTotal,
        shippingFee: session.value?.shippingFee || 20000
      }
      changedItems.value = itemChanges
      appliedVouchers.value = session.value?.selectedVouchers || selectedVouchers.value

      // Hiển thị popup thông báo thay đổi
      showPriceChangePopup.value = true
      console.log('🚨 Showing PriceChangePopup due to price changes')
      return false // Có thay đổi giá
    }

    console.log('✅ No price changes detected')
    return true // Không có thay đổi giá
  } catch (err) {
    console.error('❌ Error in validateWithPriceCheck:', err)
    // Vẫn hiển thị validation errors nếu có lỗi khác
    const errorMessage = err.response?.data?.message || err.message
    if (errorMessage && errorMessage.includes('❌')) {
      const errors = errorMessage.replace('❌ Có lỗi khi kiểm tra đơn hàng: ', '').split('; ')
      validationErrors.value = errors.filter(e => e.trim())
    } else {
      validationErrors.value = [errorMessage || 'Có lỗi khi kiểm tra đơn hàng']
    }
    return false
  }
}

// Function để force validate với snapshot ban đầu (test mục đích)
const validateWithInitialSnapshot = async () => {
  console.log('🧪 validateWithInitialSnapshot triggered')
  
  if (!initialSessionSnapshot.value) {
    console.warn('⚠️ No initial snapshot available')
    return await validateWithPriceCheck()
  }

  try {
    console.log('🔍 Force validate with initial snapshot')
    
    // Thực hiện validate
    await validateSession()

    // So sánh với snapshot ban đầu
    const currentSubtotal = session.value?.subtotal || 0
    const currentVoucherDiscount = session.value?.totalVoucherDiscount || 0
    const currentTotal = session.value?.totalAmount || 0
    const currentItems = session.value?.checkoutItems || []

    const oldSubtotal = initialSessionSnapshot.value.subtotal
    const oldVoucherDiscount = initialSessionSnapshot.value.totalVoucherDiscount
    const oldTotal = initialSessionSnapshot.value.totalAmount

    console.log('🔍 Comparing with initial snapshot:', {
      initial: {
        baselineSubtotal: initialSessionSnapshot.value.subtotal,
        currentSubtotal: initialSessionSnapshot.value.originalSubtotal,
        baselineTotal: initialSessionSnapshot.value.totalAmount,
        currentTotal: initialSessionSnapshot.value.originalTotalAmount,
        totalVoucherDiscount: initialSessionSnapshot.value.totalVoucherDiscount,
        items: initialSessionSnapshot.value.checkoutItems.map(item => ({
          bookId: item.bookId,
          baselinePrice: item.unitPrice,
          currentPrice: item.currentUnitPrice,
          originalPrice: item.originalPrice,
          isFlashSale: item.isFlashSale
        }))
      },
      current: { 
        currentSubtotal, 
        currentVoucherDiscount, 
        currentTotal,
        items: currentItems.map(item => ({
          bookId: item.bookId,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          originalPrice: item.originalPrice,
          isFlashSale: item.isFlashSale
        }))
      }
    })

    // Kiểm tra thay đổi - so sánh baseline vs current  
    const hasSubtotalChange = Math.abs(oldSubtotal - currentSubtotal) > 0
    const hasVoucherChange = Math.abs(oldVoucherDiscount - currentVoucherDiscount) > 0
    const hasTotalChange = Math.abs(oldTotal - currentTotal) > 0

    // Kiểm tra thay đổi từng item - so sánh baseline vs current
    const itemChanges = []
    initialSessionSnapshot.value.checkoutItems.forEach(oldItem => {
      const currentItem = currentItems.find(item => item.bookId === oldItem.bookId)
      if (currentItem) {
        // So sánh baseline price (originalPrice cho flash sale) vs current price
        const priceChange = Math.abs(oldItem.unitPrice - currentItem.unitPrice) > 0
        
        if (priceChange) {
          itemChanges.push({
            bookId: currentItem.bookId,
            bookTitle: currentItem.bookTitle,
            bookImage: currentItem.bookImage,
            quantity: currentItem.quantity,
            oldUnitPrice: oldItem.unitPrice, // Baseline price (originalPrice nếu flash sale)
            newUnitPrice: currentItem.unitPrice, // Current price (flash sale price)
            changeReason: currentItem.isFlashSale ? 'Flash Sale' : 
                         currentItem.unitPrice < oldItem.unitPrice ? 'Giảm giá' : 'Tăng giá'
          })
          
          console.log(`📊 Item price change detected for ${currentItem.bookTitle}:`, {
            baselinePrice: oldItem.unitPrice,
            currentPrice: currentItem.unitPrice,
            isFlashSale: currentItem.isFlashSale,
            originalPrice: currentItem.originalPrice,
            savings: oldItem.unitPrice - currentItem.unitPrice
          })
        }
      }
    })

    if (hasSubtotalChange || hasVoucherChange || hasTotalChange || itemChanges.length > 0) {
      console.log('🚨 Changes detected compared to initial snapshot!')
      console.log('📊 Price changes details:', {
        hasSubtotalChange,
        hasVoucherChange, 
        hasTotalChange,
        itemChanges: itemChanges.length,
        oldSubtotal,
        currentSubtotal,
        oldTotal,
        currentTotal,
        itemDetails: itemChanges
      })
      
      priceChanges.value = {
        oldSubtotal,
        newSubtotal: currentSubtotal,
        oldVoucherDiscount,
        newVoucherDiscount: currentVoucherDiscount,
        oldTotal,
        newTotal: currentTotal,
        shippingFee: session.value?.shippingFee || 20000
      }
      changedItems.value = itemChanges
      appliedVouchers.value = selectedVouchers.value

      showPriceChangePopup.value = true
      return false
    }

    return true
  } catch (err) {
    console.error('❌ Error in validateWithInitialSnapshot:', err)
    return false
  }
}

// Các function xử lý popup thay đổi giá
const closePriceChangePopup = () => {
  showPriceChangePopup.value = false
  // Quay lại giỏ hàng
  router.push('/cart')
}

const acceptPriceChanges = () => {
  showPriceChangePopup.value = false
  // Sau khi user chấp nhận thay đổi giá, hiển thị popup xác nhận đặt hàng
  showPaymentConfirmation.value = true
  console.log('✅ User accepted price changes, showing payment confirmation')
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

      // Lưu snapshot ban đầu của session để so sánh sau này
      // Đối với flash sale items, tạo baseline để so sánh với giá gốc
      const baselineItems = session.value.checkoutItems?.map(item => {
        // Nếu là flash sale, tính baseline price từ originalPrice
        const baselinePrice = item.isFlashSale ? item.originalPrice : item.unitPrice
        
        return {
          bookId: item.bookId,
          bookTitle: item.bookTitle,
          bookImage: item.bookImage,
          quantity: item.quantity,
          unitPrice: baselinePrice, // Baseline price (originalPrice nếu flash sale)
          totalPrice: baselinePrice * item.quantity,
          originalPrice: item.originalPrice,
          isFlashSale: item.isFlashSale,
          currentUnitPrice: item.unitPrice // Lưu giá hiện tại để reference
        }
      }) || []
      
      // Tính baseline subtotal
      const baselineSubtotal = baselineItems.reduce((sum, item) => sum + item.totalPrice, 0)
      
      initialSessionSnapshot.value = {
        subtotal: baselineSubtotal, // Baseline subtotal (theo originalPrice)
        originalSubtotal: session.value.subtotal, // Subtotal hiện tại từ API
        totalVoucherDiscount: session.value.totalVoucherDiscount || session.value.totalDiscount || 0,
        totalAmount: baselineSubtotal + (session.value.shippingFee || 0) - (session.value.totalVoucherDiscount || session.value.totalDiscount || 0),
        originalTotalAmount: session.value.totalAmount, // Total hiện tại từ API
        checkoutItems: baselineItems
      }

      console.log('📸 Initial snapshot created with baseline prices:', {
        currentSubtotal: session.value.subtotal,
        baselineSubtotal: baselineSubtotal,
        currentTotal: session.value.totalAmount,
        baselineTotal: initialSessionSnapshot.value.totalAmount,
        items: baselineItems.map(item => ({
          bookId: item.bookId,
          baselinePrice: item.unitPrice,
          currentPrice: item.currentUnitPrice,
          originalPrice: item.originalPrice,
          isFlashSale: item.isFlashSale,
          savings: item.isFlashSale ? (item.unitPrice - item.currentUnitPrice) * item.quantity : 0
        }))
      })

      console.log('✅ Latest session loaded with initial snapshot:', {
        sessionId: sessionId.value,
        session: session.value,
        initialSnapshot: initialSessionSnapshot.value,
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

      //Lấy payment method từ session
      if (!session.value.paymentMethod) {
        await updateSessionPaymentMethod('COD')
      }

      // Load vouchers nếu session có selectedVoucherIds
      if (session.value.selectedVoucherIds && session.value.selectedVoucherIds.length > 0) {
        // Ưu tiên sử dụng selectedVouchers từ response nếu có
        if (session.value.selectedVouchers && session.value.selectedVouchers.length > 0) {
          selectedVouchers.value = session.value.selectedVouchers
          console.log('✅ Loaded vouchers from response selectedVouchers:', selectedVouchers.value)
        } else {
          await loadSelectedVouchersFromSession()
        }
      } else {
        // Đảm bảo selectedVouchers được reset nếu session không có voucher
        selectedVouchers.value = []
      }

      // Không cần validate ngay khi load - chỉ validate khi có interaction
      console.log('✅ Session loaded successfully without auto-validation')
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
        
        // Debug voucher discount
        console.log('✅ Session validated:', {
          selectedVoucherIds: session.value.selectedVoucherIds,
          totalVoucherDiscount: session.value.totalVoucherDiscount,
          subtotal: session.value.subtotal,
          totalAmount: session.value.totalAmount
        })
      }
    } else {
      throw new Error('Validation failed')
    }
  } catch (err) {
    console.error('Validation error:', err)
    const errorMessage = err.response?.data?.message || err.message
    
    // Hiển thị popup alert thay vì inline validation errors
    let errorContent = ''
    if (errorMessage && errorMessage.includes('❌')) {
      const errors = errorMessage.replace('❌ Có lỗi khi kiểm tra đơn hàng: ', '').split('; ')
      const filteredErrors = errors.filter(e => e.trim())
      if (filteredErrors.length > 0) {
        errorContent = `
          <div class="text-start">
            <div class="alert alert-danger border-0 mb-3">
              <h6 class="alert-heading mb-2">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Có vấn đề cần kiểm tra
              </h6>
              <ul class="mb-0">
                ${filteredErrors.map(error => `<li>${error}</li>`).join('')}
              </ul>
            </div>
            <div class="text-center">
              <p class="mb-0 text-muted">
                <i class="fas fa-info-circle me-1"></i>
                Vui lòng kiểm tra và sửa các vấn đề trên trước khi tiếp tục
              </p>
            </div>
          </div>
        `
      }
    } else {
      errorContent = `
        <div class="text-center">
          <div class="alert alert-danger border-0 mb-3">
            <h6 class="alert-heading mb-2">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Lỗi kiểm tra đơn hàng
            </h6>
            <p class="mb-0">${errorMessage || 'Có lỗi khi kiểm tra đơn hàng'}</p>
          </div>
        </div>
      `
    }
    
    if (errorContent) {
      await Swal.fire({
        title: '⚠️ Thông báo lỗi',
        html: errorContent,
        icon: 'warning',
        iconColor: '#f39c12',
        confirmButtonText: '🔄 Tôi đã hiểu',
        confirmButtonColor: '#007bff',
        allowOutsideClick: false,
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'btn btn-primary px-4 py-2 fw-bold'
        }
      })
    }
    
    // Vẫn set validation errors để các function khác có thể check
    validationErrors.value = [errorMessage || 'Có lỗi khi kiểm tra đơn hàng']
  }
}

const setupValidationTimer = () => {
  // Đã loại bỏ timer validation định kỳ
  // Chỉ validate khi có interaction từ user
  console.log('🔄 Validation timer disabled - only validate on user interaction')
}

const confirmAndPay = async () => {
  // Kiểm tra giới hạn 100 triệu trước khi xử lý thanh toán
  const totalAmount = session.value?.totalAmount || 0
  const limitAmount = 100000000 // 100 triệu
  
  if (totalAmount > limitAmount) {
    showPaymentConfirmation.value = false
    showOrderLimitExceeded.value = true
    return
  }
  
  // Validate một lần nữa trước khi thanh toán để đảm bảo giá không thay đổi
  const noChanges = await validateWithPriceCheck()
  
  if (noChanges) {
    // Không có thay đổi giá, tiến hành thanh toán
    showPaymentConfirmation.value = false
    await processPayment()
  } else {
    // Có thay đổi giá, đóng popup xác nhận và hiển thị PriceChangePopup
    showPaymentConfirmation.value = false
    // PriceChangePopup đã được hiển thị bởi validateWithPriceCheck()
  }
}

const processPayment = async () => {
  if (!agreed.value) {
    showToast('warning', 'Vui lòng đồng ý với điều khoản và điều kiện!')
    return
  }
  if (!selectedAddress.value) {
    showToast('warning', 'Vui lòng chọn địa chỉ giao hàng trước khi thanh toán!')
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

    // Đảm bảo có phương thức thanh toán, mặc định là COD
    if (!session.value.paymentMethod) {
      await updateSessionPaymentMethod('COD')
    } else if (session.value.paymentMethod === 'VNPAY') {
      const response = await createVNPayPaymentUrl(sessionId.value, userId)
      if (response.data.data) {
        const paymentUrl = response.data.data
        window.location.href = paymentUrl
      } else {
        showToast('error', 'Có lỗi khi thanh toán bằng VNPay, vui lòng thử lại.')
      }
      return
    }
    // Tạo đơn hàng từ session với validation giá
    console.log('📝 Creating order from session...')
    console.log('🔍 Session data before creating order:', session.value)
    console.log('🔍 Session checkoutItems:', session.value?.checkoutItems)
    
    const response = await createOrderFromSession(sessionId.value, userId, session.value)

    if (response.status === 201 && response.data) {
        const orderId = response.data.data
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

    // Xử lý lỗi 409 - giá không khớp
    if (err.response?.status === 409) {
      await Swal.fire({
        title: '⚠️ Giá sản phẩm đã thay đổi!',
        html: `
          <div class="text-start">
            <div class="alert alert-danger border-0 mb-3">
              <h6 class="alert-heading mb-2">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Thông báo quan trọng
              </h6>
              <p class="mb-0">${errorMessage}</p>
            </div>
            
            <div class="bg-light p-3 rounded mb-3">
              <strong><i class="fas fa-info-circle me-2 text-primary"></i>Tại sao giá thay đổi?</strong>
              <ul class="mb-0 mt-2 small">
                <li>🔥 <strong>Flash sale:</strong> Chương trình khuyến mãi có thể đã bắt đầu hoặc kết thúc</li>
                <li>💰 <strong>Điều chỉnh giá:</strong> Admin cập nhật giá bán để phù hợp với thị trường</li>
                <li>📦 <strong>Tình trạng kho:</strong> Số lượng tồn kho ảnh hưởng đến chính sách giá</li>
                <li>🎯 <strong>Chính sách bán:</strong> Áp dụng chính sách giá mới</li>
              </ul>
            </div>
            
            <div class="text-center">
              <p class="mb-2 text-muted">
                <i class="fas fa-sync-alt me-1"></i>
                Nhấn <strong>"Cập nhật giá mới"</strong> để xem giá hiện tại và tiếp tục mua hàng
              </p>
            </div>
          </div>
        `,
        icon: 'warning',
        iconColor: '#f39c12',
        confirmButtonText: '🔄 Cập nhật giá mới',
        confirmButtonColor: '#007bff',
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'btn btn-primary px-4 py-2 fw-bold'
        }
      });
      
      // Reload page để cập nhật giá mới
      window.location.reload();
      return;
    }

    if (err.response?.status === 400) {
      if (errorMessage.includes('hết hàng')) {
        showToast('error', 'Một số sản phẩm đã hết hàng. Vui lòng cập nhật lại giỏ hàng.')
      } else if (errorMessage.includes('voucher') || errorMessage.includes('Voucher')) {
        showToast('error', 'Voucher có vấn đề. ' + errorMessage)
      } else if (errorMessage.includes('hết hạn')) {
        showToast('error', 'Phiên thanh toán đã hết hạn. Vui lòng tạo lại từ giỏ hàng.')
        router.push('/cart')
      } else {
        showToast('error', errorMessage || 'Có lỗi khi tạo đơn hàng.')
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

const applyCoupon = async () => {
  if (!couponCode.value.trim()) {
    showToast('warning', 'Vui lòng nhập mã khuyến mãi')
    return
  }
  // TODO: Implement coupon application logic
  showToast('info', 'Chức năng áp dụng mã khuyến mãi sẽ được triển khai sớm')
  await updateShippingFee()
  
  // Validate sau khi áp dụng coupon
  await validateWithPriceCheck()
  // PriceChangePopup sẽ tự động hiển thị nếu có thay đổi giá
}

const selectAddress = async (address) => {
  selectedAddress.value = address
  showAddressModal.value = false

  // Cập nhật địa chỉ vào session
  if (sessionId.value && address?.id) {
    await updateSessionAddress(address.id)
  }
  await updateShippingFee()
  
  // Validate sau khi thay đổi địa chỉ
  await validateWithPriceCheck()
  // PriceChangePopup sẽ tự động hiển thị nếu có thay đổi giá
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

// Function để cập nhật phương thức thanh toán với validate
const handlePaymentMethodChange = async (paymentMethod) => {
  await updateSessionPaymentMethod(paymentMethod)
  // Validate sau khi thay đổi phương thức thanh toán
  await validateWithPriceCheck()
  // PriceChangePopup sẽ tự động hiển thị nếu có thay đổi giá
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
      // showToast('success', 'Phương thức thanh toán đã được cập nhật')
    }
  } catch (error) {
    console.error('❌ Error updating payment method:', error)
    // showToast('error', 'Không thể cập nhật phương thức thanh toán')
  }
}

// Function để cập nhật voucher
const updateSessionVouchers = async (voucherIds) => {
  try {
    const userId = getUserId()
    if (!sessionId.value || !userId) {
      console.warn('⚠️ Missing sessionId or userId for voucher update')
      return
    }

    // QUAN TRỌNG: Phải truyền items theo document
    const updateData = {
      items: getCurrentSessionItems(),
      selectedVoucherIds: voucherIds
    }

    console.log('📝 Updating session vouchers:', {
      sessionId: sessionId.value,
      userId,
      voucherIds,
      itemsCount: updateData.items?.length || 0
    })
    
    const response = await updateCheckoutSession(sessionId.value, userId, updateData)

    if (response.status === 200 && response.data?.data) {
      const previousTotal = session.value?.totalAmount || 0
      session.value = response.data.data
      
      console.log('✅ Session updated with vouchers:', {
        voucherIds,
        totalVoucherDiscount: session.value.totalVoucherDiscount,
        previousTotal,
        newTotal: session.value.totalAmount,
        savings: previousTotal - session.value.totalAmount
      })
      
      // Cập nhật localStorage để đồng bộ
      localStorage.setItem('checkoutSession', JSON.stringify(session.value))
      
      showToast('success', 'Voucher đã được cập nhật')
      return true
    } else {
      console.error('❌ Invalid response from updateCheckoutSession:', response)
      throw new Error('Invalid response from server')
    }
  } catch (error) {
    console.error('❌ Error updating vouchers:', error)
    showToast('error', `Không thể cập nhật voucher: ${error.message}`)
    throw error
  }
}

// Function xử lý thay đổi notes với validate
const handleNotesChange = async (notes) => {
  await updateSessionNotes(notes)
  // Validate sau khi thay đổi notes (tùy chọn, có thể bỏ vì notes không ảnh hưởng giá)
  // await validateWithPriceCheck()
}

// Function xử lý validate thủ công
const handleManualValidation = async () => {
  console.log('🔧 Manual validation triggered')
  debugSessionInfo()
  await validateWithPriceCheck()
}

// Function để debug session info
const debugSessionInfo = () => {
  console.log('🔍 === FULL SESSION DEBUG INFO ===')
  console.log('📋 Current session:', session.value)
  console.log('📸 Initial snapshot:', initialSessionSnapshot.value)
  
  if (session.value?.checkoutItems) {
    console.log('📦 Current items details:')
    session.value.checkoutItems.forEach((item, index) => {
      console.log(`   Item ${index + 1}:`, {
        bookId: item.bookId,
        title: item.bookTitle,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        originalPrice: item.originalPrice,
        isFlashSale: item.isFlashSale,
        savings: item.isFlashSale ? (item.originalPrice - item.unitPrice) * item.quantity : 0
      })
    })
  }
  
  console.log('💰 Financial breakdown:', {
    subtotal: session.value?.subtotal,
    totalVoucherDiscount: session.value?.totalVoucherDiscount,
    totalDiscount: session.value?.totalDiscount,
    shippingFee: session.value?.shippingFee,
    totalAmount: session.value?.totalAmount
  })
  
  if (initialSessionSnapshot.value) {
    console.log('📊 Baseline vs Current comparison:')
    console.log('   Baseline subtotal:', initialSessionSnapshot.value.subtotal)
    console.log('   Current subtotal:', session.value?.subtotal)
    console.log('   Difference:', (session.value?.subtotal || 0) - initialSessionSnapshot.value.subtotal)
  }
  
  console.log('🔍 === END DEBUG INFO ===')
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

// Function để cập nhật phí ship
const updateSessionShippingFee = async (fee) => {
  try {
    const userId = getUserId()
    if (!sessionId.value || !userId) return

    const updateData = {
      items: getCurrentSessionItems(),
      shippingFee: fee
    }

    console.log('📝 Updating session shipping fee:', updateData)
    const response = await updateCheckoutSession(sessionId.value, userId, updateData)

    if (response.status === 200 && response.data?.data) {
      session.value = response.data.data
      console.log('✅ Shipping fee updated in session')
    }
  } catch (error) {
    console.error('❌ Error updating shipping fee:', error)
  }
}

const loadSelectedVouchersFromSession = async () => {
  try {
    const userId = getUserId()
    if (!userId || !session.value.selectedVoucherIds) return

    // Load all user vouchers to find selected ones
    const response = await getUserAvailableVouchers(userId)
    const userVouchersList = response.data || []
    
    // Find selected vouchers from the list
    selectedVouchers.value = userVouchersList.filter(voucher => 
      session.value.selectedVoucherIds.includes(voucher.id)
    )
    
    console.log('✅ Selected vouchers loaded from session:', selectedVouchers.value)
  } catch (error) {
    console.error('❌ Error loading selected vouchers from session:', error)
  }
}

// Voucher functions
const openVoucherModal = async () => {
  await loadUserVouchers()
  showVoucherList.value = true
}

const loadUserVouchers = async () => {
  try {
    voucherLoading.value = true
    const userId = getUserId()
    if (!userId) return

    const response = await getUserAvailableVouchers(userId)
    userVouchers.value = response.data || []
    updateFilteredVouchers()
    
    console.log('✅ User vouchers loaded:', userVouchers.value)
  } catch (error) {
    console.error('❌ Error loading user vouchers:', error)
    userVouchers.value = []
  } finally {
    voucherLoading.value = false
  }
}

const updateFilteredVouchers = () => {
  if (!voucherSearch.value.trim()) {
    filteredVouchers.value = userVouchers.value
  } else {
    const searchTerm = voucherSearch.value.toLowerCase()
    filteredVouchers.value = userVouchers.value.filter(voucher => {
      const code = (voucher.code || '').toString().toLowerCase()
      const name = (voucher.name || '').toString().toLowerCase()
      const description = (voucher.description || '').toString().toLowerCase()
      return code.includes(searchTerm) || name.includes(searchTerm) || description.includes(searchTerm)
    })
  }
}

const isVoucherSelected = (voucherId) => {
  return selectedVouchers.value.some(v => v.id === voucherId)
}

const canSelectVoucher = (voucher) => {
  if (isVoucherSelected(voucher.id)) return true
  if (selectedVouchers.value.length >= 2) return false

  // Kiểm tra giá trị đơn hàng tối thiểu - QUAN TRỌNG
  const currentOrderValue = session.value?.subtotal || 0
  console.log('🔍 Checking voucher conditions:', {
    voucherCode: voucher.code,
    minimumOrderValue: voucher.minimumOrderValue,
    currentOrderValue,
    isEligible: !voucher.minimumOrderValue || currentOrderValue >= voucher.minimumOrderValue
  })
  
  if (voucher.minimumOrderValue && currentOrderValue < voucher.minimumOrderValue) {
    return false
  }

  // Kiểm tra số lượng sử dụng còn lại
  if (voucher.remainingUses <= 0) {
    return false
  }

  const selectedShippingVouchers = selectedVouchers.value.filter(v => 
    v.categoryVi && v.categoryVi.includes('vận chuyển')
  )
  const selectedProductVouchers = selectedVouchers.value.filter(v => 
    v.categoryVi && v.categoryVi.includes('sản phẩm')
  )

  if (voucher.categoryVi && voucher.categoryVi.includes('vận chuyển')) {
    return selectedShippingVouchers.length === 0
  } else {
    return selectedProductVouchers.length === 0
  }
}

const getVoucherStatusMessage = (voucher) => {
  const currentOrderValue = session.value?.subtotal || 0

  // Kiểm tra giá trị đơn hàng tối thiểu
  if (voucher.minimumOrderValue && currentOrderValue < voucher.minimumOrderValue) {
    const missing = voucher.minimumOrderValue - currentOrderValue
    return `Thiếu ${formatPrice(missing)} để đạt đơn tối thiểu`
  }

  // Kiểm tra số lượng sử dụng
  if (voucher.remainingUses <= 0) {
    return 'Đã hết lượt sử dụng'
  }

  // Kiểm tra đã chọn đủ 2 voucher
  if (selectedVouchers.value.length >= 2) {
    return 'Đã chọn đủ 2 voucher'
  }

  // Kiểm tra loại voucher
  const selectedShippingVouchers = selectedVouchers.value.filter(v => 
    v.categoryVi && v.categoryVi.includes('vận chuyển')
  )
  const selectedProductVouchers = selectedVouchers.value.filter(v => 
    v.categoryVi && v.categoryVi.includes('sản phẩm')
  )

  if (voucher.categoryVi && voucher.categoryVi.includes('vận chuyển')) {
    if (selectedShippingVouchers.length > 0) {
      return 'Đã chọn voucher vận chuyển'
    }
  } else if (voucher.categoryVi && voucher.categoryVi.includes('sản phẩm')) {
    if (selectedProductVouchers.length > 0) {
      return 'Đã chọn voucher sản phẩm'
    }
  }

  return 'Không thể chọn voucher'
}

const toggleVoucherSelection = async (voucher) => {
  // Kiểm tra nếu voucher đã được chọn thì cho phép bỏ chọn
  if (isVoucherSelected(voucher.id)) {
    const index = selectedVouchers.value.findIndex(v => v.id === voucher.id)
    selectedVouchers.value.splice(index, 1)
    
    // Gọi API cập nhật ngay lập tức
    try {
      const voucherIds = selectedVouchers.value.map(v => v.id)
      await updateSessionVouchers(voucherIds)
      console.log('✅ Voucher removed:', voucher.code)
    } catch (error) {
      console.error('❌ Error removing voucher:', error)
      // Revert the change if API call fails
      selectedVouchers.value.push(voucher)
      showToast('error', 'Không thể bỏ voucher')
    }
    return
  }

  // Kiểm tra các điều kiện để chọn voucher mới
  const currentOrderValue = session.value?.subtotal || 0

  // Kiểm tra giá trị đơn hàng tối thiểu
  if (voucher.minimumOrderValue && currentOrderValue < voucher.minimumOrderValue) {
    const requiredAmount = voucher.minimumOrderValue
    const currentAmount = currentOrderValue
    showToast('warning', `Voucher "${voucher.code}" yêu cầu đơn hàng tối thiểu ${formatPrice(requiredAmount)}. Đơn hàng hiện tại: ${formatPrice(currentAmount)}`)
    return
  }

  // Kiểm tra số lượng sử dụng
  if (voucher.remainingUses <= 0) {
    showToast('warning', `Voucher "${voucher.code}" đã hết lượt sử dụng`)
    return
  }

  // Kiểm tra đã chọn đủ 2 voucher
  if (selectedVouchers.value.length >= 2) {
    showToast('warning', 'Bạn chỉ có thể chọn tối đa 2 voucher')
    return
  }

  // Kiểm tra loại voucher
  const selectedShippingVouchers = selectedVouchers.value.filter(v => 
    v.categoryVi && v.categoryVi.includes('vận chuyển')
  )
  const selectedProductVouchers = selectedVouchers.value.filter(v => 
    v.categoryVi && v.categoryVi.includes('sản phẩm')
  )

  if (voucher.categoryVi && voucher.categoryVi.includes('vận chuyển')) {
    if (selectedShippingVouchers.length > 0) {
      showToast('warning', 'Bạn đã chọn voucher giảm giá vận chuyển rồi')
      return
    }
  } else if (voucher.categoryVi && voucher.categoryVi.includes('sản phẩm')) {
    if (selectedProductVouchers.length > 0) {
      showToast('warning', 'Bạn đã chọn voucher giảm giá sản phẩm rồi')
      return
    }
  }

  // Nếu tất cả điều kiện OK, thêm voucher
  selectedVouchers.value.push(voucher)

  // Gọi API cập nhật ngay lập tức
  try {
    const voucherIds = selectedVouchers.value.map(v => v.id)
    await updateSessionVouchers(voucherIds)
    console.log('✅ Voucher added:', voucher.code)
    showToast('success', `Đã thêm voucher "${voucher.code}"`)
  } catch (error) {
    console.error('❌ Error adding voucher:', error)
    // Revert the change if API call fails
    selectedVouchers.value.splice(selectedVouchers.value.length - 1, 1)
    showToast('error', 'Không thể áp dụng voucher. Vui lòng thử lại.')
  }
}

const removeVoucher = async (voucher) => {
  const index = selectedVouchers.value.findIndex(v => v.id === voucher.id)
  if (index > -1) {
    selectedVouchers.value.splice(index, 1)
    const voucherIds = selectedVouchers.value.map(v => v.id)
    await updateSessionVouchers(voucherIds)
    
    // Validate ngay lập tức để cập nhật state và kiểm tra thay đổi giá
    await validateWithPriceCheck()
    // PriceChangePopup sẽ tự động hiển thị nếu có thay đổi giá
  }
}

const clearVoucherSelection = async () => {
  selectedVouchers.value = []
  await updateSessionVouchers([])
  
  // Validate ngay lập tức để cập nhật state và kiểm tra thay đổi giá
  await validateWithPriceCheck()
  // PriceChangePopup sẽ tự động hiển thị nếu có thay đổi giá
}

const applySelectedVouchers = async () => {
  try {
    // Hiển thị loading state
    const applyButton = document.querySelector('.modal-footer .btn-primary')
    if (applyButton) {
      applyButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Đang áp dụng...'
      applyButton.disabled = true
    }

    const voucherIds = selectedVouchers.value.map(v => v.id)
    await updateSessionVouchers(voucherIds)
    
    // Validate ngay lập tức để cập nhật state và kiểm tra thay đổi giá
    const noChanges = await validateWithPriceCheck()
    
    // Luôn đóng modal voucher sau khi áp dụng
    showVoucherList.value = false
    
    if (noChanges) {
      // Không có thay đổi giá, chỉ hiển thị toast thành công
      showToast('success', `Đã áp dụng ${selectedVouchers.value.length} voucher thành công`)
    }
    // Nếu có thay đổi giá, PriceChangePopup sẽ tự động hiển thị
    
    // Log để debug
    console.log('✅ Applied vouchers successfully:', {
      voucherIds,
      selectedVouchers: selectedVouchers.value.map(v => v.code)
    })
  } catch (error) {
    console.error('❌ Error applying vouchers:', error)
    showToast('error', 'Không thể áp dụng voucher. Vui lòng thử lại.')
  } finally {
    // Reset button state
    const applyButton = document.querySelector('.modal-footer .btn-primary')
    if (applyButton) {
      applyButton.innerHTML = `Áp dụng (${selectedVouchers.value.length})`
      applyButton.disabled = false
    }
  }
}

// Computed để reactive update filteredVouchers
const filteredVouchersComputed = computed(() => {
  if (!voucherSearch.value.trim()) {
    return userVouchers.value
  } else {
    const searchTerm = voucherSearch.value.toLowerCase()
    return userVouchers.value.filter(voucher => {
      const code = (voucher.code || '').toString().toLowerCase()
      const name = (voucher.name || '').toString().toLowerCase()
      const description = (voucher.description || '').toString().toLowerCase()
      return code.includes(searchTerm) || name.includes(searchTerm) || description.includes(searchTerm)
    })
  }
})

// Watch voucher search
watch(voucherSearch, updateFilteredVouchers)

const toggleVoucher = (voucher) => {
  const index = selectedVouchers.value.findIndex(v => v.code === voucher.code)
  if (index > -1) {
    selectedVouchers.value.splice(index, 1)
  } else {
    selectedVouchers.value.push(voucher)
  }
  // TODO: Update session vouchers when implemented
  updateShippingFee()
}

const selectGift = () => {
  showToast('info', 'Chức năng chọn quà sẽ được triển khai sớm')
}

const redirectToAddressPage = () => {
  router.push('/profile/addresses')
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
    router.push('/auth')
    return
  }

  console.log('🚀 Loading checkout page for user:', userId)

  // Load addresses và checkout session song song
  await Promise.all([
    loadAddresses(),
    loadLatestSession(userId)
  ])

  await updateShippingFee()
  setupValidationTimer()
})

onUnmounted(() => {
  // Dọn dẹp timer nếu có
  if (validationTimer) {
    clearInterval(validationTimer)
  }
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

/* Policy link styling */
.alert a.text-primary {
  transition: all 0.2s ease;
}

.alert a.text-primary:hover {
  color: #0056b3 !important;
  text-decoration: none !important;
  background-color: rgba(13, 110, 253, 0.1);
  padding: 1px 4px;
  border-radius: 3px;
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

/* New voucher modal styles */
.voucher-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent !important;
}

.voucher-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
  border-left-color: #007bff !important;
}

.voucher-card.selected {
  border-left-color: #28a745 !important;
  background-color: #f8f9fa;
}

.voucher-card.selected .card {
  border-color: #28a745 !important;
  background-color: rgba(40, 167, 69, 0.05);
}

.voucher-card.disabled {
  opacity: 0.6;
  cursor: not-allowed !important;
  pointer-events: none;
  position: relative;
}

.voucher-card.disabled .card {
  background-color: #f8f9fa;
  border-color: #dee2e6 !important;
}

.voucher-card.disabled .voucher-content {
  color: #6c757d;
}

/* Thêm overlay cho voucher disabled */
.voucher-card.disabled::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
  border-radius: 0.375rem;
}

.voucher-content {
  transition: all 0.2s ease;
}

.voucher-card:hover .voucher-content {
  transform: translateX(4px);
}

.voucher-name {
  font-size: 14px;
  margin-bottom: 4px;
}

.voucher-description {
  font-size: 12px;
  line-height: 1.3;
}

.voucher-badges .badge {
  font-size: 10px;
  padding: 4px 8px;
}

.voucher-usage {
  font-size: 11px;
}

.voucher-expire {
  font-size: 11px;
}

.selected-voucher-item {
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.selected-vouchers {
  max-height: 200px;
  overflow-y: auto;
}

/* Custom scrollbar for voucher list */
.voucher-list {
  max-height: none; /* Remove fixed height constraint */
  overflow-y: visible; /* Let modal-body handle scrolling */
  padding-right: 4px;
}

/* Modal body scrolling for voucher modal */
.modal-body {
  overflow-y: auto !important;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
}

/* Custom scrollbar for modal body */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.voucher-list::-webkit-scrollbar {
  width: 6px;
}

.voucher-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.voucher-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.voucher-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Form check input styling */
.voucher-card .form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

.voucher-card .form-check-input:disabled {
  opacity: 0.5;
}

/* Modal animation */
.modal.show {
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-dialog {
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* SweetAlert2 custom styling */
:deep(.swal-wide) {
  width: 600px !important;
  max-width: 90vw !important;
}

:deep(.swal-wide .swal2-html-container) {
  font-size: 14px;
  line-height: 1.5;
}

:deep(.swal-wide .alert) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.swal-wide .bg-light) {
  background-color: #f8f9fa !important;
  border: 1px solid #e9ecef;
}

:deep(.swal-wide ul li) {
  margin-bottom: 6px;
}

:deep(.swal-wide .btn) {
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

:deep(.swal-wide .btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Payment Confirmation Modal Styles */
.payment-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-out;
}

.payment-confirmation-content {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideInUp 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.confirmation-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  border-bottom: 2px solid #dc3545;
  display: flex;
  justify-content: between;
  align-items: center;
}

.confirmation-header h5 {
  color: #333;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.confirmation-header .btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  margin-left: 1rem;
}

.confirmation-header .btn-close:hover {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  transform: scale(1.1);
}

.confirmation-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.order-summary {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  border-left: 4px solid #dc3545;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-row:last-child {
  border-bottom: none;
}

.total-row {
  border-top: 2px solid #dc3545;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-size: 1.1rem;
}

.policy-notice .alert {
  border-radius: 10px;
  border: 1px solid #b3d7ff;
  background: linear-gradient(135deg, #e7f3ff 0%, #f0f8ff 100%);
}

.policy-link {
  color: #dc3545;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.policy-link:hover {
  color: #fff;
  background: #dc3545;
  text-decoration: none;
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.confirmation-actions {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.confirmation-actions .btn {
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 140px;
}

.confirmation-actions .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.confirmation-actions .btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #a71d2a 100%);
  border-color: #dc3545;
}

.confirmation-actions .btn-danger:hover {
  background: linear-gradient(135deg, #a71d2a 0%, #dc3545 100%);
  border-color: #a71d2a;
}

.confirmation-actions .btn-outline-secondary:hover {
  background: #6c757d;
  border-color: #6c757d;
  color: white;
}

/* Custom scrollbar for confirmation modal */
.confirmation-body::-webkit-scrollbar {
  width: 6px;
}

.confirmation-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.confirmation-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #dc3545 0%, #a71d2a 100%);
  border-radius: 10px;
}

.confirmation-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #a71d2a 0%, #dc3545 100%);
}

/* Responsive for confirmation modal */
@media (max-width: 576px) {
  .payment-confirmation-content {
    margin: 0.5rem;
    max-width: calc(100% - 1rem);
  }
  
  .confirmation-header {
    padding: 1rem;
  }
  
  .confirmation-body {
    padding: 1rem;
  }
  
  .order-summary {
    padding: 1rem;
  }
  
  .confirmation-actions {
    flex-direction: column;
  }
  
  .confirmation-actions .btn {
    min-width: auto;
    width: 100%;
  }
}
</style>
