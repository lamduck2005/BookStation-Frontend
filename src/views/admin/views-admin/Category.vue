<template>
  <div class="container-fluid py-4">
    <!-- ========== BỘ LỌC CATEGORY ========== -->
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
              Tìm kiếm theo tên danh mục
            </label>
            <input
              type="text"
              class="form-control"
              v-model="searchQuery"
              placeholder="Nhập tên danh mục..."
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

    <!-- ================== BẢNG DANH SÁCH CATEGORY ================== -->
    <div class="card shadow-lg border-0 mb-4 category-table-card">
      <!-- Header bảng: Tên + nút -->
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
            @click="fetchCategory"
          >
            Thử lại
          </button>
        </div>
        <!-- Data table -->
        <div v-else>
          <table class="table align-middle table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 60px">#</th>
                <th style="width: 45%">Tên danh mục</th>
                <th style="width: 25%">Mô tả</th>
                <th style="width: 120px">Trạng thái</th>
                <th class="text-center" style="width: 150px">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="categories.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <!-- Dòng dữ liệu danh mục cha -->
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
                  <td class="py-3">
                    <!-- Thay thế badge bằng ToggleStatus -->
                    <ToggleStatus
                      :id="category.id"
                      v-model="category.status"
                      :true-value="1"
                      :false-value="0"
                      active-text="Hoạt động"
                      inactive-text="Không hoạt động"
                      @change="
                        (status) => handleToggleStatus(category.id, status)
                      "
                    />
                  </td>
                  <td class="py-3 text-center">
                    <div class="d-inline-flex gap-1">
                      <button
                        class="btn btn-outline-info btn-sm action-btn"
                        @click="viewCategory(category.id)"
                        title="Xem chi tiết"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <EditButton
                        @click="editCategory(category.id)"
                        title="Sửa"
                      />
                    </div>
                  </td>
                </tr>
                <!-- Hiển thị danh mục con -->
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
                    <td class="py-2">
                      <!-- Thay thế badge bằng ToggleStatus cho child category -->
                      <ToggleStatus
                        :id="child.id"
                        v-model="child.status"
                        :true-value="1"
                        :false-value="0"
                        active-text="Hoạt động"
                        inactive-text="Không hoạt động"
                        @change="
                          (status) => handleToggleStatus(child.id, status)
                        "
                      />
                    </td>
                    <td class="py-2 text-center">
                      <div class="d-inline-flex gap-1">
                        <button
                          class="btn btn-outline-info btn-sm action-btn"
                          @click="viewCategory(child.id)"
                          title="Xem chi tiết"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                        <EditButton
                          @click="editCategory(child.id)"
                          title="Sửa"
                        />
                       
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
  toggleStatus, // Thêm import toggleStatus
} from "../../../services/admin/category";
import AddButton from "@/components/common/AddButton.vue";
import EditButton from "@/components/common/EditButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import Pagination from "@/components/common/Pagination.vue";
import ToggleStatus from "@/components/common/ToggleStatus.vue"; // Import ToggleStatus component
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

// const handleDeleteCategory = async (id) => {
//   const result = await Swal.fire({
//     title: "Bạn có chắc chắn muốn xóa danh mục này?",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: "Xóa",
//     cancelButtonText: "Hủy",
//   });
//   if (result.isConfirmed) {
//     try {
//       await deleteCategory(id);
//       fetchCategory(); // Cập nhật lại danh sách danh mục

//       Swal.fire({
//         icon: "success",
//         title: "Xóa danh mục thành công!",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 2000,
//         timerProgressBar: true,
//       });
//     } catch (error) {
//       console.error("Lỗi khi xóa danh mục:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Xóa thất bại!",
//         text: "Không thể xóa danh mục.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 2000,
//         timerProgressBar: true,
//       });
//     }
//   }
// };

// Hàm xử lý toggle status
const handleToggleStatus = async (id, status) => {
  try {
    await toggleStatus(id);
    // Refresh lại danh sách để đảm bảo đồng bộ
    fetchCategory();
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
    fetchCategory();
    Swal.fire({
      icon: "error",
      title: "Thay đổi trạng thái thất bại!",
      text: "Không thể thay đổi trạng thái danh mục.",
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
