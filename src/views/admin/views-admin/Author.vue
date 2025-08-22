<template>
  <div class="container-fluid py-4">
    <!-- ========== BỘ LỌC AUTHOR ========== -->
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
      <div class="card-body p-0 position-relative">
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
            class="table align-middle table-hover mb-0 author-table-custom"
          >
            <thead>
              <tr>
                <th style="width: 40px">#</th>
                <th style="width: 220px">TÊN TÁC GIẢ</th>
                <th style="width: 200px">NGÀY SINH</th>
                <th>TIỂU SỬ</th>
                <th style="width: 160px">CHỨC NĂNG</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="authors.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">
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
                <td class="py-3 fw-bold">{{ author.authorName }}</td>
                <td class="py-3">{{ author.birthDate }}</td>
                <td
                  class="py-3"
                  style="max-width: 300px; white-space: pre-line"
                >
                  {{ author.biography }}
                </td>
                <td class="py-3">
                  <span class="tooltip-wrapper">
                    <button
                      class="btn btn-sm btn-outline-secondary action-btn"
                      @click="viewAuthor(author.id)"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <span class="tooltip-bubble">Xem chi tiết</span>
                  </span>
                  <span class="tooltip-wrapper ms-2">
                    <EditButton @click="editAuthor(author.id)" />
                    <span class="tooltip-bubble">Chỉnh sửa</span>
                  </span>
                  <span class="tooltip-wrapper ms-2">
                    <DeleteButton @click="handleDeleteAuthor(author.id)" />
                    <span class="tooltip-bubble">Xóa</span>
                  </span>
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
            <div class="mb-2"><b>ID:</b> {{ detailAuthor.id }}</div>
            <div class="mb-2">
              <b>Tên tác giả:</b> {{ detailAuthor.authorName }}
            </div>
            <div class="mb-2"><b>Tiểu sử:</b> {{ detailAuthor.biography }}</div>
            <div class="mb-2">
              <b>Ngày sinh:</b> {{ detailAuthor.birthDate }}
            </div>
            <div class="mb-2">
              <b>Ngày tạo:</b>
              {{ timestampToDatetimeLocal(detailAuthor.createdAt) }}
            </div>
            <div class="mb-2">
              <b>Ngày cập nhật:</b>
              {{ timestampToDatetimeLocal(detailAuthor.updatedAt) }}
            </div>
            <div class="mb-2">
              <b>Người tạo:</b> {{ detailAuthor.createdBy || "—" }}
            </div>
            <div class="mb-2">
              <b>Người cập nhật:</b> {{ detailAuthor.updatedBy || "—" }}
            </div>
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
  deleteAuthor,
} from "../../../services/admin/author";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import AddButton from "@/components/common/AddButton.vue";
import EditButton from "@/components/common/EditButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import Pagination from "@/components/common/Pagination.vue";
import { debounce } from "@/utils/utils";
import { timestampToDatetimeLocal } from "@/utils/utils"; // ✅ Import hàm
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
  createdBy: "",
  updatedBy: "",
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
    detailAuthor.value = await getAuthorById(id);
    console.log("Chi tiết tác giả:", detailAuthor.value);
    showDetailModal.value = true;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tác giả:", error);
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

  try {
    await addAuthor(author.value);
    fetchAuthors();
    closeModal();
    Swal.fire({
      icon: "success",
      title: "Thêm tác giả thành công!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error("Lỗi khi thêm tác giả:", error);

    // Xử lý lỗi chi tiết từ server
    let errorMessage = "Không thể thêm tác giả.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      errorMessage = Object.values(error.response.data.errors).join(", ");
    }

    Swal.fire({
      icon: "error",
      title: "Thêm thất bại!",
      text: errorMessage,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
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
    Swal.fire({
      icon: "error",
      title: "Lỗi!",
      text: "Không thể lấy thông tin tác giả để chỉnh sửa.",
      timer: 2000,
      timerProgressBar: true,
    });
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
    createdBy: "",
    updatedBy: "",
  };
};

// ✅ Sửa lại validateAuthorForm - bỏ validation status
const validateAuthorForm = () => {
  // 1. Validate tên tác giả (bắt buộc)
  if (!author.value.authorName || author.value.authorName.trim() === "") {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Vui lòng nhập tên tác giả",
      timer: 2000,
      timerProgressBar: true,
    });
    return false;
  }

  // 2. Validate độ dài tên tác giả
  const authorName = author.value.authorName.trim();
  if (authorName.length < 2) {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Tên tác giả phải có ít nhất 2 ký tự",
      timer: 2000,
      timerProgressBar: true,
    });
    return false;
  }

  if (authorName.length > 100) {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Tên tác giả không được vượt quá 100 ký tự",
      timer: 2000,
      timerProgressBar: true,
    });
    return false;
  }

  // 3. Validate ký tự đặc biệt
  const nameRegex = /^[a-zA-ZÀ-ỹ0-9\s\.\-]+$/;
  if (!nameRegex.test(authorName)) {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Tên tác giả chỉ được chứa chữ cái, số, khoảng trắng, dấu chấm và dấu gạch ngang",
      timer: 3000,
      timerProgressBar: true,
    });
    return false;
  }

  // 4. Validate tiểu sử (nếu có)
  if (author.value.biography && author.value.biography.trim().length > 1000) {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Tiểu sử không được vượt quá 1000 ký tự",
      timer: 2000,
      timerProgressBar: true,
    });
    return false;
  }

  // 5. Validate ngày sinh (nếu có)
  if (author.value.birthDate) {
    const birthDate = new Date(author.value.birthDate);
    const currentDate = new Date();
    const minDate = new Date("1900-01-01");

    if (birthDate > currentDate) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Ngày sinh không thể là ngày trong tương lai",
        timer: 2000,
        timerProgressBar: true,
      });
      return false;
    }

    if (birthDate < minDate) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Ngày sinh không hợp lệ",
        timer: 2000,
        timerProgressBar: true,
      });
      return false;
    }

    // Kiểm tra tuổi hợp lý (không quá 150 tuổi)
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age > 150) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Tuổi tác giả không hợp lý",
        timer: 2000,
        timerProgressBar: true,
      });
      return false;
    }
  }

  return true;
};

