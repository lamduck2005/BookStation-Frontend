<template>
  <div class="container-fluid py-3">
    <div class="row justify-content-center">
      <div class="col-12 col-xl-9">
        <!-- Địa chỉ giao hàng -->
        <div class="card mb-3">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">Địa chỉ giao hàng</h6>
          </div>
          <div class="card-body py-3">
            <!-- Địa chỉ đầu tiên -->
            <div class="d-flex align-items-start mb-2 p-2 border rounded">
              <div class="form-check me-2 mt-1">
                <input class="form-check-input" type="radio" name="address" id="address1" checked>
                <label class="form-check-label" for="address1"></label>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="small">
                    <strong>Vu Linh</strong> | phố 31 đồng da, Phường Bến Nghé, Quận 1, Hồ Chí Minh, VN | 0346447583
                  </div>
                  <button class="btn btn-outline-primary btn-sm" style="font-size: 11px; padding: 2px 8px;">Sửa</button>
                </div>
              </div>
            </div>

            <!-- Địa chỉ thứ hai -->
            <div class="d-flex align-items-start mb-2 p-2 border rounded">
              <div class="form-check me-2 mt-1">
                <input class="form-check-input" type="radio" name="address" id="address2">
                <label class="form-check-label" for="address2"></label>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="small">
                    <strong>linh vugk</strong> | phố 31 đồng da, Phường Bạch Mai, Quận Hai Bà Trưng, Hà Nội, VN | 0989898990
                  </div>
                  <div>
                    <button class="btn btn-outline-primary btn-sm me-1" style="font-size: 11px; padding: 2px 8px;">Sửa</button>
                    <button class="btn btn-outline-danger btn-sm" style="font-size: 11px; padding: 2px 8px;">Xóa</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Địa chỉ thứ ba -->
            <div class="d-flex align-items-start mb-2 p-2 border rounded">
              <div class="form-check me-2 mt-1">
                <input class="form-check-input" type="radio" name="address" id="address3">
                <label class="form-check-label" for="address3"></label>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="small">
                    <strong>linh vu</strong> | td, tggl, Appenzell Innerrhoden, trú, CH | 0989898990
                  </div>
                  <div>
                    <button class="btn btn-outline-primary btn-sm me-1" style="font-size: 11px; padding: 2px 8px;">Sửa</button>
                    <button class="btn btn-outline-danger btn-sm" style="font-size: 11px; padding: 2px 8px;">Xóa</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Thêm địa chỉ mới -->
            <div class="d-flex align-items-center p-2 border rounded border-dashed">
              <div class="form-check me-2">
                <i class="fas fa-plus text-danger" style="font-size: 12px;"></i>
              </div>
              <div>
                <button class="btn btn-link text-danger p-0 text-decoration-none small">
                  Giao hàng đến địa chỉ khác
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Phương thức vận chuyển -->
        <div class="card mb-3">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">Phương thức vận chuyển</h6>
          </div>
          <div class="card-body py-3">
            <div class="d-flex align-items-center p-2 border rounded">
              <div class="form-check me-2">
                <input class="form-check-input" type="radio" name="shipping" id="shipping1" checked>
                <label class="form-check-label" for="shipping1"></label>
              </div>
              <div>
                <strong class="small">Giao hàng tiêu chuẩn: 20.000 đ</strong>
                <div class="text-muted" style="font-size: 12px;">Dự kiến giao: Thứ Tư - 02/07</div>
              </div>
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

        <!-- Thông tin khác -->
        <div class="card mb-3">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">Thông tin khác</h6>
          </div>
          <div class="card-body py-3">
            <div class="form-check mb-2">
              <input class="form-check-input" type="checkbox" id="note">
              <label class="form-check-label small" for="note">
                Ghi chú
              </label>
            </div>
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" id="invoice">
              <label class="form-check-label small" for="invoice">
                Xuất hóa đơn GTGT 
                <span class="text-primary ms-1" style="font-size: 11px;">Chi tiết</span>
              </label>
            </div>
            <div class="text-danger small">
              *Từ ngày 01/11/2020, Công ty BookStation không giải quyết việc xuất lại hóa đơn cho các trường hợp Quý khách không đăng ký thông tin
            </div>
          </div>
        </div>

        <!-- Kiểm tra lại đơn hàng -->
        <div class="card mb-5">
          <div class="card-header bg-white py-2">
            <h6 class="mb-0 text-uppercase fw-bold">Kiểm tra lại đơn hàng</h6>
          </div>
          <div class="card-body py-3">
            <div class="d-flex align-items-start">
              <img 
                src="/src/assets/img/login/frontImg.jpg" 
                alt="Product" 
                class="me-3" 
                style="width: 80px; height: 100px; object-fit: cover; border-radius: 4px;"
              >
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="small flex-grow-1 me-3" style="line-height: 1.4;">
                    <strong>Búp Sen Xanh - Bìa Cứng - Tặng Kèm Obi + Postcard Hành Trình Cứu Nước - Độc Quyền BookStation</strong>
                  </div>
                  <div class="small text-muted text-nowrap me-3">
                    110.000 đ
                  </div>
                  <div class="small text-muted text-nowrap me-3">
                    1
                  </div>
                  <div class="small fw-bold text-nowrap">
                    110.000 đ
                  </div>
                </div>
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
                <span class="fw-bold small">110.000 đ</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="small text-muted me-3">Phí vận chuyển (Giao hàng tiêu chuẩn)</span>
                <span class="fw-bold small">20.000 đ</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="small text-muted me-3">Tổng Số Tiền (gồm VAT)</span>
                <span class="fw-bold text-warning">130.000 đ</span>
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
  </div>
</template>

<script>
export default {
  name: 'CheckoutPage',
  data() {
    return {
      couponCode: '',
      selectedAddress: 'address1',
      selectedShipping: 'shipping1',
      selectedPayment: 'zalopay',
      agreed: true,
      usePoints: false,
      useFreeship: false,
      addNote: false,
      needInvoice: false,
      fPoints: 0,
      freeshipCount: 0
    }
  },
  methods: {
    applyCoupon() {
      if (this.couponCode.trim()) {
        // Xử lý áp dụng mã giảm giá
        alert('Mã giảm giá đã được áp dụng!');
      }
    },
    selectCoupon() {
      // Mở modal chọn mã khuyến mãi
      alert('Chọn mã khuyến mãi');
    },
    selectGift() {
      // Mở modal chọn quà
      alert('Chọn quà tặng');
    },
    processPayment() {
      if (!this.agreed) {
        alert('Vui lòng đồng ý với điều khoản và điều kiện!');
        return;
      }
      
      // Xử lý thanh toán
      alert('Đang xử lý thanh toán...');
      // Redirect hoặc gọi API thanh toán ở đây
    }
  }
}
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
