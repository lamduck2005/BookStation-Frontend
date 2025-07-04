<template>
  <div class="container mt-4">
    <!-- Breadcrumb -->
    <div class="mb-2" style="font-weight: 500; color: #555">
      Admin / <span style="color: black; font-weight: bold">Category</span>
    </div>
    <!-- Nút thêm danh mục mới -->

    <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #ecae9e"
      >
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5 class="mb-0">Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-6">
          <label class="form-label">Tìm kiếm:</label>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập tên danh mục"
            v-model="searchQuery"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Không hoạt động</option>
          </select>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-end mb-3">
      <AddButton @click="openModal" />
    </div>
    <div class="div-list-category">
      <!-- Tiêu đề danh sách -->
      <div class="category-list-title-custom">Danh sách Category</div>

      <div class="table-responsive">
        <table
          class="table align-middle table-hover custom-table shadow-sm rounded"
        >
          <thead class="table-light">
            <tr>
              <th style="width: 50px">#</th>
              <th style="width: 50%">Tên danh mục</th>
              <th>Mô tả</th>
              <th style="width: 100px">Trạng thái</th>
              <th class="text-center text-nowrap" style="width: 150px">
                Chức năng
              </th>
            </tr>
          </thead>
          <tbody v-for="(category, index) in categories" :key="category.id">
            <tr>
              <td>{{ index + 1 }}</td>
              <td>
                <button
                  v-if="
                    category.parentCategory && category.parentCategory.length
                  "
                  @click="toggleCollapse(category)"
                  class="btn"
                >
                  <span class="node-icon me-2">
                    <i v-if="category.isOpen" class="bi bi-caret-down-fill"></i>
                    <i v-else class="bi bi-caret-right-fill"></i>
                  </span>
                  {{ category.categoryName }}
                </button>
                <span v-else>{{ category.categoryName }}</span>
              </td>

              <td style="max-width: 200px; white-space: pre-line">
                {{ category.description }}
              </td>
              <td>
                <span
                  :class="
                    category.status === 1
                      ? 'badge bg-success'
                      : 'badge bg-danger'
                  "
                >
                  {{ category.status === 1 ? "Hoạt động" : "Không hoạt động" }}
                </span>
              </td>
              <td class="text-center text-nowrap">
                <div class="d-inline-flex gap-1">
                  <button
                    class="btn btn-outline-dark action-btn"
                    @click="viewCategory(category.id)"
                    title="Xem"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <EditButton @click="editCategory(category.id)" title="Sửa" />
                  <ToggleStatus
                    :status="category.status"
                    @toggle="handleToggleStatus(category.id)"
                  />
                  <DeleteButton
                    @click="handleDeleteCategory(category.id)"
                    title="Xóa"
                  />
                </div>
              </td>
            </tr>
            <!-- Hiển thị con nếu mở -->
            <tr
              v-if="category.parentCategory && category.parentCategory.length"
              v-for="(child, index) in category.parentCategory"
              :key="child?.id || 'no-id'"
              v-show="category.isOpen"
            >
              <td>{{ index + 1 }}</td>
              <td style="padding-left: 50px">
                <span class="node-icon">
                  {{ child.categoryName ? child.categoryName : "Không có tên" }}
                </span>
              </td>
              <td style="max-width: 200px; white-space: pre-line">
                {{ child?.description ? child.description : "Không có mô tả" }}
              </td>
              <td>
                <span
                  :class="
                    child?.status === 1 ? 'badge bg-success' : 'badge bg-danger'
                  "
                >
                  {{ child?.status === 1 ? "Hoạt động" : "Không hoạt động" }}
                </span>
              </td>
              <td class="text-center text-nowrap">
                <div class="d-inline-flex gap-1">
                  <button
                    class="btn btn-outline-dark action-btn"
                    @click="viewCategory(child.id)"
                    title="Xem"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <EditButton @click="editCategory(child.id)" title="Sửa" />
                  <ToggleStatus
                    :status="child.status"
                    @toggle="handleToggleStatus(child.id)"
                  />
                  <DeleteButton
                    @click="handleDeleteCategory(child.id)"
                    title="Xóa"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
    <div class="modal-dialog" style="max-width: 450px">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #ecae9e">
          <h5 class="modal-title" id="addCategoryModalLabel">
            <i class="bi bi-plus-circle me-2"></i>
            Thêm danh mục
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
                Tên danh mục <span class="text-danger">*</span>
              </label>
              <input
                v-model="category.categoryName"
                class="form-control"
                required
                placeholder="Nhập tên danh mục"
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
                placeholder="Nhập mô tả"
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Trạng thái</label>
              <select v-model="category.status" class="form-select">
                <option :value="1">Hoạt động</option>
                <option :value="0">Không hoạt động</option>
              </select>
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

  <!-- Modal chi tiết danh mục -->
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
            Chi tiết danh mục
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
          <div class="mb-2"><b>ID:</b> {{ detailCategory.id }}</div>
          <div class="mb-2">
            <b>Tên danh mục:</b> {{ detailCategory.categoryName }}
          </div>
          <div class="mb-2"><b>Mô tả:</b> {{ detailCategory.description }}</div>
          <div class="mb-2">
            <b>Ngày tạo:</b> {{ detailCategory.createdAt }}
          </div>
          <div class="mb-2">
            <b>Ngày cập nhật:</b> {{ detailCategory.updatedAt }}
          </div>
          <div class="mb-2">
            <b>Người tạo:</b> {{ detailCategory.createdBy }}
          </div>
          <div class="mb-2">
            <b>Người cập nhật:</b> {{ detailCategory.updatedBy }}
          </div>
          <div class="mb-2">
            <b>Danh Mục Cha:</b>
            {{ detailCategory.parentCategory?.categoryName || "Không có" }}
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

  <!-- Modal sửa danh mục -->
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
            <i class="bi bi-pencil-square me-2"></i> Sửa danh mục
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
              <label class="form-label">
                Tên danh mục <span class="text-danger">*</span>
              </label>
              <input
                v-model="editData.categoryName"
                class="form-control"
                required
                placeholder="Nhập tên danh mục"
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
                placeholder="Nhập mô tả"
              ></textarea>
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

