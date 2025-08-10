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
  background: #ff6f6f;
  border-radius: 10px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.flash-sale-title {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}
.flash-sale-icon {
  color: #ff9800;
  font-size: 28px;
  font-weight: bold;
  margin-right: 8px;
}
.flash-sale-name {
  font-size: 22px;
  font-weight: 900; /* Đậm hơn */
  color: #ff9800;
  font-style: italic;
  margin-right: 18px;
}
.flash-sale-end-text {
  color: #222;
  margin-right: 8px;
}
.flash-sale-countdown {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 20px;
  font-family: monospace;
  margin-right: 18px;
}
.countdown-block {
  background: #111;
  color: #fff;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 20px;
  min-width: 32px;
  text-align: center;
  display: inline-block;
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
  background: #fff;
  border-radius: 8px;
  padding: 18px 16px 12px 16px;
  box-shadow: 0 2px 8px #0000000a;
  margin-bottom: 24px;
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
  gap: 28px;
  overflow-x: auto;
  padding: 8px 0;
  justify-content: flex-start;
}
</style>
