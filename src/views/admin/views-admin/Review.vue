<template>
  <div class="container-fluid py-4">
    <!-- ========== BỘ LỌC REVIEW ========== -->
    <div class="card mb-5 shadow-lg border-0 filter-card">
      <div class="card-header bg-light border-0 py-3">
        <h5 class="mb-0 text-secondary">
          <i class="bi bi-funnel me-2"></i>
          Bộ lọc tìm kiếm
        </h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-star-half me-1"></i>
              Rating
            </label>
            <select class="form-select" v-model="filter.rating">
              <option value="">Tất cả</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-book me-1"></i>
              Book ID
            </label>
            <input type="number" class="form-control" v-model="filter.bookId" placeholder="Nhập bookId" />
          </div>
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-person me-1"></i>
              User ID
            </label>
            <input type="number" class="form-control" v-model="filter.userId" placeholder="Nhập userId" />
          </div>
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-calendar me-1"></i>
              Từ ngày
            </label>
            <input type="datetime-local" class="form-control" v-model="filter.from" />
          </div>
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-calendar me-1"></i>
              Đến ngày
            </label>
            <input type="datetime-local" class="form-control" v-model="filter.to" />
          </div>
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-toggle-on me-1"></i>
              Trạng thái
            </label>
            <select class="form-select" v-model="filter.status">
              <option value="">Tất cả</option>
              <option v-for="(value, key) in REVIEW_STATUS" :key="key" :value="key">
                {{ value.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="row g-3 pt-3 d-flex justify-content-center">
          <div class="col-md-1">
            <button class="btn btn-outline-success w-100 me-2" @click="searchWithFilter">
              <i class="bi bi-funnel"></i> Lọc
            </button>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle me-1"></i> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================== BẢNG DANH SÁCH REVIEW ================== -->
    <div class="card shadow-lg border-0 mb-4 review-table-card">
      <!-- Header bảng: Tên + nút -->
      <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
        <div>
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-chat-square-text me-2"></i>
            Danh sách đánh giá
          </h5>
        </div>
        <div class="d-flex gap-2">
          <!-- Nút làm mới dữ liệu -->
          <button class="btn btn-outline-info btn-sm py-2" @click="reloadPage" :disabled="loading">
            <i class="bi bi-arrow-repeat me-1"></i> Làm mới
          </button>
          <!-- Nút thêm mới -->
          <button class="btn btn-primary btn-sm py-2" style="background-color: #33304e; border-color: #33304e;" @click="openAddForm">
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
                <th>Sách</th>
                <th>Người đánh giá</th>
                <th>Rating</th>
                <th>Bình luận</th>
                <th>Ngày đánh giá</th>
                <th style="width: 160px">Trạng thái</th>
                <th style="width: 120px">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="reviews.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="(item, index) in reviews" :key="item.id" class="align-middle" style="vertical-align: middle;">
                <td class="py-3">{{ currentPage * pageSize + index + 1 }}</td>
                <td class="py-3">{{ item.bookName }}</td>
                <td class="py-3">
                  {{ item.userName }}
                  <br />
                  <small class="text-muted">{{ item.userEmail }}</small>
                </td>
                <td class="py-3">{{ item.rating }}</td>
                <td class="py-3">{{ item.comment }}</td>
                <td class="py-3">{{ formatDateTime(item.reviewDate) }}</td>
                <td class="py-3">
                  <StatusLabel :status-text="reviewStatusLabel(item.reviewStatus)" :status-class="reviewStatusClass(item.reviewStatus)" />
                </td>
                <td class="py-3">
                  <EditButton @click="openEditForm(item)" />
                  <button class="btn btn-sm btn-outline-secondary ms-2" @click="handleStatusChange(item)">
                    <i :class="item.reviewStatus === 'APPROVED' ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
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
    <!-- ================== HẾT BẢNG REVIEW ================== -->

    <!-- Modal Thêm/Sửa Review -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true" style="z-index: 10000;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalLabel">{{ isEditMode ? 'Chỉnh sửa' : 'Thêm mới' }}</h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitForm">
              <div class="mb-3">
                <label class="form-label">Book ID <span class="text-danger">*</span></label>
                <input type="number" class="form-control" v-model="formData.bookId" required />
              </div>
              <div class="mb-3">
                <label class="form-label">User ID <span class="text-danger">*</span></label>
                <input type="number" class="form-control" v-model="formData.userId" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Rating <span class="text-danger">*</span></label>
                <select class="form-select" v-model="formData.rating" required>
                  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Bình luận <span class="text-danger">*</span></label>
                <textarea class="form-control" rows="3" v-model="formData.comment" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" v-model="formData.reviewStatus">
                  <option v-for="(value, key) in REVIEW_STATUS" :key="key" :value="key">{{ value.label }}</option>
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
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { showToast } from '@/utils/swalHelper.js';
import EditButton from '@/components/common/EditButton.vue';
import Pagination from '@/components/common/Pagination.vue';
import StatusLabel from '@/components/common/StatusLabel.vue';
import {
  getAllReview,
  addReview,
  updateReview,
  toggleStatusReview
} from '@/services/admin/review.js';
import { datetimeLocalToTimestamp } from '@/utils/utils.js';

// Enum Review Status
const REVIEW_STATUS = {
  PENDING: { label: 'Chờ duyệt', class: 'badge bg-secondary' },
  APPROVED: { label: 'Hiển thị', class: 'badge bg-success' },
  REJECTED: { label: 'Từ chối', class: 'badge bg-danger' },
  HIDDEN: { label: 'Ẩn', class: 'badge bg-warning text-dark' },
  EDITED: { label: 'Đã sửa', class: 'badge bg-info text-dark' }
};

const filter = ref({
  rating: '',
  bookId: '',
  userId: '',
  from: '',
  to: '',
  status: ''
});

const reviews = ref([]);
// Pagination state
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

const loading = ref(false);
const error = ref(null);

const isEditMode = ref(false);
const formData = ref({
  id: '',
  bookId: '',
  userId: '',
  rating: 5,
  comment: '',
  reviewStatus: 'PENDING'
});

// Helper to format datetime
function formatDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('vi-VN', { hour12: false });
}

function reviewStatusLabel(status) {
  return REVIEW_STATUS[status]?.label || status;
}
function reviewStatusClass(status) {
  return REVIEW_STATUS[status]?.class || 'badge bg-secondary';
}

// APIs
const getDataFromApi = async (page, size) => {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page,
      size
    };
    if (filter.value.rating) params.rating = filter.value.rating;
    if (filter.value.bookId) params.bookId = filter.value.bookId;
    if (filter.value.userId) params.userId = filter.value.userId;
    if (filter.value.from) params.from = datetimeLocalToTimestamp(filter.value.from);
    if (filter.value.to) params.to = datetimeLocalToTimestamp(filter.value.to);
    if (filter.value.status) params.status = filter.value.status;

    const res = await getAllReview(params);
    const resData = res.data.data;
    if (res && res.status === 200 && resData) {
      reviews.value = resData.content;
      currentPage.value = resData.pageNumber;
      pageSize.value = resData.pageSize;
      totalElements.value = resData.totalElements;
      totalPages.value = resData.totalPages;
      isLastPage.value = currentPage.value >= totalPages.value - 1;
    } else {
      reviews.value = [];
      totalElements.value = 0;
      totalPages.value = 1;
      isLastPage.value = true;
    }
  } catch (err) {
    error.value = 'Lỗi khi tải dữ liệu!';
    reviews.value = [];
  } finally {
    loading.value = false;
  }
};

