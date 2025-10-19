<template>
  <div class="admin-page container-fluid py-4">
    <!-- ========== BỘ LỌC CATEGORY ========== -->
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
          <div class="col-md-4">
            <label class="form-label">
              <i class="bi bi-search me-1"></i>
              Tìm kiếm theo tên danh mục
            </label>
            <input
              type="text"
              class="form-control"
              v-model="searchQuery"
              placeholder="Nhập tên danh mục..."
            />
          </div>
        </div>
        <div class="row g-3 pt-3 m-1 d-flex justify-content-center">
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

    <!-- ================== BẢNG DANH SÁCH CATEGORY ================== -->
    <div class="card shadow-lg border-0 mb-4 admin-table-card">
      <div
        class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3"
      >
        <div>
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-tags me-2"></i>
            Danh sách danh mục
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

          <ExcelExportButton data-type="categories" button-text="Xuất Excel" />

          <button
            class="btn btn-primary btn-sm py-2"
            style="background-color: #33304e; border-color: #33304e"
            @click="openModal"
          >
            <i class="bi bi-plus-circle me-1"></i> Thêm mới
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger m-4" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ error }}
          <button
            class="btn btn-sm btn-outline-danger ms-2"
            @click="fetchCategory"
          >
            Thử lại
          </button>
        </div>
        <div v-else>
          <table
            class="table align-middle table-hover mb-0 category-table-custom"
          >
            <thead>
              <tr>
                <th style="width: 60px">#</th>
                <th style="width: 100px">Thao tác</th>
                <th style="width: 400px">TÊN THỂ LOẠI</th>
                <th style="width: 300px">MÔ TẢ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="categories.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <template
                v-for="(category, index) in categories"
                :key="category.id"
              >
                <tr
                  class="align-middle parent-row"
                  style="vertical-align: middle"
                >
                  <td class="py-3 text-center fw-bold">
                    {{ currentPage * pageSize + index + 1 }}
                  </td>
                  <td class="py-3 text-center">
                    <div class="d-flex gap-2">
                      <span class="tooltip-wrapper">
                        <button
                          class="btn btn-sm btn-outline-secondary action-btn"
                          @click="viewCategory(category.id)"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                        <span class="tooltip-bubble">Xem chi tiết</span>
                      </span>
                      <span class="tooltip-wrapper">
                        <EditButton @click="editCategory(category.id)" />
                        <span class="tooltip-bubble">Chỉnh sửa</span>
                      </span>
                    </div>
                  </td>
                  <td class="py-3">
                    <div class="d-flex align-items-center">
                      <button
                        v-if="
                          category.parentCategory &&
                          category.parentCategory.length > 0
                        "
                        @click="toggleCollapse(category)"
                        class="btn btn-sm btn-outline-secondary me-2 toggle-btn"
                      >
                        <i
                          v-if="category.isOpen"
                          class="bi bi-chevron-down"
                        ></i>
                        <i v-else class="bi bi-chevron-right"></i>
                      </button>
                      <span class="fw-semibold category-name">{{
                        category.categoryName
                      }}</span>
                    </div>
                  </td>
                  <td class="py-3">
                    <div class="description-text" :title="category.description">
                      {{ category.description || "Không có mô tả" }}
                    </div>
                  </td>
                </tr>
                <template
                  v-if="
                    category.parentCategory &&
                    category.parentCategory.length > 0
                  "
                  v-for="(child, childIndex) in category.parentCategory"
                  :key="`${category.id}-${child.id}`"
                >
                  <tr
                    v-show="category.isOpen"
                    class="align-middle child-row"
                    style="vertical-align: middle"
                  >
                    <td class="py-2 text-center text-muted">
                      {{ currentPage * pageSize + index + 1 }}.{{
                        childIndex + 1
                      }}
                    </td>
                    <td class="py-2 text-center">
                      <div class="d-flex gap-2">
                        <span class="tooltip-wrapper">
                          <button
                            class="btn btn-sm btn-outline-secondary action-btn"
                            @click="viewCategory(child.id)"
                          >
                            <i class="bi bi-eye"></i>
                          </button>
                          <span class="tooltip-bubble">Xem chi tiết</span>
                        </span>
                        <span class="tooltip-wrapper">
                          <EditButton @click="editCategory(child.id)" />
                          <span class="tooltip-bubble">Chỉnh sửa</span>
                        </span>
                      </div>
                    </td>
                    <td class="py-2" style="padding-left: 60px">
                      <div class="d-flex align-items-center">
                        <i class="bi bi-arrow-return-right me-2 text-muted"></i>
                        <span class="child-category-name">
                          {{ child.categoryName || "Không có tên" }}
                        </span>
                      </div>
                    </td>
                    <td class="py-2">
                      <div class="description-text" :title="child.description">
                        {{ child.description || "Không có mô tả" }}
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
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
  <!-- Modal thêm danh mục -->
  <div
    v-if="showModal"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
  >
    <div class="modal-dialog" style="max-width: 600px">
      <div class="modal-content">
        <div class="modal-header form-modal-header">
          <h5 class="modal-title">
            <i class="bi bi-plus-circle me-2"></i>
            Thêm danh mục
          </h5>
          <button type="button" class="custom-close-btn" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body form-modal-body">
          <div class="mb-3">
            <label class="form-label">
              Tên danh mục <span class="text-danger">*</span>
            </label>
            <input
              v-model="category.categoryName"
              class="form-control"
              required
              placeholder="Nhập tên danh mục (2-100 ký tự)"
              maxlength="100"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Danh Mục Cha</label>
            <select v-model="category.parentCategory.id" class="form-select">
              <option :value="null">Chọn danh mục</option>
              <option v-for="cat in dataGetAll" :key="cat.id" :value="cat.id">
                {{ cat.categoryName }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea
              v-model="category.description"
              class="form-control"
              placeholder="Nhập mô tả (tối đa 500 ký tự)"
              maxlength="500"
              rows="4"
            ></textarea>
            <div class="form-text">
              {{ category.description ? category.description.length : 0 }}/500
              ký tự
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn form-btn-secondary"
            @click="closeModal"
          >
            Hủy
          </button>
          <button type="button" class="btn form-btn-primary" @click="add">
            Thêm
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal chi tiết danh mục -->
  <div
    v-if="showDetailModal"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
  >
    <div class="modal-dialog" style="max-width: 450px">
      <div class="modal-content">
        <div class="modal-header form-modal-header">
          <h5 class="modal-title">
            <i class="bi bi-info-circle me-2"></i>
            Chi tiết danh mục
          </h5>
          <button
            type="button"
            class="custom-close-btn"
            @click="closeDetailModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body form-modal-body">
          <table class="detail-info-table">
            <tbody>
              <tr>
                <td class="detail-label">ID</td>
                <td class="detail-value">{{ detailCategory.id }}</td>
              </tr>
              <tr>
                <td class="detail-label">Tên danh mục</td>
                <td class="detail-value">{{ detailCategory.categoryName }}</td>
              </tr>
              <tr>
                <td class="detail-label">Mô tả</td>
                <td class="detail-value">
                  {{ detailCategory.description || "Không có mô tả" }}
                </td>
              </tr>
              <tr>
                <td class="detail-label">Danh mục cha</td>
                <td class="detail-value">
                  {{
                    detailCategory.parentCategory?.categoryName || "Không có"
                  }}
                </td>
              </tr>
              <tr>
                <td class="detail-label">Ngày tạo</td>
                <td class="detail-value">
                  {{ toDate(detailCategory.createdAt) }}
                  {{ toTime(detailCategory.createdAt) }}
                </td>
              </tr>
              <tr>
                <td class="detail-label">Ngày cập nhật</td>
                <td class="detail-value">
                  {{ toDate(detailCategory.updatedAt) }}
                  {{ toTime(detailCategory.updatedAt) }}
                </td>
              </tr>
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

  <!-- Modal sửa danh mục -->
  <div
    v-if="showEditModal"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
  >
    <div class="modal-dialog" style="max-width: 600px">
      <div class="modal-content">
        <div class="modal-header form-modal-header">
          <h5 class="modal-title d-flex align-items-center gap-2">
            <i class="bi bi-pencil-square me-2"></i> Sửa danh mục
          </h5>
          <button
            type="button"
            class="custom-close-btn"
            @click="showEditModal = false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body form-modal-body">
          <div class="mb-3">
            <label class="form-label">
              Tên danh mục <span class="text-danger">*</span>
            </label>
            <input
              v-model="editData.categoryName"
              class="form-control"
              required
              placeholder="Nhập tên danh mục (2-100 ký tự)"
              maxlength="100"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Danh Mục Cha</label>
            <select v-model="editData.parentCategory" class="form-select">
              <option :value="null">Chọn danh mục</option>
              <option v-for="cat in dataGetAll" :key="cat.id" :value="cat">
                {{ cat.categoryName }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea
              v-model="editData.description"
              class="form-control"
              placeholder="Nhập mô tả (tối đa 500 ký tự)"
              maxlength="500"
              rows="4"
            ></textarea>
            <div class="form-text">
              {{ editData.description ? editData.description.length : 0 }}/500
              ký tự
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn form-btn-secondary"
            @click="showEditModal = false"
          >
            Hủy
          </button>
          <button
            type="button"
            class="btn form-btn-primary"
            @click="handleUpdateCategory(editData.id, editData)"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
// Bootstrap icons loaded from CDN in index.html
import { showToast, showQuickConfirm } from "@/utils/swalHelper.js";
import { validate } from "@/utils/validation.js";
import { toDate, toTime } from "@/utils/utils.js";
import {
  addCategory,
  getAllCategories,
  getAllExceptId,
  getAllParentCategories,
  getCategoryById,
  updateCategory,
  toggleStatus,
  getAllCategoriesParentNull,
} from "../../../services/admin/category";
import AddButton from "@/components/common/AddButton.vue";
import EditButton from "@/components/common/EditButton.vue";
import Pagination from "@/components/common/Pagination.vue";
import ToggleStatus from "@/components/common/ToggleStatus.vue";
import ExcelExportButton from "@/components/common/ExcelExportButton.vue";

const categories = ref([]);
const dataGetAll = ref([]);
const showModal = ref(false);
const category = ref({
  categoryName: "", // Tên danh mục
  parentCategory: {
    id: null, // ID của danh mục cha
    categoryName: "", // Tên của danh mục cha (nếu cần)
    description: "", // Mô tả của danh mục cha (nếu cần)
  },
});
const detailCategory = ref({
  id: "",
  categoryName: "",
  description: "",
  parentCategory: "",
  createdAt: "",
  updatedAt: "",
});
const showDetailModal = ref(false);
const showEditModal = ref(false);
const editData = ref({
  id: "",
  categoryName: "",
  description: "",
});
const searchQuery = ref("");
const showFilter = ref(true);
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

// Pagination variables
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

const loading = ref(false);
const error = ref(null);

const toggleCollapse = (category) => {
  category.isOpen = !category.isOpen;
};
const fetchCategory = async () => {
  try {
    loading.value = true;
    const getAll = await getAllCategoriesParentNull();
    dataGetAll.value = getAll;

    // Fetch with pagination parameters
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      name: searchQuery.value || undefined,
    };

    const response = await getAllParentCategories(params);

    const data = response.data ? response.data : response;

    categories.value = data.content || data;
    totalPages.value = data.totalPages ?? 1;
    totalElements.value = data.totalElements ?? categories.value.length;
    currentPage.value = data.page ?? currentPage.value;
    pageSize.value = data.size ?? pageSize.value;
    isLastPage.value = currentPage.value >= totalPages.value - 1;
  } catch (error) {
    console.error("Lỗi khi tải danh sách danh mục:", error);
    error.value = "Không thể tải danh sách danh mục.";
    showToast("error", "Không thể tải danh sách danh mục.");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCategory();
});

const viewCategory = async (id) => {
  try {
    const categoryData = await getCategoryById(id);
    detailCategory.value = {
      ...categoryData,
      createdAt: categoryData.createdAt,
      updatedAt: categoryData.updatedAt,
    };
    showDetailModal.value = true;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin danh mục:", error);
    showToast("error", "Không thể lấy thông tin danh mục.");
  }
};

const openModal = () => {
  resetForm();
  showModal.value = true;
};
const closeModal = () => {
  resetForm();
  showModal.value = false;
};

// Thêm validation functions
const validateCategoryForm = () => {
  const validations = [
    validate.category.categoryName(category.value.categoryName),
    validate.category.description(category.value.description),
  ];

  for (const validation of validations) {
    if (validation !== null) {
      showToast("error", validation);
      return false;
    }
  }

  return true;
};

const validateEditForm = () => {
  const validations = [
    validate.category.categoryName(editData.value.categoryName),
    validate.category.description(editData.value.description),
  ];

  for (const validation of validations) {
    if (validation !== null) {
      showToast("error", validation);
      return false;
    }
  }

  return true;
};

// Sửa lại hàm add
const add = async () => {
  // KIỂM TRA VALIDATION TRƯỚC KHI HIỆN CONFIRM
  if (!validateCategoryForm()) {
    return; // Dừng lại nếu validation fail, không hiện confirm
  }

  // CHỈ HIỆN CONFIRM KHI ĐÃ PASS VALIDATION
  const result = await showQuickConfirm(
    "Xác nhận thêm mới",
    "Bạn có chắc chắn muốn thêm danh mục này?",
    "question",
    "Thêm mới",
    "Hủy"
  );

  if (!result.isConfirmed) return;

  // Tạo payload chỉ chứa ID của parentCategory
  const payload = {
    categoryName: category.value.categoryName.trim(),
    description: category.value.description?.trim() || "",
    parentCategory: {
      id: category.value.parentCategory.id || null,
    },
  };

  try {
    await addCategory(payload);
    fetchCategory();
    closeModal();
    showToast("success", "Thêm danh mục thành công!");
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);

    // Xử lý lỗi chi tiết từ server
    let errorMessage = "Không thể thêm danh mục.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      errorMessage = Object.values(error.response.data.errors).join(", ");
    }

    showToast("error", errorMessage);
  }
};

