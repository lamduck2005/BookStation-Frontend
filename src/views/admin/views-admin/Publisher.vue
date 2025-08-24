<template>
  <div class="container-fluid py-4">
    <!-- Publisher Statistics Section -->
    <div class="mb-4">
      <!-- Statistics Cards -->
      <div v-if="statsLoading" class="row g-3">
        <div v-for="i in 2" :key="i" class="col-6">
          <div class="card stats-card loading-card">
            <div class="card-body">
              <div class="placeholder-glow">
                <div class="placeholder col-6 mb-2"></div>
                <div class="placeholder col-8 mb-3"></div>
                <div class="placeholder col-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="row g-3">
        <!-- Total Publishers Card -->
        <div class="col-6">
          <div class="card stats-card publishers-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper publishers-icon">
                  <i class="bi bi-building"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value stat-value-gradient text-gradient-info">{{ getTotalPublishers() }}</div>
                  <div class="stat-label">Nhà xuất bản</div>
                </div>
              </div>
              <div class="stat-footer">
                <small class="text-muted">
                  Đang hoạt động
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Books Card -->
        <div class="col-6">
          <div class="card stats-card books-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="icon-wrapper books-icon">
                  <i class="bi bi-book"></i>
                </div>
                <div class="text-end">
                  <div class="stat-value stat-value-gradient text-gradient-purple">{{ getTotalBooks() }}</div>
                  <div class="stat-label">Tổng đầu sách</div>
                </div>
              </div>
              <div class="stat-footer">
                <small class="text-success">
                  Mới tháng này: <strong>{{ getNewBooksThisMonth() }}</strong>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Layout 2 cột: Bộ lọc bên trái, Bảng bên phải -->
    <div class="row">
      <!-- Cột bộ lọc (bên trái) -->
      <div class="filter-sidebar" :class="{ 'filter-sidebar-collapsed': !showFilter }">
        <div class="card shadow-lg border-0 filter-card sticky-filter">
          <div class="card-header bg-light border-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0 text-secondary">
                <i class="bi bi-funnel me-2"></i>
                Bộ lọc
              </h6>
              <button 
                class="btn btn-sm btn-outline-secondary" 
                type="button" 
                @click="toggleFilter"
                :aria-expanded="showFilter"
              >
                <i :class="showFilter ? 'bi bi-chevron-left' : 'bi bi-chevron-right'"></i>
              </button>
            </div>
          </div>
          <div class="card-body filter-collapse" :class="{ 'filter-collapsed': !showFilter }">
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-search me-1"></i>
                Tên nhà xuất bản
              </label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Nhập tên nhà xuất bản..."
                v-model="searchQuery"
                @input="debouncedSearch"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-envelope me-1"></i>
                Email
              </label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Nhập email..."
                v-model="emailFilter"
                @input="debouncedSearch"
              />
            </div>

            <!-- <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-toggle-on me-1"></i>
                Trạng thái
              </label>
              <select
                class="form-select form-select-sm"
                v-model="selectedStatus"
                @change="applyFilters"
              >
                <option value="">Tất cả</option>
                <option value="1">Hoạt động</option>
                <option value="0">Không hoạt động</option>
              </select>
            </div> -->
            
            <div class="d-grid gap-2">
              <button class="btn btn-success btn-sm" @click="applyFilters">
                <i class="bi bi-funnel me-1"></i> Áp dụng lọc
              </button>
              <button class="btn btn-secondary btn-sm" @click="clearFilters">
                <i class="bi bi-x-circle me-1"></i> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Cột bảng (bên phải) -->
      <div class="table-main-content" :class="{ 'table-main-content-expanded': !showFilter }">
        <!-- Publishers Table -->
        <div class="card shadow-lg border-0 mb-4 admin-table-card">
          <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
            <div>
              <h5 class="mb-0 text-secondary">
                <i class="bi bi-building me-2"></i>
                Danh sách nhà xuất bản
              </h5>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-info btn-sm py-2" @click="fetchPublishers" :disabled="loading">
                <i class="bi bi-arrow-repeat me-1"></i> Làm mới
              </button>
              
              <!-- Nút Export Excel -->
              <ExcelExportButton 
                data-type="publishers"
                button-text="Xuất Excel"
              />
              
              <button
                class="btn btn-success btn-sm"
                @click="openAddModal"
              >
                <i class="bi bi-plus-circle me-2"></i> Thêm mới
              </button>
            </div>
          </div>
          <div class="card-body p-0" :class="{ loading: loading }">
            <div class="loading-overlay" :class="{ show: loading }">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Đang tải...</span>
              </div>
              <p>Đang tải dữ liệu...</p>
            </div>
            
            <!-- Data table -->
            <div>
              <div class="table-responsive">
                <table class="table align-middle table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th style="min-width: 50px;">STT</th>
                      <th style="min-width: 120px;">Thao tác</th>
                      <th style="min-width: 200px;">Tên nhà xuất bản</th>
                      <th style="min-width: 150px;">Email</th>
                      <th style="min-width: 120px;">Điện thoại</th>
                      <th style="min-width: 200px;">Địa chỉ</th>
                      <!-- <th style="min-width: 100px;">Trạng thái</th> -->
                      <th style="min-width: 100px;">Năm thành lập</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(publisher, index) in publishers" :key="publisher.id">
                      <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                      <td>
                        <div class="d-flex gap-2">
                          <EditButton @click="openEditModal(publisher, index)" />
                        </div>
                        
                      </td>
                      <td>
                        <strong>{{ publisher.publisherName }}</strong>
                      </td>
                      <td>{{ publisher.email }}</td>
                      <td>{{ publisher.phone }}</td>
                      <td>{{ publisher.address }}</td>
                      <td>{{ publisher.establishedYear }}</td>
                      
                    </tr>
                    <tr v-if="publishers.length === 0">
                      <td colspan="7" class="text-center text-muted py-4">
                        <i class="bi bi-inbox display-1 text-muted d-block mb-3"></i>
                        Không có dữ liệu nhà xuất bản
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination -->
              <div class="p-3">
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
        </div>
      </div>
    </div>
  </div>

  <!-- Modal thêm/chỉnh sửa nhà xuất bản -->
  <div class="modal fade" id="publisherModal" tabindex="-1" aria-hidden="true" ref="publisherModalElement">
    <div class="modal-dialog" style="max-width: 600px">
      <div class="modal-content">
        <div class="modal-header form-modal-header">
          <h5 class="modal-title">
            <i class="bi me-2" :class="isEditing ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
            {{ isEditing ? 'Chỉnh sửa nhà xuất bản' : 'Thêm nhà xuất bản mới' }}
          </h5>
          <button type="button" class="custom-close-btn" @click="closeModal" aria-label="Close">
            <i class="bx bx-x-circle"></i>
          </button>
        </div>
        <div class="modal-body form-modal-body">
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Tên nhà xuất bản <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="publisherForm.publisherName"
                    placeholder="Nhập tên nhà xuất bản (tối đa 255 ký tự)"
                    maxlength="255"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                                 <div class="mb-3">
                   <label class="form-label">
                     Email <span class="text-danger">*</span>
                   </label>
                   <input
                     type="email"
                     class="form-control"
                     v-model="publisherForm.email"
                     placeholder="Nhập email (tối đa 100 ký tự)"
                     maxlength="100"
                     required
                   />
                 </div>
              </div>
              <div class="col-md-6">
                                <div class="mb-3">
                  <label class="form-label">Điện thoại <span class="text-danger">*</span></label>
                   <input
                     type="text"
                     class="form-control"
                     v-model="publisherForm.phone"
                     placeholder="Nhập số điện thoại (10 số, bắt đầu bằng 0)"
                     maxlength="20"
                     pattern="^0\d{9}$"
                     required
                   />
                </div>
              </div>
              <!-- <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">
                    <i class="bi bi-toggle2-on me-1"></i>
                    Trạng thái
                  </label>
                  <select class="form-select" v-model="publisherForm.status">
                    <option value="1">Hoạt động</option>
                    <option value="0">Không hoạt động</option>
                  </select>
                </div>
              </div> -->
                             <div class="col-md-6">
                 <div class="mb-3">
                   <label class="form-label">Năm thành lập <span class="text-danger">*</span></label>
                   <input
                     type="number"
                     class="form-control"
                     v-model="publisherForm.establishedYear"
                     placeholder="Nhập năm thành lập"
                     min="1800"
                     max="2025"
                     required
                   />
                 </div>
               </div>
              <div class="col-12">
                                 <div class="mb-3">
                   <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
                   <textarea
                     class="form-control"
                     v-model="publisherForm.address"
                     placeholder="Nhập địa chỉ (tối đa 2000 ký tự)"
                     rows="3"
                     maxlength="2000"
                     required
                   ></textarea>
                 </div>
              </div>
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Website</label>
                                     <input
                     type="url"
                     class="form-control"
                     v-model="publisherForm.website"
                     placeholder="https://example.com (tối đa 255 ký tự)"
                     maxlength="255"
                   />
                </div>
              </div>
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">
                    Mô tả
                  </label>
                                     <textarea
                     class="form-control"
                     v-model="publisherForm.description"
                     placeholder="Mô tả về nhà xuất bản (tối đa 2000 ký tự)"
                     rows="3"
                     maxlength="2000"
                   ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn form-btn-secondary" @click="closeModal">
            <i class="bi bi-x-circle me-1"></i>
            Hủy
          </button>
          <button type="button" class="btn form-btn-primary" @click="submitForm" :disabled="loading">
            <div v-if="loading" class="spinner-border spinner-border-sm me-2" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <i v-else class="bi bi-check2 me-1"></i>
            {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'
import { 
  getPublishers, 
  createPublisher, 
  updatePublisher, 
  deletePublisher 
} from '@/services/admin/publisher'
import Pagination from '@/components/common/Pagination.vue'
import { showToast } from '@/utils/swalHelper'
import EditButton from '@/components/common/EditButton.vue'

// Statistics API
import { getPublisherStatistics, formatNumber, formatCurrency } from '@/services/admin/moduleStatistics';
import ExcelExportButton from '@/components/common/ExcelExportButton.vue';

// Reactive data
const publishers = ref([])
const loading = ref(false)
const searchQuery = ref('')
const emailFilter = ref('')
const selectedStatus = ref('')

// Filter toggle
const showFilter = ref(true)

// Pagination
const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)
const isLastPage = ref(false)
const itemsPerPageOptions = ref([5, 10, 20, 50])