// Filter actions
const searchWithFilter = () => {
  getDataFromApi(0, pageSize.value);
};
const clearFilters = () => {
  filter.value = {
    rating: '',
    bookId: '',
    userId: '',
    from: '',
    to: '',
    status: ''
  };
  getDataFromApi(0, pageSize.value);
};

// Reload
const reloadPage = () => {
  getDataFromApi(currentPage.value, pageSize.value);
};

// Toggle status
const handleStatusChange = async (item) => {
  try {
    await toggleStatusReview(item.id);
    showToast('success', 'Thay đổi trạng thái thành công!');
    // Cập nhật local nhanh
    item.reviewStatus = item.reviewStatus === 'APPROVED' ? 'HIDDEN' : 'APPROVED';
  } catch (error) {
    showToast('error', error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

// Modal actions
const openAddForm = () => {
  isEditMode.value = false;
  resetFormData();
  const modalElement = document.getElementById('formModal');
  if (modalElement) {
    const modal = Modal.getOrCreateInstance(modalElement);
    modal.show();
  }
};

const openEditForm = (item) => {
  isEditMode.value = true;
  formData.value = {
    id: item.id,
    bookId: item.bookId,
    userId: item.userId,
    rating: item.rating,
    comment: item.comment,
    reviewStatus: item.reviewStatus
  };
  const modalElement = document.getElementById('formModal');
  if (modalElement) {
    const modal = Modal.getOrCreateInstance(modalElement);
    modal.show();
  }
};

const validateForm = () => {
  if (!formData.value.bookId || !formData.value.userId || !formData.value.comment) {
    showToast('error', 'Vui lòng điền đầy đủ thông tin!');
    return false;
  }
  if (formData.value.rating < 1 || formData.value.rating > 5) {
    showToast('error', 'Rating phải từ 1 đến 5!');
    return false;
  }
  return true;
};

const handleSubmitForm = async () => {
  try {
    if (!validateForm()) return;

    const submitData = {
      bookId: parseInt(formData.value.bookId),
      userId: parseInt(formData.value.userId),
      rating: parseInt(formData.value.rating),
      comment: formData.value.comment,
      reviewStatus: formData.value.reviewStatus
    };

    if (!isEditMode.value) {
      const res = await addReview(submitData);
      showToast('success', res.data.message || 'Thêm mới thành công!');
    } else {
      const res = await updateReview(formData.value.id, submitData);
      showToast('success', res.data.message || 'Cập nhật thành công!');
    }
    closeModal();
    await getDataFromApi(currentPage.value, pageSize.value);
  } catch (error) {
    showToast('error', error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

const closeModal = () => {
  const modalElement = document.getElementById('formModal');
  if (modalElement) {
    const modal = Modal.getOrCreateInstance(modalElement);
    modal.hide();
  }
};

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
  getDataFromApi(0, newSize);
};

const resetFormData = () => {
  formData.value = {
    bookId: '',
    userId: '',
    rating: 5,
    comment: '',
    reviewStatus: 'PENDING'
  };
};

onMounted(() => {
  getDataFromApi(currentPage.value, pageSize.value);
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

.modal-body {
  min-height: 320px;
  max-height: 70vh;
  overflow-y: auto;
}

/* bo tròn */
.filter-card,
.review-table-card {
  border-radius: 0.8rem !important;
  overflow: hidden;
}
</style>