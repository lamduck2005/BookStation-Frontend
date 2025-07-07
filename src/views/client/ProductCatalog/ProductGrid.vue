<template>
  <!-- filepath: d:\BookStation-Frontend\src\views\client\ProductGrid.vue -->
  <div class="product-grid-container">
    <div class="container-fluid py-4">
      <div class="row g-3">
        <div
          v-for="product in products"
          :key="product.id"
          class="col-6 col-md-4 col-lg-3"
        >
          <div class="product-card h-100">
            <!-- Sale Badge -->
            <div class="sale-badge">
              <span class="badge bg-primary">sắp có hàng</span>
            </div>

            <!-- Product Image -->
            <div class="product-image">
              <img
                :src="product.image"
                :alt="product.title"
                class="img-fluid"
                @error="handleImageError"
              />
            </div>

            <!-- Product Info -->
            <div class="product-info p-3">
              <h6 class="product-title mb-2">{{ product.title }}</h6>
              <div class="price-section">
                <span class="current-price text-danger fw-bold">
                  {{ formatPrice(product.currentPrice) }}
                </span>
                <span
                  v-if="
                    product.originalPrice &&
                    product.originalPrice > product.currentPrice
                  "
                  class="original-price text-muted text-decoration-line-through ms-2"
                >
                  {{ formatPrice(product.originalPrice) }}
                </span>
              </div>

              <!-- Discount Percentage -->
              <div v-if="product.discountPercent" class="discount-badge mt-1">
                <span class="badge bg-danger"
                  >-{{ product.discountPercent }}%</span
                >
              </div>

              <!-- Action Buttons -->
              <div class="product-actions mt-3">
                <button
                  class="btn btn-outline-primary btn-sm me-2"
                  @click="addToCart(product)"
                >
                  <i class="bi bi-cart-plus"></i>
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="addToWishlist(product)"
                >
                  <i class="bi bi-heart"></i>
                </button>
                <button
                  class="btn btn-primary btn-sm ms-auto"
                  @click="viewDetails(product)"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div class="text-center mt-4" v-if="hasMore">
        <button
          class="btn btn-outline-primary"
          @click="loadMore"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          {{ loading ? "Đang tải..." : "Xem thêm sản phẩm" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

// Props
const props = defineProps({
  categoryId: {
    type: [String, Number],
    default: null,
  },
  searchQuery: {
    type: String,
    default: "",
  },
  sortBy: {
    type: String,
    default: "default",
  },
  priceRange: {
    type: Object,
    default: () => ({ min: 0, max: 1000000 }),
  },
});

// Emits
const emit = defineEmits(["product-click", "add-to-cart", "add-to-wishlist"]);

// Router
const router = useRouter();

// State
const products = ref([]);
const loading = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);

// Fake Data
const generateFakeProducts = () => {
  const fakeProducts = [
    {
      id: 1,
      title: "Global Success - Bài Tập Tiếng Anh Lớp 9 - Tập 2 - Có Đáp Án",
      image: "/src/assets/img/books/book1.jpg",
      currentPrice: 105000,
      originalPrice: 120000,
      discountPercent: 12,
      category: "Giáo dục",
      isAvailable: true,
      stock: 15,
    },
    {
      id: 2,
      title: "Global Success - Bài Tập Tiếng Anh Lớp 9 - Không Đáp Án",
      image: "/src/assets/img/books/book2.jpg",
      currentPrice: 149000,
      originalPrice: 165000,
      discountPercent: 10,
      category: "Giáo dục",
      isAvailable: true,
      stock: 8,
    },
    {
      id: 3,
      title:
        "Sách Tranh Giáo Dục An Toàn Cho Học Sinh - An Toàn Trong Gia Đình",
      image: "/src/assets/img/books/book3.jpg",
      currentPrice: 59000,
      originalPrice: 75000,
      discountPercent: 21,
      category: "Thiếu nhi",
      isAvailable: true,
      stock: 25,
    },
    {
      id: 4,
      title: "Sách Tranh Giáo Dục An Toàn Cho Học Sinh - An Toàn Giao Thông",
      image: "/src/assets/img/books/book4.jpg",
      currentPrice: 59000,
      originalPrice: 75000,
      discountPercent: 21,
      category: "Thiếu nhi",
      isAvailable: false,
      stock: 0,
    },
    {
      id: 5,
      title: "Hậu Lê Thống Chí (Theo Bản In Của Nhà In Trường Xuân Năm 1912)",
      image: "/src/assets/img/books/book5.jpg",
      currentPrice: 110000,
      originalPrice: null,
      discountPercent: null,
      category: "Lịch sử",
      isAvailable: true,
      stock: 5,
    },
    {
      id: 6,
      title: "Sân Chơi Trí Tuệ - Rèn Luyện Khả Năng - Tưởng Tượng",
      image: "/src/assets/img/books/book6.jpg",
      currentPrice: 48000,
      originalPrice: 60000,
      discountPercent: 20,
      category: "Thiếu nhi",
      isAvailable: true,
      stock: 12,
    },
    {
      id: 7,
      title: "Sân Chơi Trí Tuệ - Rèn Luyện Khả Năng - Nhận Biết",
      image: "/src/assets/img/books/book7.jpg",
      currentPrice: 48000,
      originalPrice: 60000,
      discountPercent: 20,
      category: "Thiếu nhi",
      isAvailable: true,
      stock: 18,
    },
    {
      id: 8,
      title: "Sân Chơi Trí Tuệ - Rèn Luyện Khả Năng - Quan Sát",
      image: "/src/assets/img/books/book8.jpg",
      currentPrice: 48000,
      originalPrice: 60000,
      discountPercent: 20,
      category: "Thiếu nhi",
      isAvailable: true,
      stock: 22,
    },
  ];

  return fakeProducts;
};

// Computed
const filteredProducts = computed(() => {
  let filtered = [...products.value];

  // Filter by search query
  if (props.searchQuery) {
    filtered = filtered.filter((product) =>
      product.title.toLowerCase().includes(props.searchQuery.toLowerCase())
    );
  }

  // Filter by price range
  filtered = filtered.filter(
    (product) =>
      product.currentPrice >= props.priceRange.min &&
      product.currentPrice <= props.priceRange.max
  );

  // Sort products
  switch (props.sortBy) {
    case "price-asc":
      filtered.sort((a, b) => a.currentPrice - b.currentPrice);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.currentPrice - a.currentPrice);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "discount":
      filtered.sort(
        (a, b) => (b.discountPercent || 0) - (a.discountPercent || 0)
      );
      break;
    default:
      // Keep original order
      break;
  }

  return filtered;
});

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price) + " đ";
};

