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
        <div class="col-md-3">
          <label class="form-label">Tìm kiếm:</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập tên event" 
            v-model="searchQuery" 
            @input="debouncedSearch"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">Loại sự kiện</label>
          <select class="form-select" v-model="selectedEventType" @change="applyFilters">
            <option value="">Tất cả loại sự kiện</option>
            <option v-for="type in eventTypes" :key="type.value" :value="type.value">
              {{ type.displayName }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Danh mục</label>
          <select class="form-select" v-model="selectedCategory" @change="applyFilters">
            <option value="">Tất cả danh mục</option>
            <option v-for="category in eventCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus" @change="applyFilters">
            <option value="">Tất cả trạng thái</option>
            <option v-for="status in eventStatuses" :key="status.value" :value="status.value">
              {{ status.displayName }}
            </option>
          </select>
        </div>
      </div>
      <div class="row g-3 m-2 mt-2 p-0">
        <div class="col-md-4">
          <label class="form-label">Từ ngày:</label>
          <input 
            type="date" 
            class="form-control" 
            v-model="startDateFilter" 
            @change="applyFilters"
            placeholder="Chọn ngày bắt đầu"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Đến ngày:</label>
          <input 
            type="date" 
            class="form-control" 
            v-model="endDateFilter" 
            @change="applyFilters"
            placeholder="Chọn ngày kết thúc"
          />
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

    <!-- Danh sách Event -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách Event</strong>
      </div>

      <div class="p-3">
        <div class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th style="min-width: 50px;">STT</th>
                <th style="min-width: 100px;">Ảnh</th>
                <th style="min-width: 200px;">Tên Event</th>
                <th style="min-width: 120px;">Loại sự kiện</th>
                <th style="min-width: 120px;">Danh mục</th>
                <th style="min-width: 150px;">Thời gian</th>
                <th style="min-width: 100px;">Người tham gia</th>
                <th style="min-width: 100px;">Trạng thái</th>
                <th style="min-width: 120px;">Thao tác</th>
              </tr>
            </thead>
          <tbody>
            <tr v-for="(event, index) in events" :key="event.id">
              <td>{{ (currentPage * pageSize) + index + 1 }}</td>
              <td>
                <div class="event-image-container">
                  <img 
                    v-if="event.imageUrl" 
                    :src="event.imageUrl" 
                    :alt="event.name"
                    class="event-image"
                    @error="handleImageError"
                  />
                  <div v-else class="no-image-placeholder">
                    <i class="bi bi-image text-muted"></i>
                    <small class="text-muted">Không có ảnh</small>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <strong>{{ event.name }}</strong>
                  <div class="text-muted small">{{ event.description }}</div>
                </div>
              </td>
              <td>
                <span class="badge bg-info">{{ event.eventTypeName }}</span>
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
                  v-model="newEvent.eventName"
                  placeholder="Nhập tên event"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Loại sự kiện <span class="text-danger">*</span></label>
                <select class="form-select" v-model="newEvent.eventType">
                  <option value="">Chọn loại sự kiện</option>
                  <option v-for="type in eventTypes" :key="type.value" :value="type.value">
                    {{ type.displayName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Danh mục <span class="text-danger">*</span></label>
                <select class="form-select" v-model="newEvent.eventCategoryId">
                  <option value="">Chọn danh mục</option>
                  <option v-for="category in eventCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Trạng thái <span class="text-danger">*</span></label>
                <select class="form-select" v-model="newEvent.status">
                  <option value="">Chọn trạng thái</option>
                  <option v-for="status in eventStatuses" :key="status.value" :value="status.value">
                    {{ status.displayName }}
                  </option>
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
                <label class="form-label">Hình ảnh URL</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="newEvent.imageUrl"
                  placeholder="Nhập URL hình ảnh"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Địa điểm</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="newEvent.location"
                  placeholder="Nhập địa điểm tổ chức"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Loại hình</label>
                <select class="form-select" v-model="newEvent.isOnline">
                  <option value="">Chọn loại hình</option>
                  <option :value="true">Online</option>
                  <option :value="false">Offline</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Quy định</label>
              <textarea 
                class="form-control" 
                rows="3"
                v-model="newEvent.rules"
                placeholder="Nhập quy định của sự kiện"
              ></textarea>
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
import { getEvents, createEvent, updateEvent, deleteEvent, getEventTypes, getEventCategoriesDropdown, getEventStatuses } from '@/services/admin/event';
import Swal from 'sweetalert2';

const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');
const selectedEventType = ref('');
const startDateFilter = ref('');
const endDateFilter = ref('');

// New/Edit event form data
const newEvent = ref({
  id: '',
  eventName: '',
  description: '',
  eventType: '',
  eventCategoryId: '',
  status: 'DRAFT',
  startDate: '',
  endDate: '',
  maxParticipants: 100,
  imageUrl: '',
  location: '',
  rules: '',
  isOnline: false
});

// Data for dropdowns
const eventTypes = ref([]);
const eventCategories = ref([]);
const eventStatuses = ref([]);

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
    
    // Thêm các filter parameters
    if (searchQuery.value) params.name = searchQuery.value;
    if (selectedCategory.value !== '') params.categoryId = selectedCategory.value;
    if (selectedStatus.value !== '') params.status = selectedStatus.value;
    if (selectedEventType.value !== '') params.eventType = selectedEventType.value;
    if (startDateFilter.value) {
      params.startDate = new Date(startDateFilter.value).getTime();
    }
    if (endDateFilter.value) {
      params.endDate = new Date(endDateFilter.value + 'T23:59:59').getTime();
    }
    
    console.log('Calling API with params:', params);
    
    const response = await getEvents(params);
    const data = response.data ? response.data : response;
    
    console.log('API response:', data);
    
    events.value = data.content.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      eventType: item.eventType,
      eventTypeName: item.eventTypeName,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      startDate: item.startDate,
      endDate: item.endDate,
      maxParticipants: item.maxParticipants,
      currentParticipants: item.currentParticipants,
      entryFee: item.entryFee,
      imageUrl: item.imageUrl,
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

// Load event types and categories
const loadDropdownData = async () => {
  try {
    const [typesResponse, categoriesResponse, statusesResponse] = await Promise.all([
      getEventTypes(),
      getEventCategoriesDropdown(),
      getEventStatuses()
    ]);
    
    eventTypes.value = typesResponse.data || [];
    eventCategories.value = categoriesResponse.data || [];
    eventStatuses.value = statusesResponse.data || [];
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu dropdown:', error);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Lỗi khi tải dữ liệu dropdown!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }
};

// Watch filters and pagination - chỉ watch pageSize và currentPage
watch([pageSize], () => {
  currentPage.value = 0; // Reset to first page when changing page size
  fetchEvents();
});

watch([currentPage], () => {
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
  // Backend trả về number, cần map thành text
  switch (status) {
    case 0: return 'Bản nháp';
    case 1: return 'Đã công bố';
    case 2: return 'Đang diễn ra';
    case 3: return 'Đã kết thúc';
    case 4: return 'Đã hủy';
    default: return 'Không xác định';
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 0: return 'status-draft';
    case 1: return 'status-published';
    case 2: return 'status-active';
    case 3: return 'status-inactive';
    case 4: return 'status-cancelled';
    default: return 'status-inactive';
  }
};

// Modal functions
const openAddModal = () => {
  isEditMode.value = false;
  newEvent.value = {
    id: '',
    eventName: '',
    description: '',
    eventType: '',
    eventCategoryId: '',
    status: 'DRAFT',
    startDate: '',
    endDate: '',
    maxParticipants: 100,
    imageUrl: '',
    location: '',
    rules: '',
    isOnline: false
  };
  const modalElement = document.getElementById('addEventModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const openEditModal = (event, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  newEvent.value = {
    id: event.id,
    eventName: event.name,
    description: event.description,
    eventType: event.eventType,
    eventCategoryId: event.categoryId,
    status: event.status,
    startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
    endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
    maxParticipants: event.maxParticipants,
    imageUrl: event.imageUrl || '',
    location: event.location || '',
    rules: event.rules || '',
    isOnline: event.isOnline
  };
  const modalElement = document.getElementById('addEventModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const handleSubmitEvent = async () => {
  // Validate form
  if (!newEvent.value.eventName || newEvent.value.eventName.trim() === '') {
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

  if (!newEvent.value.eventType) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Vui lòng chọn loại sự kiện!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }

  if (!newEvent.value.eventCategoryId) {
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
      eventName: newEvent.value.eventName,
      description: newEvent.value.description,
      eventType: newEvent.value.eventType,
      eventCategoryId: Number(newEvent.value.eventCategoryId),
      status: newEvent.value.status,
      startDate: new Date(newEvent.value.startDate).getTime(),
      endDate: new Date(newEvent.value.endDate).getTime(),
      maxParticipants: Number(newEvent.value.maxParticipants),
      imageUrl: newEvent.value.imageUrl,
      location: newEvent.value.location,
      rules: newEvent.value.rules,
      isOnline: Boolean(newEvent.value.isOnline)
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
    console.error('Error creating/updating event:', error);
    let status = error?.response?.status || 'Lỗi';
    let message = error?.response?.data?.message || 'Thao tác thất bại!';
    
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: `Lỗi ${status}`,
      text: message,
      showConfirmButton: false,
      timer: 5000,
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
      console.error('Error deleting event:', error);
      let status = error?.response?.status || 'Lỗi';
      let message = error?.response?.data?.message || 'Xóa event thất bại!';
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: `Lỗi ${status}`,
        text: message,
        showConfirmButton: false,
        timer: 5000,
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

// Filter functions
const applyFilters = () => {
  console.log('Applying filters:', {
    searchQuery: searchQuery.value,
    selectedCategory: selectedCategory.value,
    selectedStatus: selectedStatus.value,
    selectedEventType: selectedEventType.value,
    startDateFilter: startDateFilter.value,
    endDateFilter: endDateFilter.value
  });
  currentPage.value = 0; // Reset to first page when applying filters
  fetchEvents();
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedStatus.value = '';
  selectedEventType.value = '';
  startDateFilter.value = '';
  endDateFilter.value = '';
  currentPage.value = 0;
  fetchEvents();
};

// Debounce function for search input
let searchTimeout = null;
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500); // Wait 500ms after user stops typing
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
    eventName: '',
    description: '',
    eventType: '',
    eventCategoryId: '',
    status: 'DRAFT',
    startDate: '',
    endDate: '',
    maxParticipants: 100,
    imageUrl: '',
    location: '',
    rules: '',
    isOnline: false
  };
};

let modalElement = null;

onMounted(() => {
  modalElement = document.getElementById('addEventModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', resetEventModal);
  }
  loadDropdownData();
  fetchEvents();
});

onUnmounted(() => {
  if (modalElement) {
    modalElement.removeEventListener('hidden.bs.modal', resetEventModal);
  }
});

// Handle image error
const handleImageError = (event) => {
  event.target.style.display = 'none';
  const container = event.target.parentElement;
  container.innerHTML = `
    <div class="no-image-placeholder">
      <i class="bi bi-exclamation-triangle text-warning"></i>
      <small class="text-muted">Lỗi tải ảnh</small>
    </div>
  `;
};
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

.status-draft {
  background: #e2e3e5;
  color: #495057;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 0.9rem;
  border: 1px solid #d6d8db;
}

.status-published {
  background: #d1ecf1;
  color: #0c5460;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 0.9rem;
  border: 1px solid #bee5eb;
}

.status-cancelled {
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

.badge {
  font-size: 0.8rem;
  padding: 0.35em 0.65em;
}

.bg-info {
  background-color: #0dcaf0 !important;
  color: #000 !important;
}

.event-image-container {
  width: 80px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.event-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  border-radius: 6px;
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px;
  color: #6c757d;
}

.no-image-placeholder i {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.no-image-placeholder small {
  font-size: 0.7rem;
  line-height: 1.2;
}
</style>
