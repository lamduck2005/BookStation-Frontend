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
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-toggle-on me-1"></i>
              Trạng thái
            </label>
            <select class="form-select" v-model="selectedStatus">
              <option value="">Tất cả trạng thái</option>
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>
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
                <th style="width: 130px">Trạng thái</th>
                <th style="width: 180px">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="authors.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
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
                <td class="py-3">{{author.birthDate}}</td>
                <td class="py-3">
                  <ToggleStatus
                    :id="author.id"
                    v-model="author.status"
                    :true-value="1"
                    :false-value="0"
                    active-text="Hoạt động"
                    inactive-text="Không hoạt động"
                    @change="(status) => handleToggleStatus(author.id, status)"
                  />
                </td>
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
                <label class="form-label"
                  >Tên tác giả <span class="text-danger">*</span></label
                >
                <input
                  v-model="author.authorName"
                  class="form-control"
                  required
                  placeholder="Nhập tên tác giả"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Tiểu sử</label>
                <textarea
                  v-model="author.biography"
                  class="form-control"
                  placeholder="Nhập tiểu sử"
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select v-model="author.status" class="form-select">
                  <option :value="1">Hoạt động</option>
                  <option :value="0">Không hoạt động</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Ngày sinh</label>
                <input
                  v-model="author.birthDate"
                  type="date"
                  class="form-control"
                />
              </div>
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
                src="https://cdn-icons-png.flaticon.com/128/694/694604.png"
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
            <div class="mb-2">
              <b>Trạng thái:</b>
              <span
                :class="
                  detailAuthor.status === 1 ? 'text-success' : 'text-danger'
                "
              >
                {{
                  detailAuthor.status === 1 ? "Hoạt động" : "Không hoạt động"
                }}
              </span>
            </div>
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
                  placeholder="Nhập tên tác giả"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Tiểu sử</label>
                <textarea
                  v-model="editData.biography"
                  class="form-control"
                  placeholder="Nhập tiểu sử"
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select v-model="editData.status" class="form-select">
                  <option :value="1">Hoạt động</option>
                  <option :value="0">Không hoạt động</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Ngày sinh</label>
                <input
                  v-model="editData.birthDate"
                  type="date"
                  class="form-control"
                />
              </div>
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
  toggleStatus,
} from "../../../services/admin/author";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import AddButton from "@/components/common/AddButton.vue";
import EditButton from "@/components/common/EditButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import Pagination from "@/components/common/Pagination.vue";
import ToggleStatus from "@/components/common/ToggleStatus.vue";
import { debounce } from "@/utils/utils";

const authors = ref([]);
const showModal = ref(false);
const author = ref({
  authorName: "",
  biography: "",
  birthDate: "",
  status: 1, // mặc định là 1
});
const detailAuthor = ref({
  id: "",
  authorName: "",
  biography: "",
  birthDate: "",
  status: 1,
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
  status: 1,
});
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);
const searchQuery = ref("");
const selectedStatus = ref("");
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
  selectedStatus.value = "";
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
  if (!author.value.authorName) {
    Swal.fire({
      icon: "warning",
      title: "Vui lòng nhập tên tác giả",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
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
    Swal.fire({
      icon: "error",
      title: "Thêm tác giả thất bại!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
  }
};

function resetForm() {
  author.value = {
    authorName: "",
    biography: "",
    birthDate: "",
    status: 1, // luôn mặc định là 1
  };
}

function closeDetailModal() {
  showDetailModal.value = false;
}

const editAuthor = async (id) => {
  try {
    editData.value = await getAuthorById(id);
    showEditModal.value = true;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tác giả:", error);
  }
};

const handleUpdateAuthor = async (id, author) => {
  try {
    await updateAuthor(id, author);
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
    Swal.fire({
      icon: "error",
      title: "Cập nhật thất bại!",
      text: "Không thể cập nhật tác giả.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
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
      console.error("Lỗi khi xóa tác giả:", error);
      Swal.fire({
        icon: "error",
        title: "Xóa thất bại!",
        text: "Không thể xóa tác giả.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  }
};

// Hàm xử lý toggle status
const handleToggleStatus = async (id, status) => {
  try {
    await toggleStatus(id);
    // Refresh lại danh sách để đảm bảo đồng bộ
    fetchAuthors();
    Swal.fire({
      icon: "success",
      title: `Đã ${status === 1 ? "kích hoạt" : "tắt"} trạng thái!`,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error("Lỗi khi thay đổi trạng thái:", error);
    // Refresh lại để khôi phục trạng thái cũ
    fetchAuthors();
    Swal.fire({
      icon: "error",
      title: "Thay đổi trạng thái thất bại!",
      text: "Không thể thay đổi trạng thái tác giả.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
};


// Hàm lấy danh sách tác giả có phân trang
const fetchAuthors = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      name: searchQuery.value || undefined,
      status: selectedStatus.value || undefined,
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

// Watch để tự động fetch khi thay đổi search/filter
watch([searchQuery, selectedStatus], () => {
  const debouncedFetch = debounce(fetchAuthors, 500);
  currentPage.value = 0; // Reset về trang đầu khi search
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
