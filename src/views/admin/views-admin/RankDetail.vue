<template>
  <div class="admin-page container-fluid py-4">
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
                placeholder="Nhập tên hoặc email" 
                v-model="searchQuery" 
                @keyup.enter="applyFilters"
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
        <!-- Danh sách User Rank -->
        <div class="card shadow-lg border-0 mb-4 admin-table-card">
          <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
            <div>
              <h5 class="mb-0 text-secondary">
                <i class="bi bi-people-fill me-2"></i>
                Người dùng trong rank: {{ rankName }}
              </h5>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-info btn-sm py-2" @click="fetchUserRanks" :disabled="loading">
                <i class="bi bi-arrow-repeat me-1"></i> Làm mới
              </button>
              <!-- <button
                class="btn btn-success btn-sm"
                @click="showAddUserModal = true"
              >
                <i class="bi bi-plus-circle me-2"></i> Thêm người dùng
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
                <table class="table align-middle table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th style="width: 40px">#</th>
                      <th style="width: 150px">Tên người dùng</th>
                      <th style="width: 200px">Email</th>
                      <th style="width: 150px">Ngày thêm vào rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="users.length === 0">
                      <td colspan="4" class="text-center py-4 text-muted">
                        <i class="bi bi-inbox me-2"></i>
                        Không có dữ liệu
                      </td>
                    </tr>
                    <tr v-for="(user, idx) in users" :key="user.id" class="align-middle" style="vertical-align: middle;">
                      <td class="py-3">{{ currentPage * pageSize + idx + 1 }}</td>
                      <td class="py-3 fw-bold">{{ user.userName || user.full_name }}</td>
                      <td class="py-3">{{ user.userEmail || user.email }}</td>
                      <td class="py-3">
                        <span class="fw-bold">{{ toTime(user.createdAt) }}</span>
                        <br />
                        <small class="text-muted">{{ toDate(user.createdAt) }}</small>
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
 
    <!-- Add User to Rank Modal -->
    <div class="modal fade" :class="{ show: showAddUserModal }" tabindex="-1" style="display: block;" v-if="showAddUserModal">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content enhanced-modal">
          <div class="modal-header gradient-header">
            <h5 class="modal-title">
              <i class="bi bi-person-plus me-2"></i>
              Thêm rank cho người dùng
            </h5>
            <button type="button" class="custom-close-btn" @click="closeAddUserModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body enhanced-body">
            <form @submit.prevent="handleAddUserToRank">
              <!-- Section 1: Thông tin người dùng -->
              <div class="form-section">
                <div class="section-header">
                  <i class="bi bi-person section-icon"></i>
                  <h6 class="section-title">Thông tin người dùng</h6>
                </div>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label enhanced-label">User ID <span class="text-danger">*</span></label>
                    <input 
                      type="number" 
                      class="form-control enhanced-input" 
                      v-model="addUserId" 
                      placeholder="Nhập User ID"
                      required 
                      min="1" 
                    />
                    <div class="form-text">ID của người dùng cần thêm rank</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label enhanced-label">Trạng thái <span class="text-danger">*</span></label>
                    <select class="form-select enhanced-input" v-model="addStatus" required>
                      <option value="1">Hoạt động</option>
                      <option value="0">Không hoạt động</option>
                    </select>
                    <div class="form-text">Trạng thái của rank cho người dùng</div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Thông tin rank -->
              <div class="form-section">
                <div class="section-header">
                  <i class="bi bi-award section-icon"></i>
                  <h6 class="section-title">Thông tin Rank</h6>
                </div>
                <div class="row g-3">
                  <div class="col-md-12">
                    <label class="form-label enhanced-label">Rank <span class="text-danger">*</span></label>
                    <select class="form-select enhanced-input" v-model="addRankId" required>
                      <option value="">Chọn rank</option>
                      <option v-for="rank in rankOptions" :key="rank.id" :value="rank.id">
                        {{ rank.name }}
                      </option>
                    </select>
                    <div class="form-text">Chọn rank để gán cho người dùng</div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer enhanced-footer">
            <button type="button" class="btn btn-secondary btn-cancel" @click="closeAddUserModal">
              <i class="bi bi-x-circle me-1"></i>
              Hủy
            </button>
            <button type="button" class="btn btn-primary btn-submit" @click="handleAddUserToRank">
              <i class="bi bi-check-circle me-1"></i>
              Thêm mới
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddUserModal" class="modal-backdrop fade show"></div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import Pagination from '@/components/common/Pagination.vue';
import ToggleStatus from '@/components/common/ToggleStatus.vue';
import { getUserRanksByRankId, addUserToRank, toggleUserRankStatus } from '@/services/admin/userRank.js';
import { showToast } from '@/utils/swalHelper';
import { getRanksDropdown } from '@/services/admin/rank.js';
import { toDate, toTime } from '@/utils/utils.js';

