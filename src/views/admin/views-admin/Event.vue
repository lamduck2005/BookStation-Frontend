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
          <!-- Nút Fake Data ở đầu modal body -->
          <div v-if="!isEditMode" class="mb-3 text-end">
            <button 
              type="button" 
              class="btn btn-outline-warning"
              @click="fillFakeData"
              title="Điền dữ liệu mẫu để test nhanh"
            >
              🎲 Fake Data (Test)
            </button>
          </div>
          
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
              <div class="col-12 mb-3">
                <MultiImageUpload
                  v-model="newEvent.imageUrls"
                  label="Hình ảnh Event (Tối đa 5 ảnh)"
                  :max-files="5"
                  @upload-success="handleImageUploadSuccess"
                  @upload-error="handleImageUploadError"
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
import MultiImageUpload from '@/components/common/MultiImageUpload.vue';
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
  imageUrls: [], // Array URLs từ server (tối đa 5 ảnh)
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
      imageUrl: Array.isArray(item.imageUrls) && item.imageUrls.length > 0 ? item.imageUrls[0] : '', // Ảnh đầu tiên để hiển thị
      imageUrls: item.imageUrls || [], // Array đầy đủ để edit
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
  console.log('=== DEBUG: openAddModal called ===');
  console.log('isEditMode.value:', isEditMode.value);
  
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
    imageUrls: [], // Array rỗng cho upload nhiều ảnh
    location: '',
    rules: '',
    isOnline: false
  };
  
  console.log('=== DEBUG: Opening Add Modal ===');
  console.log('newEvent.value.imageUrls:', newEvent.value.imageUrls);
  
  const modalElement = document.getElementById('addEventModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const openEditModal = (event, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  
  // Đảm bảo imageUrls luôn là mảng
  const imageUrls = Array.isArray(event.imageUrls) ? event.imageUrls : 
                   event.imageUrls ? [event.imageUrls] : [];
  
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
    imageUrls: imageUrls, // Array URLs
    location: event.location || '',
    rules: event.rules || '',
    isOnline: event.isOnline
  };
  
  console.log('=== DEBUG: Opening Edit Modal ===');
  console.log('Original event.imageUrls:', event.imageUrls);
  console.log('newEvent.value.imageUrls:', newEvent.value.imageUrls);
  
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
    // Đảm bảo imageUrls là mảng
    const imageUrls = Array.isArray(newEvent.value.imageUrls) ? newEvent.value.imageUrls : [];
    
    const payload = {
      eventName: newEvent.value.eventName.trim(),
      description: newEvent.value.description?.trim() || '',
      eventType: newEvent.value.eventType,
      eventCategoryId: Number(newEvent.value.eventCategoryId),
      status: newEvent.value.status,
      startDate: new Date(newEvent.value.startDate).getTime(),
      endDate: new Date(newEvent.value.endDate).getTime(),
      maxParticipants: Number(newEvent.value.maxParticipants) || 100,
      imageUrls: imageUrls, // Gửi array URLs
      location: newEvent.value.location?.trim() || '',
      rules: newEvent.value.rules?.trim() || '',
      isOnline: Boolean(newEvent.value.isOnline)
    };

    console.log('=== DEBUG: Payload gửi lên server ===');
    console.log('imageUrls array:', imageUrls);
    console.log('imageUrls length:', imageUrls.length);
    console.log('Full payload:', payload);

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
      const response = await createEvent(payload);
      console.log('=== DEBUG: Response từ server ===');
      console.log(response);
      
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
    
    // Xử lý lỗi chi tiết hơn
    let title = 'Lỗi không xác định';
    let message = 'Có lỗi xảy ra khi thực hiện thao tác';
    
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      title = 'Lỗi kết nối';
      message = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    } else if (error.response) {
      title = `Lỗi ${error.response.status}`;
      message = error.response.data?.message || error.response.statusText || 'Lỗi từ server';
    } else if (error.request) {
      title = 'Lỗi kết nối';
      message = 'Server không phản hồi. Vui lòng thử lại sau.';
    }
    
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'Đồng ý'
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

// Image upload handlers
const handleImageUploadSuccess = (imageUrls) => {
  console.log('=== DEBUG: Images uploaded successfully ===');
  console.log('imageUrls received:', imageUrls);
  console.log('newEvent.value.imageUrls after upload:', newEvent.value.imageUrls);
  
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: `Upload ${Array.isArray(imageUrls) ? imageUrls.length : 1} ảnh thành công!`,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
};

