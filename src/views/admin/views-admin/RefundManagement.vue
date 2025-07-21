<template>
  <div class="container-fluid">
    <!-- Page Header -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Quản lý hoàn tiền</h1>
    </div>

    <!-- Filter Controls -->
    <div class="card shadow mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-3">
            <label class="form-label">Trạng thái</label>
            <select v-model="filters.status" @change="applyFilters" class="form-select">
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="rejected">Đã từ chối</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Từ ngày</label>
            <input
              v-model="filters.startDate"
              @change="applyFilters"
              type="date"
              class="form-control"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Đến ngày</label>
            <input
              v-model="filters.endDate"
              @change="applyFilters"
              type="date"
              class="form-control"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Tìm kiếm</label>
            <input
              v-model="filters.search"
              @input="applyFilters"
              type="text"
              class="form-control"
              placeholder="Mã đơn hàng, tên khách hàng..."
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Refund Requests Table -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Danh sách yêu cầu hoàn tiền</h6>
      </div>
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="!refundRequests.length" class="text-center py-4">
          <p class="text-muted">Không có yêu cầu hoàn tiền nào</p>
        </div>

        <!-- Refund Requests Table -->
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th width="10%">Mã đơn hàng</th>
                <th width="15%">Khách hàng</th>
                <th width="15%">Ngày yêu cầu</th>
                <th width="10%">Số tiền</th>
                <th width="10%">Trạng thái</th>
                <th width="20%">Lý do</th>
                <th width="10%">Minh chứng</th>
                <th width="10%">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="refund in refundRequests" :key="refund.id">
                <td>
                  <strong class="text-primary">#{{ refund.orderId }}</strong>
                </td>
                <td>
                  <div>
                    <div class="fw-bold">{{ refund.customerName }}</div>
                    <small class="text-muted">{{ refund.customerEmail }}</small>
                  </div>
                </td>
                <td>
                  <div>{{ formatDate(refund.requestDate) }}</div>
                  <small class="text-muted">{{ formatTime(refund.requestDate) }}</small>
                </td>
                <td>
                  <span class="fw-bold text-success">{{ formatCurrency(refund.amount) }}</span>
                </td>
                <td>
                  <StatusLabel :status="refund.status" :type="getStatusType(refund.status)" />
                </td>
                <td>
                  <div class="text-truncate" style="max-width: 150px;" :title="refund.reason">
                    {{ refund.reason }}
                  </div>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button
                      v-if="refund.evidenceImages && refund.evidenceImages.length > 0"
                      @click="viewEvidence(refund, 'images')"
                      class="btn btn-sm btn-outline-info"
                      title="Xem hình ảnh"
                    >
                      <i class="fas fa-image"></i>
                      {{ refund.evidenceImages.length }}
                    </button>
                    <button
                      v-if="refund.evidenceVideos && refund.evidenceVideos.length > 0"
                      @click="viewEvidence(refund, 'videos')"
                      class="btn btn-sm btn-outline-warning"
                      title="Xem video"
                    >
                      <i class="fas fa-video"></i>
                      {{ refund.evidenceVideos.length }}
                    </button>
                  </div>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button
                      @click="viewRefundDetails(refund)"
                      class="btn btn-sm btn-outline-primary"
                      title="Xem chi tiết"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      v-if="refund.status === 'pending'"
                      @click="handleProcessRefund(refund)"
                      class="btn btn-sm btn-outline-success"
                      title="Xử lý"
                    >
                      <i class="fas fa-cog"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="pagination.totalPages > 1"
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :total-items="pagination.totalItems"
          :per-page="pagination.perPage"
          @page-changed="changePage"
        />
      </div>
    </div>

    <!-- Refund Details Modal -->
    <div
      class="modal fade"
      id="refundDetailsModal"
      tabindex="-1"
      aria-labelledby="refundDetailsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="refundDetailsModalLabel">
              Chi tiết yêu cầu hoàn tiền #{{ selectedRefund?.orderId }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedRefund">
            <div class="row">
              <div class="col-md-6">
                <h6 class="fw-bold">Thông tin đơn hàng</h6>
                <p><strong>Mã đơn hàng:</strong> #{{ selectedRefund.orderId }}</p>
                <p><strong>Tổng tiền:</strong> {{ formatCurrency(selectedRefund.amount) }}</p>
                <p><strong>Ngày đặt:</strong> {{ formatDate(selectedRefund.orderDate) }}</p>
              </div>
              <div class="col-md-6">
                <h6 class="fw-bold">Thông tin khách hàng</h6>
                <p><strong>Tên:</strong> {{ selectedRefund.customerName }}</p>
                <p><strong>Email:</strong> {{ selectedRefund.customerEmail }}</p>
                <p><strong>Số điện thoại:</strong> {{ selectedRefund.customerPhone }}</p>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-12">
                <h6 class="fw-bold">Thông tin hoàn tiền</h6>
                <p><strong>Ngày yêu cầu:</strong> {{ formatDate(selectedRefund.requestDate) }}</p>
                <p><strong>Trạng thái:</strong> 
                  <StatusLabel :status="selectedRefund.status" :type="getStatusType(selectedRefund.status)" />
                </p>
                <p><strong>Lý do hoàn tiền:</strong></p>
                <p class="bg-light p-3 rounded">{{ selectedRefund.reason }}</p>
                
                <div v-if="selectedRefund.adminNote" class="mt-3">
                  <p><strong>Ghi chú của admin:</strong></p>
                  <p class="bg-warning bg-opacity-10 p-3 rounded">{{ selectedRefund.adminNote }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button
              v-if="selectedRefund?.status === 'pending'"
              @click="handleProcessRefund(selectedRefund)"
              type="button"
              class="btn btn-primary"
            >
              Xử lý yêu cầu
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Evidence Viewer Modal -->
    <div
      class="modal fade"
      id="evidenceModal"
      tabindex="-1"
      aria-labelledby="evidenceModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="evidenceModalLabel">
              Minh chứng hoàn tiền - {{ evidenceType === 'images' ? 'Hình ảnh' : 'Video' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="evidenceType === 'images'" class="row">
              <div v-for="(image, index) in currentEvidence" :key="index" class="col-md-4 mb-3">
                <img
                  :src="image"
                  :alt="`Evidence ${index + 1}`"
                  class="img-fluid rounded shadow"
                  style="cursor: pointer;"
                  @click="openImagePreview(image)"
                />
              </div>
            </div>
            <div v-else-if="evidenceType === 'videos'" class="row">
              <div v-for="(video, index) in currentEvidence" :key="index" class="col-md-6 mb-3">
                <video
                  :src="video"
                  controls
                  class="w-100 rounded shadow"
                  style="max-height: 300px;"
                >
                  Trình duyệt không hỗ trợ video.
                </video>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'
import StatusLabel from '@/components/common/StatusLabel.vue'
import Pagination from '@/components/common/Pagination.vue'
import { processRefund as processRefundAPI, adminApproveRefund, adminRejectRefund } from '@/services/admin/order.js'
import { formatCurrency } from '@/utils/utils.js'

// Reactive data
const loading = ref(false)
const error = ref('')
const refundRequests = ref([])
const selectedRefund = ref(null)
const currentEvidence = ref([])
const evidenceType = ref('')

// Filters
const filters = reactive({
  status: '',
  startDate: '',
  endDate: '',
  search: ''
})

// Pagination
const pagination = reactive({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  perPage: 10
})

// Mock data for development
const mockRefundRequests = [
  {
    id: 1,
    orderId: 'ORD001',
    customerName: 'Nguyễn Văn A',
    customerEmail: 'nguyenvana@example.com',
    customerPhone: '0901234567',
    requestDate: '2024-01-15T10:30:00Z',
    orderDate: '2024-01-10T14:20:00Z',
    amount: 250000,
    status: 'pending',
    reason: 'Sản phẩm không đúng như mô tả, tôi đã đặt sách tiếng Việt nhưng nhận được sách tiếng Anh.',
    evidenceImages: [
      'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Evidence+1',
      'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Evidence+2'
    ],
    evidenceVideos: [],
    adminNote: ''
  },
  {
    id: 2,
    orderId: 'ORD002',
    customerName: 'Trần Thị B',
    customerEmail: 'tranthib@example.com',
    customerPhone: '0901234568',
    requestDate: '2024-01-14T09:15:00Z',
    orderDate: '2024-01-08T16:45:00Z',
    amount: 180000,
    status: 'approved',
    reason: 'Sách bị hỏng trong quá trình vận chuyển, bìa bị rách và trang bị ướt.',
    evidenceImages: [
      'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Damaged+Book'
    ],
    evidenceVideos: [
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    ],
    adminNote: 'Đã xác nhận sản phẩm bị hỏng do vận chuyển. Sẽ hoàn tiền trong 3-5 ngày làm việc.'
  },
  {
    id: 3,
    orderId: 'ORD003',
    customerName: 'Lê Văn C',
    customerEmail: 'levanc@example.com',
    customerPhone: '0901234569',
    requestDate: '2024-01-13T15:45:00Z',
    orderDate: '2024-01-12T11:30:00Z',
    amount: 320000,
    status: 'rejected',
    reason: 'Tôi đổi ý không muốn mua nữa.',
    evidenceImages: [],
    evidenceVideos: [],
    adminNote: 'Không thể hoàn tiền do đơn hàng đã được giao thành công và không có lỗi từ phía cửa hàng.'
  }
]

// Computed properties
const filteredRefunds = computed(() => {
  let result = [...refundRequests.value]

  if (filters.status) {
    result = result.filter(refund => refund.status === filters.status)
  }

  if (filters.startDate) {
    result = result.filter(refund => new Date(refund.requestDate) >= new Date(filters.startDate))
  }

  if (filters.endDate) {
    result = result.filter(refund => new Date(refund.requestDate) <= new Date(filters.endDate))
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    result = result.filter(refund =>
      refund.orderId.toLowerCase().includes(searchLower) ||
      refund.customerName.toLowerCase().includes(searchLower) ||
      refund.customerEmail.toLowerCase().includes(searchLower)
    )
  }

  return result
})

// Methods
const fetchRefundRequests = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // TODO: Replace with actual API call
    // const response = await processRefundAPI(pagination.currentPage, pagination.perPage, filters)
    // refundRequests.value = response.data.refunds
    // pagination.totalPages = response.data.totalPages
    // pagination.totalItems = response.data.totalItems
    
    // Using mock data for now
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    refundRequests.value = mockRefundRequests
    pagination.totalPages = 1
    pagination.totalItems = mockRefundRequests.length
    
  } catch (err) {
    error.value = 'Có lỗi xảy ra khi tải danh sách hoàn tiền'
    console.error('Error fetching refund requests:', err)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  pagination.currentPage = 1
  fetchRefundRequests()
}

const changePage = (page) => {
  pagination.currentPage = page
  fetchRefundRequests()
}

const getStatusType = (status) => {
  const statusTypes = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    processing: 'info',
    completed: 'primary'
  }
  return statusTypes[status] || 'secondary'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const viewRefundDetails = (refund) => {
  selectedRefund.value = refund
  const modal = new Modal(document.getElementById('refundDetailsModal'))
  modal.show()
}

const viewEvidence = (refund, type) => {
  evidenceType.value = type
  currentEvidence.value = type === 'images' ? refund.evidenceImages : refund.evidenceVideos
  const modal = new Modal(document.getElementById('evidenceModal'))
  modal.show()
}

const openImagePreview = (imageSrc) => {
  Swal.fire({
    imageUrl: imageSrc,
    imageAlt: 'Evidence Image',
    showConfirmButton: false,
    showCloseButton: true,
    imageWidth: '80%',
    imageHeight: 'auto',
    customClass: {
      popup: 'p-0'
    }
  })
}

const handleProcessRefund = async (refund) => {
  const result = await Swal.fire({
    title: 'Xử lý hoàn tiền',
    text: `Xử lý yêu cầu hoàn tiền cho đơn hàng #${refund.orderId}`,
    input: 'select',
    inputOptions: {
      approve: 'Phê duyệt hoàn tiền',
      reject: 'Từ chối hoàn tiền'
    },
    inputPlaceholder: 'Chọn hành động...',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    inputValidator: (value) => {
      if (!value) {
        return 'Vui lòng chọn hành động!'
      }
    }
  })

  if (result.isConfirmed) {
    const action = result.value
    
    if (action === 'approve') {
      await approveRefundRequest(refund)
    } else if (action === 'reject') {
      await rejectRefundRequest(refund)
    }
  }
}

const approveRefundRequest = async (refund) => {
  const { value: note } = await Swal.fire({
    title: 'Phê duyệt hoàn tiền',
    text: `Phê duyệt hoàn tiền ${formatCurrency(refund.amount)} cho đơn hàng #${refund.orderId}`,
    input: 'textarea',
    inputLabel: 'Ghi chú (tùy chọn)',
    inputPlaceholder: 'Nhập ghi chú cho khách hàng...',
    showCancelButton: true,
    confirmButtonText: 'Phê duyệt',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#28a745'
  })

  if (note !== undefined) {
    try {
      loading.value = true
      
      // TODO: Replace with actual API call
      // await adminApproveRefund(refund.id, note)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local data
      const index = refundRequests.value.findIndex(r => r.id === refund.id)
      if (index !== -1) {
        refundRequests.value[index].status = 'approved'
        refundRequests.value[index].adminNote = note || 'Yêu cầu hoàn tiền đã được phê duyệt.'
      }
      
      Swal.fire({
        title: 'Thành công!',
        text: 'Đã phê duyệt yêu cầu hoàn tiền',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      
    } catch (err) {
      console.error('Error approving refund:', err)
      Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi phê duyệt hoàn tiền',
        icon: 'error'
      })
    } finally {
      loading.value = false
    }
  }
}

const rejectRefundRequest = async (refund) => {
  const { value: note } = await Swal.fire({
    title: 'Từ chối hoàn tiền',
    text: `Từ chối yêu cầu hoàn tiền cho đơn hàng #${refund.orderId}`,
    input: 'textarea',
    inputLabel: 'Lý do từ chối *',
    inputPlaceholder: 'Nhập lý do từ chối hoàn tiền...',
    inputValidator: (value) => {
      if (!value || value.trim().length < 10) {
        return 'Vui lòng nhập lý do từ chối (ít nhất 10 ký tự)!'
      }
    },
    showCancelButton: true,
    confirmButtonText: 'Từ chối',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#dc3545'
  })

  if (note) {
    try {
      loading.value = true
      
      // TODO: Replace with actual API call
      // await adminRejectRefund(refund.id, note)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local data
      const index = refundRequests.value.findIndex(r => r.id === refund.id)
      if (index !== -1) {
        refundRequests.value[index].status = 'rejected'
        refundRequests.value[index].adminNote = note
      }
      
      Swal.fire({
        title: 'Thành công!',
        text: 'Đã từ chối yêu cầu hoàn tiền',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      
    } catch (err) {
      console.error('Error rejecting refund:', err)
      Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi từ chối hoàn tiền',
        icon: 'error'
      })
    } finally {
      loading.value = false
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchRefundRequests()
})
</script>

<style scoped>
.table-responsive {
  border-radius: 0.375rem;
}

.btn-group .btn {
  margin-right: 2px;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-xl {
  max-width: 90%;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

@media (max-width: 768px) {
  .btn-group {
    flex-direction: column;
  }
  
  .btn-group .btn {
    margin-bottom: 2px;
    margin-right: 0;
  }
}
</style>
