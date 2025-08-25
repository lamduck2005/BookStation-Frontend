<template>
    <div class="container-fluid py-4">
        <!-- ========== BỘ LỌC DỮ LIỆU MẪU ========== -->
        <div class="card mb-5 shadow-lg border-0 filter-card">
            <div class="card-header bg-light border-0 py-3">
                <h5 class="mb-0 text-secondary">
                    <i class="bi bi-funnel me-2"></i>
                    Bộ lọc tìm kiếm
                </h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">
                            <i class="bi bi-search me-1"></i>
                            Tìm kiếm theo tên
                        </label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="filter.name"
                            placeholder="Nhập tên..."
                        />
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">
                            <i class="bi bi-toggle-on me-1"></i>
                            Trạng thái
                        </label>
                        <select
                            class="form-select"
                            v-model="filter.status"
                        >
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
                <div class="row g-3 p-3 d-flex justify-content-center">
                    <div class="col-md-1">
                        <button
                            class="btn btn-outline-success w-100 me-2"
                            @click="searchWithFilter"
                        >
                            <i class="bi bi-funnel"></i> Lọc
                        </button>
                        <button
                            class="btn btn-outline-success w-100 me-2"
                            @click="redirectToErrorPage(404, 'Lỗi test')"
                        >
                            <i class="bi bi-funnel"></i> Lỗi test
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

        <!-- ================== BẢNG DỮ LIỆU MẪU ================== -->
        <div class="card shadow-lg border-0 mb-4 flashsale-table-card">
            <!-- Header bảng: Tên + nút -->
            <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
                <div>
                    <h5 class="mb-0 text-secondary">
                        <i class="bi bi-lightning-charge me-2"></i>
                        Danh sách dữ liệu mẫu
                    </h5>
                </div>
                <div class="d-flex gap-2">
                    <!-- Nút làm mới dữ liệu -->
                    <button class="btn btn-outline-info btn-sm py-2" @click="reloadPage" :disabled="loading">
                        <i class="bi bi-arrow-repeat me-1"></i> Làm mới
                    </button>
                    <!-- Nút thêm mới -->
                    <button class="btn btn-primary btn-sm py-2" @click="openAddForm" style="background-color: #33304e; border-color: #33304e;">
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
                    <button class="btn btn-sm btn-outline-danger ms-2" @click="getDataFromApi">
                        Thử lại
                    </button>
                </div>
                <!-- Data table -->
                <div v-else>
                    <table class="table align-middle table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th style="width: 40px">#</th>
                                <th>Cột 1</th>
                                <th>Cột 2</th>
                                <th>Cột 3</th>
                                <th>Cột 4</th>
                                <th>Cột 5</th>
                                <th>Cột 6</th>
                                <th style="width: 200px">Trạng thái</th>
                                <th style="width: 120px">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="templateData.length === 0">
                                <td colspan="9" class="text-center py-4 text-muted">
                                    <i class="bi bi-inbox me-2"></i>
                                    Không có dữ liệu
                                </td>
                            </tr>
                            <tr v-for="(item, index) in templateData" :key="item.id" class="align-middle" style="vertical-align: middle;">
                                <td class="py-3">{{ (currentPage * pageSize) + index + 1 }}</td>
                                <td class="py-3">{{ item.col1 }}</td>
                                <td class="py-3">{{ item.col2 }}</td>
                                <td class="py-3">{{ item.col3 }}</td>
                                <td class="py-3">{{ item.col4 }}</td>
                                <td class="py-3">{{ item.col5 }}</td>
                                <td class="py-3">{{ item.col6 }}</td>
                                <td class="py-3">
                                    <ToggleStatus :id="item.id" v-model="item.status" :true-value="1" :false-value="0"
                                        active-text="Hoạt động" inactive-text="Không hoạt động" @change="handleStatusChange(item.id)" />
                                </td>
                                <td class="py-3">
                                    <EditButton @click="openEditForm(item)" />
                                    <DeleteButton @click="handleDeleteFunction(item)" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Pagination -->
                <div class="p-3">
                    <Pagination :page-number="currentPage" :total-pages="totalPages" :is-last-page="isLastPage"
                        :page-size="pageSize" :items-per-page-options="itemsPerPageOptions"
                        :total-elements="templateData.length" @prev="handlePrev" @next="handleNext"
                        @update:pageSize="handlePageSizeChange" />
                </div>
            </div>
        </div>

        <!-- Modal Thêm/Sửa  -->
        <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true" style="z-index: 10000;">
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
                                <label class="form-label">Cột dữ liệu</label>
                                <input type="text" class="form-control" required placeholder="Nhập dữ liệu" />
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

