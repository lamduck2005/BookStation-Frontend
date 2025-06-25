<template>
  <div class="container-fluid py-4">
    <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-4">
          <label class="form-label">Tìm kiếm:</label>
          <input type="text" class="form-control" placeholder="Nhập từ khoá tìm kiếm" v-model="searchQuery" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Không hoạt động</option>
          </select>
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button class="btn btn-outline-primary w-100 me-2" @click="searchWithFilter">
            <i class="bi bi-funnel"></i> Lọc
          </button>
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="clearFilters">
            <i class="bi bi-x-circle me-1"></i>Xoá bộ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Nút reload và thêm mới -->
    <div class="d-flex justify-content-end mb-3 gap-2">
      <button class="btn btn-outline-info btn-sm py-2" @click="reloadPage" :disabled="loading">
        <i class="bi bi-arrow-repeat me-1"></i> Làm mới dữ liệu
      </button>
      <button class="btn btn-primary btn-sm py-2" @click="openAddForm"
        style="background-color: #33304e; border-color: #33304e;">
        <i class="bi bi-plus-circle me-1"></i> Thêm mới
      </button>
    </div>

    <!-- Bảng -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách chương trình giảm giá (Flash Sale)</strong>
      </div>
      <div class="p-3">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ error }}
          <button class="btn btn-sm btn-outline-danger ms-2" @click="getDataFromApi">
            Thử lại
          </button>
        </div>

        <!-- Data table -->
        <div v-else>
          <table class="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên chương trình</th>
                <th>Thời gian bắt đầu</th>
                <th>Thời gian kết thúc</th>
                <th>Ngày tạo</th>
                <th>Ngày cập nhật</th>
                <th>Số lượng sản phẩm</th>
                <th>Trạng thái</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="flashSales.length === 0">
                <td colspan="9" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="(item, index) in flashSales" :key="item.id">
                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                <td>
                  <router-link :to="`/admin/flash-sale/${item.id}`">
                    {{ item.name }}
                  </router-link>
                </td>
                <td>{{ formatDateTime(item.startTime) }}</td>
                <td>{{ formatDateTime(item.endTime) }}</td>
                <td>{{ formatDateTime(item.createdAt) }}</td>
                <td>{{ formatDateTime(item.updatedAt) }}</td>
                <td>Chưa có dữ liệu</td>
                <td style="width: 200px;">
                  <ToggleStatus :id="item.id" v-model="item.status" :true-value="1" :false-value="0"
                    active-text="Hoạt động" inactive-text="Không hoạt động"
                    @change="handleStatusChange(item, item.status)" />
                </td>
                <td>
                  <EditButton @click="openEditForm(item)" />
                  <DeleteButton @click="handleDeleteFunction(item)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <Pagination :page-number="currentPage" :total-pages="totalPages" :is-last-page="isLastPage"
          :page-size="pageSize" :items-per-page-options="itemsPerPageOptions" :total-elements="totalElements"
          @prev="handlePrev" @next="handleNext" @update:pageSize="handlePageSizeChange" />
      </div>

    </div>

    <!-- Modal Thêm/Sửa  -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true"
      style="z-index: 10000;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalLabel">{{ isEditMode ? 'Chỉnh sửa' : 'Thêm mới' }}</h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <i class='bx  bx-x-circle'></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitForm">
              <div class="mb-3">
                <label class="form-label">Tên chương trình <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="formData.name" required
                  placeholder="Nhập tên flash sale" />
              </div>
              <div class="mb-3">
                <label class="form-label">Thời gian bắt đầu <span class="text-danger">*</span></label>
                <input type="datetime-local" class="form-control" v-model="formData.startTime" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Thời gian kết thúc <span class="text-danger">*</span></label>
                <input type="datetime-local" class="form-control" v-model="formData.endTime" required />
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
            <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="handleSubmitForm">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import EditButton from '@/components/common/EditButton.vue';
