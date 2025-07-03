<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Rank</strong>
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
                <th style="min-width: 150px;">Điểm tối thiểu</th>
                <th style="min-width: 150px;">Điểm tối đa</th>
                <th style="min-width: 100px;">Trạng thái</th>
                <th style="min-width: 150px;">Ngày tạo</th>
                <th style="min-width: 120px;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rank, index) in ranks" :key="rank.id">
                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                <td>
                  <router-link 
                    :to="{ name: 'Rank detail', params: { id: rank.id }, query: { name: rank.name } }"
                    class="text-decoration-none fw-bold text-primary"
                  >
                    {{ rank.name }}
                  </router-link>
                </td>
                <td>{{ rank.minPoints || 0 }}</td>
                <td>{{ rank.maxPoints || 'Không giới hạn' }}</td>
                <td>
                  <ToggleStatus 
                    :id="rank.id"
                    :model-value="Number(rank.status)"
                    :true-value="1"
                    :false-value="0"
                    active-text="Hoạt động"
                    inactive-text="Không hoạt động"
                    @change="handleStatusChange(rank, $event)"
                  />
                </td>
                <td>{{ formatDate(rank.createdAt) }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <EditButton @click="openEditModal(rank, index)" />
                    <DeleteButton @click="handleDelete(rank)" />
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
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #ecae9e;">
          <h5 class="modal-title">
            <i class="bi me-2" :class="isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
            {{ isEditMode ? 'Sửa Rank' : 'Thêm Rank' }}
          </h5>
          <button type="button" class="custom-close-btn" @click="closeModal" style="background: transparent; border: none; box-shadow: none; outline: none;">
            <img src="https://cdn-icons-png.flaticon.com/128/1828/1828666.png" alt="Close" style="width: 24px; height: 24px;" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Tên Rank <span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formData.name"
                placeholder="Nhập tên rank"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Điểm tối thiểu <span class="text-danger">*</span></label>
              <input 
                type="number" 
                class="form-control" 
                v-model="formData.minPoints"
                placeholder="Nhập điểm tối thiểu"
                required
                min="0"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Điểm tối đa</label>
              <input 
                type="number" 
                class="form-control" 
                v-model="formData.maxPoints"
                placeholder="Nhập điểm tối đa (để trống nếu không giới hạn)"
                min="0"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <textarea 
                class="form-control" 
                rows="3"
                v-model="formData.description"
                placeholder="Nhập mô tả rank"
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Trạng thái <span class="text-danger">*</span></label>
              <select class="form-select" v-model="formData.status" required>
                <option value="">Chọn trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Không hoạt động</option>
              </select>
            </div>
            <div class="d-flex justify-content-end">
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
import { getRanks, createRank, updateRank, deleteRank, updateRankStatus } from '@/services/admin/rank.js';
import { showToast, showQuickConfirm } from '@/utils/swalHelper';
import { debounce } from '@/utils/utils';

// Components
import AddButton from '@/components/common/AddButton.vue';
import EditButton from '@/components/common/EditButton.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
import ToggleStatus from '@/components/common/ToggleStatus.vue';
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
  name: '',
  minPoints: '',
  maxPoints: '',
  description: '',
  status: '',
  createdBy: 'admin',
  updatedBy: 'admin'
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

const openAddModal = () => {
  isEditMode.value = false;
  editingIndex.value = -1;
  formData.value = {
    id: null,
    name: '',
    minPoints: '',
    maxPoints: '',
    description: '',
    status: '',
    createdBy: 'admin',
    updatedBy: 'admin'
  };
  showModal.value = true;
};

const openEditModal = (rank, index) => {
  isEditMode.value = true;
  editingIndex.value = index;
  formData.value = {
    id: rank.id,
    name: rank.name,
    minPoints: rank.minPoints,
    maxPoints: rank.maxPoints,
    description: rank.description,
    status: rank.status,
    createdBy: rank.createdBy,
    updatedBy: 'admin'
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  formData.value = {
    id: null,
    name: '',
    minPoints: '',
    maxPoints: '',
    description: '',
    status: '',
    createdBy: 'admin',
    updatedBy: 'admin'
  };
};

const handleSubmit = async () => {
  try {
    const submitData = {
      ...formData.value,
      minPoints: Number(formData.value.minPoints),
      maxPoints: formData.value.maxPoints ? Number(formData.value.maxPoints) : null,
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

const handleStatusChange = async (rank, newStatus) => {
  try {
    await updateRankStatus(rank.id, newStatus, 'admin');
    showToast('success', 'Cập nhật trạng thái thành công!', 2000);
    fetchRanks();
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    const message = error.response?.data?.message || 'Lỗi khi cập nhật trạng thái!';
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
