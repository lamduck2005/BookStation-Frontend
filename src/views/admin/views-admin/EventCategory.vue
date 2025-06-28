<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Event Category</strong>
      </h6>
    </div>
    
    <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-6">
          <label class="form-label">Tìm kiếm:</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập tên danh mục event" 
            v-model="searchQuery" 
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Nút thêm mới -->
    <div class="d-flex justify-content-end mb-3">
      <AddButton @click="openAddModal" />
    </div>

    <!-- Danh sách Event Category -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách Event Category</strong>
      </div>

      <div class="p-3">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên danh mục</th>
              <th>Mô tả</th>
              <th>Icon</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in categories" :key="category.id">
              <td>{{ (currentPage * pageSize) + index + 1 }}</td>
              <td>
                <strong>{{ category.name }}</strong>
              </td>
              <td>
                <div class="text-muted">{{ category.description || 'Không có mô tả' }}</div>
              </td>
              <td>
                <div v-if="category.iconUrl" class="text-center">
                  <img :src="category.iconUrl" alt="Icon" class="category-icon" />
                </div>
                <div v-else class="text-muted small">Không có icon</div>
              </td>
              <td>
                <StatusLabel 
                  :status="category.status" 
                  :statusText="category.status === 1 ? 'Hoạt động' : 'Không hoạt động'"
                  :statusClass="category.status === 1 ? 'status-active' : 'status-inactive'"
                />
              </td>
              <td>
                <div class="small">{{ formatDate(category.createdAt) }}</div>
              </td>
              <td>
                <div class="d-flex gap-2">
                  <EditButton @click="openEditModal(category, index)" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

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

  <!-- Add/Edit Event Category Modal -->
  <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #ecae9e;">
          <h5 class="modal-title" id="addCategoryModalLabel">
            {{ isEditMode ? 'Sửa Event Category' : 'Thêm Event Category' }}
          </h5>
          <button type="button" class="custom-close-btn" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmitCategory">
            <div class="mb-3">
              <label class="form-label">Tên danh mục <span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="newCategory.name"
                placeholder="Nhập tên danh mục event"
                required
              />
            </div>
            
            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <textarea 
                class="form-control" 
                rows="3"
                v-model="newCategory.description"
                placeholder="Nhập mô tả danh mục event"
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">URL Icon</label>
              <input 
                type="url" 
                class="form-control" 
                v-model="newCategory.iconUrl"
                placeholder="Nhập URL icon (tùy chọn)"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Trạng thái <span class="text-danger">*</span></label>
              <select class="form-select" v-model="newCategory.status" required>
                <option value="">Chọn trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Không hoạt động</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Hủy
          </button>
          <button type="button" class="btn btn-primary" @click="handleSubmitCategory">
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
import AddButton from '@/components/common/AddButton.vue';
import StatusLabel from '@/components/common/StatusLabel.vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Modal } from 'bootstrap';
import { getEventCategories, createEventCategory, updateEventCategory } from '@/services/admin/eventCategory';
import Swal from 'sweetalert2';

const searchQuery = ref('');
const selectedStatus = ref('');

// New/Edit category form data
const newCategory = ref({
  id: '',
  name: '',
  description: '',
  iconUrl: '',
  status: '1'
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

// Categories data
const categories = ref([]);

const fetchCategories = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
    };
    if (searchQuery.value) params.categoryName = searchQuery.value;
    if (selectedStatus.value !== '') params.isActive = selectedStatus.value === 'true';
    
    console.log('Fetching categories with params:', params);
    const response = await getEventCategories(params);
    console.log('Response from backend:', response);
    
    const data = response.data ? response.data : response;
    
    categories.value = data.content.map(item => ({
      id: item.id,
      name: item.categoryName || item.name,
      description: item.description || '',
      iconUrl: item.iconUrl || '',
      status: item.isActive !== undefined ? (item.isActive ? 1 : 0) : (item.status || 0),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    
    totalPages.value = data.totalPages ?? 1;
    totalElements.value = data.totalElements ?? categories.value.length;
    currentPage.value = data.pageNumber ?? currentPage.value;
    pageSize.value = data.pageSize ?? pageSize.value;
    isLastPage.value = data.last ?? (currentPage.value >= totalPages.value - 1);
    
    console.log('Processed categories:', categories.value);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách event categories:', error);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Lỗi khi tải danh sách danh mục event!',
      text: error?.response?.data?.message || 'Không thể kết nối đến server',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
};

// Watch filters and pagination
watch([searchQuery, selectedStatus, pageSize, currentPage], () => {
  fetchCategories();
});

// Format date function
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Modal functions
const openAddModal = () => {
  isEditMode.value = false;
  newCategory.value = {
    id: '',
    name: '',
    description: '',
    iconUrl: '',
    status: '1'
  };
  const modalElement = document.getElementById('addCategoryModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const openEditModal = (category, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  newCategory.value = {
    ...category,
    iconUrl: category.iconUrl || '',
    status: String(category.status)
  };
  const modalElement = document.getElementById('addCategoryModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const handleSubmitCategory = async () => {
  // Validate form
  if (!newCategory.value.name || newCategory.value.name.trim() === '') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Tên danh mục không được để trống!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
    return;
  }

  if (newCategory.value.status === '' || newCategory.value.status === null || newCategory.value.status === undefined) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Vui lòng chọn trạng thái!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
    return;
  }

  try {
    const payload = {
      name: newCategory.value.name.trim(),
      description: newCategory.value.description?.trim() || '',
      iconUrl: newCategory.value.iconUrl?.trim() || '',
      status: Number(newCategory.value.status)
    };

    console.log('Frontend payload:', payload);

    if (isEditMode.value) {
      await updateEventCategory(newCategory.value.id, payload);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Cập nhật danh mục event thành công!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    } else {
      await createEventCategory(payload);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Thêm danh mục event thành công!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    }

    await fetchCategories();
    closeModal();
  } catch (error) {
    console.error('Error in handleSubmitCategory:', error);
    
    let errorTitle = 'Thao tác thất bại!';
    let errorMessage = '';
    
    if (error?.response?.status) {
      errorTitle = `Lỗi ${error.response.status}`;
    }
    
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else {
      errorMessage = isEditMode.value ? 'Cập nhật danh mục thất bại!' : 'Thêm danh mục thất bại!';
    }

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: errorTitle,
      text: errorMessage,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true
    });
  }
};

const closeModal = () => {
  const modalElement = document.getElementById('addCategoryModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

// Pagination functions
const handlePrev = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    currentPage.value++;
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 0;
};

const resetCategoryModal = () => {
  isEditMode.value = false;
  editIndex.value = null;
  newCategory.value = {
    id: '',
    name: '',
    description: '',
    iconUrl: '',
    status: '1'
  };
};

let modalElement = null;

onMounted(() => {
  modalElement = document.getElementById('addCategoryModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', resetCategoryModal);
  }
  fetchCategories();
});

onUnmounted(() => {
  if (modalElement) {
    modalElement.removeEventListener('hidden.bs.modal', resetCategoryModal);
  }
});
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.modal-dialog {
  max-width: 500px !important;
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
  font-size: 1.2rem;
}

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

.text-muted {
  color: #6c757d !important;
}

.small {
  font-size: 0.875em;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.text-danger {
  color: #dc3545 !important;
}

.category-icon {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.category-icon:error {
  display: none;
}
</style>
