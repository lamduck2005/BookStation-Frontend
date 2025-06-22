<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Point</strong>
      </h6>
    </div> <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-3">
          <label class="form-label">Tìm kiếm:</label>
          <input type="text" class="form-control" placeholder="Nhập mã đơn hàng, email" v-model="searchQuery" @input="handleSearchInput" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus" @change="handleFilterChange">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Không hoạt động</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Điểm sử dụng</label>
          <input type="number" class="form-control" placeholder="Nhập điểm sử dụng" v-model="pointSpentFilter" @input="handlePointSpentInput" min="0" />
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="clearFilters">
            <i class="bi bi-x-circle me-1"></i>Xóa bộ lọc
          </button>
        </div>
      </div>    </div>    <!-- Nút thêm mới -->
    <div class="d-flex justify-content-end mb-3 gap-2">
      <button class="btn btn-outline-info btn-sm py-2" @click="reloadPage" :disabled="loading">
        <i class="bi bi-arrow-repeat me-1"></i> Làm mới dữ liệu
      </button>
      <button class="btn btn-primary btn-sm py-2" @click="openAddModal"
        style="background-color: #33304e; border-color: #33304e;">
        <i class="bi bi-plus-circle me-1"></i> Thêm mới
      </button>
    </div>

    <!-- Danh sách Rank -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Lịch sử Point</strong>
      </div>      <div class="p-3">
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
          <button class="btn btn-sm btn-outline-danger ms-2" @click="loadPointHistory">
            Thử lại
          </button>
        </div>

        <!-- Data table -->
        <div v-else>
          <table class="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>email</th>
                <th>mã đơn hàng</th>
                <th>số điểm nhận</th>
                <th>chi tiêu tối thiểu</th>
                <th>điểm sử dụng</th>
                <th>mô tả</th>
                <th style="width: 100px;">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="points.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>              <tr v-for="(point, index) in points" :key="point.id">
                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                <td>{{ point.email || 'N/A' }}</td>
                <td>{{ point.orderCode || 'N/A' }}</td>
                <td>{{ point.pointEarned || 0 }}</td>
                <td>{{ point.minSpent ? Number(point.minSpent).toLocaleString() + ' VND' : 'N/A' }}</td>
                <td>{{ point.pointSpent || 0 }}</td>
                <td>{{ point.description || 'N/A' }}</td>
                <td style="width: 100px;" class="d-flex gap-1">
                  <EditButton @click="openEditModal(point, index)" />
                  <DeleteButton @click="handleDeletePoint(index)" />
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
  </div> <!-- Add/Edit Point Modal -->
  <div class="modal fade" id="addRankModal" tabindex="-1" aria-labelledby="addRankModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #ecae9e;">
          <h5 class="modal-title" id="addRankModalLabel">
            <i class="bi me-2 bi-plus-circle"></i>
            {{ isEditMode ? 'Sửa Point' : 'Thêm Point' }}
          </h5><button type="button" class="custom-close-btn" data-bs-dismiss="modal" aria-label="Close">
            <img src="https://cdn-icons-png.flaticon.com/128/694/694604.png" alt="Close" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmitPoint">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Email <span class="text-danger">*</span></label>
                <input type="email" class="form-control" v-model="newPoint.email" required />
              </div>
              <div class="col-12">
                <label class="form-label">Mã đơn hàng <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="newPoint.orderId" required placeholder="Nhập mã đơn hàng" />
              </div>
              <div class="col-12">
                <label class="form-label">Số điểm nhận</label>
                <input type="number" class="form-control" v-model="newPoint.pointReceived" min="0" />
              </div>
              <div class="col-12">
                <label class="form-label">Chi tiêu tối thiểu (VND)</label>
                <input type="number" class="form-control" v-model="newPoint.minSpend" min="0" />
              </div>
              <div class="col-12">
                <label class="form-label">Điểm sử dụng</label>
                <input type="number" class="form-control" v-model="newPoint.pointUsed" min="0" />
              </div>
              <div class="col-12">
                <label class="form-label">Mô tả</label>
                <input type="text" class="form-control" v-model="newPoint.description" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Hủy
          </button> <button type="button" class="btn btn-primary" @click="handleSubmitPoint"
            style="background-color: #33304e; border-color: #33304e;">
            {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
          </button>
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
import { getPointHistory } from '@/services/admin/point.js';

const searchQuery = ref('');
const selectedStatus = ref('');
const pointSpentFilter = ref('');

// Debounce timer để tránh gọi API quá nhiều lần
let searchTimeout = null;

// New/Edit rank form data
const newRank = ref({
  id: '',
  name: '',
  email: '',
  status: '1',
  minSpend: 0,
  pointMultiplier: 1
});

// Popup form data cho Point
const newPoint = ref({
  id: '',
  email: '',
  orderId: '',
  pointReceived: 0,
  minSpend: 0,
  pointUsed: 0,
  description: ''
});

// Track edit mode and index
const isEditMode = ref(false);
const editIndex = ref(null);

// Pagination state
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(5);
const itemsPerPageOptions = ref([5, 10, 25, 50]);

// Computed property for last page check
const isLastPage = ref(false);

// API data for points
const points = ref([]);
const loading = ref(false);
const error = ref(null);

// Hàm load dữ liệu từ API với filter
const loadPointHistory = async (page = 0, size = pageSize.value) => {
  try {
    loading.value = true;
    error.value = null;
    
    // Tạo object filters từ các input
    const filters = {};
    
    // Xử lý search query - có thể là orderCode hoặc email
    if (searchQuery.value.trim()) {
      // Kiểm tra xem có phải email không
      if (searchQuery.value.includes('@')) {
        filters.email = searchQuery.value.trim();
      } else {
        filters.orderCode = searchQuery.value.trim();
      }
    }
    
    if (selectedStatus.value !== '') {
      filters.status = selectedStatus.value;
    }
    
    if (pointSpentFilter.value !== '') {
      filters.pointSpent = pointSpentFilter.value;
    }
    
    const response = await getPointHistory(page, size, filters);
    
    if (response.status === 200 && response.data) {
      points.value = response.data.content || [];
      
      // Cập nhật thông tin pagination
      currentPage.value = response.data.page;
      pageSize.value = response.data.size;
      totalElements.value = response.data.totalElements;
      totalPages.value = response.data.totalPages;
      isLastPage.value = response.data.last;
    }
  } catch (err) {
    error.value = 'Không thể tải dữ liệu lịch sử point';
    console.error('Error loading point history:', err);
  } finally {
    loading.value = false;
  }
};

// Đảm bảo modal không bị kẹt backdrop hoặc tối màn hình:
// Luôn dùng Modal.getOrCreateInstance để tránh tạo nhiều instance và lỗi backdrop
const openAddModal = () => {
  isEditMode.value = false;
  newPoint.value = {
    id: '',
    email: '',
    orderId: '',
    pointReceived: 0,
    minSpend: 0,
    pointUsed: 0,
    description: ''
  };
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const openEditModal = (point, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  // Cập nhật để khớp với cấu trúc dữ liệu mới từ API
  newPoint.value = {
    id: point.id,
    email: point.email || '',
    orderId: point.orderCode || '',
    pointReceived: point.pointEarned || 0,
    minSpend: point.minSpent || 0,
    pointUsed: point.pointSpent || 0,
    description: point.description || ''
  };
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const handleSubmitRank = () => {
  // Validate form
  if (!newRank.value.id || !newRank.value.name || !newRank.value.email) {
    alert('Vui lòng điền đầy đủ các trường bắt buộc!');
    return;
  }

  if (isEditMode.value && editIndex.value !== null) {
    // Update existing rank
    points.value[editIndex.value] = {
      ...newRank.value,
      minSpend: Number(newRank.value.minSpend),
      pointMultiplier: Number(newRank.value.pointMultiplier),
      status: Number(newRank.value.status)
    };
    console.log('Rank updated:', newRank.value);
  } else {
    // Add new rank only
    const newId = Math.max(...points.value.map(r => r.id)) + 1;
    points.value.push({
      id: newId,
      name: newRank.value.name,
      minSpend: Number(newRank.value.minSpend),
      pointMultiplier: Number(newRank.value.pointMultiplier),
      email: newRank.value.email,
      status: Number(newRank.value.status)
    });
    console.log('New rank added:', newRank.value);
  }

  // Close modal after submit
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

const handleSubmitPoint = () => {
  if (!newPoint.value.email || !newPoint.value.orderId) {
    alert('Vui lòng nhập đầy đủ email và id đơn hàng!');
    return;
  }
  if (isEditMode.value && editIndex.value !== null) {
    points.value[editIndex.value] = {
      ...newPoint.value,
      pointReceived: Number(newPoint.value.pointReceived),
      minSpend: Number(newPoint.value.minSpend),
      pointUsed: Number(newPoint.value.pointUsed)
    };
  } else {
    const newId = points.value.length ? Math.max(...points.value.map(p => p.id)) + 1 : 1;
    points.value.push({
      ...newPoint.value,
      id: newId,
      pointReceived: Number(newPoint.value.pointReceived),
      minSpend: Number(newPoint.value.minSpend),
      pointUsed: Number(newPoint.value.pointUsed)
    });
  }
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

const handleDeletePoint = async (index) => {
  if (confirm('Bạn có chắc muốn xóa dòng này?')) {
    // Tạm thời xóa từ mảng local, trong thực tế nên gọi API delete
    points.value.splice(index, 1);
    // TODO: Gọi API delete point theo ID
    // await deletePoint(pointId);
    // Sau đó reload dữ liệu
    // await loadPointHistory();
  }
};

const closeModal = () => {
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement); // <-- Sử dụng getOrCreateInstance
  modal.hide();
};

const handleStatusChange = (rank, newStatus) => {
  console.log(`Rank ${rank.name} status changed to: ${newStatus}`);
};

// Pagination functions
const handlePrev = () => {
  if (currentPage.value > 0) {
    loadPointHistory(currentPage.value - 1, pageSize.value);
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    loadPointHistory(currentPage.value + 1, pageSize.value);
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  loadPointHistory(0, newSize); // Reset về trang đầu khi thay đổi page size
};

const resetRankModal = () => {
  isEditMode.value = false;
  editIndex.value = null;
  newRank.value = {
    id: '',
    name: '',
    email: '',
    status: '1',
    minSpend: 0,
    pointMultiplier: 1
  };
};

let modalElement = null;

onMounted(() => {
  // Load dữ liệu khi component được mount
  loadPointHistory();
  
  modalElement = document.getElementById('addRankModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', resetRankModal); // <-- Reset state khi modal đóng
  }
});

onUnmounted(() => {
  if (modalElement) {
    modalElement.removeEventListener('hidden.bs.modal', resetRankModal);
  }
  // Clear timeout khi component bị destroy
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});

// Hàm xử lý thay đổi filter select (gọi API ngay lập tức)
const handleFilterChange = () => {
  currentPage.value = 0; // Reset về trang đầu
  loadPointHistory(0, pageSize.value);
};

// Hàm xử lý input search với debounce
const handleSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0; // Reset về trang đầu
    loadPointHistory(0, pageSize.value);
  }, 500); // Debounce 500ms
};

// Hàm xử lý input điểm sử dụng với debounce
const handlePointSpentInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0; // Reset về trang đầu
    loadPointHistory(0, pageSize.value);
  }, 500); // Debounce 500ms
};

// Hàm xóa tất cả filter
const clearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  pointSpentFilter.value = '';
  currentPage.value = 0;
  loadPointHistory(0, pageSize.value);
};

// Hàm reload lại trang
const reloadPage = () => {
  window.location.reload();
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.modal-dialog {
  max-width: 450px !important;
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
</style>