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
          <div class="modal-header">
            <h5 class="modal-title" id="formModalLabel">
              {{ isEditMode ? "Chỉnh sửa" : "Thêm mới" }}
            </h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitForm">
              <div class="mb-3">
                <label class="form-label"
                  >Book Name <span class="text-danger">*</span></label
                >
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
                    <!-- ✅ SỬA: Dùng book.bookId làm key và value -->
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
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
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
                  <label class="form-label"
                    >% Giảm <span class="text-danger">*</span></label
                  >
                  <input
                    type="number"
                    step="0.01"
                    class="form-control"
                    v-model="formData.discountPercentage"
                    required
                    :min="0"
                    :max="100"
                  />
                  <div
                    v-if="formData.discountPrice"
                    class="form-text text-success"
                  >
                    Giá sau giảm: {{ formatCurrency(formData.discountPrice) }}
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label"
                    >Giá giảm <span class="text-danger">*</span></label
                  >
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
                <label class="form-label"
                  >Số lượng sản phẩm khuyến mãi
                  <span class="text-danger">*</span></label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model="formData.stockQuantity"
                  required
                  :min="1"
                  :max="9999"
                  inputmode="numeric"
                  pattern="[0-9]*"
                />
              </div>
              <div class="mb-3">
                <label class="form-label"
                  >Giới hạn mỗi người <span class="text-danger">*</span></label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model="formData.maxPurchasePerUser"
                  required
                  :min="1"
                  :max="9999"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" v-model="formData.status">
                  <option :value="1">Hoạt động</option>
                  <option :value="0">Không hoạt động</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Đóng
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleSubmitForm"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"; // ✅ Thêm watch
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
</script>

<style scoped>
@import "@/assets/css/admin-global.css";

.table th,
.table td {
  vertical-align: middle;
}

.modal-dialog {
  max-width: 650px !important;
}

.custom-close-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.modal-content {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: none;
}

.modal-header {
  border-bottom: 2px solid #ecae9e;
  border-radius: 15px 15px 0 0;
  padding: 0.8rem 1.2rem;
  position: relative;
}

.modal-title {
  font-weight: 600;
  color: #2c2c54;
  font-size: 1.1rem;
}

.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
}

.filter-card,
.flashsale-table-card {
  border-radius: 0.8rem !important;
  overflow: hidden;
}

.alert-info {
  background-color: #e7f3ff;
  border-color: #b3d9ff;
  color: #0c5460;
  border-radius: 8px; /* ✅ Sửa: Xóa 'auto;' không hợp lệ */
}

.form-text {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-select:disabled {
  background-color: #f8f9fa;
  opacity: 0.7;
  cursor: not-allowed;
}

.badge {
  font-size: 0.75rem;
}

.form-select option {
  padding: 8px 12px;
}

.form-select option:hover {
  background-color: #f8f9fa;
}

/* New styles for admin page */
.admin-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.admin-table-card {
  border-radius: 0.8rem !important;
  overflow: hidden;
}

.card-header {
  position: relative;
  z-index: 1;
}

.card-header::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    #f4f7fa 100%
  );
  z-index: -1;
}

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

.filter-collapse {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.filter-collapsed {
  max-height: 0;
  opacity: 0;
  padding: 0;
  margin: 0;
}

.card-header .btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.card-header h5 {
  margin-bottom: 0;
  font-size: 1.125rem;
}

.card-header .bi {
  font-size: 1.25rem;
}

.table th {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 2;
}

.table td {
  padding: 1rem;
}

.table-hover tbody tr:hover {
  background-color: #f1f3f5;
}

.alert {
  border-radius: 0.8rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #218838;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}
</style>
