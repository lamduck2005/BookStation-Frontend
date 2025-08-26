<template>
  <div class="profile-orders">
   

    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Đơn hàng của tôi</h2>
    </div>

    <!-- Order Status Tabs -->
    <div class="order-tabs mb-4">
      <button 
        v-for="tab in orderTabs" 
        :key="tab.key"
        class="order-tab"
        :class="{ active: activeTab === tab.key }"
        @click="changeTab(tab.key)"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <span class="tab-count" v-if="tab.count > 0">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Orders List -->
    <div class="orders-list">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="no-orders">
        <div class="empty-state">
          <i class="bi bi-journal-text text-muted"></i>
          <p class="text-muted">{{ getEmptyMessage() }}</p>
        </div>
      </div>

      <div v-else>
        <div v-for="order in filteredOrders" :key="order.id" class="order-card mb-4">
          <!-- Order Header -->
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">#{{ order.code }}</span>
              <span class="order-status" :class="getOrderStatusClass(order.orderStatus)">
                {{ order.orderStatusDisplay  }}
              </span>
            </div>
            <div class="order-date">
              {{ formatDate(order.orderDate) }}
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-items">
            <div v-for="item in order.orderDetails" :key="item.id" class="order-item">
              <div class="item-image">
                <img :src="item.bookImageUrl || '/src/assets/img/duck.png'" :alt="item.bookName" />
              </div>
              <div class="item-info">
                <h6 class="item-name">{{ item.bookName }}</h6>
                <p class="item-quantity">Số lượng: {{ item.quantity }}</p>
                <p class="item-price">{{ formatCurrency(item.totalPrice) }}</p>
                
                <!-- Flash Sale Badge -->
                <div v-if="item.flashSalePrice" class="flash-sale-badge">
                  <i class="bi bi-lightning-fill"></i>
                  Flash Sale: {{ formatCurrency(item.flashSalePrice) }}
                </div>

                <!-- Refund Information -->
                <div v-if="item.refundedQuantity && item.refundedQuantity > 0" class="refund-info mt-2">
                  <div class="refund-badge">
                    <i class="bi bi-arrow-return-left"></i>
                    Đã hoàn: {{ item.refundedQuantity }} sản phẩm
                  </div>
                  <div class="refund-details mt-1">
                    <small class="text-muted">
                      <div><strong>Lý do:</strong> {{ item.refundReasonDisplay }}</div>
                      <div><strong>Trạng thái:</strong> {{ item.refundStatusDisplay }}</div>
                      <div><strong>Số tiền hoàn:</strong> {{ formatCurrency(item.refundedAmount) }}</div>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="order-footer">
            <div class="order-total">
              <!-- Toggle button for financial breakdown -->
              <div class="financial-toggle" @click="toggleFinancialBreakdown(order.id)" style="cursor: pointer;">
                <i class="bi" :class="isFinancialExpanded(order.id) ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                <span class="ms-1">Chi tiết thanh toán</span>
              </div>
              
              <!-- Collapsible breakdown -->
              <div class="total-breakdown" :class="{ 'collapsed': !isFinancialExpanded(order.id) }">
                <div class="total-line pt-4">
                  <span>Tổng tiền sản phẩm:</span>
                  <span>{{ formatCurrency(order.subtotal) }}</span>
                </div>
                <div class="total-line">
                  <span>Phí vận chuyển:</span>
                  <span>{{ formatCurrency(order.shippingFee) }}</span>
                </div>
                <div v-if="order.voucherDiscountAmount > 0" class="total-line discount">
                  <span 
                    class="voucher-text" 
                    :title="`Voucher: ${order.voucherCode || 'Không xác định'} - Giảm ${formatCurrency(order.voucherDiscountAmount)}`"
                    style="cursor: help; text-decoration: underline dotted;">
                    Tổng giảm giá voucher:
                  </span>
                  <span>-{{ formatCurrency(order.voucherDiscountAmount) }}</span>
                </div>
                <div v-if="order.discountShipping > 0" class="total-line discount">
                  <span>Giảm phí vận chuyển:</span>
                  <span>-{{ formatCurrency(order.discountShipping) }}</span>
                </div>
                <div v-if="order.totalRefundedAmount > 0" class="total-line refund">
                  <span>Đã hoàn trả:</span>
                  <span>-{{ formatCurrency(order.totalRefundedAmount) }}</span>
                </div>
              </div>
              
              <!-- Always visible final total -->
              <div class="total-line final">
                <span class="total-label"><strong>Tổng thanh toán:</strong></span>
                <span class="total-amount"><strong>{{ formatCurrency(order.totalAmount) }}</strong></span>
              </div>
            </div>
            <div class="order-actions">
              <!-- Hủy đơn (chỉ khi PENDING) -->
              <button 
                v-if="canCancelOrder(order.orderStatus)" 
                class="btn btn-outline-danger btn-sm"
                @click="cancelOrderConfirm(order)"
                :disabled="cancellingOrderId === order.id"
              >
                <span v-if="cancellingOrderId === order.id">
                  <i class="bi bi-hourglass-split"></i> Đang hủy...
                </span>
                <span v-else>
                  <i class="bi bi-x-circle"></i> Hủy đơn
                </span>
              </button>
              
              <!-- Hoàn hàng (chỉ khi DELIVERED và trong vòng 7 ngày) -->
              <button 
                v-if="canRefundOrderWithTime(order)" 
                class="btn btn-outline-warning btn-sm"
                @click="openRefundModal(order)"
              >
                <i class="bi bi-arrow-return-left"></i> Hoàn hàng
              </button>
              
              <!-- Mua lại -->
              <button 
                class="btn btn-primary btn-sm"
                @click="buyAgain(order)"
                :disabled="buyingAgainOrderId === order.id"
              >
                <span v-if="buyingAgainOrderId === order.id">
                  <i class="bi bi-hourglass-split"></i> Đang thêm...
                </span>
                <span v-else>
                  <i class="bi bi-cart-plus"></i> Mua lại
                </span>
              </button>
              
              <!-- Xem chi tiết -->
              <button 
                class="btn btn-outline-secondary btn-sm"
                @click="viewOrderDetail(order)"
              >
                <i class="bi bi-eye"></i> Chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div class="modal fade" id="orderDetailModal" tabindex="-1" aria-labelledby="orderDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="orderDetailModalLabel">Chi tiết đơn hàng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedOrderForDetail" class="order-detail-content">
              <!-- Order Information -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <div class="info-section">
                    <h6>Thông tin đơn hàng</h6>
                    <p><strong>Mã đơn hàng:</strong> {{ selectedOrderForDetail.code }}</p>
                    <p><strong>Ngày đặt:</strong> {{ formatDate(selectedOrderForDetail.orderDate) }}</p>
                    <p><strong>Trạng thái:</strong> 
                      <span class="order-status" :class="getOrderStatusClass(selectedOrderForDetail.orderStatus)">
                        {{ selectedOrderForDetail.orderStatusDisplay || selectedOrderForDetail.orderStatus }}
                      </span>
                    </p>
                    <p><strong>Loại đơn hàng:</strong> {{ formatOrderType(selectedOrderForDetail.orderType) }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-section">
                    <h6>Thông tin giao hàng</h6>
                    <p><strong>Người nhận:</strong> {{ selectedOrderForDetail.recipientName }}</p>
                    <p><strong>Số điện thoại:</strong> {{ selectedOrderForDetail.phoneNumber }}</p>
                    <p><strong>Địa chỉ:</strong> {{ selectedOrderForDetail.addressDetail }}</p>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div class="mb-4">
                <h6>Sản phẩm đã đặt</h6>
                <div class="table-responsive">
                  <table class="table table-bordered">
                    <thead class="table-light">
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        <th>Hoàn hàng</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in selectedOrderForDetail.orderDetails" :key="item.bookId">
                        <td>
                          <div class="d-flex align-items-center">
                            <img :src="item.bookImageUrl || '/src/assets/img/book-placeholder.svg'" 
                                 :alt="item.bookName" 
                                 class="refund-item-image me-2" />
                            <div>
                              <div class="fw-bold">{{ item.bookName }}</div>
                              <small class="text-muted">{{ item.bookCode }}</small>
                              <div v-if="item.isFlashSale" class="flash-sale-badge mt-1">
                                <i class="bi bi-lightning-fill"></i>
                                Flash Sale: {{ formatCurrency(item.flashSalePrice) }}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{{ formatCurrency(item.unitPrice) }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ formatCurrency(item.totalPrice) }}</td>
                        <td>
                          <div v-if="item.refundedQuantity && item.refundedQuantity > 0" class="refund-detail">
                            <div class="refund-badge mb-1">
                              <i class="bi bi-arrow-return-left"></i>
                              Đã hoàn: {{ item.refundedQuantity }}
                            </div>
                            <div class="small">
                              <div><strong>Lý do:</strong> {{ item.refundReasonDisplay }}</div>
                              <div><strong>Trạng thái:</strong> {{ item.refundStatusDisplay }}</div>
                              <div><strong>Số tiền:</strong> {{ formatCurrency(item.refundedAmount) }}</div>
                            </div>
                          </div>
                          <div v-else class="text-muted">
                            <small>Chưa hoàn</small>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Vouchers Applied -->
              <div v-if="selectedOrderForDetail.vouchers && selectedOrderForDetail.vouchers.length > 0" class="mb-4">
                <h6>Voucher đã sử dụng</h6>
                <div class="voucher-list">
                  <div v-for="voucher in selectedOrderForDetail.vouchers" :key="voucher.id" class="voucher-item-detail">
                    <div class="voucher-code">{{ voucher.code }}</div>
                    <div class="voucher-name">{{ voucher.name }}</div>
                    <div class="voucher-discount">
                      Giảm: {{ formatCurrency(voucher.discountAmount) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="order-summary">
                <h6>Tổng kết đơn hàng</h6>
                <div class="summary-table">
                  <div class="summary-row">
                    <span>Tổng tiền sản phẩm:</span>
                    <span>{{ formatCurrency(selectedOrderForDetail.subtotal) }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>{{ formatCurrency(selectedOrderForDetail.shippingFee) }}</span>
                  </div>
                  <div v-if="selectedOrderForDetail.voucherDiscountAmount > 0" class="summary-row discount">
                    <span>Tổng giảm giá voucher:</span>
                    <span>-{{ formatCurrency(selectedOrderForDetail.voucherDiscountAmount) }}</span>
                  </div>
                  <div v-if="selectedOrderForDetail.discountShipping > 0" class="summary-row discount">
                    <span>Giảm phí vận chuyển:</span>
                    <span>-{{ formatCurrency(selectedOrderForDetail.discountShipping) }}</span>
                  </div>
                  <div v-if="selectedOrderForDetail.totalRefundedAmount > 0" class="summary-row refund">
                    <span>Đã hoàn trả:</span>
                    <span>-{{ formatCurrency(selectedOrderForDetail.totalRefundedAmount) }}</span>
                  </div>
                  <div class="summary-row total">
                    <span><strong>Tổng thanh toán:</strong></span>
                    <span><strong>{{ formatCurrency(selectedOrderForDetail.totalAmount) }}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Refund Modal -->
    <div class="modal fade" id="refundModal" tabindex="-1" aria-labelledby="refundModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="refundModalLabel">
              <i class="bi bi-arrow-return-left me-2"></i>
              Yêu cầu hoàn hàng
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedOrderForRefund">
              <div class="mb-3">
                <strong>Đơn hàng:</strong> #{{ selectedOrderForRefund.code }}
              </div>
              
              <!-- Refund Type -->
              <div class="mb-3">
                <label class="form-label">Loại hoàn hàng</label>
                <div class="form-check">
                  <input class="form-check-input" type="radio" v-model="refundForm.refundType" value="FULL" id="fullRefund">
                  <label class="form-check-label" for="fullRefund">
                    Hoàn toàn bộ đơn hàng
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" v-model="refundForm.refundType" value="PARTIAL" id="partialRefund" :disabled="disablePartialRefund">
                  <label class="form-check-label" for="partialRefund">
                    Hoàn một phần đơn hàng
                  </label>
                </div>
                <div v-if="disablePartialRefund" class="text-danger small mt-1">
                  Đơn hàng chỉ có 1 sản phẩm với số lượng 1, không thể hoàn một phần.
                </div>
              </div>

              <!-- Partial refund items selection -->
              <div v-if="refundForm.refundType === 'PARTIAL'" class="mb-3">
                <label class="form-label">Chọn sản phẩm muốn hoàn</label>
                <div v-for="item in selectedOrderForRefund.orderDetails" :key="item.id" class="border rounded p-3 mb-2">
                  <div class="d-flex align-items-center">
                    <input 
                      class="form-check-input me-3" 
                      type="checkbox" 
                      :value="item.bookId"
                      v-model="refundForm.selectedBookIds"
                      :id="`book-${item.bookId}`"
                    >
                    <img :src="item.bookImageUrl || '/src/assets/img/duck.png'" class="refund-item-image me-3" />
                    <div class="flex-grow-1">
                      <h6>{{ item.bookName }}</h6>
                      <p class="text-muted mb-1">Số lượng: {{ item.quantity }}</p>
                      <p class="text-danger fw-bold">{{ formatCurrency(item.totalPrice) }}</p>
                    </div>
                    <div v-if="refundForm.selectedBookIds.includes(item.bookId)">
                      <label class="form-label small">Số lượng hoàn:</label>
                      <input 
                        type="number" 
                        class="form-control form-control-sm" 
                        style="width: 80px;"
                        :max="item.quantity"
                        min="1"
                        :value="getRefundQuantity(item.bookId)"
                        @input="updateRefundQuantity(item.bookId, $event.target.value)"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reason -->
              <div class="mb-3">
                <label for="refundReason" class="form-label">Lý do hoàn hàng</label>
                <select class="form-select" v-model="refundForm.reason" @change="updateReasonDisplay" id="refundReason" required>
                  <option value="">Chọn lý do</option>
                  <option value="PRODUCT_DEFECT">Sản phẩm bị lỗi</option>
                  <option value="NOT_AS_DESCRIBED">Không đúng mô tả</option>
                  <option value="DAMAGED_SHIPPING">Hư hỏng trong vận chuyển</option>
                  <option value="WRONG_ITEM">Gửi sai sản phẩm</option>
                  <option value="QUALITY_ISSUE">Vấn đề chất lượng</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <!-- Customer Note -->
              <div class="mb-3">
                <label for="customerNote" class="form-label">Ghi chú chi tiết</label>
                <textarea 
                  class="form-control" 
                  v-model="refundForm.customerNote" 
                  id="customerNote" 
                  rows="3"
                  placeholder="Mô tả chi tiết tình trạng sản phẩm, lý do hoàn hàng..."
                ></textarea>
              </div>

              <!-- Evidence Images -->
              <div class="mb-3">
                <label class="form-label">Hình ảnh bằng chứng</label>
                <input 
                  type="file" 
                  class="form-control" 
                  multiple 
                  accept="image/*"
                  ref="evidenceImagesInput"
                  @change="handleEvidenceImagesChange"
                >
                <small class="text-muted">Tối đa 10 ảnh, mỗi ảnh không quá 5MB (JPEG, JPG, PNG, GIF, WEBP)</small>
                <div v-if="refundForm.evidenceImageFiles.length > 0" class="mt-2">
                  <div class="d-flex flex-wrap gap-2">
                    <div v-for="(file, index) in refundForm.evidenceImageFiles" :key="index" class="position-relative">
                      <img :src="getFilePreview(file)" class="evidence-preview" />
                      <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0" @click="removeEvidenceImage(index)">
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Evidence Videos -->
              <div class="mb-3">
                <label class="form-label">Video bằng chứng (tùy chọn)</label>
                <input 
                  type="file" 
                  class="form-control" 
                  multiple
                  accept="video/*"
                  ref="evidenceVideosInput"
                  @change="handleEvidenceVideosChange"
                >
                <small class="text-muted">Tối đa 3 video, mỗi video không quá 50MB (MP4, AVI, MOV, WMV, WEBM)</small>
                <div v-if="refundForm.evidenceVideoFiles.length > 0" class="mt-2">
                  <div v-for="(file, index) in refundForm.evidenceVideoFiles" :key="index" class="d-flex align-items-center">
                    <i class="bi bi-camera-video me-2"></i>
                    <span>{{ file.name }}</span>
                    <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="removeEvidenceVideo(index)">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button 
              type="button" 
              class="btn btn-warning" 
              @click="submitRefundRequest"
              :disabled="submittingRefund || !canSubmitRefund"
            >
              <span v-if="submittingRefund">
                <i class="bi bi-hourglass-split"></i> Đang gửi...
              </span>
              <span v-else>
                <i class="bi bi-send"></i> Gửi yêu cầu hoàn hàng
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as orderService from '@/services/client/order.js'
import * as refundService from '@/services/client/refund.js'
import * as cartService from '@/services/client/cart.js'
import { showQuickConfirm } from '@/utils/swalHelper.js'
import Swal from 'sweetalert2'
import { Modal } from 'bootstrap'
import { getUserId } from '@/utils/utils.js'

export default {
  name: 'ProfileOrders',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const loading = ref(false)
    const orders = ref([])
    const activeTab = ref('ALL')
    const cancellingOrderId = ref(null)
    const buyingAgainOrderId = ref(null)
    const submittingRefund = ref(false)
    const selectedOrderForRefund = ref(null)
    const selectedOrderForDetail = ref(null)
    const expandedFinancial = ref(new Set()) // Track which orders have expanded financial breakdown
    
    // Refund form
    const refundForm = reactive({
      refundType: 'FULL',
      selectedBookIds: [],
      refundItems: [],
      reason: '',
      reasonDisplay: '',
      customerNote: '',
      evidenceImageFiles: [],
      evidenceVideoFiles: []
    })

    // Order tabs with counts - cập nhật theo tài liệu
    const orderTabs = computed(() => [
      { key: 'ALL', label: 'Tất cả', count: orders.value.length },
      { key: 'PENDING', label: 'Chờ xác nhận', count: orders.value.filter(o => o.orderStatus === 'PENDING').length },
      { key: 'CONFIRMED', label: 'Đã xác nhận', count: orders.value.filter(o => o.orderStatus === 'CONFIRMED').length },
      { key: 'SHIPPED', label: 'Đang giao', count: orders.value.filter(o => o.orderStatus === 'SHIPPED').length },
      { key: 'DELIVERED', label: 'Đã giao', count: orders.value.filter(o => o.orderStatus === 'DELIVERED').length },
      { key: 'REFUND_REQUESTED', label: 'Yêu cầu hoàn trả', count: orders.value.filter(o => o.orderStatus === 'REFUND_REQUESTED').length },
      { key: 'REFUNDING', label: 'Đang hoàn trả', count: orders.value.filter(o => o.orderStatus === 'REFUNDING').length },
      { key: 'REFUNDED', label: 'Đã hoàn trả', count: orders.value.filter(o => o.orderStatus === 'REFUNDED').length },
      { key: 'PARTIALLY_REFUNDED', label: 'Hoàn trả 1 phần', count: orders.value.filter(o => o.orderStatus === 'PARTIALLY_REFUNDED').length },
      { key: 'CANCELED', label: 'Đã hủy', count: orders.value.filter(o => o.orderStatus === 'CANCELED').length }
    ])

    // Filtered orders based on active tab
    const filteredOrders = computed(() => {
      if (activeTab.value === 'ALL') return orders.value
      return orders.value.filter(order => order.orderStatus === activeTab.value)
    })

    // Computed for refund form validation
    const canSubmitRefund = computed(() => {
      if (!refundForm.reason) return false
      if (refundForm.refundType === 'PARTIAL' && refundForm.selectedBookIds.length === 0) return false
      // Bắt buộc phải có ít nhất 1 ảnh và 1 video
      if (refundForm.evidenceImageFiles.length === 0 || refundForm.evidenceVideoFiles.length === 0) return false
      return true
    })

    // Disable hoàn một phần nếu chỉ có 1 sản phẩm và số lượng là 1
    const disablePartialRefund = computed(() => {
      if (!selectedOrderForRefund.value || !selectedOrderForRefund.value.orderDetails) return false
      const details = selectedOrderForRefund.value.orderDetails
      return details.length === 1 && details[0].quantity === 1
    })

    // Methods
    const loadOrders = async () => {
      try {
        loading.value = true
        // Lấy userId từ localStorage hoặc auth store
        const userId = getUserId() || 1 // fallback for demo
        const response = await orderService.getUserOrders(userId)
        orders.value = response.data.map(order => ({
          ...order,
          orderStatusDisplay: orderService.formatOrderStatus(order.orderStatus)
        }))
      } catch (error) {
        console.error('Error loading orders:', error)
        Swal.fire({
          icon: 'error',
          title: 'Lỗi tải đơn hàng',
          text: 'Không thể tải danh sách đơn hàng',
          timer: 3000,
          timerProgressBar: true
        })
      } finally {
        loading.value = false
      }
    }

    const changeTab = (tab) => {
      activeTab.value = tab
    }

    const getEmptyMessage = () => {
      const messages = {
        'ALL': 'Bạn chưa có đơn hàng nào',
        'PENDING': 'Không có đơn hàng đang chờ xác nhận',
        'CONFIRMED': 'Không có đơn hàng đã xác nhận',
        'SHIPPED': 'Không có đơn hàng đang giao',
        'DELIVERED': 'Không có đơn hàng đã giao',
        'REFUND_REQUESTED': 'Không có yêu cầu hoàn trả',
        'REFUNDING': 'Không có đơn hàng đang hoàn trả',
        'REFUNDED': 'Không có đơn hàng đã hoàn trả',
        'PARTIALLY_REFUNDED': 'Không có đơn hàng hoàn trả một phần',
        'CANCELED': 'Không có đơn hàng đã hủy'
      }
      return messages[activeTab.value] || 'Không có đơn hàng'
    }

    const getOrderStatusClass = (status) => {
      const statusClasses = {
        'PENDING': 'status-pending',
        'CONFIRMED': 'status-processing',
        'SHIPPED': 'status-shipping',
        'DELIVERED': 'status-delivered',
        'REFUND_REQUESTED': 'status-pending',
        'REFUNDING': 'status-processing',
        'REFUNDED': 'status-cancelled',
        'PARTIALLY_REFUNDED': 'status-cancelled',
        'CANCELED': 'status-cancelled'
      }
      return statusClasses[status] || ''
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount)
    }

    const formatOrderType = (type) => {
      const types = {
        'ONLINE': 'Đặt hàng online',
        'COUNTER': 'Bán tại quầy',
        'NORMAL': 'Đơn hàng thông thường'
      }
      return types[type] || type
    }

    const canCancelOrder = (status) => {
      return orderService.canCancelOrder(status)
    }

    const canRefundOrder = (status) => {
      return orderService.canRefundOrder(status)
    }

    const canRefundOrderWithTime = (order) => {
      // Kiểm tra trạng thái đơn hàng có thể hoàn trả không
      if (!orderService.canRefundOrder(order.orderStatus)) {
        return false
      }
      
      // Kiểm tra thời gian update cuối cùng
      const updatedAt = order.updatedAt || order.createdAt
      const currentTime = Date.now()
      const timeDiff = currentTime - updatedAt
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      
      // Chỉ cho phép hoàn hàng trong vòng 7 ngày
      return daysDiff <= 7
    }

    const cancelOrderConfirm = async (order) => {
      const result = await showQuickConfirm(
        'Xác nhận hủy đơn hàng',
        `Bạn có chắc chắn muốn hủy đơn hàng #${order.code}?`,
        'warning'
      )
      
      if (result.isConfirmed) {
        await cancelOrder(order)
      }
    }

    const cancelOrder = async (order) => {
      try {
        cancellingOrderId.value = order.id
        const userId = getUserId() || 1 // fallback for demo
        const reason = 'Khách hàng yêu cầu hủy đơn' // default reason
        await orderService.cancelOrder(order.id, reason, userId)
        await loadOrders() // Reload to get updated status
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đơn hàng đã được hủy thành công',
          timer: 2000,
          timerProgressBar: true
        })
      } catch (error) {
        console.error('Error cancelling order:', error)
        Swal.fire({
          icon: 'error',
          title: 'Lỗi hủy đơn hàng',
          text: error.response?.data?.message || 'Không thể hủy đơn hàng',
          timer: 3000,
          timerProgressBar: true
        })
      } finally {
        cancellingOrderId.value = null
      }
    }

    const buyAgain = async (order) => {
      try {
        buyingAgainOrderId.value = order.id
        
        // Add all items from the order to cart
        for (const item of order.orderDetails) {
          await cartService.addToCart({
            userId: getUserId(),
            bookId: item.bookId,
            quantity: item.quantity
          })
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã thêm sản phẩm vào giỏ hàng',
          timer: 2000,
          timerProgressBar: true
        })
        router.push('/cart')
      } catch (error) {
        console.error('Error buying again:', error)
        Swal.fire({
          icon: 'error',
          title: 'Lỗi thêm vào giỏ hàng',
          text: error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng',
          timer: 3000,
          timerProgressBar: true
        })
      } finally {
        buyingAgainOrderId.value = null
      }
    }

    const viewOrderDetail = async (order) => {
      try {
        // Load chi tiết đơn hàng từ API
        const response = await orderService.getOrderDetails(order.id)
        selectedOrderForDetail.value = response.data
        
        // Hiển thị modal chi tiết đơn hàng
        const modal = new Modal(document.getElementById('orderDetailModal'))
        modal.show()
      } catch (error) {
        console.error('Error loading order detail:', error)
        Swal.fire('Lỗi', 'Không thể tải chi tiết đơn hàng', 'error')
      }
    }

    const openRefundModal = async (order) => {
      console.log('=== DEBUG: Opening refund modal ===')
      console.log('Order object:', order)
      console.log('Order details:', order.orderDetails)
      console.log('Order details count:', order.orderDetails?.length || 0)
      
      // Nếu order không có details, load từ API riêng
      if (!order.orderDetails || order.orderDetails.length === 0) {
        console.log('=== LOADING ORDER DETAILS FROM API ===')
        try {
          const orderDetailResponse = await orderService.getOrderDetails(order.id)
          console.log('Order detail response:', orderDetailResponse)
          
          if (orderDetailResponse.data?.orderDetails && orderDetailResponse.data.orderDetails.length > 0) {
            // Gán toàn bộ object từ API response vào selectedOrderForRefund
            selectedOrderForRefund.value = orderDetailResponse.data
            console.log('=== ORDER DETAILS LOADED ===')
            console.log('Details count:', orderDetailResponse.data.orderDetails.length)
          } else {
            console.error('=== NO ORDER DETAILS IN RESPONSE ===')
            Swal.fire('Lỗi', 'Đơn hàng không có sản phẩm để hoàn trả', 'error')
            return
          }
        } catch (error) {
          console.error('=== ERROR LOADING ORDER DETAILS ===')
          console.error('Error:', error)
          Swal.fire('Lỗi', 'Không thể tải chi tiết đơn hàng', 'error')
          return
        }
      } else {
        selectedOrderForRefund.value = order
      }
      
      resetRefundForm()
      const modal = new Modal(document.getElementById('refundModal'))
      modal.show()
    }

    const resetRefundForm = () => {
      refundForm.refundType = 'FULL'
      refundForm.selectedBookIds = []
      refundForm.refundItems = []
      refundForm.reason = ''
      refundForm.customerNote = ''
      refundForm.evidenceImageFiles = []
      refundForm.evidenceVideoFiles = []
      refundForm.uploadedImageUrls = []
      refundForm.uploadedVideoUrls = []
    }

    const updateRefundQuantity = (bookId, quantity) => {
      const existingItem = refundForm.refundItems.find(item => item.bookId === bookId)
      if (existingItem) {
        existingItem.refundQuantity = parseInt(quantity)
      } else {
        refundForm.refundItems.push({
          bookId: bookId,
          refundQuantity: parseInt(quantity)
        })
      }
    }

    const updateReasonDisplay = () => {
      const reasonMap = {
        'PRODUCT_DEFECT': 'Sản phẩm bị lỗi',
        'NOT_AS_DESCRIBED': 'Không đúng mô tả', 
        'DAMAGED_SHIPPING': 'Hư hỏng trong vận chuyển',
        'WRONG_ITEM': 'Gửi sai sản phẩm',
        'QUALITY_ISSUE': 'Vấn đề chất lượng',
        'OTHER': 'Khác'
      }
      refundForm.reasonDisplay = reasonMap[refundForm.reason] || ''
    }

    const getRefundQuantity = (bookId) => {
      const item = refundForm.refundItems.find(item => item.bookId === bookId)
      return item ? item.refundQuantity : 1
    }

    const handleEvidenceImagesChange = async (event) => {
      const files = Array.from(event.target.files)
      
      // Validate file count (tối đa 10 ảnh theo tài liệu)
      if (files.length + refundForm.evidenceImageFiles.length > 10) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Tối đa 10 ảnh bằng chứng',
          timer: 3000,
          timerProgressBar: true
        })
        event.target.value = ''
        return
      }
      
      // Validate file size (5MB each according to documentation)
      const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024)
      if (invalidFiles.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Mỗi ảnh không được vượt quá 5MB',
          timer: 3000,
          timerProgressBar: true
        })
        event.target.value = ''
        return
      }

      // Validate file format
      const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      const invalidFormatFiles = files.filter(file => !validFormats.includes(file.type))
      if (invalidFormatFiles.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Chỉ chấp nhận định dạng: JPEG, JPG, PNG, GIF, WEBP',
          timer: 3000,
          timerProgressBar: true
        })
        event.target.value = ''
        return
      }
      
      refundForm.evidenceImageFiles.push(...files)
      
      // Thông báo đã chọn files thành công (không upload ngay)
      Swal.fire({
        icon: 'success',
        title: 'Đã chọn ảnh!',
        text: `Đã chọn ${files.length} ảnh minh chứng. Ảnh sẽ được upload khi gửi yêu cầu.`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      })
    }

    const handleEvidenceVideosChange = async (event) => {
      const files = Array.from(event.target.files)
      
      // Only allow 3 videos according to documentation
      if (files.length > 3 || refundForm.evidenceVideoFiles.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Tối đa 3 video bằng chứng',
          timer: 3000,
          timerProgressBar: true
        })
        event.target.value = ''
        return
      }
      
      // Validate file size (50MB according to documentation)
      const invalidFiles = files.filter(file => file.size > 50 * 1024 * 1024)
      if (invalidFiles.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Mỗi video không được vượt quá 50MB',
          timer: 3000,
          timerProgressBar: true
        })
        event.target.value = ''
        return
      }

      // Validate file format
      const validFormats = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm']
      const invalidFormatFiles = files.filter(file => !validFormats.includes(file.type))
      if (invalidFormatFiles.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Chỉ chấp nhận định dạng: MP4, AVI, MOV, WMV, WEBM',
          timer: 3000,
          timerProgressBar: true
        })
        event.target.value = ''
        return
      }
      
      refundForm.evidenceVideoFiles.push(...files)
      
      // Thông báo đã chọn files thành công (không upload ngay)
      Swal.fire({
        icon: 'success',
        title: 'Đã chọn video!',
        text: `Đã chọn ${files.length} video minh chứng. Video sẽ được upload khi gửi yêu cầu.`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      })
    }

    const removeEvidenceImage = (index) => {
      refundForm.evidenceImageFiles.splice(index, 1)
      // Hiển thị thông báo xóa thành công
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa ảnh',
        text: 'Ảnh bằng chứng đã được xóa',
        timer: 1500,
        timerProgressBar: true
      })
    }

    const removeEvidenceVideo = (index) => {
      refundForm.evidenceVideoFiles.splice(index, 1)
      // Hiển thị thông báo xóa thành công
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa video',
        text: 'Video bằng chứng đã được xóa',
        timer: 1500,
        timerProgressBar: true
      })
    }

    const getFilePreview = (file) => {
      return URL.createObjectURL(file)
    }

    // Upload ảnh ngay lập tức khi user chọn
    const submitRefundRequest = async () => {
      try {
        submittingRefund.value = true

        // Validate form cơ bản
        if (!refundForm.reason) {
          Swal.fire('Lỗi', 'Vui lòng chọn lý do hoàn hàng', 'error')
          return
        }

        if (!refundForm.customerNote || refundForm.customerNote.length < 10) {
          Swal.fire('Lỗi', 'Ghi chú chi tiết phải có ít nhất 10 ký tự', 'error')
          return
        }

        if (refundForm.customerNote.length > 1000) {
          Swal.fire('Lỗi', 'Ghi chú chi tiết không được vượt quá 1000 ký tự', 'error')
          return
        }

        if (refundForm.refundType === 'PARTIAL' && refundForm.selectedBookIds.length === 0) {
          Swal.fire('Lỗi', 'Vui lòng chọn ít nhất một sản phẩm để hoàn', 'error')
          return
        }

        // Validate order details exist
        if (!selectedOrderForRefund.value) {
          Swal.fire('Lỗi', 'Không tìm thấy thông tin đơn hàng', 'error')
          return
        }

        if (!selectedOrderForRefund.value.orderDetails || selectedOrderForRefund.value.orderDetails.length === 0) {
          console.error('DEBUG: Order details missing')
          console.error('Selected order:', selectedOrderForRefund.value)
          Swal.fire('Lỗi', 'Đơn hàng không có sản phẩm nào để hoàn trả', 'error')
          return
        }

        console.log('DEBUG: Order details found:', selectedOrderForRefund.value.orderDetails.length, 'items')

        // Upload minh chứng nếu có - sử dụng mixed evidence API theo tài liệu
        let evidenceImages = []
        let evidenceVideos = []

        if (refundForm.evidenceImageFiles.length > 0 || refundForm.evidenceVideoFiles.length > 0) {
          console.log('=== UPLOADING MIXED EVIDENCE ===')
          try {
            const uploadResponse = await refundService.uploadRefundMixedEvidence(
              refundForm.evidenceImageFiles,
              refundForm.evidenceVideoFiles
            )
            
            if (uploadResponse.status === 200) {
              evidenceImages = uploadResponse.data.imagePaths || []
              evidenceVideos = uploadResponse.data.videoPaths || []
              console.log('Uploaded evidence:', { evidenceImages, evidenceVideos })
              
              // Thông báo upload thành công nhưng không hiển thị URL
              const totalFiles = refundForm.evidenceImageFiles.length + refundForm.evidenceVideoFiles.length
              Swal.fire({
                icon: 'success',
                title: 'Upload thành công!',
                text: `Đã lưu ${totalFiles} file minh chứng trên server`,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
              })
            }
          } catch (error) {
            console.error('Failed to upload evidence:', error)
            Swal.fire('Lỗi', 'Không thể upload minh chứng. Vui lòng thử lại.', 'error')
            return
          }
        }

        // Tạo refund data theo API mới (format chuẩn từ tài liệu)
        const refundData = {
          orderId: selectedOrderForRefund.value.id,
          refundType: refundForm.refundType,
          reason: refundForm.reason,
          reasonDisplay: refundForm.reasonDisplay,
          customerNote: refundForm.customerNote || "",
          evidenceImages: evidenceImages,
          evidenceVideos: evidenceVideos,
          refundItems: []
        }

        // Add refund items based on refund type
        if (refundForm.refundType === 'FULL') {
          console.log('DEBUG: Creating FULL refund - refundItems để trống theo tài liệu')
          // Với FULL refund, refundItems để trống theo tài liệu
          refundData.refundItems = []
        } else if (refundForm.refundType === 'PARTIAL') {
          console.log('DEBUG: Creating PARTIAL refund details')
          console.log('DEBUG: Selected book IDs:', refundForm.selectedBookIds)
          
          // Hoàn một phần - add items được chọn theo format mới
          refundData.refundItems = refundForm.selectedBookIds.map(bookId => {
            const orderItem = selectedOrderForRefund.value.orderDetails.find(item => item.bookId === bookId)
            if (!orderItem) {
              console.error('ERROR: Cannot find order item for bookId:', bookId)
              return null
            }
            
            const refundQuantity = getRefundQuantity(bookId)
            
            return {
              bookId: bookId,
              refundQuantity: refundQuantity,
              reason: `Hoàn ${refundQuantity}/${orderItem.quantity} sản phẩm: ${orderItem.bookName || orderItem.bookTitle || 'Unknown'}`
            }
          }).filter(item => item !== null)
        }
        
        console.log('=== DEBUG: Submitting refund request with new API ===')
        console.log('User ID:', getUserId())
        console.log('Refund data:', JSON.stringify(refundData, null, 2))

        // Gọi API tạo yêu cầu hoàn hàng theo format mới
        const response = await refundService.createRefundRequest(getUserId(), refundData)
        
        if (response.status === 201) {
          // Success response theo tài liệu mới
          const refundInfo = response.data
          
          Swal.fire({
            title: 'Thành công!',
            html: `
              <div class="text-start">
                <p class="text-muted mt-3">${response.message}</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Đóng'
          }).then(() => {
            // Đóng modal và refresh orders
            const modal = Modal.getInstance(document.getElementById('refundModal'))
            modal.hide()
            loadOrders()
          })
        }

      } catch (error) {
        console.error('=== ERROR: Submitting refund request ===')
        console.error('Error:', error)
        
        let errorMessage = 'Có lỗi xảy ra khi gửi yêu cầu hoàn hàng'
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        Swal.fire('Lỗi', errorMessage, 'error')
      } finally {
        submittingRefund.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      loadOrders()
    })

    return {
      // Data
      loading,
      orders,
      activeTab,
      cancellingOrderId,
      buyingAgainOrderId,
      submittingRefund,
      selectedOrderForRefund,
      selectedOrderForDetail,
      expandedFinancial,
      refundForm,
      
  // Computed
  orderTabs,
  filteredOrders,
  canSubmitRefund,
  disablePartialRefund,
      
      // Methods
      changeTab,
      getEmptyMessage,
      getOrderStatusClass,
      formatDate,
      formatCurrency,
      formatOrderType,
      toggleFinancialBreakdown: (orderId) => {
        if (expandedFinancial.value.has(orderId)) {
          expandedFinancial.value.delete(orderId)
        } else {
          expandedFinancial.value.add(orderId)
        }
      },
      isFinancialExpanded: (orderId) => expandedFinancial.value.has(orderId),
      canCancelOrder,
      canRefundOrder,
      canRefundOrderWithTime,
      cancelOrderConfirm,
      buyAgain,
      viewOrderDetail,
      openRefundModal,
      updateReasonDisplay,
      updateRefundQuantity,
      getRefundQuantity,
      handleEvidenceImagesChange,
      handleEvidenceVideosChange,
      removeEvidenceImage,
      removeEvidenceVideo,
      getFilePreview,
      submitRefundRequest
    }
  }
}
</script>

<style scoped>
.profile-orders {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.order-tabs {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 20px;
}

.order-tab {
  background: none;
  border: none;
  padding: 12px 16px;
  color: #6c757d;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-tab:hover {
  color: #007bff;
}

.order-tab.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.tab-count {
  background: #007bff;
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.order-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: white;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-id {
  font-weight: 600;
  color: #333;
}

.order-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-processing {
  background: #cce5ff;
  color: #0066cc;
}

.status-shipping {
  background: #e7f3ff;
  color: #004085;
}

.status-delivered {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-date {
  color: #6c757d;
  font-size: 0.875rem;
}

.order-items {
  padding: 20px;
}

.order-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f4;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
}

.item-quantity,
.item-price {
  font-size: 0.875rem;
  margin-bottom: 2px;
  color: #6c757d;
}

.item-price {
  font-weight: 600;
  color: #dc3545;
}

.flash-sale-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #ff6b6b;
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-label {
  color: #6c757d;
}

.total-amount {
  font-size: 1.125rem;
  font-weight: 600;
  color: #dc3545;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 16px;
}

.refund-item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.evidence-preview {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.evidence-preview {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

/* Refund Information Styles */
.refund-info {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 8px;
}

.refund-badge {
  background: #ffc107;
  color: #212529;
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.refund-details small {
  line-height: 1.4;
}

.refund-detail {
  font-size: 0.875rem;
}

/* Financial Toggle Styles */
.financial-toggle {
  color: #007bff;
  font-weight: 500;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.financial-toggle:hover {
  color: #0056b3;
}

.total-breakdown {
  max-height: 200px;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.total-breakdown.collapsed {
  max-height: 0;
  margin-bottom: 0;
}

.voucher-text {
  position: relative;
}

.voucher-text:hover {
  color: #007bff;
}

/* Order Total Breakdown */
.total-breakdown {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid #e9ecef;
}

.total-line:last-child {
  border-bottom: none;
}

.total-line.discount {
  color: #28a745;
}

.total-line.refund {
  color: #dc3545;
}

.total-line.final {
  font-size: 1.1rem;
  font-weight: 600;
  border-top: 2px solid #dee2e6;
  padding-top: 8px;
  margin-top: 4px;
}

/* Order Detail Modal */
.order-detail-content .info-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.order-detail-content .info-section h6 {
  color: #495057;
  margin-bottom: 10px;
  font-weight: 600;
}

.order-detail-content .info-section p {
  margin-bottom: 8px;
  line-height: 1.5;
}

/* Voucher Display */
.voucher-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.voucher-item-detail {
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 8px;
  padding: 12px;
}

.voucher-code {
  font-weight: bold;
  color: #1976d2;
  font-size: 0.9rem;
}

.voucher-name {
  color: #424242;
  margin: 4px 0;
}

.voucher-discount {
  color: #d32f2f;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Order Summary Table */
.summary-table {
  background: white;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #dee2e6;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f4;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.discount {
  color: #28a745;
}

.summary-row.refund {
  color: #dc3545;
}

.summary-row.total {
  border-top: 2px solid #dee2e6;
  margin-top: 8px;
  padding-top: 12px;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .order-tabs {
    flex-wrap: wrap;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .order-actions {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
}
</style>
