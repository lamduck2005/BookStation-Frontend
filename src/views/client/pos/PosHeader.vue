<template>
  <div class="pos-header">
    <!-- Tìm kiếm sản phẩm (bỏ danh mục) -->
    <div class="product-search-wrap position-relative">
      <input
        v-model="productSearchTerm"
        class="pos-search"
        placeholder="Tìm tên sách/mã sách/tác giả... (F2)"
        @input="onProductSearch"
        @focus="showProductSearchResults = true"
      />
      <button class="search-btn">
        <i class="bi bi-search"></i>
      </button>

      <!-- Dropdown kết quả tìm kiếm -->
      <div
        v-if="showProductSearchResults && productSearchResults.length > 0"
        class="product-dropdown shadow-lg"
      >
        <div
          v-for="book in productSearchResults"
          :key="book.id"
          class="product-dropdown-item cursor-pointer hover-bg-light"
          @mousedown.prevent="addBookToOrder(book)"
        >
          <img
            v-if="book.coverImageUrl"
            :src="book.coverImageUrl"
            class="product-thumb"
            alt="book cover"
          />
          <div
            v-else
            class="product-thumb bg-light d-flex align-items-center justify-content-center"
          >
            <i class="bi bi-book text-muted"></i>
          </div>
          <div class="product-info flex-grow-1">
            <div class="product-name fw-medium">
              {{ book.title || book.name }}
            </div>
            <div class="product-sku text-muted small">{{ book.bookCode }}</div>
            <div class="product-author text-muted small">{{ book.author }}</div>
          </div>
          <div class="product-price-info text-end">
            <div v-if="book.isFlashSale" class="d-flex flex-column">
              <span class="text-danger fw-bold">{{
                formatCurrency(book.flashSalePrice)
              }}</span>
              <span class="text-muted text-decoration-line-through small">{{
                formatCurrency(book.normalPrice)
              }}</span>
              <span class="badge bg-danger small">Flash Sale</span>
            </div>
            <div v-else class="fw-semibold text-success">
              {{ formatCurrency(book.normalPrice) }}
            </div>
            <div class="stock-info small text-muted">
              Kho: {{ book.stockQuantity || 0 }}
            </div>
          </div>
        </div>

        <!-- Hiển thị khi không có kết quả -->
        <div
          v-if="productSearchTerm && productSearchResults.length === 0"
          class="text-center p-3 text-muted"
        >
          <i class="bi bi-search"></i>
          <div>Không tìm thấy sản phẩm nào</div>
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
import { ref, onMounted, onUnmounted } from "vue";
import { getBooksDropdown, getBookByIsbn } from "@/services/admin/book";
import BarcodeScanner from "./BarcodeScanner.vue";

// Emit để gửi sản phẩm được chọn lên component cha
const emit = defineEmits(["add-product"]);

// Product search states
const productSearchTerm = ref("");
const productSearchResults = ref([]);
const showProductSearchResults = ref(false);
const showScanner = ref(false);
const scanning = ref(false);
let productSearchTimeout = null;

// Methods
const onProductSearch = async () => {
  // Clear previous timeout
  if (productSearchTimeout) {
    clearTimeout(productSearchTimeout);
  }

  // Set new timeout for debounced search
  productSearchTimeout = setTimeout(async () => {
    if (productSearchTerm.value.trim().length >= 1) {
      try {
        const response = await getBooksDropdown({
          search: productSearchTerm.value.trim(),
          limit: 10,
        });
        productSearchResults.value = response.data || [];
      } catch (error) {
        console.error("Error searching products:", error);
        productSearchResults.value = [];
      }
    } else {
      productSearchResults.value = [];
    }
  }, 300);
};

const addBookToOrder = (book) => {
  // Emit sự kiện để POS component cha xử lý
  emit("add-product", book);

  // Clear search
  clearProductSearch();
};

const clearProductSearch = () => {
  productSearchTerm.value = "";
  productSearchResults.value = [];
  showProductSearchResults.value = false;
};

// Click outside to close dropdown
const handleClickOutside = (event) => {
  const searchContainer = event.target.closest(".product-search-wrap");
  if (!searchContainer) {
    showProductSearchResults.value = false;
  }
};

