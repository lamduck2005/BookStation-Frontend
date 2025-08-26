<template>
  <div class="container-fluid py-4">
    <!-- Supplier Statistics Section -->
    <div class="mb-4">
      <!-- Statistics Cards -->
      <div v-if="statsLoading" class="row g-3">
        <div v-for="i in 2" :key="i" class="col-6">
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
        <!-- Total Suppliers Card -->
        <div class="col-6">
          <div class="card stats-card suppliers-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper suppliers-icon">
                  <i class="bi bi-truck"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value stat-value-gradient text-gradient-info">{{ getTotalSuppliers() }}</div>
                  <div class="stat-label">Nhà cung cấp</div>
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

        <!-- Total Books Card -->
        <div class="col-6">
          <div class="card stats-card books-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper books-icon">
                  <i class="bi bi-boxes"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value stat-value-gradient text-gradient-purple">{{ getTotalBooks() }}</div>
                  <div class="stat-label">Tổng đầu sách</div>
                </div>
              </div>
              <div class="stat-footer">
                <small class="text-info">
                  Từ tất cả NCC
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
          <div class="card-header bg-light border-0">
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
                Tên nhà cung cấp
              </label>
              <input 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Nhập tên nhà cung cấp" 
                v-model="searchQuery"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-person me-1"></i>
                Tên liên hệ
              </label>
              <input 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Nhập tên liên hệ" 
                v-model="contactName"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-envelope me-1"></i>
                Email
              </label>
              <input 
                type="email" 
                class="form-control form-control-sm" 
                placeholder="Nhập email" 
                v-model="email"
              />
            </div>

            <!-- Đã xóa bộ lọc địa chỉ -->

            <!-- <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-toggle-on me-1"></i>
                Trạng thái
              </label>
              <select class="form-select form-select-sm" v-model="selectedStatus" @change="applyFilters">
                <option value="">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Không hoạt động</option>
              </select>
            </div> -->
            
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
        <!-- Danh sách Supplier -->
        <div class="card shadow-lg border-0 mb-4 admin-table-card">
          <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
            <div>
              <h5 class="mb-0 text-secondary">
                <i class="bi bi-truck me-2"></i>
                Danh sách nhà cung cấp
              </h5>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-info btn-sm py-2" @click="fetchSuppliers" :disabled="loading">
                <i class="bi bi-arrow-repeat me-1"></i> Làm mới
              </button>
              
              <!-- Nút Export Excel -->
              <ExcelExportButton 
                data-type="suppliers"
                button-text="Xuất Excel"
              />
              
              <button
                class="btn btn-success btn-sm"
                @click="openAddModal"
              >
                <i class="bi bi-plus-circle me-2"></i> Thêm mới
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
            
            <!-- Data table -->
            <div>
              <div class="table-responsive">
                <table class="table align-middle table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th style="min-width: 50px;">STT</th>
                      <th style="min-width: 120px;">Thao tác</th>
                      <th style="min-width: 200px;">Tên nhà cung cấp</th>
                      <th style="min-width: 150px;">Tên liên hệ</th>
                      <th style="min-width: 150px;">Email</th>
                      <th style="min-width: 120px;">Số điện thoại</th>
                      <th style="min-width: 200px;">Địa chỉ</th>
                      <!-- <th style="min-width: 100px;">Trạng thái</th> -->
                      <th style="min-width: 150px;">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(supplier, index) in suppliers" :key="supplier.id">
                      <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                      <td>
                        <div class="d-flex gap-2">
                           <EditButton  @click="openEditModal(supplier, index)" />
                        </div>
                      </td>
                      <td>
                        <strong>{{ supplier.supplierName }}</strong>
                      </td>
                      <td>{{ supplier.contactName }}</td>
                      <td>{{ supplier.email }}</td>
                      <td>{{ supplier.phoneNumber }}</td>
                      <td>{{ supplier.address }}</td>
                      <!-- <td>
                        <span :class="['badge', supplier.status == 1 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']">
                          {{ supplier.status == 1 ? 'Hoạt động' : 'Không hoạt động' }}
                        </span>
                      </td> -->
                      <td>
                        <div class="small">
                          {{ formatDate(supplier.createdAt) }}
                        </div>
                      </td>
                    </tr>
                    <tr v-if="suppliers.length === 0">
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

  <!-- Add/Edit Supplier Modal -->
  <div
    class="modal fade"
    id="supplierModal"
    tabindex="-1"
    aria-labelledby="supplierModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" style="max-width: 600px">
      <div class="modal-content">
        <div class="modal-header form-modal-header">
          <h5 class="modal-title" id="supplierModalLabel">
            <i
              class="bi me-2"
              :class="isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'"
            ></i>
            {{ isEditMode ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp" }}
          </h5>
          <button
            type="button"
            class="custom-close-btn"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="bx bx-x-circle"></i>
          </button>
        </div>
        <div class="modal-body form-modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label"
                  >Tên nhà cung cấp <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.supplierName"
                  required
                  placeholder="Nhập tên nhà cung cấp (tối đa 100 ký tự)"
                  maxlength="100"
                />
              </div>
              <div class="col-12">
                <label class="form-label">Tên người liên hệ <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.contactName"
                  required
                  placeholder="Nhập tên người liên hệ (tối đa 100 ký tự)"
                  maxlength="100"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Email <span class="text-danger">*</span></label>
                <input
                  type="email"
                  class="form-control"
                  v-model="formData.email"
                  required
                  placeholder="Nhập email (tối đa 100 ký tự)"
                  maxlength="100"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.phoneNumber"
                  required
                  placeholder="Nhập số điện thoại (10 số, bắt đầu bằng 0)"
                  maxlength="10"
                  pattern="^0\d{9}$"
                />
              </div>
              <div class="col-12">
                <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
                <textarea
                  class="form-control"
                  v-model="formData.address"
                  required
                  placeholder="Nhập địa chỉ chi tiết"
                  rows="3"
                  maxlength="500"
                ></textarea>
              </div>
              <!-- <div class="col-12">
                <label class="form-label"
                  >Trạng thái <span class="text-danger">*</span></label
                >
                <select class="form-select" v-model="formData.status" required>
                  <option value="">Chọn trạng thái</option>
                  <option value="1">Hoạt động</option>
                  <option value="0">Không hoạt động</option>
                </select>
              </div> -->
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <div class="ms-auto">
            <button
              type="button"
              class="btn form-btn-secondary"
              data-bs-dismiss="modal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn form-btn-primary"
              @click="handleSubmit"
              :disabled="!isFormValid"
            >
              {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Modal } from 'bootstrap';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '@/services/admin/supplier.js';
import { showToast, showQuickConfirm } from '@/utils/swalHelper';
import { debounce } from '@/utils/utils';
import { validate } from '@/utils/validation';

// Components
import AddButton from '@/components/common/AddButton.vue';
import EditButton from '@/components/common/EditButton.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
import ToggleStatus from '@/components/common/ToggleStatus.vue';
import Pagination from '@/components/common/Pagination.vue';

// Statistics API
import { getSupplierStatistics, formatNumber, formatCurrency } from '@/services/admin/moduleStatistics';
import Swal from 'sweetalert2';
import ExcelExportButton from '@/components/common/ExcelExportButton.vue';

// Reactive data
const suppliers = ref([]);
const searchQuery = ref('');
const contactName = ref('');
const email = ref('');
// const address = ref('');
// const selectedStatus = ref('');
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
const isEditMode = ref(false);
const editingIndex = ref(-1);
const formData = ref({
  id: null,
  supplierName: '',
  contactName: '',
  phoneNumber: '',
  email: '',
  address: '',
  createdBy: 'admin',
  updatedBy: 'admin'
});

// Computed property để kiểm tra form hợp lệ
const isFormValid = computed(() => {
  return formData.value.supplierName?.trim() &&
         formData.value.contactName?.trim() &&
         formData.value.email?.trim() &&
         formData.value.phoneNumber?.trim() &&
         formData.value.address?.trim();
});

// UI functions
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

// Đã xóa debounce logic

// Methods
const fetchSuppliers = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      size: pageSize.value,
    };
    
    if (searchQuery.value) {
      params.supplierName = searchQuery.value;
    }
    
    if (contactName.value) {
      params.contactName = contactName.value;
    }
    
    if (email.value) {
      params.email = email.value;
    }
    
    const response = await getSuppliers(params);
    const data = response || {};
    
    suppliers.value = data.content || [];
    totalPages.value = data.totalPages || 1;
    totalElements.value = data.totalElements || 0;
    isLastPage.value = data.last || (currentPage.value >= totalPages.value - 1);
    // Keep current page as is, don't update from backend
    // currentPage.value = data.number || 0;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách suppliers:', error);
    showToast('error', 'Lỗi khi tải danh sách nhà cung cấp!');
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  currentPage.value = 0;
  fetchSuppliers();
};

