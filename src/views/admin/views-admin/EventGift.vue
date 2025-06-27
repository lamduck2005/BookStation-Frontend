 <template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Event Gift</strong>
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
          <input type="text" class="form-control" placeholder="Nhập tên quà tặng, sự kiện" v-model="searchQuery" @input="handleSearchInput" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus" @change="handleFilterChange">
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Loại quà tặng</label>
          <select class="form-select" v-model="selectedGiftType" @change="handleFilterChange">
            <option value="">Tất cả loại</option>
            <option value="VOUCHER">Voucher</option>
            <option value="PHYSICAL_ITEM">Vật phẩm</option>
            <option value="POINT">Điểm thưởng</option>
          </select>
        </div>
        <div class="col-md-3 d-flex align-items-end">
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

    <!-- Danh sách Event Gift -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách Event Gift</strong>
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
          <button class="btn btn-sm btn-outline-danger ms-2" @click="loadEventGifts">
            Thử lại
          </button>
        </div>

        <!-- Data table -->
        <div v-else>
          <table class="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Hình ảnh</th>
                <th>Tên quà tặng</th>
                <th>Sự kiện</th>
                <th>Loại</th>
                <th>Giá trị</th>
                <th>Số lượng</th>
                <th>Còn lại</th>
                <th>Trạng thái</th>
                <th style="width: 120px;">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="eventGifts.length === 0">
                <td colspan="10" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="(gift, index) in eventGifts" :key="gift.id">
                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                <td>
                  <img :src="gift.imageUrl || '/src/assets/img/logo.png'" 
                       :alt="gift.giftName" 
                       class="gift-image" 
                       style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" />
                </td>
                <td>
                  <div>
                    <strong>{{ gift.giftName }}</strong>
                    <div class="text-muted small">{{ gift.description }}</div>
                  </div>
                </td>
                <td>{{ gift.eventName || 'N/A' }}</td>
                <td>
                  <span class="badge" :class="getGiftTypeBadgeClass(gift.giftType)">
                    {{ getGiftTypeLabel(gift.giftType) }}
                  </span>
                </td>
                <td>{{ formatCurrency(gift.giftValue) }}</td>
                <td>{{ gift.quantity || 0 }}</td>
                <td>{{ gift.remainingQuantity || 0 }}</td>
                <td>
                  <StatusLabel :is-active="gift.isActive" @toggle="handleStatusToggle(gift, index)" />
                </td>
                <td style="width: 120px;">
                  <div class="action-buttons">
                    <EditButton @click="openEditModal(gift, index)" />
                    <DeleteButton @click="handleDeleteEventGift(gift.id, index)" />
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

    <!-- Modal Thêm/Sửa Event Gift -->
    <div class="modal fade" id="eventGiftModal" tabindex="-1" aria-labelledby="eventGiftModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eventGiftModalLabel">{{ isEditMode ? 'Chỉnh sửa Event Gift' : 'Thêm mới Event Gift' }}</h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <img src="/src/assets/img/user-plus.png" alt="Đóng" />
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitEventGift">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Tên quà tặng *</label>
                    <input type="text" class="form-control" v-model="newEventGift.giftName" required placeholder="Nhập tên quà tặng" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID Sự kiện *</label>
                    <input type="number" class="form-control" v-model="newEventGift.eventId" required placeholder="Nhập ID sự kiện" />
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea class="form-control" v-model="newEventGift.description" rows="3" placeholder="Nhập mô tả quà tặng"></textarea>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Loại quà tặng *</label>
                    <select class="form-select" v-model="newEventGift.giftType" required>
                      <option value="">Chọn loại quà tặng</option>
                      <option value="VOUCHER">Voucher</option>
                      <option value="PHYSICAL_ITEM">Vật phẩm</option>
                      <option value="POINT">Điểm thưởng</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Giá trị (VND) *</label>
                    <input type="number" class="form-control" v-model="newEventGift.giftValue" required min="0" placeholder="Nhập giá trị" />
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Số lượng *</label>
                    <input type="number" class="form-control" v-model="newEventGift.quantity" required min="1" placeholder="Nhập số lượng" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">URL hình ảnh</label>
                    <input type="url" class="form-control" v-model="newEventGift.imageUrl" placeholder="Nhập URL hình ảnh" />
                  </div>
                </div>
              </div>
              
              <!-- Conditional fields based on gift type -->
              <div v-if="newEventGift.giftType === 'POINT'" class="mb-3">
                <label class="form-label">Giá trị điểm *</label>
                <input type="number" class="form-control" v-model="newEventGift.pointValue" min="1" placeholder="Nhập số điểm" />
              </div>
              
              <div v-if="newEventGift.giftType === 'VOUCHER'" class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID Voucher</label>
                    <input type="number" class="form-control" v-model="newEventGift.voucherId" placeholder="Nhập ID voucher" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Mã Voucher</label>
                    <input type="text" class="form-control" v-model="newEventGift.voucherCode" placeholder="Nhập mã voucher" />
                  </div>
                </div>
              </div>
              
              <div v-if="newEventGift.giftType === 'PHYSICAL_ITEM'" class="mb-3">
                <label class="form-label">ID Sách</label>
                <input type="number" class="form-control" v-model="newEventGift.bookId" placeholder="Nhập ID sách (nếu có)" />
              </div>
              
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="newEventGift.isActive" id="isActive">
                  <label class="form-check-label" for="isActive">
                    Hoạt động
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="handleSubmitEventGift">Lưu</button>
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
import StatusLabel from '@/components/common/StatusLabel.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';
import { getEventGifts, createEventGift, updateEventGift, deleteEventGift } from '@/services/admin/eventGift.js';
import { showToast } from '@/utils/swalHelper.js';

