<template>
  <div class="admin-page container-fluid py-4">
    <OverviewStatsComponent :stats="stats" />
    <!-- ========== BỘ LỌC FLASH SALE ========== -->
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
          <div class="col-md-4">
            <label class="form-label">
              <i class="bi bi-search me-1"></i>
              Tìm kiếm theo tên chương trình
            </label>
            <input
              type="text"
              class="form-control"
              v-model="filter.name"
              placeholder="Nhập tên chương trình..."
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">
              <i class="bi bi-toggle-on me-1"></i>
              Trạng thái
            </label>
            <select class="form-select" v-model="filter.status">
              <option value="">Tất cả trạng thái</option>
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-calendar me-1"></i>
              Ngày bắt đầu
            </label>
            <input
              type="datetime-local"
              class="form-control"
              v-model="filter.from"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-calendar me-1"></i>
              Ngày kết thúc
            </label>
            <input
              type="datetime-local"
              class="form-control"
              v-model="filter.to"
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

    <!-- ================== BẢNG DANH SÁCH FLASH SALE ================== -->
    <div class="card shadow-lg border-0 mb-4 admin-table-card">
      <!-- Header bảng: Tên + nút -->
      <div
        class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3"
      >
        <div>
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-lightning-charge me-2"></i>
            Danh sách chương trình Flash Sale
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
            @click="openAddForm"
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
            @click="getDataFromApi"
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
                <th>Tên chương trình</th>
                <th>Thời gian bắt đầu</th>
                <th>Thời gian kết thúc</th>
                <th>Ngày tạo</th>
                <th>Ngày cập nhật</th>
                <th style="width: 200px">Trạng thái</th>
                <th style="width: 120px">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="flashSales.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <!-- Dòng dữ liệu, dãn dọc py-3 -->
              <tr
                v-for="(item, index) in flashSales"
                :key="item.id"
                class="align-middle"
                style="vertical-align: middle"
              >
                <td class="py-3">{{ currentPage * pageSize + index + 1 }}</td>
                <td class="py-3">
                  <router-link
                    :to="`/admin/flash-sale/${item.id}`"
                    class="fw-semibold text-decoration-underline"
                  >
                    {{ item.name }}
                  </router-link>
                </td>
                <td class="py-3">{{ formatDateTime(item.startTime) }}</td>
                <td class="py-3">{{ formatDateTime(item.endTime) }}</td>
                <td class="py-3">{{ formatDateTime(item.createdAt) }}</td>
                <td class="py-3">{{ formatDateTime(item.updatedAt) }}</td>
                <td class="py-3">
                  <ToggleStatus
                    :id="item.id"
                    v-model="item.status"
                    :true-value="1"
                    :false-value="0"
                    active-text="Hoạt động"
                    inactive-text="Không hoạt động"
                    @change="handleStatusChange(item.id)"
                  />
                </td>
                <td class="py-3">
                  <EditButton @click="openEditForm(item)" />
                  <!-- <DeleteButton @click="handleDeleteFunction(item)" /> -->
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
    <!-- ================== HẾT PHẦN BẢNG DANH SÁCH FLASH SALE ================== -->

    <!-- Modal Thêm/Sửa  -->
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
                  >Tên chương trình <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.name"
                  required
                  placeholder="Nhập tên flash sale"
                />
              </div>
              <div class="mb-3">
                <label class="form-label"
                  >Thời gian bắt đầu <span class="text-danger">*</span></label
                >
                <input
                  type="datetime-local"
                  class="form-control"
                  v-model="formData.startTime"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label"
                  >Thời gian kết thúc <span class="text-danger">*</span></label
                >
                <input
                  type="datetime-local"
                  class="form-control"
                  v-model="formData.endTime"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" v-model="formData.status">
                  <option value="1">Hoạt động</option>
                  <option value="0">Không hoạt động</option>
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
import EditButton from "@/components/common/EditButton.vue";
import Pagination from "@/components/common/Pagination.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import OverviewStatsComponent from "@/components/common/OverviewStatsComponent.vue";
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";
import { showToast } from "@/utils/swalHelper.js";
import ToggleStatus from "@/components/common/ToggleStatus.vue";
import {
  addFlashSale,
  getAllFlashSale,
  toggleStatusFlashSale,
  updateFlashSale,
  getFlashSaleStats,
} from "@/services/admin/flashSale";
import {
  datetimeLocalToTimestamp,
  timestampToDatetimeLocal,
} from "@/utils/utils.js";