// Statistics data
const statsLoading = ref(true)
const statsData = ref(null)

// Modal refs
const publisherModalElement = ref(null)
let publisherModal = null

// Modal state
const isEditing = ref(false)
const editingIndex = ref(-1)
const publisherForm = reactive({
  id: null,
  publisherName: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  description: '',
  establishedYear: null
})

// Đã xóa debounce logic

// Methods
const fetchPublishers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      ...(searchQuery.value && { publisherName: searchQuery.value }),
      ...(emailFilter.value && { email: emailFilter.value })
    }

    const response = await getPublishers(params)
    publishers.value = response.data.content || []
    totalPages.value = response.data.totalPages || 1
    totalElements.value = response.data.totalElements || 0
    isLastPage.value = response.data.last || false
  } catch (error) {
    console.error('Error fetching publishers:', error)
    showToast('error', 'Lỗi khi tải danh sách nhà xuất bản!')
    publishers.value = []
    totalPages.value = 1
    totalElements.value = 0
    isLastPage.value = true
  } finally {
    loading.value = false
  }
}

const applyFilters = async () => {
  currentPage.value = 0
  await fetchPublishers()
}

const clearFilters = async () => {
  searchQuery.value = ''
  emailFilter.value = ''
  await applyFilters()
}

const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

// Pagination methods
const handlePrev = async () => {
  if (currentPage.value > 0) {
    currentPage.value--
    await fetchPublishers()
  }
}

