<template>
  <div class="admin-page container-fluid py-4">
    <OverviewStatsComponent :stats="stats" />

    <!-- ========== BỘ LỌC FLASH SALE ITEM ========== -->
    <div class="card mb-5 shadow-lg border-0 filter-card">
      <div class="card-header bg-light border-0 py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-funnel me-2"></i>
            Bộ lọc tìm kiếm
          </h5>
          <button
            class="btn btn-sm btn-outline-secondary"
            type="button"
            @click="toggleFilter"
            :aria-expanded="showFilter"
          >
            <i
              :class="showFilter ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"
            ></i>
            {{ showFilter ? "Thu gọn" : "Mở rộng" }}
          </button>
        </div>
      </div>
      <div
        class="card-body filter-collapse"
        :class="{ 'filter-collapsed': !showFilter }"
      >
        <div class="row g-4">
          <!-- <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-lightning-charge me-1"></i>
              FlashSale ID
            </label>
            <input type="number" class="form-control" v-model="filter.flashSaleId" placeholder="FlashSale ID" />
          </div> -->
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-book me-1"></i>
              Tên sách
            </label>
            <input
              type="text"
              class="form-control"
              v-model="filter.bookName"
              placeholder="Nhập tên sách..."
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-toggle-on me-1"></i>
              Trạng thái
            </label>
            <select class="form-select" v-model="filter.status">
              <option value="">Tất cả</option>
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Giá giảm tối thiểu</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.minPrice"
              placeholder="Min price"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">Giá giảm tối đa</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.maxPrice"
              placeholder="Max price"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">% giảm tối thiểu</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.minPercent"
              placeholder="Min %"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">% giảm tối đa</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.maxPercent"
              placeholder="Max %"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">Tồn kho tối thiểu</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.minQuantity"
              placeholder="Min qty"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">Tồn kho tối đa</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.maxQuantity"
              placeholder="Max qty"
            />
          </div>
        </div>
        <div class="row g-3 pt-3 d-flex justify-content-center">
          <div class="col-md-1">
            <button
              class="btn btn-success w-100 me-2"
              @click="searchWithFilter"
            >
              <i class="bi bi-funnel"></i> Lọc
            </button>
          </div>
          <div class="col-md-2">
            <button class="btn btn-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle me-1"></i> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================== BẢNG FLASH SALE ITEM ================== -->
    <div class="card shadow-lg border-0 mb-4 admin-table-card">
      <div
        class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3"
      >
        <div>
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-list-ul me-2"></i>
            Danh sách sản phẩm trong {{ flashSaleName || "Flash Sale" }}
          </h5>
        </div>
        <div class="d-flex gap-2">
          <button
            class="btn btn-outline-info btn-sm py-2"
            @click="reloadPage"
            :disabled="loading"
          >
            <i class="bi bi-arrow-repeat me-1"></i> Làm mới
          </button>
          <button
            class="btn btn-primary btn-sm py-2"
            style="background-color: #33304e; border-color: #33304e"
            @click="openAddForm"
          >
            <i class="bi bi-plus-circle me-1"></i> Thêm mới
          </button>
        </div>
      </div>
      <div class="card-body p-0" :class="{ loading: loading }">
        <div class="loading-overlay" :class="{ show: loading }">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p>Đang tải dữ liệu...</p>
        </div>
        <div v-if="error" class="alert alert-danger m-4" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ error }}
          <button
            class="btn btn-sm btn-outline-danger ms-2"
            @click="getDataFromApi(currentPage, pageSize)"
          >
            Thử lại
          </button>
        </div>
        <div v-else>
          <table class="table align-middle table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 40px">#</th>
                <th>Sách</th>
                <th>Giá giảm</th>
                <th>% Giảm</th>
                <th>Số lượng sản phẩm khuyến mãi</th>
                <th>Giới hạn/người</th>
                <th style="width: 200px">Trạng thái</th>
                <th style="width: 120px">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="items.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="(item, index) in items" :key="item.id">
                <td class="py-3">{{ currentPage * pageSize + index + 1 }}</td>
                <td class="py-3">{{ item.bookName }}</td>
                <td class="py-3">{{ formatCurrency(item.discountPrice) }}</td>
                <td class="py-3">{{ item.discountPercentage }}%</td>
                <td class="py-3">{{ item.stockQuantity }}</td>
                <td class="py-3">{{ item.maxPurchasePerUser }}</td>
                <td class="py-3">
                  <ToggleStatus
                    :id="item.id"
                    v-model="item.status"
                    :true-value="1"
                    :false-value="0"
                    active-text="Hoạt động"
                    inactive-text="Không hoạt động"
                    @change="handleStatusChange(item)"
                  />
                </td>
                <td class="py-3">
                  <EditButton @click="openEditForm(item)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-3">
          <Pagination
            :page-number="currentPage"
            :total-pages="totalPages"
            :is-last-page="isLastPage"
            :page-size="pageSize"
            :items-per-page-options="itemsPerPageOptions"
            :total-elements="totalElements"
            @prev="handlePrev"
            @next="handleNext"
            @update:pageSize="handlePageSizeChange"
          />
        </div>
      </div>
    </div>
    <!-- ================== HẾT BẢNG ================== -->

    <!-- Modal Thêm/Sửa Item -->
    <div
      class="modal fade"
      id="formModal"
      tabindex="-1"
      aria-labelledby="formModalLabel"
      aria-hidden="true"
      style="z-index: 10000"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- ✅ Đổi từ .modal-header thành .form-modal-header -->
          <div class="modal-header form-modal-header">
            <h5 class="modal-title" id="formModalLabel">
              <i class="bi bi-bag-plus me-2"></i>
              {{
                isEditMode
                  ? "Chỉnh sửa sản phẩm Flash Sale"
                  : "Thêm sản phẩm Flash Sale"
              }}
            </h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <!-- ✅ Đổi từ .modal-body thành .form-modal-body -->
          <div class="modal-body form-modal-body">
            <div class="mb-3">
              <label class="form-label">
                Sách <span class="text-danger">*</span>
              </label>
              <select
                class="form-select"
                v-model="formData.bookId"
                required
                :disabled="isEditMode || loadingBooks"
              >
                <option value="">
                  {{
                    loadingBooks ? "Đang tải danh sách sách..." : "Chọn sách"
                  }}
                </option>
                <option
                  v-for="book in availableBooks"
                  :key="book.bookId"
                  :value="book.bookId"
                >
                  [ID: {{ book.bookId }}] {{ book.bookName }} -
                  {{ formatCurrency(book.price) }} (Tồn:
                  {{ book.stockQuantity }})
                </option>
              </select>

              <!-- Loading indicator -->
              <div v-if="loadingBooks" class="form-text text-muted">
                <i class="bi bi-arrow-repeat spinner-border-sm me-1"></i>
                Đang tải danh sách sách...
              </div>

              <!-- No books available -->
              <div
                v-else-if="availableBooks.length === 0"
                class="form-text text-warning"
              >
                <i class="bi bi-exclamation-triangle me-1"></i>
                Không có sách nào khả dụng
              </div>
            </div>

            <!-- Hiển thị thông tin sách đã chọn -->
            <div v-if="selectedBookInfo" class="mb-3">
              <div class="alert alert-info py-2">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{{ selectedBookInfo.bookName }}</strong
                    ><br />
                    <small class="text-muted">
                      Giá gốc: {{ formatCurrency(selectedBookInfo.price) }} |
                      Tồn kho: {{ selectedBookInfo.stockQuantity }}
                    </small>
                  </div>
                  <div class="text-end">
                    <small class="badge bg-success"
                      >ID: {{ selectedBookInfo.bookId }}</small
                    >
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedBookInfo">
              <div class="mb-3">
                <label class="form-label">
                  % Giảm <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  v-model="formData.discountPercentage"
                  required
                  :min="0"
                  :max="100"
                  placeholder="Nhập % giảm (0-100)"
                />
                <div
                  v-if="formData.discountPrice"
                  class="form-text text-success"
                >
                  Giá sau giảm: {{ formatCurrency(formData.discountPrice) }}
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">
                  Giá giảm <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  v-model="formData.discountPrice"
                  required
                  disabled
                  :min="0"
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">
                Số lượng sản phẩm khuyến mãi <span class="text-danger">*</span>
              </label>
              <input
                type="number"
                class="form-control"
                :class="{
                  'is-invalid':
                    selectedBookInfo &&
                    formData.stockQuantity &&
                    !isStockQuantityValid,
                }"
                v-model="formData.stockQuantity"
                required
                :min="1"
                :max="selectedBookInfo ? selectedBookInfo.stockQuantity : 9999"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="Nhập số lượng"
              />

              <!-- Hiển thị thông báo lỗi khi tồn kho không hợp lệ -->
              <div
                v-if="
                  selectedBookInfo &&
                  formData.stockQuantity &&
                  !isStockQuantityValid
                "
                class="invalid-feedback d-block"
              >
                <i class="bi bi-exclamation-triangle me-1"></i>
                {{ stockErrorMessage }}
              </div>

              <!-- Hiển thị thông tin hữu ích -->
              <div v-else-if="selectedBookInfo" class="form-text text-muted">
                <i class="bi bi-info-circle me-1"></i>
                Tối đa: {{ selectedBookInfo.stockQuantity }} (tồn kho sách)
              </div>

              <!-- Hiển thị thông báo khi chưa chọn sách -->
              <div
                v-else-if="!selectedBookInfo && formData.stockQuantity"
                class="form-text text-warning"
              >
                <i class="bi bi-exclamation-triangle me-1"></i>
                Vui lòng chọn sách trước
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">
                Giới hạn mỗi người <span class="text-danger">*</span>
              </label>
              <input
                type="number"
                class="form-control"
                v-model="formData.maxPurchasePerUser"
                required
                :min="1"
                :max="9999"
                placeholder="Nhập giới hạn mỗi người"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Trạng thái</label>
              <select class="form-select" v-model="formData.status">
                <option :value="1">Hoạt động</option>
                <option :value="0">Không hoạt động</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <!-- ✅ Đổi button classes -->
            <button
              type="button"
              class="btn form-btn-secondary"
              @click="closeModal"
            >
              Đóng
            </button>
            <button
              type="button"
              class="btn form-btn-primary"
              :disabled="
                selectedBookInfo &&
                formData.stockQuantity &&
                !isStockQuantityValid
              "
              @click="handleSubmitForm"
            >
              {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { Modal } from "bootstrap";
import { showToast } from "@/utils/swalHelper.js";
import EditButton from "@/components/common/EditButton.vue";
import Pagination from "@/components/common/Pagination.vue";
import ToggleStatus from "@/components/common/ToggleStatus.vue";
import {
  getAllFlashSaleItem,
  addFlashSaleItem,
  updateFlashSaleItem,
  toggleStatusFlashSaleItem,
  getFlashSaleItemStats,
} from "@/services/admin/flashSaleItem.js";
import { useRoute } from "vue-router";
import {
  getActiveBooksWithStock,
  getActiveBooksForEdit,
} from "@/services/admin/book";
import OverviewStatsComponent from "@/components/common/OverviewStatsComponent.vue";

const route = useRoute();
const defaultFlashSaleId = route.params.id ? parseInt(route.params.id) : "";

// Filter object
const filter = ref({
  flashSaleId: defaultFlashSaleId,
  bookName: "", // ✅ Đổi từ bookId thành bookName
  status: "",
  minPrice: "",
  maxPrice: "",
  minPercent: "",
  maxPercent: "",
  minQuantity: "",
  maxQuantity: "",
});

const items = ref([]);
const flashSaleName = ref("");

// Pagination
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

const loading = ref(false);
const error = ref(null);

const isEditMode = ref(false);
const formData = ref({
  id: "",
  bookId: "",
  discountPrice: "",
  discountPercentage: "",
  stockQuantity: "",
  maxPurchasePerUser: "",
  status: 1,
});

// Books loading
const loadingBooks = ref(false);
const availableBooks = ref([]);

// Stats
const stats = ref([
  { label: "Số sách trong flash sale", value: 0 },
  { label: "Số sách flash đã bán", value: 0 },
  { label: "Sách được mua nhiều nhất trong flash sale", value: "" },
  { label: "Tồn kho flash sale", value: 0 },
]);

// Helper: currency
function formatCurrency(value) {
  if (value === null || value === undefined) return "";
  return Number(value).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

// ✅ Computed để hiển thị thông tin sách đã chọn
const selectedBookInfo = computed(() => {
  console.log("=== selectedBookInfo DEBUG ===");
  console.log("formData.bookId:", formData.value.bookId);
  console.log("availableBooks.length:", availableBooks.value.length);

  if (!formData.value.bookId || !availableBooks.value.length) {
    console.log("❌ No bookId or no books available");
    return null;
  }

  const bookId = parseInt(formData.value.bookId);
  console.log("Looking for book with ID:", bookId);

  // ✅ SỬA: Dùng book.bookId thay vì book.id
  const foundBook = availableBooks.value.find((book) => {
    const match = book.bookId === bookId;
    console.log(`Checking: ${book.bookId} === ${bookId} ? ${match}`);
    return match;
  });

  if (foundBook) {
    console.log("✅ Found book object:", foundBook);
    console.log("✅ Book details:", {
      bookId: foundBook.bookId,
      name: foundBook.bookName,
      price: foundBook.price,
      stock: foundBook.stockQuantity,
    });
  } else {
    console.log("❌ Book not found!");
    console.log(
      "Available bookIds:",
      availableBooks.value.map((b) => b.bookId)
    );
  }

  return foundBook;
});

const computedDiscountPrice = computed(() => {
  if (!selectedBookInfo.value || !formData.value.discountPercentage) return "";
  const price = selectedBookInfo.value.price;
  const percent = parseFloat(formData.value.discountPercentage);
  if (isNaN(price) || isNaN(percent)) return "";
  // Tính giá giảm
  return Math.round(price * (1 - percent / 100));
});

// Load books for Add mode
const loadAvailableBooks = async () => {
  try {
    loadingBooks.value = true;
    const response = await getActiveBooksWithStock();

    console.log("=== DEBUG: Books API Response ===");
    console.log("Full response:", response);

    let booksData = [];
    if (response && response.data && response.data.data) {
      booksData = response.data.data;
    } else if (response && response.data) {
      booksData = response.data;
    } else if (Array.isArray(response)) {
      booksData = response;
    } else {
      booksData = [];
    }

    availableBooks.value = booksData;
    console.log("Available books:", availableBooks.value);
  } catch (error) {
    console.error("Lỗi khi tải danh sách sách:", error);
    availableBooks.value = [];
    showToast("error", "Không thể tải danh sách sách");
  } finally {
    loadingBooks.value = false;
  }
};

// Load books for Edit mode
const loadBooksForEdit = async () => {
  try {
    loadingBooks.value = true;
    const response = await getActiveBooksForEdit();

    console.log("=== DEBUG: Books For Edit API Response ===");
    console.log("Full response:", response);

    let booksData = [];
    if (response && response.data && response.data.data) {
      booksData = response.data.data;
    } else if (response && response.data) {
      booksData = response.data;
    } else if (Array.isArray(response)) {
      booksData = response;
    } else {
      booksData = [];
    }

    availableBooks.value = booksData;
    console.log("Books for edit loaded:", availableBooks.value);
  } catch (error) {
    console.error("Lỗi khi tải danh sách sách cho edit:", error);
    availableBooks.value = [];
    showToast("error", "Không thể tải danh sách sách cho chỉnh sửa");
  } finally {
    loadingBooks.value = false;
  }
};

// API
const getDataFromApi = async (page, size) => {
  loading.value = true;
  error.value = null;
  try {
    const params = { page, size };
    Object.entries(filter.value).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) params[key] = val;
    });
    const res = await getAllFlashSaleItem(defaultFlashSaleId, params);
    const resData = res.data.data;
    if (res && res.status === 200 && resData) {
      items.value = resData.content;
      currentPage.value = resData.pageNumber;
      pageSize.value = resData.pageSize;
      totalElements.value = resData.totalElements;
      totalPages.value = resData.totalPages;
      isLastPage.value = currentPage.value >= totalPages.value - 1;
      if (resData.content && resData.content.length > 0) {
        flashSaleName.value = resData.content[0].flashSaleName || "";
      }
    } else {
      items.value = [];
      totalElements.value = 0;
      totalPages.value = 1;
      isLastPage.value = true;
    }
  } catch (err) {
    error.value = "Lỗi khi tải dữ liệu!";
    items.value = [];
  } finally {
    loading.value = false;
  }
};