const onBarcodeDetected = async (isbn) => {
  if (scanning.value) return;
  scanning.value = true;
  try {
    const resp = await getBookByIsbn(isbn);
    const data = resp?.data;
    console.log("RAW book data:", data);

    if (!data) {
      toast.warning("Không tìm thấy sách với mã: " + isbn);
      return;
    }

    // Chuẩn hoá các khả năng tên field giá
    const rawNormalPrice =
      data.normalPrice ??
      data.price ??
      data.sellingPrice ??
      data.salePrice ??
      data.originalPrice ??
      0;

    const rawFlashPrice =
      data.flashSalePrice ?? data.flash_price ?? data.flashSale?.price ?? null;

    const normalPrice = Number(rawNormalPrice) || 0;
    const flashSalePrice =
      rawFlashPrice !== null && rawFlashPrice !== undefined
        ? Number(rawFlashPrice)
        : null;

    const isFlashSale = flashSalePrice !== null && !isNaN(flashSalePrice);

    const unitPrice = isFlashSale ? flashSalePrice : normalPrice;

    const book = {
      id: data.id,
      bookId: data.id,
      title: data.title || data.name,
      name: data.title || data.name,
      bookCode: data.bookCode || data.isbn || isbn,
      normalPrice,
      flashSalePrice,
      isFlashSale,
      unitPrice, // <-- thêm trực tiếp
      flashSaleItemId: data.flashSaleItemId || null,
      stockQuantity: data.stockQuantity ?? data.quantity ?? 0,
      coverImageUrl: data.coverImageUrl || data.imageUrl,
    };
    console.log("Book chuẩn hoá:", book);

    emit("add-product", book);
    toast.success("Đã thêm: " + book.title);
    closeScanner();
  } catch (e) {
    console.error(e);
    toast.error(e.response?.data?.message || "Lỗi lấy sách");
  } finally {
    scanning.value = false;
  }
};

// Sửa formatCurrency
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  // Keyboard shortcut F2 for search focus
  document.addEventListener("keydown", (e) => {
    if (e.key === "F2") {
      e.preventDefault();
      document.querySelector(".pos-search")?.focus();
    }
  });
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  if (productSearchTimeout) {
    clearTimeout(productSearchTimeout);
  }
});
</script>

<style scoped>
.pos-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.product-search-wrap {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 600px;
}

.pos-search {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px 0 0 8px;
  border: 2px solid #e5e7eb;
  font-size: 15px;
  outline: none;
  transition: border-color 0.3s ease;
}

.pos-search:focus {
  border-color: #00bfae;
  box-shadow: 0 0 0 0.2rem rgba(0, 191, 174, 0.25);
}

.search-btn {
  background: #00bfae;
  color: #fff;
  border: none;
  border-radius: 0 8px 8px 0;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  height: 46px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background: #009688;
}

.product-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.product-dropdown-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
}

.product-dropdown-item:last-child {
  border-bottom: none;
}

.product-dropdown-item:hover {
  background: #e6f7f4;
  transform: translateX(2px);
}

.product-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.product-info {
  min-width: 0;
}

.product-name {
  font-weight: 500;
  font-size: 15px;
  color: #1e293b;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-sku,
.product-author {
  color: #64748b;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price-info {
  min-width: 120px;
}

.stock-info {
  margin-top: 4px;
}

.pos-barcode-btn {
  background: #00bfae;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.pos-barcode-btn:hover {
  background: #009688;
  transform: translateY(-1px);
}

.barcode-popup {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.barcode-popup-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px 32px;
  min-width: 400px;
  min-height: 350px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #ef4444;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #dc2626;
}

/* Responsive */
@media (max-width: 768px) {
  .pos-header {
    flex-direction: column;
    gap: 8px;
  }

  .product-search-wrap {
    max-width: 100%;
  }

  .pos-barcode-btn {
    align-self: stretch;
  }
}

/* Utility classes */
.cursor-pointer {
  cursor: pointer;
}

.hover-bg-light:hover {
  background-color: #f8f9fa !important;
}
</style>
