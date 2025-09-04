<template>
  <div class="container-fluid py-4">
    <!-- Point Statistics Section -->
    <div class="mb-4">
      <!-- Statistics Cards -->
      <div v-if="statsLoading" class="row g-3">
        <div v-for="i in 5" :key="i" class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
          <div class="card stats-card loading-card">
            <div class="card-body">
              <div class="placeholder-glow">
                <div class="placeholder col-6 mb-2"></div>
                <div class="placeholder col-8 mb-3"></div>
                <div class="placeholder col-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="row g-3">
        <!-- Average Points Per User Card -->
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
          <div class="card stats-card avg-points-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper avg-points-icon">
                  <i class="bi bi-graph-up"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value">{{ formatNumber(statsData?.averagePointsPerUser) }}</div>
                  <div class="stat-label">Điểm TB/người dùng</div>
                </div>
              </div>
              <div class="stat-footer">
                <small class="text-muted">
                  Trung bình hệ thống
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Total System Points Card -->
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
          <div class="card stats-card total-points-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper total-points-icon">
                  <i class="bi bi-database"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value">{{ formatNumber(statsData?.totalSystemPoints) }}</div>
                  <div class="stat-label">Tổng điểm hệ thống</div>
                </div>
              </div>
              <div class="stat-footer">
                <small class="text-info">
                  Tất cả điểm
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Points Earned This Month Card -->
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
          <div class="card stats-card earned-points-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper earned-points-icon">
                  <i class="bi bi-plus-circle"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value">{{ formatNumber(statsData?.pointsEarnedThisMonth) }}</div>
                  <div class="stat-label">Tổng  điểm kiếm tháng này của người dùng</div>
                </div>
              </div>
              <div class="stat-footer">
                <small class="text-success">
                  <i class="bi bi-arrow-up"></i> Tích lũy
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Points Spent This Month Card -->
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
          <div class="card stats-card spent-points-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper spent-points-icon">
                  <i class="bi bi-dash-circle"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value">{{ formatNumber(statsData?.pointsSpentThisMonth) }}</div>
                  <div class="stat-label">Tổng điểm tiêu tháng này của người dùng</div>
                </div>
              </div>
              <div class="stat-footer">
                <small class="text-warning">
                  <i class="bi bi-arrow-down"></i> Sử dụng
                </small>
              </div>
            </div>
          </div>
        </div>

         
      </div>
    </div>


    <!-- Layout 2 cột: Bộ lọc bên trái, Bảng bên phải -->
    <div class="row">
      <!-- Cột bộ lọc (bên trái) -->
      <div class="filter-sidebar" :class="{ 'filter-sidebar-collapsed': !showFilter }">
        <div class="card shadow-lg border-0 filter-card sticky-filter">
          <div class="card-header bg-light border-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0 text-secondary">
                <i class="bi bi-funnel me-2"></i>
                Bộ lọc
              </h6>
              <button 
                class="btn btn-sm btn-outline-secondary" 
                type="button" 
                @click="toggleFilter"
                :aria-expanded="showFilter"
              >
                <i :class="showFilter ? 'bi bi-chevron-left' : 'bi bi-chevron-right'"></i>
              </button>
            </div>
          </div>
          <div class="card-body filter-collapse" :class="{ 'filter-collapsed': !showFilter }">
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-search me-1"></i>
                Tìm kiếm
              </label>
              <input 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Nhập mã đơn hàng, email" 
                v-model="searchQuery" 
                @input="handleSearchInput"
                @keyup.enter="applyFilters"
              />
            </div>
            
            <!-- <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-toggle-on me-1"></i>
                Trạng thái
              </label>
              <select class="form-select form-select-sm" v-model="selectedStatus" @change="handleFilterChange">
                <option value="">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Không hoạt động</option>
              </select>
            </div> -->
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-coins me-1"></i>
                Điểm sử dụng
              </label>
              <input 
                type="number" 
                class="form-control form-control-sm" 
                placeholder="Nhập điểm sử dụng" 
                v-model="pointSpentFilter" 
                @input="handlePointSpentInput" 
                min="0"
              />
            </div>
            
            <div class="d-grid gap-2">
              <button class="btn btn-success btn-sm" @click="applyFilters">
                <i class="bi bi-funnel me-1"></i> Áp dụng lọc
              </button>
              <button class="btn btn-secondary btn-sm" @click="clearFilters">
                <i class="bi bi-x-circle me-1"></i> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Cột bảng (bên phải) -->
      <div class="table-main-content" :class="{ 'table-main-content-expanded': !showFilter }">
        <!-- Danh sách Point -->
        <div class="card shadow-lg border-0 mb-4 admin-table-card">
          <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
            <div>
              <h5 class="mb-0 text-secondary">
                <i class="bi bi-coin me-2"></i>
                Lịch sử điểm
              </h5>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-info btn-sm py-2" @click="reloadPage" :disabled="loading">
                <i class="bi bi-arrow-repeat me-1"></i> Làm mới
              </button>
              
              <!-- Nút Export Excel -->
              <ExcelExportButton 
                data-type="points"
                button-text="Xuất Excel"
              />
              
              <!-- Ẩn nút thêm mới Point -->
              <!-- <button
                class="btn btn-success btn-sm"
                @click="openAddModal"
              >
                <i class="bi bi-plus-circle me-2"></i> Thêm mới
              </button> -->
            </div>
          </div>
          <div class="card-body p-0" :class="{ loading: loading }">
            <div class="loading-overlay" :class="{ show: loading }">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Đang tải...</span>
              </div>
              <p>Đang tải dữ liệu...</p>
            </div>
            
            <!-- Data table -->
            <div>
              <div class="table-responsive">
                <table class="table align-middle table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th style="min-width: 50px;">STT</th>
                      <th style="min-width: 120px;">Thao tác</th>
                      <th style="min-width: 200px;">Email</th>
                      <th style="min-width: 150px;">Mã đơn hàng</th>
                      <th style="min-width: 120px;">Điểm nhận</th>
                      <th style="min-width: 140px;">Chi tiêu tối thiểu</th>
                      <th style="min-width: 120px;">Điểm sử dụng</th>
                      <th style="min-width: 200px;">Mô tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(point, index) in points" :key="point.id">
                      <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                      <td>
                        <!-- Ẩn chức năng sửa/xóa Point -->
                        <!-- <div class="d-flex gap-2">
                          <EditButton @click="openEditModal(point, index)" />
                          <DeleteButton @click="handleDeletePoint(index)" />
                        </div> -->
                        <span class="text-muted">-</span>
                      </td>
                      <td>
                        <div>{{ point.email }}</div>
                      </td>
                      <td>
                        <span class="badge bg-info">{{ point.orderCode || '-' }}</span>
                      </td>
                      <td>
                        <span class="text-success">+{{ point.pointEarned || 0 }}</span>
                      </td>
                      <td>
                        <span class="text-primary">{{ formatCurrency(point.minSpent || 0) }}</span>
                      </td>
                      <td>
                        <span class="text-danger">-{{ point.pointSpent || 0 }}</span>
                      </td>
                      <td>
                        <div class="text-wrap">{{ point.description || '-' }}</div>
                      </td>
                    </tr>
                    <tr v-if="points.length === 0">
                      <td colspan="8" class="text-center text-muted">
                        Không có dữ liệu
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
        </div>
      </div>
    </div>
  </div>
          
    <!-- Ẩn Modal Thêm/Sửa Point -->
  <!-- 
    <div class="modal fade" id="addRankModal" tabindex="-1" aria-labelledby="addRankModalLabel" aria-hidden="true">
      <div class="modal-dialog" style="max-width: 600px">
        <div class="modal-content">
          <div class="modal-header form-modal-header">
            <h5 class="modal-title" id="addRankModalLabel">
              <i class="bi me-2" :class="isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
              {{ isEditMode ? 'Chỉnh sửa Point' : 'Thêm mới Point' }}
            </h5>
            <button type="button" class="custom-close-btn" @click="closeModal">
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <div class="modal-body form-modal-body">
            <form @submit.prevent="handleSubmitPoint">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="newPoint.email" required placeholder="Nhập email" />
              </div>
              <div class="mb-3">
                <label class="form-label">ID đơn hàng</label>
                <input type="text" class="form-control" v-model="newPoint.orderId" placeholder="Nhập ID đơn hàng" />
              </div>
              <div class="mb-3">
                <label class="form-label">Số điểm nhận</label>
                <input type="number" class="form-control" v-model="newPoint.pointReceived" min="0" required placeholder="Nhập số điểm nhận" />
              </div>
              <div class="mb-3">
                <label class="form-label">Chi tiêu tối thiểu (VND)</label>
                <input type="number" class="form-control" v-model="newPoint.minSpend" min="0" required placeholder="Nhập chi tiêu tối thiểu" />
              </div>
              <div class="mb-3">
                <label class="form-label">Điểm sử dụng</label>
                <input type="number" class="form-control" v-model="newPoint.pointUsed" min="0" required placeholder="Nhập điểm sử dụng" />
              </div>
              <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea class="form-control" v-model="newPoint.description" rows="2" placeholder="Nhập mô tả"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn form-btn-secondary" @click="closeModal">Đóng</button>
            <button type="button" class="btn form-btn-primary" @click="handleSubmitPoint">
              {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  -->
</template>
<script setup>
import EditButton from '@/components/common/EditButton.vue';
import Pagination from '@/components/common/Pagination.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
// Statistics API
import { getPointStatistics, formatNumber, formatPercentage } from '@/services/admin/moduleStatistics';
import Swal from 'sweetalert2';
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';
import { getPointHistory, createPoint, getOrderIdByOrderCode, updatePoint } from '@/services/admin/point.js';
import { showToast } from '@/utils/swalHelper.js';
import ExcelExportButton from '@/components/common/ExcelExportButton.vue';

const searchQuery = ref('');
const selectedStatus = ref('');
const pointSpentFilter = ref('');
const showFilter = ref(true);

// Debounce timer để tránh gọi API quá nhiều lần
let searchTimeout = null;

// Filter functions
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const applyFilters = () => {
  currentPage.value = 0;
  loadPointHistory(0, pageSize.value);
};

const formatCurrency = (amount) => {
  if (!amount) return '0 VND';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

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

// Statistics data
const statsLoading = ref(true);
const statsData = ref(null);

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
      // Cập nhật thông tin pagination từ backend
      currentPage.value = response.data.pageNumber;
      pageSize.value = response.data.pageSize;
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

const openEditModal = async (point, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  let orderId = '';
  if (point.orderCode) {
    try {
      orderId = await getOrderIdByOrderCode(point.orderCode);
    } catch (e) {
      orderId = '';
    }
  }
  newPoint.value = {
    id: point.id,
    email: point.email || '',
    orderId: orderId || '',
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

const handleSubmitPoint = async () => {
  if (!newPoint.value.email) {
    alert('Vui lòng nhập đầy đủ email!');
    return;
  }
  try {
    const payload = {
      email: newPoint.value.email,
      orderId: newPoint.value.orderId,
      pointEarned: newPoint.value.pointReceived,
      minSpent: newPoint.value.minSpend,
      pointSpent: newPoint.value.pointUsed,
      description: newPoint.value.description,
      status: 1
    };
    if (isEditMode.value && newPoint.value.id) {
      await updatePoint(newPoint.value.id, payload);
      showToast('success', 'Cập nhật point thành công!');
    } else {
      await createPoint(payload);
      showToast('success', 'Thêm point thành công!');
    }
    await loadPointHistory(currentPage.value, pageSize.value);
    const modalElement = document.getElementById('addRankModal');
    const modal = Modal.getOrCreateInstance(modalElement);
    modal.hide();
  } catch (error) {
    showToast('error', isEditMode.value ? 'Cập nhật point thất bại!' : 'Thêm point thất bại!');
  }
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

// Statistics functions
const fetchPointStatistics = async () => {
  statsLoading.value = true;
  try {
    const response = await getPointStatistics();
    if (response.status === 200) {
      statsData.value = response.data;
    } else {
      throw new Error('Failed to fetch point statistics');
    }
  } catch (error) {
    console.error('Error fetching point statistics:', error);
    
    // Fallback data để tránh lỗi hiển thị
    statsData.value = {
      averagePointsPerUser: 3250.75,
      totalSystemPoints: 4063750,
      pointsEarnedThisMonth: 156000,
      pointsSpentThisMonth: 89000,
      topPointEarners: [
        { 
          fullName: "Trần Thị B", 
          email: "tranthib@example.com", 
          totalPointsEarned: 25000, 
          rankName: "Gold" 
        },
        { 
          fullName: "Nguyễn Văn C", 
          email: "nguyenvanc@example.com", 
          totalPointsEarned: 22000, 
          rankName: "Silver" 
        },
        { 
          fullName: "Lê Thị D", 
          email: "lethid@example.com", 
          totalPointsEarned: 18000, 
          rankName: "Silver" 
        }
      ]
    };
    
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải dữ liệu thống kê điểm - Hiển thị dữ liệu mẫu',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    });
  } finally {
    statsLoading.value = false;
  }
};

const getPointsBalance = () => {
  if (statsData.value) {
    return (statsData.value.pointsEarnedThisMonth || 0) - (statsData.value.pointsSpentThisMonth || 0);
  }
  return 0;
};

const getBalanceClass = () => {
  const balance = getPointsBalance();
  if (balance > 0) return 'text-success';
  if (balance < 0) return 'text-danger';
  return 'text-muted';
};

const getBalanceText = () => {
  const balance = getPointsBalance();
  if (balance > 0) return '+ Tích cực';
  if (balance < 0) return '- Tiêu nhiều';
  return 'Cân bằng';
};

onMounted(() => {
  // Load dữ liệu khi component được mount
  loadPointHistory();
  fetchPointStatistics();
  
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
  loadPointHistory();
};
</script>

<style scoped>
@import "@/assets/css/admin-table-responsive.css";
@import '@/assets/css/admin-global.css';
@import '@/assets/css/form-global.css';

/* Filter Sidebar - Thu sang trái */
.filter-sidebar {
  width: 250px;
  transition: all 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
}

.filter-sidebar-collapsed {
  width: 100px;
}

.filter-sidebar-collapsed .filter-card .card-body {
  opacity: 0;
  pointer-events: none;
}

.filter-sidebar-collapsed .filter-card .card-header h6 {
  opacity: 0;
}

.filter-sidebar-collapsed .filter-card .card-header {
  padding: 0.75rem;
  text-align: center;
}

.filter-sidebar-collapsed .filter-card .card-header .d-flex {
  justify-content: center !important;
}

.filter-sidebar-collapsed .filter-card .card-header .btn {
  margin: 0;
}

/* Table content - Mở rộng khi filter đóng */
.table-main-content {
  flex: 1;
  transition: all 0.3s ease;
  margin-left: 15px;
}

.table-main-content-expanded {
  margin-left: 15px;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.loading-overlay.show {
  opacity: 1;
  visibility: visible;
}

.loading-overlay .spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Sticky filter sidebar */
.sticky-filter {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

/* Compact filter styles */
.filter-card .card-body {
  padding: 1rem;
}

.filter-card .form-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

.filter-card .form-control-sm,
.filter-card .form-select-sm {
  padding: 0.4rem 0.6rem;
  font-size: 0.875rem;
}

/* Filter collapse */
.filter-collapse {
  transition: all 0.3s ease;
  overflow: hidden;
}

.filter-collapsed {
  max-height: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  opacity: 0;
}

/* Force layout to stay in same row */
.row {
  display: flex;
  flex-wrap: nowrap;
  margin: 0;
}

.row > [class*="col-"] {
  flex: 0 0 auto;
  padding: 0 15px;
}

.col-lg-2 {
  width: 16.666667%;
  max-width: 16.666667%;
}

.col-lg-10 {
  width: 83.333333%;
  max-width: 83.333333%;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .row {
    flex-wrap: wrap;
  }
  
  .sticky-filter {
    position: relative;
    top: auto;
    max-height: none;
    margin-bottom: 1rem;
  }
  
  .col-lg-2,
  .col-lg-10 {
    width: 100%;
    max-width: 100%;
  }
}

/* Table responsive improvements */
.table-responsive {
  border-radius: 0.5rem;
}

.table th {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  background-color: #f8f9fa !important;
}

.table td {
  font-size: 0.875rem;
  vertical-align: middle;
}

/* Admin table card styling */
.admin-table-card {
  border-radius: 0.75rem;
  overflow: hidden;
}

.admin-table-card .card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.admin-table-card .card-header h5 {
  margin: 0;
  font-weight: 600;
}

/* Text wrap for description */
.text-wrap {
  white-space: normal;
  word-wrap: break-word;
  max-width: 200px;
}

/* Point Statistics Cards Styling */
.avg-points-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.total-points-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.earned-points-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.spent-points-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.balance-points-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.stats-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.stats-card .card-body {
  padding: 1.5rem;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  color: #2d3748;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
  margin-top: 0.25rem;
}

.stat-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* Loading Cards */
.loading-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.placeholder {
  background-color: #dee2e6;
  border-radius: 4px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats-card .card-body {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .icon-wrapper {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}

</style>