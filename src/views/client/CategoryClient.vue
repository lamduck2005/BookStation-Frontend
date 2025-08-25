<template>
  <div class="home-page">
    <!-- Card duy nhất: Danh mục sản phẩm và sách -->
    <div class="category-client">
      <div class="category-header">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style="margin-right: 4px"
        >
          <rect
            x="2"
            y="2"
            width="7"
            height="7"
            rx="2"
            stroke="#d7263d"
            stroke-width="2"
            fill="none"
          />
          <circle
            cx="17.5"
            cy="5.5"
            r="3.5"
            stroke="#d7263d"
            stroke-width="2"
            fill="none"
          />
          <rect
            x="2"
            y="15"
            width="7"
            height="7"
            rx="2"
            stroke="#d7263d"
            stroke-width="2"
            fill="none"
          />
          <rect
            x="15"
            y="15"
            width="7"
            height="7"
            rx="2"
            stroke="#d7263d"
            stroke-width="2"
            fill="none"
          />
        </svg>
        <span>Danh mục sản phẩm</span>
      </div>

      <!-- Danh sách các danh mục chính -->
      <div class="category-list">
        <!-- Mục "Tất cả" -->
        <div
          class="category-item"
          :class="{ active: selectedCategoryId === null }"
          @click="selectCategory(null)"
        >
          <div class="category-name">Tất cả</div>
        </div>

        <!-- Các danh mục từ API - chỉ hiển thị text -->
        <div
          class="category-item text-only"
          :class="{ active: selectedCategoryId === category.id }"
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category.id)"
        >
          <div class="category-name">{{ category.categoryName }}</div>
        </div>
      </div>

      <!-- Hiển thị sách -->
      <div class="books-section">
        <!-- Hiển thị sách theo danh mục được chọn hoặc tất cả -->
        <div class="books-grid">
          <ProductCard
            v-for="book in displayBooks"
            :key="book.id"
            :product="book"
          />
        </div>

        <!-- Nút Xem Thêm duy nhất - chỉ hiện khi có đủ sản phẩm -->
        <div class="show-more-section" v-if="shouldShowMoreButton">
          <button class="show-more-btn" @click="goToProductsPage">
            Xem Thêm
          </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading-section">
          <p>Đang tải...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getAllCategoriesByParentId,
  getAllCategoriesParentNotNull,
  getAllCategoriesParentNull,
} from "@/services/admin/category";
import { getBooksClient } from "@/services/admin/book";
import ProductCard from "@/components/common/ProductCard.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const categories = ref([]);
const allBooks = ref([]);
const categoryBooks = ref({});
const selectedCategoryId = ref(null);
const loading = ref(false);
const router = useRouter();

// Computed để hiển thị sách theo danh mục được chọn
const displayBooks = computed(() => {
  if (selectedCategoryId.value === null) {
    // Hiển thị 10 sản phẩm từ tất cả danh mục
    return allBooks.value.slice(0, 10);
  } else {
    // Hiển thị 5 sản phẩm từ danh mục được chọn
    return categoryBooks.value[selectedCategoryId.value] || [];
  }
});

// Computed để kiểm tra có nên hiển thị nút "Xem Thêm" không
const shouldShowMoreButton = computed(() => {
  if (selectedCategoryId.value === null) {
    // Với "Tất cả": hiển thị nút nếu có > 10 sản phẩm
    return allBooks.value.length > 10;
  } else {
    // Với danh mục cụ thể: hiển thị nút nếu có > 5 sản phẩm
    const categoryBooksArray =
      categoryBooks.value[selectedCategoryId.value] || [];
    return categoryBooksArray.length >= 5;
  }
});

// Load tất cả sách từ tất cả danh mục (cho view "Tất cả")
const loadAllBooks = async () => {
  try {
    // Gọi API để lấy tất cả sách (không filter theo danh mục)
    const books = await getBooksClient({
      page: 0,
      size: 50, // Lấy nhiều sách để shuffle
    });

    allBooks.value = books.content || [];
    console.log(
      `Loaded ${books.content?.length || 0} books from all categories`
    );
  } catch (error) {
    console.error("Error loading all books:", error);
    allBooks.value = [];
  }
};