// Fetch stats
const fetchStats = async () => {
  try {
    const res = await getFlashSaleItemStats(defaultFlashSaleId);
    const data = res.data.data;
    stats.value = [
      { label: "SỐ SÁCH TRONG FLASH SALE", value: data.totalBooksInFlashSale },
      { label: "SỐ SÁCH FLASH ĐÃ BÁN", value: data.totalBooksSoldInFlashSale },
      {
        label: "SÁCH ĐƯỢC MUA NHIỀU NHẤT TRONG FLASH SALE",
        value: data.topSellingBookName || "—",
      },
      { label: "TỒN KHO FLASH SALE", value: data.totalFlashSaleStock },
    ];
  } catch (e) {
    stats.value = [
      { label: "SỐ SÁCH TRONG FLASH SALE", value: 0 },
      { label: "SỐ SÁCH FLASH ĐÃ BÁN", value: 0 },
      { label: "SÁCH ĐƯỢC MUA NHIỀU NHẤT TRONG FLASH SALE", value: "—" },
      { label: "TỒN KHO FLASH SALE", value: 0 },
    ];
  }
};

// Filter actions
const searchWithFilter = () => {
  getDataFromApi(0, pageSize.value);
};

const clearFilters = () => {
  filter.value = {
    flashSaleId: defaultFlashSaleId,
    bookName: "", // ✅ Đổi từ bookId thành bookName
    status: "",
    minPrice: "",
    maxPrice: "",
    minPercent: "",
    maxPercent: "",
    minQuantity: "",
    maxQuantity: "",
  };
  getDataFromApi(0, pageSize.value);
};

