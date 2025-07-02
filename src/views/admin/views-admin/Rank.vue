<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Rank</strong>
      </h6>
    </div> <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-6">
          <label class="form-label">Tìm kiếm:</label>
          <input type="text" class="form-control" placeholder="Nhập tên rank" v-model="searchQuery" />
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

    <!-- Nút thêm mới -->
    <div class="d-flex justify-content-end mb-3">
      <AddButton @click="openAddModal" />
    </div>

    <!-- Chú ý loại rank -->
    <div class="rank-warning-label d-flex align-items-center justify-content-center mb-3">
      <img src="https://cdn-icons-png.flaticon.com/128/3756/3756730.png" alt="Warning" class="rank-warning-icon me-2" />
      <span class="rank-warning-text">
        <strong>Chỉ có 3 loại rank: Bạc, Vàng và Kim Cương. Vui lòng không thêm loại khác!</strong>
      </span>
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
                <th>#</th>
                <th>Tên rank</th>
                <th>Chi tiêu tối thiểu</th>
                <th>Hệ số điểm</th>
                <th style="width: 200px;">Trạng thái</th>
                <th style="width: 100px;">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rank, index) in ranks" :key="rank.id">
                <td>{{ index + 1 }}</td>
                <td>
                  <router-link :to="{ name: 'rank-detail', params: { id: rank.id }, query: { name: rank.name } }" style="color: #007bff; text-decoration: underline; cursor: pointer;">
                    {{ rank.name }}
                  </router-link>
                </td>
                <td>{{ rank.minSpend !== undefined && rank.minSpend !== null && rank.minSpend !== '-' ? rank.minSpend.toLocaleString() + ' VND' : '-' }}</td>
                <td>{{ rank.pointMultiplier !== undefined && rank.pointMultiplier !== null && rank.pointMultiplier !== '-' ? rank.pointMultiplier + 'x' : '-' }}</td>
                <td style="width: 200px;">
                  <StatusLabel :status="1" />
                </td>
                <td style="width: 100px;">
                  <EditButton @click="openEditModal(rank, index)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <Pagination :page-number="currentPage" :total-pages="totalPages" :is-last-page="isLastPage"
          :page-size="pageSize" :items-per-page-options="itemsPerPageOptions" :total-elements="totalElements"
          @prev="handlePrev" @next="handleNext" @update:pageSize="handlePageSizeChange" />
      </div>

    </div>
  </div> <!-- Add/Edit Rank Modal -->
  <div class="modal fade" id="addRankModal" tabindex="-1" aria-labelledby="addRankModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #ecae9e;">
          <h5 class="modal-title" id="addRankModalLabel">
            <i class="bi me-2 bi-plus-circle"></i>
            {{ isEditMode ? 'Sửa Rank' : 'Thêm Rank' }}
          </h5><button type="button" class="custom-close-btn" data-bs-dismiss="modal" aria-label="Close">
            <img src="https://cdn-icons-png.flaticon.com/128/694/694604.png" alt="Close" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmitRank">
            <div class="row g-3">
              <!-- Tên rank (input text) -->
              <div class="col-12" style="position:relative;">
                <label for="rankName" class="form-label">
                  Tên rank <span class="text-danger">*</span>
                </label>
                <div style="display:flex;align-items:center;position:relative;">
                  <input type="text" class="form-control" id="rankName" placeholder="Nhập tên rank" v-model="newRank.name" required :disabled="isEditMode && isSpecialRankName" />
                  <img v-if="!isEditMode && newRank.name && isInvalidRankName" src="https://cdn-icons-png.flaticon.com/128/12008/12008347.png" alt="Restriction" style="width:24px;height:24px;margin-left:8px;" />
                  <img v-if="!isEditMode && newRank.name && !isInvalidRankName" src="https://cdn-icons-png.flaticon.com/128/5610/5610944.png" alt="Valid" style="width:24px;height:24px;margin-left:8px;" />
                </div>
                <div v-if="!isEditMode && isInvalidRankName" class="form-text text-danger" style="font-size:0.92rem;">
                  Tên rank chỉ được phép là Bạc, Vàng hoặc Kim Cương.
                </div>
              </div>

              <!-- Trạng thái -->
              <div class="col-12" v-if="!isEditMode">
                <label for="rankStatus" class="form-label">
                  Trạng thái <span class="text-danger">*</span>
                </label>
                <select class="form-select" id="rankStatus" v-model="newRank.status" required>
                  <option value="">Chọn trạng thái</option>
                  <option value="1">Hoạt động</option>
                  <option value="0">Không hoạt động</option>
                </select>
              </div>

              <!-- Chi tiêu tối thiểu -->
              <div class="col-12">
                <label for="minSpend" class="form-label">
                  Chi tiêu tối thiểu (VND)
                </label>
                <input type="number" class="form-control" id="minSpend" placeholder="Nhập chi tiêu tối thiểu"
                  v-model="newRank.minSpend" min="0" />
              </div>

              <!-- Hệ số điểm -->
              <div class="col-12">
                <label for="pointMultiplier" class="form-label">
                  Hệ số điểm
                </label>
                <input type="number" class="form-control" id="pointMultiplier" placeholder="Nhập hệ số điểm"
                  v-model="newRank.pointMultiplier" min="1" step="0.1" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Hủy
          </button> <button type="button" class="btn btn-primary" @click="handleSubmitRank"
            style="background-color: #33304e; border-color: #33304e;">
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Modal } from 'bootstrap';
import { getRanks, createRank } from '@/services/admin/rank';
import Swal from 'sweetalert2';

