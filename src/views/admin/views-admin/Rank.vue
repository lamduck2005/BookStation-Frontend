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
          <input type="text" class="form-control" placeholder="Nhập  tên rank , email" v-model="searchQuery" />
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
      <button class="btn btn-primary btn-sm py-2" @click="openAddModal"
        style="background-color: #33304e; border-color: #33304e;">
        <i class="bi bi-plus-circle me-1"></i> Thêm mới
      </button>
    </div>

    <!-- Danh sách Rank -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách Rank</strong>
      </div>

      <div class="p-3">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên rank</th>
              <th>Chi tiêu tối thiểu</th>
              <th>Hệ số điểm</th>
              <th>Email người dùng</th>
              <th style="width: 200px;">Trạng thái</th>
              <th style="width: 100px;">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rank, index) in ranks" :key="rank.id">
              <td>{{ index + 1 }}</td>
              <td>{{ rank.name }}</td>
              <td>{{ rank.minSpend.toLocaleString() }} VND</td>
              <td>{{ rank.pointMultiplier }}x</td>
              <td>{{ rank.email }}</td>
              <td style="width: 200px;">
                <ToggleStatus :id="rank.id" v-model="rank.status" :true-value="1" :false-value="0"
                  active-text="Hoạt động" inactive-text="Không hoạt động" @change="handleStatusChange(rank, $event)" />
              </td>
              <td style="width: 100px;">
                <EditButton @click="openEditModal(rank, index)" />
              </td>
            </tr>
          </tbody>
        </table>

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
              <!-- Tên rank (enum) -->
              <div class="col-12">
                <label for="rankName" class="form-label">
                  Tên rank <span class="text-danger">*</span>
                </label>
                <select class="form-select" id="rankName" v-model="newRank.name" required>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Diamond">Diamond</option>
                </select>
              </div>

              <!-- Email người dùng -->
              <div class="col-12">
                <label for="rankEmail" class="form-label">
                  Email người dùng <span class="text-danger">*</span>
                </label>
                <input type="email" class="form-control" id="rankEmail" placeholder="Nhập email người dùng" v-model="newRank.email"
                  required />
              </div>

              <!-- Trạng thái -->
              <div class="col-12">
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
import ToggleStatus from '@/components/common/ToggleStatus.vue';
import Pagination from '@/components/common/Pagination.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';
import { getRanks } from '@/services/admin/rank';

const searchQuery = ref('');
const selectedStatus = ref('');

// New/Edit rank form data
const newRank = ref({
  id: '',
  name: '',
  type: 'GOLD',
  email: '',
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
const ranks = ref([
  {
    id: 1,
    name: 'Gold',
    type: 'GOLD',
    minSpend: 1000000,
    pointMultiplier: 2,
    email: 'gold@example.com',
    status: 1
  },
  {
    id: 2,
    name: 'Silver',
    type: 'SILVER',
    minSpend: 500000,
    pointMultiplier: 1.5,
    email: 'silver@example.com',
    status: 1
  },
  {
    id: 3,
    name: 'Diamond',
    type: 'DIAMOND',
    minSpend: 2000000,
    pointMultiplier: 3,
    email: 'diamond@example.com',
    status: 1
  }
]);

const fetchRanks = async () => {
  try {
    const response = await getRanks();
    // response.data là mảng rank, cần map lại cho đúng cấu trúc bảng
    ranks.value = response.data.map(item => ({
      id: item.id,
      name: item.rankName,
      minSpend: item.minSpent,
      pointMultiplier: item.pointMultiplier,
      email: item.user?.email || '',
      status: item.status === null ? 1 : item.status // Nếu status null thì mặc định là 1 (hoạt động)
    }));
  } catch (error) {
    console.error('Lỗi khi lấy danh sách rank:', error);
  }
};

// Đảm bảo modal không bị kẹt backdrop hoặc tối màn hình:
// Luôn dùng Modal.getOrCreateInstance để tránh tạo nhiều instance và lỗi backdrop
const openAddModal = () => {
  isEditMode.value = false;
  newRank.value = {
    id: '',
    name: '',
    type: 'GOLD',
    email: '',
    status: '1',
    minSpend: 0,
    pointMultiplier: 1
  };

  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement); // <-- Sử dụng getOrCreateInstance
  modal.show();
};

const openEditModal = (rank, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  newRank.value = { ...rank };
  // Convert status to string for v-model
  newRank.value.status = String(rank.status);
  // Convert type to string for v-model
  newRank.value.type = String(rank.type);
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement); // <-- Sử dụng getOrCreateInstance
  modal.show();
};

const handleSubmitRank = () => {
  // Validate form
  if (!newRank.value.id || !newRank.value.name || !newRank.value.email || !newRank.value.type) {
    alert('Vui lòng điền đầy đủ các trường bắt buộc!');
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
    console.log('Rank updated:', newRank.value);
  } else {
    // Add new rank only
    const newId = Math.max(...ranks.value.map(r => r.id)) + 1;
    ranks.value.push({
      id: newId,
      name: newRank.value.name,
      type: newRank.value.type,
      minSpend: Number(newRank.value.minSpend),
      pointMultiplier: Number(newRank.value.pointMultiplier),
      email: newRank.value.email,
      status: Number(newRank.value.status)
    });
    console.log('New rank added:', newRank.value);
  }

  // Close modal after submit
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement); // <-- Sử dụng getOrCreateInstance
  modal.hide();
};

const closeModal = () => {
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement); // <-- Sử dụng getOrCreateInstance
  modal.hide();
};

const handleStatusChange = (rank, newStatus) => {
  console.log(`Rank ${rank.name} status changed to: ${newStatus}`);
};

// Pagination functions
const handlePrev = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    // Gọi API để load dữ liệu trang trước
    console.log(`Loading page ${currentPage.value}`);
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    currentPage.value++;
    // Gọi API để load dữ liệu trang sau
    console.log(`Loading page ${currentPage.value}`);
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 0;
  console.log(`Page size changed to ${newSize}`);
};

const resetRankModal = () => {
  isEditMode.value = false;
  editIndex.value = null;
  newRank.value = {
    id: '',
    name: '',
    type: 'GOLD',
    email: '',
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
</style>