const filter = ref({
  name: "",
  from: "",
  to: "",
  status: "",
});

const flashSales = ref([]);

// Pagination state
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);

// Computed property for last page check
const isLastPage = ref(false);

// API data for points
const loading = ref(false);
const error = ref(null);

const isEditMode = ref(false);

// Form data object
const formData = ref({
  id: "",
  name: "",
  startTime: "",
  endTime: "",
  status: 1,
});

const stats = ref([
  { label: "Tổng số Flash Sale", value: 0 },
  { label: "Đơn hàng đã bán dùng Flash", value: 0 },
  { label: "Flash đang hoạt động", value: 0 },
  {
    label: "Top sách được bán nhiều nhất",
    value: "",
  },
]);

// Định dạng ngày giờ
function formatDateTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString("vi-VN", { hour12: false });
}

// Gọi API với các bộ lọc hiện tại
const searchWithFilter = () => {
  getDataFromApi(0, pageSize.value);
};

const clearFilters = () => {
  filter.value = {
    name: "",
    from: "",
    to: "",
    status: "",
  };
  getDataFromApi(0, pageSize.value);
};

//reload
const reloadPage = () => {
  getDataFromApi(currentPage.value, pageSize.value);
};

//trạng thái
const handleStatusChange = (id) => {
  toggleStatusFlashSale(id)
    .then((res) => {
      showToast(
        "success",
        res.data.message || "Thay đổi trạng thái thành công!"
      );
    })
    .catch((error) => {
      showToast("error", error.response?.data?.message || "Có lỗi xảy ra!");
      console.log(error);
    });
};

// thêm sửa
const openAddForm = async () => {
  isEditMode.value = false;
  resetFormData();
  const modalElement = document.getElementById("formModal");
  if (modalElement) {
    const modal = Modal.getOrCreateInstance(modalElement);
    modal.show();
  }
};

const openEditForm = async (item) => {
  isEditMode.value = true;
  // Set dữ liệu vào form
  formData.value = {
    id: item.id,
    name: item.name,
    startTime: timestampToDatetimeLocal(item.startTime),
    endTime: timestampToDatetimeLocal(item.endTime),
    status: item.status,
  };
  const modalElement = document.getElementById("formModal");
  if (modalElement) {
    const modal = Modal.getOrCreateInstance(modalElement);
    modal.show();
  }
};

const validateForm = () => {
  if (
    !formData.value.name ||
    !formData.value.startTime ||
    !formData.value.endTime
  ) {
    showToast("error", "Vui lòng điền đầy đủ thông tin!");
    return false;
  }

  // Kiểm tra thời gian kết thúc phải lớn hơn thời gian bắt đầu
  const startTime = datetimeLocalToTimestamp(formData.value.startTime);
  const endTime = datetimeLocalToTimestamp(formData.value.endTime);

  if (endTime <= startTime) {
    showToast("error", "Thời gian kết thúc phải lớn hơn thời gian bắt đầu!");
    return false;
  }

  return true;
};
const handleSubmitForm = async () => {
  try {
    if (!validateForm()) {
      return;
    }

    // Chuyển đổi datetime-local thành timestamp milliseconds
    const submitData = {
      name: formData.value.name,
      startTime: datetimeLocalToTimestamp(formData.value.startTime),
      endTime: datetimeLocalToTimestamp(formData.value.endTime),
      status: parseInt(formData.value.status),
    };

    if (!isEditMode.value) {
      const res = await addFlashSale(submitData);
      showToast("success", res.data.message || "Thêm mới thành công!");
      closeModal();
      // Reload lại dữ liệu sau khi thêm thành công
      await getDataFromApi(currentPage.value, pageSize.value);
    } else {
      const res = await updateFlashSale(formData.value.id, submitData);
      showToast("success", res.data.message || "Cập nhật thành công!");
      closeModal();
      // Reload lại dữ liệu sau khi thêm thành công
      await getDataFromApi(currentPage.value, pageSize.value);
      showToast("success", "Cập nhật thành công!");
    }
  } catch (error) {
    // ✅ Lấy message từ API nếu có
    let errorMessage = "Có lỗi xảy ra!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      errorMessage = Object.values(error.response.data.errors).join(", ");
    }
    showToast("error", errorMessage);
  }
};

const handleDeleteFunction = async (item) => {
  showToast("warning", "Chức năng xoá!");
};

