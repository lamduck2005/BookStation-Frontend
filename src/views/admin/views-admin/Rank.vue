<template>
  <div class="container-fluid py-4">
    <!-- Rank Statistics Section -->
    <div class="mb-4">
      <!-- Statistics Cards -->
      <div v-if="statsLoading" class="row g-3">
        <div v-for="i in 4" :key="i" class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
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
        <!-- Total Ranks Card -->
        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
          <div class="card stats-card ranks-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper ranks-icon">
                  <i class="bi bi-award"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value">{{ getTotalRanks() }}</div>
                  <div class="stat-label">Tổng số xếp hạng</div>
                </div>
              </div>
              <div class="stat-footer">
                <small class="text-muted">
                  Đang hoạt động
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Most Popular Rank Card -->
        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
          <div class="card stats-card popular-rank-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper popular-rank-icon">
                  <i class="bi bi-trophy"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value small-text">{{ getMostPopularRank().rankName || 'N/A' }}</div>
                  <div class="stat-label">Xếp hạng phổ biến</div>
                </div>
              </div>
              <div class="stat-footer">
                <small class="text-success">
                  <strong>{{ formatNumber(getMostPopularRank().userCount) }} người dùng</strong>
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Highest Average Points Card -->
        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
          <div class="card stats-card highest-points-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper highest-points-icon">
                  <i class="bi bi-gem"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value small-text">{{ getHighestPointsRank().rankName || 'N/A' }}</div>
                  <div class="stat-label">Điểm trung bình cao nhất</div>
                </div>
              </div>
              <div class="stat-footer">
                <small class="text-warning">
                  <strong>{{ formatNumber(getHighestPointsRank().averagePoints) }} điểm</strong>
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Fastest Growing Rank Card -->
        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
          <div class="card stats-card growing-rank-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper growing-rank-icon">
                  <i class="bi bi-graph-up-arrow"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value small-text">{{ getFastestGrowingRank().rankName || 'N/A' }}</div>
                  <div class="stat-label">Tăng trưởng nhanh nhất</div>
                </div>
              </div>
              <div class="stat-footer">
                <small class="text-success">
                  <strong>+{{ formatPercentage(getFastestGrowingRank().growthRate) }}</strong>
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
                Tên hạng
              </label>
              <input 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Nhập tên hạng" 
                v-model="searchQuery"
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
        <!-- Danh sách Rank -->
        <div class="card shadow-lg border-0 mb-4 admin-table-card">
          <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
            <div>
              <h5 class="mb-0 text-secondary">
                <i class="bi bi-star-fill me-2"></i>
                Danh sách hạng
              </h5>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-info btn-sm py-2" @click="fetchRanks" :disabled="loading">
                <i class="bi bi-arrow-repeat me-1"></i> Làm mới
              </button>
              
              <!-- Nút Export Excel -->
              <ExcelExportButton 
                data-type="ranks"
                button-text="Xuất Excel"
              />
              
              <button
                v-if="ranks.length < 3"
                class="btn btn-success btn-sm"
                @click="openAddModal"
              >
                <i class="bi bi-plus-circle me-2"></i> Thêm mới
              </button>
              <span v-else class="text-muted small text-center d-flex align-items-center justify-content-center">
                <i class="bi bi-info-circle me-1"></i>
                Đã đủ 3 hạng (Vàng, Bạc, Kim cương) không thể thêm mới  
              </span>
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
                      <th style="min-width: 200px;">Tên hạng</th>
                      <th style="min-width: 150px;">Mức chi tiêu tối thiểu</th>
                      <th style="min-width: 100px;">Hệ số điểm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(rank, index) in ranks" :key="rank.id">
                      <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                      <td>
                        <div class="d-flex gap-2">
                          <EditButton @click="openEditModal(rank, index)" />
                        </div>
                      </td>
                      <td>
                        <router-link 
                          :to="{ name: 'Chi tiết hạng', params: { id: rank.id }, query: { name: rank.name } }"
                          class="text-decoration-none fw-bold text-primary"
                        >
                          {{ rank.name }}
                        </router-link>
                      </td>
                      <td>
                        <span class="text-success">{{ formatCurrency(rank.minSpent) }}</span>
                      </td>
                      <td>
                        <span class="badge bg-info">{{ rank.pointMultiplier }}x</span>
                      </td>
                    </tr>
                    <tr v-if="ranks.length === 0">
                      <td colspan="5" class="text-center text-muted py-4">
                        <i class="bi bi-inbox display-1 text-muted d-block mb-3"></i>
                        Không có dữ liệu hạng
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
   
  <!-- Add/Edit Rank Modal -->
  <div class="modal fade" :class="{ show: showModal }" tabindex="-1" style="display: block;" v-if="showModal">
    <div class="modal-dialog" style="max-width: 600px">
      <div class="modal-content">
        <div class="modal-header form-modal-header">
          <h5 class="modal-title">
            <i class="bi me-2" :class="isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
            {{ isEditMode ? 'Chỉnh sửa hạng' : 'Thêm hạng mới' }}
          </h5>
          <button type="button" class="custom-close-btn" @click="closeModal">
            <i class="bx bx-x-circle"></i>
          </button>
        </div>
        <div class="modal-body form-modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Tên hạng <span class="text-danger">*</span></label>
              <input
                v-if="isEditMode"
                type="text"
                class="form-control disabled-input"
                :value="formData.rankName"
                disabled
                readonly
              />
              <select 
                v-else
                class="form-select" 
                v-model="formData.rankName"
                required
              >
                <option value="">Chọn loại hạng</option>
                <option value="Vàng">Vàng</option>
                <option value="Bạc">Bạc</option>
                <option value="Kim cương">Kim cương</option>
              </select>
              <div class="form-text">Chỉ được phép tạo 3 loại hạng: Vàng, Bạc, Kim cương</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Mức chi tiêu tối thiểu <span class="text-danger">*</span></label>
              <input 
                type="number" 
                class="form-control" 
                v-model="formData.minSpent"
                placeholder="Nhập mức chi tiêu tối thiểu"
                required
                min="0"
                step="1000"
              />
              <div class="form-text">Số tiền khách hàng cần chi tiêu để đạt hạng này</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Hệ số điểm <span class="text-danger">*</span></label>
              <input 
                type="number" 
                class="form-control" 
                v-model="formData.pointMultiplier"
                placeholder="Nhập hệ số điểm"
                required
                min="1"
                max="5"
                step="0.1"
              />
              <div class="form-text">Hệ số nhân điểm khi khách hàng mua hàng (1.0 - 5.0)</div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn form-btn-secondary" @click="closeModal">
            <i class="bi bi-x-circle me-1"></i>
            Hủy
          </button>
          <button type="button" class="btn form-btn-primary" @click="handleSubmit">
            <i class="bi bi-check-circle me-1"></i>
            {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getRanks, createRank, updateRank, deleteRank } from '@/services/admin/rank.js';
