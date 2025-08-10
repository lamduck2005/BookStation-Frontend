<template>
  <div class="admin-page container-fluid py-4">
    <OverviewStatsComponent :stats="stats" />
     
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
              <i :class="showFilter ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
              {{ showFilter ? 'Thu gọn' : 'Mở rộng' }}
            </button>
          </div>
        </div>
        <div class="card-body filter-collapse" :class="{ 'filter-collapsed': !showFilter }">
        <div class="row g-4">
          <div class="col-md-3">
            <label class="form-label">
              <i class="bi bi-book me-1"></i>
              Sách
            </label>
            <Multiselect v-model="filterSelected.book" :options="dropdowns.books.options" :searchable="true"
              :internal-search="true" :close-on-select="true" :clear-on-select="false" label="bookName" track-by="id"
              placeholder="Tìm sách theo tên">
              <!-- Tùy chỉnh hiển thị option -->
              <template v-slot:option="{ option }">
                <div class="d-flex flex-column">
                  <strong>{{ option.bookName }}</strong>
                  <small v-if="option.bookCode" class="text-muted">
                    {{ option.bookCode }}
                  </small>
                  <small v-if="option.isbn" class="text-muted">
                    ISBN: {{ option.isbn }}
                  </small>
                </div>
              </template>
            </Multiselect>
          </div>

          <div class="col-md-3">
            <label class="form-label">
              <i class="bi bi-person me-1"></i>
              Người đánh giá
            </label>
            <Multiselect v-model="filterSelected.customer" :options="dropdowns.customers.options" :searchable="true"
              :internal-search="true" :close-on-select="true" :clear-on-select="false" label="fullName" track-by="id"
              placeholder="Tìm người dùng theo tên">
              <template #option="{ option }">
                <div class="d-flex flex-column">
                  <strong>{{ option.fullName || option.name }}</strong>
                  <small v-if="option.phone" class="text-muted">{{ option.phone }}</small>
                  <small v-if="option.email" class="text-muted">{{ option.email }}</small>
                </div>
              </template>
            </Multiselect>
          </div>

        
          <div class="col-md-3">
            <label class="form-label">
              <i class="bi bi-star-half me-1"></i>
              Đánh giá
            </label>
            <select class="form-select" v-model="filter.rating">
              <option value="">Tất cả</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} sao</option>
            </select>
          </div>

          <div class="col-md-3">
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

          <div class="col-md-3">
            <label class="form-label">
              <i class="bi bi-calendar me-1"></i>
              Từ ngày
            </label>
            <input type="datetime-local" class="form-control" v-model="filter.from" />
          </div>
          
          <div class="col-md-3">
            <label class="form-label">
              <i class="bi bi-calendar me-1"></i>
              Đến ngày
            </label>
            <input type="datetime-local" class="form-control" v-model="filter.to" />
          </div>

          <div class="col-md-3">
            <label class="form-label">
              <i class="bi bi-sort-down me-1"></i>
              Sắp xếp theo
            </label>
            <select class="form-select" v-model="filter.sortBy">
              <option value="reviewDate">Ngày đánh giá</option>
              <option value="rating">Số sao</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">
              <i class="bi bi-arrow-down-up me-1"></i>
              Thứ tự
            </label>
            <select class="form-select" v-model="filter.sortDirection">
              <option value="DESC">Giảm dần</option>
              <option value="ASC">Tăng dần</option>
            </select>
          </div>
        </div>
        <div class="row g-3 pt-3 m-1 d-flex justify-content-center">
          <div class="col-md-1">
            <button class="btn btn-success w-100 me-2" @click="searchWithFilter">
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

          <!-- table -->
      <div class="card shadow-lg border-0 mb-4 admin-table-card">
      <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
        <div>
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-chat-square-text me-2"></i>
            Danh sách đánh giá
          </h5>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-info btn-sm py-2" @click="reloadPage" :disabled="loading">
            <i class="bi bi-arrow-repeat me-1"></i> Làm mới
          </button>
          <button class="btn btn-primary btn-sm py-2" style="background-color: #33304e; border-color: #33304e;"
            @click="openAddForm">
            <i class="bi bi-plus-circle me-1"></i> Thêm mới
          </button>
        </div>
      </div>
      <div class="card-body p-0" :class="{ loading: loading }">
        <div class="loading-overlay" :class="{ show: loading }">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p>Đang tải dữ liệu...</p>
        </div>
        <div v-if="error" class="alert alert-danger m-4" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ error }}
          <button class="btn btn-sm btn-outline-danger ms-2" @click="getDataFromApi(currentPage, pageSize)">
            Thử lại
          </button>
        </div>
        <!-- Data table -->
        <div v-else>
          <table class="table align-middle table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 40px">#</th>
                <th style="width: 300px">Sách</th>
                <th style="width: 120px">Chức năng</th>
                <th style="width: 120px">Trạng thái</th>
                <th style="width: 180px">Người đánh giá</th>
                <th style="width: 100px">Đánh giá</th>
                <th style="width: 200px">Nội dung</th>
                <th style="width: 150px">Ngày đánh giá</th>
                <th style="width: 150px">Ngày sửa</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="reviews.length === 0">
                <td colspan="9" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="(item, index) in reviews" :key="item.id" class="align-middle" style="vertical-align: middle;">
                <td class="py-3">{{ currentPage * pageSize + index + 1 }}</td>
                <td class="py-3 fw-bold">{{ item.bookName }}</td>
                <td class="py-3">
                  <span class="tooltip-wrapper">
                    <EditButton @click="openEditForm(item)" />
                    <span class="tooltip-bubble">Chỉnh sửa</span>
                  </span>
                  <span class="tooltip-wrapper ms-2">
                    <button class="btn btn-sm btn-outline-secondary" @click="handleStatusChange(item)">
                      <i :class="item.reviewStatus === 'APPROVED' ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                    <span class="tooltip-bubble">{{ item.reviewStatus === 'APPROVED' ? 'Ẩn đánh giá' : 'Hiển thị đánh giá'}}</span>
                  </span>
                </td>
                <td class="py-3">
                  <StatusLabel :status-text="reviewStatusLabel(item.reviewStatus)"
                    :status-class="reviewStatusClass(item.reviewStatus)" />
                </td>
                <td class="py-3">
                  <span class="fw-bold">{{ item.userName }}</span>
                  <br />
                  <small class="text-muted">{{ item.userEmail }}</small>
                </td>
                <td class="py-3">{{ item.rating }} <i class="fas fa-star text-warning"></i></td>
                <td class="py-3">{{ item.comment }}</td>
                <td class="py-3">
                  <span class="fw-bold">{{ toTime(item.reviewDate) }}</span>
                  <br />
                  <small class="text-muted">{{ toDate(item.reviewDate) }}</small>
                </td>
                <td class="py-3">
                  <span class="fw-bold">{{ toTime(item.updatedAt) }}</span>
                  <br />
                  <small class="text-muted">{{ toDate(item.updatedAt) }}</small>
                </td>


              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div class="p-3">
          <Pagination :page-number="currentPage" :total-pages="totalPages" :is-last-page="isLastPage"
            :page-size="pageSize" :items-per-page-options="itemsPerPageOptions" :total-elements="totalElements"
            @prev="handlePrev" @next="handleNext" @update:pageSize="handlePageSizeChange" @goToPage="handleGoToPage" />
        </div>
      </div>
    </div>

    <!-- Modal Thêm/Sửa Review -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
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
                <label class="form-label">Sách <span class="text-danger">*</span></label>
                <Multiselect v-model="formSelected.book" :options="dropdowns.books.options" :searchable="true"
                  :internal-search="true" :close-on-select="true" :clear-on-select="false" label="bookName"
                  track-by="id" placeholder="Chọn sách" :disabled="isEditMode">
                  <template #option="{ option }">
                    <div class="d-flex flex-column">
                      <strong>{{ option.bookName }}</strong>
                      <small v-if="option.bookCode" class="text-muted">{{ option.bookCode }}</small>
                      <small v-if="option.isbn" class="text-muted">ISBN: {{ option.isbn }}</small>
                    </div>
                  </template>
                </Multiselect>
              </div>
              <div class="mb-3">
                <label class="form-label">Người đánh giá <span class="text-danger">*</span></label>
                <Multiselect v-model="formSelected.customer" :options="dropdowns.customers.options" :searchable="true"
                  :internal-search="true" :close-on-select="true" :clear-on-select="false" label="fullName"
                  track-by="id" placeholder="Chọn người đánh giá" :disabled="isEditMode">
                  <template #option="{ option }">
                    <div class="d-flex flex-column">
                      <strong>{{ option.fullName || option.name }}</strong>
                      <small v-if="option.phone" class="text-muted">{{ option.phone }}</small>
                      <small v-if="option.email" class="text-muted">{{ option.email }}</small>
                    </div>
                  </template>
                </Multiselect>
              </div>
              <div class="mb-3">
                <label class="form-label">Đánh giá <span class="text-danger">*</span></label>
                <select class="form-select" v-model="formData.rating" required>
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} sao</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Bình luận <span class="text-danger">*</span></label>
                <textarea class="form-control" rows="3" v-model="formData.comment" maxlength="500" required></textarea>
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
import { ref, onMounted, reactive, watch } from 'vue';
import { Modal } from 'bootstrap';
import { showToast, showQuickConfirm } from '@/utils/swalHelper.js';
import EditButton from '@/components/common/EditButton.vue';
import Pagination from '@/components/common/Pagination.vue';
import StatusLabel from '@/components/common/StatusLabel.vue';
import {
  getAllReview,
  addReview,
  updateReview,
  toggleStatusReview,
  getReviewStats
} from '@/services/admin/review.js';
import { getBooksDropdown, getCustomersDropdown } from '@/services/admin/select.js';
import { datetimeLocalToTimestamp } from '@/utils/utils.js';
import OverviewStatsComponent from '@/components/common/OverviewStatsComponent.vue';

