<template>
  <div class="filter-sidebar">
    <div class="filter-container">
      <!-- Danh mục chính -->
      <div class="filter-section">
        <h6 class="filter-title">DANH MỤC CHÍNH</h6>
        <div class="filter-content">
          <div
            v-for="mainCategory in mainCategories"
            :key="mainCategory.id"
            class="filter-item"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input"
                :value="mainCategory.id"
                v-model="selectedMainCategory"
                @change="onMainCategoryChange"
              />
              <span class="category-name">{{ mainCategory.categoryName }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Danh mục phụ -->
      <div class="filter-section" v-if="selectedMainCategory">
        <h6 class="filter-title">DANH MỤC PHỤ</h6>
        <div class="filter-content">
          <div
            v-for="subCategory in filteredSubCategories"
            :key="subCategory.id"
            class="filter-item"
          >
            <label class="form-check-label">
              <input
                type="checkbox"
                class="form-check-input"
                :value="subCategory.id"
                v-model="selectedSubCategories"
                @change="emitFilterChange"
              />
              <span class="category-name">{{ subCategory.categoryName }}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="filter-section">
        <h6 class="filter-title">TÁC GIẢ</h6>
        <div class="filter-content">
          <!-- Search box -->
          <div class="input-group mb-3">
            <div class="author-search-box">
              <div class="search-input-wrapper">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Tìm tác giả..."
                  v-model="authorSearchQuery"
                  @input="onAuthorSearch"
                />
                <span class="search-icon">
                  <i class="bi bi-search"></i>
                </span>
              </div>
            </div>
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="authorSearchQuery = ''"
              v-if="authorSearchQuery"
            >
              <i class="bi bi-x"></i>
            </button>
          </div>

          <!-- Danh sách tác giả -->
          <div
            v-for="author in visibleAuthors"
            :key="author.id"
            class="filter-item"
          >
            <label class="form-check-label">
              <input
                type="checkbox"
                class="form-check-input"
                :value="author.id"
                v-model="selectedAuthors"
                @change="emitFilterChange"
              />
              <span class="category-name">{{ author.authorName }}</span>
            </label>
          </div>

          <!-- Load more button -->
          <button
            v-if="authors.length > showAuthorsLimit"
            class="btn-show-more"
            @click="toggleShowMoreAuthors"
          >
            {{ showAllAuthors ? "Thu gọn ▲" : "Xem thêm ▼" }}
          </button>

          <!-- Loading spinner -->
          <div
            v-if="authorSearchLoading"
            class="spinner-border text-danger"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>

      <!-- Bộ lọc giá -->
      <div class="filter-section">
        <h6 class="filter-title">GIÁ</h6>
        <div class="filter-content">
          <div
            v-for="priceRange in priceRanges"
            :key="priceRange.id"
            class="filter-item"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input"
                :value="priceRange.id"
                v-model="selectedPriceRange"
                @change="onPriceRangeChange"
              />
              <span class="category-name">{{ priceRange.label }}</span>
            </label>
          </div>

          <!-- Custom price range -->
          <div class="custom-price-range mt-3">
            <small class="text-muted">Hoặc chọn mức giá phù hợp</small>
            <div class="price-slider-container mt-2">
              <div class="d-flex justify-content-between mb-2">
                <span class="price-value">{{ formatPrice(minPrice) }}</span>
                <span class="price-value">{{ formatPrice(maxPrice) }}</span>
              </div>
              <div class="price-slider">
                <input
                  type="range"
                  class="range-input range-min"
                  :min="absoluteMinPrice"
                  :max="absoluteMaxPrice"
                  :value="minPrice"
                  @input="onMinPriceChange"
                />
                <input
                  type="range"
                  class="range-input range-max"
                  :min="absoluteMinPrice"
                  :max="absoluteMaxPrice"
                  :value="maxPrice"
                  @input="onMaxPriceChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Nhà phát hành -->
      <div class="filter-section">
        <h6 class="filter-title">Nhà xuất bản</h6>
        <div class="filter-content">
          <div
            v-for="publisher in visiblePublishers"
            :key="publisher.id"
            class="filter-item"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input"
                :value="publisher.id"
                v-model="selectedPublisher"
                @change="emitFilterChange"
              />
              <span class="category-name">{{ publisher.publisherName }}</span>
            </label>
          </div>

          <!-- Xem thêm button -->
          <button
            v-if="publishers.length > showPublishersLimit"
            class="btn-show-more"
            @click="toggleShowMorePublishers"
          >
            {{ showAllPublishers ? "Thu gọn ▲" : "Xem thêm ▼" }}
          </button>
        </div>
      </div>

      <!-- Tác giả -->

      <!-- Clear all filters -->
      <div class="filter-actions mt-4">
        <button
          class="btn btn-outline-danger btn-sm w-100"
          @click="clearAllFilters"
          :disabled="!hasActiveFilters"
        >
          <i class="bi bi-x-circle me-1"></i>
          Xóa tất cả bộ lọc
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  getAllCategoriesByParentId,
  getAllCategoriesParentNull,
} from "@/services/admin/category";
import { getAllPublishers } from "@/services/admin/publisher";
import { getAllAuthors } from "@/services/admin/author"; // ✅ Import the new service

