<template>
  <div class="container-fluid py-4">
    <!-- ========== BỘ LỌC AUTHOR ========== -->
    <div class="card mb-5 shadow-lg border-0 filter-card">
      <div class="card-header bg-light border-0 py-3">
        <h5 class="mb-0 text-secondary">
          <i class="bi bi-funnel me-2"></i>
          Bộ lọc tìm kiếm
        </h5>
      </div>
      <div class="card-body">
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
          <!-- ✅ BỎ cột filter trạng thái -->
        </div>
        <div class="row g-3 pt-3 d-flex justify-content-center">
          <div class="col-md-1">
            <button
              class="btn btn-outline-success w-100 me-2"
              @click="searchWithFilter"
            >
              <i class="bi bi-funnel"></i> Lọc
            </button>
          </div>
          <div class="col-md-2">
            <button
              class="btn btn-outline-secondary w-100"
              @click="clearFilters"
            >
              <i class="bi bi-x-circle me-1"></i> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================== BẢNG DANH SÁCH AUTHOR ================== -->
    <div class="card shadow-lg border-0 mb-4 author-table-card">
      <!-- Header bảng: Tên + nút -->
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
          <!-- Nút làm mới dữ liệu -->
          <button
            class="btn btn-outline-info btn-sm py-2"
            @click="reloadPage"
            :disabled="loading"
          >
            <i class="bi bi-arrow-repeat me-1"></i> Làm mới
          </button>
          <!-- Nút thêm mới -->
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
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
        </div>
        <!-- Error state -->
        <div v-else-if="error" class="alert alert-danger m-4" role="alert">
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
          <table class="table align-middle table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 40px">#</th>
                <th style="width: 200px">Tên tác giả</th>
                <th>Tiểu sử</th>
                <th style="width: 120px">Ngày sinh</th>
                <!-- ✅ BỎ cột trạng thái -->
                <th style="width: 180px">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="authors.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <!-- Dòng dữ liệu -->
              <tr
                v-for="(author, index) in authors"
                :key="author.id"
                class="align-middle"
                style="vertical-align: middle"
              >
                <td class="py-3">{{ currentPage * pageSize + index + 1 }}</td>
                <td class="py-3 fw-semibold">{{ author.authorName }}</td>
                <td
                  class="py-3"
                  style="max-width: 300px; white-space: pre-line"
                >
                  {{ author.biography }}
                </td>
                <td class="py-3">{{ author.birthDate }}</td>
                <!-- ✅ BỎ cột hiển thị trạng thái -->
                <td class="py-3">
                  <div class="d-inline-flex gap-1">
                    <button
                      class="btn btn-outline-dark action-btn"
                      @click="viewAuthor(author.id)"
                      title="Xem"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <EditButton @click="editAuthor(author.id)" title="Sửa" />
                    <DeleteButton
                      @click="handleDeleteAuthor(author.id)"
                      title="Xóa"
                    />
                  </div>
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
      <div class="modal-dialog" style="max-width: 450px">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #ecae9e">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>
              Thêm tác giả
            </h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <img
                src="https://cdn-icons-png.flaticon.com/128/694/694604.png"
                alt="Close"
              />
            </button>
          </div>
          <div class="modal-body">
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
              <!-- ✅ BỎ select trạng thái -->
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-primary"
              style="background-color: #33304e; border-color: #33304e"
              @click="add"
            >
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
      <div class="modal-dialog" style="max-width: 450px">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #ecae9e">
            <h5 class="modal-title">
              <i class="bi bi-info-circle me-2"></i>
              Chi tiết tác giả
            </h5>
            <button
              type="button"
              class="custom-close-btn"
              @click="closeDetailModal"
            >
              <img
               
                alt="Close"
              />
            </button>
          </div>

          <div class="modal-body">
            <div class="mb-2"><b>ID:</b> {{ detailAuthor.id }}</div>
            <div class="mb-2">
              <b>Tên tác giả:</b> {{ detailAuthor.authorName }}
            </div>
            <div class="mb-2"><b>Tiểu sử:</b> {{ detailAuthor.biography }}</div>
            <div class="mb-2">
              <b>Ngày sinh:</b> {{ detailAuthor.birthDate }}
            </div>
            <!-- ✅ BỎ hiển thị trạng thái -->
            <div class="mb-2">
              <b>Ngày tạo:</b> {{ detailAuthor.createdAt }}
            </div>
            <div class="mb-2">
              <b>Ngày cập nhật:</b> {{ detailAuthor.updatedAt }}
            </div>
            <div class="mb-2">
              <b>Người tạo:</b> {{ detailAuthor.createdBy }}
            </div>
            <div class="mb-2">
              <b>Người cập nhật:</b> {{ detailAuthor.updatedBy }}
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
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
      <div class="modal-dialog" style="max-width: 450px">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #ecae9e">
            <h5 class="modal-title d-flex align-items-center gap-2">
              <i class="bi bi-pencil-square me-2"></i> Sửa tác giả
            </h5>
            <button
              type="button"
              class="custom-close-btn"
              @click="showEditModal = false"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/694/694604.png"
                alt="Close"
              />
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="update">
              <div class="mb-3">
                <label class="form-label"
                  >Tên tác giả <span class="text-danger">*</span></label
                >
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
                  {{ editData.biography ? editData.biography.length : 0 }}/1000
                  ký tự
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
              <!-- ✅ BỎ select trạng thái -->
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showEditModal = false"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-primary"
              style="background-color: #33304e; border-color: #33304e"
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
  // ✅ BỎ import toggleStatus
} from "../../../services/admin/author";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import AddButton from "@/components/common/AddButton.vue";
import EditButton from "@/components/common/EditButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import Pagination from "@/components/common/Pagination.vue";
// ✅ BỎ import ToggleStatus component
import { debounce } from "@/utils/utils";

