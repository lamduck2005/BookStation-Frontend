<template>
  <div class="container-fluid py-4">
    <!-- Publisher Statistics Section -->
    <div class="mb-4">
      <PublisherStatisticsCards />
    </div>

    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Quản lý nhà xuất bản</strong>
      </h6>
    </div>

    <!-- Layout 2 cột: Bộ lọc bên trái, Bảng bên phải -->
    <div class="row">
      <!-- Cột bộ lọc (bên trái) -->
      <div class="col-lg-2 col-xl-2">
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
                <i :class="showFilter ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
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

            <div class="mb-3">
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
            </div>
            
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
      <div class="col-lg-10 col-xl-10">
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
                      <th style="min-width: 100px;">Trạng thái</th>
                      <th style="min-width: 150px;">Ngày tạo</th>
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
                      <td>
                        <span :class="['badge', publisher.status === '1' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']">
                          {{ publisher.status === '1' ? 'Hoạt động' : 'Không hoạt động' }}
                        </span>
                      </td>
                      <td>
                        <div class="small">
                          {{ formatDate(publisher.createdAt) }}
                        </div>
                      </td>
                    </tr>
                    <tr v-if="publishers.length === 0">
                      <td colspan="8" class="text-center text-muted py-4">
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
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title">
            <i class="bi bi-building me-2"></i>
            {{ isEditing ? 'Chỉnh sửa nhà xuất bản' : 'Thêm nhà xuất bản mới' }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label required">
                    <i class="bi bi-building me-1"></i>
                    Tên nhà xuất bản
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="publisherForm.publisherName"
                    placeholder="Nhập tên nhà xuất bản..."
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">
                    <i class="bi bi-envelope me-1"></i>
                    Email
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="publisherForm.email"
                    placeholder="Nhập email..."
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">
                    <i class="bi bi-telephone me-1"></i>
                    Điện thoại
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="publisherForm.phone"
                    placeholder="Nhập số điện thoại..."
                  />
                </div>
              </div>
              <div class="col-md-6">
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
              </div>
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">
                    <i class="bi bi-geo-alt me-1"></i>
                    Địa chỉ
                  </label>
                  <textarea
                    class="form-control"
                    v-model="publisherForm.address"
                    placeholder="Nhập địa chỉ..."
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">
                    <i class="bi bi-globe me-1"></i>
                    Website
                  </label>
                  <input
                    type="url"
                    class="form-control"
                    v-model="publisherForm.website"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">
                    <i class="bi bi-info-circle me-1"></i>
                    Mô tả
                  </label>
                  <textarea
                    class="form-control"
                    v-model="publisherForm.description"
                    placeholder="Mô tả về nhà xuất bản..."
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            <i class="bi bi-x-circle me-1"></i>
            Hủy
          </button>
          <button type="button" class="btn btn-success" @click="submitForm" :disabled="loading">
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
import { showNotification } from '@/utils/notification'
import EditButton from '@/components/common/EditButton.vue'
import PublisherStatisticsCards from '@/views/admin/components-admin/statistics/PublisherStatisticsCards.vue'

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
  status: '1'
})

// Computed properties
const debouncedSearch = computed(() => {
  let timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      applyFilters()
    }, 500)
  }
})

// Methods
const fetchPublishers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      ...(searchQuery.value && { search: searchQuery.value }),
      ...(emailFilter.value && { email: emailFilter.value }),
      ...(selectedStatus.value !== '' && { status: selectedStatus.value })
    }

    const response = await getPublishers(params)
    publishers.value = response.data.content
    totalPages.value = response.data.totalPages
    totalElements.value = response.data.totalElements
    isLastPage.value = response.data.last
  } catch (error) {
    console.error('Error fetching publishers:', error)
    showNotification('Lỗi khi tải danh sách nhà xuất bản!', 'error')
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 0
  fetchPublishers()
}

const clearFilters = () => {
  searchQuery.value = ''
  emailFilter.value = ''
  selectedStatus.value = ''
  applyFilters()
}

const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

// Pagination methods
const handlePrev = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchPublishers()
  }
}

const handleNext = () => {
  if (!isLastPage.value) {
    currentPage.value++
    fetchPublishers()
  }
}

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 0
  fetchPublishers()
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

const submitForm = async () => {
  loading.value = true
  try {
    if (isEditing.value) {
      const response = await updatePublisher(publisherForm.id, publisherForm)
      publishers.value[editingIndex.value] = response.data
      showNotification('Cập nhật nhà xuất bản thành công!', 'success')
    } else {
      const response = await createPublisher(publisherForm)
      fetchPublishers()
      showNotification('Thêm nhà xuất bản thành công!', 'success')
    }
    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
    showNotification(
      isEditing.value ? 'Lỗi khi cập nhật nhà xuất bản!' : 'Lỗi khi thêm nhà xuất bản!',
      'error'
    )
  } finally {
    loading.value = false
  }
}

const handleDeletePublisher = (id, index) => {
  Swal.fire({
    title: 'Xác nhận xóa',
    text: 'Bạn có chắc chắn muốn xóa nhà xuất bản này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deletePublisher(id)
        publishers.value.splice(index, 1)
        showNotification('Xóa nhà xuất bản thành công!', 'success')
        
        // Refresh if current page is empty
        if (publishers.value.length === 0 && currentPage.value > 0) {
          currentPage.value--
          fetchPublishers()
        }
      } catch (error) {
        console.error('Error deleting publisher:', error)
        showNotification('Lỗi khi xóa nhà xuất bản!', 'error')
      }
    }
  })
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

// Lifecycle hooks
onMounted(async () => {
  await fetchPublishers()
  
  await nextTick()
  if (publisherModalElement.value) {
    publisherModal = new Modal(publisherModalElement.value)
  }
})
</script>

<style scoped>
@import '@/assets/css/admin-table-responsive.css';
@import '@/assets/css/admin-global.css';

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
</style>
