<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Event Gift Claim</strong>
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
          <input type="text" class="form-control" placeholder="Nhập tên quà tặng, người dùng" v-model="searchQuery" @input="handleSearchInput" />
        </div>
        <div class="col-md-3">
          <label class="form-label">ID Sự kiện</label>
          <input type="number" class="form-control" placeholder="Nhập ID sự kiện" v-model="eventIdFilter" @input="handleEventIdInput" min="1" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Trạng thái claim</label>
          <select class="form-select" v-model="selectedClaimStatus" @change="handleFilterChange">
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Từ chối</option>
            <option value="COMPLETED">Hoàn thành</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Phương thức nhận</label>
          <select class="form-select" v-model="selectedDeliveryMethod" @change="handleFilterChange">
            <option value="">Tất cả phương thức</option>
            <option value="STORE_PICKUP">Nhận tại cửa hàng</option>
            <option value="ONLINE_SHIPPING">Giao hàng</option>
            <option value="DIGITAL">Số hóa</option>
            <option value="AUTO_DELIVERY">Tự động giao</option>
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

    <!-- Danh sách Event Gift Claims -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách yêu cầu nhận quà</strong>
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
          <button class="btn btn-sm btn-outline-danger ms-2" @click="loadEventGiftClaims">
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
                <th>Quà tặng</th>
                <th>Giá trị</th>
                <th>Ngày claim</th>
                <th>Trạng thái</th>
                <th>Phương thức</th>
                <th>Mã nhận</th>
                <th style="width: 120px;">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="eventGiftClaims.length === 0">
                <td colspan="10" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="(claim, index) in eventGiftClaims" :key="claim.id">
                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                <td>
                  <div>
                    <strong>{{ claim.participantName }}</strong>
                    <div class="text-muted small">{{ claim.participantEmail }}</div>
                  </div>
                </td>
                <td>{{ claim.eventName }}</td>
                <td>
                  <div>
                    <strong>{{ claim.giftName }}</strong>
                    <div class="text-muted small">{{ getGiftTypeLabel(claim.giftType) }}</div>
                  </div>
                </td>
                <td>{{ formatCurrency(claim.giftValue) }}</td>
                <td>{{ formatDate(claim.claimedAt) }}</td>
                <td>
                  <span class="badge" :class="getClaimStatusBadgeClass(claim.claimStatus)">
                    {{ getClaimStatusLabel(claim.claimStatus) }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="getDeliveryMethodBadgeClass(claim.deliveryMethod)">
                    {{ getDeliveryMethodLabel(claim.deliveryMethod) }}
                  </span>
                </td>
                <td>
                  <span class="small">{{ claim.storePickupCode || 'N/A' }}</span>
                </td>
                <td style="width: 120px;">
                  <div class="action-buttons">
                    <EditButton @click="openEditModal(claim, index)" />
                    <DeleteButton @click="handleDeleteEventGiftClaim(claim.id, index)" />
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

    <!-- Modal Thêm/Sửa Event Gift Claim -->
    <div class="modal fade" id="eventGiftClaimModal" tabindex="-1" aria-labelledby="eventGiftClaimModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eventGiftClaimModalLabel">{{ isEditMode ? 'Chỉnh sửa yêu cầu nhận quà' : 'Thêm yêu cầu nhận quà mới' }}</h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <img src="/src/assets/img/user-plus.png" alt="Đóng" />
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitEventGiftClaim">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID Event Participant *</label>
                    <input type="number" class="form-control" v-model="newEventGiftClaim.eventParticipantId" required min="1" placeholder="Nhập ID người tham gia" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID Event Gift *</label>
                    <input type="number" class="form-control" v-model="newEventGiftClaim.eventGiftId" required min="1" placeholder="Nhập ID quà tặng" />
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Trạng thái claim *</label>
                    <select class="form-select" v-model="newEventGiftClaim.claimStatus" required>
                      <option value="">Chọn trạng thái</option>
                      <option value="PENDING">Chờ duyệt</option>
                      <option value="APPROVED">Đã duyệt</option>
                      <option value="REJECTED">Từ chối</option>
                      <option value="COMPLETED">Hoàn thành</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Phương thức nhận *</label>
                    <select class="form-select" v-model="newEventGiftClaim.deliveryMethod" required>
                      <option value="">Chọn phương thức</option>
                      <option value="STORE_PICKUP">Nhận tại cửa hàng</option>
                      <option value="ONLINE_SHIPPING">Giao hàng</option>
                      <option value="DIGITAL">Số hóa</option>
                      <option value="AUTO_DELIVERY">Tự động giao</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="row" v-if="newEventGiftClaim.deliveryMethod === 'STORE_PICKUP'">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Mã nhận hàng</label>
                    <input type="text" class="form-control" v-model="newEventGiftClaim.storePickupCode" placeholder="Nhập mã nhận hàng" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID Cửa hàng</label>
                    <input type="number" class="form-control" v-model="newEventGiftClaim.pickupStoreId" min="1" placeholder="Nhập ID cửa hàng" />
                  </div>
                </div>
              </div>
              
              <div class="row" v-if="newEventGiftClaim.deliveryMethod === 'ONLINE_SHIPPING'">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID Đơn vận chuyển</label>
                    <input type="text" class="form-control" v-model="newEventGiftClaim.deliveryOrderId" placeholder="Nhập ID đơn vận chuyển" />
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Ngày claim</label>
                    <input type="datetime-local" class="form-control" v-model="newEventGiftClaim.claimedAt" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Ngày hoàn thành</label>
                    <input type="datetime-local" class="form-control" v-model="newEventGiftClaim.completedAt" />
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Ghi chú</label>
                <textarea class="form-control" v-model="newEventGiftClaim.notes" rows="3" placeholder="Nhập ghi chú về yêu cầu nhận quà"></textarea>
              </div>
              
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="newEventGiftClaim.autoDelivered" id="autoDelivered">
                  <label class="form-check-label" for="autoDelivered">
                    Tự động giao
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="handleSubmitEventGiftClaim">Lưu</button>
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
import { getEventGiftClaims, createEventGiftClaim, updateEventGiftClaim, deleteEventGiftClaim } from '@/services/admin/eventGiftClaim.js';
import { showToast } from '@/utils/swalHelper.js';

// Filter states
const searchQuery = ref('');
const eventIdFilter = ref('');
const selectedClaimStatus = ref('');
const selectedDeliveryMethod = ref('');

// Debounce timer để tránh gọi API quá nhiều lần
let searchTimeout = null;

// Form data cho Event Gift Claim
const newEventGiftClaim = ref({
  id: '',
  eventParticipantId: '',
  eventGiftId: '',
  claimStatus: '',
  deliveryMethod: '',
  deliveryOrderId: '',
  storePickupCode: '',
  pickupStoreId: '',
  staffConfirmedBy: '',
  autoDelivered: false,
  claimedAt: '',
  completedAt: '',
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

// API data for event gift claims
const eventGiftClaims = ref([]);
const loading = ref(false);
const error = ref(null);

// Hàm load dữ liệu từ API với filter
const loadEventGiftClaims = async (page = 0, size = pageSize.value) => {
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
    
    if (selectedClaimStatus.value !== '') {
      filters.claimStatus = selectedClaimStatus.value;
    }
    
    if (selectedDeliveryMethod.value !== '') {
      filters.deliveryMethod = selectedDeliveryMethod.value;
    }
    
    // Add pagination params
    filters.pageNumber = page;
    filters.pageSize = size;
    filters.sortBy = 'claimedAt';
    filters.sortDir = 'desc';
    
    const response = await getEventGiftClaims(filters);
    console.log('API Response:', response);
    console.log('API Data:', response.data);
    
    if ((response.code === 200 || response.status === 200) && response.data) {
      eventGiftClaims.value = response.data.content || [];
      console.log('Event Gift Claims loaded:', eventGiftClaims.value);
      
      // Cập nhật thông tin pagination từ backend
      currentPage.value = response.data.pageNumber;
      pageSize.value = response.data.pageSize;
      totalElements.value = response.data.totalElements;
      totalPages.value = response.data.totalPages;
      isLastPage.value = response.data.isLast;
    }
  } catch (err) {
    error.value = 'Không thể tải dữ liệu yêu cầu nhận quà';
    console.error('Error loading event gift claims:', err);
  } finally {
    loading.value = false;
  }
};

// Modal functions
const openAddModal = () => {
  isEditMode.value = false;
  newEventGiftClaim.value = {
    id: '',
    eventParticipantId: '',
    eventGiftId: '',
    claimStatus: '',
    deliveryMethod: '',
    deliveryOrderId: '',
    storePickupCode: '',
    pickupStoreId: '',
    staffConfirmedBy: '',
    autoDelivered: false,
    claimedAt: '',
    completedAt: '',
    notes: ''
  };
  const modalElement = document.getElementById('eventGiftClaimModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const openEditModal = (claim, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  newEventGiftClaim.value = {
    id: claim.id,
    eventParticipantId: claim.eventParticipantId || '',
    eventGiftId: claim.eventGiftId || '',
    claimStatus: claim.claimStatus || '',
    deliveryMethod: claim.deliveryMethod || '',
    deliveryOrderId: claim.deliveryOrderId || '',
    storePickupCode: claim.storePickupCode || '',
    pickupStoreId: claim.pickupStoreId || '',
    staffConfirmedBy: claim.staffConfirmedBy || '',
    autoDelivered: claim.autoDelivered || false,
    claimedAt: claim.claimedAt ? formatDateTimeLocal(claim.claimedAt) : '',
    completedAt: claim.completedAt ? formatDateTimeLocal(claim.completedAt) : '',
    notes: claim.notes || ''
  };
  const modalElement = document.getElementById('eventGiftClaimModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const handleSubmitEventGiftClaim = async () => {
  if (!newEventGiftClaim.value.eventParticipantId || !newEventGiftClaim.value.eventGiftId || !newEventGiftClaim.value.claimStatus || !newEventGiftClaim.value.deliveryMethod) {
    showToast('error', 'Vui lòng điền đầy đủ các trường bắt buộc!');
    return;
  }
  
  try {
    const payload = {
      eventParticipantId: parseInt(newEventGiftClaim.value.eventParticipantId),
      eventGiftId: parseInt(newEventGiftClaim.value.eventGiftId),
      claimStatus: newEventGiftClaim.value.claimStatus,
      deliveryMethod: newEventGiftClaim.value.deliveryMethod,
      deliveryOrderId: newEventGiftClaim.value.deliveryOrderId || null,
      storePickupCode: newEventGiftClaim.value.storePickupCode || null,
      pickupStoreId: newEventGiftClaim.value.pickupStoreId ? parseInt(newEventGiftClaim.value.pickupStoreId) : null,
      staffConfirmedBy: newEventGiftClaim.value.staffConfirmedBy || null,
      autoDelivered: newEventGiftClaim.value.autoDelivered,
      claimedAt: newEventGiftClaim.value.claimedAt ? new Date(newEventGiftClaim.value.claimedAt).getTime() : Date.now(),
      completedAt: newEventGiftClaim.value.completedAt ? new Date(newEventGiftClaim.value.completedAt).getTime() : null,
      notes: newEventGiftClaim.value.notes
    };
    
    if (isEditMode.value && newEventGiftClaim.value.id) {
      await updateEventGiftClaim(newEventGiftClaim.value.id, payload);
      showToast('success', 'Cập nhật yêu cầu nhận quà thành công!');
    } else {
      await createEventGiftClaim(payload);
      showToast('success', 'Thêm yêu cầu nhận quà thành công!');
    }
    
    await loadEventGiftClaims(currentPage.value, pageSize.value);
    closeModal();
  } catch (error) {
    console.error('Error submitting event gift claim:', error);
    showToast('error', isEditMode.value ? 'Cập nhật yêu cầu nhận quà thất bại!' : 'Thêm yêu cầu nhận quà thất bại!');
  }
};

const handleDeleteEventGiftClaim = async (id, index) => {
  if (confirm('Bạn có chắc muốn xóa yêu cầu nhận quà này?')) {
    try {
      await deleteEventGiftClaim(id);
      showToast('success', 'Xóa yêu cầu nhận quà thành công!');
      await loadEventGiftClaims(currentPage.value, pageSize.value);
    } catch (error) {
      console.error('Error deleting event gift claim:', error);
      showToast('error', 'Xóa yêu cầu nhận quà thất bại!');
    }
  }
};

const closeModal = () => {
  const modalElement = document.getElementById('eventGiftClaimModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

// Pagination functions
const handlePrev = () => {
  if (currentPage.value > 0) {
    loadEventGiftClaims(currentPage.value - 1, pageSize.value);
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    loadEventGiftClaims(currentPage.value + 1, pageSize.value);
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  loadEventGiftClaims(0, newSize);
};

// Filter functions
const handleFilterChange = () => {
  currentPage.value = 0;
  loadEventGiftClaims(0, pageSize.value);
};

const handleSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadEventGiftClaims(0, pageSize.value);
  }, 500);
};

const handleEventIdInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadEventGiftClaims(0, pageSize.value);
  }, 500);
};

