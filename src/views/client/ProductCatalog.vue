<template>
  <div class="catalog-wrapper">
    <div class="container-fluid py-3">
      <div class="row">
        <!-- Sidebar Filter -->
        <div class="col-lg-3 col-md-4">
          <div class="filter-title-main mb-3">
            <span class="text-danger fw-bold fs-5">LỌC THEO</span>
          </div>
          <FiterProduct @filter-change="onFilterChange" />
        </div>
        <!-- Main Content -->
        <div class="col-lg-9 col-md-8">
          <!-- Header -->
          <div
            class="catalog-header d-flex flex-wrap align-items-center justify-content-between mb-3"
          >
            <div>
              <span class="fw-bold fs-6">KẾT QUẢ TÌM KIẾM:</span>
              <span class="text-primary fw-bold">sách</span>
              <span class="text-muted">({{ total }} kết quả)</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="text-muted">Sắp xếp theo</span>
              <select
                class="form-select form-select-sm w-auto"
                v-model="sortBy"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="discount">Giảm giá nhiều</option>
              </select>
              <button class="btn btn-outline-secondary btn-sm">Còn hàng</button>
            </div>
          </div>
          <!-- Product Grid -->
          <ProductGrid :sortBy="sortBy" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// filepath: d:\BookStation-Frontend\src\views\client\ProductCatalog.vue
import FiterProduct from "./ProductCatalog/FiterProduct.vue";
import ProductGrid from "./ProductCatalog/ProductGrid.vue";
import { ref } from "vue";

const sortBy = ref("newest");
const total = 504; // fake tổng số sản phẩm

const onFilterChange = (filters) => {
  // Xử lý lọc ở đây nếu muốn
  // console.log(filters)
};
</script>

<style scoped>
.catalog-wrapper {
  background: #f5f7fa;
  min-height: 100vh;
}
.filter-title-main {
  border-bottom: 2px solid #dc3545;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}
.catalog-header {
  background: #f5f7fa;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}
.catalog-header select {
  min-width: 120px;
}
@media (max-width: 991.98px) {
  .filter-title-main {
    margin-top: 1rem;
  }
}
</style>
