<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Point</strong>
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
          <input type="text" class="form-control" placeholder="Nhập mã đơn hàng, email" v-model="searchQuery" />
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
        <strong>Lịch sử Point</strong>
      </div>

      <div class="p-3">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>email</th>
              <th>mã đơn hàng</th>
              <th>số điểm nhận</th>
              <th>chi tiêu tối thiểu</th>
              <th>điểm sử dụng</th>
              <th>mô tả</th>
              <th style="width: 100px;">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(point, index) in points" :key="point.id">
              <td>{{ index + 1 }}</td>
              <td>{{ point.email }}</td>
              <td>{{ point.orderId }}</td>
              <td>{{ point.pointReceived }}</td>
              <td>{{ point.minSpend.toLocaleString() }} VND</td>
              <td>{{ point.pointUsed }}</td>
              <td>{{ point.description }}</td>
              <td style="width: 100px;" class="d-flex gap-1">
                <EditButton @click="openEditModal(point, index)" />
                <DeleteButton @click="handleDeletePoint(index)" />
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
  </div> <!-- Add/Edit Point Modal -->
  <div class="modal fade" id="addRankModal" tabindex="-1" aria-labelledby="addRankModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #ecae9e;">
          <h5 class="modal-title" id="addRankModalLabel">
            <i class="bi me-2 bi-plus-circle"></i>
            {{ isEditMode ? 'Sửa Point' : 'Thêm Point' }}
          </h5><button type="button" class="custom-close-btn" data-bs-dismiss="modal" aria-label="Close">
            <img src="https://cdn-icons-png.flaticon.com/128/694/694604.png" alt="Close" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmitPoint">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Email <span class="text-danger">*</span></label>
                <input type="email" class="form-control" v-model="newPoint.email" required />
              </div>
              <div class="col-12">
                <label class="form-label">Mã đơn hàng <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="newPoint.orderId" required placeholder="Nhập mã đơn hàng" />
              </div>
              <div class="col-12">
                <label class="form-label">Số điểm nhận</label>
                <input type="number" class="form-control" v-model="newPoint.pointReceived" min="0" />
              </div>
              <div class="col-12">
                <label class="form-label">Chi tiêu tối thiểu (VND)</label>
                <input type="number" class="form-control" v-model="newPoint.minSpend" min="0" />
              </div>
              <div class="col-12">
                <label class="form-label">Điểm sử dụng</label>
                <input type="number" class="form-control" v-model="newPoint.pointUsed" min="0" />
              </div>
              <div class="col-12">
                <label class="form-label">Mô tả</label>
                <input type="text" class="form-control" v-model="newPoint.description" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Hủy
          </button> <button type="button" class="btn btn-primary" @click="handleSubmitPoint"
            style="background-color: #33304e; border-color: #33304e;">
            {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import EditButton from '@/components/Common/EditButton.vue';
import Pagination from '@/components/Common/Pagination.vue';
import DeleteButton from '@/components/Common/DeleteButton.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';

const searchQuery = ref('');
const selectedStatus = ref('');

// New/Edit rank form data
const newRank = ref({
  id: '',
  name: '',
  email: '',
  status: '1',
  minSpend: 0,
  pointMultiplier: 1
});

// Popup form data cho Point
const newPoint = ref({
  id: '',
  email: '',
  orderId: '',
  pointReceived: 0,
  minSpend: 0,
  pointUsed: 0,
  description: ''
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
const points = ref([
  {
    id: 1,
    email: 'user1@example.com',
    orderId: 'ORD001',
    pointReceived: 100,
    minSpend: 500000,
    pointUsed: 20,
    description: 'Tích điểm khi mua sách'
  },
  {
    id: 2,
    email: 'user2@example.com',
    orderId: 'ORD002',
    pointReceived: 200,
    minSpend: 1000000,
    pointUsed: 50,
    description: 'Tích điểm khi mua combo'
  },
  {
    id: 3,
    email: 'user3@example.com',
    orderId: 'ORD003',
    pointReceived: 150,
    minSpend: 750000,
    pointUsed: 0,
    description: 'Tích điểm khi mua sách'
  },
  {
    id: 4,
    email: 'user4@example.com',
    orderId: 'ORD004',
    pointReceived: 300,
    minSpend: 2000000,
    pointUsed: 100,
    description: 'Khuyến mãi đặc biệt'
  },
  {
    id: 5,
    email: 'user5@example.com',
    orderId: 'ORD005',
    pointReceived: 50,
    minSpend: 250000,
    pointUsed: 10,
    description: 'Tích điểm khi mua sách'
  }
]);

// Đảm bảo modal không bị kẹt backdrop hoặc tối màn hình:
// Luôn dùng Modal.getOrCreateInstance để tránh tạo nhiều instance và lỗi backdrop
const openAddModal = () => {
  isEditMode.value = false;
  newPoint.value = {
    id: '',
    email: '',
    orderId: '',
    pointReceived: 0,
    minSpend: 0,
    pointUsed: 0,
    description: ''
  };
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const openEditModal = (point, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  newPoint.value = { ...point };
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const handleSubmitRank = () => {
  // Validate form
  if (!newRank.value.id || !newRank.value.name || !newRank.value.email) {
    alert('Vui lòng điền đầy đủ các trường bắt buộc!');
    return;
  }

  if (isEditMode.value && editIndex.value !== null) {
    // Update existing rank
    points.value[editIndex.value] = {
      ...newRank.value,
      minSpend: Number(newRank.value.minSpend),
      pointMultiplier: Number(newRank.value.pointMultiplier),
      status: Number(newRank.value.status)
    };
    console.log('Rank updated:', newRank.value);
  } else {
    // Add new rank only
    const newId = Math.max(...points.value.map(r => r.id)) + 1;
    points.value.push({
      id: newId,
      name: newRank.value.name,
      minSpend: Number(newRank.value.minSpend),
      pointMultiplier: Number(newRank.value.pointMultiplier),
      email: newRank.value.email,
      status: Number(newRank.value.status)
    });
    console.log('New rank added:', newRank.value);
  }

  // Close modal after submit
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

const handleSubmitPoint = () => {
  if (!newPoint.value.email || !newPoint.value.orderId) {
    alert('Vui lòng nhập đầy đủ email và id đơn hàng!');
    return;
  }
  if (isEditMode.value && editIndex.value !== null) {
    points.value[editIndex.value] = {
      ...newPoint.value,
      pointReceived: Number(newPoint.value.pointReceived),
      minSpend: Number(newPoint.value.minSpend),
      pointUsed: Number(newPoint.value.pointUsed)
    };
  } else {
    const newId = points.value.length ? Math.max(...points.value.map(p => p.id)) + 1 : 1;
    points.value.push({
      ...newPoint.value,
      id: newId,
      pointReceived: Number(newPoint.value.pointReceived),
      minSpend: Number(newPoint.value.minSpend),
      pointUsed: Number(newPoint.value.pointUsed)
    });
  }
  const modalElement = document.getElementById('addRankModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

const handleDeletePoint = (index) => {
  if (confirm('Bạn có chắc muốn xóa dòng này?')) {
    points.value.splice(index, 1);
  }
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
    modalElement.addEventListener('hidden.bs.modal', resetRankModal); // <-- Reset state khi modal đóng
  }
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