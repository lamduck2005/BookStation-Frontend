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
          <label class="form-label">Thành phố:</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập thành phố" 
            v-model="city" 
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
                <th style="min-width: 120px;">Thành phố</th>
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
                    <div class="text-muted small">{{ supplier.website }}</div>
                  </div>
                </td>
                <td>
                  <div>
                    <div>{{ supplier.contactName }}</div>
                    <div class="text-muted small">{{ supplier.contactTitle }}</div>
                  </div>
                </td>
                <td>{{ supplier.email }}</td>
                <td>{{ supplier.phone }}</td>
                <td>{{ supplier.city }}</td>
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
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #ecae9e;">
          <h5 class="modal-title">
            <i class="bi me-2" :class="isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
            {{ isEditMode ? 'Sửa Nhà cung cấp' : 'Thêm Nhà cung cấp' }}
          </h5>
          <button type="button" class="custom-close-btn" @click="closeModal" style="background: transparent; border: none; box-shadow: none; outline: none;">
            <img src="https://cdn-icons-png.flaticon.com/128/1828/1828666.png" alt="Close" style="width: 24px; height: 24px;" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Tên nhà cung cấp <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.supplierName"
                  placeholder="Nhập tên nhà cung cấp"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Tên người liên hệ</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.contactName"
                  placeholder="Nhập tên người liên hệ"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Chức vụ</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.contactTitle"
                  placeholder="Nhập chức vụ"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="formData.email"
                  placeholder="Nhập email"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số điện thoại</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.phone"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Website</label>
                <input 
                  type="url" 
                  class="form-control" 
                  v-model="formData.website"
                  placeholder="Nhập website"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Thành phố</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.city"
                  placeholder="Nhập thành phố"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Khu vực</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.region"
                  placeholder="Nhập khu vực"
                />
              </div>
              <div class="col-md-12">
                <label class="form-label">Địa chỉ</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.address"
                  placeholder="Nhập địa chỉ"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Trạng thái <span class="text-danger">*</span></label>
                <select class="form-select" v-model="formData.status" required>
                  <option value="">Chọn trạng thái</option>
                  <option value="1">Hoạt động</option>
                  <option value="0">Không hoạt động</option>
                </select>
              </div>
            </div>
            <div class="d-flex justify-content-end mt-3">
              <button type="button" class="btn btn-secondary me-2" @click="closeModal">Hủy</button>
              <button type="submit" class="btn btn-primary" :style="{ backgroundColor: '#33304e', borderColor: '#33304e' }">
                {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
              </button>
            </div>
          </form>
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
const city = ref('');
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
  contactTitle: '',
  address: '',
  city: '',
  region: '',
  phone: '',
  email: '',
  website: '',
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
    
    if (city.value) {
      params.city = city.value;
    }
    
    if (selectedStatus.value !== '') {
      params.status = selectedStatus.value;
    }
    
    const response = await getSuppliers(params);
    const data = response.data || {};
    
    suppliers.value = data.content || [];
    totalPages.value = data.totalPages || 0;
    totalElements.value = data.totalElements || 0;
    isLastPage.value = data.last || false;
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
  city.value = '';
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
    contactTitle: '',
    address: '',
    city: '',
    region: '',
    phone: '',
    email: '',
    website: '',
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
    contactTitle: supplier.contactTitle,
    address: supplier.address,
    city: supplier.city,
    region: supplier.region,
    phone: supplier.phone,
    email: supplier.email,
    website: supplier.website,
    status: supplier.status,
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
    contactTitle: '',
    address: '',
    city: '',
    region: '',
    phone: '',
    email: '',
    website: '',
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
</style>
