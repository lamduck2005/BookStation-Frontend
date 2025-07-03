<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Supplier</strong>
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
          <label class="form-label">Tên nhà cung cấp:</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập tên nhà cung cấp" 
            v-model="searchQuery" 
            @input="debouncedSearch"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">Tên liên hệ:</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập tên liên hệ" 
            v-model="contactName" 
            @input="debouncedSearch"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">Email:</label>
          <input 
            type="email" 
            class="form-control" 
            placeholder="Nhập email" 
            v-model="email" 
            @input="debouncedSearch"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus" @change="applyFilters">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Không hoạt động</option>
          </select>
        </div>
      </div>
      <div class="row g-3 m-2 mt-2 p-0">
        <div class="col-md-6">
          <label class="form-label">Địa chỉ:</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập địa chỉ" 
            v-model="address" 
            @input="debouncedSearch"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="col-md-6 d-flex align-items-end">
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

    <!-- Danh sách Supplier -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách Nhà cung cấp</strong>
      </div>

      <div class="p-3">
        <div class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th style="min-width: 50px;">STT</th>
                <th style="min-width: 200px;">Tên nhà cung cấp</th>
                <th style="min-width: 150px;">Người liên hệ</th>
                <th style="min-width: 150px;">Email</th>
                <th style="min-width: 120px;">Số điện thoại</th>
                <th style="min-width: 120px;">Địa chỉ</th>
                <th style="min-width: 100px;">Trạng thái</th>
                <th style="min-width: 120px;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(supplier, index) in suppliers" :key="supplier.id">
                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                <td>
                  <div>
                    <strong>{{ supplier.supplierName }}</strong>
                  </div>
                </td>
                <td>
                  <div>
                    <div>{{ supplier.contactName }}</div>
                  </div>
                </td>
                <td>{{ supplier.email }}</td>
                <td>{{ supplier.phoneNumber }}</td>
                <td>{{ supplier.address }}</td>
                <td>
                  <ToggleStatus 
                    :id="supplier.id"
                    :model-value="Number(supplier.status)"
                    :true-value="1"
                    :false-value="0"
                    active-text="Hoạt động"
                    inactive-text="Không hoạt động"
                    @change="handleStatusChange(supplier, $event)"
                  />
                </td>
                <td>
                  <div class="d-flex gap-2">
                    <EditButton @click="openEditModal(supplier, index)" />
                    <DeleteButton @click="handleDelete(supplier)" />
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

  <!-- Add/Edit Supplier Modal -->
  <div class="modal fade" :class="{ show: showModal }" tabindex="-1" style="display: block;" v-if="showModal">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content enhanced-modal">
        <div class="modal-header gradient-header">
          <h5 class="modal-title">
            <i class="bi me-2" :class="isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
            {{ isEditMode ? 'Sửa Nhà cung cấp' : 'Thêm Nhà cung cấp' }}
          </h5>
          <button type="button" class="custom-close-btn" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body enhanced-body">
          <!-- Nút Fake Data ở đầu modal body -->
          <div v-if="!isEditMode" class="mb-3 text-end">
            <button 
              type="button" 
              class="btn btn-outline-warning btn-sm rounded-pill fake-data-btn"
              @click="fillFakeData"
              title="Điền dữ liệu mẫu để test nhanh"
            >
              🎲 Fake Data (Test)
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit">
            <!-- Section 1: Thông tin cơ bản -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-info-circle section-icon"></i>
                <h6 class="section-title">Thông tin cơ bản</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Tên nhà cung cấp <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control enhanced-input" 
                    v-model="formData.supplierName"
                    placeholder="Nhập tên nhà cung cấp"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Tên người liên hệ <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control enhanced-input" 
                    v-model="formData.contactName"
                    placeholder="Nhập tên người liên hệ"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Số điện thoại <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control enhanced-input" 
                    v-model="formData.phoneNumber"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Email <span class="text-danger">*</span></label>
                  <input 
                    type="email" 
                    class="form-control enhanced-input" 
                    v-model="formData.email"
                    placeholder="Nhập email"
                    required
                  />
                </div>
                <div class="col-md-12">
                  <label class="form-label enhanced-label">Địa chỉ <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control enhanced-input" 
                    v-model="formData.address"
                    placeholder="Nhập địa chỉ"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Trạng thái <span class="text-danger">*</span></label>
                  <select class="form-select enhanced-input" v-model="formData.status" required>
                    <option value="">Chọn trạng thái</option>
                    <option value="1">Hoạt động</option>
                    <option value="0">Không hoạt động</option>
                  </select>
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
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, updateSupplierStatus } from '@/services/admin/supplier.js';
import { showToast, showQuickConfirm } from '@/utils/swalHelper';
import { debounce } from '@/utils/utils';

// Components
import AddButton from '@/components/common/AddButton.vue';
import EditButton from '@/components/common/EditButton.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
import ToggleStatus from '@/components/common/ToggleStatus.vue';
import Pagination from '@/components/common/Pagination.vue';

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

// Modal
const showModal = ref(false);
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

// Computed
const debouncedSearch = computed(() => debounce(() => {
  currentPage.value = 0;
  fetchSuppliers();
}, 500));

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
  showModal.value = true;
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
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
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
    
    closeModal();
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
.table th,
.table td {
  vertical-align: middle;
}

.custom-close-btn {
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease-in-out;
  background: transparent;
  border: none;
  box-shadow: none;
  outline: none;
  color: #2c2c54;
  font-size: 1.2rem;
}

.custom-close-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.modal-backdrop {
  z-index: 1040;
}

.modal {
  z-index: 1050;
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
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c2c54;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.enhanced-label {
  font-weight: 500;
  color: #2c2c54;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.enhanced-input {
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: #fff;
}

.enhanced-input:focus {
  border-color: #ecae9e;
  box-shadow: 0 0 0 0.2rem rgba(236, 174, 158, 0.25);
  outline: none;
}

.enhanced-input:hover {
  border-color: #d0d7de;
}

.btn-cancel {
  background: #6c757d;
  border-color: #6c757d;
  color: white;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #5a6268;
  border-color: #5a6268;
  transform: translateY(-1px);
}

.btn-submit {
  background: #ecae9e;
  border-color: #ecae9e;
  color: white;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-submit:hover {
  background: #d49489;
  border-color: #d49489;
  transform: translateY(-1px);
}

.fake-data-btn {
  background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%);
  border: none;
  color: #2c2c54;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(254, 202, 87, 0.3);
}

.fake-data-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(254, 202, 87, 0.4);
  background: linear-gradient(135deg, #ff9ff3 0%, #feca57 100%);
}

.fake-data-btn:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .enhanced-modal {
    border-radius: 0;
    margin: 0;
    height: 100vh;
  }
  
  .gradient-header {
    border-radius: 0;
  }
  
  .enhanced-footer {
    border-radius: 0;
  }
  
  .form-section {
    margin-bottom: 1rem;
    padding: 1rem;
  }
  
  .section-header {
    margin-bottom: 0.75rem;
  }
  
  .enhanced-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
</style>
