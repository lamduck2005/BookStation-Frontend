<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-md-6">
        <h2>Quản lý Nhà Xuất Bản</h2>
        <p class="text-muted">
          Quản lý thông tin các nhà xuất bản của hệ thống BookStation
        </p>
      </div>
      <div class="col-md-6 d-flex justify-content-end align-items-center">
        <AddButton @click="openAddModal" text="Thêm nhà xuất bản mới" />
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-3 mb-3">
            <label class="form-label">Tìm kiếm theo tên</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="Nhập tên nhà xuất bản..."
                v-model="searchQuery"
                @input="debouncedSearch"
              />
            </div>
          </div>

          <div class="col-md-3 mb-3">
            <label class="form-label">Tìm kiếm theo email</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-envelope"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="Nhập email..."
                v-model="emailFilter"
                @input="debouncedSearch"
              />
            </div>
          </div>

          <div class="col-md-2 mb-3">
            <label class="form-label">Trạng thái</label>
            <select class="form-select" v-model="selectedStatus" @change="applyFilters">
              <option value="">Tất cả</option>
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>

          <div class="col-md-4 d-flex align-items-end">
            <button class="btn btn-primary me-2" @click="applyFilters">
              <i class="bi bi-filter me-1"></i> Lọc
            </button>
            <button class="btn btn-outline-secondary" @click="clearFilters">
              <i class="bi bi-x-circle me-1"></i> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Publishers Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-xxs font-weight-bolder opacity-7">
                ID
              </th>
              <th class="text-uppercase text-xxs font-weight-bolder opacity-7">
                Tên nhà xuất bản
              </th>
              <th class="text-uppercase text-xxs font-weight-bolder opacity-7">
                Email / Liên hệ
              </th>
              <th class="text-uppercase text-xxs font-weight-bolder opacity-7">
                Người liên hệ
              </th>
              <th class="text-uppercase text-xxs font-weight-bolder opacity-7">
                Trạng thái
              </th>
              <th class="text-uppercase text-xxs font-weight-bolder opacity-7">
                Thời gian tạo
              </th>
              <th class="text-uppercase text-xxs font-weight-bolder opacity-7">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(publisher, index) in publishers" :key="publisher.id">
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ publisher.id }}</p>
              </td>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ publisher.publisherName }}</h6>
                    <p class="text-xs text-secondary mb-0" v-if="publisher.website">
                      <a :href="publisher.website" target="_blank">{{ publisher.website }}</a>
                    </p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ publisher.email }}</p>
                <p class="text-xs text-secondary mb-0">{{ publisher.phone }}</p>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ publisher.contactName }}</p>
              </td>
              <td>
                <StatusLabel
                  :status="publisher.status === '1'"
                  :activeText="'Hoạt động'"
                  :inactiveText="'Không hoạt động'"
                  @click="handleToggleStatus(publisher.id, index)"
                />
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">
                  {{ formatDate(publisher.createdAt) }}
                </p>
              </td>
              <td>
                <div class="d-flex gap-2">
                  <EditButton @click="openEditModal(publisher, index)" />
                  <button
                    class="btn btn-sm btn-link text-danger m-0 p-0 border-0"
                    @click="handleDeletePublisher(publisher.id, index)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="publishers.length === 0">
              <td colspan="7" class="text-center py-4">
                <p class="text-muted">Không có dữ liệu nhà xuất bản</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer d-flex justify-content-end">
        <Pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          :isLastPage="isLastPage"
          @prev="handlePrev"
          @next="handleNext"
          :pageSizeOptions="itemsPerPageOptions"
          :currentPageSize="pageSize"
          @pageSizeChanged="handlePageSizeChange"
        />
      </div>
    </div>
  </div>

  <!-- Add/Edit Publisher Modal -->
  <div class="modal fade" id="addPublisherModal" tabindex="-1" aria-labelledby="addPublisherModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content enhanced-modal">
        <div class="modal-header gradient-header">
          <h5 class="modal-title" id="addPublisherModalLabel">
            <i class="bi bi-building me-2"></i>
            {{ isEditMode ? "Cập nhật nhà xuất bản" : "Thêm nhà xuất bản mới" }}
          </h5>
          <button 
            type="button" 
            class="custom-close-btn" 
            aria-label="Close" 
            @click="closeModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body enhanced-body">
          <!-- Basic Information Section -->
          <div class="form-section">
            <div class="section-header">
              <span class="section-icon"><i class="bi bi-info-circle"></i></span>
              <h5 class="section-title">Thông tin cơ bản</h5>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="enhanced-label">
                  Tên nhà xuất bản <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control enhanced-input"
                  :class="{'is-invalid': formErrors.publisherName}"
                  placeholder="Nhập tên nhà xuất bản"
                  v-model="newPublisher.publisherName"
                  required
                />
                <div class="invalid-feedback" v-if="formErrors.publisherName">
                  {{ formErrors.publisherName }}
                </div>
                <div class="form-text" v-else>Tên nhà xuất bản phải là duy nhất, tối đa 255 ký tự</div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="enhanced-label">
                  Email
                </label>
                <input
                  type="email"
                  class="form-control enhanced-input"
                  :class="{'is-invalid': formErrors.email}"
                  placeholder="Nhập email"
                  v-model="newPublisher.email"
                />
                <div class="invalid-feedback" v-if="formErrors.email">
                  {{ formErrors.email }}
                </div>
                <div class="form-text" v-else>Email phải đúng định dạng và duy nhất</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="enhanced-label">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  class="form-control enhanced-input"
                  :class="{'is-invalid': formErrors.phone}"
                  placeholder="Nhập số điện thoại"
                  v-model="newPublisher.phone"
                />
                <div class="invalid-feedback" v-if="formErrors.phone">
                  {{ formErrors.phone }}
                </div>
                <div class="form-text" v-else>Số điện thoại liên hệ của nhà xuất bản</div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="enhanced-label">
                  Người liên hệ
                </label>
                <input
                  type="text"
                  class="form-control enhanced-input"
                  :class="{'is-invalid': formErrors.contactName}"
                  placeholder="Nhập tên người liên hệ"
                  v-model="newPublisher.contactName"
                />
                <div class="invalid-feedback" v-if="formErrors.contactName">
                  {{ formErrors.contactName }}
                </div>
                <div class="form-text" v-else>Tên người đại diện liên hệ của nhà xuất bản</div>
              </div>
            </div>
          </div>

          <!-- Additional Information Section -->
          <div class="form-section">
            <div class="section-header">
              <span class="section-icon"><i class="bi bi-card-text"></i></span>
              <h5 class="section-title">Thông tin bổ sung</h5>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="enhanced-label">
                  Website
                </label>
                <input
                  type="url"
                  class="form-control enhanced-input"
                  :class="{'is-invalid': formErrors.website}"
                  placeholder="https://example.com"
                  v-model="newPublisher.website"
                />
                <div class="invalid-feedback" v-if="formErrors.website">
                  {{ formErrors.website }}
                </div>
                <div class="form-text" v-else>Website chính thức của nhà xuất bản</div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="enhanced-label">
                  Trạng thái
                </label>
                <select
                  class="form-select enhanced-input"
                  v-model="newPublisher.status"
                >
                  <option value="1">Hoạt động</option>
                  <option value="0">Không hoạt động</option>
                </select>
                <div class="form-text">Trạng thái hoạt động của nhà xuất bản trong hệ thống</div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 mb-3">
                <label class="enhanced-label">
                  Địa chỉ
                </label>
                <textarea
                  class="form-control enhanced-input"
                  :class="{'is-invalid': formErrors.address}"
                  placeholder="Nhập địa chỉ nhà xuất bản"
                  v-model="newPublisher.address"
                  rows="2"
                ></textarea>
                <div class="invalid-feedback" v-if="formErrors.address">
                  {{ formErrors.address }}
                </div>
                <div class="form-text" v-else>Địa chỉ chính của nhà xuất bản</div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 mb-3">
                <label class="enhanced-label">
                  Mô tả
                </label>
                <textarea
                  class="form-control enhanced-input"
                  :class="{'is-invalid': formErrors.description}"
                  placeholder="Nhập mô tả về nhà xuất bản"
                  v-model="newPublisher.description"
                  rows="3"
                ></textarea>
                <div class="invalid-feedback" v-if="formErrors.description">
                  {{ formErrors.description }}
                </div>
                <div class="form-text" v-else>Thông tin mô tả thêm về nhà xuất bản</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer enhanced-footer">
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
              class="btn btn-cancel me-2"
              @click="closeModal"
            >
              <i class="bi bi-x-circle me-1"></i> Hủy
            </button>
            <button
              type="button"
              class="btn btn-submit"
              @click="handleSubmitPublisher"
            >
              <i class="bi bi-check-circle me-1"></i> {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
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
import { ref, onMounted, watch } from 'vue';
import { Modal } from 'bootstrap';
import { getPublishers, createPublisher, updatePublisher, updatePublisherStatus, deletePublisher } from '@/services/admin/publisher';
import { showQuickConfirm, showToast } from '@/utils/swalHelper';

const searchQuery = ref('');
const emailFilter = ref('');
const selectedStatus = ref('');

// New/Edit publisher form data
const newPublisher = ref({
  id: '',
  publisherName: '',
  address: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  description: '',
  status: '1', // Default status is active
  createdBy: 'admin',
  updatedBy: 'admin'
});

// Track edit mode and index
const isEditMode = ref(false);
const editIndex = ref(null);

// Form validation
const formErrors = ref({
  publisherName: '',
  email: '',
  phone: '',
  contactName: '',
  website: '',
  address: '',
  description: ''
});

// Pagination state
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

// Publishers data
const publishers = ref([]);

const fetchPublishers = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    };

    if (searchQuery.value) {
      params.name = searchQuery.value;
    }

    if (emailFilter.value) {
      params.email = emailFilter.value;
    }

    if (selectedStatus.value) {
      params.status = selectedStatus.value;
    }

    const response = await getPublishers(params);
    console.log('API Response:', response);

    // Theo tài liệu API, response có cấu trúc { status: 200, message: "...", data: {...} }
    if (response && response.status === 200 && response.data) {
      publishers.value = response.data.content || [];
      totalPages.value = response.data.totalPages || 1;
      totalElements.value = response.data.totalElements || 0;
      isLastPage.value = response.data.last || currentPage.value >= totalPages.value - 1;
    } else {
      console.error('Invalid API response structure:', response);
      publishers.value = [];
      totalPages.value = 1;
      totalElements.value = 0;
      isLastPage.value = true;
    }
  } catch (error) {
    console.error('Error fetching publishers:', error);
    showToast('error', 'Không thể tải danh sách nhà xuất bản');
    publishers.value = [];
    totalPages.value = 1;
    totalElements.value = 0;
    isLastPage.value = true;
  }
};