// Enum Review Status
const REVIEW_STATUS = {
  // PENDING: { label: 'Chờ duyệt', class: 'badge bg-secondary' },
  APPROVED: { label: 'Hiển thị', class: 'badge bg-success' },
  // REJECTED: { label: 'Từ chối', class: 'badge bg-danger' },
  HIDDEN: { label: 'Ẩn', class: 'badge bg-warning text-dark' },
  EDITED: { label: 'Đã sửa', class: 'badge bg-info text-dark' }
};

// Xoá mẫu books cũ không dùng

const filter = ref({
  rating: '',
  bookId: '',
  userId: '',
  from: '',
  to: '',
  status: '',
  sortBy: 'reviewDate',
  sortDirection: 'DESC'
});

// Stats
const stats = ref([]);

// Filter visibility
const showFilter = ref(false);

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

// Dropdowns gom chung
const dropdowns = reactive({
  books: { options: [] },
  customers: { options: [] }
});

// Option đang chọn (object) và đồng bộ về filter qua 1 watcher chung
const filterSelected = reactive({
  book: null,
  customer: null
});

// Đồng bộ từng dropdown tách riêng để tránh phụ thuộc lẫn nhau
watch(() => filterSelected.book, (opt) => {
  filter.value.bookId = opt?.id || '';
});