import Pagination from '@/components/common/Pagination.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { showToast } from '@/utils/swalHelper.js';
import ToggleStatus from '@/components/common/ToggleStatus.vue';
import { addFlashSale, getAllFlashSale, updateFlashSale } from '@/services/admin/flashSale';
import { datetimeLocalToTimestamp, timestampToDatetimeLocal } from '@/utils/utils.js';

const searchQuery = ref('');
const selectedStatus = ref('');

// Dữ liệu flash sale thực tế
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
  id: '',
  name: '',
  startTime: '',
  endTime: '',
  status: 1
});

// Định dạng ngày giờ
function formatDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('vi-VN', { hour12: false });
}

// bộ lọc
const searchWithFilter = () => {
  // TODO: Gọi lại API với searchQuery và selectedStatus
  showToast('info', 'Chức năng tìm kiếm!');
};
const clearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  getDataFromApi(0, pageSize.value);
};

//reload
const reloadPage = () => {
  getDataFromApi(currentPage.value, pageSize.value);
};

//trạng thái
const handleStatusChange = (item, newStatus) => {
  showToast('info', 'Chức năng thay đổi trạng thái!');
};

// thêm sửa
const openAddForm = async () => {
  isEditMode.value = false;
  resetFormData();
  const modalElement = document.getElementById('formModal');
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
    status: item.status
  };
  const modalElement = document.getElementById('formModal');
  if (modalElement) {
    const modal = Modal.getOrCreateInstance(modalElement);
    modal.show();
  }
};


const validateForm = () => {
  if (!formData.value.name || !formData.value.startTime || !formData.value.endTime) {
    showToast('error', 'Vui lòng điền đầy đủ thông tin!');
    return false;
  }

  // Kiểm tra thời gian kết thúc phải lớn hơn thời gian bắt đầu
  const startTime = datetimeLocalToTimestamp(formData.value.startTime);
  const endTime = datetimeLocalToTimestamp(formData.value.endTime);

  if (endTime <= startTime) {
    showToast('error', 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu!');
    return false;
  }

  return true;
}
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
      status: parseInt(formData.value.status)
    };

    if (!isEditMode.value) {
      const res = await addFlashSale(submitData);
      showToast('success', res.data.message || 'Thêm mới thành công!');
      closeModal();
      // Reload lại dữ liệu sau khi thêm thành công
      await getDataFromApi(currentPage.value, pageSize.value);
    } else {
      const res = await updateFlashSale(formData.value.id, submitData);
      showToast('success', res.data.message || 'Cập nhật thành công!');
      closeModal();
      // Reload lại dữ liệu sau khi thêm thành công
      await getDataFromApi(currentPage.value, pageSize.value);
      showToast('success', 'Cập nhật thành công!');
    }
  } catch (error) {
    showToast('error', error.response?.data?.message || 'Có lỗi xảy ra!');
    console.log(error);
  }
};

const handleDeleteFunction = async (item) => {
  showToast('warning', 'Chức năng xoá!');
};

const closeModal = () => {
  const modalElement = document.getElementById('formModal');
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
    name: '',
    startTime: '',
    endTime: '',
    status: 1
  };
};

// Format datetime for input datetime-local
function formatDateTimeForInput(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
}

//load dữ liệu
const getDataFromApi = async (page, size) => {
  loading.value = true;
  error.value = null;
  try {
    const res = await getAllFlashSale(page, size);
    const resData = res.data.data;
    console.log("🚀 ~ getDataFromApi ~ res:", res)

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
    error.value = 'Lỗi khi tải dữ liệu!';
    flashSales.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await getDataFromApi(currentPage.value, pageSize.value);
});

</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.modal-dialog {
  max-width: 600px !important;
}

.modal-content {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: none;
}

.modal-header {
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

.modal-body {
  min-height: 320px;
  max-height: 70vh;
  overflow-y: auto;
}
</style>