// Tương tự cho hàm handleUpdateCategory
const handleUpdateCategory = async (id, categoryData) => {
  // KIỂM TRA VALIDATION TRƯỚC KHI HIỆN CONFIRM
  if (!validateEditForm()) {
    return; // Dừng lại nếu validation fail, không hiện confirm
  }

  // CHỈ HIỆN CONFIRM KHI ĐÃ PASS VALIDATION
  const result = await showQuickConfirm(
    "Xác nhận cập nhật",
    "Bạn có chắc chắn muốn cập nhật danh mục này?",
    "question",
    "Cập nhật",
    "Hủy"
  );

  if (!result.isConfirmed) return;

  try {
    const payload = {
      categoryName: categoryData.categoryName.trim(),
      description: categoryData.description?.trim() || "",
      parentCategory: categoryData.parentCategory || null,
    };

    await updateCategory(id, payload);
    fetchCategory();
    showEditModal.value = false;
    showToast("success", "Cập nhật danh mục thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);

    // Xử lý lỗi chi tiết từ server
    let errorMessage = "Không thể cập nhật danh mục.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      errorMessage = Object.values(error.response.data.errors).join(", ");
    }

    showToast("error", errorMessage);
  }
};

// Watch để tự động fetch khi thay đổi filter hoặc phân trang
watch([pageSize, currentPage], () => {
  fetchCategory();
});