// Reload
const reloadPage = () => {
  getDataFromApi(currentPage.value, pageSize.value);
};

// Toggle status
const handleStatusChange = async (item) => {
  try {
    await toggleStatusFlashSaleItem(defaultFlashSaleId, item.id);
    showToast("success", "Thay đổi trạng thái thành công!");
  } catch (error) {
    showToast("error", error.response?.data?.message || "Có lỗi xảy ra!");
  }
};

// Reset form data
const resetFormData = () => {
  formData.value = {
    id: "",
    bookId: "",
    discountPrice: "",
    discountPercentage: "",
    stockQuantity: "",
    maxPurchasePerUser: "",
    status: 1,
  };
};

// Modal actions
const openAddForm = async () => {
  isEditMode.value = false;
  resetFormData();
  await loadAvailableBooks();
  const modal = Modal.getOrCreateInstance(document.getElementById("formModal"));
  modal.show();
};

const openEditForm = async (item) => {
  isEditMode.value = true;
  await loadBooksForEdit();

  formData.value = {
    id: item.id,
    bookId: item.bookId,
    discountPrice: item.discountPrice,
    discountPercentage: item.discountPercentage,
    stockQuantity: item.stockQuantity,
    maxPurchasePerUser: item.maxPurchasePerUser,
    status: item.status,
  };
  const modal = Modal.getOrCreateInstance(document.getElementById("formModal"));
  modal.show();
};