// Filter states
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedGiftType = ref('');

// Debounce timer để tránh gọi API quá nhiều lần
let searchTimeout = null;

// Form data cho Event Gift
const newEventGift = ref({
  id: '',
  eventId: '',
  giftName: '',
  description: '',
  giftType: '',
  giftValue: 0,
  quantity: 1,
  imageUrl: '',
  pointValue: null,
  voucherId: null,
  voucherCode: '',
  bookId: null,
  isActive: true
});

// Track edit mode and index
const isEditMode = ref(false);
const editIndex = ref(null);

// Pagination state
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

// API data for event gifts
const eventGifts = ref([]);
const loading = ref(false);
const error = ref(null);

// Hàm load dữ liệu từ API với filter
const loadEventGifts = async (page = 0, size = pageSize.value) => {
  try {
    loading.value = true;
    error.value = null;
    
    // Tạo object filters từ các input
    const filters = {};
    
    if (searchQuery.value.trim()) {
      filters.search = searchQuery.value.trim();
    }
    
    if (selectedStatus.value !== '') {
      filters.isActive = selectedStatus.value === 'true';
    }
    
    if (selectedGiftType.value !== '') {
      filters.giftType = selectedGiftType.value;
    }
    
    // Add pagination params
    filters.page = page;
    filters.size = size;
    
    const response = await getEventGifts(filters);
    if (response.status === 200 && response.data) {
      eventGifts.value = response.data.content || [];
      // Cập nhật thông tin pagination từ backend
      currentPage.value = response.data.pageNumber;
      pageSize.value = response.data.pageSize;
      totalElements.value = response.data.totalElements;
      totalPages.value = response.data.totalPages;
      isLastPage.value = response.data.last;
    }
  } catch (err) {
    error.value = 'Không thể tải dữ liệu event gifts';
    console.error('Error loading event gifts:', err);
  } finally {
    loading.value = false;
  }
};