import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getAllExceptId,
  getAllParentCategories,
  getCategoryById,
  updateCategory,
} from "../../../services/admin/category";
import AddButton from "@/components/common/AddButton.vue";
import EditButton from "@/components/common/EditButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import ToggleStatus from "@/components/common/ToggleStatus.vue";
import Pagination from "@/components/common/Pagination.vue";
import { debounce } from "@/utils/utils";

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
  createdBy: "",
  updatedBy: "",
});
const showDetailModal = ref(false);
const showEditModal = ref(false);
const editData = ref({
  id: "",
  categoryName: "",
  description: "",
});
const searchQuery = ref("");
const selectedStatus = ref("");

// Pagination variables
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

const toggleCollapse = (category) => {
  category.isOpen = !category.isOpen;
};
const fetchCategory = async () => {
  try {
    const getAll = await getAllCategories();
    dataGetAll.value = getAll;

    // Fetch with pagination parameters
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      name: searchQuery.value || undefined,
      status: selectedStatus.value || undefined,
    };

    const response = await getAllParentCategories(params);

    const data = response.data ? response.data : response;

    categories.value = data.content || data;
    totalPages.value = data.totalPages ?? 1;
    totalElements.value = data.totalElements ?? categories.value.length;
    currentPage.value = data.page ?? currentPage.value;
    pageSize.value = data.size ?? pageSize.value;
    isLastPage.value = currentPage.value >= totalPages.value - 1;

    console.log("=== DEBUG PAGINATION DATA ===");
    console.log("Original response:", response);
    console.log("Processed data:", data);
    console.log("categories.value:", categories.value);
    console.log("totalPages:", totalPages.value);
    console.log("totalElements:", totalElements.value);
    console.log("currentPage:", currentPage.value);
    console.log("pageSize:", pageSize.value);
    console.log("isLastPage:", isLastPage.value);
    console.log("============================");

    console.log("Danh sách danh mục sau khi xử lý:", categories.value);
  } catch (error) {
    console.error("Lỗi khi tải danh sách danh mục:", error);
  }
};

