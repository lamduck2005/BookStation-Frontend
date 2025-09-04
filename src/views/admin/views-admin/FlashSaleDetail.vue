<template>
  <div class="admin-page container-fluid py-4">
    <OverviewStatsComponent :stats="stats" />

    <!-- Bộ lọc tìm kiếm -->
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
            <label class="form-label">Giá giảm tối thiểu</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.minPrice"
              placeholder="Giá tối thiểu"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">Giá giảm tối đa</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.maxPrice"
              placeholder="Giá tối đa"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">Phần trăm giảm tối thiểu</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.minPercent"
              placeholder="% tối thiểu"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">Phần trăm giảm tối đa</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.maxPercent"
              placeholder="% tối đa"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">Tồn kho tối thiểu</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.minQuantity"
              placeholder="Số lượng tối thiểu"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">Tồn kho tối đa</label>
            <input
              type="number"
              class="form-control"
              v-model="filter.maxQuantity"
              placeholder="Số lượng tối đa"
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

    <!-- Bảng Flash Sale Item -->
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
                <th style="width: 120px">Thao tác</th>
                <!-- BỎ TRẠNG THÁI -->
                <th>Phần trăm giảm</th>
                <th>Giá sau giảm</th>
                <th>Số lượng sản phẩm khuyến mãi</th>
                <th>Giới hạn/người</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="items.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="(item, index) in items" :key="item.id">
                <td class="py-3">{{ currentPage * pageSize + index + 1 }}</td>
                <td class="py-3 fw-bold">{{ item.bookName }}</td>
                <td class="py-3">
                  <div class="d-flex gap-2">
                    <span class="tooltip-wrapper">
                      <button
                        class="btn btn-sm btn-outline-secondary action-btn"
                        @click="viewFlashSaleItem(item)"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <span class="tooltip-bubble">Xem chi tiết</span>
                    </span>
                    <EditButton @click="openEditForm(item)" />
                  </div>
                </td>
                <!-- BỎ TRẠNG THÁI -->
                <td class="py-3">{{ item.discountPercentage }}%</td>
                <td class="py-3">
                  <span class="text-success fw-bold">{{
                    formatCurrency(item.discountPrice)
                  }}</span>
                </td>
                <td class="py-3">{{ item.stockQuantity }}</td>
                <td class="py-3">{{ item.maxPurchasePerUser }}</td>
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

    <!-- Modal Thêm/Sửa Item -->
    <div
      class="modal fade"
      id="formModal"
      tabindex="-1"
      aria-labelledby="formModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
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
          <div class="modal-body form-modal-body">
            <div class="mb-3">
              <label class="form-label">
                Sách <span class="text-danger">*</span>
              </label>
              <Multiselect
                v-model="formSelected.book"
                :options="availableBooks"
                :searchable="true"
                :internal-search="true"
                :close-on-select="true"
                :clear-on-select="false"
                label="bookName"
                track-by="bookId"
                placeholder="Chọn sách"
                :disabled="isEditMode || loadingBooks"
              >
                <template #option="{ option }">
                  <div class="d-flex flex-column">
                    <strong>{{ option.bookName }}</strong>
                    <small v-if="option.bookCode" class="text-muted">
                      {{ option.bookCode }}
                    </small>
                    <small v-if="option.isbn" class="text-muted">
                      ISBN: {{ option.isbn }}
                    </small>
                    <small class="text-muted">
                      Giá: {{ formatCurrency(option.price) }} | Tồn:
                      {{ option.stockQuantity }}
                    </small>
                  </div>
                </template>
              </Multiselect>

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
                  Phần trăm giảm <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  v-model="formData.discountPercentage"
                  required
                  :min="1"
                  :max="30"
                  placeholder="Nhập phần trăm giảm (1-30)"
                />
                <div
                  v-if="formData.discountPrice"
                  class="form-text text-success"
                >
                  Giá sau khi giảm: {{ formatCurrency(formData.discountPrice) }}
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">
                  Giá sau khi giảm <span class="text-danger">*</span>
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
          </div>
          <div class="modal-footer">
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

    <!-- Modal chi tiết Flash Sale Item -->
    <div
      v-if="showDetailModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
    >
      <div class="modal-dialog" style="max-width: 600px">
        <div class="modal-content">
          <div class="modal-header form-modal-header">
            <h5 class="modal-title">
              <i class="bi bi-info-circle me-2"></i>
              Chi tiết sản phẩm Flash Sale
            </h5>
            <button
              type="button"
              class="custom-close-btn"
              @click="closeDetailModal"
            >
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <div class="modal-body form-modal-body">
            <table class="detail-info-table">
              <tbody>
                <tr>
                  <td class="detail-label">ID</td>
                  <td class="detail-value">{{ detailItem.id }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Flash Sale</td>
                  <td class="detail-value">
                    {{ detailItem.flashSaleName || "Chưa có dữ liệu" }}
                  </td>
                </tr>
                <tr>
                  <td class="detail-label">Sách</td>
                  <td class="detail-value">
                    {{ detailItem.bookName || "Chưa có dữ liệu" }}
                  </td>
                </tr>
                <tr>
                  <td class="detail-label">Phần trăm giảm</td>
                  <td class="detail-value">
                    {{ detailItem.discountPercentage }}%
                  </td>
                </tr>
                <tr>
                  <td class="detail-label">Giá sau giảm</td>
                  <td class="detail-value">
                    <span class="text-success fw-bold">{{
                      formatCurrency(detailItem.discountPrice)
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="detail-label">Số lượng</td>
                  <td class="detail-value">{{ detailItem.stockQuantity }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Giới hạn/người</td>
                  <td class="detail-value">
                    {{ detailItem.maxPurchasePerUser }}
                  </td>
                </tr>
                <!-- BỎ TRẠNG THÁI TRONG CHI TIẾT -->
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn form-btn-secondary"
              @click="closeDetailModal"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, reactive } from "vue";
import { Modal } from "bootstrap";
import { showToast, showQuickConfirm } from "@/utils/swalHelper.js";
import { validate } from "@/utils/validation.js";
import EditButton from "@/components/common/EditButton.vue";
import Pagination from "@/components/common/Pagination.vue";
import Multiselect from "vue-multiselect";
import {
  getAllFlashSaleItem,
  addFlashSaleItem,
  updateFlashSaleItem,
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

const filter = ref({
  flashSaleId: defaultFlashSaleId,
  bookName: "",
  minPrice: "",
  maxPrice: "",
  minPercent: "",
  maxPercent: "",
  minQuantity: "",
  maxQuantity: "",
});

const items = ref([]);
const flashSaleName = ref("");

const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

const loading = ref(false);
const error = ref(null);

const isEditMode = ref(false);

// Modal chi tiết Flash Sale Item - BỎ status
const showDetailModal = ref(false);
const detailItem = ref({
  id: "",
  flashSaleId: "",
  flashSaleName: "",
  bookId: "",
  bookName: "",
  discountPrice: "",
  discountPercentage: "",
  stockQuantity: "",
  maxPurchasePerUser: "",
  // BỎ status: ""
});

// BỎ status trong formData
const formData = ref({
  id: "",
  bookId: "",
  discountPrice: "",
  discountPercentage: "",
  stockQuantity: "",
  maxPurchasePerUser: "",
  // BỎ status field
});

// Selected cho form (khác filter)
const formSelected = reactive({ book: null });

const loadingBooks = ref(false);
const availableBooks = ref([]);

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

const selectedBookInfo = computed(() => {
  if (!formData.value.bookId || !availableBooks.value.length) {
    return null;
  }

  const bookId = parseInt(formData.value.bookId);
  const foundBook = availableBooks.value.find((book) => {
    return book.bookId === bookId;
  });

  return foundBook;
});

const loadAvailableBooks = async () => {
  try {
    loadingBooks.value = true;
    const response = await getActiveBooksWithStock();

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
    bookName: "",
    minPrice: "",
    maxPrice: "",
    minPercent: "",
    maxPercent: "",
    minQuantity: "",
    maxQuantity: "",
  };
  getDataFromApi(0, pageSize.value);
};

const reloadPage = () => {
  getDataFromApi(currentPage.value, pageSize.value);
};

// BỎ status trong resetFormData
const resetFormData = () => {
  formData.value = {
    id: "",
    bookId: "",
    discountPrice: "",
    discountPercentage: "",
    stockQuantity: "",
    maxPurchasePerUser: "",
    // BỎ status: ""
  };
  formSelected.book = null;
};

const openAddForm = async () => {
  isEditMode.value = false;
  resetFormData();
  await loadAvailableBooks();
  const modal = Modal.getOrCreateInstance(document.getElementById("formModal"));
  modal.show();
};

// BỎ status trong openEditForm
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
    // BỎ status: item.status
  };

  // Set selected book để hiển thị trong multiselect
  formSelected.book =
    availableBooks.value.find((book) => book.bookId === item.bookId) || null;

  const modal = Modal.getOrCreateInstance(document.getElementById("formModal"));
  modal.show();
};

// BỎ validation cho status
const validateForm = () => {
  const f = formData.value;

  const validations = [
    validate.flashSaleItem.bookId(f.bookId),
    validate.flashSaleItem.discountPercentage(f.discountPercentage),
    // validate.flashSaleItem.discountPrice(f.discountPrice),
    validate.flashSaleItem.stockQuantity(f.stockQuantity),
    validate.flashSaleItem.maxPurchasePerUser(f.maxPurchasePerUser),
    // BỎ validate.flashSaleItem.status(f.status)
  ];

  for (const validation of validations) {
    if (validation !== null) {
      showToast("error", validation);
      return false;
    }
  }

  if (
    selectedBookInfo.value &&
    formData.value.stockQuantity &&
    !isStockQuantityValid.value
  ) {
    showToast("error", stockErrorMessage.value);
    return false;
  }

 

  return true;
};

// BỎ status trong submitData
const handleSubmitForm = async () => {
  const actionText = isEditMode.value ? "cập nhật" : "thêm mới";
  const result = await showQuickConfirm(
    `Xác nhận ${actionText}`,
    `Bạn có chắc chắn muốn ${actionText} sản phẩm Flash Sale này?`,
    "info",
    isEditMode.value ? "Cập nhật" : "Thêm mới",
    "Hủy"
  );

  if (!result.isConfirmed) return;

  try {
    if (!validateForm()) return;
    const submitData = {
      flashSaleId: defaultFlashSaleId,
      bookId: parseInt(formData.value.bookId),
      discountPrice: parseFloat(formData.value.discountPrice),
      discountPercentage: parseFloat(formData.value.discountPercentage),
      stockQuantity: parseInt(formData.value.stockQuantity),
      maxPurchasePerUser: parseInt(formData.value.maxPurchasePerUser),
      // BỎ status: parseInt(formData.value.status)
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
    const apiMessage = error?.response?.data?.message || "Có lỗi xảy ra!";
    showToast("error", apiMessage);
  }
};

const closeModal = async () => {
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

watch(
  () => filter.value.bookName,
  (newBookName) => {
    // Xóa debounce, chỉ chạy khi ấn nút
  }
);

// Đồng bộ formSelected.book với formData.bookId
watch(
  () => formSelected.book,
  (opt) => {
    formData.value.bookId = opt?.bookId || "";
  }
);

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
  loadAvailableBooks();
});

const showFilter = ref(false);
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const isStockQuantityValid = computed(() => {
  if (!selectedBookInfo.value || !formData.value.stockQuantity) {
    return true;
  }

  const flashSaleStock = parseInt(formData.value.stockQuantity);
  const bookStock = parseInt(selectedBookInfo.value.stockQuantity);

  if (isNaN(flashSaleStock) || isNaN(bookStock)) {
    return true;
  }

  return flashSaleStock <= bookStock;
});

const stockErrorMessage = computed(() => {
  if (!selectedBookInfo.value || !formData.value.stockQuantity) {
    return "";
  }

  const flashSaleStock = parseInt(formData.value.stockQuantity);
  const bookStock = parseInt(selectedBookInfo.value.stockQuantity);

  if (isNaN(flashSaleStock) || isNaN(bookStock)) {
    return "";
  }

  if (flashSaleStock > bookStock) {
    return `Số lượng flash sale (${flashSaleStock}) không được vượt quá tồn kho sách (${bookStock})`;
  }

  return "";
});

// BỎ HOÀN TOÀN getStatusInfo function
// const getStatusInfo = (status) => {
//   const statusNum = Number(status);
//   switch (statusNum) {
//     case 1:
//       return { text: "Hoạt động", class: "badge-success" };
//     case 0:
//       return { text: "Không hoạt động", class: "badge-danger" };
//     default:
//       return { text: "Không xác định", class: "badge-secondary" };
//   }
// };

const viewFlashSaleItem = (item) => {
  detailItem.value = item;
  showDetailModal.value = true;
};

// BỎ status trong closeDetailModal
const closeDetailModal = () => {
  showDetailModal.value = false;
  detailItem.value = {
    id: "",
    flashSaleId: "",
    flashSaleName: "",
    bookId: "",
    bookName: "",
    discountPrice: "",
    discountPercentage: "",
    stockQuantity: "",
    maxPurchasePerUser: "",
    // BỎ status: ""
  };
};
</script>

<style scoped>
@import "@/assets/css/admin-global.css";
@import "@/assets/css/form-global.css";
@import "@/assets/css/form-detail-global.css";
@import "@/assets/css/vue-multiselect.css";
</style>
