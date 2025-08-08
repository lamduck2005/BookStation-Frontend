<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Quản trị viên / <strong>Xếp hạng</strong>
      </h6>
    </div>
    
    <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-4">
          <label class="form-label">Tìm kiếm:</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập tên rank" 
            v-model="searchQuery" 
            @input="debouncedSearch"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus" @change="applyFilters">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Không hoạt động</option>
          </select>
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <button type="button" class="btn btn-secondary me-2" @click="clearFilters">
            <i class="bi bi-arrow-clockwise me-1"></i>
            Xóa bộ lọc
          </button>
          <button type="button" class="btn btn-primary" @click="applyFilters">
            <i class="bi bi-search me-1"></i>
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>

    <!-- Nút thêm mới -->
    <div class="d-flex justify-content-end mb-3">
      <AddButton @click="openAddModal" />
    </div>

    <!-- Danh sách Rank -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách Rank</strong>
      </div>

      <div class="p-3">
        <div class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th style="min-width: 50px;">STT</th>
                <th style="min-width: 200px;">Tên Rank</th>
                <th style="min-width: 150px;">Mức chi tiêu tối thiểu</th>
                <th style="min-width: 150px;">Hệ số điểm</th>
                <th style="min-width: 100px;">Trạng thái</th>
                <th style="min-width: 120px;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rank, index) in ranks" :key="rank.id">
                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                <td>
                  <router-link 
                    :to="{ name: 'Chi tiết hạng', params: { id: rank.id }, query: { name: rank.name } }"
                    class="text-decoration-none fw-bold text-primary"
                  >
                    {{ rank.name }}
                  </router-link>
                </td>
                <td>{{ formatCurrency(rank.minSpent) }}</td>
                <td>{{ rank.pointMultiplier }}x</td>
                <td>
                  <StatusLabel 
                    :status="rank.status"
                    :status-text="rank.status == 1 ? 'Hoạt động' : 'Không hoạt động'"
                    :status-class="rank.status == 1 ? 'status-active' : 'status-inactive'"
                  />
                </td>
                <td>
                  <div class="d-flex gap-2">
                    <EditButton @click="openEditModal(rank, index)" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
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

  <!-- Add/Edit Rank Modal -->
  <div class="modal fade" :class="{ show: showModal }" tabindex="-1" style="display: block;" v-if="showModal">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content enhanced-modal">
        <div class="modal-header gradient-header">
          <h5 class="modal-title">
            <i class="bi me-2" :class="isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
            {{ isEditMode ? 'Sửa Rank' : 'Thêm Rank' }}
          </h5>
          <button type="button" class="custom-close-btn" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body enhanced-body">
          <form @submit.prevent="handleSubmit">
            <!-- Section 1: Thông tin cơ bản -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-award section-icon"></i>
                <h6 class="section-title">Thông tin Rank</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Tên Rank <span class="text-danger">*</span></label>
                  <select 
                    class="form-select enhanced-input" 
                    v-model="formData.rankName"
                    required
                    :disabled="isEditMode"
                  >
                    <option value="">Chọn loại rank</option>
                    <option value="Vàng">Vàng</option>
                    <option value="Bạc">Bạc</option>
                    <option value="Kim cương">Kim cương</option>
                  </select>
                  <div class="form-text">Chỉ được phép tạo 3 loại rank: Vàng, Bạc, Kim cương</div>
                </div>
                <!-- Trường trạng thái chỉ hiển thị khi thêm mới, không cho sửa trạng thái -->
                <div v-if="!isEditMode" class="col-md-6">
                  <label class="form-label enhanced-label">Trạng thái <span class="text-danger">*</span></label>
                  <select class="form-select enhanced-input" v-model="formData.status" required>
                    <option value="">Chọn trạng thái</option>
                    <option value="1">Hoạt động</option>
                    <option value="0">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Section 2: Điều kiện và hệ số -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-calculator section-icon"></i>
                <h6 class="section-title">Điều kiện và Hệ số</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Mức chi tiêu tối thiểu <span class="text-danger">*</span></label>
                  <input 
                    type="number" 
                    class="form-control enhanced-input" 
                    v-model="formData.minSpent"
                    placeholder="Nhập mức chi tiêu tối thiểu"
                    required
                    min="0"
                    step="1000"
                  />
                  <div class="form-text">Số tiền khách hàng cần chi tiêu để đạt rank này</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Hệ số điểm <span class="text-danger">*</span></label>
                  <input 
                    type="number" 
                    class="form-control enhanced-input" 
                    v-model="formData.pointMultiplier"
                    placeholder="Nhập hệ số điểm"
                    required
                    min="1"
                    max="5"
                    step="0.1"
                  />
                  <div class="form-text">Hệ số nhân điểm khi khách hàng mua hàng (1.0 - 5.0)</div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer enhanced-footer">
          <button type="button" class="btn btn-secondary btn-cancel" @click="closeModal">
            <i class="bi bi-x-circle me-1"></i>
            Hủy
          </button>
          <button type="button" class="btn btn-primary btn-submit" @click="handleSubmit">
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

// Reactive data
const ranks = ref([]);
const searchQuery = ref('');
const selectedStatus = ref('');
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);
const loading = ref(false);

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

// Computed
const debouncedSearch = computed(() => debounce(() => {
  currentPage.value = 0;
  fetchRanks();
}, 500));

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
    
    if (selectedStatus.value !== '') {
      params.status = selectedStatus.value;
    }
    
    const response = await getRanks(params);
    const data = response.data || {};
    
    ranks.value = data.content || [];
    totalPages.value = data.totalPages || 0;
    totalElements.value = data.totalElements || 0;
    isLastPage.value = data.last || false;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách ranks:', error);
    showToast('error', 'Lỗi khi tải danh sách rank!', 2000);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  currentPage.value = 0;
  fetchRanks();
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  currentPage.value = 0;
  fetchRanks();
};

const handlePrev = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchRanks();
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    currentPage.value++;
    fetchRanks();
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 0;
  fetchRanks();
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
      status: Number(formData.value.status)
    };
    
    if (isEditMode.value) {
      await updateRank(submitData);
      showToast('success', 'Cập nhật rank thành công!', 2000);
    } else {
      await createRank(submitData);
      showToast('success', 'Thêm rank thành công!', 2000);
    }
    
    closeModal();
    fetchRanks();
  } catch (error) {
    console.error('Lỗi khi xử lý rank:', error);
    const message = error.response?.data?.message || 'Có lỗi xảy ra!';
    showToast('error', message, 3000);
  }
};

const handleDelete = async (rank) => {
  const result = await showQuickConfirm(
    'Xác nhận xóa',
    `Bạn có chắc chắn muốn xóa rank "${rank.name}"?`,
    'warning',
    'Xóa',
    'Hủy'
  );
  
  if (result.isConfirmed) {
    try {
      await deleteRank(rank.id);
      showToast('success', 'Xóa rank thành công!', 2000);
      fetchRanks();
    } catch (error) {
      console.error('Lỗi khi xóa rank:', error);
      const message = error.response?.data?.message || 'Lỗi khi xóa rank!';
      showToast('error', message, 3000);
    }
  }
};

// Lifecycle
onMounted(() => {
  fetchRanks();
});
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.text-primary {
  color: #0d6efd !important;
}

.text-primary:hover {
  color: #0b5ed7 !important;
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
