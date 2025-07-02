<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Event Participant</strong>
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
          <input type="text" class="form-control" placeholder="Nhập email, tên người dùng" v-model="searchQuery" @input="handleSearchInput" />
        </div>
        <div class="col-md-3">
          <label class="form-label">ID Sự kiện</label>
          <input type="number" class="form-control" placeholder="Nhập ID sự kiện" v-model="eventIdFilter" @input="handleEventIdInput" min="1" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Trạng thái hoàn thành</label>
          <select class="form-select" v-model="selectedCompletionStatus" @change="handleFilterChange">
            <option value="">Tất cả trạng thái</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="IN_PROGRESS">Đang thực hiện</option>
            <option value="JOINED">Đã tham gia</option>
            <option value="NOT_STARTED">Chưa bắt đầu</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Người thắng cuộc</label>
          <select class="form-select" v-model="selectedWinnerStatus" @change="handleFilterChange">
            <option value="">Tất cả</option>
            <option value="true">Là người thắng</option>
            <option value="false">Không thắng</option>
          </select>
        </div>
        <div class="col-md-12 d-flex justify-content-end">
          <button class="btn btn-outline-secondary" @click="clearFilters">
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

    <!-- Danh sách Event Participants -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách người tham gia sự kiện</strong>
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
          <button class="btn btn-sm btn-outline-danger ms-2" @click="loadEventParticipants">
            Thử lại
          </button>
        </div>

        <!-- Data table -->
        <div v-else>
          <table class="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Người dùng</th>
                <th>Sự kiện</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Người thắng</th>
                <th>Ghi chú</th>
                <th style="width: 120px;">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="eventParticipants.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="(participant, index) in eventParticipants" :key="participant.id">
                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                <td>
                  <div>
                    <strong>{{ participant.userName }}</strong>
                    <div class="text-muted small">{{ participant.userEmail }}</div>
                  </div>
                </td>
                <td>{{ participant.eventName }}</td>
                <td>{{ formatDate(participant.joinedAt) }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(participant.completionStatus)">
                    {{ getStatusLabel(participant.completionStatus) }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="participant.isWinner ? 'bg-success' : 'bg-secondary'">
                    {{ participant.isWinner ? 'Thắng cuộc' : 'Không thắng' }}
                  </span>
                </td>
                <td>
                  <span class="text-truncate" style="max-width: 200px;" :title="participant.notes">
                    {{ participant.notes || 'N/A' }}
                  </span>
                </td>
                <td style="width: 120px;">
                  <div class="action-buttons">
                    <EditButton @click="openEditModal(participant, index)" />
                    <DeleteButton @click="handleDeleteEventParticipant(participant.id, index)" />
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

    <!-- Modal Thêm/Sửa Event Participant -->
    <div class="modal fade" id="eventParticipantModal" tabindex="-1" aria-labelledby="eventParticipantModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eventParticipantModalLabel">{{ isEditMode ? 'Chỉnh sửa người tham gia' : 'Thêm người tham gia mới' }}</h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <img src="/src/assets/img/user-plus.png" alt="Đóng" />
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitEventParticipant">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID Sự kiện *</label>
                    <input type="number" class="form-control" v-model="newEventParticipant.eventId" required min="1" placeholder="Nhập ID sự kiện" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID Người dùng *</label>
                    <input type="number" class="form-control" v-model="newEventParticipant.userId" required min="1" placeholder="Nhập ID người dùng" />
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Email người dùng *</label>
                    <input type="email" class="form-control" v-model="newEventParticipant.userEmail" required placeholder="Nhập email người dùng" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Tên người dùng *</label>
                    <input type="text" class="form-control" v-model="newEventParticipant.userName" required placeholder="Nhập tên người dùng" />
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Trạng thái hoàn thành *</label>
                    <select class="form-select" v-model="newEventParticipant.completionStatus" required>
                      <option value="">Chọn trạng thái</option>
                      <option value="COMPLETED">Hoàn thành</option>
                      <option value="IN_PROGRESS">Đang thực hiện</option>
                      <option value="JOINED">Đã tham gia</option>
                      <option value="NOT_STARTED">Chưa bắt đầu</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Ngày tham gia</label>
                    <input type="datetime-local" class="form-control" v-model="newEventParticipant.joinedAt" />
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Ghi chú</label>
                <textarea class="form-control" v-model="newEventParticipant.notes" rows="3" placeholder="Nhập ghi chú về người tham gia"></textarea>
              </div>
              
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="newEventParticipant.isWinner" id="isWinner">
                  <label class="form-check-label" for="isWinner">
                    Là người thắng cuộc
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="handleSubmitEventParticipant">Lưu</button>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';
import { getEventParticipants, createEventParticipant, updateEventParticipant, deleteEventParticipant } from '@/services/admin/eventParticipant.js';
import { showToast } from '@/utils/swalHelper.js';

// Filter states
const searchQuery = ref('');
const eventIdFilter = ref('');
const selectedCompletionStatus = ref('');
const selectedWinnerStatus = ref('');

// Debounce timer để tránh gọi API quá nhiều lần
let searchTimeout = null;

// Form data cho Event Participant
const newEventParticipant = ref({
  id: '',
  eventId: '',
  userId: '',
  userEmail: '',
  userName: '',
  completionStatus: '',
  joinedAt: '',
  isWinner: false,
  notes: ''
});

// Track edit mode and index
const isEditMode = ref(false);
const editIndex = ref(null);

// Pagination state
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

// API data for event participants
const eventParticipants = ref([]);
const loading = ref(false);
const error = ref(null);

// Hàm load dữ liệu từ API với filter
const loadEventParticipants = async (page = 0, size = pageSize.value) => {
  try {
    loading.value = true;
    error.value = null;
    
    // Tạo object filters từ các input
    const filters = {};
    
    if (searchQuery.value.trim()) {
      // Search general - có thể dùng param search thay vì specific field
      filters.search = searchQuery.value.trim();
    }
    
    if (eventIdFilter.value !== '') {
      filters.eventId = eventIdFilter.value;
    }
    
    if (selectedCompletionStatus.value !== '') {
      filters.participationStatus = selectedCompletionStatus.value;
    }
    
    if (selectedWinnerStatus.value !== '') {
      filters.isWinner = selectedWinnerStatus.value === 'true';
    }
    
    // Add pagination params
    filters.page = page;
    filters.size = size;
    
    console.log('Sending filters:', filters); // Debug log
    
    const response = await getEventParticipants(filters);
    console.log('API Response:', response); // Debug log
    if (response.status === 200 && response.data) {
      eventParticipants.value = response.data.content || [];
      console.log('Event Participants:', eventParticipants.value); // Debug log
      // Cập nhật thông tin pagination từ backend
      currentPage.value = response.data.pageNumber;
      pageSize.value = response.data.pageSize;
      totalElements.value = response.data.totalElements;
      totalPages.value = response.data.totalPages;
      isLastPage.value = response.data.last;
    }
  } catch (err) {
    error.value = 'Không thể tải dữ liệu người tham gia sự kiện';
    console.error('Error loading event participants:', err);
  } finally {
    loading.value = false;
  }
};

// Modal functions
const openAddModal = () => {
  isEditMode.value = false;
  newEventParticipant.value = {
    id: '',
    eventId: '',
    userId: '',
    userEmail: '',
    userName: '',
    completionStatus: '',
    joinedAt: '',
    isWinner: false,
    notes: ''
  };
  const modalElement = document.getElementById('eventParticipantModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const openEditModal = (participant, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  newEventParticipant.value = {
    id: participant.id,
    eventId: participant.eventId || '',
    userId: participant.userId || '',
    userEmail: participant.userEmail || '',
    userName: participant.userName || '',
    completionStatus: participant.completionStatus || '',
    joinedAt: participant.joinedAt ? formatDateTimeLocal(participant.joinedAt) : '',
    isWinner: participant.isWinner || false,
    notes: participant.notes || ''
  };
  const modalElement = document.getElementById('eventParticipantModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const handleSubmitEventParticipant = async () => {
  if (!newEventParticipant.value.eventId || !newEventParticipant.value.userId || !newEventParticipant.value.userEmail || !newEventParticipant.value.userName || !newEventParticipant.value.completionStatus) {
    showToast('error', 'Vui lòng điền đầy đủ các trường bắt buộc!');
    return;
  }
  
  try {
    const payload = {
      eventId: parseInt(newEventParticipant.value.eventId),
      userId: parseInt(newEventParticipant.value.userId),
      userEmail: newEventParticipant.value.userEmail,
      userName: newEventParticipant.value.userName,
      completionStatus: newEventParticipant.value.completionStatus,
      joinedAt: newEventParticipant.value.joinedAt ? new Date(newEventParticipant.value.joinedAt).getTime() : Date.now(),
      isWinner: newEventParticipant.value.isWinner,
      notes: newEventParticipant.value.notes
    };
    
    if (isEditMode.value && newEventParticipant.value.id) {
      await updateEventParticipant(newEventParticipant.value.id, payload);
      showToast('success', 'Cập nhật người tham gia thành công!');
    } else {
      await createEventParticipant(payload);
      showToast('success', 'Thêm người tham gia thành công!');
    }
    
    await loadEventParticipants(currentPage.value, pageSize.value);
    closeModal();
  } catch (error) {
    console.error('Error submitting event participant:', error);
    showToast('error', isEditMode.value ? 'Cập nhật người tham gia thất bại!' : 'Thêm người tham gia thất bại!');
  }
};

const handleDeleteEventParticipant = async (id, index) => {
  if (confirm('Bạn có chắc muốn xóa người tham gia này?')) {
    try {
      await deleteEventParticipant(id);
      showToast('success', 'Xóa người tham gia thành công!');
      await loadEventParticipants(currentPage.value, pageSize.value);
    } catch (error) {
      console.error('Error deleting event participant:', error);
      showToast('error', 'Xóa người tham gia thất bại!');
    }
  }
};

const closeModal = () => {
  const modalElement = document.getElementById('eventParticipantModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

// Pagination functions
const handlePrev = () => {
  if (currentPage.value > 0) {
    loadEventParticipants(currentPage.value - 1, pageSize.value);
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    loadEventParticipants(currentPage.value + 1, pageSize.value);
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  loadEventParticipants(0, newSize);
};

// Filter functions
const handleFilterChange = () => {
  currentPage.value = 0;
  loadEventParticipants(0, pageSize.value);
};

const handleSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadEventParticipants(0, pageSize.value);
  }, 500);
};

const handleEventIdInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadEventParticipants(0, pageSize.value);
  }, 500);
};