const handleNext = async () => {
  if (!isLastPage.value) {
    currentPage.value++
    await fetchPublishers()
  }
}

const handlePageSizeChange = async (newSize) => {
  pageSize.value = newSize
  currentPage.value = 0
  await fetchPublishers()
}

// Modal methods
const openAddModal = () => {
  resetForm()
  isEditing.value = false
  editingIndex.value = -1
  publisherModal.show()
}

const openEditModal = (publisher, index) => {
  resetForm()
  Object.assign(publisherForm, publisher)
  isEditing.value = true
  editingIndex.value = index
  publisherModal.show()
}

const closeModal = () => {
  publisherModal.hide()
  resetForm()
}

const resetForm = () => {
  Object.assign(publisherForm, {
    id: null,
    publisherName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    status: '1'
  })
}

const validateForm = () => {
  // Validate tên nhà xuất bản (bắt buộc)
  if (!publisherForm.publisherName || publisherForm.publisherName.trim() === '') {
    showToast('error', 'Vui lòng nhập tên nhà xuất bản')
    return false
  }

  // Validate độ dài tên nhà xuất bản (min: 1, max: 255)
  if (publisherForm.publisherName.trim().length < 1) {
    showToast('error', 'Tên nhà xuất bản phải có ít nhất 1 ký tự')
    return false
  }
  if (publisherForm.publisherName.trim().length > 255) {
    showToast('error', 'Tên nhà xuất bản không được vượt quá 255 ký tự')
    return false
  }

  // Validate email (bắt buộc)
  if (!publisherForm.email || publisherForm.email.trim() === '') {
    showToast('error', 'Vui lòng nhập email')
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(publisherForm.email)) {
    showToast('error', 'Email không đúng định dạng')
    return false
  }
  if (publisherForm.email.length > 100) {
    showToast('error', 'Email không được vượt quá 100 ký tự')
    return false
  }

  // Validate số điện thoại (bắt buộc)
  if (!publisherForm.phone || publisherForm.phone.trim() === '') {
    showToast('error', 'Vui lòng nhập số điện thoại')
    return false
  }
  const phoneRegex = /^0\d{9}$/
  if (!phoneRegex.test(publisherForm.phone)) {
    showToast('error', 'Số điện thoại phải có 10 số và bắt đầu bằng 0')
    return false
  }

  // Validate tên người liên hệ (nếu có) - max: 100 ký tự
  if (publisherForm.contactName && publisherForm.contactName.trim().length > 100) {
    showToast('error', 'Tên người liên hệ không được vượt quá 100 ký tự')
    return false
  }

  // Validate địa chỉ (bắt buộc) - max: 2000 ký tự
  if (!publisherForm.address || publisherForm.address.trim() === '') {
    showToast('error', 'Vui lòng nhập địa chỉ')
    return false
  }
  if (publisherForm.address.length > 2000) {
    showToast('error', 'Địa chỉ không được vượt quá 2000 ký tự')
    return false
  }

  // Validate website (nếu có) - max: 255 ký tự
  if (publisherForm.website && publisherForm.website.length > 255) {
    showToast('error', 'Website không được vượt quá 255 ký tự')
    return false
  }

  // Validate mô tả (nếu có) - max: 2000 ký tự
  if (publisherForm.description && publisherForm.description.length > 2000) {
    showToast('error', 'Mô tả không được vượt quá 2000 ký tự')
    return false
  }

  // Validate năm thành lập (bắt buộc) - min: 1800, max: 2025
  if (!publisherForm.establishedYear) {
    showToast('error', 'Vui lòng nhập năm thành lập')
    return false
  }
  const year = parseInt(publisherForm.establishedYear)
  if (isNaN(year)) {
    showToast('error', 'Năm thành lập phải là số')
    return false
  }
  if (year < 1800) {
    showToast('error', 'Năm thành lập phải từ 1800 trở lên')
    return false
  }
  if (year > 2025) {
    showToast('error', 'Năm thành lập không được vượt quá 2025')
    return false
  }

  return true
}