const clearFilters = () => {
  searchQuery.value = '';
  eventIdFilter.value = '';
  selectedClaimStatus.value = '';
  selectedDeliveryMethod.value = '';
  currentPage.value = 0;
  loadEventGiftClaims(0, pageSize.value);
};

const reloadPage = () => {
  loadEventGiftClaims(currentPage.value, pageSize.value);
};

// Utility functions
const getClaimStatusLabel = (status) => {
  const labels = {
    'PENDING': 'Chờ duyệt',
    'APPROVED': 'Đã duyệt',
    'REJECTED': 'Từ chối',
    'COMPLETED': 'Hoàn thành'
  };
  return labels[status] || status;
};

const getClaimStatusBadgeClass = (status) => {
  const classes = {
    'PENDING': 'bg-warning',
    'APPROVED': 'bg-info',
    'REJECTED': 'bg-danger',
    'COMPLETED': 'bg-success'
  };
  return classes[status] || 'bg-secondary';
};

const getDeliveryMethodLabel = (method) => {
  const labels = {
    'STORE_PICKUP': 'Nhận tại cửa hàng',
    'ONLINE_SHIPPING': 'Giao hàng',
    'DIGITAL': 'Số hóa',
    'AUTO_DELIVERY': 'Tự động giao'
  };
  return labels[method] || method;
};

const getDeliveryMethodBadgeClass = (method) => {
  const classes = {
    'STORE_PICKUP': 'bg-primary',
    'ONLINE_SHIPPING': 'bg-success',
    'DIGITAL': 'bg-info',
    'AUTO_DELIVERY': 'bg-warning'
  };
  return classes[method] || 'bg-secondary';
};

const getGiftTypeLabel = (type) => {
  const labels = {
    'VOUCHER': 'Voucher',
    'PHYSICAL_ITEM': 'Vật phẩm',
    'POINT': 'Điểm thưởng'
  };
  return labels[type] || type;
};

const formatCurrency = (value) => {
  if (!value) return '0 VND';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
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
  newEventGiftClaim.value = {
    id: '',
    eventParticipantId: '',
    eventGiftId: '',
    claimStatus: '',
    deliveryMethod: '',
    deliveryOrderId: '',
    storePickupCode: '',
    pickupStoreId: '',
    staffConfirmedBy: '',
    autoDelivered: false,
    claimedAt: '',
    completedAt: '',
    notes: ''
  };
};

let modalElement = null;

onMounted(() => {
  loadEventGiftClaims();
  
  modalElement = document.getElementById('eventGiftClaimModal');
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
</style>
