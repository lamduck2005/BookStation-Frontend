<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Quản lý hoàn hàng</strong>
      </h6>
    </div>

    <!-- Layout 2 cột: Bộ lọc bên trái, Bảng bên phải -->
    <div class="row g-0">
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
                <i class="bi bi-toggle-on me-1"></i>
                Trạng thái
              </label>
              <select class="form-select form-select-sm" v-model="filters.status" @change="applyFilters">
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Chờ phê duyệt</option>
                <option value="APPROVED">Đã phê duyệt</option>
                <option value="REJECTED">Đã từ chối</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-box me-1"></i>
                Loại hoàn hàng
              </label>
              <select class="form-select form-select-sm" v-model="filters.refundType" @change="applyFilters">
                <option value="">Tất cả loại</option>
                <option value="FULL">Hoàn toàn bộ</option>
                <option value="PARTIAL">Hoàn một phần</option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-calendar me-1"></i>
                Từ ngày
              </label>
              <input 
                type="date" 
                class="form-control form-control-sm" 
                v-model="filters.startDate" 
                @change="applyFilters"
              />
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-calendar me-1"></i>
                Đến ngày
              </label>
              <input 
                type="date" 
                class="form-control form-control-sm" 
                v-model="filters.endDate" 
                @change="applyFilters"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-currency-dollar me-1"></i>
                Số tiền (min)
              </label>
              <input 
                type="number" 
                class="form-control form-control-sm" 
                placeholder="Nhập số tiền tối thiểu" 
                v-model="filters.minAmount" 
                @change="applyFilters"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-currency-dollar me-1"></i>
                Số tiền (max)
              </label>
              <input 
                type="number" 
                class="form-control form-control-sm" 
                placeholder="Nhập số tiền tối đa" 
                v-model="filters.maxAmount" 
                @change="applyFilters"
              />
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-search me-1"></i>
                Tìm kiếm
              </label>
              <input 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Nhập mã đơn, email..." 
                v-model="filters.search" 
                @input="debouncedSearch"
                @keyup.enter="applyFilters"
              />
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
      <div class="table-main-content" :class="{ 'table-main-content-expanded': !showFilter }">
        <!-- Danh sách Refund -->
        <div class="card shadow-lg border-0 mb-4 admin-table-card">
          <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
            <div>
              <h5 class="mb-0 text-secondary">
                <i class="bi bi-arrow-counterclockwise me-2"></i>
                Danh sách yêu cầu hoàn hàng
              </h5>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-info btn-sm py-2" @click="fetchRefundRequests" :disabled="loading">
                <i class="bi bi-arrow-repeat me-1"></i> Làm mới
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
                      <th style="min-width: 150px;">Mã đơn hàng</th>
                      <th style="min-width: 150px;">Khách hàng</th>
                      <th style="min-width: 120px;">Trạng thái</th>
                      <th style="min-width: 100px;">Loại</th>
                      <th style="min-width: 130px;">Số tiền hoàn</th>
                      <th style="min-width: 150px;">Ngày tạo</th>
                      <th style="min-width: 100px;">Bằng chứng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(refund, index) in filteredRefunds" :key="refund.id">
                      <td>{{ (pagination.currentPage * pagination.perPage) + index + 1 }}</td>
                      <td>
                        <div class="btn-group" role="group">
                          <button 
                            @click="viewRefundDetails(refund)"
                            class="btn btn-sm btn-outline-info mx-2"
                            title="Xem chi tiết"
                          >
                            <i class="bi bi-eye"></i>
                          </button>
                          <button
                            v-if="refund.status === 'PENDING'"
                            @click="approveRefundRequest(refund)"
                            class="btn btn-sm btn-outline-success"
                            title="Phê duyệt"
                          >
                            <i class="bi bi-check-circle"></i>
                          </button>
                          <button
                            v-if="refund.status === 'PENDING'"
                            @click="rejectRefundRequest(refund)"
                            class="btn btn-sm btn-outline-danger"
                            title="Từ chối"
                          >
                            <i class="bi bi-x-circle"></i>
                          </button>
                          <button
                            v-if="refund.status === 'APPROVED'"
                            @click="processRefundRequest(refund.id)"
                            class="btn btn-sm btn-outline-warning"
                            title="Xử lý hoàn trả"
                          >
                            <i class="bi bi-arrow-repeat"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <strong class="text-primary">{{ refund.orderCode }}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{{ refund.userFullName }}</strong>
                        </div>
                      </td>
                      <td>
                        <StatusLabel 
                          :status="refund.status"
                          :status-text="refund.statusDisplay"
                          :status-class="getStatusType(refund.status)"
                        />
                      </td>
                      <td>
                        <span class="badge" :class="selectedRefund && selectedRefund.refundType === 'FULL' ? 'bg-warning text-dark' : 'bg-info'">
                          {{ selectedRefund && selectedRefund.refundType === 'PARTIAL' ? 'Hoàn một phần' : 'Hoàn toàn bộ' }}
                        </span>
                      </td>
                      <td>
                        <span class="text-danger fw-bold">{{ formatCurrency(refund.totalRefundAmount) }}</span>
                      </td>
                      <td>
                        <div class="small">
                          {{ formatDate(refund.createdAt) }}
                          <div class="text-muted">{{ formatTime(refund.createdAt) }}</div>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex gap-1">
                          <button
                            v-if="refund.evidenceImages?.length"
                            @click="viewEvidence(refund, 'images')"
                            class="btn btn-sm btn-outline-primary"
                            title="Xem hình ảnh"
                          >
                            <i class="bi bi-image"></i>
                          </button>
                          <button
                            v-if="refund.evidenceVideos?.length"
                            @click="viewEvidence(refund, 'videos')"
                            class="btn btn-sm btn-outline-info"
                            title="Xem video"
                          >
                            <i class="bi bi-play-circle"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="filteredRefunds.length === 0">
                      <td colspan="9" class="text-center text-muted py-4">
                        <i class="bi bi-inbox display-1 text-muted d-block mb-3"></i>
                        Không có dữ liệu yêu cầu hoàn hàng
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination -->
              <div class="p-3">
                <Pagination 
                  :page-number="pagination.currentPage" 
                  :total-pages="pagination.totalPages" 
                  :is-last-page="pagination.currentPage >= pagination.totalPages - 1"
                  :page-size="pagination.perPage" 
                  :items-per-page-options="[10, 20, 50, 100]" 
                  :total-elements="pagination.totalItems"
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

  <!-- Modals -->
    <div
      class="modal fade"
      id="refundDetailsModal"
      tabindex="-1"
      aria-labelledby="refundDetailsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="refundDetailsModalLabel">
              Chi tiết yêu cầu hoàn hàng #{{ selectedRefund?.orderCode }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedRefund">
            <div class="row">
              <div class="col-md-6">
                <h6 class="fw-bold text-primary">📋 Thông tin đơn hàng</h6>
                <table class="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>Mã đơn hàng:</strong></td>
                      <td>#{{ selectedRefund.orderCode }}</td>
                    </tr>
                    <tr>
                      <td><strong>Tổng tiền hoàn:</strong></td>
                      <td><span class="fw-bold text-success">{{ formatCurrency(selectedRefund.totalRefundAmount) }}</span></td>
                    </tr>
                    <tr>
                      <td><strong>Loại hoàn hàng:</strong></td>
                      <td>
                        <span class="badge" :class="selectedRefund.refundType === 'FULL' ? 'bg-warning text-dark' : 'bg-info'">
                          {{ selectedRefund.refundType === 'PARTIAL' ? 'Hoàn một phần' : 'Hoàn toàn bộ' }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="selectedRefund.shippingFee">
                      <td><strong>Phí ship:</strong></td>
                      <td>{{ formatCurrency(selectedRefund.shippingFee) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-md-6">
                <h6 class="fw-bold text-primary">👤 Thông tin khách hàng</h6>
                <table class="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>Tên:</strong></td>
                      <td>{{ selectedRefund.userFullName || selectedRefund.orderDetails?.userFullName }}</td>
                    </tr>
                    <tr>
                      <td><strong>Order ID:</strong></td>
                      <td>{{ selectedRefund.orderId }}</td>
                    </tr>
                    <tr v-if="selectedRefund.orderDetails?.deliveredDate">
                      <td><strong>Ngày giao:</strong></td>
                      <td>{{ formatDate(selectedRefund.orderDetails.deliveredDate) }}</td>
                    </tr>
                    <tr v-if="selectedRefund.refundDeadline">
                      <td><strong>Hạn hoàn trả:</strong></td>
                      <td>{{ formatDate(selectedRefund.refundDeadline) }}</td>
                    </tr>
                    <tr v-if="selectedRefund.remainingDays !== undefined">
                      <td><strong>Còn lại:</strong></td>
                      <td>
                        <span :class="selectedRefund.remainingDays > 3 ? 'text-success' : 'text-danger'">
                          {{ selectedRefund.remainingDays }} ngày
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <hr>
            
            <div class="row">
              <div class="col-12">
                <h6 class="fw-bold text-primary">📝 Thông tin hoàn hàng</h6>
                <table class="table table-sm">
                  <tbody>
                    <tr>
                      <td width="20%"><strong>Ngày yêu cầu:</strong></td>
                      <td>{{ formatDate(selectedRefund.createdAt) }} {{ formatTime(selectedRefund.createdAt) }}</td>
                    </tr>
                    <tr>
                      <td><strong>Trạng thái:</strong></td>
                      <td>
                        <span class="ms-2 text-muted">{{ selectedRefund.refundStatusDisplay || selectedRefund.statusDisplay }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Lý do hoàn hàng:</strong></td>
                      <td>
                        <span class="text-muted">{{ selectedRefund.reasonDisplay }}</span>
                      </td>
                    </tr>
                    <tr v-if="selectedRefund.estimatedProcessTime">
                      <td><strong>Thời gian xử lý:</strong></td>
                      <td>{{ selectedRefund.estimatedProcessTime }}</td>
                    </tr>
                  </tbody>
                </table>
                
                <div v-if="selectedRefund.customerNote" class="mt-3">
                  <p><strong>💬 Lý do chi tiết:</strong></p>
                  <div class="bg-info bg-opacity-10 p-3 rounded border-start border-info border-4">
                    {{ selectedRefund.customerNote }}
                  </div>
                </div>
                
                <div v-if="selectedRefund.adminNote" class="mt-3">
                  <p><strong>🔧 Ghi chú của admin:</strong></p>
                  <div class="bg-warning bg-opacity-10 p-3 rounded border-start border-warning border-4">
                    {{ selectedRefund.adminNote }}
                  </div>
                  <small class="text-muted">
                    Bởi: {{ selectedRefund.approvedByName || 'Admin' }}
                    <span v-if="selectedRefund.approvedAt"> - {{ formatDate(selectedRefund.approvedAt) }}</span>
                  </small>
                </div>

                <!-- Refund Items (cho PARTIAL refund) -->
                <div v-if="selectedRefund.refundItems && selectedRefund.refundItems.length > 0" class="mt-4">
                  <h6 class="fw-bold text-primary">📦 Sản phẩm hoàn trả</h6>
                  <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                      <thead class="table-light">
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Số lượng hoàn</th>
                          <th>Đơn giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in selectedRefund.refundItems" :key="item.bookId">
                          <td>
                            <div class="d-flex align-items-center">
                              <img v-if="item.bookImage" :src="item.bookImage" class="me-2" style="width: 40px; height: 40px; object-fit: cover;">
                              <div>
                                <div class="fw-bold text-danger">{{ item.bookName }}</div>
                                <small class="text-muted fw-bold">ID: {{ item.bookId }}</small>
                              </div>
                            
                            </div>
                          </td>
                          <td>{{ item.refundQuantity }}</td>
                          <td><span class="text-danger fw-bold">{{ formatCurrency(item.unitPrice) }}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Timeline (nếu có) -->
                <div v-if="selectedRefund.timeline && selectedRefund.timeline.length > 0" class="mt-4">
                  <h6 class="fw-bold text-primary">⏰ Lịch sử xử lý</h6>
                  <div class="timeline">
                    <div v-for="(event, index) in selectedRefund.timeline" :key="index" class="timeline-item">
                      <div class="timeline-marker" :class="getTimelineMarkerClass(event.status)"></div>
                      <div class="timeline-content">
                        <div class="fw-bold">{{ event.statusDisplay }}</div>
                        <div class="text-muted">{{ formatDate(event.timestamp) }} {{ formatTime(event.timestamp) }}</div>
                        <div v-if="event.note" class="mt-1">{{ event.note }}</div>
                        <div v-if="event.adminName" class="text-muted small">Bởi: {{ event.adminName }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Admin Info (nếu có quyền) -->
                <div v-if="selectedRefund.adminInfo" class="mt-4">
                  <h6 class="fw-bold text-danger">🔐 Thông tin admin</h6>
                  <div class="alert alert-light">
                    <p><strong>Có thể phê duyệt:</strong> 
                      <span :class="selectedRefund.adminInfo.canApprove ? 'text-success' : 'text-danger'">
                        {{ selectedRefund.adminInfo.canApprove ? 'Có' : 'Không' }}
                      </span>
                    </p>
                    <div v-if="selectedRefund.adminInfo.managerApprovalRequired" class="alert alert-warning">
                      ⚠️ Yêu cầu phê duyệt từ manager (số tiền lớn)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button
              v-if="(selectedRefund?.refundStatus || selectedRefund?.status) === 'PENDING'"
              @click="handleProcessRefund(selectedRefund)"
              type="button"
              class="btn btn-primary"
            >
              🔧 Xử lý yêu cầu
            </button>
            <button
              v-if="(selectedRefund?.refundStatus || selectedRefund?.status) === 'APPROVED'"
              @click="processRefundRequest(selectedRefund?.refundRequestId || selectedRefund?.id)"
              type="button"
              class="btn btn-success"
            >
              💰 Hoàn trả ngay
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
              Minh chứng hoàn hàng - {{ evidenceType === 'images' ? 'Hình ảnh' : 'Video' }}
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
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'
import StatusLabel from '@/components/common/StatusLabel.vue'
import Pagination from '@/components/common/Pagination.vue'
import { 
  getPendingRefunds, 
  getAllRefunds, 
  getRefundAdminDetail,
  adminApproveRefund, 
  adminRejectRefund,
  processRefund 
} from '@/services/admin/order.js'
import { formatCurrency, getUserId } from '@/utils/utils.js'

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
  refundType: '',
  startDate: '',
  endDate: '',
  search: '',
  minAmount: '',
  maxAmount: ''
})

// Pagination
const pagination = reactive({
  currentPage: 0,
  totalPages: 1,
  totalItems: 0,
  perPage: 20
})

// Computed properties
const filteredRefunds = computed(() => {
  let result = [...refundRequests.value]

  if (filters.status) {
    result = result.filter(refund => refund.status === filters.status)
  }

  if (filters.refundType) {
    result = result.filter(refund => refund.refundType === filters.refundType)
  }

  if (filters.startDate) {
    result = result.filter(refund => new Date(refund.createdAt) >= new Date(filters.startDate))
  }

  if (filters.endDate) {
    result = result.filter(refund => new Date(refund.createdAt) <= new Date(filters.endDate))
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    result = result.filter(refund =>
      refund.orderCode.toLowerCase().includes(searchLower) ||
      refund.userFullName?.toLowerCase().includes(searchLower) ||
      refund.orderId?.toString().includes(searchLower)
    )
  }

  if (filters.minAmount) {
    result = result.filter(refund => refund.totalRefundAmount >= parseInt(filters.minAmount))
  }

  if (filters.maxAmount) {
    result = result.filter(refund => refund.totalRefundAmount <= parseInt(filters.maxAmount))
  }

  return result
})

// Methods
const fetchRefundRequests = async () => {
  console.log('🔄 Starting fetchRefundRequests...')
  try {
    loading.value = true
    error.value = ''
    
    console.log('⏳ Loading set to true')
    
    // Tạo params cho API theo tài liệu mới
    const params = {
      page: pagination.currentPage,
      size: pagination.perPage,
      sortBy: 'createdAt',
      sortDir: 'desc'
    }

    // Nếu có filter status và không phải "ALL", gọi API với filter cụ thể
    if (filters.status && filters.status !== 'ALL') {
      params.status = filters.status
    }

    if (filters.refundType && filters.refundType !== 'ALL') {
      params.refundType = filters.refundType
    }

    if (filters.startDate) {
      params.dateFrom = new Date(filters.startDate).getTime()
    }

    if (filters.endDate) {
      params.dateTo = new Date(filters.endDate).getTime()
    }

    if (filters.minAmount) {
      params.minAmount = parseInt(filters.minAmount)
    }

    if (filters.maxAmount) {
      params.maxAmount = parseInt(filters.maxAmount)
    }

    if (filters.search) {
      if (filters.search.startsWith('ORD-')) {
        params.orderCode = filters.search
      } else {
        // Tìm theo user hoặc refund ID
        params.search = filters.search
      }
    }

    let response
    // Luôn dùng API getAllRefunds để hiển thị tất cả các trạng thái
    // Chỉ filter theo status nếu user chọn cụ thể
    if (filters.status && filters.status !== '' && filters.status !== 'ALL') {
      // Có filter status cụ thể
      console.log('=== FETCHING REFUNDS WITH STATUS FILTER ===')
      console.log('Status filter:', filters.status)
      console.log('Params:', params)
      response = await getAllRefunds(params)
    } else {
      // Không có filter hoặc filter ALL -> lấy tất cả
      delete params.status // Xóa status filter để lấy tất cả
      console.log('=== FETCHING ALL REFUNDS ===')
      console.log('Params:', params)
      response = await getAllRefunds(params)
    }
    
    console.log('🔍 API Response received:', response)
    
    if (response && response.status === 200 && response.data) {
      console.log('=== REFUND API RESPONSE ===')
      console.log('Response data:', response.data)
      
      if (Array.isArray(response.data)) {
        // Response.data là array trực tiếp
        refundRequests.value = response.data
        pagination.totalPages = 1
        pagination.totalItems = response.data.length
        
        console.log('=== LOADED REFUNDS (ARRAY) ===')
        console.log('Total items:', response.data.length)
        console.log('Refunds:', refundRequests.value.map(r => ({
          id: r.id,
          orderCode: r.orderCode,
          status: r.status
        })))
      } else if (response.data.content) {
        // Response.data có pagination
        refundRequests.value = response.data.content
        pagination.totalPages = response.data.totalPages
        pagination.totalItems = response.data.totalElements
        pagination.currentPage = response.data.pageNumber
        
        console.log('=== LOADED REFUNDS (PAGINATED) ===')
        console.log('Total items:', response.data.totalElements)
        console.log('Refunds:', refundRequests.value.map(r => ({
          id: r.id,
          orderCode: r.orderCode,
          status: r.status
        })))
      } else {
        // Response data có thể là object khác hoặc empty
        console.log('🚨 Unexpected response format:', response.data)
        refundRequests.value = []
        pagination.totalPages = 1
        pagination.totalItems = 0
      }
    } else {
      console.log('❌ No valid response received')
      refundRequests.value = []
    }
    
  } catch (err) {
    console.error('❌ Error in fetchRefundRequests:', err)
    error.value = 'Có lỗi xảy ra khi tải danh sách hoàn hàng'
    console.error('Error fetching refund requests:', err)
    refundRequests.value = []
  } finally {
    console.log('✅ Setting loading to false')
    loading.value = false
    console.log('✅ Loading value after finally:', loading.value)
  }
}

const applyFilters = () => {
  pagination.currentPage = 0
  fetchRefundRequests()
}

// Search function with debounce
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

// UI functions
const showFilter = ref(false)
const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

const clearFilters = () => {
  filters.status = ''
  filters.refundType = ''
  filters.startDate = ''
  filters.endDate = ''
  filters.search = ''
  filters.minAmount = ''
  filters.maxAmount = ''
  applyFilters()
}

const changePage = (page) => {
  pagination.currentPage = page - 1 // Convert to 0-based index
  fetchRefundRequests()
}

// Pagination handlers
const handlePrev = () => {
  if (pagination.currentPage > 0) {
    pagination.currentPage--
    fetchRefundRequests()
  }
}

const handleNext = () => {
  if (pagination.currentPage < pagination.totalPages - 1) {
    pagination.currentPage++
    fetchRefundRequests()
  }
}

const handlePageSizeChange = (newSize) => {
  pagination.perPage = newSize
  pagination.currentPage = 0
  fetchRefundRequests()
}

const getStatusType = (status) => {
  const statusTypes = {
    PENDING: 'warning',
    APPROVED: 'info',
    REJECTED: 'danger',
    COMPLETED: 'success'
  }
  return statusTypes[status] || 'secondary'
}

const getStatusText = (status) => {
  const statusTexts = {
    PENDING: 'Chờ phê duyệt',
    APPROVED: 'Đã phê duyệt', 
    REJECTED: 'Đã từ chối',
    COMPLETED: 'Hoàn thành'
  }
  return statusTexts[status] || status
}

const getTimelineMarkerClass = (status) => {
  const classes = {
    PENDING: 'bg-warning',
    APPROVED: 'bg-info',
    REJECTED: 'bg-danger',
    COMPLETED: 'bg-success'
  }
  return classes[status] || 'bg-secondary'
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString('vi-VN')
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const viewRefundDetails = async (refund) => {
  try {
    // Gọi API để lấy chi tiết đầy đủ cho admin
    const response = await getRefundAdminDetail(refund.id)
    if (response.status === 200) {
      selectedRefund.value = response.data
    } else {
      selectedRefund.value = refund
    }
  } catch (error) {
    console.error('Error fetching refund detail:', error)
    selectedRefund.value = refund
  }
  
  const modal = new Modal(document.getElementById('refundDetailsModal'))
  modal.show()
}

const viewEvidence = (refund, type) => {
  evidenceType.value = type
  if (type === 'images') {
    currentEvidence.value = refund.evidenceFiles?.images || refund.evidenceImages || []
  } else {
    currentEvidence.value = refund.evidenceFiles?.videos || refund.evidenceVideos || []
  }
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
    title: 'Xử lý hoàn hàng',
    text: `Xử lý yêu cầu hoàn hàng cho đơn hàng #${refund.orderCode}`,
    input: 'select',
    inputOptions: {
      approve: 'Phê duyệt hoàn hàng',
      reject: 'Từ chối hoàn hàng'
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
  // Popup xác nhận đơn giản chỉ có nút phê duyệt/hủy
  const result = await Swal.fire({
    title: 'Xác nhận phê duyệt',
    text: `Bạn có chắc chắn muốn phê duyệt yêu cầu hoàn hàng ${formatCurrency(refund.totalRefundAmount)} cho đơn hàng #${refund.orderCode}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Phê duyệt',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#dc3545'
  })

  // Nếu người dùng xác nhận phê duyệt
  if (result.isConfirmed) {
    // Tạo dữ liệu mặc định để gửi API
    const formValues = {
      adminNote: 'Yêu cầu hoàn hàng đã được phê duyệt.',
      approvedRefundAmount: refund.totalRefundAmount,
      needsPhysicalReturn: false, // Mặc định không cần trả hàng
      returnAddress: '',
      expectedReturnDays: 0,
      refundItems: refund.refundItems || [],
      status: 'APPROVED'
    }

    try {
      loading.value = true
      
      const adminId = getUserId() || 1
      const refundId = refund.refundRequestId || refund.id
      
      console.log('=== DEBUG: Approving refund with new API ===')
      console.log('Refund ID:', refundId)
      console.log('Admin ID:', adminId)
      console.log('Approval data:', formValues)
      
      const response = await adminApproveRefund(refundId, adminId, formValues)
      
      if (response.status === 200) {
        Swal.fire({
          title: 'Phê duyệt thành công!',
          html: `
            <p>Yêu cầu hoàn hàng đã được phê duyệt thành công.</p>
            <p><strong>Bước tiếp theo:</strong> Bạn có thể tìm đơn hàng này ở trạng thái "Đã phê duyệt" và nhấn nút "Hoàn trả ngay" để hoàn tiền cho khách hàng.</p>
          `,
          icon: 'success',
          timer: 5000,
          showConfirmButton: true
        })
        
        // Refresh danh sách ngay lập tức
        await fetchRefundRequests()
      }
      
    } catch (err) {
      console.error('Error approving refund:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi phê duyệt hoàn hàng'
      Swal.fire({
        title: 'Lỗi!',
        text: errorMessage,
        icon: 'error'
      })
    } finally {
      loading.value = false
    }
  }
}

const rejectRefundRequest = async (refund) => {
  // Popup xác nhận đơn giản chỉ có nút từ chối/hủy
  const result = await Swal.fire({
    title: 'Xác nhận từ chối',
    text: `Bạn có chắc chắn muốn từ chối yêu cầu hoàn hàng cho đơn hàng #${refund.orderCode}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Từ chối',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d'
  })

  // Nếu người dùng xác nhận từ chối
  if (result.isConfirmed) {
    // Tạo dữ liệu mặc định để gửi API
    const formValues = {
      rejectReason: 'OTHER',
      rejectReasonDisplay: 'Yêu cầu không được phê duyệt',
      adminNote: 'Yêu cầu hoàn hàng đã được xem xét và từ chối.',
      suggestedAction: 'Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.',
      status: 'REJECTED'
    }

    try {
      loading.value = true
      
      const adminId = getUserId() || 1
      const refundId = refund.refundRequestId || refund.id
      
      console.log('=== DEBUG: Rejecting refund with new API ===')
      console.log('Refund ID:', refundId)
      console.log('Admin ID:', adminId)
      console.log('Rejection data:', formValues)
      
      const response = await adminRejectRefund(refundId, adminId, formValues)
      
      if (response.status === 200) {
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã từ chối yêu cầu hoàn hàng',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        
        // Refresh danh sách
        await fetchRefundRequests()
      }
      
    } catch (err) {
      console.error('Error rejecting refund:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi từ chối hoàn hàng'
      Swal.fire({
        title: 'Lỗi!',
        text: errorMessage,
        icon: 'error'
      })
    } finally {
      loading.value = false
    }
  }
}

// Xử lý hoàn trả sau khi đã phê duyệt
const processRefundRequest = async (refundId) => {
  // Popup xác nhận đơn giản chỉ có nút xác nhận/hủy
  const result = await Swal.fire({
    title: 'Xác nhận hoàn trả',
    text: 'Bạn có chắc chắn rằng tiền đã được hoàn cho khách hàng và muốn xác nhận hoàn tất quá trình hoàn trả?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận hoàn trả',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#dc3545'
  })

  // Nếu người dùng xác nhận hoàn trả
  if (result.isConfirmed) {
    // Tạo dữ liệu mặc định để gửi API
    const formValues = {
      processType: 'MANUAL',
      paymentMethod: 'BANK_TRANSFER',
      bankInfo: {
        bankName: 'Vietcombank',
        transferNote: 'Hoàn tiền đơn hàng'
      },
      processingNote: 'Đã xử lý hoàn tiền qua chuyển khoản. Khách hàng đã nhận được tiền.',
      refundFeeDeduction: 0
    }

    try {
      loading.value = true
      
      const adminId = getUserId() || 1
      
      console.log('=== DEBUG: Processing refund with new API ===')
      console.log('Refund ID:', refundId)
      console.log('Admin ID:', adminId)
      console.log('Process data:', formValues)
      
      const response = await processRefund(refundId, adminId, formValues)
      
      if (response.status === 200) {
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã xử lý hoàn trả thành công. Hàng hóa và tiền đã được hoàn lại.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        })
        
        // Refresh danh sách
        await fetchRefundRequests()
      }
      
    } catch (err) {
      console.error('Error processing refund:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xử lý hoàn trả'
      Swal.fire({
        title: 'Lỗi!',
        text: errorMessage,
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

<style>
@import '@/assets/css/admin-table-responsive.css';
@import '@/assets/css/admin-global.css';

.filter-card {
  position: sticky;
  top: 20px;
}

.admin-table-card {
  background: white;
  border: 1px solid #e3e6f0;
  border-radius: 0.35rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
}

.admin-table-card .card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: 1px solid #e3e6f0;
  padding: 1rem 1.25rem;
}

.admin-table-card .card-header h6 {
  color: white;
  font-weight: 700;
  margin: 0;
}

.admin-table-card .card-body {
  padding: 0;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 0 0 0.35rem 0.35rem;
}

.page-breadcrumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  padding: 1rem 1.5rem;
  color: white;
}

.page-breadcrumb .breadcrumb {
  background: transparent;
  margin: 0;
  padding: 0;
}

.page-breadcrumb .breadcrumb-item a {
  color: rgba(255, 255, 255, 0.8);
}

.page-breadcrumb .breadcrumb-item.active {
  color: white;
}

/* Timeline styles */
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  margin-bottom: 1rem;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #dee2e6;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: -1.75rem;
  top: 1.5rem;
  width: 2px;
  height: calc(100% + 0.5rem);
  background-color: #dee2e6;
}

.timeline-content {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border-left: 3px solid #007bff;
}

.border-4 {
  border-width: 4px !important;
}

@media (max-width: 991.98px) {
  .filter-card {
    position: static;
    margin-bottom: 1rem;
  }
  
  .responsive-sidebar {
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .btn-group {
    flex-direction: column;
  }
  
  .btn-group .btn {
    margin-bottom: 2px;
    margin-right: 0;
  }

  .modal-xl {
    max-width: 95%;
  }
  
  .timeline {
    padding-left: 1rem;
  }
  
  .timeline-marker {
    left: -1rem;
  }
  
  .timeline-item:not(:last-child)::before {
    left: -0.75rem;
  }
}

/* Filter sidebar styles */
.filter-sidebar {
  width: 250px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.filter-sidebar-collapsed {
  width: 60px;
}

.filter-sidebar-collapsed .filter-card .card-body {
  display: none;
}

.filter-sidebar-collapsed .filter-card .card-header h6 {
  display: none;
}

.filter-sidebar-collapsed .filter-card .card-header {
  padding: 0.75rem 0.5rem;
}

.filter-sidebar-collapsed .filter-card .card-header .d-flex {
  justify-content: center;
}

.filter-sidebar-collapsed .filter-card .card-header .btn {
  opacity: 1;
}

.table-main-content {
  flex: 1;
  transition: all 0.3s ease;
  margin-left: 20px;
}

.table-main-content-expanded {
  margin-left: 80px;
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
}
</style>