const authors = ref([]);
const showModal = ref(false);
const author = ref({
  authorName: "",
  biography: "",
  birthDate: "",
  // ✅ BỎ status field
});
const detailAuthor = ref({
  id: "",
  authorName: "",
  biography: "",
  birthDate: "",
  // ✅ BỎ status field
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
  // ✅ BỎ status field
});
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);
const searchQuery = ref("");
// ✅ BỎ selectedStatus
const loading = ref(false);
const error = ref(null);

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
  // ✅ BỎ reset selectedStatus
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
    // ✅ BỎ status: 1
  };
};

const resetEditForm = () => {
  editData.value = {
    id: "",
    authorName: "",
    biography: "",
    birthDate: "",
    // ✅ BỎ status: 1
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
      // ✅ BỎ status: data.status
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
    // ✅ BỎ status: 1
    createdAt: "",
    updatedAt: "",
    createdBy: "",
    updatedBy: "",
  };
};

// ✅ BỎ hàm handleToggleStatus hoàn toàn

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

  // ✅ BỎ validation status

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
      // ✅ BỎ status: parseInt(authorData.status)
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

// ✅ Sửa lại validateEditAuthorForm - bỏ validation status (tương tự validateAuthorForm)

// ✅ Sửa lại fetchAuthors - bỏ param status
const fetchAuthors = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      name: searchQuery.value || undefined,
      // ✅ BỎ status: selectedStatus.value || undefined
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
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.modal-dialog {
  max-width: 450px !important;
}

.modal-content {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: none;
  padding: 0;
}

.modal-header {
  border-bottom: 2px solid #ecae9e;
  border-radius: 15px 15px 0 0;
  padding: 0.8rem 1.2rem;
  position: relative;
  background-color: #ecae9e;
}

.modal-title {
  font-weight: 600;
  color: #2c2c54;
  font-size: 1.1rem;
}

.custom-close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.custom-close-btn img {
  width: 30px;
  height: 30px;
}

.action-btn {
  border-radius: 8px;
  margin: 0 2px;
  padding: 6px 10px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #f0f0f0;
}

/* Chỉ bo tròn cho div ngoài cùng, không ảnh hưởng header/body bên trong */
.filter-card,
.author-table-card {
  border-radius: 0.8rem !important;
  overflow: hidden;
}

/* Loading spinner */
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