const validateForm = () => {
  const f = formData.value;

  if (!f.bookId) {
    showToast("error", "Vui lòng chọn sách!");
    return false;
  }

  // ✅ Kiểm tra tồn kho flash sale không được vượt quá tồn kho sách
  if (
    selectedBookInfo.value &&
    formData.value.stockQuantity &&
    !isStockQuantityValid.value
  ) {
    showToast("error", stockErrorMessage.value);
    return false;
  }

  if (
    f.discountPercentage === "" ||
    f.discountPercentage === null ||
    isNaN(f.discountPercentage)
  ) {
    showToast("error", "Vui lòng nhập % giảm!");
    return false;
  }
  if (f.discountPercentage < 0 || f.discountPercentage > 100) {
    showToast("error", "% giảm phải từ 0 đến 100!");
    return false;
  }
  if (
    f.discountPrice === "" ||
    f.discountPrice === null ||
    isNaN(f.discountPrice)
  ) {
    showToast("error", "Vui lòng nhập giá giảm!");
    return false;
  }
  if (f.discountPrice < 0) {
    showToast("error", "Giá giảm phải lớn hơn hoặc bằng 0!");
    return false;
  }
  if (
    f.stockQuantity === "" ||
    f.stockQuantity === null ||
    isNaN(Number(f.stockQuantity)) ||
    !/^\d+$/.test(f.stockQuantity)
  ) {
    showToast("error", "Số lượng sản phẩm khuyến mãi phải là số nguyên dương!");
    return false;
  }
  if (Number(f.stockQuantity) < 0) {
    showToast(
      "error",
      "Số lượng sản phẩm khuyến mãi phải lớn hơn hoặc bằng 0!"
    );
    return false;
  }
  if (
    f.maxPurchasePerUser === "" ||
    f.maxPurchasePerUser === null ||
    isNaN(Number(f.maxPurchasePerUser)) ||
    !/^\d+$/.test(f.maxPurchasePerUser)
  ) {
    showToast("error", "Giới hạn mỗi người phải là số nguyên dương!");
    return false;
  }
  if (Number(f.maxPurchasePerUser) <= 0) {
    showToast("error", "Giới hạn mỗi người phải lớn hơn 0!");
    return false;
  }
  if (f.status !== 0 && f.status !== 1) {
    showToast("error", "Vui lòng chọn trạng thái!");
    return false;
  }

  return true;
};

