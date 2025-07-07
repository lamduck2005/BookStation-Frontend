<template>
  <!-- filepath: d:\BookStation-Frontend\src\views\client\ProductCatalog\FilterProduct.vue -->
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
                type="checkbox"
                class="form-check-input"
                :value="mainCategory.id"
                v-model="selectedMainCategories"
                @change="onMainCategoryChange"
              />
              <span class="category-name">{{ mainCategory.name }}</span>
              <span class="category-count">({{ mainCategory.count }})</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Danh mục phụ -->
      <div class="filter-section">
        <h6 class="filter-title">DANH MỤC PHỤ</h6>
        <div class="filter-content">
          <div
            v-for="subCategory in visibleSubCategories"
            :key="subCategory.id"
            class="filter-item"
          >
            <label class="form-check-label">
              <input
                type="checkbox"
                class="form-check-input"
                :value="subCategory.id"
                v-model="selectedSubCategories"
                @change="onSubCategoryChange"
              />
              <span class="category-name">{{ subCategory.name }}</span>
              <span class="category-count">({{ subCategory.count }})</span>
            </label>
          </div>

          <!-- Xem thêm button -->
          <button
            v-if="subCategories.length > showSubCategoriesLimit"
            class="btn-show-more"
            @click="toggleShowMoreSubCategories"
          >
            {{ showAllSubCategories ? "Thu gọn ▲" : "Xem thêm ▼" }}
          </button>
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
                type="checkbox"
                class="form-check-input"
                :value="priceRange.id"
                v-model="selectedPriceRanges"
                @change="onPriceRangeChange"
              />
              <span class="category-name">{{ priceRange.label }}</span>
              <span class="category-count">({{ priceRange.count }})</span>
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

      <!-- Lựa tuổi -->
      <div class="filter-section">
        <h6 class="filter-title">LỨA TUỔI</h6>
        <div class="filter-content">
          <div
            v-for="ageGroup in ageGroups"
            :key="ageGroup.id"
            class="filter-item"
          >
            <label class="form-check-label">
              <input
                type="checkbox"
                class="form-check-input"
                :value="ageGroup.id"
                v-model="selectedAgeGroups"
                @change="onAgeGroupChange"
              />
              <span class="category-name">{{ ageGroup.name }}</span>
              <span class="category-count">({{ ageGroup.count }})</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Nhà phát hành -->
      <div class="filter-section">
        <h6 class="filter-title">NHÀ PHÁT HÀNH</h6>
        <div class="filter-content">
          <div
            v-for="publisher in visiblePublishers"
            :key="publisher.id"
            class="filter-item"
          >
            <label class="form-check-label">
              <input
                type="checkbox"
                class="form-check-input"
                :value="publisher.id"
                v-model="selectedPublishers"
                @change="onPublisherChange"
              />
              <span class="category-name">{{ publisher.name }}</span>
              <span class="category-count">({{ publisher.count }})</span>
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
import { ref, computed, watch, onMounted } from "vue";

// Props
const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(["filter-change"]);

// State
const selectedMainCategories = ref([]);
const selectedSubCategories = ref([]);
const selectedPriceRanges = ref([]);
const selectedAgeGroups = ref([]);
const selectedPublishers = ref([]);

const minPrice = ref(0);
const maxPrice = ref(1000000);
const absoluteMinPrice = ref(0);
const absoluteMaxPrice = ref(1000000);

const showAllSubCategories = ref(false);
const showAllPublishers = ref(false);
const showSubCategoriesLimit = 6;
const showPublishersLimit = 5;

// Fake Data
const mainCategories = ref([{ id: 1, name: "Sách Tiếng Việt", count: 504 }]);

const subCategories = ref([
  { id: 1, name: "Thiếu Nhi", count: 308 },
  { id: 2, name: "Văn Học", count: 125 },
  { id: 3, name: "Sách Học Ngoại Ngữ", count: 27 },
  { id: 4, name: "Tâm Lý - Kỹ Năng Sống", count: 11 },
  { id: 5, name: "Lịch Sử - Địa Lý - Tôn Giáo", count: 10 },
  { id: 6, name: "Giáo Khoa - Tham Khảo", count: 9 },
  { id: 7, name: "Chính Trị - Pháp Lý - Triết Học", count: 6 },
  { id: 8, name: "Kinh Tế - Quản Lý", count: 4 },
  { id: 9, name: "Khoa Học - Công Nghệ", count: 3 },
]);