import { showToast, showQuickConfirm } from '@/utils/swalHelper';
import { debounce } from '@/utils/utils';

// Components
import AddButton from '@/components/common/AddButton.vue';
import EditButton from '@/components/common/EditButton.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
import StatusLabel from '@/components/common/StatusLabel.vue';
import Pagination from '@/components/common/Pagination.vue';
// Statistics API
import { getRankStatistics, formatNumber, formatPercentage } from '@/services/admin/moduleStatistics';
import Swal from 'sweetalert2';
import ExcelExportButton from '@/components/common/ExcelExportButton.vue';

// Reactive data
const ranks = ref([]);
const searchQuery = ref('');
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);
const loading = ref(false);
const showFilter = ref(true);

// Statistics data
const statsLoading = ref(true);
const statsData = ref(null);

// Modal
const showModal = ref(false);
const isEditMode = ref(false);
const editingIndex = ref(-1);
const formData = ref({
  id: null,
  rankName: '',
  minSpent: '',
  pointMultiplier: '',
  status: ''
});

const applyFilters = async () => {
  currentPage.value = 0;
  await fetchRanks();
};

const clearFilters = async () => {
  searchQuery.value = "";
  currentPage.value = 0;
  await fetchRanks();
};

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};
  


// Methods
const fetchRanks = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      size: pageSize.value,
    };
    
    if (searchQuery.value) {
      params.name = searchQuery.value;
    }
    
    const response = await getRanks(params);
    const data = response.data || {};
    
    ranks.value = data.content || [];
    totalPages.value = data.totalPages || 0;
    totalElements.value = data.totalElements || 0;
    isLastPage.value = data.last || false;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hạng:', error);
    showToast('error', 'Lỗi khi tải danh sách hạng!');
  } finally {
    loading.value = false;
  }
};

const handlePrev = async () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    await fetchRanks();
  }
};

const handleNext = async () => {
  if (!isLastPage.value) {
    currentPage.value++;
    await fetchRanks();
  }
};

const handlePageSizeChange = async (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 0;
  await fetchRanks();
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('vi-VN');
};