// Watch filters and pagination
watch([pageSize], () => {
  currentPage.value = 0; // Reset to first page when changing page size
  fetchPublishers();
});

watch([currentPage], () => {
  fetchPublishers();
});

// Format date function
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Modal functions
const resetFormErrors = () => {
  Object.keys(formErrors.value).forEach(key => formErrors.value[key] = '');
};

const openAddModal = () => {
  console.log('Opening add modal');
  isEditMode.value = false;
  resetFormErrors();
  
  newPublisher.value = {
    id: '',
    publisherName: '',
    address: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    status: '1',
    createdBy: 'admin',
    updatedBy: 'admin'
  };
  
  try {
    const modalElement = document.getElementById('addPublisherModal');
    console.log('Modal element:', modalElement);
    if (modalElement) {
      const modal = new Modal(modalElement);
      console.log('Modal instance created:', modal);
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  } catch (error) {
    console.error('Error opening modal:', error);
  }
};

const openEditModal = (publisher, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  resetFormErrors();
  
  newPublisher.value = {
    id: publisher.id,
    publisherName: publisher.publisherName,
    address: publisher.address || '',
    contactName: publisher.contactName || '',
    email: publisher.email || '',
    phone: publisher.phone || '',
    website: publisher.website || '',
    description: publisher.description || '',
    status: publisher.status || '1',
    createdBy: publisher.createdBy || 'admin',
    updatedBy: 'admin' // Always set current user as updater
  };
  
  try {
    const modalElement = document.getElementById('addPublisherModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found when trying to open edit modal');
    }
  } catch (error) {
    console.error('Error opening edit modal:', error);
  }
};

