<template>
  <div class="admin-page container-fluid py-4">
    <!-- ========== BỘ LỌC AUTHOR ========== -->
    <div class="card mb-5 shadow-lg border-0 filter-card">
      <div class="card-header bg-light border-0 py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0 text-secondary">
            <i class="fa fa-filter me-2"></i>
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
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-search me-1"></i>
              Tìm kiếm theo tên tác giả
            </label>
            <input
              type="text"
              class="form-control"
              v-model="searchQuery"
              placeholder="Nhập tên tác giả..."
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

    <!-- ================== BẢNG DANH SÁCH AUTHOR ================== -->
    <div class="card shadow-lg border-0 mb-4 admin-table-card">
      <div
        class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3"
      >
        <div>
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-person-lines-fill me-2"></i>
            Danh sách tác giả
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
          
          <!-- Nút Export Excel -->
          <ExcelExportButton 
            data-type="authors"
            button-text="Xuất Excel"
          />
          
          <button
            class="btn btn-primary btn-sm py-2"
            style="background-color: #33304e; border-color: #33304e"
            @click="openModal"
          >
            <i class="bi bi-plus-circle me-1"></i> Thêm mới
          </button>
        </div>
      </div>
      <div class="card-body p-0" :class="{ loading: loading }">
        <!-- Loading overlay giống review -->
        <div class="loading-overlay" :class="{ show: loading }">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p>Đang tải dữ liệu...</p>
        </div>
        <!-- Error state -->
        <div v-if="error" class="alert alert-danger m-4" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ error }}
          <button
            class="btn btn-sm btn-outline-danger ms-2"
            @click="fetchAuthors"
          >
            Thử lại
          </button>
        </div>
        <!-- Data table -->
        <div v-else>
          <table
            class="table align-middle table-hover mb-0"
          >
            <thead class="table-light">
              <tr>
                <th style="width: 40px">#</th>
                <th style="width: 120px">Thao tác</th>
                <th style="width: 200px">Tên tác giả</th>
                <th style="width: 150px">Ngày sinh</th>
                <th>Tiểu sử</th>
                <th style="width: 150px">Ngày tạo</th>
                <th style="width: 150px">Ngày cập nhật</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="authors.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr
                v-for="(author, index) in authors"
                :key="author.id"
                class="align-middle"
                style="vertical-align: middle"
              >
                <td class="py-3">{{ currentPage * pageSize + index + 1 }}</td>
                <td class="py-3">
                  <div class="d-flex gap-2">
                    <span class="tooltip-wrapper">
                      <button
                        class="btn btn-sm btn-outline-secondary action-btn"
                        @click="viewAuthor(author.id)"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <span class="tooltip-bubble">Xem chi tiết</span>
                    </span>
                    <span class="tooltip-wrapper">
                      <EditButton @click="editAuthor(author.id)" />
                      <span class="tooltip-bubble">Chỉnh sửa</span>
                    </span>
                  </div>
                </td>
                <td class="py-3 fw-bold">{{ author.authorName }}</td>
                <td class="py-3">{{ author.birthDate || "Chưa có dữ liệu" }}</td>
                <td
                  class="py-3"
                  style="max-width: 300px; white-space: pre-line"
                >
                  {{ author.biography || "Chưa có dữ liệu" }}
                </td>
                <td class="py-3">
                  <span class="fw-bold">{{ toTime(author.createdAt) }}</span>
                  <br />
                  <small class="text-muted">{{ toDate(author.createdAt) }}</small>
                </td>
                <td class="py-3">
                  <span class="fw-bold">{{ toTime(author.updatedAt) }}</span>
                  <br />
                  <small class="text-muted">{{ toDate(author.updatedAt) }}</small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
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
    <!-- ================== HẾT PHẦN BẢNG DANH SÁCH AUTHOR ================== -->

    <!-- Modal Thêm tác giả -->
    <div
      v-if="showModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
    >
      <div class="modal-dialog" style="max-width: 600px">
        <div class="modal-content">
          <!-- ✅ Đổi từ author-modal-header thành form-modal-header -->
          <div class="modal-header form-modal-header">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>
              Thêm tác giả
            </h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <!-- ✅ Đổi từ author-modal-body thành form-modal-body -->
          <div class="modal-body form-modal-body">
            <form @submit.prevent="add">
              <div class="mb-3">
                <label class="form-label">
                  Tên tác giả <span class="text-danger">*</span>
                </label>
                <input
                  v-model="author.authorName"
                  class="form-control"
                  required
                  placeholder="Nhập tên tác giả (2-100 ký tự)"
                  maxlength="100"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Tiểu sử</label>
                <textarea
                  v-model="author.biography"
                  class="form-control"
                  placeholder="Nhập tiểu sử (tối đa 1000 ký tự)"
                  maxlength="1000"
                  rows="4"
                ></textarea>
                <div class="form-text">
                  {{ author.biography ? author.biography.length : 0 }}/1000 ký
                  tự
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Ngày sinh</label>
                <span class="small text-muted"> (Nếu không xác định có thể để trống)</span>
                <input
                  v-model="author.birthDate"
                  type="date"
                  class="form-control"
                  :max="new Date().toISOString().split('T')[0]"
                  min="1900-01-01"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <!-- ✅ Đổi từ author-form-btn thành form-btn -->
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

    <!-- Modal chi tiết tác giả -->
    <div
      v-if="showDetailModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
    >
      <div class="modal-dialog" style="max-width: 600px">
        <div class="modal-content">
          <!-- ✅ Đổi từ author-modal-header thành form-modal-header -->
          <div class="modal-header form-modal-header">
            <h5 class="modal-title">
              <i class="bi bi-info-circle me-2"></i>
              Chi tiết tác giả
            </h5>
            <button
              type="button"
              class="custom-close-btn"
              @click="closeDetailModal"
            >
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <!-- ✅ Đổi từ author-modal-body thành form-modal-body -->
          <div class="modal-body form-modal-body">
            <table class="detail-info-table">
              <tbody>
                <tr>
                  <td class="detail-label">ID</td>
                  <td class="detail-value">{{ detailAuthor.id }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Tên tác giả</td>
                  <td class="detail-value">{{ detailAuthor.authorName || "Chưa có dữ liệu" }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Tiểu sử</td>
                  <td class="detail-value">{{ detailAuthor.biography || "Chưa có dữ liệu" }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Ngày sinh</td>
                  <td class="detail-value">{{ detailAuthor.birthDate || "Chưa có dữ liệu" }}</td>
                </tr>
                <!-- <tr>
                  <td class="detail-label">Trạng thái</td>
                  <td class="detail-value">
                    <span :class="['badge', getStatusInfo(detailAuthor.status).class]">
                      {{ getStatusInfo(detailAuthor.status).text }}
                    </span>
                  </td>
                </tr> -->
                <tr>
                  <td class="detail-label">Ngày tạo</td>
                  <td class="detail-value">
                    {{ toTime(detailAuthor.createdAt) }} - {{ toDate(detailAuthor.createdAt) }}
                  </td>
                </tr>
                <tr>
                  <td class="detail-label">Ngày cập nhật</td>
                  <td class="detail-value">
                    {{ toTime(detailAuthor.updatedAt) }} - {{ toDate(detailAuthor.updatedAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <!-- ✅ Đổi từ author-form-btn thành form-btn -->
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

    <!-- Modal sửa tác giả -->
    <div
      v-if="showEditModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
    >
      <div class="modal-dialog" style="max-width: 600px">
        <div class="modal-content">
          <!-- ✅ Đổi từ author-modal-header thành form-modal-header -->
          <div class="modal-header form-modal-header">
            <h5 class="modal-title">
              <i class="bi bi-pencil-square me-2"></i>
              Sửa tác giả
            </h5>
            <button
              type="button"
              class="custom-close-btn"
              @click="showEditModal = false"
            >
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <!-- ✅ Đổi từ author-modal-body thành form-modal-body -->
          <div class="modal-body form-modal-body">
            <div class="mb-3">
              <label class="form-label">
                Tên tác giả <span class="text-danger">*</span>
              </label>
              <input
                v-model="editData.authorName"
                class="form-control"
                required
                placeholder="Nhập tên tác giả (2-100 ký tự)"
                maxlength="100"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Tiểu sử</label>
              <textarea
                v-model="editData.biography"
                class="form-control"
                placeholder="Nhập tiểu sử (tối đa 1000 ký tự)"
                maxlength="1000"
                rows="4"
              ></textarea>
              <div class="form-text">
                {{ editData.biography ? editData.biography.length : 0 }}/1000 ký
                tự
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Ngày sinh</label>
              <span class="small text-muted"> (Nếu không xác định có thể để trống)</span>
              <input
                v-model="editData.birthDate"
                type="date"
                class="form-control"
                :max="new Date().toISOString().split('T')[0]"
                min="1900-01-01"
              />
            </div>
          </div>
          <div class="modal-footer">
            <!-- ✅ Đổi từ author-form-btn thành form-btn -->
            <button
              type="button"
              class="btn form-btn-secondary"
              @click="showEditModal = false"
            >
              Đóng
            </button>
            <button
              type="button"
              class="btn form-btn-primary"
              @click="handleUpdateAuthor(editData.id, editData)"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
  getAllAuthors,
  getAuthorById,
  addAuthor,
  updateAuthor,
} from "../../../services/admin/author";
// Bootstrap icons loaded from CDN in index.html
import { showToast, showAlert, showQuickConfirm } from "@/utils/swalHelper";
import EditButton from "@/components/common/EditButton.vue";
import Pagination from "@/components/common/Pagination.vue";
import { toDate, toTime } from "@/utils/utils";
import { validate } from "@/utils/validation.js";
import ExcelExportButton from "@/components/common/ExcelExportButton.vue";

const authors = ref([]);
const showModal = ref(false);
const author = ref({
  authorName: "",
  biography: "",
  birthDate: "",
});
const detailAuthor = ref({
  id: "",
  authorName: "",
  biography: "",
  birthDate: "",
  createdAt: "",
  updatedAt: "",
  status: 1,
});
const showDetailModal = ref(false);
const showEditModal = ref(false);
const editData = ref({
  id: "",
  authorName: "",
  biography: "",
  birthDate: "",
});
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);
const searchQuery = ref("");
const loading = ref(false);
const error = ref(null);
const showFilter = ref(true);

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

// Hàm đơn giản để lấy badge class và text dựa trên status
const getStatusInfo = (status) => {
  const statusMap = {
    1: { class: "badge-success", text: "Hoạt động" },
    0: { class: "badge-danger", text: "Ngừng hoạt động" }
  };
  return statusMap[Number(status)] || { class: "badge-secondary", text: "Không xác định" };
};

onMounted(() => {
  fetchAuthors();
});

// Gọi API với các bộ lọc hiện tại
const searchWithFilter = () => {
  currentPage.value = 0; // Reset về trang đầu
  fetchAuthors();
};

const clearFilters = () => {
  searchQuery.value = "";
  currentPage.value = 0;
  fetchAuthors();
};

// Reload page
const reloadPage = () => {
  fetchAuthors();
};

const viewAuthor = async (id) => {
  try {
    const response = await getAuthorById(id);
    detailAuthor.value = response;
    console.log("Chi tiết tác giả:", detailAuthor.value);
    showDetailModal.value = true;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tác giả:", error);
    showAlert("Lỗi!", "Không thể lấy thông tin tác giả", "error");
  }
};

function openModal() {
  resetForm();
  showModal.value = true;
}

function closeModal() {
  resetForm();
  showModal.value = false;
}

const add = async () => {
  // Validate form trước khi submit
  if (!validateAuthorForm()) {
    return;
  }

  const result = await showQuickConfirm("Xác nhận thêm tác giả", "Bạn có chắc chắn muốn thêm tác giả này?", "info", "Thêm", "Hủy");
  if (!result.isConfirmed) return;

  try {
    await addAuthor(author.value);
    fetchAuthors();
    closeModal();
    showToast("success", "Thêm tác giả thành công!");
  } catch (error) {
    console.error("Lỗi khi thêm tác giả:", error);

    // Xử lý lỗi chi tiết từ server
    let errorMessage = "Không thể thêm tác giả.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      errorMessage = Object.values(error.response.data.errors).join(", ");
    }

    showAlert("Thêm thất bại!", errorMessage, "error");
  }
};

// Thêm các hàm còn thiếu vào script
const resetForm = () => {
  author.value = {
    authorName: "",
    biography: "",
    birthDate: "",
  };
};

const resetEditForm = () => {
  editData.value = {
    id: "",
    authorName: "",
    biography: "",
    birthDate: "",
  };
};

const editAuthor = async (id) => {
  try {
    resetEditForm();
    const data = await getAuthorById(id);
    editData.value = {
      id: data.id,
      authorName: data.authorName,
      biography: data.biography,
      birthDate: data.birthDate,
    };
    showEditModal.value = true;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tác giả để sửa:", error);
    showAlert("Lỗi!", "Không thể lấy thông tin tác giả để chỉnh sửa.", "error");
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  detailAuthor.value = {
    id: "",
    authorName: "",
    biography: "",
    birthDate: "",
    createdAt: "",
    updatedAt: "",
    status: 1,
  };
};

// ✅ Sửa lại validateAuthorForm - dùng validation từ utils
const validateAuthorForm = () => {
  // Validate using common validation functions
  const validations = [
    validate.required(author.value.authorName, 'Tên tác giả'),
    validate.fullName(author.value.authorName),
    validate.biography(author.value.biography),
    validate.birthDate(author.value.birthDate),
  ];

  // Check if any validation failed
  for (const validation of validations) {
    if (validation !== null) {
      showToast("error", validation);
      return false;
    }
  }

  return true;
};

// ✅ Sửa lại validateEditAuthorForm function (tương tự validateAuthorForm nhưng cho editData)
const validateEditAuthorForm = () => {
  // Validate using common validation functions
  const validations = [
    validate.required(editData.value.authorName, 'Tên tác giả'),
    validate.fullName(editData.value.authorName),
    validate.biography(editData.value.biography),
    validate.birthDate(editData.value.birthDate),
  ];

  // Check if any validation failed
  for (const validation of validations) {
    if (validation !== null) {
      showToast("error", validation);
      return false;
    }
  }

  return true;
};

// ✅ Sửa lại handleUpdateAuthor - bỏ status
const handleUpdateAuthor = async (id, authorData) => {
  if (!validateEditAuthorForm()) {
    return;
  }

  const result = await showQuickConfirm("Xác nhận cập nhật", "Bạn có chắc chắn muốn cập nhật tác giả này?", "info", "Cập nhật", "Hủy");
  if (!result.isConfirmed) return;

  try {
    const payload = {
      authorName: authorData.authorName.trim(),
      biography: authorData.biography?.trim() || "",
      birthDate: authorData.birthDate || null,
    };

    await updateAuthor(id, payload);
    fetchAuthors();
    showEditModal.value = false;
    showToast("success", "Cập nhật tác giả thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật tác giả:", error);

    let errorMessage = "Không thể cập nhật tác giả.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      errorMessage = Object.values(error.response.data.errors).join(", ");
    }

    showAlert("Cập nhật thất bại!", errorMessage, "error");
  }
};

// ✅ Sửa lại fetchAuthors - bỏ param status
const fetchAuthors = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      name: searchQuery.value || undefined,
    };

    const response = await getAllAuthors(params);
    const data = response.data ? response.data : response;

    console.log("Fetched authors response:", response);
    console.log("Processed data:", data);

    authors.value = data.content || data;
    totalPages.value = data.totalPages ?? 1;
    totalElements.value = data.totalElements ?? authors.value.length;
    currentPage.value = data.page ?? currentPage.value;
    pageSize.value = data.size ?? pageSize.value;
    isLastPage.value = currentPage.value >= totalPages.value - 1;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách tác giả:", err);
    error.value = "Lỗi khi tải dữ liệu!";
    authors.value = [];
  } finally {
    loading.value = false;
  }
};

// ✅ Sửa lại watch - bỏ debounce
watch([searchQuery], () => {
  currentPage.value = 0;
  // Không tự động fetch, chỉ khi ấn nút lọc
});

// Watch cho pagination (không debounce)
watch([pageSize, currentPage], () => {
  fetchAuthors();
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
</script>

<style scoped>
@import "@/assets/css/admin-global.css";
@import "@/assets/css/form-global.css";
@import "@/assets/css/form-detail-global.css";
</style>
