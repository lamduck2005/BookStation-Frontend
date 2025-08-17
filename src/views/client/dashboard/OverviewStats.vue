<template>
  <div class="overview-stats">
    <div class="stat-card" v-for="stat in stats" :key="stat.label">
      <div class="stat-value">{{ stat.value }}</div>
      <div class="stat-label">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getTotalRevenue,
  getTotalSoldBooks,
  getTotalStockBooks,
  getTotalDeliveredOrders,
  getTotalUsers, // Thêm dòng này
} from "@/services/admin/dashboard";

const stats = ref([
  { label: "Tổng doanh thu", value: "..." },
  { label: "Sách đã bán", value: "..." },
  { label: "Người dùng", value: "..." }, // Đổi thành "..."
  { label: "Sách tồn kho", value: "..." },
]);

onMounted(async () => {
  const revenue = await getTotalRevenue();
  stats.value[0].value = "₫" + revenue.toLocaleString();

  const orders = await getTotalDeliveredOrders();
  stats.value[1].value = orders.toLocaleString();
console.log("Total delivered orders:", orders);
  const users = await getTotalUsers();
  stats.value[2].value = users.toLocaleString(); // Gán số người dùng

  const stock = await getTotalStockBooks();
  stats.value[3].value = stock.toLocaleString();
});
</script>

<style scoped>
.overview-stats {
  display: flex;
  gap: 32px;
}
.stat-card {
  flex: 1;
  background: linear-gradient(135deg, #e3f0ff 0%, #f7fafd 100%);
  border-radius: 12px;
  padding: 32px 0;
  box-shadow: 0 2px 12px #e3e8ee;
  text-align: center;
  transition: box-shadow 0.2s;
}
.stat-card:hover {
  box-shadow: 0 4px 24px #d0e2ff;
}
.stat-value {
  font-size: 2.2rem;
  font-weight: bold;
  color: #1976d2;
}
.stat-label {
  color: #888;
  margin-top: 12px;
  font-size: 1.1rem;
}
</style>
