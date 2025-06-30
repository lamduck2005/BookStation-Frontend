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
                  :statusText="event.statusName || getStatusText(event.status)"
                  :statusClass="getStatusClass(event.status)"
                />
              </td>
              <td>
                <div class="d-flex gap-2">
                  <EditButton @click="openEditModal(event, index)" />
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
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content enhanced-modal">
        <div class="modal-header gradient-header">
          <h5 class="modal-title" id="addEventModalLabel">
            <i class="bi bi-calendar-event me-2"></i>
            {{ isEditMode ? 'Sửa Event' : 'Thêm Event' }}
          </h5>
          <button type="button" class="custom-close-btn" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body enhanced-body">
          <!-- Nút Fake Data ở đầu modal body -->
          <div v-if="!isEditMode" class="mb-3 text-end">
            <button 
              type="button" 
              class="btn btn-outline-warning btn-sm rounded-pill fake-data-btn"
              @click="fillFakeData"
              title="Điền dữ liệu mẫu để test nhanh"
            >
              🎲 Fake Data (Test)
            </button>
          </div>
          
          <form @submit.prevent="handleSubmitEvent">
            <!-- Section 1: Thông tin cơ bản -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-info-circle section-icon"></i>
                <h6 class="section-title">Thông tin cơ bản</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label enhanced-label">Tên Event <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control enhanced-input" 
                    v-model="newEvent.eventName"
                    placeholder="Nhập tên event"
                  />
                </div>
                <div class="col-md-3">
                  <label class="form-label enhanced-label">Loại sự kiện <span class="text-danger">*</span></label>
                  <select class="form-select enhanced-input" v-model="newEvent.eventType">
                    <option value="">Chọn loại sự kiện</option>
                    <option v-for="type in eventTypes" :key="type.value" :value="type.value">
                      {{ type.displayName }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label enhanced-label">Danh mục <span class="text-danger">*</span></label>
                  <select class="form-select enhanced-input" v-model="newEvent.eventCategoryId">
                    <option value="">Chọn danh mục</option>
                    <option v-for="category in eventCategories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label enhanced-label">Trạng thái <span class="text-danger">*</span></label>
                  <select class="form-select enhanced-input" v-model="newEvent.status">
                    <option value="">Chọn trạng thái</option>
                    <option v-for="status in eventStatuses" :key="status.value" :value="status.value">
                      {{ status.displayName }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="row g-3 mt-2">
                <div class="col-md-4">
                  <label class="form-label enhanced-label">Loại hình</label>
                  <select class="form-select enhanced-input" v-model="newEvent.isOnline">
                    <option value="">Chọn loại hình</option>
                    <option :value="true">Online</option>
                    <option :value="false">Offline</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label enhanced-label">Địa điểm</label>
                  <input 
                    type="text" 
                    class="form-control enhanced-input" 
                    v-model="newEvent.location"
                    placeholder="Nhập địa điểm tổ chức"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label enhanced-label">Số người tối đa</label>
                  <input 
                    type="number" 
                    class="form-control enhanced-input" 
                    v-model="newEvent.maxParticipants"
                    min="1"
                    placeholder="Số người tối đa"
                  />
                </div>
              </div>
              <div class="row g-3 mt-2">
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Mô tả</label>
                  <textarea 
                    class="form-control enhanced-input" 
                    rows="2"
                    v-model="newEvent.description"
                    placeholder="Nhập mô tả event"
                  ></textarea>
                </div>
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Quy định</label>
                  <textarea 
                    class="form-control enhanced-input" 
                    rows="2"
                    v-model="newEvent.rules"
                    placeholder="Nhập quy định của sự kiện"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Section 2: Thời gian -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-clock section-icon"></i>
                <h6 class="section-title">Thời gian</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Ngày bắt đầu <span class="text-danger">*</span></label>
                  <input 
                    type="datetime-local" 
                    class="form-control enhanced-input" 
                    v-model="newEvent.startDate"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Ngày kết thúc <span class="text-danger">*</span></label>
                  <input 
                    type="datetime-local" 
                    class="form-control enhanced-input" 
                    v-model="newEvent.endDate"
                  />
                </div>
              </div>
            </div>

            <!-- Section 3: Hình ảnh -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-images section-icon"></i>
                <h6 class="section-title">Hình ảnh Event</h6>
              </div>
              <div class="row">
                <div class="col-12">
                  <!-- MultiImageUpload Component -->
                  <MultiImageUpload 
                    v-model="newEvent.imageUrls"
                    label="Hình ảnh Event (Tối đa 5 ảnh)"
                    upload-endpoint="event-images"
                    :max-files="5"
                    :max-size="5 * 1024 * 1024"
                    @upload-success="handleImageUploadSuccess"
                    @upload-error="handleImageUploadError"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer enhanced-footer">
          <button type="button" class="btn btn-secondary btn-cancel" data-bs-dismiss="modal">
            <i class="bi bi-x-circle me-1"></i>
            Hủy
          </button>
          <button type="button" class="btn btn-primary btn-submit" @click="handleSubmitEvent">
            <i class="bi bi-check-circle me-1"></i>
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
import MultiImageUpload from '@/components/common/MultiImageUpload.vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Modal } from 'bootstrap';
import { getEvents, createEvent, updateEvent, getEventTypes, getEventCategoriesDropdown, getEventStatuses } from '@/services/admin/event';
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
  status: 'DRAFT', // Status mặc định là 'DRAFT' theo backend
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
      imageUrl: Array.isArray(item.imageUrls) && item.imageUrls.length > 0 ? item.imageUrls[0] : item.imageUrl || '', // Ưu tiên imageUrls[0], fallback imageUrl
      imageUrls: item.imageUrls || [], // Array đầy đủ để edit
      status: item.status,
      statusName: item.statusName, // Field mới từ backend
      location: item.location,
      isOnline: item.isOnline,
      rules: item.rules,
      createdAt: item.createdAt, // Field mới từ backend
      updatedAt: item.updatedAt // Field mới từ backend
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
    
    // Đảm bảo eventStatuses có format đúng với backend
    const statusesData = statusesResponse.data || [];
    
    // Backend giờ trả về status dạng string, sử dụng trực tiếp
    if (statusesData.length > 0 && statusesData[0].hasOwnProperty('value')) {
      eventStatuses.value = statusesData;
    } else {
      // Fallback với data mặc định
      eventStatuses.value = [
        { value: 'DRAFT', displayName: "Bản nháp" },
        { value: 'PUBLISHED', displayName: "Đã công bố" },
        { value: 'ONGOING', displayName: "Đang diễn ra" },
        { value: 'COMPLETED', displayName: "Đã kết thúc" },
        { value: 'CANCELLED', displayName: "Đã hủy" }
      ];
    }

    // Debug: Log eventStatuses để kiểm tra
    console.log('=== DEBUG: Event Statuses after loading ===');
    console.log('statusesData from API:', statusesData);
    console.log('eventStatuses.value final:', eventStatuses.value);
    eventStatuses.value.forEach(status => {
      console.log(`Status: ${status.value} - ${status.displayName}`);
    });
    
    console.log('=== DEBUG: Loaded dropdown data ===');
    console.log('eventStatuses.value:', eventStatuses.value);
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu dropdown:', error);
    
    // Fallback với data mặc định
    eventStatuses.value = [
      { value: 'DRAFT', displayName: "Bản nháp" },
      { value: 'PUBLISHED', displayName: "Đã công bố" },
      { value: 'ONGOING', displayName: "Đang diễn ra" },
      { value: 'COMPLETED', displayName: "Đã kết thúc" },
      { value: 'CANCELLED', displayName: "Đã hủy" }
    ];

    console.log('=== DEBUG: Using fallback event statuses ===');
    console.log('eventStatuses.value fallback:', eventStatuses.value);
    
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
  // Backend giờ trả về string, cần map thành text
  switch (status) {
    case 'DRAFT': return 'Bản nháp';
    case 'PUBLISHED': return 'Đã công bố';
    case 'ONGOING': return 'Đang diễn ra';
    case 'COMPLETED': return 'Đã kết thúc';
    case 'CANCELLED': return 'Đã hủy';
    default: return 'Không xác định';
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'DRAFT': return 'status-draft';
    case 'PUBLISHED': return 'status-published';
    case 'ONGOING': return 'status-active';
    case 'COMPLETED': return 'status-inactive';  // "Đã kết thúc" -> inactive
    case 'CANCELLED': return 'status-cancelled';
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
    status: 'DRAFT', // Status mặc định là 'DRAFT'
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
    status: event.status, // Giờ đây status đã là string
    startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
    endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
    maxParticipants: event.maxParticipants,
    imageUrls: imageUrls, // Array URLs
    location: event.location || '',
    rules: event.rules || '',
    isOnline: event.isOnline
  };    console.log('=== DEBUG: Opening Edit Modal ===');
    console.log('Original event.status:', event.status, typeof event.status);
    console.log('newEvent.value.status:', newEvent.value.status, typeof newEvent.value.status);
    console.log('Original event.imageUrls:', event.imageUrls);
    console.log('newEvent.value.imageUrls:', newEvent.value.imageUrls);
    console.log('eventStatuses.value:', eventStatuses.value);
    console.log('Status mapping check:', eventStatuses.value.find(s => s.value === event.status));
  
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
    status: 'DRAFT', // Status mặc định là 'DRAFT'
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
  
  // Status là string ('DRAFT','PUBLISHED',etc.) theo backend response
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

/* Enhanced Modal Styles */
.modal-lg {
  max-width: 900px !important;
}

.modal-dialog-scrollable {
  max-height: 90vh;
}

.modal-dialog-scrollable .modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.enhanced-modal {
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: none;
  overflow: hidden;
}

.gradient-header {
  background: linear-gradient(135deg, #ecae9e 0%, #d49489 100%);
  border-bottom: none;
  border-radius: 15px 15px 0 0;
  padding: 1rem 1.25rem;
  position: relative;
}

.gradient-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
  background-size: 300% 100%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.modal-title {
  font-weight: 600;
  color: #2c2c54;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.enhanced-body {
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.enhanced-footer {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 0.875rem 1.25rem;
  border-radius: 0 0 15px 15px;
}

/* Form Section Styles */
.form-section {
  margin-bottom: 1.75rem;
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #ecae9e;
  position: relative;
  transition: all 0.3s ease;
}

.form-section:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.form-section:nth-child(1) {
  border-left-color: #ecae9e;
}

.form-section:nth-child(2) {
  border-left-color: #4ecdc4;
}

.form-section:nth-child(3) {
  border-left-color: #45b7d1;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f3f4;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, #ecae9e, #4ecdc4);
  border-radius: 1px;
}

.section-icon {
  font-size: 1rem;
  color: #ecae9e;
  margin-right: 0.5rem;
  padding: 0.4rem;
  background: rgba(236, 174, 158, 0.1);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  margin: 0;
  font-weight: 600;
  color: #2c2c54;
  font-size: 0.95rem;
}

/* Enhanced Form Controls */
.enhanced-label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #495057;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

.enhanced-label .text-danger {
  margin-left: 0.25rem;
}

.enhanced-input {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  background: #ffffff;
}

.enhanced-input:focus {
  border-color: #ecae9e;
  box-shadow: 0 0 0 0.15rem rgba(236, 174, 158, 0.25);
  background: #ffffff;
}

.enhanced-input:hover {
  border-color: #d49489;
}

/* Button Styles */
.fake-data-btn {
  background: linear-gradient(135deg, #feca57 0%, #ff9f43 100%);
  border: none;
  color: #2c2c54;
  font-weight: 600;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(254, 202, 87, 0.3);
}

.fake-data-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(254, 202, 87, 0.4);
  background: linear-gradient(135deg, #ff9f43 0%, #feca57 100%);
  color: #2c2c54;
}

.btn-submit {
  background: linear-gradient(135deg, #ecae9e 0%, #d49489 100%);
  border: none;
  border-radius: 20px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(236, 174, 158, 0.3);
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(236, 174, 158, 0.4);
  background: linear-gradient(135deg, #d49489 0%, #c08579 100%);
}

.btn-cancel {
  border: 1px solid #6c757d;
  border-radius: 20px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  background: transparent;
  color: #6c757d;
}

.btn-cancel:hover {
  background: #6c757d;
  color: white;
  transform: translateY(-1px);
}

.custom-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 0.6rem;
  cursor: pointer;
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c2c54;
  transition: all 0.3s ease;
}

.custom-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

/* Existing Status Styles */
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

/* Responsive adjustments */
@media (max-width: 1200px) {
  .modal-lg {
    max-width: 85% !important;
  }
}

@media (max-width: 992px) {
  .enhanced-modal {
    margin: 1rem;
  }
  
  .enhanced-body {
    padding: 1rem;
  }
  
  .form-section {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .modal-lg {
    max-width: 90% !important;
  }
  
  .col-md-3 {
    margin-bottom: 0.75rem;
  }
}

@media (max-width: 768px) {
  .enhanced-modal {
    margin: 0.5rem;
  }
  
  .enhanced-body {
    padding: 0.75rem;
  }
  
  .form-section {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .modal-lg {
    max-width: 95% !important;
  }
  
  .modal-dialog-scrollable .modal-body {
    max-height: 75vh;
  }
}

/* Modal positioning fix */
.modal-dialog {
  margin: 1rem auto;
  display: flex;
  align-items: flex-start;
  min-height: calc(100vh - 2rem);
}

@media (min-height: 600px) {
  .modal-dialog {
    align-items: center;
  }
}

/* Animation for form sections */
.form-section {
  animation: slideInUp 0.4s ease-out;
}

.form-section:nth-child(1) {
  animation-delay: 0s;
}

.form-section:nth-child(2) {
  animation-delay: 0.1s;
}

.form-section:nth-child(3) {
  animation-delay: 0.2s;
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