// Hàm chuyển trang
const handlePrev = () => {
  if (currentPage.value > 0) currentPage.value--;
};

const handleNext = () => {
  if (!isLastPage.value) currentPage.value++;
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 0;
};

// Thêm hàm resetForm vào script
const resetForm = () => {
  category.value = {
    categoryName: "",
    description: "",
    parentCategory: {
      id: null,
      categoryName: "",
      description: "",
    },
  };
};

// Cũng thêm hàm reset cho edit form
const resetEditForm = () => {
  editData.value = {
    id: "",
    categoryName: "",
    description: "",
    parentCategory: null,
  };
};

// Thêm hàm editCategory vào script
const editCategory = async (id) => {
  try {
    resetEditForm(); // Reset trước khi load data
    const data = await getCategoryById(id);
    editData.value = {
      id: data.id,
      categoryName: data.categoryName,
      description: data.description,
      parentCategory: data.parentCategory,
    };
    showEditModal.value = true;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin danh mục để sửa:", error);
    showToast("error", "Không thể lấy thông tin danh mục để chỉnh sửa.");
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  // Reset detail data nếu cần
  detailCategory.value = {
    id: "",
    categoryName: "",
    description: "",
    parentCategory: "",
    createdAt: "",
    updatedAt: "",
  };
};

// Sửa lại hàm reloadPage (nếu chưa có)
const reloadPage = () => {
  currentPage.value = 0;
  searchQuery.value = "";
  fetchCategory();
};

// Thêm hàm searchWithFilter và clearFilters (nếu chưa có)
const searchWithFilter = () => {
  currentPage.value = 0; // Reset về trang đầu khi search
  fetchCategory();
};

const clearFilters = () => {
  searchQuery.value = "";
  currentPage.value = 0;
  fetchCategory();
};
</script>

<style scoped>
@import "@/assets/css/admin-global.css";
@import "@/assets/css/form-global.css";
@import "@/assets/css/form-detail-global.css";
</style>