const handleSubmitPublisher = async () => {
  // Reset validation errors
  Object.keys(formErrors.value).forEach(key => formErrors.value[key] = '');
  
  // Validate form
  let isValid = true;
  
  // Validate publisher name
  if (!newPublisher.value.publisherName || newPublisher.value.publisherName.trim() === '') {
    formErrors.value.publisherName = 'Vui lòng nhập tên nhà xuất bản';
    isValid = false;
  } else if (newPublisher.value.publisherName.length > 255) {
    formErrors.value.publisherName = 'Tên nhà xuất bản không được vượt quá 255 ký tự';
    isValid = false;
  }
  
  // Validate email if provided
  if (newPublisher.value.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newPublisher.value.email)) {
      formErrors.value.email = 'Email không đúng định dạng';
      isValid = false;
    }
  }
  
  // Validate website if provided
  if (newPublisher.value.website) {
    try {
      new URL(newPublisher.value.website);
    } catch (err) {
      formErrors.value.website = 'Website không đúng định dạng URL';
      isValid = false;
    }
  }
  
  if (!isValid) {
    showToast('error', 'Vui lòng kiểm tra lại thông tin nhập');
    return;
  }

  try {
    if (isEditMode.value) {
      // Update existing publisher - sử dụng PUT với body thay vì path ID
      await updatePublisher(newPublisher.value.id, newPublisher.value);
      showToast('success', 'Cập nhật nhà xuất bản thành công');
      
      // Update the publisher in the local array
      if (editIndex.value !== null) {
        publishers.value[editIndex.value] = { ...publishers.value[editIndex.value], ...newPublisher.value };
      }
    } else {
      // Create new publisher
      await createPublisher(newPublisher.value);
      showToast('success', 'Thêm nhà xuất bản thành công');
      
      // Refresh the list to see the new publisher
      await fetchPublishers();
    }
    
    closeModal();
  } catch (error) {
    console.error('Error submitting publisher:', error);
    
    if (error.response) {
      if (error.response.data && error.response.data.errors) {
        // Process validation errors from backend
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach(key => {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          if (formErrors.value.hasOwnProperty(fieldName)) {
            formErrors.value[fieldName] = backendErrors[key];
          }
        });
        showToast('error', 'Vui lòng kiểm tra lại thông tin nhập liệu');
      } else if (error.response.data && error.response.data.message) {
        showToast('error', error.response.data.message);
      } else if (error.response.data && error.response.data.error) {
        showToast('error', error.response.data.error);
      } else {
        showToast('error', 'Có lỗi xảy ra, vui lòng kiểm tra lại thông tin nhập.');
      }
    } else {
      showToast('error', 'Không thể lưu thông tin nhà xuất bản. Vui lòng thử lại sau.');
    }
  }
};