const route = useRoute();
const rankId = route.params.id;
const rankName = route.query.name || '';
const searchQuery = ref('');
const users = ref([]);
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);
const showAddUserModal = ref(false);
const addUserId = ref('');
const addRankId = ref('');
const addStatus = ref(1);
const rankOptions = ref([]);
const loading = ref(false);
const showFilter = ref(true);

const applyFilters = () => {
  currentPage.value = 0;
  fetchUserRanks();
};

const clearFilters = () => {
  searchQuery.value = "";
  currentPage.value = 0;
  fetchUserRanks();
};

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const formatCurrency = (amount) => {
  if (!amount) return '0 VND';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('vi-VN');
};

const fetchUserRanks = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
    };
    
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    
    console.log('Fetching user ranks for rankId:', rankId, 'with params:', params);
    
    const response = await getUserRanksByRankId(rankId, params);
    console.log('User ranks response:', response);
    
    // Handle different response structures
    let data;
    if (response && response.data) {
      data = response.data;
    } else if (response && response.content) {
      data = response;
    } else {
      data = response || {};
    }
    
    users.value = data.content || [];
    totalPages.value = data.totalPages ?? 1;
    totalElements.value = data.totalElements ?? users.value.length;
    isLastPage.value = data.last ?? (currentPage.value >= totalPages.value - 1);
    
    console.log('Users loaded:', users.value.length);
  } catch (e) {
    console.error('Error fetching user ranks:', e);
    users.value = [];
    totalPages.value = 1;
    totalElements.value = 0;
    isLastPage.value = true;
    showToast('error', 'Lỗi khi tải danh sách người dùng!', 3000);
  }
};

const fetchRankDropdown = async () => {
  try {
    console.log('Fetching rank dropdown...');
    const response = await getRanksDropdown();
    console.log('Rank dropdown response:', response);
    
    // Handle multiple possible response structures
    let rankData = [];
    if (Array.isArray(response)) {
      rankData = response;
    } else if (response.data && Array.isArray(response.data)) {
      rankData = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      rankData = response.data.data;
    } else if (response.data && response.data.content && Array.isArray(response.data.content)) {
      rankData = response.data.content;
    } else {
      console.warn('Unexpected rank dropdown response structure:', response);
      rankData = [];
    }
    
    rankOptions.value = rankData;
    console.log('Rank options loaded:', rankOptions.value);
  } catch (e) {
    console.error('Error fetching rank dropdown:', e);
    rankOptions.value = [];
    showToast('error', 'Lỗi khi tải danh sách ranks!', 3000);
  }
};

const handlePrev = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchUserRanks();
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    currentPage.value++;
    fetchUserRanks();
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 0;
  fetchUserRanks();
};

watch([pageSize], () => {
  currentPage.value = 0;
  fetchUserRanks();
});

onMounted(() => {
  fetchUserRanks();
  fetchRankDropdown();
});

function closeAddUserModal() {
  showAddUserModal.value = false;
  addUserId.value = '';
  addRankId.value = '';
  addStatus.value = 1;
}

async function handleAddUserToRank() {
  // Validation
  if (!addUserId.value || addUserId.value <= 0) {
    showToast('error', 'Vui lòng nhập User ID hợp lệ!', 3000);
    return;
  }
  
  if (!addRankId.value) {
    showToast('error', 'Vui lòng chọn Rank!', 3000);
    return;
  }
  
  if (addStatus.value === '') {
    showToast('error', 'Vui lòng chọn trạng thái!', 3000);
    return;
  }
  
  try {
    const payload = {
      userId: Number(addUserId.value),
      rankId: Number(addRankId.value),
      status: Number(addStatus.value)
    };
    
    console.log('Sending payload:', payload); // Debug log
    
    const response = await addUserToRank(payload);
    
    console.log('Response:', response); // Debug log
    
    showToast('success', 'Thêm người dùng vào rank thành công!', 2000);
    fetchUserRanks();
    closeAddUserModal();
  } catch (e) {
    console.error('Error adding user to rank:', e); // Debug log
    const status = e?.response?.status;
    const message = e?.response?.data?.message || 'Có lỗi xảy ra khi thêm người dùng vào rank';
    showToast('error', `Thêm thất bại! [${status}] ${message}`, 4000);
  }
}

async function handleUserRankStatusChange(user) {
  const oldStatus = user.status; // Lưu trạng thái cũ trước khi đổi
  user.status = oldStatus === 1 ? 0 : 1; // Đảo trạng thái trên UI ngay khi click toggle
  try {
    const res = await toggleUserRankStatus(user.id); // Gọi API đổi trạng thái trên backend
    // Nếu backend trả về message và status thì show toast theo kết quả
    if (res && res.status && res.message) {
      showToast(
        res.status === 200 ? 'success' : 'error',
        res.message,
        2000
      );
    } else {
      showToast('success', 'Đổi trạng thái thành công!', 1500);
    }
    fetchUserRanks(); // Refresh lại danh sách cho chắc chắn
  } catch (e) {
    user.status = oldStatus; // Nếu lỗi, trả lại trạng thái cũ để toggle không bị sai màu/trạng thái
    // Hiển thị thông báo lỗi chi tiết từ backend
    const status = e?.response?.status || e?.status || 'Lỗi';
    const message = e?.response?.data?.message || e?.message || 'Đổi trạng thái thất bại!';
    showToast('error', `Lỗi ${status}: ${message}`, 3000);
  }
}
</script>

