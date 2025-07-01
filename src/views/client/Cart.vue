<template>
  <div class="container cart-container">
    <div class="row">
      <div class="col-8">
        <div class="cart-header d-flex align-items-end mb-3">
          <h2 class="cart-title mb-0">GIỎ HÀNG</h2>
          <span class="cart-count ms-2">(3 sản phẩm)</span>
        </div>
        <div class="cart-select-all-row d-flex align-items-center px-3 py-2 mb-3 rounded">
          <input type="checkbox" id="selectAll" class="custom-checkbox me-3" checked />
          <label for="selectAll" class="mb-0 flex-grow-1 fw-medium">
            Chọn tất cả <span class="text-secondary">(2 sản phẩm)</span>
          </label>
          <div class="text-center fw-bold text-secondary" style="width: 120px;">Số lượng</div>
          <div class="text-center fw-bold text-secondary" style="width: 120px;">Thành tiền</div>
        </div>
        <div class="box bg-white rounded p-3">
          <!-- Sản phẩm 1 -->
          <div class="cart-item d-flex align-items-center py-3 border-bottom">
            <input type="checkbox" checked class="custom-checkbox me-3" />
            <div class="cart-img-container me-3">
             <img src="https://cdn0.fahasa.com/media/catalog/product/b/u/bupsenxanh.jpg" alt="Búp Sen Xanh" class="cart-img me-3" width="150" height="150"/>
            </div>
            <div class="flex-grow-1">
              <div class="fw-normal mb-2">
                Búp Sen Xanh - Bìa Cứng - Tặng Kèm Obi + Postcard Hành Trình Cứu Nước - Độc Quyền Fahasa
              </div>
              <div class="fw-bold" style="font-size: 1.15rem;">110.000 đ</div>
            </div>
            <div class="cart-qty-group d-flex align-items-center mx-3">
              <button class="btn btn-light px-2 py-1 border">-</button>
              <span class="mx-2">5</span>
              <button class="btn btn-light px-2 py-1 border"  >+</button>
            </div>
            <div class="cart-price text-danger fw-bold me-3" style="width: 110px; text-align: right;">550.000 đ</div>
            <button class="btn btn-link text-secondary fs-4"><i class="fa fa-trash"></i></button>
          </div>
       
        
        </div>
      </div>
      <div class="col-4">
        <div class="cart-summary bg-white rounded p-3 shadow-sm">
          <div class="d-flex justify-content-between mb-2">
            <span>Thành tiền</span>
            <span>1.058.000 đ</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Phí vận chuyển (Giao hàng tiêu chuẩn)</span>
            <span>38.000 đ</span>
          </div>
          <hr class="my-2" />
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fw-bold" style="font-size: 1.1rem;">Tổng Số Tiền (gồm VAT)</span>
            <span class="text-danger fw-bold" style="font-size: 1.6rem;">550.000 đ</span>
          </div>
          <button class="btn btn-danger w-100 fw-bold py-2 mb-2" style="font-size: 1.2rem; border-radius: 12px;">
            THANH TOÁN
          </button>
          <div class="text-center" style="font-size: 0.95rem; color: #d32f2f;">
            (Giảm giá trên web chỉ áp dụng cho bán lẻ)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.cart-container {
  max-width: 100%;
   margin: 24px 10%;  
  background: #fff;
  border-radius: 10px;
  padding: 24px 24px 16px 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.cart-header {
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
}

.cart-title {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: #222;
}

.cart-count {
  font-size: 1.1rem;
  color: #444;
  font-weight: 400;
}

.cart-select-all-row {
  background: #fafafa;
  border-radius: 12px;
  font-size: 1.08rem;
  min-height: 48px;
}

.custom-checkbox {
  width: 28px;
  height: 28px;
  accent-color: #d32f2f;
  border-radius: 6px;
  margin-top: 0;
  margin-bottom: 0;
}

.cart-summary {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.cart-summary .btn {
  border-radius: 8px;
}
.cart-img-container{
  width: 150px;
  height: 150px;
}
</style>