// Load sách cho danh mục cụ thể
const loadCategoryBooks = async (categoryId) => {
  try {
    // Gọi API với size = 5 cho danh mục được chọn
    const books = await getBooksClient({
      page: 0,
      size: 5,
      parentCategoryId: categoryId,
    });

    categoryBooks.value[categoryId] = books.content || [];
    console.log(
      `Loaded ${books.content?.length || 0} books for category ${categoryId}`
    );
  } catch (error) {
    console.error(`Error loading books for category ${categoryId}:`, error);
    categoryBooks.value[categoryId] = [];
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    // Load danh mục chính từ API
    categories.value = await getAllCategoriesParentNull();
    console.log("Loaded categories:", categories.value);

    // Load tất cả sách (cho view "Tất cả")
    await loadAllBooks();
  } catch (error) {
    console.error("Error loading data:", error);
    categories.value = [];
    allBooks.value = [];
  } finally {
    loading.value = false;
  }
});

async function selectCategory(categoryId) {
  selectedCategoryId.value = categoryId;

  if (categoryId !== null) {
    // Nếu chưa load sách cho danh mục này thì load
    if (!categoryBooks.value[categoryId]) {
      loading.value = true;
      await loadCategoryBooks(categoryId);
      loading.value = false;
    }
  }
}

function goToProductsPage() {
  if (selectedCategoryId.value === null) {
    // Đi đến trang products với tất cả sách
    router.push("/products").then(() => {
      // Scroll to top sau khi navigate
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  } else {
    // Đi đến trang products với filter theo danh mục
    const query = {
      mainCategory: btoa(selectedCategoryId.value.toString()),
    };
    router
      .push({
        path: "/products",
        query: query,
      })
      .then(() => {
        // Scroll to top sau khi navigate
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  }
}

function goToCategory(id, type) {
  const query = {};
  if (type === "parent") {
    query.mainCategory = btoa(id.toString());
  }

  router
    .push({
      path: "/products",
      query: query,
    })
    .then(() => {
      // Scroll to top sau khi navigate
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function goToBookDetail(bookId) {
  router.push(`/book/${bookId}`);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
</script>

<style scoped>
.home-page {
  background: #f5f7fa;
  padding: 20px;
}

/* Card duy nhất */
.category-client {
  background: #fff;
  border-radius: 8px;
  padding: 18px 16px 12px 16px;
  box-shadow: 0 2px 8px #0000000a;
}

.category-header {
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.category-header span {
  color: #111;
  font-weight: 600;
}

.category-list {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 8px 0 24px 0;
  scrollbar-width: thin;
  margin-bottom: 20px;
}

.category-list::-webkit-scrollbar {
  height: 8px;
}

.category-list::-webkit-scrollbar-thumb {
  background: #eee;
  border-radius: 4px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px 16px;
  border-radius: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.category-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.category-item.active {
  background: #d7263d;
  border-color: #d7263d;
}

.category-item.active .category-name {
  color: white;
  font-weight: 600;
}

.category-name {
  font-size: 14px;
  text-align: center;
  color: #666;
  font-weight: 500;
  line-height: 1.2;
  word-break: break-word;
  transition: all 0.2s;
  white-space: nowrap;
}

/* Books section */
.books-section {
  margin-top: 20px;
}

/* Books grid */
.books-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

/* Nút Xem Thêm duy nhất */
.show-more-section {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.show-more-btn {
  background: #fff;
  border: 1px solid #d7263d;
  color: #d7263d;
  padding: 12px 32px;
  border-radius: 24px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 120px;
}

.show-more-btn:hover {
  background: #d7263d;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(215, 38, 61, 0.3);
}

/* Loading state */
.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

/* Responsive */
@media (max-width: 1200px) {
  .books-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .category-list {
    gap: 12px;
  }
}

@media (max-width: 576px) {
  .home-page {
    padding: 12px;
  }

  .books-grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .category-item {
    min-width: 80px;
    padding: 6px 12px;
  }

  .category-name {
    font-size: 13px;
  }
}
</style>