const submitForm = async () => {
  // Validation
  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    const submitData = {
      ...publisherForm,
      establishedYear: parseInt(publisherForm.establishedYear), // Chuyển sang number
      status: '1' // Mặc định là hoạt động
    }

    if (isEditing.value) {
      const response = await updatePublisher(publisherForm.id, submitData)
      if (response && response.data) {
        publishers.value[editingIndex.value] = response.data
      }
      showToast('success', 'Cập nhật nhà xuất bản thành công!')
      // Reload dữ liệu để đảm bảo đồng bộ
      await fetchPublishers()
    } else {
      const response = await createPublisher(submitData)
      showToast('success', 'Thêm nhà xuất bản thành công!')
      // Reload để lấy dữ liệu mới nhất sau khi thêm
      await fetchPublishers()
    }
    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
    showToast('error', isEditing.value ? 'Lỗi khi cập nhật nhà xuất bản!' : 'Lỗi khi thêm nhà xuất bản!')
  } finally {
    loading.value = false
  }
}

const handleDeletePublisher = async (id, index) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa',
    text: 'Bạn có chắc chắn muốn xóa nhà xuất bản này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  })

  if (result.isConfirmed) {
    try {
      await deletePublisher(id)
      showToast('success', 'Xóa nhà xuất bản thành công!')

      // Reload lại dữ liệu để đảm bảo đồng bộ với server
      await fetchPublishers()
    } catch (error) {
      console.error('Error deleting publisher:', error)
      showToast('error', 'Lỗi khi xóa nhà xuất bản!')
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Statistics functions
const fetchPublisherStatistics = async () => {
  statsLoading.value = true
  try {
    const response = await getPublisherStatistics()
    if (response.status === 200) {
      statsData.value = response.data
    } else {
      throw new Error('Failed to fetch publisher statistics')
    }
  } catch (error) {
    console.error('Error fetching publisher statistics:', error)
    
    // Fallback data để tránh lỗi hiển thị
    statsData.value = {
      bookStatistics: [
        { publisherName: "NXB Kim Đồng", totalBooks: 450, newBooksThisMonth: 12 },
        { publisherName: "NXB Trẻ", totalBooks: 380, newBooksThisMonth: 8 },
        { publisherName: "NXB Giáo dục", totalBooks: 520, newBooksThisMonth: 15 }
      ]
    }
    
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải dữ liệu thống kê nhà xuất bản - Hiển thị dữ liệu mẫu',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    })
  } finally {
    statsLoading.value = false
  }
}

const getTotalPublishers = () => {
  if (statsData.value?.bookStatistics) {
    return statsData.value.bookStatistics.length
  }
  return 0
}

const getTotalBooks = () => {
  if (statsData.value?.bookStatistics) {
    return statsData.value.bookStatistics.reduce((total, publisher) => total + (publisher.totalBooks || 0), 0)
  }
  return 0
}

const getNewBooksThisMonth = () => {
  if (statsData.value?.bookStatistics) {
    return statsData.value.bookStatistics.reduce((total, publisher) => total + (publisher.newBooksThisMonth || 0), 0)
  }
  return 0
}

// Lifecycle hooks
onMounted(async () => {
  await fetchPublishers()
  await fetchPublisherStatistics()
  
  await nextTick()
  if (publisherModalElement.value) {
    publisherModal = new Modal(publisherModalElement.value)
  }
})
</script>

<style scoped>
@import '@/assets/css/admin-table-responsive.css';
@import '@/assets/css/admin-global.css';
@import '@/assets/css/form-global.css';
@import '@/assets/css/gradient-stats.css';

/* Filter Sidebar - Thu sang trái */
.filter-sidebar {
  width: 250px;
  transition: all 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
}

.filter-sidebar-collapsed {
  width: 100px;
}

.filter-sidebar-collapsed .filter-card .card-body {
  opacity: 0;
  pointer-events: none;
}

.filter-sidebar-collapsed .filter-card .card-header h6 {
  opacity: 0;
}

.filter-sidebar-collapsed .filter-card .card-header {
  padding: 0.75rem;
  text-align: center;
}

.filter-sidebar-collapsed .filter-card .card-header .d-flex {
  justify-content: center !important;
}

.filter-sidebar-collapsed .filter-card .card-header .btn {
  margin: 0;
}

/* Table content - Mở rộng khi filter đóng */
.table-main-content {
  flex: 1;
  transition: all 0.3s ease;
  margin-left: 15px;
}

.table-main-content-expanded {
  margin-left: 15px;
}

/* Sticky filter sidebar */
.sticky-filter {
  position: sticky;
  top: 20px;
  height: fit-content;
}

/* Filter toggle animation */
.filter-collapse {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.filter-collapsed {
  max-height: 0;
  opacity: 0;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.loading-overlay.show {
  opacity: 1;
  visibility: visible;
}

.loading-overlay p {
  margin-top: 1rem;
  color: #6c757d;
  font-weight: 500;
}

.required::after {
  content: ' *';
  color: #dc3545;
}

/* Statistics Cards Styling */
.stats-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.stats-card .card-body {
  padding: 1.5rem;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.publishers-icon { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
}

.books-icon { 
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  color: #2d3748;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
  margin-top: 0.25rem;
}

.stat-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* Loading Cards */
.loading-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.placeholder {
  background-color: #dee2e6;
  border-radius: 4px;
}

@media (max-width: 991.98px) {
  .filter-sidebar {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .filter-sidebar-collapsed {
    width: 100%;
  }
  
  .table-main-content {
    margin-left: 0;
  }
  
  .table-main-content-expanded {
    margin-left: 0;
  }

  .stats-card .card-body {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .icon-wrapper {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}
</style>