// ================== FILTER STATE ==================
const filter = ref({
  name: '',
  from: '',
  to: '',
  status: ''
});

// ================== DỮ LIỆU MẪU ==================
const templateData = ref([
  { id: 1, col1: 'Dữ liệu 1', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
  { id: 2, col1: 'Dữ liệu 2', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 0 },
  { id: 3, col1: 'Dữ liệu 3', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
  { id: 4, col1: 'Dữ liệu 4', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
  { id: 5, col1: 'Dữ liệu 5', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 0 },
  { id: 6, col1: 'Dữ liệu 6', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
  { id: 7, col1: 'Dữ liệu 7', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
  { id: 8, col1: 'Dữ liệu 8', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 0 },
  { id: 9, col1: 'Dữ liệu 9', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
  { id: 10, col1: 'Dữ liệu 10', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
]);

// ================== PHÂN TRANG ==================
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(5);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

// ================== LOADING/ERROR ==================
const loading = ref(false);
const error = ref(null);

const isEditMode = ref(false);

// ================== HÀM XỬ LÝ FILTER ==================
const searchWithFilter = () => {
  // TODO: Lọc dữ liệu theo filter (demo chỉ show toast)
  showToast('info', 'Chức năng lọc dữ liệu!');
  // Gọi getDataFromApi(0, pageSize.value) nếu có API thực tế
};
const clearFilters = () => {
  filter.value = {
    name: '',
    from: '',
    to: '',
    status: ''
  };
  showToast('info', 'Đã xoá bộ lọc!');
  // Gọi getDataFromApi(0, pageSize.value) nếu có API thực tế
};

// ================== HÀM LÀM MỚI DỮ LIỆU ==================
const reloadPage = () => {
  showToast('info', 'Chức năng làm mới dữ liệu!');
  // Gọi getDataFromApi(currentPage.value, pageSize.value) nếu có API thực tế
};

// ================== HÀM XỬ LÝ TRẠNG THÁI ==================
const handleStatusChange = (id) => {
  showToast('info', `Chức năng thay đổi trạng thái cho id: ${id}`);
};

// ================== HÀM THÊM/SỬA/XOÁ ==================
const openAddForm = async () => {
  isEditMode.value = false;
  // TODO: reset form nếu có
  const modalElement = document.getElementById('formModal');
  if (modalElement) {
    const modal = Modal.getOrCreateInstance(modalElement);
    modal.show();
  }
};

const openEditForm = async (item) => {
  isEditMode.value = true;
  // TODO: set dữ liệu vào form nếu có
  const modalElement = document.getElementById('formModal');
  if (modalElement) {
    const modal = Modal.getOrCreateInstance(modalElement);
    modal.show();
  }
};

const handleSubmitForm = async () => {
  showToast('success', isEditMode.value ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
  // TODO: thêm/sửa dữ liệu thực tế
};

const handleDeleteFunction = async (item) => {
  showToast('warning', `Chức năng xoá cho id: ${item.id}`);
};

const closeModal = () => {
  const modalElement = document.getElementById('formModal');
  if (modalElement) {
    const modal = Modal.getOrCreateInstance(modalElement);
    modal.hide();
  }
};

// ================== PHÂN TRANG ==================
const handlePrev = () => {
  if (currentPage.value > 0) {
    // Gọi getDataFromApi(currentPage.value - 1, pageSize.value) nếu có API thực tế
    showToast('info', 'Trang trước!');
  }
};
const handleNext = () => {
  if (!isLastPage.value) {
    // Gọi getDataFromApi(currentPage.value + 1, pageSize.value) nếu có API thực tế
    showToast('info', 'Trang sau!');
  }
};
const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  // Gọi getDataFromApi(0, newSize) nếu có API thực tế
  showToast('info', 'Đổi số dòng/trang!');
};

// ================== HÀM LẤY DỮ LIỆU (DEMO) ==================
const getDataFromApi = async (page, size) => {
  // TODO: gọi API thực tế nếu có
  showToast('info', 'Gọi API lấy dữ liệu!');
};

onMounted(() => {
  // Gọi getDataFromApi(currentPage.value, pageSize.value) nếu có API thực tế
});
</script>

<style scoped>
/* ======= Table & Card style giống FlashSale.vue ======= */
.filter-card,
.flashsale-table-card {
  border-radius: 0.8rem !important;
  overflow: hidden;
}
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