const handleSubmitForm = async () => {
  try {
    if (!validateForm()) return;
    const submitData = {
      flashSaleId: defaultFlashSaleId,
      bookId: parseInt(formData.value.bookId),
      discountPrice: parseFloat(formData.value.discountPrice),
      discountPercentage: parseFloat(formData.value.discountPercentage),
      stockQuantity: parseInt(formData.value.stockQuantity),
      maxPurchasePerUser: parseInt(formData.value.maxPurchasePerUser),
      status: parseInt(formData.value.status),
    };
    if (!isEditMode.value) {
      await addFlashSaleItem(defaultFlashSaleId, submitData);
      showToast("success", "Thêm mới thành công!");
    } else {
      await updateFlashSaleItem(
        defaultFlashSaleId,
        formData.value.id,
        submitData
      );
      showToast("success", "Cập nhật thành công!");
    }
    closeModal();
    await getDataFromApi(currentPage.value, pageSize.value);
  } catch (error) {
    // ✅ Sửa lại để lấy đúng message từ API
    const apiMessage = error?.response?.data?.message || "Có lỗi xảy ra!";
    showToast("error", apiMessage);
  }
};

const closeModal = () => {
  const modal = Modal.getOrCreateInstance(document.getElementById("formModal"));
  modal.hide();
};

