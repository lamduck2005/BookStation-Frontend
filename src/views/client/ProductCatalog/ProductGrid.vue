<template>
  <!-- filepath: d:\BookStation-Frontend\src\views\client\ProductGrid.vue -->
  <div class="product-grid-container">
    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Product Grid -->
    <div v-else-if="products && products.length > 0" class="row g-3">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-6 col-md-4 col-lg-3"
      >
        <!-- Giả sử bạn có component ProductCard để hiển thị từng sản phẩm -->
        <ProductCard :product="product" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-5 text-muted">
      <p>Không tìm thấy sản phẩm nào phù hợp.</p>
    </div>
  </div>
</template>

<script setup>
import ProductCard from "@/components/common/ProductCard.vue";
import { watch } from "vue"; // <-- 1. Import watch

// 2. Định nghĩa props như cũ
const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// 3. Sử dụng watch để theo dõi sự thay đổi của props.products
watch(
  () => props.products, // Theo dõi sự thay đổi của thuộc tính 'products' trong 'props'
  (newProducts) => {
    // Hàm này sẽ chạy mỗi khi props.products thay đổi
    console.log("ProductGrid đã nhận được dữ liệu sản phẩm mới:", newProducts);
  },
  { deep: true } // Thêm deep: true để theo dõi thay đổi sâu bên trong mảng
);
</script>

<style scoped>
.product-grid-container {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.sale-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
}

.sale-badge .badge {
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
}

.product-image {
  position: relative;
  height: 250px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 1rem;
}

.product-title {
  font-size: 0.9rem;
  line-height: 1.4;
  height: 2.8rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 0.75rem;
  color: #333;
}

.price-section {
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #dc3545 !important;
}

.original-price {
  font-size: 0.9rem;
}

.discount-badge .badge {
  font-size: 10px;
  padding: 2px 6px;
}

.product-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-actions .btn {
  font-size: 0.8rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.product-actions .btn-sm {
  padding: 0.25rem 0.5rem;
}

.product-actions .btn:hover {
  transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .product-image {
    height: 200px;
  }

  .product-title {
    font-size: 0.85rem;
    height: 2.4rem;
  }

  .current-price {
    font-size: 1rem;
  }

  .product-actions {
    flex-direction: column;
    gap: 0.25rem;
  }

  .product-actions .btn {
    width: 100%;
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .col-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

/* Loading state */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}
</style>