const searchQuery = ref('');
const selectedStatus = ref('');

// New/Edit rank form data
const newRank = ref({
  id: '',
  name: '',
  type: 'GOLD',
  status: '1',
  minSpend: 0,
  pointMultiplier: 1
});

// Track edit mode and index
const isEditMode = ref(false);
const editIndex = ref(null);

// Pagination state
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(5);
const itemsPerPageOptions = ref([5, 10, 25, 50]);

// Computed property for last page check
const isLastPage = ref(false);

// Fake data for testing
const ranks = ref([]);

const fetchRanks = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
    };
    if (searchQuery.value) params.name = searchQuery.value;
    if (selectedStatus.value !== '') params.status = selectedStatus.value;
    const response = await getRanks(params);
    const data = response.data ? response.data : response;
    ranks.value = data.content.map(item => ({
      id: item.id,
      name: item.name,
      minSpend: item.minSpent ?? '-', // Đúng trường mới
      pointMultiplier: item.pointMultiplier ?? '-',
      email: item.email ?? '',
      status: item.status === null ? 1 : item.status
    }));
    totalPages.value = data.totalPages ?? 1;
    totalElements.value = data.totalElements ?? ranks.value.length;
    currentPage.value = data.page ?? currentPage.value;
    pageSize.value = data.size ?? pageSize.value;
    isLastPage.value = currentPage.value >= totalPages.value - 1;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách rank:', error);
  }
};

// Watchers để gọi fetchRanks khi thay đổi filter hoặc phân trang
import { watch } from 'vue';
watch([searchQuery, selectedStatus, pageSize, currentPage], () => {
  fetchRanks();
});

// Đảm bảo modal không bị kẹt backdrop hoặc tối màn hình:
// Luôn dùng Modal.getOrCreateInstance để tránh tạo nhiều instance và lỗi backdrop
const openAddModal = () => {
  isEditMode.value = false;
  newRank.value = {
    id: '',
    name: '',
    type: 'GOLD',
    status: '1',
    minSpend: 0,
    pointMultiplier: 1
  };
  isSpecialRankName.value = false;
  isInvalidRankName.value = false;
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement); // <-- Sử dụng getOrCreateInstance
  modal.show();
};

const isSpecialRankName = ref(false);
const isInvalidRankName = ref(false);

const allowedRankNames = ['bạc', 'vàng', 'kim cương'];

const validateRankName = (name) => {
  const trimmed = (name || '').trim().toLowerCase();
  return allowedRankNames.includes(trimmed);
};

const openEditModal = (rank, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  newRank.value = { ...rank };
  // Convert status to string for v-model
  newRank.value.status = String(rank.status);
  // Convert type to string for v-model
  newRank.value.type = String(rank.type);
  // Check if rank name is special (bạc, vàng, kim cương)
  const name = (newRank.value.name || '').trim().toLowerCase();
  isSpecialRankName.value = allowedRankNames.includes(name);
  isInvalidRankName.value = false;
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement); // <-- Sử dụng getOrCreateInstance
  modal.show();
};

// Watch rank name changes for add mode
watch(
  () => newRank.value.name,
  (val) => {
    if (!isEditMode.value) {
      isInvalidRankName.value = !validateRankName(val);
    }
  }
);

