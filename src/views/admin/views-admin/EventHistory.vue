<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Event History</strong>
      </h6>
    </div>
    
    <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-3">
          <label class="form-label">Tìm kiếm:</label>
          <input type="text" class="form-control" placeholder="Nhập mô tả, tên sự kiện" v-model="searchQuery" @input="handleSearchInput" />
        </div>
        <div class="col-md-3">
          <label class="form-label">ID Sự kiện</label>
          <input type="number" class="form-control" placeholder="Nhập ID sự kiện" v-model="eventIdFilter" @input="handleEventIdInput" min="1" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Loại hành động</label>
          <select class="form-select" v-model="selectedActionType" @change="handleFilterChange">
            <option value="">Tất cả loại</option>
            <option value="CREATED">Tạo mới</option>
            <option value="UPDATED">Cập nhật</option>
            <option value="DELETED">Xóa</option>
            <option value="PUBLISHED">Xuất bản</option>
            <option value="STARTED">Bắt đầu</option>
            <option value="ENDED">Kết thúc</option>
            <option value="CANCELLED">Hủy</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Từ ngày</label>
          <input type="date" class="form-control" v-model="startDate" @change="handleFilterChange" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Đến ngày</label>
          <input type="date" class="form-control" v-model="endDate" @change="handleFilterChange" />
        </div>
        <div class="col-md-6 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="clearFilters">
            <i class="bi bi-x-circle me-1"></i>Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Nút thêm mới -->
    <div class="d-flex justify-content-end mb-3 gap-2">
      <button class="btn btn-outline-info btn-sm py-2" @click="reloadPage" :disabled="loading">
        <i class="bi bi-arrow-repeat me-1"></i> Làm mới dữ liệu
      </button>
      <button class="btn btn-primary btn-sm py-2" @click="openAddModal"
        style="background-color: #33304e; border-color: #33304e;">
        <i class="bi bi-plus-circle me-1"></i> Thêm mới
      </button>
    </div>

    <!-- Danh sách Event History -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Lịch sử sự kiện</strong>
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
          <button class="btn btn-sm btn-outline-danger ms-2" @click="loadEventHistory">
            Thử lại
          </button>
        </div>

        <!-- Data table -->
        <div v-else>
          <table class="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Sự kiện</th>
                <th>Loại hành động</th>
                <th>Mô tả</th>
                <th>Người thực hiện</th>
                <th>Thời gian</th>
                <th>Giá trị cũ/mới</th>
                <th style="width: 120px;">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="eventHistories.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="(history, index) in eventHistories" :key="history.id">
                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                <td>{{ history.eventName }}</td>
                <td>
                  <span class="badge" :class="getActionTypeBadgeClass(history.actionType)">
                    {{ getActionTypeLabel(history.actionType) }}
                  </span>
                </td>
                <td>
                  <span class="text-wrap" style="max-width: 250px;">{{ history.description }}</span>
                </td>
                <td>
                  <div>
                    <strong>{{ history.performedByName || 'System' }}</strong>
                    <div class="text-muted small" v-if="history.performedByEmail">{{ history.performedByEmail }}</div>
                    <div class="text-muted small" v-else-if="history.performedBy">ID: {{ history.performedBy }}</div>
                  </div>
                </td>
                <td>{{ formatDate(history.createdAt) }}</td>
                <td>
                  <div class="small">
                    <div v-if="history.oldValues" class="text-muted mb-1">
                      <strong>Cũ:</strong> {{ formatValues(history.oldValues) }}
                    </div>
                    <div v-if="history.newValues" class="text-success">
                      <strong>Mới:</strong> {{ formatValues(history.newValues) }}
                    </div>
                    <span v-if="!history.oldValues && !history.newValues">N/A</span>
                  </div>
                </td>
                <td style="width: 120px;">
                  <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-info" @click="viewDetails(history)" title="Xem chi tiết">
                      <i class="bi bi-eye"></i>
                    </button>
                    <DeleteButton @click="handleDeleteEventHistory(history.id, index)" />
                  </div>
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

    <!-- Modal Thêm Event History -->
    <div class="modal fade" id="eventHistoryModal" tabindex="-1" aria-labelledby="eventHistoryModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eventHistoryModalLabel">Thêm lịch sử sự kiện mới</h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <img src="/src/assets/img/user-plus.png" alt="Đóng" />
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitEventHistory">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID Sự kiện *</label>
                    <input type="number" class="form-control" v-model="newEventHistory.eventId" required min="1" placeholder="Nhập ID sự kiện" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Loại hành động *</label>
                    <select class="form-select" v-model="newEventHistory.actionType" required>
                      <option value="">Chọn loại hành động</option>
                      <option value="CREATED">Tạo mới</option>
                      <option value="UPDATED">Cập nhật</option>
                      <option value="DELETED">Xóa</option>
                      <option value="PUBLISHED">Xuất bản</option>
                      <option value="STARTED">Bắt đầu</option>
                      <option value="ENDED">Kết thúc</option>
                      <option value="CANCELLED">Hủy</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Mô tả *</label>
                <textarea class="form-control" v-model="newEventHistory.description" rows="3" required placeholder="Nhập mô tả hành động"></textarea>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID Người thực hiện</label>
                    <input type="number" class="form-control" v-model="newEventHistory.performedBy" min="1" placeholder="Nhập ID người thực hiện" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Tên người thực hiện</label>
                    <input type="text" class="form-control" v-model="newEventHistory.performedByName" placeholder="Nhập tên người thực hiện" />
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Giá trị cũ (JSON)</label>
                    <textarea class="form-control" v-model="newEventHistory.oldValues" rows="3" placeholder='{"field": "old_value"}'></textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Giá trị mới (JSON)</label>
                    <textarea class="form-control" v-model="newEventHistory.newValues" rows="3" placeholder='{"field": "new_value"}'></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="handleSubmitEventHistory">Lưu</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Chi tiết History -->
    <div class="modal fade" id="eventHistoryDetailModal" tabindex="-1" aria-labelledby="eventHistoryDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eventHistoryDetailModalLabel">Chi tiết lịch sử sự kiện</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedHistory">
              <div class="row mb-3">
                <div class="col-md-6">
                  <strong>ID:</strong> {{ selectedHistory.id }}
                </div>
                <div class="col-md-6">
                  <strong>Sự kiện:</strong> {{ selectedHistory.eventName }}
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <strong>Loại hành động:</strong> 
                  <span class="badge ms-2" :class="getActionTypeBadgeClass(selectedHistory.actionType)">
                    {{ getActionTypeLabel(selectedHistory.actionType) }}
                  </span>
                </div>
                <div class="col-md-6">
                  <strong>Thời gian:</strong> {{ formatDate(selectedHistory.createdAt) }}
                </div>
              </div>
              <div class="mb-3">
                <strong>Mô tả:</strong>
                <p class="mt-2">{{ selectedHistory.description }}</p>
              </div>
              <div class="mb-3">
                <strong>Người thực hiện:</strong> {{ selectedHistory.performedByName || 'System' }}
                <div v-if="selectedHistory.performedByEmail" class="text-muted small">Email: {{ selectedHistory.performedByEmail }}</div>
                <span v-else-if="selectedHistory.performedBy" class="text-muted">(ID: {{ selectedHistory.performedBy }})</span>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <strong>Giá trị cũ:</strong>
                  <pre class="bg-light p-2 mt-2 small">{{ selectedHistory.oldValues || 'N/A' }}</pre>
                </div>
                <div class="col-md-6">
                  <strong>Giá trị mới:</strong>
                  <pre class="bg-light p-2 mt-2 small">{{ selectedHistory.newValues || 'N/A' }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Pagination from '@/components/common/Pagination.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';
import { getEventHistory, createEventHistory, deleteEventHistory } from '@/services/admin/eventHistory.js';
import { showToast } from '@/utils/swalHelper.js';

// Filter states
const searchQuery = ref('');
const eventIdFilter = ref('');
const selectedActionType = ref('');
const startDate = ref('');
const endDate = ref('');

// Debounce timer để tránh gọi API quá nhiều lần
let searchTimeout = null;

// Form data cho Event History
const newEventHistory = ref({
  eventId: '',
  actionType: '',
  description: '',
  performedBy: '',
  performedByName: '',
  oldValues: '',
  newValues: ''
});

// Selected history for detail view
const selectedHistory = ref(null);

// Pagination state
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

// API data for event histories
const eventHistories = ref([]);
const loading = ref(false);
const error = ref(null);

// Hàm load dữ liệu từ API với filter
const loadEventHistory = async (page = 0, size = pageSize.value) => {
  try {
    loading.value = true;
    error.value = null;
    
    // Tạo object filters từ các input
    const filters = {};
    
    if (searchQuery.value.trim()) {
      filters.search = searchQuery.value.trim();
    }
    
    if (eventIdFilter.value !== '') {
      filters.eventId = eventIdFilter.value;
    }
    
    if (selectedActionType.value !== '') {
      filters.actionType = selectedActionType.value;
    }
    
    if (startDate.value) {
      filters.createdStartTime = new Date(startDate.value).getTime();
    }
    
    if (endDate.value) {
      filters.createdEndTime = new Date(endDate.value + 'T23:59:59').getTime();
    }
    
    // Add pagination params
    filters.page = page;
    filters.size = size;
    filters.sortBy = 'createdAt';
    filters.sortDir = 'desc';
    
    console.log('Sending filters:', filters); // Debug log
    
    const response = await getEventHistory(filters);
    console.log('API Response:', response); // Debug log
    if (response.status === 200 && response.data) {
      eventHistories.value = response.data.content || [];
      console.log('Event Histories:', eventHistories.value); // Debug log
      // Cập nhật thông tin pagination từ backend
      currentPage.value = response.data.pageNumber;
      pageSize.value = response.data.pageSize;
      totalElements.value = response.data.totalElements;
      totalPages.value = response.data.totalPages;
      isLastPage.value = response.data.last;
    }
  } catch (err) {
    error.value = 'Không thể tải dữ liệu lịch sử sự kiện';
    console.error('Error loading event history:', err);
  } finally {
    loading.value = false;
  }
};

// Modal functions
const openAddModal = () => {
  newEventHistory.value = {
    eventId: '',
    actionType: '',
    description: '',
    performedBy: '',
    performedByName: '',
    oldValues: '',
    newValues: ''
  };
  const modalElement = document.getElementById('eventHistoryModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const viewDetails = (history) => {
  selectedHistory.value = history;
  const modalElement = document.getElementById('eventHistoryDetailModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const handleSubmitEventHistory = async () => {
  if (!newEventHistory.value.eventId || !newEventHistory.value.actionType || !newEventHistory.value.description) {
    showToast('error', 'Vui lòng điền đầy đủ các trường bắt buộc!');
    return;
  }
  
  try {
    const payload = {
      eventId: parseInt(newEventHistory.value.eventId),
      actionType: newEventHistory.value.actionType,
      description: newEventHistory.value.description,
      performedBy: newEventHistory.value.performedBy ? parseInt(newEventHistory.value.performedBy) : null,
      performedByName: newEventHistory.value.performedByName || null,
      oldValues: newEventHistory.value.oldValues || null,
      newValues: newEventHistory.value.newValues || null
    };
    
    await createEventHistory(payload);
    showToast('success', 'Thêm lịch sử sự kiện thành công!');
    
    await loadEventHistory(currentPage.value, pageSize.value);
    closeModal();
  } catch (error) {
    console.error('Error submitting event history:', error);
    showToast('error', 'Thêm lịch sử sự kiện thất bại!');
  }
};

const handleDeleteEventHistory = async (id, index) => {
  if (confirm('Bạn có chắc muốn xóa lịch sử này?')) {
    try {
      await deleteEventHistory(id);
      showToast('success', 'Xóa lịch sử sự kiện thành công!');
      await loadEventHistory(currentPage.value, pageSize.value);
    } catch (error) {
      console.error('Error deleting event history:', error);
      showToast('error', 'Xóa lịch sử sự kiện thất bại!');
    }
  }
};

const closeModal = () => {
  const modalElement = document.getElementById('eventHistoryModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

// Pagination functions
const handlePrev = () => {
  if (currentPage.value > 0) {
    loadEventHistory(currentPage.value - 1, pageSize.value);
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    loadEventHistory(currentPage.value + 1, pageSize.value);
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  loadEventHistory(0, newSize);
};

// Filter functions
const handleFilterChange = () => {
  currentPage.value = 0;
  loadEventHistory(0, pageSize.value);
};

const handleSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadEventHistory(0, pageSize.value);
  }, 500);
};

const handleEventIdInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadEventHistory(0, pageSize.value);
  }, 500);
};