const closeModal = () => {
  const modalElement = document.getElementById("formModal");
  if (modalElement) {
    const modal = Modal.getOrCreateInstance(modalElement);
    modal.hide();
  }
};

// Pagination functions
const handlePrev = () => {
  if (currentPage.value > 0) {
    getDataFromApi(currentPage.value - 1, pageSize.value);
  }
};
const handleNext = () => {
  if (!isLastPage.value) {
    getDataFromApi(currentPage.value + 1, pageSize.value);
  }
};
const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  getDataFromApi(0, newSize); // Reset về trang đầu khi thay đổi page size
};

const resetFormData = () => {
  formData.value = {
    name: "",
    startTime: "",
    endTime: "",
    status: 1,
  };
};

// Format datetime for input datetime-local
function formatDateTimeForInput(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
}

//load dữ liệu
const getDataFromApi = async (page, size) => {
  loading.value = true;
  error.value = null;
  try {
    // Xây dựng params đúng với API mới
    const params = {
      page,
      size,
    };
    if (filter.value.name) params.name = filter.value.name;
    if (filter.value.status !== "") params.status = filter.value.status;
    if (filter.value.from)
      params.from = datetimeLocalToTimestamp(filter.value.from);
    if (filter.value.to) params.to = datetimeLocalToTimestamp(filter.value.to);

    const res = await getAllFlashSale(params);
    const resData = res.data.data;
    console.log("🚀 ~ getDataFromApi ~ res:", res);

    if (res && res.status === 200 && resData) {
      flashSales.value = resData.content;
      currentPage.value = resData.pageNumber;
      pageSize.value = resData.pageSize;
      totalElements.value = resData.totalElements;
      totalPages.value = resData.totalPages;
      isLastPage.value = resData.last;
    } else {
      flashSales.value = [];
      totalElements.value = 0;
      totalPages.value = 1;
      isLastPage.value = true;
    }
  } catch (err) {
    error.value = "Lỗi khi tải dữ liệu!";
    flashSales.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchStats = async () => {
  try {
    const res = await getFlashSaleStats();
    const data = res.data.data;
    stats.value = [
      { label: "Tổng số Flash Sale", value: data.totalFlashSales },
      { label: "Đơn hàng đã bán dùng Flash", value: data.totalFlashSaleOrders },
      { label: "Flash đang hoạt động", value: data.activeFlashSales },
      {
        label: "Sách được mua nhiều nhất trong Flash sale đang diễn ra",
        value: data.bestSellingFlashSaleBookName || "—",
      },
    ];
  } catch (e) {
    stats.value = [
      { label: "Tổng số Flash Sale", value: 0 },
      { label: "Đơn hàng đã bán dùng Flash", value: 0 },
      { label: "Flash đang hoạt động", value: 0 },
      {
        label: "Sách được mua nhiều nhất trong Flash sale đang diễn ra",
        value: "—",
      },
    ];
  }
};

onMounted(() => {
  fetchStats();
  getDataFromApi(currentPage.value, pageSize.value);
});

const showFilter = ref(false);
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};
</script>

<style scoped>
@import "@/assets/css/admin-global.css";

/* Chỉ giữ lại các style cho modal, filter-collapse, loading-overlay */

.modal-dialog {
  max-width: 600px !important;
}

.modal-content {
  border-radius: 15px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 0.8rem 1.2rem;
  border-bottom: 2px solid #ecae9e;
  position: relative;
}

.modal-title {
  font-weight: 600;
  padding: 0.8rem 1.2rem;
  color: #2c2c54;
  position: relative;
  font-size: 1.1rem;
}

.custom-close-btn {
  background: none;
  color: #2c2c54;
  border: none;
  font-size: 1.1rem;
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
  top: 50%;
  transform: translateY(-50%);
}

/* Modal body */
.modal-body {
  min-height: 320px;
  max-height: 70vh;
  overflow-y: auto;
}

/* Admin global styles */
@import "@/assets/css/admin-global.css";

/* Bộ lọc tìm kiếm - ẩn hiện */
.filter-collapse {
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
  max-height: 500px;
  opacity: 1;
}

.filter-collapsed {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

/* Loading overlay */
.card-body {
  position: relative;
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
  transition: opacity 0.3s ease;
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}

.loading-overlay.show {
  opacity: 1;
  pointer-events: all;
}

.loading-overlay .spinner-border {
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.5rem;
}
</style>
