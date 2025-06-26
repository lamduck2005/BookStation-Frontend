<template>
  <div class="container mt-4">
    <!-- Breadcrumb -->
    <div class="mb-2" style="font-weight: 500; color: #555">
      Admin / <span style="color: black; font-weight: bold">Author</span>
    </div>
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #ecae9e"
      >
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-6">
          <label class="form-label">Tìm kiếm:</label>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập tên tác giả"
            v-model="searchQuery"
          />
        </div>
      </div>
    </div>

    <!-- Nút thêm mới -->
    <div class="d-flex justify-content-end mb-3">
      <AddButton @click="openModal" />
    </div>

    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #ecae9e"
      >
        <strong>Danh sách Author</strong>
      </div>

      <div class="p-3">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th style="width: 170px">Tên tác giả</th>
              <th>Tiểu sử</th>
              <th style="width: 110px">Ngày sinh</th>
              <th class="text-center text-nowrap" style="width: 150px">
                Chức năng
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(author, index) in authors" :key="author.id">
              <td>{{ index + 1 }}</td>
              <td>{{ author.authorName }}</td>
              <td style="max-width: 200px; white-space: pre-line">
                {{ author.biography }}
              </td>
              <td>{{ formatDate(author.birthDate) }}</td>
              <td class="text-center text-nowrap">
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
    </div>
  </div>
  <!-- Form nổi thêm tác giả -->
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
          <div class="mb-2"><b>Ngày sinh:</b> {{ detailAuthor.birthDate }}</div>
          <div class="mb-2">
            <b>Ngày tạo:</b> {{ formatDate(detailAuthor.createdAt) }}
          </div>
          <div class="mb-2">
            <b>Ngày cập nhật:</b> {{ formatDate(detailAuthor.updatedAt) }}
          </div>
          <div class="mb-2"><b>Người tạo:</b> {{ detailAuthor.createdBy }}</div>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
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

onMounted(async () => {
  authors.value = await getAllAuthors();
});

const viewAuthor = async (id) => {
  try {
    detailAuthor.value = await getAuthorById(id);
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
    alert("Vui lòng nhập tên tác giả");
    return;
  }
  try {
    await addAuthor(author.value);

    authors.value = await getAllAuthors();
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
  }
};
function resetForm() {
  author.value = {
    authorName: "",
    biography: "",
    birthDate: "",
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
    authors.value = await getAllAuthors();
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
      authors.value = await getAllAuthors();
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

function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.split("T")[0];
}
</script>

<style scoped>
.div-list-author {
  padding-top: 10px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px 10px 0 0px;
}
.table {
  overflow-x: auto;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content-custom {
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  min-width: 350px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
}
.author-list-title {
  margin-left: 10px;

  background: #fff;
  font-weight: normal; /* Bỏ đậm */
  color: #222;
  font-weight: bold;
  font-size: 1.1rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-bottom: 0;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.03); /* Đổ bóng nhẹ nếu muốn */
  border-bottom: 1.5px solid #e0e0e0;
}

.custom-table thead tr {
  background-color: #fff; /* Xóa gạch màu ở top table */
  color: #222;
}
.custom-table {
  margin-top: 20px;
  border-radius: 12px;
  border: 1.5px solid #e0e0e0; /* Viền mờ mờ */
  overflow: hidden;
  width: 100%;
  font-size: 1.05rem;
}
.custom-table th:first-child {
  border-top-left-radius: 8px;
}
.custom-table th:last-child {
  border-top-right-radius: 8px;
}
.table th,
.table td {
  vertical-align: middle;
}

.modal-dialog {
  max-width: 450px !important;
}

.modal-content,
.modal-content-custom {
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

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.add-author-btn {
  border-radius: 8px;
  font-weight: 500;
  padding: 8px 20px;
  font-size: 1.05rem;
  background: #fff;
  border: 2px solid #28a745;
  color: #28a745;
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.add-author-btn:hover,
.add-author-btn:focus {
  background: #28a745;
  color: #fff;
  border: 2px solid #28a745;
}
.add-author-btn i {
  font-size: 1.2rem;
}

.category-list-title-custom,
.author-list-title {
  background: #ecae9e;
  font-weight: bold;
  color: #222;
  font-size: 1.1rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-bottom: 0;
  padding: 12px 18px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.03);
  border-bottom: 1.5px solid #e0e0e0;
}

.custom-table {
  margin-top: 20px;
  border-radius: 12px;
  border: 1.5px solid #e0e0e0;
  overflow: hidden;
  width: 100%;
  font-size: 1.05rem;
}
.custom-table thead tr {
  background-color: #f8f9fa;
  color: #222;
}
.custom-table tbody tr:hover {
  background-color: #f3f6fa;
}
.custom-table th,
.custom-table td {
  padding: 14px 12px;
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
</style>

<!-- Bootstrap Icons CDN -->