const clearFilters = () => {
  searchQuery.value = '';
  eventIdFilter.value = '';
  selectedCompletionStatus.value = '';
  selectedWinnerStatus.value = '';
  currentPage.value = 0;
  loadEventParticipants(0, pageSize.value);
};

const reloadPage = () => {
  loadEventParticipants(currentPage.value, pageSize.value);
};

// Utility functions
const getStatusLabel = (status) => {
  const labels = {
    'COMPLETED': 'Hoàn thành',
    'IN_PROGRESS': 'Đang thực hiện',
    'JOINED': 'Đã tham gia',
    'NOT_STARTED': 'Chưa bắt đầu'
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status) => {
  const classes = {
    'COMPLETED': 'bg-success',
    'IN_PROGRESS': 'bg-warning',
    'JOINED': 'bg-info',
    'NOT_STARTED': 'bg-secondary'
  };
  return classes[status] || 'bg-secondary';
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString('vi-VN');
};

const formatDateTimeLocal = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toISOString().slice(0, 16);
};

// Reset modal state
const resetModal = () => {
  isEditMode.value = false;
  editIndex.value = null;
  newEventParticipant.value = {
    id: '',
    eventId: '',
    userId: '',
    userEmail: '',
    userName: '',
    completionStatus: '',
    joinedAt: '',
    isWinner: false,
    notes: ''
  };
};

let modalElement = null;

onMounted(() => {
  loadEventParticipants();
  
  modalElement = document.getElementById('eventParticipantModal');
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

.text-truncate {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
