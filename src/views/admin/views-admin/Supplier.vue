<template>
  <div class="container-fluid py-4">
    <!-- Supplier Statistics Section -->
    <div class="mb-4">
      <SupplierStatisticsCards />
    </div>

    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Quản lý nhà cung cấp</strong>
      </h6>
    </div>

    <!-- Layout 2 cột: Bộ lọc bên trái, Bảng bên phải -->
    <div class="row">
      <!-- Cột bộ lọc (bên trái) -->
      <div class="col-lg-2 col-xl-2">
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
                <i :class="showFilter ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
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
                @input="debouncedSearch"
                @keyup.enter="applyFilters"
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
                @input="debouncedSearch"
                @keyup.enter="applyFilters"
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
                @input="debouncedSearch"
                @keyup.enter="applyFilters"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-geo-alt me-1"></i>
                Địa chỉ
              </label>
              <input 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Nhập địa chỉ" 
                v-model="address" 
                @input="debouncedSearch"
                @keyup.enter="applyFilters"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-toggle-on me-1"></i>
                Trạng thái
              </label>
              <select class="form-select form-select-sm" v-model="selectedStatus" @change="applyFilters">
                <option value="">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Không hoạt động</option>
              </select>
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
      <div class="col-lg-10 col-xl-10">
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
                      <th style="min-width: 100px;">Trạng thái</th>
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
                      <td>
                        <span :class="['badge', supplier.status == 1 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']">
                          {{ supplier.status == 1 ? 'Hoạt động' : 'Không hoạt động' }}
                        </span>
                      </td>
                      <td>
                        <div class="small">
                          {{ formatDate(supplier.createdAt) }}
                        </div>
                      </td>
                    </tr>
                    <tr v-if="suppliers.length === 0">
                      <td colspan="9" class="text-center text-muted">
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
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #ecae9e">
          <h5 class="modal-title" id="supplierModalLabel">
            <i
              class="bi me-2"
              :class="isEditMode ? 'bi-pencil' : 'bi-plus-circle'"
            ></i>
            {{ isEditMode ? "Sửa Nhà cung cấp" : "Thêm Nhà cung cấp" }}
          </h5>
          <button
            type="button"
            class="custom-close-btn"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/694/694604.png"
              alt="Close"
            />
          </button>
        </div>
        <div class="modal-body">
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
                />
              </div>
              <div class="col-12">
                <label class="form-label"
                  >Tên người liên hệ <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.contactName"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label"
                  >Email <span class="text-danger">*</span></label
                >
                <input
                  type="email"
                  class="form-control"
                  v-model="formData.email"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label"
                  >Số điện thoại <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.phoneNumber"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label"
                  >Địa chỉ <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.address"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label"
                  >Trạng thái <span class="text-danger">*</span></label
                >
                <select class="form-select" v-model="formData.status" required>
                  <option value="">Chọn trạng thái</option>
                  <option value="1">Hoạt động</option>
                  <option value="0">Không hoạt động</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-warning btn-sm rounded-pill fake-data-btn"
            @click="fillFakeData"
            v-if="!isEditMode"
            title="Điền dữ liệu mẫu để test nhanh"
          >
            <i class="bi bi-lightning me-1"></i> Dữ liệu mẫu
          </button>
          <div class="ms-auto">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleSubmit"
              style="background-color: #33304e; border-color: #33304e"
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
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, updateSupplierStatus } from '@/services/admin/supplier.js';
import { showToast, showQuickConfirm } from '@/utils/swalHelper';
import { debounce } from '@/utils/utils';

// Components
import AddButton from '@/components/common/AddButton.vue';
import EditButton from '@/components/common/EditButton.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
import ToggleStatus from '@/components/common/ToggleStatus.vue';
import Pagination from '@/components/common/Pagination.vue';
import SupplierStatisticsCards from '@/views/admin/components-admin/statistics/SupplierStatisticsCards.vue';

// Reactive data
const suppliers = ref([]);
const searchQuery = ref('');
const contactName = ref('');
const email = ref('');
const address = ref('');
const selectedStatus = ref('');
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);
const loading = ref(false);
const showFilter = ref(true);

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
  status: '',
  createdBy: 'admin',
  updatedBy: 'admin'
});

// UI functions
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

// Debounce search function
let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
};

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
    
    if (address.value) {
      params.address = address.value;
    }
    
    if (selectedStatus.value !== '') {
      params.status = selectedStatus.value;
    }
    
    const response = await getSuppliers(params);
    const data = response || {};
    
    suppliers.value = data.content || [];
    totalPages.value = data.totalPages || 0;
    totalElements.value = data.totalElements || 0;
    isLastPage.value = data.last || false;
    // Update current page from backend response
    currentPage.value = data.number || 0;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách suppliers:', error);
    showToast('error', 'Lỗi khi tải danh sách nhà cung cấp!', 2000);
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
  address.value = '';
  selectedStatus.value = '';
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
    status: '',
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
    status: supplier.status.toString(),
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