const closeModal = () => {
  try {
    const modalElement = document.getElementById('addPublisherModal');
    if (modalElement) {
      // Tìm modal instance hiện tại
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        // Nếu không có instance, tạo mới và hide
        const newModal = new Modal(modalElement);
        newModal.hide();
      }
      
      // Đảm bảo cleanup hoàn toàn
      setTimeout(() => {
        // Remove backdrop
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        
        // Remove modal classes from body
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
        
        // Reset modal state
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.removeAttribute('aria-modal');
      }, 150);
    } else {
      console.error('Modal element not found when trying to close');
    }
  } catch (error) {
    console.error('Error closing modal:', error);
    // Force cleanup nếu có lỗi
    forceCleanupModal();
  }
};

// Helper function để force cleanup modal
const forceCleanupModal = () => {
  // Remove all backdrops
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());
  
  // Remove modal classes from body
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('padding-right');
  
  // Hide modal element
  const modalElement = document.getElementById('addPublisherModal');
  if (modalElement) {
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.removeAttribute('aria-modal');
  }
};

// Toggle status function
const handleToggleStatus = async (publisherId, index) => {
  try {
    const publisher = publishers.value[index];
    const newStatus = publisher.status === '1' ? '0' : '1';
    
    await updatePublisherStatus(publisherId, newStatus, 'admin');
    
    // Update the local array
    publishers.value[index].status = newStatus;
    
    showToast('success', `Đã ${newStatus === '1' ? 'kích hoạt' : 'vô hiệu hóa'} nhà xuất bản`);
  } catch (error) {
    console.error('Error toggling publisher status:', error);
    showToast('error', 'Không thể cập nhật trạng thái nhà xuất bản');
  }
};

// Delete publisher function
const handleDeletePublisher = async (publisherId, index) => {
  try {
    const result = await showQuickConfirm(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa nhà xuất bản này không? Hành động này không thể hoàn tác.',
      'question',
      'Xóa',
      'Hủy',
      'btn-danger',
      'btn-secondary'
    );
    
    if (result.isConfirmed) {
      await deletePublisher(publisherId);
      
      // Remove from local array
      publishers.value.splice(index, 1);
      
      showToast('success', 'Xóa nhà xuất bản thành công');
    }
  } catch (error) {
    console.error('Error deleting publisher:', error);
    
    if (error.response && error.response.status === 500) {
      showToast('error', 'Không thể xóa nhà xuất bản đang được sử dụng bởi sách');
    } else {
      showToast('error', 'Không thể xóa nhà xuất bản');
    }
  }
};

// Filter functions
const applyFilters = () => {
  currentPage.value = 0;
  fetchPublishers();
};

const clearFilters = () => {
  searchQuery.value = '';
  emailFilter.value = '';
  selectedStatus.value = '';
  currentPage.value = 0;
  fetchPublishers();
};

// Debounce function for search input
let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    fetchPublishers();
  }, 500);
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