const handlePrev = () => {
  if (currentPage.value > 0)
    getDataFromApi(currentPage.value - 1, pageSize.value);
};
const handleNext = () => {
  if (!isLastPage.value) getDataFromApi(currentPage.value + 1, pageSize.value);
};
const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  getDataFromApi(0, newSize);
};

// ✅ Thêm debounce search
let searchTimeout = null;

// ✅ Watch bookName để auto search
watch(
  () => filter.value.bookName,
  (newBookName) => {
    clearTimeout(searchTimeout);
    if (newBookName !== "") {
      searchTimeout = setTimeout(() => {
        searchWithFilter();
      }, 800); // Tự động search sau 800ms
    }
  }
);

// ✅ Watch discountPercentage để tự động tính giá giảm
watch(
  () => formData.value.discountPercentage,
  (newPercent) => {
    if (
      selectedBookInfo.value &&
      newPercent !== "" &&
      !isNaN(selectedBookInfo.value.price) &&
      !isNaN(newPercent)
    ) {
      formData.value.discountPrice = Math.round(
        selectedBookInfo.value.price * (1 - parseFloat(newPercent) / 100)
      );
    }
  }
);

onMounted(() => {
  fetchStats();
  getDataFromApi(currentPage.value, pageSize.value);
  loadAvailableBooks(); // Load sẵn danh sách sách
});

const showFilter = ref(false);
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

