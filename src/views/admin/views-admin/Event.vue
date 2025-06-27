<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Event</strong>
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
            placeholder="Nhập tên event" 
            v-model="searchQuery" 
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Danh mục</label>
          <select class="form-select" v-model="selectedCategory">
            <option value="">Tất cả danh mục</option>
            <option value="1">Workshop</option>
            <option value="2">Gặp gỡ tác giả</option>
            <option value="3">Thử thách đọc sách</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Sắp diễn ra</option>
            <option value="2">Đang diễn ra</option>
            <option value="3">Đã kết thúc</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Nút thêm mới -->
    <div class="d-flex justify-content-end mb-3">
      <AddButton @click="openAddModal" />
    </div>

    <!-- Danh sách Event -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách Event</strong>
      </div>

      <div class="p-3">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên Event</th>
              <th>Danh mục</th>
              <th>Thời gian</th>
              <th>Người tham gia</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(event, index) in events" :key="event.id">
              <td>{{ (currentPage * pageSize) + index + 1 }}</td>
              <td>
                <div>
                  <strong>{{ event.name }}</strong>
                  <div class="text-muted small">{{ event.description }}</div>
                </div>
              </td>
              <td>{{ event.categoryName }}</td>
              <td>
                <div class="small">
                  <div><strong>Bắt đầu:</strong> {{ formatDate(event.startDate) }}</div>
                  <div><strong>Kết thúc:</strong> {{ formatDate(event.endDate) }}</div>
                </div>
              </td>
              <td>
                <div class="text-center">
                  <div><strong>{{ event.currentParticipants }}</strong></div>
                  <div class="text-muted small">/ {{ event.maxParticipants }}</div>
                </div>
              </td>
              <td>
                <StatusLabel 
                  :status="event.status" 
                  :statusText="getStatusText(event.status)"
                  :statusClass="getStatusClass(event.status)"
                />
              </td>
              <td>
                <div class="d-flex gap-2">
                  <EditButton @click="openEditModal(event, index)" />
                  <DeleteButton @click="confirmDeleteEvent(event.id)" />
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

  <!-- Add/Edit Event Modal -->
  <div class="modal fade" id="addEventModal" tabindex="-1" aria-labelledby="addEventModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #ecae9e;">
          <h5 class="modal-title" id="addEventModalLabel">
            {{ isEditMode ? 'Sửa Event' : 'Thêm Event' }}
          </h5>
          <button type="button" class="custom-close-btn" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmitEvent">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Tên Event <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="newEvent.name"
                  placeholder="Nhập tên event"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Danh mục <span class="text-danger">*</span></label>
                <select class="form-select" v-model="newEvent.categoryId">
                  <option value="">Chọn danh mục</option>
                  <option value="1">Workshop</option>
                  <option value="2">Gặp gỡ tác giả</option>
                  <option value="3">Thử thách đọc sách</option>
                </select>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <textarea 
                class="form-control" 
                rows="3"
                v-model="newEvent.description"
                placeholder="Nhập mô tả event"
              ></textarea>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày bắt đầu <span class="text-danger">*</span></label>
                <input 
                  type="datetime-local" 
                  class="form-control" 
                  v-model="newEvent.startDate"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày kết thúc <span class="text-danger">*</span></label>
                <input 
                  type="datetime-local" 
                  class="form-control" 
                  v-model="newEvent.endDate"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Số người tham gia tối đa</label>
                <input 
                  type="number" 
                  class="form-control" 
                  v-model="newEvent.maxParticipants"
                  min="1"
                  placeholder="Nhập số người tối đa"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Phí tham gia</label>
                <input 
                  type="number" 
                  class="form-control" 
                  v-model="newEvent.entryFee"
                  min="0"
                  placeholder="Nhập phí tham gia (VNĐ)"
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Trạng thái <span class="text-danger">*</span></label>
              <select class="form-select" v-model="newEvent.status">
                <option value="">Chọn trạng thái</option>
                <option value="1">Sắp diễn ra</option>
                <option value="2">Đang diễn ra</option>
                <option value="3">Đã kết thúc</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Hủy
          </button>
          <button type="button" class="btn btn-primary" @click="handleSubmitEvent">
            {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EditButton from '@/components/common/EditButton.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
import Pagination from '@/components/common/Pagination.vue';
import AddButton from '@/components/common/AddButton.vue';
import StatusLabel from '@/components/common/StatusLabel.vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Modal } from 'bootstrap';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/services/admin/event';
import Swal from 'sweetalert2';

const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');

// New/Edit event form data
const newEvent = ref({
  id: '',
  name: '',
  description: '',
  categoryId: '',
  startDate: '',
  endDate: '',
  maxParticipants: 100,
  entryFee: 0,
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

// Events data
const events = ref([]);

const fetchEvents = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
    };
    if (searchQuery.value) params.name = searchQuery.value;
    if (selectedCategory.value !== '') params.categoryId = selectedCategory.value;
    if (selectedStatus.value !== '') params.status = selectedStatus.value;
    
    const response = await getEvents(params);
    const data = response.data ? response.data : response;
    
    events.value = data.content.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      startDate: item.startDate,
      endDate: item.endDate,
      maxParticipants: item.maxParticipants,
      currentParticipants: item.currentParticipants,
      entryFee: item.entryFee,
      status: item.status
    }));
    
    totalPages.value = data.totalPages ?? 1;
    totalElements.value = data.totalElements ?? events.value.length;
    currentPage.value = data.pageNumber ?? currentPage.value;
    pageSize.value = data.pageSize ?? pageSize.value;
    isLastPage.value = data.last ?? (currentPage.value >= totalPages.value - 1);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách events:', error);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Lỗi khi tải danh sách events!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }
};