// Modal functions
const openAddModal = () => {
  isEditMode.value = false;
  newEventGift.value = {
    id: '',
    eventId: '',
    giftName: '',
    description: '',
    giftType: '',
    giftValue: 0,
    quantity: 1,
    imageUrl: '',
    pointValue: null,
    voucherId: null,
    voucherCode: '',
    bookId: null,
    isActive: true
  };
  const modalElement = document.getElementById('eventGiftModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const openEditModal = (gift, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  newEventGift.value = {
    id: gift.id,
    eventId: gift.eventId || '',
    giftName: gift.giftName || '',
    description: gift.description || '',
    giftType: gift.giftType || '',
    giftValue: gift.giftValue || 0,
    quantity: gift.quantity || 1,
    imageUrl: gift.imageUrl || '',
    pointValue: gift.pointValue,
    voucherId: gift.voucherId,
    voucherCode: gift.voucherCode || '',
    bookId: gift.bookId,
    isActive: gift.isActive
  };
  const modalElement = document.getElementById('eventGiftModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const handleSubmitEventGift = async () => {
  if (!newEventGift.value.giftName || !newEventGift.value.eventId || !newEventGift.value.giftType) {
    showToast('error', 'Vui lòng điền đầy đủ các trường bắt buộc!');
    return;
  }
  
  try {
    const payload = {
      eventId: newEventGift.value.eventId,
      giftName: newEventGift.value.giftName,
      description: newEventGift.value.description,
      giftType: newEventGift.value.giftType,
      giftValue: parseFloat(newEventGift.value.giftValue),
      quantity: parseInt(newEventGift.value.quantity),
      imageUrl: newEventGift.value.imageUrl,
      pointValue: newEventGift.value.pointValue ? parseInt(newEventGift.value.pointValue) : null,
      voucherId: newEventGift.value.voucherId ? parseInt(newEventGift.value.voucherId) : null,
      voucherCode: newEventGift.value.voucherCode || null,
      bookId: newEventGift.value.bookId ? parseInt(newEventGift.value.bookId) : null,
      isActive: newEventGift.value.isActive
    };
    
    if (isEditMode.value && newEventGift.value.id) {
      await updateEventGift(newEventGift.value.id, payload);
      showToast('success', 'Cập nhật event gift thành công!');
    } else {
      await createEventGift(payload);
      showToast('success', 'Thêm event gift thành công!');
    }
    
    await loadEventGifts(currentPage.value, pageSize.value);
    closeModal();
  } catch (error) {
    console.error('Error submitting event gift:', error);
    showToast('error', isEditMode.value ? 'Cập nhật event gift thất bại!' : 'Thêm event gift thất bại!');
  }
};

const handleDeleteEventGift = async (id, index) => {
  if (confirm('Bạn có chắc muốn xóa event gift này?')) {
    try {
      await deleteEventGift(id);
      showToast('success', 'Xóa event gift thành công!');
      await loadEventGifts(currentPage.value, pageSize.value);
    } catch (error) {
      console.error('Error deleting event gift:', error);
      showToast('error', 'Xóa event gift thất bại!');
    }
  }
};

const handleStatusToggle = async (gift, index) => {
  try {
    const updatedGift = { ...gift, isActive: !gift.isActive };
    await updateEventGift(gift.id, updatedGift);
    eventGifts.value[index].isActive = !eventGifts.value[index].isActive;
    showToast('success', 'Cập nhật trạng thái thành công!');
  } catch (error) {
    console.error('Error updating status:', error);
    showToast('error', 'Cập nhật trạng thái thất bại!');
  }
};

const closeModal = () => {
  const modalElement = document.getElementById('eventGiftModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

// Pagination functions
const handlePrev = () => {
  if (currentPage.value > 0) {
    loadEventGifts(currentPage.value - 1, pageSize.value);
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    loadEventGifts(currentPage.value + 1, pageSize.value);
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  loadEventGifts(0, newSize);
};

// Filter functions
const handleFilterChange = () => {
  currentPage.value = 0;
  loadEventGifts(0, pageSize.value);
};

const handleSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadEventGifts(0, pageSize.value);
  }, 500);
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  selectedGiftType.value = '';
  currentPage.value = 0;
  loadEventGifts(0, pageSize.value);
};

const reloadPage = () => {
  loadEventGifts(currentPage.value, pageSize.value);
};

// Utility functions
const getGiftTypeLabel = (type) => {
  const labels = {
    'VOUCHER': 'Voucher',
    'PHYSICAL_ITEM': 'Vật phẩm',
    'POINT': 'Điểm thưởng'
  };
  return labels[type] || type;
};

const getGiftTypeBadgeClass = (type) => {
  const classes = {
    'VOUCHER': 'bg-primary',
    'PHYSICAL_ITEM': 'bg-success',
    'POINT': 'bg-warning'
  };
  return classes[type] || 'bg-secondary';
};

const formatCurrency = (value) => {
  if (!value) return '0 VND';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

// Reset modal state
const resetModal = () => {
  isEditMode.value = false;
  editIndex.value = null;
  newEventGift.value = {
    id: '',
    eventId: '',
    giftName: '',
    description: '',
    giftType: '',
    giftValue: 0,
    quantity: 1,
    imageUrl: '',
    pointValue: null,
    voucherId: null,
    voucherCode: '',
    bookId: null,
    isActive: true
  };
};

let modalElement = null;

onMounted(() => {
  loadEventGifts();
  
  modalElement = document.getElementById('eventGiftModal');
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

.gift-image {
  border: 1px solid #dee2e6;
}

.badge {
  font-size: 0.75em;
}
</style>