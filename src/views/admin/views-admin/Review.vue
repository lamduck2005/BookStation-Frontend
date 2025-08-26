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
          
          <!-- Nút Export Excel -->
          <ExcelExportButton 
            data-type="reviews"
            button-text="Xuất Excel"
          />
          
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
                <th style="width: 150px">Chức năng</th>
                <th style="width: 120px">Trạng thái</th>
                <th style="width: 180px">Người đánh giá</th>
                <th style="width: 100px">Đánh giá</th>
                <th style="width: 120px">Đánh giá tích cực</th>
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
                    <button
                      class="btn btn-sm btn-outline-secondary action-btn"
                      @click="viewReview(item)"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <span class="tooltip-bubble">Xem chi tiết</span>
                  </span>
                  <span class="tooltip-wrapper ms-2">
                    <EditButton @click="openEditForm(item)" />
                    <span class="tooltip-bubble">Chỉnh sửa</span>
                  </span>
                  <span class="tooltip-wrapper ms-2">
                    <button class="btn btn-sm btn-outline-secondary" @click="handleStatusChange(item)">
                      <i :class="item.reviewStatus === 'APPROVED' ? 'bi bi-ban' : 'bi bi-check-circle'"></i>
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
                <td class="py-3 text-center">
                  <span v-if="item.isPositive === true" class="text-success">Tích cực</span>
                  <span v-else-if="item.isPositive === false" class="text-danger">Không tích cực</span>
                  <span v-else class="text-muted">Không có dữ liệu</span>
                </td>
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
      <div class="modal-dialog" style="max-width: 600px">
        <div class="modal-content">
          <div class="modal-header form-modal-header">
            <h5 class="modal-title" id="formModalLabel">
              <i class="bi bi-plus-circle me-2" v-if="!isEditMode"></i>
              <i class="bi bi-pencil-square me-2" v-else></i>
              {{ isEditMode ? 'Chỉnh sửa đánh giá' : 'Thêm mới đánh giá' }}
            </h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <div class="modal-body form-modal-body">
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
                <textarea class="form-control" rows="3" v-model="formData.comment" placeholder="Nhập bình luận (3-500 ký tự)" maxlength="500" required></textarea>
                <div class="form-text">
                  {{ formData.comment ? formData.comment.length : 0 }}/500 ký tự
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" v-model="formData.reviewStatus">
                  <option v-for="(value, key) in REVIEW_STATUS" :key="key" :value="key">{{ value.label }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Đánh giá tích cực</label>
                <select class="form-select" v-model="formData.isPositive">
                  <option :value="null">Không có dữ liệu</option>
                  <option :value="true">Tích cực</option>
                  <option :value="false">Không tích cực</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn form-btn-secondary" @click="closeModal">Đóng</button>
            <button type="button" class="btn form-btn-primary" @click="handleSubmitForm">
              {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal chi tiết Review -->
    <div
      v-if="showDetailModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
    >
      <div class="modal-dialog" style="max-width: 600px">
        <div class="modal-content">
          <div class="modal-header form-modal-header">
            <h5 class="modal-title">
              <i class="bi bi-info-circle me-2"></i>
              Chi tiết đánh giá
            </h5>
            <button
              type="button"
              class="custom-close-btn"
              @click="closeDetailModal"
            >
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <div class="modal-body form-modal-body">
            <table class="detail-info-table">
              <tbody>
                <tr>
                  <td class="detail-label">ID</td>
                  <td class="detail-value">{{ detailReview.id }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Sách</td>
                  <td class="detail-value">{{ detailReview.bookName || "Chưa có dữ liệu" }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Người đánh giá</td>
                  <td class="detail-value">{{ detailReview.userName || "Chưa có dữ liệu" }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Email</td>
                  <td class="detail-value">{{ detailReview.userEmail || "Chưa có dữ liệu" }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Đánh giá</td>
                  <td class="detail-value">
                    {{ detailReview.rating }} <i class="fas fa-star text-warning"></i>
                  </td>
                </tr>
                <tr>
                  <td class="detail-label">Nội dung</td>
                  <td class="detail-value">{{ detailReview.comment || "Chưa có dữ liệu" }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Đánh giá tích cực</td>
                  <td class="detail-value">
                    <span v-if="detailReview.isPositive === true" class="text-success">Tích cực</span>
                    <span v-else-if="detailReview.isPositive === false" class="text-danger">Không tích cực</span>
                    <span v-else class="text-muted">Không có dữ liệu</span>
                  </td>
                </tr>
                <tr>
                  <td class="detail-label">Trạng thái</td>
                  <td class="detail-value">
                    <StatusLabel :status-text="reviewStatusLabel(detailReview.reviewStatus)"
                      :status-class="reviewStatusClass(detailReview.reviewStatus)" />
                  </td>
                </tr>
                <tr>
                  <td class="detail-label">Ngày đánh giá</td>
                  <td class="detail-value">
                    {{ toTime(detailReview.reviewDate) }} - {{ toDate(detailReview.reviewDate) }}
                  </td>
                </tr>
                <tr>
                  <td class="detail-label">Ngày cập nhật</td>
                  <td class="detail-value">
                    {{ toTime(detailReview.updatedAt) }} - {{ toDate(detailReview.updatedAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn form-btn-secondary"
              @click="closeDetailModal"
            >
              Đóng
            </button>
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
import { datetimeLocalToTimestamp, toDate, toTime, formatDateTime } from '@/utils/utils.js';
import { validate } from '@/utils/validation.js';
import OverviewStatsComponent from '@/components/common/OverviewStatsComponent.vue';
import ExcelExportButton from '@/components/common/ExcelExportButton.vue';

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
  reviewStatus: 'APPROVED',
  isPositive: null
});

// Modal chi tiết review
const showDetailModal = ref(false);
const detailReview = ref({
  id: '',
  bookId: '',
  bookName: '',
  userId: '',
  userName: '',
  userEmail: '',
  rating: 0,
  comment: '',
  isPositive: null,
  reviewDate: '',
  reviewStatus: '',
  updatedAt: ''
});

// Selected cho form (khác filter)
const formSelected = reactive({ book: null, customer: null });


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

// Hàm xem chi tiết review
const viewReview = (review) => {
  detailReview.value = { ...review };
  showDetailModal.value = true;
};

// Hàm đóng modal chi tiết
const closeDetailModal = () => {
  showDetailModal.value = false;
  detailReview.value = {
    id: '',
    bookId: '',
    bookName: '',
    userId: '',
    userName: '',
    userEmail: '',
    rating: 0,
    comment: '',
    isPositive: null,
    reviewDate: '',
    reviewStatus: '',
    updatedAt: ''
  };
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
    reviewStatus: item.reviewStatus,
    isPositive: typeof item.isPositive === 'boolean' ? item.isPositive : null
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
  const validations = [
    validate.required(formData.value.bookId, 'Sách'),
    validate.required(formData.value.userId, 'Người đánh giá'),
    validate.comment(formData.value.comment),
    validate.rating(formData.value.rating)
  ];

  // Check if any validation failed
  for (const validation of validations) {
    if (validation !== null) {
      showToast('error', validation);
      return false;
    }
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

    let isPositiveValue = formData.value.isPositive;
    if (isPositiveValue === 'true' || isPositiveValue === true) isPositiveValue = true;
    else if (isPositiveValue === 'false' || isPositiveValue === false) isPositiveValue = false;
    else isPositiveValue = null;
    const submitData = {
      bookId: parseInt(formData.value.bookId),
      userId: parseInt(formData.value.userId),
      rating: parseInt(formData.value.rating),
      comment: formData.value.comment,
      reviewStatus: formData.value.reviewStatus,
      isPositive: isPositiveValue
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
  // Clear toàn bộ form và selections khi đóng
  resetFormData();
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
    reviewStatus: 'APPROVED',
    isPositive: null
  };
  formSelected.book = null;
  formSelected.customer = null;
};



onMounted(() => {
  getDataFromApi(currentPage.value, pageSize.value);
  handleGetDropdown(); // Tải danh sách sách cho dropdown
});
</script>

<style scoped>
@import '@/assets/css/admin-global.css';
@import '@/assets/css/form-global.css';
@import '@/assets/css/form-detail-global.css';
</style>