// 1. Định nghĩa props để nhận giá trị khởi tạo
const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["filter-change"]);

const mainCategories = ref([]);
const subCategories = ref([]);
const publishers = ref([]);
const authors = ref([]); // ✅ THÊM

// --- THAY ĐỔI CÁC BIẾN NÀY ---
const selectedSubCategories = ref([]);
const selectedPublisher = ref(null); // <-- Đổi từ mảng thành null
const selectedMainCategory = ref(null);
const selectedPriceRange = ref(null);
// --- KẾT THÚC THAY ĐỔI ---

const minPrice = ref(0);
const maxPrice = ref(1000000);
const absoluteMinPrice = ref(0);
const absoluteMaxPrice = ref(1000000);

const showAllPublishers = ref(false);
const showPublishersLimit = ref(5);

// ✅ THÊM - array để chọn nhiều tác giả
const selectedAuthors = ref([]); // ✅ THÊM

// ✅ THÊM: Author search và display states
const authorSearchQuery = ref("");
const authorSearchLoading = ref(false);
const showAllAuthors = ref(false);
const showAuthorsLimit = ref(5);

const priceRanges = ref([
  { id: 1, label: "0đ - 150,000đ", min: 0, max: 150000 },
  { id: 2, label: "150,000đ - 300,000đ", min: 150000, max: 300000 },
  { id: 3, label: "300,000đ - 500,000đ", min: 300000, max: 500000 },
  { id: 4, label: "500,000đ - 700,000đ", min: 500000, max: 700000 },
  { id: 5, label: "700,000đ Trở Lên", min: 700000, max: Infinity },
]);

// Hàm thông báo lỗi
const showError = (msg) => {
  alert(msg); // Bạn có thể thay bằng toast hoặc emit sự kiện nếu muốn
};

// Hàm lấy danh mục chính
const fetchMainCategories = async () => {
  try {
    const data = await getAllCategoriesParentNull();
    mainCategories.value = data;
  } catch (e) {
    showError("Lỗi lấy danh mục chính!");
  }
};
watch(authorSearchQuery, (newQuery) => {
  // Nếu search rỗng thì truyền chuỗi rỗng, ngược lại truyền từ khóa
  fetchAuthors(newQuery.trim());
});
const onMainCategoryChange = async (event) => {
  selectedSubCategories.value = []; // Xóa các danh mục phụ đã chọn

  const id = selectedMainCategory.value;
  try {
    const data = await getAllCategoriesByParentId(id);
    subCategories.value = data;
  } catch (e) {
    showError("Lỗi lấy danh mục phụ!");
    subCategories.value = [];
  }
  emitFilterChange();
};

// Lấy danh sách nhà xuất bản
const fetchPublishers = async () => {
  try {
    const data = await getAllPublishers();
    publishers.value = data;
  } catch (e) {
    showError("Lỗi lấy danh sách nhà xuất bản!");
    publishers.value = [];
  }
};

// ✅ THÊM: Hàm lấy danh sách tác giả
const fetchAuthors = async (name = "") => {
  try {
    authorSearchLoading.value = true;
    // Chỉ truyền name, các biến khác để mặc định
    const data = await getAllAuthors({ name });
    console.log(data);
    authors.value = data.content;
    console.log(authors.value);
  } catch (e) {
    showError("Lỗi lấy danh sách tác giả!");
    authors.value = [];
  } finally {
    authorSearchLoading.value = false;
  }
};

// Tìm kiếm tác giả (vẫn dùng getAllAuthors, truyền thêm authorName)
const searchAuthors = async (searchQuery) => {
  try {
    authorSearchLoading.value = true;
    authors.value = await getAllAuthors({ authorName: searchQuery });
  } catch (e) {
    showError("Lỗi tìm kiếm tác giả!");
    authors.value = [];
  } finally {
    authorSearchLoading.value = false;
  }
};

const visiblePublishers = computed(() => {
  if (showAllPublishers.value) {
    return publishers.value;
  }
  return publishers.value.slice(0, showPublishersLimit.value);
});