const handleSubmitRank = async () => {
  // Validate form
  if (!newRank.value.name || newRank.value.name.trim() === '') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Tên rank không được để trống!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }
  if (!isEditMode.value && isInvalidRankName.value) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Tên rank chỉ được phép là Bạc, Vàng hoặc Kim Cương!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }
  if (newRank.value.status === '' || newRank.value.status === null || newRank.value.status === undefined) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Vui lòng chọn trạng thái!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }
  if (newRank.value.minSpend === '' || newRank.value.minSpend === null || isNaN(Number(newRank.value.minSpend)) || Number(newRank.value.minSpend) < 0) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Chi tiêu tối thiểu phải là số lớn hơn hoặc bằng 0!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }
  if (newRank.value.pointMultiplier === '' || newRank.value.pointMultiplier === null || isNaN(Number(newRank.value.pointMultiplier)) || Number(newRank.value.pointMultiplier) < 1) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Hệ số điểm phải là số lớn hơn hoặc bằng 1!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }

  if (isEditMode.value && editIndex.value !== null) {
    // Update existing rank
    ranks.value[editIndex.value] = {
      ...newRank.value,
      minSpend: Number(newRank.value.minSpend),
      pointMultiplier: Number(newRank.value.pointMultiplier),
      status: Number(newRank.value.status),
      type: newRank.value.type
    };
    // Show success toast after update
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Cập nhật rank thành công!',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  } else {
    // Thêm mới rank
    const payload = {
      rankName: newRank.value.name,
      minSpent: Number(newRank.value.minSpend),
      pointMultiplier: Number(newRank.value.pointMultiplier),
      status: Number(newRank.value.status)
    };
    try {
      await createRank(payload);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Thêm rank thành công!',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
      await fetchRanks();
    } catch (error) {
      let status = error?.response?.status || error?.response?.data?.status || 'Lỗi';
      let message = error?.response?.data?.message || 'Thêm rank thất bại!';
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: `Lỗi ${status}`,
        text: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }
  }

  // Close modal after submit
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

const closeModal = () => {
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement); // <-- Sử dụng getOrCreateInstance
  modal.hide();
};

// Thêm biến để kiểm soát trạng thái hover restriction icon
const showRestriction = ref({});

const handleStatusChange = (rank) => {
  // Luôn show toast cảnh báo khi cố ý thao tác
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: 'Không được tắt trạng thái rank!',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
  // Luôn giữ trạng thái là 1
  rank.status = 1;
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

const resetRankModal = () => {
  isEditMode.value = false;
  editIndex.value = null;
  newRank.value = {
    id: '',
    name: '',
    type: 'GOLD',
    status: '1',
    minSpend: 0,
    pointMultiplier: 1
  };
};

let modalElement = null;

onMounted(() => {
  modalElement = document.getElementById('addRankModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', resetRankModal);
  }
  fetchRanks(); // Gọi API khi component mount
});

onUnmounted(() => {
  if (modalElement) {
    modalElement.removeEventListener('hidden.bs.modal', resetRankModal);
  }
});
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.modal-dialog {
  max-width: 450px !important;
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

.status-active {
  display: inline-block;
  background: #d4f5dd;
  color: #218838;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 1rem;
  border: 1px solid #b2e6c1;
  box-shadow: 0 1px 2px rgba(34,197,94,0.08);
  letter-spacing: 0.5px;
}

.status-label-active {
  display: inline-block;
  background: #d4edda;
  color: #218838;
  font-weight: 400;
  border-radius: 6px;
  padding: 1px 8px;
  font-size: 0.88rem;
  border: 1px solid #c3e6cb;
  vertical-align: middle;
  margin-left: 0;
  margin-right: 0;
  box-shadow: none;
  letter-spacing: 0.1px;
  font-family: inherit;
}

/* New styles for rank warning label */
.rank-warning-label {
  background: #fff3cd;
  border: 1.5px solid #ffeeba;
  border-radius: 8px;
  padding: 10px 18px;
  margin-bottom: 18px;
  font-size: 1.08rem;
  color: #856404;
  font-family: 'Segoe UI', 'Arial', sans-serif;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.08);
}

.rank-warning-icon {
  width: 28px;
  height: 28px;
  margin-right: 8px;
}

.rank-warning-text {
  font-weight: 600;
  letter-spacing: 0.2px;
  font-size: 1.08rem;
}
</style>