const handleImageUploadError = (error) => {
  console.error('Image upload error:', error);
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: 'Lỗi upload ảnh!',
    text: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi upload ảnh',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true
  });
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
    imageUrls: [], // Reset mảng ảnh rỗng
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

// Fake data function
const fillFakeData = () => {
  console.log('=== DEBUG: fillFakeData called ===');
  console.log('isEditMode.value:', isEditMode.value);
  
  // Generate unique name with timestamp
  const timestamp = Date.now();
  const eventNames = [
    'Sự kiện ra mắt sách mới',
    'Hội thảo văn học',
    'Buổi gặp gỡ tác giả',
    'Triển lãm sách hay',
    'Workshop viết truyện',
    'Cuộc thi đọc sách',
    'Thảo luận nhóm đọc',
    'Ký tặng sách mới',
    'Hội chợ sách cũ',
    'Câu lạc bộ sách'
  ];
  
  const descriptions = [
    'Một sự kiện thú vị dành cho những người yêu sách và văn học.',
    'Cơ hội tuyệt vời để gặp gỡ và trao đổi với các tác giả nổi tiếng.',
    'Khám phá những cuốn sách hay và chia sẻ kinh nghiệm đọc sách.',
    'Tham gia để trải nghiệm những hoạt động bổ ích về văn học.',
    'Sự kiện độc đáo mang đến những trải nghiệm mới mẻ cho độc giả.'
  ];
  
  const locations = [
    'Thư viện Trung tâm TP.HCM',
    'Nhà văn hóa Thanh niên',
    'Trung tâm Hội nghị Quốc gia',
    'Trường Đại học Khoa học Xã hội và Nhân văn',
    'Không gian văn hóa Đông Tây',
    'Bookstore Café Downtown',
    'Trung tâm Sách Fahasa'
  ];
  
  const rules = [
    'Vui lòng đến đúng giờ. Mang theo giấy tờ tùy thân. Không mang đồ ăn vào sự kiện.',
    'Cần đăng ký trước khi tham gia. Trang phục lịch sự. Tắt điện thoại trong buổi thảo luận.',
    'Độ tuổi từ 16 trở lên. Mang theo sách để chia sẻ. Không chụp ảnh khi chưa được phép.',
    'Số lượng có hạn, đăng ký sớm. Có phần quà cho người tham gia. Không hút thuốc trong khu vực sự kiện.'
  ];
  
  // Generate random dates (next 7-30 days)
  const now = new Date();
  const startDate = new Date(now.getTime() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + (Math.random() * 3 + 2) * 60 * 60 * 1000);
  
  // Pick random values
  const randomEventName = eventNames[Math.floor(Math.random() * eventNames.length)];
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  const randomRules = rules[Math.floor(Math.random() * rules.length)];
  const randomMaxParticipants = [50, 100, 150, 200, 300][Math.floor(Math.random() * 5)];
  
  // Random select from dropdown data
  const randomEventType = eventTypes.value.length > 0 ? 
    eventTypes.value[Math.floor(Math.random() * eventTypes.value.length)].value : 'WORKSHOP';
  
  const randomCategoryId = eventCategories.value.length > 0 ? 
    eventCategories.value[Math.floor(Math.random() * eventCategories.value.length)].id : '';
  
  const randomStatus = eventStatuses.value.length > 0 ? 
    eventStatuses.value[Math.floor(Math.random() * eventStatuses.value.length)].value : 'DRAFT';
  
  newEvent.value = {
    id: '',
    eventName: `${randomEventName} #${timestamp.toString().slice(-4)}`,
    description: randomDescription,
    eventType: randomEventType, // Random từ dropdown
    eventCategoryId: randomCategoryId, // Random từ dropdown
    status: randomStatus, // Random từ dropdown
    startDate: startDate.toISOString().slice(0, 16),
    endDate: endDate.toISOString().slice(0, 16),
    maxParticipants: randomMaxParticipants,
    imageUrls: [], // Empty array, user can upload images
    location: randomLocation,
    rules: randomRules,
    isOnline: Math.random() > 0.7 // 30% chance of being online
  };
  
  // Show success message
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: 'Đã điền dữ liệu mẫu hoàn chỉnh!',
    text: 'Tất cả trường đã được điền, chỉ cần thêm ảnh và submit',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
  
  console.log('=== DEBUG: Fake data filled ===');
  console.log('Generated event:', newEvent.value);
  console.log('Random eventType:', randomEventType);
  console.log('Random categoryId:', randomCategoryId);
  console.log('Random status:', randomStatus);
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