watch(() => filterSelected.customer, (opt) => {
  filter.value.userId = opt?.id || '';
});

const isEditMode = ref(false);
const formData = ref({
  id: '',
  bookId: '',
  userId: '',
  rating: 5,
  comment: '',
  reviewStatus: 'APPROVED'
});

// Selected cho form (khác filter)
const formSelected = reactive({ book: null, customer: null });

// Đồng bộ selected form -> formData ids
watch(() => formSelected.book, (opt) => { formData.value.bookId = opt?.id || ''; });
watch(() => formSelected.customer, (opt) => { formData.value.userId = opt?.id || ''; });

// Helper to format datetime
function formatDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('vi-VN', { hour12: false });
}

function toDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function toTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('vi-VN', { hour12: false });
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
      size,
      sortBy: filter.value.sortBy || 'reviewDate',
      sortDirection: filter.value.sortDirection || 'DESC'
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
    handleGetStats();
  }
};

const handleGetStats = async () => {
  try {
    const response = await getReviewStats();
    const {total, approved, edited, hidden} = response.data.data;
    stats.value = [
      { label: 'Tổng số đánh giá', value: total },
      { label: 'Đã hiển thị', value: approved },
      { label: 'Đã chỉnh sửa', value: edited },
      { label: 'Đã ẩn', value: hidden }
    ];
  } catch (error) {
    console.error('Lỗi khi tải stats:', error);
  }
};