// Watch filters and pagination
watch([searchQuery, selectedCategory, selectedStatus, pageSize, currentPage], () => {
  fetchEvents();
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

// Status functions
const getStatusText = (status) => {
  switch (status) {
    case 1: return 'Sắp diễn ra';
    case 2: return 'Đang diễn ra';
    case 3: return 'Đã kết thúc';
    default: return 'Không xác định';
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 1: return 'status-pending';
    case 2: return 'status-active';
    case 3: return 'status-inactive';
    default: return 'status-inactive';
  }
};

// Modal functions
const openAddModal = () => {
  isEditMode.value = false;
  newEvent.value = {
    id: '',
    name: '',
    description: '',
    categoryId: '',
    startDate: '',
    endDate: '',
    maxParticipants: 100,
    entryFee: 0,
    status: '1'
  };
  const modalElement = document.getElementById('addEventModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const openEditModal = (event, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  newEvent.value = {
    ...event,
    categoryId: String(event.categoryId),
    status: String(event.status),
    startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
    endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : ''
  };
  const modalElement = document.getElementById('addEventModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const handleSubmitEvent = async () => {
  // Validate form
  if (!newEvent.value.name || newEvent.value.name.trim() === '') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Tên event không được để trống!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }

  if (!newEvent.value.categoryId) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Vui lòng chọn danh mục!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }

  if (!newEvent.value.startDate || !newEvent.value.endDate) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Vui lòng nhập thời gian bắt đầu và kết thúc!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }

  if (new Date(newEvent.value.startDate) >= new Date(newEvent.value.endDate)) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }

  try {
    const payload = {
      name: newEvent.value.name,
      description: newEvent.value.description,
      categoryId: Number(newEvent.value.categoryId),
      startDate: new Date(newEvent.value.startDate).getTime(),
      endDate: new Date(newEvent.value.endDate).getTime(),
      maxParticipants: Number(newEvent.value.maxParticipants),
      entryFee: newEvent.value.entryFee ? Number(newEvent.value.entryFee) : null,
      status: Number(newEvent.value.status)
    };

    if (isEditMode.value) {
      await updateEvent(newEvent.value.id, payload);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Cập nhật event thành công!',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
    } else {
      await createEvent(payload);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Thêm event thành công!',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
    }

    await fetchEvents();
    closeModal();
  } catch (error) {
    let status = error?.response?.status || error?.response?.data?.status || 'Lỗi';
    let message = error?.response?.data?.message || 'Thao tác thất bại!';
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
};

const confirmDeleteEvent = async (id) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa',
    text: 'Bạn có chắc chắn muốn xóa event này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  });

  if (result.isConfirmed) {
    try {
      await deleteEvent(id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Xóa event thành công!',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
      await fetchEvents();
    } catch (error) {
      let message = error?.response?.data?.message || 'Xóa event thất bại!';
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }
  }
};

const closeModal = () => {
  const modalElement = document.getElementById('addEventModal');
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

const resetEventModal = () => {
  isEditMode.value = false;
  editIndex.value = null;
  newEvent.value = {
    id: '',
    name: '',
    description: '',
    categoryId: '',
    startDate: '',
    endDate: '',
    maxParticipants: 100,
    entryFee: 0,
    status: '1'
  };
};

let modalElement = null;

onMounted(() => {
  modalElement = document.getElementById('addEventModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', resetEventModal);
  }
  fetchEvents();
});

onUnmounted(() => {
  if (modalElement) {
    modalElement.removeEventListener('hidden.bs.modal', resetEventModal);
  }
});
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.modal-dialog {
  max-width: 700px !important;
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

.status-pending {
  background: #fff3cd;
  color: #856404;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 0.9rem;
  border: 1px solid #ffeeba;
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
</style>