const formatCurrency = (amount) => {
  if (!amount) return '0 VND';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const openAddModal = () => {
  isEditMode.value = false;
  editingIndex.value = -1;
  formData.value = {
    id: null,
    rankName: '',
    minSpent: '',
    pointMultiplier: '',
    status: ''
  };
  showModal.value = true;
};

const openEditModal = (rank, index) => {
  isEditMode.value = true;
  editingIndex.value = index;
  formData.value = {
    id: rank.id,
    rankName: rank.name,
    minSpent: rank.minSpent,
    pointMultiplier: rank.pointMultiplier,
    status: rank.status
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  formData.value = {
    id: null,
    rankName: '',
    minSpent: '',
    pointMultiplier: '',
    status: ''
  };
};

const handleSubmit = async () => {
  try {
    const submitData = {
      ...formData.value,
      minSpent: Number(formData.value.minSpent),
      pointMultiplier: Number(formData.value.pointMultiplier),
      status: 1 // Luôn set status = 1 (hoạt động)
    };
    
    if (isEditMode.value) {
      await updateRank(formData.value.id, submitData);
      showToast('success', 'Cập nhật hạng thành công!');
    } else {
      await createRank(submitData);
      showToast('success', 'Thêm hạng thành công!');
    }
    
    closeModal();
    await fetchRanks();
  } catch (error) {
    console.error('Lỗi khi xử lý hạng:', error);
    const message = error.response?.data?.message || 'Có lỗi xảy ra!';
    showToast('error', message);
  }
};

const handleDelete = async (rank) => {
  const result = await showQuickConfirm(
    'Xác nhận xóa',
    `Bạn có chắc chắn muốn xóa hạng "${rank.name}"?`,
    'warning',
    'Xóa',
    'Hủy'
  );
  
  if (result.isConfirmed) {
    try {
      await deleteRank(rank.id);
      showToast('success', 'Xóa hạng thành công!');
      await fetchRanks();
    } catch (error) {
      console.error('Lỗi khi xóa hạng:', error);
      const message = error.response?.data?.message || 'Lỗi khi xóa hạng!';
      showToast('error', message);
    }
  }
};

// Statistics functions
const fetchRankStatistics = async () => {
  statsLoading.value = true;
  try {
    const response = await getRankStatistics();
    if (response.status === 200) {
      statsData.value = response.data;
    } else {
      throw new Error('Failed to fetch rank statistics');
    }
  } catch (error) {
    console.error('Error fetching rank statistics:', error);
    
    // Fallback data để tránh lỗi hiển thị
    statsData.value = {
      rankUserCounts: [
        { rankName: "Bronze", userCount: 800, minSpent: 0.00 },
        { rankName: "Silver", userCount: 300, minSpent: 1000000.00 },
        { rankName: "Gold", userCount: 150, minSpent: 5000000.00 }
      ],
      averagePointsByRank: [
        { rankName: "Bronze", averagePoints: 2500.50, minSpent: 0.00 },
        { rankName: "Silver", averagePoints: 8500.75, minSpent: 1000000.00 },
        { rankName: "Gold", averagePoints: 15000.25, minSpent: 5000000.00 }
      ],
      monthlyGrowthRates: [
        { 
          rankName: "Silver", 
          currentMonthUsers: 320, 
          previousMonthUsers: 300, 
          growthRate: 6.67 
        },
        { 
          rankName: "Gold", 
          currentMonthUsers: 155, 
          previousMonthUsers: 150, 
          growthRate: 3.33 
        }
      ]
    };
    
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải dữ liệu thống kê xếp hạng - Hiển thị dữ liệu mẫu',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    });
  } finally {
    statsLoading.value = false;
  }
};

const getTotalRanks = () => {
  if (statsData.value?.rankUserCounts) {
    return statsData.value.rankUserCounts.length;
  }
  return 0;
};

const getMostPopularRank = () => {
  if (statsData.value?.rankUserCounts && statsData.value.rankUserCounts.length > 0) {
    return statsData.value.rankUserCounts.reduce((prev, current) => 
      (prev.userCount > current.userCount) ? prev : current
    );
  }
  return { rankName: '', userCount: 0 };
};

const getHighestPointsRank = () => {
  if (statsData.value?.averagePointsByRank && statsData.value.averagePointsByRank.length > 0) {
    return statsData.value.averagePointsByRank.reduce((prev, current) => 
      (prev.averagePoints > current.averagePoints) ? prev : current
    );
  }
  return { rankName: '', averagePoints: 0 };
};

const getFastestGrowingRank = () => {
  if (statsData.value?.monthlyGrowthRates && statsData.value.monthlyGrowthRates.length > 0) {
    return statsData.value.monthlyGrowthRates.reduce((prev, current) => 
      (prev.growthRate > current.growthRate) ? prev : current
    );
  }
  return { rankName: '', growthRate: 0 };
};

// Lifecycle
onMounted(() => {
  fetchRanks();
  fetchRankStatistics();
});
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
  width: 60px;
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

/* Enhanced Modal Styles */
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

.gradient-header .modal-title {
  font-weight: 600;
  color: #2c2c54;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
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

/* Status Styles */
.status-active {
  background: #d4edda;
  color: #218838;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 0.9rem;
  border: 1px solid #c3e6cb;
}

.status-inactive {
  background: #f8d7da;
  color: #721c24;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 0.9rem;
  border: 1px solid #f5c6cb;
}

.modal-backdrop {
  z-index: 1040;
}

.modal {
  z-index: 1050;
}

/* Form text */
.form-text {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
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

/* Disabled input styling */
.disabled-input {
  background-color: #f8f9fa !important;
  color: #6c757d !important;
  border-color: #dee2e6 !important;
  cursor: not-allowed !important;
}

.disabled-input:focus {
  background-color: #f8f9fa !important;
  border-color: #dee2e6 !important;
  box-shadow: none !important;
}

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

/* Rank Statistics Cards Styling */
.ranks-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.popular-rank-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.highest-points-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.growing-rank-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

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

.stat-value.small-text {
  font-size: 1rem;
  font-weight: 600;
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
</style>