// ✅ THÊM: Computed cho tác giả
const filteredAuthors = computed(() => {
  if (!authorSearchQuery.value.trim()) {
    return authors.value;
  }

  const query = authorSearchQuery.value.toLowerCase().trim();
  return authors.value.filter((author) =>
    author.authorName.toLowerCase().includes(query)
  );
});

const visibleAuthors = computed(() => {
  const filtered = filteredAuthors.value;

  if (showAllAuthors.value || authorSearchQuery.value.trim()) {
    return filtered;
  }

  return filtered.slice(0, showAuthorsLimit.value);
});

const toggleShowMoreAuthors = () => {
  showAllAuthors.value = !showAllAuthors.value;
};

// ✅ THÊM: Debounced search cho tác giả
let authorSearchTimeout = null;
const onAuthorSearch = () => {
  authorSearchLoading.value = true;

  // Clear existing timeout
  if (authorSearchTimeout) {
    clearTimeout(authorSearchTimeout);
  }

  // Set new timeout
  authorSearchTimeout = setTimeout(async () => {
    if (authorSearchQuery.value.trim()) {
      await getAllAuthors(authorSearchQuery.value.trim());
    }
    authorSearchLoading.value = false;
  }, 500); // 500ms delay for better UX
};

const filteredSubCategories = computed(() => {
  if (selectedSubCategories.value.length === 0) {
    return subCategories.value;
  }
  return subCategories.value.filter((sc) =>
    selectedSubCategories.value.includes(sc.id)
  );
});

// ✅ SỬA: Cập nhật hasActiveFilters
const hasActiveFilters = computed(() => {
  return (
    selectedMainCategory.value !== null ||
    selectedSubCategories.value.length > 0 ||
    selectedPriceRange.value !== null ||
    selectedPublisher.value !== null ||
    selectedAuthors.value.length > 0 || // ✅ THÊM
    minPrice.value !== absoluteMinPrice.value ||
    maxPrice.value !== absoluteMaxPrice.value
  );
});

// ✅ SỬA: Cập nhật currentFilters
const currentFilters = computed(() => {
  return {
    mainCategory: selectedMainCategory.value,
    subCategories: selectedSubCategories.value,
    publisherId: selectedPublisher.value,
    authorIds: selectedAuthors.value, // ✅ Mảng ID tác giả đã chọn
    customPriceRange: {
      min: minPrice.value,
      max: maxPrice.value,
    },
  };
});

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price) + " đ";
};

const toggleShowMorePublishers = () => {
  showAllPublishers.value = !showAllPublishers.value;
};

const onPriceRangeChange = () => {
  const range = priceRanges.value.find(
    (pr) => pr.id === selectedPriceRange.value
  );
  if (range) {
    minPrice.value = range.min;
    maxPrice.value =
      range.max === Infinity ? absoluteMaxPrice.value : range.max;
  } else {
    minPrice.value = absoluteMinPrice.value;
    maxPrice.value = absoluteMaxPrice.value;
  }
  emitFilterChange(); // <-- Thêm vào đây
};
const onMinPriceChange = (event) => {
  const value = parseInt(event.target.value);
  if (value < maxPrice.value) {
    minPrice.value = value;
    selectedPriceRange.value = null; // bỏ chọn radio
  }
  emitFilterChange(); // <-- Thêm vào đây
};

const onMaxPriceChange = (event) => {
  const value = parseInt(event.target.value);
  if (value > minPrice.value) {
    maxPrice.value = value;
    selectedPriceRange.value = null; // bỏ chọn radio
  }
  emitFilterChange(); // <-- Thêm vào đây
};

const clearAllFilters = () => {
  selectedMainCategory.value = null;
  subCategories.value = [];
  selectedSubCategories.value = [];
  selectedPriceRange.value = null;
  selectedPublisher.value = null;
  selectedAuthors.value = []; // ✅ THÊM
  authorSearchQuery.value = ""; // ✅ THÊM
  minPrice.value = absoluteMinPrice.value;
  maxPrice.value = absoluteMaxPrice.value;
  emitFilterChange();
};

const onMainCategoryClick = (id) => {
  selectedMainCategory.value = id;
  emitFilterChange();
};

const emitFilterChange = () => {
  emit("filter-change", currentFilters.value);
};

// Hàm để tải danh mục con dựa vào ID cha
const fetchSubCategoriesForParent = async (parentId) => {
  if (!parentId) {
    subCategories.value = [];
    return;
  }
  try {
    const data = await getAllCategoriesByParentId(parentId);
    subCategories.value = data;
  } catch (e) {
    showError("Lỗi lấy danh mục phụ!");
    subCategories.value = [];
  }
};

