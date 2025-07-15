<template>
  <div class="pos-header">
    <select v-model="selectedCategory" class="pos-warehouse">
      <option value="">Chọn danh mục</option>
      <option v-for="c in categories" :key="c.id" :value="c.id">
        {{ c.categoryName }}
      </option>
    </select>
    <div class="product-search-wrap">
      <input
        v-model="productSearch"
        class="pos-search"
        placeholder="Tìm tên/SKU/mã sản phẩm (F2)"
        @focus="showProductDropdown = true"
        @input="showProductDropdown = true"
        @blur="hideProductDropdown"
      />
      <button
        class="search-btn"
        @mousedown.prevent="showProductDropdown = true"
      >
        <i class="bi bi-search"></i>
      </button>
      <div
        v-if="showProductDropdown && products.length"
        class="product-dropdown"
      >
        <div class="product-dropdown-item" v-for="p in products" :key="p.id">
          <img
            v-if="p.coverImageUrl"
            :src="p.coverImageUrl"
            class="product-thumb"
            alt="thumb"
          />
          <div class="product-info">
            <div class="product-name">{{ p.bookName }}</div>
            <div class="product-sku">{{ p.bookCode }}</div>
          </div>
          <div class="product-price">{{ p.price.toLocaleString() }} đ</div>
        </div>
      </div>
    </div>
    <button class="pos-barcode-btn" @click="showScanner = true">
      <i class="bi bi-upc-scan"></i> Quét mã vạch
    </button>

    <!-- Popup quét mã vạch -->
    <div v-if="showScanner" class="barcode-popup">
      <div class="barcode-popup-content">
        <button class="close-btn" @click="showScanner = false">
          <i class="bi bi-x-lg"></i>
        </button>
        <BarcodeScanner
          @detected="onBarcodeDetected"
          @close="showScanner = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAllCategoriesParentNotNull } from "@/services/admin/category";
import { getBookByIdCategory } from "@/services/admin/book"; // Thêm dòng này
import { onMounted, ref, watch } from "vue";
import BarcodeScanner from "./BarcodeScanner.vue";

const categories = ref([]);
const selectedCategory = ref(null);

const products = ref([]);
const productSearch = ref("");
const showProductDropdown = ref(false);
const showScanner = ref(false);

// Theo dõi khi chọn danh mục hoặc nhập search để gọi API
watch([selectedCategory, productSearch], async () => {
  fetchBook();
});

// Khi mở trang, load danh mục
onMounted(() => {
  fetchCategory();
});
const fetchCategory = async () => {
  categories.value = await getAllCategoriesParentNotNull();
  if (categories.value.length) selectedCategory.value = categories.value[0].id;
};
const fetchBook = async () => {
  console.log(
    "selectedCategory: " +
      selectedCategory.value +
      " productSearch: " +
      productSearch.value
  );
  const res = await getBookByIdCategory(
    selectedCategory.value,
    productSearch.value
  );

  console.log("books", res);
  products.value = res;
};
function hideProductDropdown() {
  setTimeout(() => (showProductDropdown.value = false), 150);
}

function onBarcodeDetected(barcode) {
  showScanner.value = false;
  // ... thêm logic tìm kiếm sản phẩm theo barcode
  alert("Đã quét mã: " + barcode);
}
</script>

<style scoped>
.pos-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.pos-warehouse {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  min-width: 150px;
}
.product-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 500px;
}
.pos-search {
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px 0 0 6px;
  border: 1px solid #e5e7eb;
  font-size: 15px;
  outline: none;
}
.search-btn {
  background: #00bfae;
  color: #fff;
  border: none;
  border-radius: 0 6px 6px 0;
  padding: 8px 16px;
  font-size: 20px;
  cursor: pointer;
  height: 38px;
  display: flex;
  align-items: center;
}
.product-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px #e5e7eb33;
  z-index: 10;
  max-height: 320px;
  overflow-y: auto;
}
.product-dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.product-dropdown-item:hover {
  background: #e6f7f4;
}
.product-thumb {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
  background: #f3f3f3;
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.product-name {
  font-weight: 500;
  font-size: 15px;
}
.product-sku {
  color: #888;
  font-size: 13px;
}
.product-price {
  font-weight: 600;
  color: #00bfae;
  min-width: 80px;
  text-align: right;
}
.pos-barcode-btn {
  background: #00bfae;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}
.barcode-popup {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.barcode-popup-content {
  background: #fff;
  border-radius: 10px;
  padding: 24px 32px;
  min-width: 340px;
  min-height: 320px;
  position: relative;
  box-shadow: 0 4px 24px #0001;
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #ff4d4f;
  font-size: 20px;
  cursor: pointer;
}
</style>