const priceRanges = ref([
  { id: 1, label: "0đ - 150.000đ", min: 0, max: 150000, count: 488 },
  { id: 2, label: "150.000đ - 300.000đ", min: 150000, max: 300000, count: 49 },
  { id: 3, label: "300.000đ - 500.000đ", min: 300000, max: 500000, count: 11 },
  { id: 4, label: "500.000đ - 700.000đ", min: 500000, max: 700000, count: 4 },
  { id: 5, label: "700.000đ Trở Lên", min: 700000, max: 999999999, count: 4 },
]);

const ageGroups = ref([
  { id: 1, name: "6+(2)", count: 2 },
  { id: 2, name: "8+(2)", count: 2 },
]);

const publishers = ref([
  { id: 1, name: "Giáo Dục Việt Nam", count: 1209 },
  { id: 2, name: "Đại Học Quốc Gia Hà Nội", count: 1153 },
  { id: 3, name: "Dân Trí", count: 1123 },
  { id: 4, name: "Thanh Niên", count: 525 },
  { id: 5, name: "Văn Học", count: 504 },
  { id: 6, name: "Kim Đồng", count: 320 },
  { id: 7, name: "Trẻ", count: 285 },
]);

// Computed
const visibleSubCategories = computed(() => {
  if (showAllSubCategories.value) {
    return subCategories.value;
  }
  return subCategories.value.slice(0, showSubCategoriesLimit);
});

const visiblePublishers = computed(() => {
  if (showAllPublishers.value) {
    return publishers.value;
  }
  return publishers.value.slice(0, showPublishersLimit);
});

const hasActiveFilters = computed(() => {
  return (
    selectedMainCategories.value.length > 0 ||
    selectedSubCategories.value.length > 0 ||
    selectedPriceRanges.value.length > 0 ||
    selectedAgeGroups.value.length > 0 ||
    selectedPublishers.value.length > 0 ||
    minPrice.value !== absoluteMinPrice.value ||
    maxPrice.value !== absoluteMaxPrice.value
  );
});

const currentFilters = computed(() => {
  return {
    mainCategories: selectedMainCategories.value,
    subCategories: selectedSubCategories.value,
    priceRanges: selectedPriceRanges.value,
    ageGroups: selectedAgeGroups.value,
    publishers: selectedPublishers.value,
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

const toggleShowMoreSubCategories = () => {
  showAllSubCategories.value = !showAllSubCategories.value;
};

const toggleShowMorePublishers = () => {
  showAllPublishers.value = !showAllPublishers.value;
};

const onMainCategoryChange = () => {
  emitFilterChange();
};

const onSubCategoryChange = () => {
  emitFilterChange();
};

const onPriceRangeChange = () => {
  // Clear custom price range when predefined range is selected
  if (selectedPriceRanges.value.length > 0) {
    minPrice.value = absoluteMinPrice.value;
    maxPrice.value = absoluteMaxPrice.value;
  }
  emitFilterChange();
};

const onAgeGroupChange = () => {
  emitFilterChange();
};

const onPublisherChange = () => {
  emitFilterChange();
};

const onMinPriceChange = (event) => {
  const value = parseInt(event.target.value);
  if (value < maxPrice.value) {
    minPrice.value = value;
    // Clear predefined price ranges when custom range is used
    selectedPriceRanges.value = [];
    emitFilterChange();
  }
};

const onMaxPriceChange = (event) => {
  const value = parseInt(event.target.value);
  if (value > minPrice.value) {
    maxPrice.value = value;
    // Clear predefined price ranges when custom range is used
    selectedPriceRanges.value = [];
    emitFilterChange();
  }
};

const clearAllFilters = () => {
  selectedMainCategories.value = [];
  selectedSubCategories.value = [];
  selectedPriceRanges.value = [];
  selectedAgeGroups.value = [];
  selectedPublishers.value = [];
  minPrice.value = absoluteMinPrice.value;
  maxPrice.value = absoluteMaxPrice.value;
  emitFilterChange();
};

const emitFilterChange = () => {
  emit("filter-change", currentFilters.value);
};

// Initialize with default data
onMounted(() => {
  // Load initial filters if provided
  if (props.initialFilters) {
    selectedMainCategories.value = props.initialFilters.mainCategories || [];
    selectedSubCategories.value = props.initialFilters.subCategories || [];
    selectedPriceRanges.value = props.initialFilters.priceRanges || [];
    selectedAgeGroups.value = props.initialFilters.ageGroups || [];
    selectedPublishers.value = props.initialFilters.publishers || [];

    if (props.initialFilters.customPriceRange) {
      minPrice.value = props.initialFilters.customPriceRange.min;
      maxPrice.value = props.initialFilters.customPriceRange.max;
    }
  }
});

// Watch for changes and emit
watch(
  currentFilters,
  () => {
    emitFilterChange();
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
