<template>
  <div class="pos-order-summary">
    <div class="summary-row">
      <span>Tạm tính (0 sản phẩm):</span>
      <span>0 đ</span>
    </div>
    <div class="summary-row">
      <span>Giảm giá trên đơn hàng (F6):</span>
      <span>0 đ</span>
    </div>
    <div class="summary-row">
      <span>Khách phải trả:</span>
      <span style="font-weight:bold; color:#00bfae;">0 đ</span>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.pos-order-summary {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px #e5e7eb;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
</style>