const clearFilters = () => {
  searchQuery.value = '';
  contactName.value = '';
  email.value = '';
  currentPage.value = 0;
  fetchSuppliers();
};

const handlePrev = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchSuppliers();
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    currentPage.value++;
    fetchSuppliers();
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 0;
  fetchSuppliers();
};

const openAddModal = () => {
  isEditMode.value = false;
  editingIndex.value = -1;
  formData.value = {
    id: null,
    supplierName: '',
    contactName: '',
    phoneNumber: '',
    email: '',
    address: '',
    createdBy: 'admin',
    updatedBy: 'admin'
  };
  showSupplierModal();
};

const openEditModal = (supplier, index) => {
  isEditMode.value = true;
  editingIndex.value = index;
  formData.value = {
    id: supplier.id,
    supplierName: supplier.supplierName,
    contactName: supplier.contactName,
    phoneNumber: supplier.phoneNumber,
    email: supplier.email,
    address: supplier.address,
    createdBy: supplier.createdBy,
    updatedBy: 'admin'
  };
  showSupplierModal();
};

const showSupplierModal = () => {
  const el = document.getElementById('supplierModal');
  const modal = Modal.getOrCreateInstance(el);
  modal.show();
};

const validateForm = () => {
  // Validate tên nhà cung cấp
  const supplierNameError = validate.supplier.supplierName(formData.value.supplierName);
  if (supplierNameError) {
    showToast('error', supplierNameError);
    return false;
  }

  // Validate tên liên hệ
  const contactNameError = validate.supplier.contactName(formData.value.contactName);
  if (contactNameError) {
    showToast('error', contactNameError);
    return false;
  }

  // Validate email
  const emailError = validate.supplier.email(formData.value.email);
  if (emailError) {
    showToast('error', emailError);
    return false;
  }

  // Validate số điện thoại
  const phoneError = validate.supplier.phoneNumber(formData.value.phoneNumber);
  if (phoneError) {
    showToast('error', phoneError);
    return false;
  }

  // Validate địa chỉ
  const addressError = validate.supplier.address(formData.value.address);
  if (addressError) {
    showToast('error', addressError);
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  // Validation
  if (!validateForm()) {
    return;
  }

  try {
    const submitData = {
      ...formData.value,
      status: 1 // Mặc định là hoạt động
    };
    
    if (isEditMode.value) {
      await updateSupplier(submitData);
      showToast('success', 'Cập nhật nhà cung cấp thành công!');
    } else {
      await createSupplier(submitData);
      showToast('success', 'Thêm nhà cung cấp thành công!');
    }
    
    Modal.getOrCreateInstance(document.getElementById('supplierModal')).hide();
    fetchSuppliers();
  } catch (error) {
    console.error('Lỗi khi xử lý supplier:', error);
    const message = error.response?.data?.message || 'Có lỗi xảy ra!';
    showToast('error', message);
  }
};

// const handleStatusChange = async (supplier, newStatus) => {
//   try {
//     await updateSupplierStatus(supplier.id, newStatus, 'admin');
//     showToast('success', 'Cập nhật trạng thái thành công!', 2000);
//     fetchSuppliers();
//   } catch (error) {
//     console.error('Lỗi khi cập nhật trạng thái:', error);
//     const message = error.response?.data?.message || 'Lỗi khi cập nhật trạng thái!';
//     showToast('error', message, 3000);
//   }
// };

const handleDelete = async (supplier) => {
  const result = await showQuickConfirm(
    'Xác nhận xóa',
    `Bạn có chắc chắn muốn xóa nhà cung cấp "${supplier.supplierName}"?`,
    'warning',
    'Xóa',
    'Hủy'
  );
  
  if (result.isConfirmed) {
    try {
      await deleteSupplier(supplier.id);
      showToast('success', 'Xóa nhà cung cấp thành công!');
      fetchSuppliers();
    } catch (error) {
      console.error('Lỗi khi xóa supplier:', error);
      const message = error.response?.data?.message || 'Lỗi khi xóa nhà cung cấp!';
      showToast('error', message);
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

// Removed fillFakeData function

// Statistics functions
const fetchSupplierStatistics = async () => {
  statsLoading.value = true;
  try {
    const response = await getSupplierStatistics();
    if (response.status === 200) {
      statsData.value = response.data;
    } else {
      throw new Error('Failed to fetch supplier statistics');
    }
  } catch (error) {
    console.error('Error fetching supplier statistics:', error);
    
    // Fallback data để tránh lỗi hiển thị
    statsData.value = {
      bookStatistics: [
        { supplierName: "Công ty ABC", totalBooks: 800 },
        { supplierName: "Công ty XYZ", totalBooks: 650 },
        { supplierName: "Công ty DEF", totalBooks: 720 }
      ]
    };
    
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải dữ liệu thống kê nhà cung cấp - Hiển thị dữ liệu mẫu',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    });
  } finally {
    statsLoading.value = false;
  }
};

const getTotalSuppliers = () => {
  if (statsData.value?.bookStatistics) {
    return statsData.value.bookStatistics.length;
  }
  return 0;
};

const getTotalBooks = () => {
  if (statsData.value?.bookStatistics) {
    return statsData.value.bookStatistics.reduce((total, supplier) => total + (supplier.totalBooks || 0), 0);
  }
  return 0;
};

// Lifecycle
onMounted(() => {
  fetchSuppliers();
  fetchSupplierStatistics();
});
</script>


<style scoped>
@import "@/assets/css/admin-table-responsive.css";
@import '@/assets/css/admin-global.css';
@import '@/assets/css/form-global.css';
@import '@/assets/css/gradient-stats.css';

/* Filter Sidebar - Thu sang trái */
.filter-sidebar {
  /* padding: 0; */
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

.filter-card {
  height: fit-content;
  position: sticky;
  top: 20px;
}

.admin-table-card {
  background: white;
  border: 1px solid #e3e6f0;
  border-radius: 0.35rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
}

.admin-table-card .card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: 1px solid #e3e6f0;
  padding: 1rem 1.25rem;
}

.admin-table-card .card-header h5 {
  color: white;
  font-weight: 700;
  margin: 0;
}

.admin-table-card .card-body {
  padding: 0;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 0 0 0.35rem 0.35rem;
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
  transition: all 0.3s ease;
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

/* Enhanced Modal Styles */
.modal-dialog {
  max-width: 600px !important;
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

/* Removed fake data button styling */

.modal-footer {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}

.modal-footer .ms-auto {
  display: flex;
  gap: 0.5rem;
}

/* Statistics Cards Styling */
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

.suppliers-icon { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
}

.books-icon { 
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
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
