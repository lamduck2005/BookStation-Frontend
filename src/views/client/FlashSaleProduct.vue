<template>
  <div class="flash-sale-product">
    <div class="flash-sale-header">
      <i class="bi bi-fire"></i>
      <span>Sách đang được FlashSale</span>
    </div>
    <div class="flash-sale-list row g-3">
      <div
        class="col-lg-2 col-md-4 col-sm-6 col-6"
        v-for="p in products"
        :key="p.id"
      >
        <ProductCard :product="p" />
      </div>
    </div>
    <!-- <div class="flash-sale-footer">
      <button class="flash-sale-more-btn">Xem Thêm</button>
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ProductCard from "@/components/common/ProductCard.vue";
import { fetchFlashSaleProducts } from "@/services/admin/book";
const products = ref([]);
onMounted(async () => {
  products.value = await fetchFlashSaleProducts();
});
</script>

<style scoped>
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
  color: #d7263d; /* Thêm dòng này để đổi màu đỏ */
}
.flash-sale-header span {
  color: #111; /* Đen */
  font-weight: 600;
}
.flash-sale-list {
  display: flex;
  gap: 28px; /* Tăng khoảng cách giữa các card */
  overflow-x: auto;
  padding: 8px 0;
  justify-content: flex-start;
}
.flash-sale-footer {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
.flash-sale-more-btn {
  border: 1px solid #d7263d;
  color: #d7263d;
  background: #fff;
  border-radius: 6px;
  padding: 6px 32px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.flash-sale-more-btn:hover {
  background: #d7263d;
  color: #fff;
}
</style>