const handleImageError = (event) => {
  event.target.src = "/src/assets/img/placeholder-book.jpg";
};

const addToCart = (product) => {
  if (!product.isAvailable) {
    alert("Sản phẩm hiện tại không có sẵn");
    return;
  }

  console.log("Adding to cart:", product);
  emit("add-to-cart", product);

  // TODO: Implement actual cart logic
  alert(`Đã thêm "${product.title}" vào giỏ hàng`);
};

const addToWishlist = (product) => {
  console.log("Adding to wishlist:", product);
  emit("add-to-wishlist", product);

  // TODO: Implement actual wishlist logic
  alert(`Đã thêm "${product.title}" vào danh sách yêu thích`);
};

const viewDetails = (product) => {
  console.log("Viewing product details:", product);
  emit("product-click", product);

  // Navigate to product detail page
  router.push(`/product/${product.id}`);
};

const loadMore = async () => {
  loading.value = true;

  // Simulate API call
  setTimeout(() => {
    const newProducts = generateFakeProducts().map((product) => ({
      ...product,
      id: product.id + currentPage.value * 8,
    }));

    products.value.push(...newProducts);
    currentPage.value++;

    // Stop loading more after 3 pages
    if (currentPage.value >= 3) {
      hasMore.value = false;
    }

    loading.value = false;
  }, 1000);
};

const fetchProducts = async () => {
  loading.value = true;

  try {
    // Simulate API call
    setTimeout(() => {
      products.value = generateFakeProducts();
      loading.value = false;
    }, 500);

    // TODO: Replace with actual API call
    // const response = await productService.getProducts({
    //   categoryId: props.categoryId,
    //   search: props.searchQuery,
    //   page: currentPage.value
    // });
    // products.value = response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchProducts();
});

// Watch for prop changes
// watch([() => props.categoryId, () => props.searchQuery], () => {
//   currentPage.value = 1;
//   hasMore.value = true;
//   fetchProducts();
// });
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
