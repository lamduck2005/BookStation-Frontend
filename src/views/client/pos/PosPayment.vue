<template>
  <div class="pos-payment">
    <div class="payment-methods">
      <button
        class="pay-method"
        :class="{ active: selectedMethod === 'bank' }"
        @click="selectedMethod = 'bank'"
      >
        Chuyển khoản
      </button>
      <button
        class="pay-method"
        :class="{ active: selectedMethod === 'cash' }"
        @click="selectedMethod = 'cash'"
      >
        Tiền mặt
      </button>
    </div>
    <input class="payment-note" placeholder="Nhập ghi chú đơn hàng" />
    <div class="payment-footer">
      <div>
        <span>Tiền khách đưa</span>
        <span>0 đ</span>
      </div>
      <div>
        <span>Tiền thừa trả khách</span>
        <span>0 đ</span>
      </div>
    </div>
    <button class="confirm-btn">Xác nhận thanh toán (F9)</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const selectedMethod = ref("bank");
</script>

<style scoped>
.pos-payment {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 4px #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.payment-methods {
  display: flex;
  margin-bottom: 8px;
  width: 100%;
}
.pay-method {
  flex: 1;
  background: #f3f4f6;
  border: 2px solid transparent;
  font-size: 16px;
  padding: 12px 0;
  cursor: pointer;
  transition: background 0.2s, border 0.2s, color 0.2s;
  border-radius: 0;
  color: #222;
}
.pay-method:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.pay-method:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.pay-method.active {
  background: #fff;
  border: 2px solid #00bfae;
  color: #00bfae;
  font-weight: 600;
  position: relative;
  z-index: 1;
}
.payment-note {
  width: 100%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}
.payment-footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 8px;
}
.confirm-btn {
  background: #00bfae;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 16px 0; /* tăng chiều cao nút */
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  width: 100%; /* nút dài ra hết khối */
}
</style>