// ✅ Computed để kiểm tra tồn kho có hợp lệ không - WITH DEBUG
const isStockQuantityValid = computed(() => {
  console.log("=== isStockQuantityValid DEBUG ===");
  console.log("selectedBookInfo:", selectedBookInfo.value);
  console.log("formData.stockQuantity:", formData.value.stockQuantity);

  // Kiểm tra null/undefined trước
  if (!selectedBookInfo.value || !formData.value.stockQuantity) {
    console.log("❌ Missing data, returning true");
    return true;
  }

  const flashSaleStock = parseInt(formData.value.stockQuantity);
  const bookStock = parseInt(selectedBookInfo.value.stockQuantity);

  console.log("flashSaleStock (parsed):", flashSaleStock);
  console.log("bookStock (parsed):", bookStock);
  console.log("flashSaleStock <= bookStock:", flashSaleStock <= bookStock);

  // Kiểm tra NaN
  if (isNaN(flashSaleStock) || isNaN(bookStock)) {
    console.log("❌ NaN values detected, returning true");
    return true;
  }

  const isValid = flashSaleStock <= bookStock;
  console.log("✅ Final result:", isValid);
  return isValid;
});

// ✅ Message lỗi cho tồn kho - WITH DEBUG
const stockErrorMessage = computed(() => {
  console.log("=== stockErrorMessage DEBUG ===");

  if (!selectedBookInfo.value || !formData.value.stockQuantity) {
    console.log("❌ No data for error message");
    return "";
  }

  const flashSaleStock = parseInt(formData.value.stockQuantity);
  const bookStock = parseInt(selectedBookInfo.value.stockQuantity);

  console.log("Error check - flashSaleStock:", flashSaleStock);
  console.log("Error check - bookStock:", bookStock);

  if (isNaN(flashSaleStock) || isNaN(bookStock)) {
    console.log("❌ NaN in error message");
    return "";
  }

  if (flashSaleStock > bookStock) {
    const message = `Số lượng flash sale (${flashSaleStock}) không được vượt quá tồn kho sách (${bookStock})`;
    console.log("📢 Error message:", message);
    return message;
  }

  console.log("✅ No error message needed");
  return "";
});
</script>

<style scoped>
@import "@/assets/css/admin-global.css";
@import "@/assets/css/form-global.css";

/* ========== FLASH SALE DETAIL SPECIFIC OVERRIDES ========== */
.form-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #ffffff !important;
}

.form-modal-body {
  background-color: #ffffff !important;
}

/* ========== MODAL SPECIFIC ========== */
.modal-content {
  border-radius: 15px !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2) !important;
  border: none !important;
  overflow: hidden;
}

.modal-dialog {
  max-width: 650px !important;
}

.modal-footer {
  background-color: #f8f9fa !important;
  border-top: 1px solid #dee2e6 !important;
  padding: 1rem 2rem !important;
}

/* ========== ALERT STYLING ========== */
.alert-info {
  background-color: #e7f3ff !important;
  border-color: #b3d9ff !important;
  color: #0c5460 !important;
  border-radius: 8px !important;
}

/* ========== FORM VALIDATION ========== */
.is-invalid {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.invalid-feedback {
  display: block !important;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545 !important;
}

.form-text.text-muted {
  color: #6c757d !important;
}

.form-text.text-warning {
  color: #856404 !important;
}

.form-text.text-success {
  color: #155724 !important;
}

/* ========== FILTER COLLAPSE ========== */
.filter-collapse {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.filter-collapsed {
  max-height: 0;
  opacity: 0;
  padding: 0 1.25rem;
}

/* ========== LOADING OVERLAY ========== */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.8rem;
  z-index: 10;
}

.loading-overlay.show {
  display: flex;
}

.loading-overlay .spinner-border {
  width: 2rem;
  height: 2rem;
  margin-bottom: 0.5rem;
}

/* ========== TABLE STYLING ========== */
.admin-table-card {
  border-radius: 12px !important;
  border: none !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.admin-table-card .card-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  border-bottom: 2px solid #e9ecef !important;
  border-radius: 12px 12px 0 0 !important;
}

.admin-table-card .card-header h5 {
  font-weight: 700 !important;
  color: #333 !important;
}

/* ========== FORM SELECT DISABLED ========== */
.form-select:disabled {
  background-color: #f8f9fa !important;
  opacity: 0.7;
  cursor: not-allowed;
}

/* ========== BADGE ========== */
.badge {
  font-size: 0.75rem;
}

/* ========== BUTTON DISABLED ========== */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
  .modal-dialog {
    max-width: 95vw !important;
    margin: 1rem auto !important;
  }

  .form-modal-body {
    padding: 1rem !important;
  }
}
</style>