const handleSubmit = async () => {
  try {
    const submitData = {
      ...formData.value,
      status: Number(formData.value.status)
    };
    
    if (isEditMode.value) {
      await updateSupplier(submitData);
      showToast('success', 'Cập nhật nhà cung cấp thành công!', 2000);
    } else {
      await createSupplier(submitData);
      showToast('success', 'Thêm nhà cung cấp thành công!', 2000);
    }
    
    Modal.getOrCreateInstance(document.getElementById('supplierModal')).hide();
    fetchSuppliers();
  } catch (error) {
    console.error('Lỗi khi xử lý supplier:', error);
    const message = error.response?.data?.message || 'Có lỗi xảy ra!';
    showToast('error', message, 3000);
  }
};

const handleStatusChange = async (supplier, newStatus) => {
  try {
    await updateSupplierStatus(supplier.id, newStatus, 'admin');
    showToast('success', 'Cập nhật trạng thái thành công!', 2000);
    fetchSuppliers();
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    const message = error.response?.data?.message || 'Lỗi khi cập nhật trạng thái!';
    showToast('error', message, 3000);
  }
};

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
      showToast('success', 'Xóa nhà cung cấp thành công!', 2000);
      fetchSuppliers();
    } catch (error) {
      console.error('Lỗi khi xóa supplier:', error);
      const message = error.response?.data?.message || 'Lỗi khi xóa nhà cung cấp!';
      showToast('error', message, 3000);
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const fillFakeData = () => {
  console.log('=== DEBUG: fillFakeData called ===');
  
  // Generate unique name with timestamp
  const timestamp = Date.now();
  const supplierNames = [
    'NXB Kim Đồng',
    'NXB Trẻ',
    'NXB Văn học',
    'NXB Giáo dục',
    'Fahasa',
    'Vinabook',
    'Thái Hà Books',
    'Omega Plus',
    'Alphabooks',
    'Nhã Nam'
  ];
  
  const contactNames = [
    'Nguyễn Văn A',
    'Trần Thị B',
    'Lê Văn C',
    'Phạm Thị D',
    'Hoàng Văn E',
    'Ngô Thị F',
    'Vũ Văn G',
    'Đặng Thị H',
    'Bùi Văn I',
    'Lý Thị K'
  ];
  
  const addresses = [
    'Số 55 Quang Trung, Hai Bà Trưng, Hà Nội',
    '161B Lý Chính Thắng, Quận 3, TP.HCM',
    '18 Nguyễn Trường Tộ, Ba Đình, Hà Nội',
    '81 Trần Quốc Toản, Quận 3, TP.HCM',
    '60-62 Lê Lợi, Quận 1, TP.HCM',
    '32 Hàm Long, Hoàn Kiếm, Hà Nội',
    '91 Hai Bà Trưng, Quận 1, TP.HCM',
    '14 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    '25 Nguyễn Huệ, Quận 1, TP.HCM',
    '43 Hàng Bông, Hoàn Kiếm, Hà Nội'
  ];
  
  const phoneNumbers = [
    '0123456789',
    '0987654321',
    '0123456788',
    '0987654322',
    '0123456787',
    '0987654323',
    '0123456786',
    '0987654324',
    '0123456785',
    '0987654325'
  ];
  
  const emails = [
    'contact@kimdong.com.vn',
    'info@nxbtre.com.vn',
    'contact@vanhoc.vn',
    'info@giaoduc.vn',
    'contact@fahasa.com',
    'info@vinabook.com',
    'contact@thaihabooks.com',
    'info@omegaplus.vn',
    'contact@alphabooks.vn',
    'info@nhanam.vn'
  ];
  
  const randomIndex = Math.floor(Math.random() * supplierNames.length);
  
  formData.value = {
    ...formData.value,
    supplierName: `${supplierNames[randomIndex]} Test ${timestamp}`,
    contactName: contactNames[randomIndex],
    phoneNumber: phoneNumbers[randomIndex],
    email: emails[randomIndex],
    address: addresses[randomIndex],
    status: Math.random() > 0.5 ? '1' : '0'
  };
  
  console.log('=== DEBUG: fillFakeData completed ===');
  console.log('formData.value:', formData.value);
};

// Lifecycle
onMounted(() => {
  fetchSuppliers();
});
</script>


<style scoped>
@import "@/assets/css/admin-table-responsive.css";
@import '@/assets/css/admin-global.css';

.filter-card {
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

/* Fake data button styling */
.fake-data-btn {
  background-color: #fff3cd !important;
  border-color: #ffeaa7 !important;
  color: #856404 !important;
  font-weight: 500;
  transition: all 0.3s ease;
}

.fake-data-btn:hover {
  background-color: #ffeaa7 !important;
  border-color: #fdcb6e !important;
  color: #6c5ce7 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.fake-data-btn:active {
  transform: translateY(0);
}

.modal-footer {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}

.modal-footer .ms-auto {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 991.98px) {
  .filter-card {
    position: static;
    margin-bottom: 1rem;
  }
  
  .responsive-sidebar {
    margin-bottom: 1rem;
  }
}
</style>
