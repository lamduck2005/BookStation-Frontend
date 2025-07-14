<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Quản lý đơn hàng</strong>
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
          <label class="form-label">Mã đơn hàng:</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập mã đơn hàng" 
            v-model="searchCode" 
            @input="debouncedSearch"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">Khách hàng</label>
          <select class="form-select" v-model="selectedUserId" @change="applyFilters">
            <option value="">Tất cả khách hàng</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus" @change="applyFilters">
            <option value="">Tất cả trạng thái</option>
            <option v-for="status in orderStatuses" :key="status.value" :value="status.value">
              {{ status.displayName }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Loại đơn hàng</label>
          <select class="form-select" v-model="selectedOrderType" @change="applyFilters">
            <option value="">Tất cả loại</option>
            <option v-for="type in orderTypes" :key="type.value" :value="type.value">
              {{ type.displayName }}
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

    <!-- Danh sách Order -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách đơn hàng</strong>
      </div>

      <div class="p-3">
        <div class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th style="min-width: 50px;">STT</th>
                <th style="min-width: 150px;">Mã đơn hàng</th>
                <th style="min-width: 200px;">Khách hàng</th>
                <th style="min-width: 150px;">Địa chỉ</th>
                <th style="min-width: 120px;">Loại đơn</th>
                <th style="min-width: 120px;">Tạm tính</th>
                <th style="min-width: 120px;">Phí ship</th>
                <th style="min-width: 120px;">Giảm giá</th>
                <th style="min-width: 120px;">Tổng tiền</th>
                <th style="min-width: 120px;">Trạng thái</th>
                <th style="min-width: 150px;">Ngày tạo</th>
                <th style="min-width: 150px;">Staff</th>
                <th style="min-width: 200px;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, index) in orders" :key="order.id">
                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                <td>
                  <strong class="text-primary">{{ order.orderCode || order.code }}</strong>
                </td>
                <td>
                  <div>
                    <strong>{{ order.userName }}</strong>
                    <div class="text-muted small">{{ order.userEmail }}</div>
                  </div>
                </td>
                <td>
                  <div class="small" v-if="order.address">
                    {{ order.address.name || 'Chưa có địa chỉ' }}
                  </div>
                  <div class="small text-muted" v-else>Chưa có địa chỉ</div>
                </td>
                <td>
                  <span class="badge bg-info">{{ formatOrderType(order.orderType) }}</span>
                </td>
                <td>
                  <span class="text-primary">{{ formatCurrency(order.subtotal) }}</span>
                </td>
                <td>
                  <span class="text-warning">{{ formatCurrency(order.shippingFee) }}</span>
                </td>
                <td>
                  <span class="text-success" v-if="order.totalVoucherDiscount > 0">
                    -{{ formatCurrency(order.totalVoucherDiscount) }}
                  </span>
                  <span class="text-muted" v-else>0₫</span>
                </td>
                <td>
                  <strong class="text-success">{{ formatCurrency(order.finalTotal || order.totalAmount) }}</strong>
                </td>
                <td>
                  <StatusLabel 
                    :status="order.orderStatus" 
                    :statusText="formatOrderStatus(order.orderStatus)"
                    :statusClass="getOrderStatusClass(order.orderStatus)"
                  />
                </td>
                <td>
                  <div class="small">
                    {{ formatDate(order.createdAt) }}
                  </div>
                </td>
                <td>
                  <div class="small" v-if="order.staffName">
                    <strong>{{ order.staffName }}</strong>
                  </div>
                  <div class="small text-muted" v-else>-</div>
                </td>
                <td>
                  <div class="d-flex gap-2">
                    <button 
                      class="btn btn-outline-info btn-sm" 
                      @click="viewOrderDetail(order)"
                      title="Xem chi tiết"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <EditButton 
                      @click="openEditModal(order, index)" 
                      v-if="order.orderStatus === 'PENDING'"
                      title="Chỉ sửa được đơn ở trạng thái Chờ xử lý"
                    />
                    <div class="dropdown">
                      <button 
                        class="btn btn-outline-secondary btn-sm dropdown-toggle" 
                        type="button" 
                        :id="'statusDropdown' + order.id"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        title="Cập nhật trạng thái"
                      >
                        <i class="bi bi-arrow-repeat"></i>
                      </button>
                      <ul class="dropdown-menu" :aria-labelledby="'statusDropdown' + order.id">
                        <li v-for="status in getAvailableStatusTransitions(order.orderStatus)" :key="status.value">
                          <a 
                            class="dropdown-item" 
                            href="#"
                            @click.prevent="updateOrderStatus(order.id, status.value)"
                          >
                            <span class="badge me-2" :class="getOrderStatusClass(status.value)">
                              {{ status.displayName }}
                            </span>
                          </a>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                          <a 
                            class="dropdown-item text-danger" 
                            href="#"
                            @click.prevent="cancelOrder(order)"
                            v-if="order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED'"
                          >
                            <i class="bi bi-x-circle me-2"></i>
                            Hủy đơn hàng
                          </a>
                        </li>
                      </ul>
                    </div>
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

  <!-- Add/Edit Order Modal -->
  <div class="modal fade" id="addOrderModal" tabindex="-1" aria-labelledby="addOrderModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content enhanced-modal">
        <div class="modal-header gradient-header">
          <h5 class="modal-title" id="addOrderModalLabel">
            <i class="bi bi-cart-plus me-2"></i>
            {{ isEditMode ? 'Sửa đơn hàng' : 'Tạo đơn hàng mới' }}
          </h5>
          <button type="button" class="custom-close-btn" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body enhanced-body">
          <form @submit.prevent="handleSubmitOrder">
            <!-- Section 1: Thông tin khách hàng -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-person section-icon"></i>
                <h6 class="section-title">Thông tin khách hàng</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Khách hàng <span class="text-danger">*</span></label>
                  <select 
                    class="form-select enhanced-input" 
                    v-model="newOrder.userId"
                    @change="onUserChange"
                    required
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Địa chỉ giao hàng <span class="text-danger">*</span></label>
                  <select 
                    class="form-select enhanced-input" 
                    v-model="newOrder.addressId"
                    :disabled="!newOrder.userId"
                    required
                  >
                    <option value="">-- Chọn địa chỉ giao hàng --</option>
                    <option v-for="address in userAddresses" :key="address.id" :value="address.id">
                      {{ address.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Section 2: Thông tin đơn hàng -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-clipboard-data section-icon"></i>
                <h6 class="section-title">Thông tin đơn hàng</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label enhanced-label">Phí vận chuyển <span class="text-danger">*</span></label>
                  <input 
                    type="number" 
                    class="form-control enhanced-input" 
                    v-model="newOrder.shippingFee"
                    placeholder="Nhập phí vận chuyển"
                    min="0"
                    step="1000"
                    @input="onShippingFeeChange"
                    required
                  />
                </div>
                <div class="col-md-3">
                  <label class="form-label enhanced-label">Loại đơn hàng</label>
                  <select 
                    class="form-select enhanced-input" 
                    v-model="newOrder.orderType"
                  >
                    <option v-for="type in orderTypes" :key="type.value" :value="type.value">
                      {{ type.displayName }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label enhanced-label">Trạng thái</label>
                  <select 
                    class="form-select enhanced-input" 
                    v-model="newOrder.orderStatus"
                  >
                    <option v-for="status in orderStatuses" :key="status.value" :value="status.value">
                      {{ status.displayName }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label enhanced-label">Nhân viên tạo đơn</label>
                  <input 
                    type="text" 
                    class="form-control enhanced-input" 
                    :value="getCurrentStaffId()"
                    placeholder="Auto-fill từ session"
                    readonly
                  />
                </div>
              </div>
              <div class="row g-3 mt-2">
                <div class="col-12">
                  <label class="form-label enhanced-label">Ghi chú</label>
                  <textarea 
                    class="form-control enhanced-input" 
                    rows="3"
                    v-model="newOrder.notes"
                    placeholder="Nhập ghi chú cho đơn hàng"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Section 3: Vouchers -->
            <div class="form-section" v-if="newOrder.userId">
              <div class="section-header">
                <i class="bi bi-ticket section-icon"></i>
                <h6 class="section-title">Vouchers (Tối đa 2 voucher)</h6>
              </div>
              <div class="row g-3">
                <div class="col-12">
                  <div class="voucher-selection">
                    <div v-if="userVouchers.length === 0" class="text-muted">
                      Khách hàng này không có voucher khả dụng
                    </div>
                    <div v-else class="row g-2">
                      <div 
                        v-for="voucher in userVouchers" 
                        :key="voucher.id"
                        class="col-md-6"
                      >
                        <div class="voucher-item" :class="{ 'selected': newOrder.voucherIds.includes(voucher.id) }">
                          <div class="form-check">
                            <input 
                              class="form-check-input" 
                              type="checkbox" 
                              :value="voucher.id"
                              v-model="newOrder.voucherIds"
                              :disabled="!newOrder.voucherIds.includes(voucher.id) && newOrder.voucherIds.length >= 2"
                              :id="'voucher-' + voucher.id"
                              @change="onVoucherChange"
                            >
                            <label class="form-check-label" :for="'voucher-' + voucher.id">
                              <div class="voucher-content">
                                <div class="voucher-name">{{ voucher.name }}</div>
                                <div class="voucher-discount">{{ voucher.description || 'Voucher giảm giá' }}</div>
                                <div class="voucher-condition text-muted small">
                                  Loại: {{ voucher.voucherType || 'N/A' }}
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 4: Sản phẩm -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-box section-icon"></i>
                <h6 class="section-title">Sản phẩm trong đơn hàng</h6>
              </div>
              
              <!-- Add product button -->
              <div class="mb-3">
                <button 
                  type="button" 
                  class="btn btn-outline-primary btn-sm"
                  @click="addProductRow"
                >
                  <i class="bi bi-plus-circle me-1"></i>
                  Thêm sản phẩm
                </button>
              </div>

              <!-- Product rows -->
              <div v-if="newOrder.items.length === 0" class="text-muted text-center py-4">
                Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.
              </div>
              
              <div v-for="(detail, index) in newOrder.items" :key="index" class="product-row mb-3">
                <div class="row g-3 align-items-end">
                  <div class="col-md-5">
                    <label class="form-label">Sách <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      v-model="detail.bookId"
                      @change="onBookChange(detail, index)"
                      required
                    >
                      <option value="">-- Chọn sách --</option>
                      <option v-for="book in books" :key="book.id" :value="book.id">
                        {{ book.title }} - {{ formatCurrency(book.price) }}
                        {{ book.isFlashSale ? '🔥' : '' }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-2">
                    <label class="form-label">Số lượng <span class="text-danger">*</span></label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="detail.quantity"
                      @change="calculateDetailTotal(detail)"
                      min="1"
                      required
                    />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Đơn giá</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="detail.unitPrice"
                      @change="calculateDetailTotal(detail)"
                      min="0"
                      step="1000"
                      readonly
                    />
                  </div>
                  <div class="col-md-2">
                    <button 
                      type="button" 
                      class="btn btn-outline-danger btn-sm w-100"
                      @click="removeProductRow(index)"
                    >
                      <i class="bi bi-trash"></i>
                      Xóa
                    </button>
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-12">
                    <div class="alert alert-info py-2 mb-0" v-if="detail.isFlashSale">
                      <i class="bi bi-fire me-1"></i>
                      <small>Sản phẩm đang có flash sale! Giá đã được áp dụng tự động.</small>
                    </div>
                    <div class="text-end">
                      <strong>Thành tiền: {{ formatCurrency(detail.totalPrice || 0) }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Calculation Preview -->
              <div class="order-summary mt-4" v-if="newOrder.items.length > 0">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title d-flex align-items-center">
                      <i class="bi bi-calculator me-2"></i>
                      Tính toán đơn hàng
                      <span v-if="isCalculating" class="ms-2 spinner-border spinner-border-sm text-primary"></span>
                    </h6>
                    
                    <!-- Backend calculation results -->
                    <div v-if="orderCalculation" class="calculation-results">
                      <div class="alert alert-info" v-if="orderCalculation.message">
                        <i class="bi bi-info-circle me-2"></i>
                        {{ orderCalculation.message }}
                      </div>
                      
                      <!-- Item details với flash sale info -->
                      <div class="mb-3">
                        <h6 class="text-muted">Chi tiết sản phẩm:</h6>
                        <div v-for="item in orderCalculation.itemDetails" :key="item.bookId" class="border rounded p-2 mb-2">
                          <div class="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{{ item.bookName }}</strong>
                              <span class="badge bg-primary ms-2">{{ item.quantity }}x</span>
                              <span v-if="item.isFlashSale" class="badge bg-danger ms-1">
                                🔥 {{ item.flashSaleName }}
                              </span>
                            </div>
                            <div class="text-end">
                              <div v-if="item.isFlashSale">
                                <small class="text-muted text-decoration-line-through">
                                  {{ formatCurrency(item.originalPrice) }}
                                </small>
                                <div class="text-danger fw-bold">
                                  {{ formatCurrency(item.unitPrice) }}
                                  <span class="badge bg-success ms-1">Tiết kiệm {{ formatCurrency(item.savedAmount) }}</span>
                                </div>
                              </div>
                              <div v-else class="fw-bold">
                                {{ formatCurrency(item.unitPrice) }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Pricing breakdown -->
                      <div class="row">
                        <div class="col-md-6">
                          <div class="summary-item">
                            <span>Tạm tính:</span>
                            <strong>{{ formatCurrency(orderCalculation.subtotal) }}</strong>
                          </div>
                          <div class="summary-item">
                            <span>Phí vận chuyển:</span>
                            <strong>{{ formatCurrency(orderCalculation.shippingFee) }}</strong>
                          </div>
                          <div class="summary-item" v-if="orderCalculation.regularVoucherDiscount > 0">
                            <span>Voucher thường:</span>
                            <strong class="text-success">-{{ formatCurrency(orderCalculation.regularVoucherDiscount) }}</strong>
                          </div>
                          <div class="summary-item" v-if="orderCalculation.shippingVoucherDiscount > 0">
                            <span>Voucher ship:</span>
                            <strong class="text-success">-{{ formatCurrency(orderCalculation.shippingVoucherDiscount) }}</strong>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="summary-total">
                            <span>Tổng cộng:</span>
                            <strong class="text-primary fs-5">{{ formatCurrency(orderCalculation.finalTotal) }}</strong>
                          </div>
                          
                          <!-- Applied vouchers detail -->
                          <div v-if="orderCalculation.appliedVouchers && orderCalculation.appliedVouchers.length > 0" class="mt-2">
                            <small class="text-muted">Vouchers đã áp dụng:</small>
                            <div v-for="voucher in orderCalculation.appliedVouchers" :key="voucher.voucherId" class="small">
                              <span class="badge bg-success">{{ voucher.voucherCode }}</span>
                              {{ voucher.description }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Fallback calculation (khi chưa có backend data) -->
                    <div v-else class="fallback-calculation">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="summary-item">
                            <span>Tạm tính:</span>
                            <strong>{{ formatCurrency(orderSubtotal) }}</strong>
                          </div>
                          <div class="summary-item">
                            <span>Phí vận chuyển:</span>
                            <strong>{{ formatCurrency(newOrder.shippingFee || 0) }}</strong>
                          </div>
                          <div class="summary-item" v-if="voucherDiscount > 0">
                            <span>Giảm giá voucher:</span>
                            <strong class="text-success">-{{ formatCurrency(voucherDiscount) }}</strong>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="summary-total">
                            <span>Tổng cộng:</span>
                            <strong class="text-primary fs-5">{{ formatCurrency(orderTotal) }}</strong>
                          </div>
                          <div class="small text-muted">
                            * Giá chưa tính flash sale và voucher chính xác
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
          <button 
            type="button" 
            class="btn btn-primary btn-submit" 
            @click="handleSubmitOrder"
            :disabled="!canSubmitOrder"
          >
            <i class="bi bi-check-circle me-1"></i>
            {{ isEditMode ? 'Cập nhật' : 'Tạo đơn hàng' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Order Detail Modal -->
  <div class="modal fade" id="orderDetailModal" tabindex="-1" aria-labelledby="orderDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderDetailModalLabel">
            <i class="bi bi-file-earmark-text me-2"></i>
            Chi tiết đơn hàng
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="selectedOrder">
          <!-- Order Info -->
          <div class="row mb-4">
            <div class="col-md-6">
              <h6>Thông tin đơn hàng</h6>
              <table class="table table-borderless table-sm">
                <tbody>
                  <tr>
                    <td><strong>Mã đơn hàng:</strong></td>
                    <td>{{ selectedOrder.orderCode || selectedOrder.code }}</td>
                  </tr>
                  <tr>
                    <td><strong>Loại đơn:</strong></td>
                    <td>
                      <span class="badge bg-info">{{ formatOrderType(selectedOrder.orderType) }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Trạng thái:</strong></td>
                    <td>
                      <StatusLabel 
                        :status="selectedOrder.orderStatus" 
                        :statusText="formatOrderStatus(selectedOrder.orderStatus)"
                        :statusClass="getOrderStatusClass(selectedOrder.orderStatus)"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Ngày tạo:</strong></td>
                    <td>{{ formatDate(selectedOrder.createdAt) }}</td>
                  </tr>
                  <tr>
                    <td><strong>Cập nhật lần cuối:</strong></td>
                    <td>{{ formatDate(selectedOrder.updatedAt) }}</td>
                  </tr>
                  <tr>
                    <td><strong>Nhân viên tạo:</strong></td>
                    <td>{{ selectedOrder.staffName || 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-6">
              <h6>Thông tin khách hàng & Giao hàng</h6>
              <table class="table table-borderless table-sm">
                <tbody>
                  <tr>
                    <td><strong>Tên:</strong></td>
                    <td>{{ selectedOrder.userName }}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{{ selectedOrder.userEmail }}</td>
                  </tr>
                  <tr>
                    <td><strong>Địa chỉ giao hàng:</strong></td>
                    <td>
                      <div v-if="selectedOrder.address">
                        {{ selectedOrder.address.name }}
                      </div>
                      <div v-else class="text-muted">Chưa có địa chỉ</div>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Ghi chú:</strong></td>
                    <td>{{ selectedOrder.notes || 'Không có' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Order Items -->
          <div class="mb-4">
            <h6>Sản phẩm trong đơn hàng</h6>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá gốc</th>
                    <th>Giá bán</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.itemDetails || selectedOrder.orderDetails" :key="item.id || item.bookId">
                    <td>
                      <div>
                        <strong>{{ item.bookName || item.bookTitle }}</strong>
                        <div class="text-muted small">
                          Mã: {{ item.bookCode }}
                        </div>
                        <div v-if="item.isFlashSale" class="badge bg-danger">
                          🔥 {{ item.flashSaleName }}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span v-if="item.originalPrice && item.isFlashSale" class="text-muted text-decoration-line-through">
                        {{ formatCurrency(item.originalPrice) }}
                      </span>
                      <span v-else>{{ formatCurrency(item.originalPrice || item.unitPrice) }}</span>
                    </td>
                    <td>
                      <strong :class="{ 'text-danger': item.isFlashSale }">
                        {{ formatCurrency(item.unitPrice) }}
                      </strong>
                      <div v-if="item.savedAmount > 0" class="badge bg-success small">
                        Tiết kiệm {{ formatCurrency(item.savedAmount) }}
                      </div>
                    </td>
                    <td>{{ item.quantity }}</td>
                    <td><strong>{{ formatCurrency(item.itemTotal || item.totalPrice) }}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Applied Vouchers -->
          <div class="mb-4" v-if="selectedOrder.appliedVouchers && selectedOrder.appliedVouchers.length > 0">
            <h6>Vouchers đã áp dụng</h6>
            <div class="row">
              <div class="col-md-6" v-for="voucher in selectedOrder.appliedVouchers" :key="voucher.voucherId">
                <div class="card border-success">
                  <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{{ voucher.voucherCode }}</strong>
                        <div class="small text-muted">{{ voucher.voucherName }}</div>
                        <div class="small">{{ voucher.description }}</div>
                      </div>
                      <strong class="text-success">-{{ formatCurrency(voucher.discountApplied) }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Tổng kết đơn hàng</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Tạm tính:</span>
                    <span>{{ formatCurrency(selectedOrder.subtotal || calculateOrderSubtotal(selectedOrder)) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển:</span>
                    <span>{{ formatCurrency(selectedOrder.shippingFee || 0) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2" v-if="selectedOrder.regularVoucherDiscount > 0">
                    <span>Voucher thường:</span>
                    <span class="text-success">-{{ formatCurrency(selectedOrder.regularVoucherDiscount) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2" v-if="selectedOrder.shippingVoucherDiscount > 0">
                    <span>Voucher ship:</span>
                    <span class="text-success">-{{ formatCurrency(selectedOrder.shippingVoucherDiscount) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2" v-if="selectedOrder.totalVoucherDiscount > 0">
                    <span>Tổng giảm giá:</span>
                    <span class="text-success">-{{ formatCurrency(selectedOrder.totalVoucherDiscount) }}</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="d-flex justify-content-between">
                    <strong class="fs-5">Tổng cộng:</strong>
                    <strong class="fs-5 text-primary">{{ formatCurrency(selectedOrder.finalTotal || selectedOrder.totalAmount) }}</strong>
                  </div>
                  <div v-if="selectedOrder.message" class="small text-info mt-2">
                    {{ selectedOrder.message }}
                  </div>
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
</template>

<script setup>
import EditButton from '@/components/common/EditButton.vue';
import Pagination from '@/components/common/Pagination.vue';
import AddButton from '@/components/common/AddButton.vue';
import StatusLabel from '@/components/common/StatusLabel.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { Modal } from 'bootstrap';
import { 
  getOrders, 
  createOrder, 
  updateOrder, 
  getOrderById,
  calculateOrder,
  validateOrder,
  updateOrderStatus as updateOrderStatusAPI,
  cancelOrder as cancelOrderAPI,
  getOrderStatuses, 
  getOrderTypes,
  getUserAddressesDropdown,
  getUserAvailableVouchers,
  getVouchersDropdown,
  formatOrderStatus,
  getOrderStatusClass
} from '@/services/admin/order';
import { getUsersForOrder } from '@/services/admin/user';
import { getBooksForOrder, getBooksDropdown } from '@/services/admin/book';
import Swal from 'sweetalert2';

// Search and filter states
const searchCode = ref('');
const selectedUserId = ref('');
const selectedStatus = ref('');
const selectedOrderType = ref('');
const startDateFilter = ref('');
const endDateFilter = ref('');

// Pagination states
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);
const totalElements = ref(0);
const isLastPage = ref(false);
const itemsPerPageOptions = ref([5, 10, 15, 20, 25]);

// Data states
const orders = ref([]);
const orderStatuses = ref([]);
const orderTypes = ref([]);
const users = ref([]);
const books = ref([]);
const userAddresses = ref([]);
const userVouchers = ref([]);
const allVouchers = ref([]);
const selectedOrder = ref(null);
const orderCalculation = ref(null);
const isCalculating = ref(false);

// Modal states
const isEditMode = ref(false);
const editIndex = ref(-1);
let addOrderModal = null;
let orderDetailModal = null;

// New order form data
const newOrder = ref({
  id: '',
  userId: '',
  staffId: '',
  addressId: '',
  shippingFee: 30000,
  orderType: 'NORMAL',
  orderStatus: 'PENDING',
  notes: '',
  voucherIds: [],
  items: []
});

// Computed properties
const orderSubtotal = computed(() => {
  if (orderCalculation.value && orderCalculation.value.subtotal) {
    return orderCalculation.value.subtotal;
  }
  return newOrder.value.items.reduce((sum, detail) => {
    return sum + (detail.totalPrice || 0);
  }, 0);
});

const voucherDiscount = computed(() => {
  if (orderCalculation.value && orderCalculation.value.totalVoucherDiscount) {
    return orderCalculation.value.totalVoucherDiscount;
  }
  return 0;
});

const orderTotal = computed(() => {
  if (orderCalculation.value && orderCalculation.value.finalTotal) {
    return orderCalculation.value.finalTotal;
  }
  return orderSubtotal.value + (newOrder.value.shippingFee || 0) - voucherDiscount.value;
});

const canSubmitOrder = computed(() => {
  return newOrder.value.userId && 
         newOrder.value.addressId && 
         newOrder.value.items.length > 0 &&
         newOrder.value.items.every(detail => detail.bookId && detail.quantity > 0) &&
         !isCalculating.value;
});

// Debounced search function
let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
};

// Lifecycle hooks
onMounted(async () => {
  await initializeData();
  await fetchOrders();
  
  // Initialize modals
  addOrderModal = new Modal(document.getElementById('addOrderModal'));
  orderDetailModal = new Modal(document.getElementById('orderDetailModal'));
});

// Methods
const initializeData = async () => {
  try {
    // Sử dụng Promise.all để gọi các API
    const [statusesResponse, typesResponse, usersResponse, booksResponse] = await Promise.all([
      getOrderStatuses(),
      getOrderTypes(), 
      getUsersForOrder(),
      getBooksForOrder()
    ]);
    
    orderStatuses.value = statusesResponse.data || [];
    orderTypes.value = typesResponse.data || [];
    
    // Process users từ API /api/users/dropdown (trả về array trực tiếp)
    if (usersResponse.data && Array.isArray(usersResponse.data.data)) {
      users.value = usersResponse.data.data.map(user => ({
        id: user.id,
        name: user.name || 'Unknown'
      }));
    } else {
      console.warn('Unexpected users API response:', usersResponse);
      users.value = [];
    }
    
    // Process books từ API /api/books (có pagination)
    if (booksResponse.data && booksResponse.data.content) {
      books.value = booksResponse.data.content.map(book => ({
        id: book.id,
        title: book.title || book.name || 'Unknown',
        price: book.price || 0,
        isFlashSale: book.isFlashSale || false
      }));
    } else if (booksResponse.data && Array.isArray(booksResponse.data)) {
      // Fallback nếu API trả về array trực tiếp
      books.value = booksResponse.data.map(book => ({
        id: book.id,
        title: book.title || book.name || 'Unknown',
        price: book.price || 0,
        isFlashSale: book.isFlashSale || false
      }));
    } else {
      console.warn('Unexpected books API response:', booksResponse);
      books.value = [];
    }
    
    console.log('=== DEBUG: Loaded dropdown data ===');
    console.log('Order statuses:', orderStatuses.value);
    console.log('Order types:', orderTypes.value);
    console.log('Users:', users.value);
    console.log('Books:', books.value);
    
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu dropdown:', error);
    showToast('error', 'Lỗi khi tải dữ liệu dropdown!');
  }
};

const loadUsersAndBooks = async () => {
  try {
    console.log('=== DEBUG: Loading users and books for modal ===');
    
    // Load users và books song song
    const [usersResponse, booksResponse] = await Promise.all([
      getUsersForOrder(),
      getBooksDropdown()
    ]);
    
    // Process users từ API /api/users/dropdown
    if (usersResponse.data && Array.isArray(usersResponse.data.data)) {
      users.value = usersResponse.data.data.map(user => ({
        id: user.id,
        name: user.name || 'Unknown'
      }));
    } else {
      console.warn('Unexpected users API response:', usersResponse);
      users.value = [];
    }
    
    // Process books từ API /api/books/dropdown
    if (booksResponse.data && Array.isArray(booksResponse.data)) {
      books.value = booksResponse.data.map(book => ({
        id: book.id,
        title: book.name,
        price: book.price || 0,
        isFlashSale: book.isFlashSale || false
      }));
    } else {
      console.warn('Unexpected books API response:', booksResponse);
      books.value = [];
    }
    
    console.log('=== DEBUG: Loaded modal data ===');
    console.log('Users count:', users.value.length);
    console.log('Books count:', books.value.length);
    console.log('Users:', users.value);
    console.log('Books:', books.value.slice(0, 3)); // Log first 3 books only
    
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu cho modal:', error);
    showToast('error', 'Lỗi khi tải dữ liệu cho modal!');
  }
};

const fetchOrders = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    };
    
    // Add filters
    if (searchCode.value) params.code = searchCode.value;
    if (selectedUserId.value) params.userId = selectedUserId.value;
    if (selectedStatus.value) params.orderStatus = selectedStatus.value;
    if (selectedOrderType.value) params.orderType = selectedOrderType.value;
    if (startDateFilter.value) {
      params.startDate = new Date(startDateFilter.value).getTime();
    }
    if (endDateFilter.value) {
      params.endDate = new Date(endDateFilter.value + 'T23:59:59').getTime();
    }
    
    console.log('=== DEBUG: Fetching orders with params ===');
    console.log('Params:', params);
    
    const response = await getOrders(params);
    console.log('=== DEBUG: Orders response ===');
    console.log('Response:', response);
    
    if (response && response.data) {
      orders.value = response.data.content || [];
      currentPage.value = response.data.pageNumber || 0;
      totalPages.value = response.data.totalPages || 0;
      totalElements.value = response.data.totalElements || 0;
      isLastPage.value = response.data.last || false;
    }
    
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    
    // Fallback data cho orders
    const fallbackOrders = [
      {
        id: 1,
        code: 'ORD123456ABC',
        userId: 1,
        userName: 'Nguyễn Văn A',
        userEmail: 'nguyenvana@example.com',
        orderStatus: 'PENDING',
        totalAmount: 350000,
        createdAt: Date.now() - 86400000, // 1 day ago
        paymentMethod: 'COD'
      },
      {
        id: 2,
        code: 'ORD234567DEF',
        userId: 2,
        userName: 'Trần Thị B',
        userEmail: 'tranthib@example.com',
        orderStatus: 'CONFIRMED',
        totalAmount: 520000,
        createdAt: Date.now() - 172800000, // 2 days ago
        paymentMethod: 'BANK_TRANSFER'
      },
      {
        id: 3,
        code: 'ORD345678GHI',
        userId: 3,
        userName: 'Lê Văn C',
        userEmail: 'levanc@example.com',
        orderStatus: 'DELIVERED',
        totalAmount: 480000,
        createdAt: Date.now() - 259200000, // 3 days ago
        paymentMethod: 'COD'
      },
      {
        id: 4,
        code: 'ORD456789JKL',
        userId: 4,
        userName: 'Phạm Thị D',
        userEmail: 'phamthid@example.com',
        orderStatus: 'SHIPPED',
        totalAmount: 290000,
        createdAt: Date.now() - 345600000, // 4 days ago
        paymentMethod: 'CREDIT_CARD'
      },
      {
        id: 5,
        code: 'ORD567890MNO',
        userId: 5,
        userName: 'Hoàng Văn E',
        userEmail: 'hoangvane@example.com',
        orderStatus: 'CANCELED',
        totalAmount: 320000,
        createdAt: Date.now() - 432000000, // 5 days ago
        paymentMethod: 'COD'
      }
    ];
    
    orders.value = fallbackOrders;
    currentPage.value = 0;
    totalPages.value = 1;
    totalElements.value = fallbackOrders.length;
    isLastPage.value = true;
    
    showToast('warning', 'Đang sử dụng dữ liệu đơn hàng mẫu. Vui lòng kiểm tra kết nối backend!');
  }
};

const applyFilters = () => {
  currentPage.value = 0;
  fetchOrders();
};

const clearFilters = () => {
  searchCode.value = '';
  selectedUserId.value = '';
  selectedStatus.value = '';
  selectedOrderType.value = '';
  startDateFilter.value = '';
  endDateFilter.value = '';
  applyFilters();
};

const openAddModal = async () => {
  resetForm();
  isEditMode.value = false;
  
  // Load fresh data for the modal
  await loadUsersAndBooks();
  
  addOrderModal.show();
};

const openEditModal = async (order, index) => {
  try {
    // Load fresh data for the modal first
    await loadUsersAndBooks();
    
    const response = await getOrderById(order.id);
    if (response && response.data) {
      const orderData = response.data;
      
      newOrder.value = {
        id: orderData.id,
        userId: orderData.user?.id || '',
        staffId: orderData.staffId || '',
        addressId: orderData.addressId || '',
        shippingFee: orderData.shippingFee || 0,
        paymentMethod: orderData.paymentMethod || 'COD',
        notes: orderData.notes || '',
        voucherIds: orderData.vouchers ? orderData.vouchers.map(v => v.id) : [],
        items: orderData.orderDetails ? orderData.orderDetails.map(detail => ({
          bookId: detail.bookId,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          totalPrice: detail.totalPrice,
          isFlashSale: !!detail.flashSaleItemId
        })) : []
      };
      
      if (newOrder.value.userId) {
        await loadUserAddresses(newOrder.value.userId);
        await loadUserVouchers(newOrder.value.userId);
      }
      
      isEditMode.value = true;
      editIndex.value = index;
      addOrderModal.show();
    }
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    showToast('error', 'Lỗi khi lấy chi tiết đơn hàng!');
  }
};

const resetForm = () => {
  newOrder.value = {
    id: '',
    userId: '',
    staffId: '',
    addressId: '',
    shippingFee: 30000,
    orderType: 'NORMAL',
    orderStatus: 'PENDING',
    notes: '',
    voucherIds: [],
    items: []
  };
  userAddresses.value = [];
  userVouchers.value = [];
  orderCalculation.value = null;
  isCalculating.value = false;
  editIndex.value = -1;
};

const onUserChange = async () => {
  if (newOrder.value.userId) {
    await loadUserAddresses(newOrder.value.userId);
    await loadUserVouchers(newOrder.value.userId);
    
    // Tính toán lại khi đổi user
    calculateOrderPreview();
  } else {
    userAddresses.value = [];
    userVouchers.value = [];
    orderCalculation.value = null;
  }
  newOrder.value.addressId = '';
  newOrder.value.voucherIds = [];
};

const loadUserAddresses = async (userId) => {
  try {
    const response = await getUserAddressesDropdown(userId);
    userAddresses.value = response.data || [];
    // Auto-select default address
    const defaultAddress = userAddresses.value.find(addr => addr.isDefault);
    if (defaultAddress && !newOrder.value.addressId) {
      newOrder.value.addressId = defaultAddress.id;
    }
  } catch (error) {
    console.error('Lỗi khi lấy địa chỉ user:', error);
    // Fallback data cho địa chỉ
    userAddresses.value = [
      {
        id: 1,
        name: '123 Đường ABC, Phường DEF, Quận GHI, TP.HCM',
        isDefault: true
      },
      {
        id: 2,
        name: '456 Đường XYZ, Phường UVW, Quận RST, TP.HCM',
        isDefault: false
      }
    ];
    // Auto-select default address
    if (!newOrder.value.addressId) {
      newOrder.value.addressId = 1;
    }
    showToast('warning', 'Đang sử dụng địa chỉ mẫu. Vui lòng kiểm tra kết nối backend!');
  }
};

const loadUserVouchers = async (userId) => {
  try {
    const response = await getUserAvailableVouchers(userId);
    userVouchers.value = response.data || [];
  } catch (error) {
    console.error('Lỗi khi lấy vouchers user:', error);
    
    // Fallback data cho vouchers
    userVouchers.value = [
      {
        id: 1,
        name: 'Giảm giá 50k',
        discountAmount: 50000,
        minimumOrderValue: 200000
      },
      {
        id: 2,
        name: 'Freeship toàn quốc',
        discountAmount: 30000,
        minimumOrderValue: 100000
      },
      {
        id: 3,
        name: 'Giảm 15% tối đa 100k',
        discountAmount: 100000,
        minimumOrderValue: 300000
      }
    ];
    
    showToast('warning', 'Đang sử dụng vouchers mẫu. Vui lòng kiểm tra kết nối backend!');
  }
};

const addProductRow = () => {
  newOrder.value.items.push({
    bookId: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    isFlashSale: false
  });
};

const removeProductRow = (index) => {
  newOrder.value.items.splice(index, 1);
};

const onBookChange = (detail, index) => {
  const selectedBook = books.value.find(book => book.id == detail.bookId);
  if (selectedBook) {
    detail.unitPrice = selectedBook.price;
    detail.isFlashSale = selectedBook.isFlashSale || false;
    calculateDetailTotal(detail);
  }
};

// Watch for voucher changes to recalculate
const onVoucherChange = () => {
  calculateOrderPreview();
};

// Watch for shipping fee changes
const onShippingFeeChange = () => {
  calculateOrderPreview();
};

const calculateDetailTotal = (detail) => {
  detail.totalPrice = (detail.quantity || 0) * (detail.unitPrice || 0);
  
  // Trigger order calculation if we have enough data
  if (newOrder.value.userId && newOrder.value.items.length > 0) {
    calculateOrderPreview();
  }
};

// Tính toán đơn hàng tự động khi có thay đổi
const calculateOrderPreview = async () => {
  if (!newOrder.value.userId || newOrder.value.items.length === 0) {
    orderCalculation.value = null;
    return;
  }

  // Chỉ tính nếu các items có đủ thông tin
  const validDetails = newOrder.value.items.filter(detail => 
    detail.bookId && detail.quantity > 0
  );
  
  if (validDetails.length === 0) {
    orderCalculation.value = null;
    return;
  }

  try {
    isCalculating.value = true;
    
    const calculationData = {
      userId: newOrder.value.userId,
      shippingFee: newOrder.value.shippingFee || 30000,
      items: validDetails.map(detail => ({
        bookId: detail.bookId,
        quantity: detail.quantity
      })),
      voucherIds: newOrder.value.voucherIds || []
    };

    console.log('=== DEBUG: Calculating order preview ===');
    console.log('Calculation data:', calculationData);

    const response = await calculateOrder(calculationData);
    
    if (response && response.data) {
      orderCalculation.value = response.data;
      console.log('=== DEBUG: Order calculation result ===');
      console.log('Calculation:', orderCalculation.value);
      
      // Cập nhật giá cho items từ kết quả tính toán
      if (orderCalculation.value.itemDetails) {
        orderCalculation.value.itemDetails.forEach(item => {
          const detail = newOrder.value.items.find(d => d.bookId == item.bookId);
          if (detail) {
            detail.unitPrice = item.unitPrice;
            detail.totalPrice = item.itemTotal;
            detail.isFlashSale = item.isFlashSale;
            detail.savedAmount = item.savedAmount;
            detail.flashSaleName = item.flashSaleName;
          }
        });
      }
    }
  } catch (error) {
    console.error('Lỗi khi tính toán đơn hàng:', error);
    orderCalculation.value = null;
  } finally {
    isCalculating.value = false;
  }
};

const handleSubmitOrder = async () => {
  if (!canSubmitOrder.value) {
    showToast('warning', 'Vui lòng điền đầy đủ thông tin đơn hàng!');
    return;
  }

  try {
    // Chuẩn bị dữ liệu gửi lên backend theo tài liệu API
    const orderData = {
      userId: newOrder.value.userId,
      staffId: getCurrentStaffId(),
      addressId: newOrder.value.addressId,
      shippingFee: newOrder.value.shippingFee,
      orderType: newOrder.value.orderType, // ⚠️ BẮT BUỘC theo tài liệu
      voucherIds: newOrder.value.voucherIds,
      notes: newOrder.value.notes,
      orderDetails: newOrder.value.items.map(item => ({
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };

    console.log('=== DEBUG: Submitting order data ===');
    console.log('Order data:', orderData);

    let response;
    if (isEditMode.value) {
      response = await updateOrder(newOrder.value.id, orderData);
      showToast('success', 'Cập nhật đơn hàng thành công!');
    } else {
      response = await createOrder(orderData);
      showToast('success', `Tạo đơn hàng thành công! Mã đơn: ${response.data?.orderCode || ''}`);
    }

    console.log('=== DEBUG: Order submit response ===');
    console.log('Response:', response);

    addOrderModal.hide();
    resetForm();
    await fetchOrders();

  } catch (error) {
    console.error('Lỗi khi submit đơn hàng:', error);
    
    let errorMessage = 'Lỗi khi xử lý đơn hàng!';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    
    showToast('error', errorMessage);
  }
};

const viewOrderDetail = async (order) => {
  try {
    const response = await getOrderById(order.id);
    if (response && response.data) {
      selectedOrder.value = response.data;
      orderDetailModal.show();
    }
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    showToast('error', 'Lỗi khi lấy chi tiết đơn hàng!');
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const result = await Swal.fire({
      title: 'Xác nhận cập nhật trạng thái',
      text: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy'
    });
    
    if (result.isConfirmed) {
      await updateOrderStatusAPI(orderId, newStatus);
      showToast('success', 'Cập nhật trạng thái thành công!');
      await fetchOrders();
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    
    let errorMessage = 'Lỗi khi cập nhật trạng thái!';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    
    showToast('error', errorMessage);
  }
};

const cancelOrder = async (order) => {
  try {
    const { value: reason } = await Swal.fire({
      title: 'Hủy đơn hàng',
      text: 'Nhập lý do hủy đơn hàng:',
      input: 'textarea',
      inputPlaceholder: 'Lý do hủy đơn hàng...',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Hủy đơn hàng',
      cancelButtonText: 'Không hủy',
      inputValidator: (value) => {
        if (!value) {
          return 'Vui lòng nhập lý do hủy đơn hàng!';
        }
      }
    });
    
    if (reason) {
      await cancelOrderAPI(order.id, reason, order.userId);
      showToast('success', 'Hủy đơn hàng thành công!');
      await fetchOrders();
    }
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error);
    
    let errorMessage = 'Lỗi khi hủy đơn hàng!';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    
    showToast('error', errorMessage);
  }
};

const getAvailableStatusTransitions = (currentStatus) => {
  // Business rules theo tài liệu backend mới
  const transitions = {
    'PENDING': ['CONFIRMED', 'CANCELED'],
    'CONFIRMED': ['SHIPPED', 'CANCELED'], 
    'SHIPPED': ['DELIVERED'],
    'DELIVERED': ['RETURNED', 'REFUNDING'],
    'REFUNDING': ['REFUNDED', 'PARTIALLY_REFUNDED'],
    'RETURNED': ['REFUNDING'],
    'CANCELED': [], // Không thể chuyển trạng thái từ CANCELED
    'REFUNDED': [], // Không thể chuyển trạng thái từ REFUNDED
    'PARTIALLY_REFUNDED': ['REFUNDED'] // Có thể hoàn tiền toàn bộ
  };
  
  const availableStatuses = transitions[currentStatus] || [];
  return orderStatuses.value.filter(status => availableStatuses.includes(status.value));
};

// Pagination methods
const handlePrev = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchOrders();
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    currentPage.value++;
    fetchOrders();
  }
};

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize;
  currentPage.value = 0;
  fetchOrders();
};

// Utility methods
const getCurrentStaffId = () => {
  // Lấy ID của admin đang đăng nhập từ localStorage hoặc store
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.id || null;
};

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

const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const calculateOrderSubtotal = (order) => {
  if (!order.orderDetails) return 0;
  return order.orderDetails.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
};

const calculateVoucherDiscount = (order) => {
  if (!order.vouchers) return 0;
  return order.vouchers.reduce((sum, voucher) => sum + (voucher.discountAmount || 0), 0);
};

const showToast = (icon, title) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true
  });
};

const formatOrderType = (type) => {
  const typeMap = {
    'NORMAL': 'Thường',
    'EVENT_GIFT': 'Quà sự kiện',
    'PROMOTIONAL': 'Khuyến mãi',
    'SAMPLE': 'Mẫu'
  };
  return typeMap[type] || type;
};

// Watch for changes to trigger order calculation
watch([
  () => newOrder.value.userId,
  () => newOrder.value.shippingFee,
  () => newOrder.value.voucherIds,
  () => newOrder.value.items
], () => {
  if (newOrder.value.userId && newOrder.value.items.length > 0) {
    calculateOrderPreview();
  }
}, { deep: true });

// Watch for page changes
watch([currentPage, pageSize], () => {
  fetchOrders();
});
</script>

<style scoped>
/* Enhanced Modal Styles */
.enhanced-modal {
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px 15px 0 0;
  padding: 20px 24px;
  border: none;
}

.gradient-header .modal-title {
  font-weight: 600;
  font-size: 1.25rem;
}

.custom-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.custom-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.enhanced-body {
  padding: 30px;
  background-color: #f8f9fa;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e9ecef;
}

.section-icon {
  font-size: 1.2rem;
  color: #667eea;
  margin-right: 10px;
}

.section-title {
  margin: 0;
  color: #495057;
  font-weight: 600;
}

.enhanced-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
}

.enhanced-input {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.enhanced-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.enhanced-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  border-radius: 0 0 15px 15px;
  padding: 20px 30px;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-cancel {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
}

/* Voucher Styles */
.voucher-selection {
  max-height: 300px;
  overflow-y: auto;
}

.voucher-item {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  background: white;
}

.voucher-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.voucher-item.selected {
  border-color: #28a745;
  background-color: #f8fff8;
}

.voucher-content {
  margin-left: 8px;
}

.voucher-name {
  font-weight: 600;
  color: #495057;
}

.voucher-discount {
  color: #28a745;
  font-weight: 600;
}

.voucher-condition {
  font-size: 0.85rem;
}

/* Product Rows */
.product-row {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.product-row:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Calculation Results */
.calculation-results {
  border: 2px solid #28a745;
  border-radius: 8px;
  padding: 15px;
  background: #f8fff8;
}

.calculation-results .alert {
  margin-bottom: 15px;
  border-radius: 6px;
}

.fallback-calculation {
  border: 2px dashed #ffc107;
  border-radius: 8px;
  padding: 15px;
  background: #fffbf0;
}

/* Order Summary */
.order-summary .card {
  border: 2px solid #28a745;
  border-radius: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 5px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #667eea;
}

/* Responsive */
@media (max-width: 768px) {
  .enhanced-body {
    padding: 20px 15px;
  }
  
  .form-section {
    padding: 20px 15px;
  }
  
  .modal-dialog {
    margin: 10px;
  }
}
</style>
