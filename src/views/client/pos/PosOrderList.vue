<template>
  <div class="pos-order-list">
    <div class="order-list-header">
      <span>Đơn hàng 1</span>
      <button class="add-order-btn">+</button>
    </div>
    <table class="order-table">
      <thead>
        <tr>
          <th>Tên/Mã SP</th>
          <th>Số lượng</th>
          <th>Đơn giá (VND)</th>
          <th>Giảm giá</th>
          <th>Tổng tiền</th>
        </tr>
      </thead>
      <tbody>
        <!-- Hiển thị danh sách sản phẩm trong đơn hàng -->
        <tr v-if="orderItems.length === 0">
          <td colspan="5" style="text-align:center; color:#bbb;">
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" width="60" style="opacity:0.5" />
            <div>Bấm vào thanh tìm kiếm hoặc phím F2 để chọn sản phẩm thêm vào đơn hàng</div>
          </td>
        </tr>
        <tr v-for="item in orderItems" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.qty }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.discount }}</td>
          <td>{{ item.qty * item.price - item.discount }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const orderItems = ref([]) // Thay bằng props hoặc inject nếu dùng store
</script>

<style scoped>
.pos-order-list {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px #e5e7eb;
}
.order-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.add-order-btn {
  background: #00bfae;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  cursor: pointer;
}
.order-table {
  width: 100%;
  border-collapse: collapse;
}
.order-table th, .order-table td {
  border-bottom: 1px solid #f0f0f0;
  padding: 6px 4px;
  text-align: center;
}
</style>