const handleGetDropdown = async () => {
  try {
    const response = await getBooksDropdown();

    if (response && response.data) {
      dropdowns.books.options = response.data;
    }
    // Gọi users song song 
    const customersRes = await getCustomersDropdown();
    if (customersRes && customersRes.data) {
      dropdowns.customers.options = customersRes.data;
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách sách:', error);
    dropdowns.books.options = [];
    dropdowns.customers.options = [];
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
    status: '',
    sortBy: 'reviewDate',
    sortDirection: 'DESC'
  };
  // Reset luôn selected của multiselect để UI xóa chọn
  filterSelected.book = null;
  filterSelected.customer = null;
  getDataFromApi(0, pageSize.value);
};

// Toggle filter visibility
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

// Reload
const reloadPage = () => {
  getDataFromApi(currentPage.value, pageSize.value);
};

// Toggle status
const handleStatusChange = async (item) => {
  try {
    const confirm = await showQuickConfirm(
      item.reviewStatus === 'APPROVED' ? 'Ẩn đánh giá?' : 'Hiển thị đánh giá?',
      item.reviewStatus === 'APPROVED' ? 'Bạn có chắc muốn ẩn đánh giá này?' : 'Bạn có chắc muốn hiển thị đánh giá này?',
      'question',
      'Xác nhận',
      'Hủy'
    );
    if (!confirm.isConfirmed) return;

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
  formSelected.book = null;
  formSelected.user = null;
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
  // Khóa lựa chọn và sync selected để hiển thị
  const bookOpts = (dropdowns.books && dropdowns.books.options) ? dropdowns.books.options : [];
  const customerOpts = (dropdowns.customers && dropdowns.customers.options) ? dropdowns.customers.options : [];
  formSelected.book = bookOpts.find(b => b.id === item.bookId) || null;
  formSelected.customer = customerOpts.find(u => u.id === item.userId) || null;
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

    const confirm = await showQuickConfirm(
      isEditMode.value ? 'Xác nhận cập nhật' : 'Xác nhận thêm mới',
      isEditMode.value ? 'Bạn có chắc muốn cập nhật đánh giá này?' : 'Bạn có chắc muốn thêm mới đánh giá?',
      'question',
      'Xác nhận',
      'Hủy'
    );
    if (!confirm.isConfirmed) return;

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
  // Clear selected khi đóng
  formSelected.book = null;
  formSelected.user = null;
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

const handleGoToPage = (page) => {
  if (page < 0) return;
  if (totalPages.value && page > totalPages.value - 1) return;
  getDataFromApi(page, pageSize.value);
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
    reviewStatus: 'APPROVED'
  };
};

onMounted(() => {
  getDataFromApi(currentPage.value, pageSize.value);
  handleGetDropdown(); // Tải danh sách sách cho dropdown
});
</script>

<style scoped>
@import '@/assets/css/admin-global.css';

/* Modal styling - không liên quan đến bảng */
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
</style>