<template>
  <div>
    <!-- Banner Flash Sale -->
    <div class="flash-sale-banner">
      <div class="flash-sale-title">
        <span class="flash-sale-icon"><i class="bi bi-lightning"></i></span>
        <span class="flash-sale-name">{{
          flashSale?.name || "FLASH SALE"
        }}</span>
        <span class="flash-sale-end-text">Kết thúc trong</span>
        <span class="flash-sale-countdown">
          <span class="countdown-block">{{ hours }}</span> :
          <span class="countdown-block">{{ minutes }}</span> :
          <span class="countdown-block">{{ seconds }}</span>
        </span>
      </div>
    </div>
    <!-- Danh sách sản phẩm Flash Sale -->
    <div class="flash-sale-product">
      <div class="flash-sale-list row g-3">
        <div
          class="col-lg-2 col-md-4 col-sm-6 col-6"
          v-for="p in products"
          :key="p.id"
        >
          <ProductCard :product="p" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import ProductCard from "@/components/common/ProductCard.vue";
import { fetchFlashSaleProducts } from "@/services/admin/book";
import { getTodayFlashSale } from "@/services/admin/flashSale";

const products = ref([]);
const flashSale = ref(null);
const hours = ref("00");
const minutes = ref("00");
const seconds = ref("00");
let timer = null;

function updateCountdown(remainingMillis) {
  let totalSeconds = Math.floor(remainingMillis / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  hours.value = String(h).padStart(2, "0");
  minutes.value = String(m).padStart(2, "0");
  seconds.value = String(s).padStart(2, "0");
}

onMounted(async () => {
  // Lấy thông tin Flash Sale
  const res = await getTodayFlashSale();
  console.log("Flash Sale data:", res.data.data);
  flashSale.value = res.data.data;
  let remaining = flashSale.value?.remainingMillis || 0; // Sửa dòng này
  updateCountdown(remaining);

  timer = setInterval(() => {
    if (remaining > 0) {
      remaining -= 1000;
      updateCountdown(remaining);
    }
  }, 1000);

  // Lấy danh sách sản phẩm Flash Sale
  products.value = await fetchFlashSaleProducts();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.flash-sale-banner {
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 50%, #ff2f3a 100%);
  border-radius: 16px;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(255, 71, 87, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.flash-sale-title {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
  flex-wrap: wrap;
}
.flash-sale-icon {
  color: #ffd700;
  font-size: 32px;
  font-weight: 900;
  margin-right: 0;
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.flash-sale-name {
  font-size: 24px;
  font-weight: 900;
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-right: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}
.flash-sale-end-text {
  color: #ffffff;
  margin-right: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  font-weight: 500;
  opacity: 0.9;
}
.flash-sale-countdown {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 22px;
  font-family: 'Courier New', monospace;
  margin-right: 20px;
  font-weight: 700;
}
.countdown-block {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 22px;
  min-width: 40px;
  text-align: center;
  display: inline-block;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.flash-sale-link {
  color: #1976d2;
  font-size: 15px;
  margin-left: auto;
  text-decoration: none;
  font-weight: 500;
}
.flash-sale-link:hover {
  text-decoration: underline;
}
.flash-sale-product {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px 20px 20px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
  border: 1px solid #f1f3f4;
}
.flash-sale-header {
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  color: #d7263d;
}
.flash-sale-header span {
  color: #111;
  font-weight: 600;
}
.flash-sale-list {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 12px 0;
  justify-content: flex-start;
}
</style>