<style scoped>
@import "@/assets/css/admin-global.css";
@import "@/assets/css/form-global.css";
@import "@/assets/css/form-detail-global.css";

/* Layout 2 cột cho filter sidebar */
.filter-sidebar {
  width: 250px;
  transition: all 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
  padding-right: 15px;
}

.filter-sidebar-collapsed {
  width: 100px;
}

.filter-sidebar-collapsed .filter-card .card-body {
  opacity: 0;
  pointer-events: none;
  max-height: 0;
  padding: 0;
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

/* Table content */
.table-main-content {
  flex: 1;
  transition: all 0.3s ease;
  margin-left: 0;
  min-width: 0;
}

.table-main-content-expanded {
  margin-left: 0;
}

/* Sticky filter */
.sticky-filter {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.row > [class*="col-"] {
  padding: 0;
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
  flex-wrap: wrap;
  margin: 0;
}

.row > [class*="col-"] {
  flex: 0 0 auto;
  padding: 0 15px;
}

.col-lg-2 {
  width: 100%;
  max-width: 100%;
}

.col-lg-10 {
  width: 100%;
  max-width: 100%;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .filter-sidebar {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .filter-sidebar-collapsed {
    width: 100%;
  }
  
  .table-main-content {
    margin-left: 0;
  }
  
  .table-main-content-expanded {
    margin-left: 0;
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

/* Enhanced Modal Styles */
.modal-lg {
  max-width: 700px !important;
}

.modal-dialog-scrollable {
  max-height: 90vh;
}

.modal-dialog-scrollable .modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.enhanced-modal {
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: none;
  overflow: hidden;
}

.gradient-header {
  background: linear-gradient(135deg, #ecae9e 0%, #d49489 100%);
  border-bottom: none;
  border-radius: 15px 15px 0 0;
  padding: 1rem 1.25rem;
  position: relative;
}

.gradient-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
  background-size: 300% 100%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.modal-title {
  font-weight: 600;
  color: #2c2c54;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.enhanced-body {
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.enhanced-footer {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 0.875rem 1.25rem;
  border-radius: 0 0 15px 15px;
}

/* Form Section Styles */
.form-section {
  margin-bottom: 1.75rem;
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #ecae9e;
  position: relative;
  transition: all 0.3s ease;
}

.form-section:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.form-section:nth-child(1) {
  border-left-color: #ecae9e;
}

.form-section:nth-child(2) {
  border-left-color: #4ecdc4;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f3f4;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, #ecae9e, #4ecdc4);
  border-radius: 1px;
}

.section-icon {
  font-size: 1rem;
  color: #ecae9e;
  margin-right: 0.5rem;
  padding: 0.4rem;
  background: rgba(236, 174, 158, 0.1);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  margin: 0;
  font-weight: 600;
  color: #2c2c54;
  font-size: 0.95rem;
}

/* Enhanced Form Controls */
.enhanced-label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #495057;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

.enhanced-label .text-danger {
  margin-left: 0.25rem;
}

.enhanced-input {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  background: #ffffff;
}

.enhanced-input:focus {
  border-color: #ecae9e;
  box-shadow: 0 0 0 0.15rem rgba(236, 174, 158, 0.25);
  background: #ffffff;
}

.enhanced-input:hover {
  border-color: #d49489;
}

/* Button Styles */
.btn-submit {
  background: linear-gradient(135deg, #ecae9e 0%, #d49489 100%);
  border: none;
  border-radius: 20px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(236, 174, 158, 0.3);
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(236, 174, 158, 0.4);
  background: linear-gradient(135deg, #d49489 0%, #c08579 100%);
}

.btn-cancel {
  border: 1px solid #6c757d;
  border-radius: 20px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  background: transparent;
  color: #6c757d;
}

.btn-cancel:hover {
  background: #6c757d;
  color: white;
  transform: translateY(-1px);
}

.custom-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 0.6rem;
  cursor: pointer;
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c2c54;
  transition: all 0.3s ease;
}

.custom-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

/* Form text */
.form-text {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

/* Modal backdrop */
.modal-backdrop {
  z-index: 1040;
}

.modal {
  z-index: 1050;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .enhanced-modal {
    margin: 0.5rem;
  }
  
  .enhanced-body {
    padding: 0.75rem;
  }
  
  .form-section {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .modal-lg {
    max-width: 95% !important;
  }
}

/* Animation for form sections */
.form-section {
  animation: slideInUp 0.4s ease-out;
}

.form-section:nth-child(1) {
  animation-delay: 0s;
}

.form-section:nth-child(2) {
  animation-delay: 0.1s;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
