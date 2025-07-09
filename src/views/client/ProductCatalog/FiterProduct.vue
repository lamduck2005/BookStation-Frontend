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
                @click="onMainCategoryClick(mainCategory.id)"
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
              />
              <span class="category-name">{{ subCategory.categoryName }}</span>
            </label>
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

const onMainCategoryChange = async (event) => {
  // --- THÊM DÒNG NÀY ---
  selectedSubCategories.value = []; // Xóa các danh mục phụ đã chọn
  // --- KẾT THÚC THÊM ---

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

const visiblePublishers = computed(() => {
  if (showAllPublishers.value) {
    return publishers.value;
  }
  return publishers.value.slice(0, showPublishersLimit.value);
});

const filteredSubCategories = computed(() => {
  if (selectedSubCategories.value.length === 0) {
    return subCategories.value;
  }
  return subCategories.value.filter((sc) =>
    selectedSubCategories.value.includes(sc.id)
  );
});

const hasActiveFilters = computed(() => {
  return (
    selectedMainCategory.value !== null ||
    selectedSubCategories.value.length > 0 ||
    selectedPriceRange.value !== null || // <-- Sửa lại cho đúng biến
    selectedPublisher.value !== null || // <-- Sửa lại cho đúng biến
    minPrice.value !== absoluteMinPrice.value ||
    maxPrice.value !== absoluteMaxPrice.value
  );
});

const currentFilters = computed(() => {
  return {
    mainCategory: selectedMainCategory.value,
    subCategories: selectedSubCategories.value,
    publisherId: selectedPublisher.value, // <-- Đổi tên và giá trị
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
  // --- THÊM DÒNG NÀY ---
  selectedMainCategory.value = null; // <-- Xóa cả danh mục chính
  subCategories.value = []; // Xóa danh sách danh mục con
  // --- KẾT THÚC THÊM ---

  selectedSubCategories.value = [];
  selectedPriceRange.value = null; // <-- Sửa lại cho đúng biến
  selectedPublisher.value = null; // <-- Sửa lại cho đúng biến
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

  // Kiểm tra và áp dụng bộ lọc khởi tạo
  if (props.initialFilters) {
    const { mainCategory, subCategories: initialSubCategories } =
      props.initialFilters;

    if (mainCategory) {
      selectedMainCategory.value = mainCategory;
      // Tải danh sách danh mục con tương ứng
      await fetchSubCategoriesForParent(mainCategory);
      // Sau khi tải xong, gán giá trị cho danh mục con đã chọn
      if (initialSubCategories && initialSubCategories.length > 0) {
        selectedSubCategories.value = initialSubCategories;
      }
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
  height: fit-content;
  position: sticky;
  top: 20px;
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

/* Responsive */
@media (max-width: 768px) {
  .filter-sidebar {
    position: static;
    margin-bottom: 1rem;
  }
  .filter-container {
    padding: 1rem;
  }
  .filter-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }
}

/* Checkbox customization */
.form-check-input:checked {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e");
}

/* Active filter highlighting */
.filter-item:has(.form-check-input:checked) .category-name {
  color: #dc3545;
  font-weight: 500;
}

/* Smooth transitions */
.filter-item,
.btn-show-more,
.filter-actions .btn {
  transition: all 0.2s ease;
}
.filter-content {
  transition: max-height 0.3s ease;
}
</style>