// 2. Cập nhật onMounted để xử lý initialFilters
onMounted(async () => {
  // Tải danh sách danh mục chính và nhà xuất bản
  await fetchMainCategories();
  await fetchPublishers();
  await fetchAuthors(); // ✅ THÊM

  // Kiểm tra và áp dụng bộ lọc khởi tạo
  if (props.initialFilters) {
    const {
      mainCategory,
      subCategories: initialSubCategories,
      authorIds,
    } = props.initialFilters;

    if (mainCategory) {
      selectedMainCategory.value = mainCategory;
      await fetchSubCategoriesForParent(mainCategory);
      if (initialSubCategories && initialSubCategories.length > 0) {
        selectedSubCategories.value = initialSubCategories;
      }
    }

    // ✅ THÊM: Set initial authors
    if (authorIds && authorIds.length > 0) {
      selectedAuthors.value = authorIds;
    }
  }
});

// 3. Thêm watch để xử lý khi người dùng click qua lại các danh mục trên Header
watch(
  () => props.initialFilters,
  async (newFilters) => {
    if (newFilters) {
      selectedMainCategory.value = newFilters.mainCategory || null;
      await fetchSubCategoriesForParent(newFilters.mainCategory);
      selectedSubCategories.value = newFilters.subCategories || [];
      selectedAuthors.value = newFilters.authorIds || []; // ✅ THÊM
    }
  },
  { deep: true }
);
</script>

<style scoped>
.filter-sidebar {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
  margin-bottom: 20px; /* Thêm margin bottom để tránh dính */
  width: 100%;
}

.filter-container {
  padding: 1.5rem;
}

.filter-section {
  margin-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1.5rem;
}

.filter-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.filter-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-item {
  display: flex;
  align-items: center;
}

.form-check-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
  margin: 0;
  width: 100%;
}

.form-check-input {
  margin: 0;
  cursor: pointer;
}

.form-check-input:checked {
  background-color: #dc3545;
  border-color: #dc3545;
}

.category-name {
  flex: 1;
}

.category-count {
  color: #6c757d;
  font-size: 0.8rem;
  font-weight: 500;
}

.btn-show-more {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 0.85rem;
  padding: 0.5rem 0;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease;
}

.btn-show-more:hover {
  color: #b02a37;
  text-decoration: underline;
}

/* Custom Price Range Styling */
.custom-price-range {
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.price-slider-container {
  position: relative;
}

.price-value {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
}

.price-slider {
  position: relative;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
}

.range-input {
  position: absolute;
  top: -2px;
  left: 0;
  width: 100%;
  height: 6px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #dc3545;
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.range-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #dc3545;
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.range-min {
  z-index: 1;
}
.range-max {
  z-index: 2;
}

/* Filter Actions */
.filter-actions {
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}
.filter-actions .btn {
  transition: all 0.2s ease;
}
.filter-actions .btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.filter-actions .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ✅ THÊM: Author search styles */
.author-search-box {
  position: relative;
}

.search-input-wrapper {
  position: relative;
}

.search-input-wrapper .form-control {
  padding-right: 2.5rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.search-input-wrapper .form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 0.875rem;
  pointer-events: none;
}

/* Selected authors */
.selected-authors {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 0.375rem;
  border: 1px solid #e9ecef;
}

.selected-authors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-author-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #dc3545;
  color: white;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.btn-remove-author {
  background: none;
  border: none;
  color: white;
  font-size: 0.75rem;
  padding: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-remove-author:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Authors list */
.authors-list {
  max-height: 200px;
  overflow-y: auto;
}

.authors-list::-webkit-scrollbar {
  width: 6px;
}

.authors-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.authors-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.authors-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* No results */
.no-results {
  padding: 1rem;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

/* Loading state */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .selected-authors-list {
    gap: 0.25rem;
  }

  .selected-author-tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }

  .authors-list {
    max-height: 150px;
  }
}

/* Animation for selected authors */
.selected-author-tag {
  animation: fadeInScale 0.2s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Hover effects */
.filter-item:has(.form-check-input:checked) .category-name {
  color: #dc3545;
  font-weight: 500;
}

.author-search-box .form-control:hover {
  border-color: #adb5bd;
}

/* Focus states */
.author-search-box .form-control:focus {
  outline: none;
}

/* Selected state for checkboxes */
.authors-list .form-check-input:checked + .category-name {
  color: #dc3545;
  font-weight: 500;
}
</style>