// Fake data function
const fillFakeData = () => {
  newPublisher.value = {
    publisherName: 'Nhà xuất bản Trẻ',
    address: '161B Lý Chính Thắng, Phường 7, Quận 3, TP. Hồ Chí Minh',
    contactName: 'Nguyễn Văn A',
    email: 'contact@nxbtre.com.vn',
    phone: '(028) 3931 6289',
    website: 'https://www.nxbtre.com.vn',
    description: 'Nhà xuất bản Trẻ là nhà xuất bản của Thành Đoàn Thành phố Hồ Chí Minh, được thành lập năm 1981.',
    status: '1',
    createdBy: 'admin',
    updatedBy: 'admin'
  };
};

onMounted(() => {
  fetchPublishers();
});
</script>

<style scoped>
.table th,
.table td {
  white-space: nowrap;
  padding: 0.75rem 1rem;
}

/* Enhanced Modal Styles */
.modal-lg {
  max-width: 800px;
}

.modal-dialog-scrollable {
  display: flex;
  max-height: calc(100% - 1rem);
}

.modal-dialog-scrollable .modal-body {
  overflow-y: auto;
}

.enhanced-modal {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: modalFadeIn 0.4s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gradient-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 1.2rem;
  position: relative;
  overflow: hidden;
}

.gradient-header::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
  animation: gradientShift 3s ease infinite alternate;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.enhanced-body {
  padding: 1.5rem;
}

.enhanced-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  background-color: #f9fafc;
  border-top: 1px solid #eaedf2;
}

/* Form Section Styles */
.form-section {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #eaedf2;
  transition: all 0.3s ease;
  animation: slideInUp 0.5s ease;
}

.form-section:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.form-section:nth-child(1) {
  animation-delay: 0.1s;
}

.form-section:nth-child(2) {
  animation-delay: 0.2s;
}

.form-section:nth-child(3) {
  animation-delay: 0.3s;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid #eaedf2;
  position: relative;
}

.section-header::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 1px;
  transition: width 0.3s ease;
}

.form-section:hover .section-header::after {
  width: 100px;
}

.section-icon {
  font-size: 1.5rem;
  color: #4facfe;
  margin-right: 10px;
  transition: transform 0.3s ease;
}

.form-section:hover .section-icon {
  transform: scale(1.1) rotate(5deg);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #2d3748;
}

/* Enhanced Form Controls */
.enhanced-label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #2d3748;
  display: block;
}

.enhanced-label .text-danger {
  font-weight: bold;
}

.enhanced-input {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 10px 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.enhanced-input:focus {
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  background-color: white;
}

.enhanced-input:hover {
  background-color: white;
  border-color: #cbd5e1;
}

.enhanced-input.is-invalid {
  border-color: #ef4444;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23ef4444' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23ef4444' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.enhanced-input.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Button Styles */
.fake-data-btn {
  background-color: #fff8eb;
  color: #b45309;
  font-weight: 500;
  border: 1px dashed #fbbf24;
  font-size: 0.875rem;
  box-shadow: none;
  transition: all 0.2s ease;
}

.fake-data-btn:hover {
  background-color: #fef3c7;
  color: #92400e;
  border-color: #f59e0b;
}

.btn-submit {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  color: white;
  font-weight: 500;
  padding: 10px 24px;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  box-shadow: 0 5px 15px rgba(79, 172, 254, 0.3);
  transform: translateY(-1px);
}

.btn-cancel {
  background-color: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-weight: 500;
  padding: 10px 24px;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background-color: #f8fafc;
  color: #1e293b;
}

.custom-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.custom-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Status Styles */
.status-active {
  color: #10b981;
}

.status-inactive {
  color: #ef4444;
}

.text-muted {
  color: #94a3b8 !important;
}

.small {
  font-size: 0.875rem;
}

.text-danger {
  color: #ef4444 !important;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
  font-weight: 600;
  border-radius: 6px;
}

.bg-info {
  background-color: #38bdf8 !important;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .modal-lg {
    max-width: 95%;
  }
}

@media (max-width: 992px) {
  .section-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .form-section {
    padding: 1rem;
  }
}

/* Modal positioning fix */
.modal-dialog {
  margin-top: 2rem;
}

@media (min-height: 600px) {
  .modal-dialog {
    margin-top: calc(5vh);
  }
}

/* Animation for form sections */
.form-section {
  opacity: 0;
  transform: translateY(20px);
}

.form-section:nth-child(1) {
  animation: slideInUp 0.5s ease 0.1s forwards;
}

.form-section:nth-child(2) {
  animation: slideInUp 0.5s ease 0.2s forwards;
}

.form-section:nth-child(3) {
  animation: slideInUp 0.5s ease 0.3s forwards;
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