onMounted(() => {
  fetchCategory();
});

const viewCategory = async (id) => {
  try {
    detailCategory.value = await getCategoryById(id);
    showDetailModal.value = true;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin danh mục:", error);
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

const add = async () => {
  if (!category.value.categoryName) {
    alert("Vui lòng nhập tên danh mục");
    return;
  }

  // Tạo payload chỉ chứa ID của parentCategory
  const payload = {
    ...category.value,
  };

  try {
    console.log("Payload sent to BE:", payload);
    await addCategory(payload);
    fetchCategory(); // Cập nhật lại danh sách danh mục
    closeModal();
    Swal.fire({
      icon: "success",
      title: "Thêm danh mục thành công!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
    Swal.fire({
      icon: "error",
      title: "Thêm thất bại!",
      text: "Không thể thêm danh mục.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
};
const resetForm = () => {
  category.value = {
    categoryName: "",
    parentCategory: {
      id: null,
      categoryName: "",
      description: "",
    },
    description: "",
  };
};

const closeDetailModal = () => {
  showDetailModal.value = false;
};
const editCategory = async (id) => {
  try {
    dataGetAll.value = await getAllExceptId(id);
    editData.value = await getCategoryById(id);
    console.log("Edit Data:", editData.value);
    showEditModal.value = true;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin danh mục:", error);
  }
};

const handleUpdateCategory = async (id, category) => {
  try {
    await updateCategory(id, category);
    fetchCategory();
    showEditModal.value = false;
    Swal.fire({
      icon: "success",
      title: "Cập nhật danh mục thành công!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    Swal.fire({
      icon: "error",
      title: "Cập nhật thất bại!",
      text: "Không thể cập nhật danh mục.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
};

const handleDeleteCategory = async (id) => {
  const result = await Swal.fire({
    title: "Bạn có chắc chắn muốn xóa danh mục này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (result.isConfirmed) {
    try {
      await deleteCategory(id);
      fetchCategory(); // Cập nhật lại danh sách danh mục

      Swal.fire({
        icon: "success",
        title: "Xóa danh mục thành công!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      Swal.fire({
        icon: "error",
        title: "Xóa thất bại!",
        text: "Không thể xóa danh mục.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  }
};

const handleToggleStatus = async (id) => {
  try {
    await toggleStatus(id);
    fetchCategory(); // Refresh the list to show updated status

    Swal.fire({
      icon: "success",
      title: "Cập nhật trạng thái thành công!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái danh mục:", error);
    Swal.fire({
      icon: "error",
      title: "Cập nhật trạng thái thất bại!",
      text: "Không thể cập nhật trạng thái danh mục.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
};

// Watch để tự động fetch khi thay đổi filter hoặc phân trang
watch([searchQuery, selectedStatus, pageSize, currentPage], () => {
  debounce(fetchCategory(), 500);
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
.div-list-category {
  padding-top: 10px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px 10px 0 0px;
}
.table td {
  vertical-align: middle;
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
  border-radius: 12px;
  padding: 0;
  min-width: 350px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}
.modal-content {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: none;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #eee;
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
.btn-close {
  background: none;
  border: none;
  font-size: 1.3rem;
}
.form-control,
textarea {
  border-radius: 8px;
  font-size: 1rem;
  padding: 10px 12px;
}
.category-list-title {
  margin-left: 10px;
  background: none;
  font-weight: bold;
  color: #222;
  font-size: 1.1rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-bottom: 0;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.03);
  border-bottom: 1.5px solid #e0e0e0;
}

.category-list-title-custom {
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

.btn-success {
  border-radius: 8px;
  font-weight: 500;
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
.modal-footer {
  border-top: none;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Table responsive improvements */
.table-responsive {
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
}

.table-responsive table {
  min-width: 800px; /* Ensure table has minimum width for proper scrolling */
}

.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive table fixes */
@media (max-width: 1200px) {
  .table-responsive table {
    min-width: 900px;
  }
}

@media (max-width: 992px) {
  .table-responsive table {
    min-width: 800px;
  }
}

@media (max-width: 768px) {
  .table-responsive table {
    min-width: 700px;
  }
}
</style>
