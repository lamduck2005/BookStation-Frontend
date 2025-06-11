<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Ban đào tạo / <strong>Quản lý ban đào tạo</strong>
      </h6>
    </div>

    <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 text-bg-secondary p-2 m-0 rounded-top" id="">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-6">
          <label class="form-label">Tìm kiếm:</label>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập tên, mã, email"
            v-model="searchQuery"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Không hoạt động</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Danh sách cơ sở -->
    <div class="bg-white p-3 rounded shadow-sm">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <strong>Danh sách Admin</strong>
        <button class="btn btn-primary btn-sm py-2" @click="openAddModal" style="background-color: #33304e; border-color: #33304e;">
          <i class="bi bi-plus-circle me-1"></i> Thêm mới
        </button>
      </div>

      <table class="table align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Mã ban đào tạo</th>
            <th>Tên ban đào tạo</th>
            <th>Email</th>
            <th style="width: 200px;">Trạng thái</th>
            <th style="width: 100px;">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cs, index) in filteredUserStaff" :key="cs.id">
            <td>{{ index + 1 }}</td>
            <td>{{ cs.code }}</td>
            <td>{{ cs.name }}</td>
            <td>{{ cs.email }}</td>
            <td style="width: 200px;">
              <div
                v-if="cs.email === currentUserEmail"
                class="disabled-status-cell position-relative"
                @mouseenter="cs._showRestrict = true"
                @mouseleave="cs._showRestrict = false"
              >
                <div class="d-flex align-items-center" style="pointer-events: none; opacity: 0.5;">
                  <ToggleStatus
                    :id="cs.id"
                    :model-value="cs.status"
                    :true-value="1"
                    :false-value="0"
                    :active-text="'Hoạt động'"
                    :inactive-text="'Không hoạt động'"
                  />
                </div>
                <img
                  v-if="cs._showRestrict"
                 
                  alt="Cấm"
                  class="restrict-icon"
                  style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
                />
              </div>
              <template v-else>
                <ToggleStatus
                  :id="cs.id"
                  :model-value="cs.status"
                  :true-value="1"
                  :false-value="0"
                  :active-text="'Hoạt động'"
                  :inactive-text="'Không hoạt động'"
                  @change="() => onToggleStatus(cs)"
                  @update:modelValue="val => cs.status = val"
                />
              </template>
            </td>
            <td style="width: 100px;">
              <EditButton @click="openEditModal(cs)" />
              <DeleteButton @click="confirmDelete(cs.id, cs.email)" />
            </td>
          </tr>
          <tr v-if="filteredUserStaff.length === 0">
            <td colspan="6" class="text-center text-muted">Danh sách cán bộ đào tạo trống</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <Pagination
        :page-number="pageNumber"
        :total-pages="totalPages"
        :is-last-page="isLastPage"
        :page-size="pageSize"
        :items-per-page-options="itemsPerPageOptions"
        :total-elements="totalElements"
        @prev="prevPage"
        @next="nextPage"
        @update:pageSize="val => pageSize = val"
      />
    </div>

    <!-- Modal Popup for Add/Edit -->
    <div class="modal-overlay" v-if="showModal" @click="closeModalOnOutsideClick">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h5>{{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}</h5>
          <button class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label required">Mã</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.code"
              placeholder="Nhập mã"
            >
          </div>
          <div class="mb-3">
            <label class="form-label required">Tên</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.name"
              placeholder="Nhập tên"
            >
          </div>
          <div class="mb-3">
            <label class="form-label required">Email</label>
            <input
              type="email"
              class="form-control"
              v-model="formData.email"
              placeholder="Nhập email"
            >
          </div>
          <div class="mb-3">
            <label class="form-label required">Trạng thái</label>
            <select class="form-select" v-model="formData.status">
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Huỷ</button>
          <button type="button" class="btn btn-primary" @click="saveData">{{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import {showToast} from '@/utils/swalHelper.js';
import Swal from 'sweetalert2';
import ToggleStatus from '@/components/Common/ToggleStatus.vue';
import EditButton from '@/components/Common/EditButton.vue';
import DeleteButton from '@/components/Common/DeleteButton.vue';
import Pagination from '@/components/Common/Pagination.vue';

import { debounce } from '@/utils/utils.js';

const searchQuery = ref('');
const selectedStatus = ref('');

// Pagination
const pageNumber = ref(0);
const pageSize = ref(10);
const totalElements = ref(0);
const totalPages = ref(1);
const isLastPage = ref(false);
const itemsPerPageOptions = ref([5, 10, 15, 20, 25, 50]);

const userStaff = ref([]);

const filteredUserStaff = computed(() => {
  return userStaff.value;
});

const nextPage = () => {
  if (pageNumber.value < totalPages.value - 1) {
    getUserStaffCanBoDaoTao({ page: pageNumber.value + 1, size: pageSize.value });
  }
};

const prevPage = () => {
  if (pageNumber.value > 0) {
    getUserStaffCanBoDaoTao({ page: pageNumber.value - 1, size: pageSize.value });
  }
};

watch(pageSize, (newSize) => {
  getUserStaffCanBoDaoTao({ page: 0, size: newSize });
});

// Modal logic
const showModal = ref(false);
const isEditMode = ref(false);
const formData = ref({
  id: null,
  code: '',
  name: '',
  email: '',
  status: 1
});

const openAddModal = () => {
  isEditMode.value = false;
  formData.value = {
    id: null,
    code: '',
    name: '',
    email: '',
    status: 1
  };
  showModal.value = true;
};

const openEditModal = (data) => {
  isEditMode.value = true;
  formData.value = {
    id: data.id,
    code: data.code,
    name: data.name,
    email: data.email,
    status: data.status
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const closeModalOnOutsideClick = (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    closeModal();
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

const validateCode = (code) => {
  const codeRegex = /^[a-zA-Z0-9]+$/;
  return codeRegex.test(code);
}

const validateForm = () => {
  if (!formData.value.code || !formData.value.name || !formData.value.email) {
    showToast('error', 'Vui lòng điền đầy đủ thông tin');
    return false;
  }
  if (!validateCode(formData.value.code)) {
    showToast('error', 'Mã chỉ được chứa chữ cái và số');
    return false;
  }
  if (!validateEmail(formData.value.email.trim())) {
    showToast('error', 'Email không hợp lệ!');
    return false;
  }
  return true;
}

const saveData = async () => {
  if (!validateForm()) {
    return;
  }
  try {
    if (isEditMode.value) {
      // Update existing admin
      const res = await updateUserStaffCanBoDaoTao(formData.value.id, formData.value);
      showToast('success', 'Cập nhật thành công');
    } else {
      // Create new admin
      const res = await createOrUpdateUserStaffCanBoDaoTao(formData.value);
      showToast('success', 'Thêm mới thành công');
    }
    await getUserStaffCanBoDaoTao({ page: 0, size: pageSize.value });
    closeModal();
  } catch (error) {
    let msg = isEditMode.value ? 'Cập nhật thất bại' : 'Thêm mới thất bại';
    if (error?.response?.data?.message) {
      msg += `: ${error.response.data.message}`;
    }
    showToast('error', msg);
    console.error(error);
  }
};




</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}
.badge {
  font-size: 0.85rem;
  padding: 4px 10px;
  border-radius: 10px;
}
.pagination-controls .btn-primary,
.pagination-controls .btn-primary:focus,
.pagination-controls .btn-primary:active {
  background-color: #3e3a5d;
  border-color: #3e3a5d;
  color: white;
  box-shadow: none;
}
.pagination-controls .btn-primary:hover {
  background-color: #33304e;
  border-color: #33304e;
  color: white;
}
.pagination-controls .btn-light {
  background-color: #f0f0f0;
  border-color: #dcdcdc;
  color: #6c757d;
}
.pagination-controls .btn-light:hover {
  background-color: #f0f0f0;
  border-color: #dcdcdc;
  color: #6c757d;
}
.pagination-controls .btn-light:disabled {
  opacity: 1;
}
.items-per-page-actual-select {
  display: inline-block;
  width: auto;
  vertical-align: middle;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}
.modal-header h5 {
  margin: 0;
  font-weight: bold;
}
.close-icon {
  cursor: pointer;
  width: 16px;
  height: 16px;
}
.modal-body {
  padding: 1rem;
}
.modal-footer {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #e9ecef;
}
.required::after {
  content: "*";
  color: red;
  margin-left: 4px;
}

#filter-header{
  background-color: #e9ebef;
}
.disabled-status-cell {
  position: relative;
  cursor: not-allowed;
}
.disabled-status-cell .d-flex {
  opacity: 0.5;
  pointer-events: none;
}
.disabled-status-cell .restrict-icon {
  width: 32px;
  height: 32px;
  z-index: 10;
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
  display: none;
}
.disabled-status-cell:hover {
  background: rgba(255,255,255,0.7);
}
.disabled-status-cell:hover .restrict-icon {
  display: block;
  pointer-events: none;
}
</style>