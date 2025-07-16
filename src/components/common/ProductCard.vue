<template>
  <div class="product-card h-100">
    <div
      class="card border-0 shadow-sm h-100 cursor-pointer"
      @click="goToProductDetail"
    >
      <!-- Badge container -->
      <div class="position-relative">
        <!-- Sale badge -->
        <span
          v-if="product.discountPercentage && product.discountPercentage > 0"
          class="badge bg-danger position-absolute top-0 start-0 m-2 z-index-1 sale-badge"
        >
          {{ getDisplayLabel() }}
        </span>

        <!-- Product image -->
        <div class="product-image-container">
          <img
            :src="
              product.imageUrl ||
              product.image ||
              'https://via.placeholder.com/200x250?text=Book+Cover'
            "
            :alt="product.bookName || product.name || 'Book'"
            class="card-img-top product-image"
          />
        </div>
      </div>

      <!-- Card body -->
      <div class="card-body p-2 d-flex flex-column">
        <!-- Product category/type -->
        <div class="product-category mb-1">
          <span class="badge" :class="getCategoryBadgeClass()">
            {{ product.categoryName || product.categoryLabel || "Sách" }}
          </span>
        </div>

        <!-- Product name -->
        <h6 class="card-title product-name mb-2">
          {{ product.bookName || product.name || "Chưa có tên sách" }}
        </h6>

        <!-- Price section -->
        <div class="price-section mt-auto mb-2">
          <div class="d-flex align-items-center gap-2">
            <span class="current-price fw-bold text-danger fs-6">
              {{ formatPrice(getCurrentPrice()) }}
            </span>
            <span
              v-if="getOriginalPrice()"
              class="original-price text-muted text-decoration-line-through small"
            >
              {{ formatPrice(getOriginalPrice()) }}
            </span>
            <span
              v-if="
                product.discountPercentage && product.discountPercentage > 0
              "
              class="discount-badge badge bg-danger small"
            >
              -{{ product.discountPercentage }}%
            </span>
          </div>
        </div>

        <!-- Sales info -->
        <div class="sales-info">
          <div class="progress mb-1" style="height: 6px">
            <div
              class="progress-bar bg-danger"
              role="progressbar"
              :style="{ width: getSalesProgress() + '%' }"
            ></div>
          </div>
          <small class="text-muted" style="font-size: 0.8rem">
            Đã bán {{ product.soldQuantity || product.sold || 0 }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

// Router
const router = useRouter();

// Props
const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
});

// Methods
const goToProductDetail = () => {
  const productId = props.product.id || props.product.bookId;
  if (productId) {
    router.push({
      name: "product-detail",
      params: { id: productId },
    });
  }
};

const getCurrentPrice = () => {
  return props.product.price || props.product.currentPrice || 0;
};

const getOriginalPrice = () => {
  // Nếu có discountPercentage, tính originalPrice từ price hiện tại
  if (
    props.product.discountPercentage &&
    props.product.discountPercentage > 0
  ) {
    const currentPrice = getCurrentPrice();
    return Math.round(
      currentPrice / (1 - props.product.discountPercentage / 100)
    );
  }
  return props.product.originalPrice || null;
};

const getDisplayLabel = () => {
  if (props.product.isFlashSale) {
    return "FLASH SALE";
  }
  if (props.product.discountPercentage >= 30) {
    return "HOT SALE";
  }
  if (props.product.discountPercentage > 0) {
    return "GIẢM GIÁ";
  }
  return props.product.saleLabel || "XU HƯỚNG";
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  })
    .format(price || 0)
    .replace("₫", "đ");
};

const getCategoryBadgeClass = () => {
  // Dựa vào categoryName hoặc type
  const categoryName = props.product.categoryName?.toLowerCase() || "";

  if (categoryName.includes("văn học")) return "bg-primary";
  if (categoryName.includes("kinh tế") || categoryName.includes("kinh doanh"))
    return "bg-success";
  if (categoryName.includes("thiếu nhi")) return "bg-warning text-dark";
  if (categoryName.includes("ngoại ngữ")) return "bg-info";
  if (props.product.isFlashSale) return "bg-danger";

  return "bg-secondary";
};

const getSalesProgress = () => {
  const sold = props.product.soldQuantity || props.product.sold || 0;
  const total = props.product.stockQuantity || props.product.total || 200;

  if (total === 0) return 0;
  return Math.min((sold / total) * 100, 100);
};
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-card:hover .card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.product-image-container {
  height: 180px;
  overflow: hidden;
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.sale-badge {
  z-index: 2;
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
}

.product-name {
  font-size: 0.9rem;
  line-height: 1.3;
  min-height: 36px;
  max-height: 2.6em; /* Giới hạn tối đa 2 dòng, tự động xuống dòng */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Hiển thị tối đa 2 dòng */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: normal; /* Cho phép xuống dòng */
}

.current-price {
  font-size: 1.1rem;
}

.original-price {
  font-size: 0.8rem;
}

.discount-badge {
  font-size: 0.75rem;
}

.product-category .badge {
  font-size: 0.7rem;
}

.z-index-1 {
  z-index: 1;
}

@media (max-width: 576px) {
  .product-image-container {
    height: 150px;
  }

  .product-name {
    font-size: 0.75rem;
  }

  .current-price {
    font-size: 0.9rem;
  }

  .card-body {
    padding: 0.75rem !important;
  }
}
</style>
