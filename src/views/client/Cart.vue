<template>
  <div class="container cart-container">
    <div class="row">
      <div class="col-8">
        <div class="cart-header d-flex align-items-end mb-3">
          <h2 class="cart-title mb-0">GIỎ HÀNG</h2>
          <span class="cart-count ms-2">(5 sản phẩm)</span>
        </div>
        <div class="cart-select-all-row d-flex align-items-center px-3 py-2 mb-3 rounded">
          <input type="checkbox" id="selectAll" class="custom-checkbox me-3" checked />
          <label for="selectAll" class="mb-0 flex-grow-1 fw-medium">
            Chọn tất cả <span class="text-secondary">(5 sản phẩm)</span>
          </label>
          <div class="text-center fw-bold text-secondary" style="min-width: 120px;">Số lượng</div>
          <div class="text-center fw-bold text-secondary" style="min-width: 120px;">Thành tiền</div>
          <div style="min-width: 50px;"></div> <!-- Space for delete button -->
        </div>
        <div class="box bg-white rounded p-3">
          <!-- Sản phẩm 1 -->
          <div class="cart-item d-flex align-items-center py-3 border-bottom">
            <input type="checkbox" checked class="custom-checkbox me-3" />
            <div class="cart-img-container me-3">
             <img src="https://cdn0.fahasa.com/media/catalog/product/b/u/bupsenxanh.jpg" alt="Búp Sen Xanh" class="cart-img me-3" width="150" height="150"/>
            </div>
            <div class="product-info flex-grow-1 me-3">
              <div class="fw-normal mb-2">
                Búp Sen Xanh - Bìa Cứng - Tặng Kèm Obi + Postcard Hành Trình Cứu Nước - Độc Quyền Fahasa
              </div>
              <div class="fw-bold text-danger" style="font-size: 1.1rem;">110.000 đ</div>
            </div>
            <div class="cart-qty-group d-flex align-items-center justify-content-center" style="min-width: 120px;">
              <button class="btn btn-light px-2 py-1 border">-</button>
              <span class="mx-2">1</span>
              <button class="btn btn-light px-2 py-1 border">+</button>
            </div>
            <div class="cart-price text-danger fw-bold text-end" style="min-width: 120px;">110.000 đ</div>
            <button class="btn btn-link text-secondary fs-4 ms-2"><i class="fa fa-trash"></i></button>
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
            <div class="text-muted" style="font-size: 0.8rem;">Mua thêm 20.000 đ</div>
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
            <span>110.000 đ</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Phí vận chuyển (Giao hàng tiêu chuẩn)</span>
            <span>20.000 đ</span>
          </div>
          <hr class="my-2" />
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fw-bold" style="font-size: 1.1rem;">Tổng Số Tiền (gồm VAT)</span>
            <span class="text-danger fw-bold" style="font-size: 1.4rem;">130.000 đ</span>
          </div>
          <button class="btn btn-danger w-100 fw-bold py-2 mb-2" style="font-size: 1.1rem; border-radius: 8px;" @click="goToCheckout">
            THANH TOÁN
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
export default {
  name: 'Cart',
  methods: {
    goToCheckout() {
      // Chuyển hướng sang trang thanh toán
      this.$router.push('/checkout');
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
}

.cart-img {
  width: 140px !important;
  height: 140px !important;
  object-fit: cover;
  border-radius: 4px;
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