// ✅ Thêm validateEditAuthorForm function (tương tự validateAuthorForm nhưng cho editData)
const validateEditAuthorForm = () => {
  // 1. Validate tên tác giả (bắt buộc)
  if (!editData.value.authorName || editData.value.authorName.trim() === "") {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Vui lòng nhập tên tác giả",
      timer: 2000,
      timerProgressBar: true,
    });
    return false;
  }

  // 2. Validate độ dài tên tác giả
  const authorName = editData.value.authorName.trim();
  if (authorName.length < 2) {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Tên tác giả phải có ít nhất 2 ký tự",
      timer: 2000,
      timerProgressBar: true,
    });
    return false;
  }

  if (authorName.length > 100) {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Tên tác giả không được vượt quá 100 ký tự",
      timer: 2000,
      timerProgressBar: true,
    });
    return false;
  }

  // 3. Validate ký tự đặc biệt
  const nameRegex = /^[a-zA-ZÀ-ỹ0-9\s\.\-]+$/;
  if (!nameRegex.test(authorName)) {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Tên tác giả chỉ được chứa chữ cái, số, khoảng trắng, dấu chấm và dấu gạch ngang",
      timer: 3000,
      timerProgressBar: true,
    });
    return false;
  }

  // 4. Validate tiểu sử (nếu có)
  if (
    editData.value.biography &&
    editData.value.biography.trim().length > 1000
  ) {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Tiểu sử không được vượt quá 1000 ký tự",
      timer: 2000,
      timerProgressBar: true,
    });
    return false;
  }

  // 5. Validate ngày sinh (nếu có)
  if (editData.value.birthDate) {
    const birthDate = new Date(editData.value.birthDate);
    const currentDate = new Date();
    const minDate = new Date("1900-01-01");

    if (birthDate > currentDate) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Ngày sinh không thể là ngày trong tương lai",
        timer: 2000,
        timerProgressBar: true,
      });
      return false;
    }

    if (birthDate < minDate) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Ngày sinh không hợp lệ",
        timer: 2000,
        timerProgressBar: true,
      });
      return false;
    }

    // Kiểm tra tuổi hợp lý (không quá 150 tuổi)
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age > 150) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Tuổi tác giả không hợp lý",
        timer: 2000,
        timerProgressBar: true,
      });
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

  try {
    const payload = {
      authorName: authorData.authorName.trim(),
      biography: authorData.biography?.trim() || "",
      birthDate: authorData.birthDate || null,
    };

    await updateAuthor(id, payload);
    fetchAuthors();
    showEditModal.value = false;
    Swal.fire({
      icon: "success",
      title: "Cập nhật tác giả thành công!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật tác giả:", error);

    let errorMessage = "Không thể cập nhật tác giả.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      errorMessage = Object.values(error.response.data.errors).join(", ");
    }

    Swal.fire({
      icon: "error",
      title: "Cập nhật thất bại!",
      text: errorMessage,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
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

// ✅ Sửa lại watch - bỏ selectedStatus
watch([searchQuery], () => {
  const debouncedFetch = debounce(fetchAuthors, 500);
  currentPage.value = 0;
  debouncedFetch();
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

const handleDeleteAuthor = async (id) => {
  const result = await Swal.fire({
    title: "Bạn có chắc chắn muốn xóa tác giả này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (result.isConfirmed) {
    try {
      await deleteAuthor(id);
      fetchAuthors();
      Swal.fire({
        icon: "success",
        title: "Xóa tác giả thành công!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      // ✅ Lấy message từ API nếu có
      let errorMessage = "Không thể xóa tác giả.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).join(", ");
      }
      Swal.fire({
        icon: "error",
        title: "Xóa thất bại!",
        text: errorMessage,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }
};
</script>

<style scoped>
@import "@/assets/css/admin-global.css";
@import "@/assets/css/form-global.css";
</style>