const clearFilters = () => {
  searchQuery.value = '';
  eventIdFilter.value = '';
  selectedActionType.value = '';
  startDate.value = '';
  endDate.value = '';
  currentPage.value = 0;
  loadEventHistory(0, pageSize.value);
};

const reloadPage = () => {
  loadEventHistory(currentPage.value, pageSize.value);
};

// Utility functions
const getActionTypeLabel = (type) => {
  const labels = {
    'CREATED': 'Tạo mới',
    'UPDATED': 'Cập nhật',
    'DELETED': 'Xóa',
    'PUBLISHED': 'Xuất bản',
    'STARTED': 'Bắt đầu',
    'ENDED': 'Kết thúc',
    'CANCELLED': 'Hủy'
  };
  return labels[type] || type;
};

const getActionTypeBadgeClass = (type) => {
  const classes = {
    'CREATED': 'bg-success',
    'UPDATED': 'bg-info',
    'DELETED': 'bg-danger',
    'PUBLISHED': 'bg-primary',
    'STARTED': 'bg-warning',
    'ENDED': 'bg-secondary',
    'CANCELLED': 'bg-dark'
  };
  return classes[type] || 'bg-secondary';
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString('vi-VN');
};

const formatValues = (jsonString) => {
  if (!jsonString) return 'N/A';
  try {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return jsonString;
  }
};

// Reset modal state
const resetModal = () => {
  newEventHistory.value = {
    eventId: '',
    actionType: '',
    description: '',
    performedBy: '',
    performedByName: '',
    oldValues: '',
    newValues: ''
  };
};

let modalElement = null;

onMounted(() => {
  loadEventHistory();
  
  modalElement = document.getElementById('eventHistoryModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', resetModal);
  }
});

onUnmounted(() => {
  if (modalElement) {
    modalElement.removeEventListener('hidden.bs.modal', resetModal);
  }
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
  border-top: 1px solid #dee2e6;
}

.table td {
  height: auto;
  padding: 0.75rem;
}

/* Đảm bảo các button action không làm lệch table */
.table .action-buttons {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  align-items: center;
  min-height: 38px;
}

.modal-dialog {
  max-width: 800px !important;
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
  min-height: 400px;
  max-height: 70vh;
  overflow-y: auto;
}

.badge {
  font-size: 0.75em;
}

pre {
  font-size: 0.8em;
  max-height: 150px;
  overflow-y: auto;
}
</style>
