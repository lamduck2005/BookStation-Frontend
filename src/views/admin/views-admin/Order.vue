<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Quản lý đơn hàng</strong>
      </h6>
    </div>

    <!-- Statistics Dashboard Section -->
    <div class="statistics-section mb-4">
      <!-- Overview Cards -->
      <OverviewCards />
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
                <i class="bi bi-receipt me-1"></i>
                Mã đơn hàng
              </label>
              <input 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Nhập mã đơn hàng" 
                v-model="searchCode" 
                @input="debouncedSearch"
                @keyup.enter="applyFilters"
              />
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-person me-1"></i>
                Khách hàng
              </label>
              <select class="form-select form-select-sm" v-model="selectedUserId" @change="applyFilters">
                <option value="">Tất cả khách hàng</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }}
                </option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-toggle-on me-1"></i>
                Trạng thái
              </label>
              <select class="form-select form-select-sm" v-model="selectedStatus" @change="applyFilters">
                <option value="">Tất cả trạng thái</option>
                <option v-for="status in orderStatuses" :key="status.value" :value="status.value">
                  {{ status.displayName }}
                </option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-bag me-1"></i>
                Loại đơn hàng
              </label>
              <select class="form-select form-select-sm" v-model="selectedOrderType" @change="applyFilters">
                <option value="">Tất cả loại</option>
                <option v-for="type in orderTypes" :key="type.value" :value="type.value">
                  {{ type.displayName }}
                </option>
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
                v-model="startDateFilter" 
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
                v-model="endDateFilter" 
                @change="applyFilters"
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
      <div class="col-lg-10 col-xl-10">
        <!-- Danh sách Order -->
        <div class="card shadow-lg border-0 mb-4 admin-table-card">
          <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
            <div>
              <h5 class="mb-0 text-secondary">
                <i class="bi bi-receipt me-2"></i>
                Danh sách đơn hàng
              </h5>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-info btn-sm py-2" @click="fetchOrders" :disabled="loading">
                <i class="bi bi-arrow-repeat me-1"></i> Làm mới
              </button>
              
              <!-- Nút Export Excel -->
              <ExcelExportButton 
                data-type="orders"
                button-text="Xuất Excel"
              />
              
              <AddButton @click="openAddModal" />
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
                    <th style="min-width: 200px;">Thao tác</th>
                    <th style="min-width: 150px;">Mã đơn hàng</th>
                    <th style="min-width: 200px;">Khách hàng</th>
                    <th style="min-width: 150px;">Trạng thái</th>
                    <th style="min-width: 150px;">Địa chỉ</th>
                    <th style="min-width: 120px;">Loại đơn</th>
                    <th style="min-width: 120px;">Tạm tính</th>
                    <th style="min-width: 120px;">Phí ship</th>
                    <th style="min-width: 120px;">Tổng tiền</th>
                    <th style="min-width: 150px;">Ngày tạo</th>
                    <th style="min-width: 150px;">Staff</th>
                  </tr>
                </thead>
                <tbody>
              <tr v-for="(order, index) in orders" :key="order.id">
                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <button 
                      class="btn btn-outline-info btn-sm" 
                      @click="viewOrderDetail(order)"
                      title="Xem chi tiết"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    
                  </div>
                </td>
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
                  <!-- Custom Status Dropdown -->
                  <div class="position-relative status-dropdown-container" :id="'status-dropdown-' + order.id">
                    <!-- Current Status Display Button -->
                    <button
                      type="button"
                      class="btn btn-sm d-flex align-items-center justify-content-between"
                      :class="getOrderStatusClass(order.orderStatus)"
                      @click="toggleStatusDropdown(order.id)"
                      style="min-width: 150px; font-size: 0.82em; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); white-space: nowrap;"
                    >
                      <span>{{ order.orderStatusDisplay }}</span>
                      <i class="bi bi-chevron-down ms-2" 
                         :class="{ 'rotate-180': openDropdowns.includes(order.id) }"
                         style="transition: transform 0.2s ease;"></i>
                    </button>
                    
                    <!-- Dropdown Menu -->
                    <div 
                      v-if="openDropdowns.includes(order.id)"
                      class="dropdown-menu show position-absolute w-100 mt-1"
                      style="z-index: 1050; max-height: 200px; overflow-y: auto;"
                      @click.stop
                    >
                      <!-- Available Status Transitions -->
                      <template v-if="getAvailableStatusTransitionsForOrder(order).length > 0">
                        
                        <button
                          v-for="status in getAvailableStatusTransitionsForOrder(order)" 
                          :key="status.targetStatus || status.value"
                          type="button"
                          class="dropdown-item d-flex align-items-center py-2"
                          :class="getOrderStatusClass(status.targetStatus || status.value)"
                          @click="handleStatusChange(order, status.targetStatus || status.value)"
                          style="border-left: 3px solid; border-left-color: inherit; font-weight: 500;"
                        >
                          <i class="bi bi-arrow-right me-2"></i>
                          {{ status.displayName }}
                        </button>
                      </template>
                      <div v-else class="dropdown-item-text text-muted text-center py-3">
                        <i class="bi bi-info-circle me-1"></i>
                       <span> Không có trạng thái phù hợp để chuyển</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="small">
                    {{ order.addressDetail || 'Chưa có địa chỉ' }}
                  </div>
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
                  <strong class="text-success">{{ formatCurrency(order.finalTotal || order.totalAmount) }}</strong>
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
            @goToPage="handleGoToPage"
          />
        </div>
      </div>
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
            Tạo đơn hàng mới
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
                  <div class="position-relative">
                    <input 
                      type="text" 
                      class="form-control enhanced-input" 
                      v-model="customerSearchTerm"
                      @input="onCustomerSearch"
                      @focus="onCustomerInputFocus"
                      @blur="onCustomerInputBlur"
                      placeholder="Nhập tên hoặc email khách hàng"
                      autocomplete="off"
                      required
                    />
                    <!-- Loading spinner -->
                    <div 
                      v-if="isSearchingCustomers"
                      class="position-absolute top-50 end-0 translate-middle-y me-3"
                    >
                      <div class="spinner-border spinner-border-sm text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    
                    <!-- Dropdown results -->
                    <div 
                      v-if="showCustomerDropdown"
                      class="dropdown-menu show position-absolute w-100 mt-1"
                      style="z-index: 1060; max-height: 200px; overflow-y: auto;"
                    >
                      <!-- Loading state -->
                      <div v-if="isSearchingCustomers" class="dropdown-item-text text-center py-3">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Đang tìm kiếm...
                      </div>
                      
                      <!-- Results -->
                      <template v-else-if="customerSearchResults.length > 0">
                        <div 
                          v-for="customer in customerSearchResults" 
                          :key="customer.id"
                          class="dropdown-item cursor-pointer d-flex align-items-center"
                          @click="selectCustomer(customer)"
                        >
                          <div class="flex-grow-1">
                            <div class="fw-medium">{{ customer.name }}</div>
                            <div class="text-muted small">{{ customer.email }}</div>
                          </div>
                        </div>
                      </template>
                      
                      <!-- No results -->
                      <div v-else class="dropdown-item-text text-center py-3 text-muted">
                        <i class="bi bi-search me-2"></i>
                        {{ customerSearchTerm.length >= 2 ? 'Không tìm thấy khách hàng' : 'Nhập tối thiểu 2 ký tự để tìm kiếm' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label enhanced-label">Địa chỉ giao hàng <span class="text-danger">*</span></label>
                  <div class="d-flex gap-2">
                    <select 
                      class="form-select enhanced-input" 
                      v-model="newOrder.addressId"
                      :disabled="!newOrder.userId"
                      required
                      @change="onAddressChange"
                    >
                      <option value="">-- Chọn địa chỉ giao hàng --</option>
                      <option v-for="address in userAddresses" :key="address.id" :value="address.id">
                        {{ address.recipientName }} - {{ address.phoneNumber }} - {{ address.addressDetail }}
                      </option>
                    </select>
                    <button 
                      type="button" 
                      class="btn btn-outline-primary btn-sm"
                      :disabled="!newOrder.userId"
                      @click="openAddAddressModal"
                      title="Thêm địa chỉ mới"
                    >
                      <i class="bi bi-plus-circle"></i>
                    </button>
                  </div>
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
                <div class="col-md-4">
                  <label class="form-label enhanced-label">Phí vận chuyển <span class="text-danger">*</span></label>
                  <input 
                  readonly
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
                <div class="col-md-4">
                  <label class="form-label enhanced-label">Loại đơn hàng</label>
                  <select 
                    class="form-select enhanced-input" 
                    v-model="newOrder.orderType"
                    @change="onOrderTypeChange"
                  >
                    <option v-for="type in orderTypes" :key="type.value" :value="type.value">
                      {{ type.displayName }}
                    </option>
                  </select>
                  <small class="text-muted">
                    <i class="bi bi-info-circle me-1"></i>
                    {{ newOrder.orderType === 'COUNTER' ? 'Đơn tại quầy' : 'Đơn online' }}
                  </small>
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
                <h6 class="section-title">Vouchers (Tối đa 2 voucher: 1 Giảm giá vận chuyển + 1 Giảm giá sản phẩm)</h6>
              </div>
              <div class="row g-3">
                <div class="col-12">
                  <div class="voucher-selection">
                    <div v-if="userVouchers.length === 0" class="text-muted">
                      Khách hàng này không có voucher khả dụng
                    </div>
                    <div v-else class="row g-3">
                      <div 
                        v-for="voucher in userVouchers" 
                        :key="voucher.id"
                        class="col-12"
                      >
                        <div 
                          class="voucher-item card" 
                          :class="{
                            'selected border-primary': newOrder.voucherIds.includes(voucher.id),
                            'disabled-voucher': !canSelectVoucher(voucher) && !newOrder.voucherIds.includes(voucher.id),
                            'border-warning': !canSelectVoucher(voucher) && !newOrder.voucherIds.includes(voucher.id)
                          }"
                          @click="toggleVoucher(voucher)"
                          style="cursor: pointer;"
                        >
                          <div class="card-body p-3">
                            <div class="form-check">
                              <input 
                                class="form-check-input" 
                                type="checkbox" 
                                :value="voucher.id"
                                v-model="newOrder.voucherIds"
                                :disabled="!newOrder.voucherIds.includes(voucher.id) && (newOrder.voucherIds.length >= 2 || !canSelectVoucher(voucher))"
                                :id="'voucher-' + voucher.id"
                                @change="onVoucherChange"
                              >
                              <label class="form-check-label w-100" :for="'voucher-' + voucher.id">
                                <div class="voucher-content">
                                  <div class="row">
                                    <div class="col-md-8">
                                      <div class="voucher-name fw-bold text-primary">{{ voucher.code }} - {{ voucher.name }}</div>
                                      <div class="voucher-description text-muted small mb-2">{{ voucher.description }}</div>
                                      
                                      <!-- Hiển thị lý do không thể chọn voucher -->
                                      <div v-if="!canSelectVoucher(voucher) && !newOrder.voucherIds.includes(voucher.id)" class="voucher-warning mb-2">
                                        <div class="alert alert-warning py-2 px-3 mb-0 small">
                                          <i class="bi bi-exclamation-triangle me-1"></i>
                                          <span v-if="getCurrentSubtotal() < voucher.minOrderValue">
                                            Cần đơn hàng tối thiểu {{ formatCurrency(voucher.minOrderValue) }} (hiện tại: {{ formatCurrency(getCurrentSubtotal()) }})
                                          </span>
                                          <span v-else-if="getVoucherTypeConflict(voucher)">
                                            Đã chọn {{ getVoucherTypeConflict(voucher) }}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <div class="voucher-info">
                                        <span class="badge bg-info me-2">{{ voucher.categoryVi }}</span>
                                        <span class="badge bg-secondary me-2">{{ voucher.discountTypeVi }}</span>
                                        <span class="text-success fw-bold">{{ voucher.discountInfo }}</span>
                                      </div>
                                    </div>
                                    <div class="col-md-4 text-end">
                                      <div class="voucher-usage mb-2">
                                        <div class="small text-muted">Số lượng còn lại:</div>
                                        <div class="fw-bold text-success">{{ voucher.remainingUses }}/{{ voucher.usageLimit }}</div>
                                      </div>
                                      <div class="voucher-expire">
                                        <div class="small text-muted">Hết hạn:</div>
                                        <div class="small fw-bold text-warning">{{ voucher.expireDate }}</div>
                                      </div>
                                    </div>
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
            </div>

            <!-- Section 4: Sản phẩm -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-box section-icon"></i>
                <h6 class="section-title">Sản phẩm trong đơn hàng</h6>
              </div>
              
             

              <!-- Product Search -->
              <div class="mb-4">
                <label class="form-label">Tìm kiếm sản phẩm để thêm vào đơn hàng</label>
                <div class="position-relative">
                  <div class="input-group">
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="productSearchTerm"
                      @input="onProductSearch"
                      @focus="onProductInputFocus"
                      @blur="onProductInputBlur"
                      placeholder="Nhập tên sách hoặc mã sách để tìm kiếm..."
                    />
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="clearProductSearch"
                      v-if="productSearchTerm || showProductSearchResults"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                  
                  <!-- Search Results -->
                  <div 
                    v-if="showProductSearchResults && productSearchResults.length > 0"
                    class="position-absolute bg-white border rounded-3 shadow-lg w-100 mt-1"
                    style="z-index: 1050; max-height: 300px; overflow-y: auto;"
                  >
                    <div class="p-2 bg-light border-bottom d-flex justify-content-between align-items-center">
                      <small class="text-muted">{{ productSearchResults.length }} sản phẩm tìm thấy</small>
                      <button 
                        type="button" 
                        class="btn btn-sm btn-outline-secondary"
                        @click="showProductSearchResults = false"
                      >
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                    <div 
                      v-for="book in productSearchResults" 
                      :key="book.id"
                      class="p-3 border-bottom hover-bg-light cursor-pointer"
                      @click="addBookToOrder(book)"
                    >
                      <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                          <div class="fw-bold text-primary">#{{ book.id }} - {{ book.name }}</div>
                          <div class="small text-muted mb-1">Mã: {{ book.bookCode }}</div>
                          <div class="d-flex gap-2 mb-1">
                            <span class="badge bg-secondary">Tồn kho: {{ book.stockQuantity }}</span>
                            <span class="badge bg-warning" v-if="book.processingQuantity > 0">Đang xử lý: {{ book.processingQuantity }}</span>
                            <span class="badge bg-info" v-if="book.soldQuantity > 0">Đã bán: {{ book.soldQuantity }}</span>
                          </div>
                          <div v-if="book.isFlashSale" class="d-flex gap-2">
                            <span class="badge bg-danger">🔥 Flash Sale</span>
                            <span class="badge bg-success">Tồn kho FS: {{ book.flashSaleStockQuantity }}</span>
                            <span class="badge bg-warning" v-if="book.flashSaleProcessingQuantity > 0">FS đang xử lý: {{ book.flashSaleProcessingQuantity }}</span>
                          </div>
                        </div>
                        <div class="text-end">
                          <div class="fw-bold text-success">{{ formatCurrency(book.normalPrice) }}</div>
                          <div v-if="book.isFlashSale" class="text-decoration-line-through text-muted small">{{ formatCurrency(book.originalPrice) }}</div>
                          <div v-if="book.isFlashSale" class="text-danger fw-bold">🔥 {{ formatCurrency(book.flashSalePrice) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Product rows -->
              <div v-if="newOrder.items.length === 0" class="text-muted text-center py-4">
                Chưa có sản phẩm nào. Tìm kiếm và click vào sản phẩm ở trên để thêm vào đơn hàng.
              </div>
              
              <div v-for="(detail, index) in newOrder.items" :key="index" class="product-row mb-3">
                <div class="row g-3 align-items-end">
                  <div class="col-md-5">
                    <label class="form-label">Sách <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      :value="getBookDisplayName(detail.bookId)"
                      readonly
                      style="background-color: #f8f9fa;"
                    />
                  </div>
                  <div class="col-md-2">
                    <label class="form-label">Số lượng <span class="text-danger">*</span></label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="detail.quantity"
                      @change="onQuantityChange(detail)"
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
                      min="0"
                      step="1000"
                      readonly
                      style="background-color: #f8f9fa;"
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
                            <strong  >{{ formatCurrency(orderCalculation.shippingFee) }}</strong>
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
                            <strong 
                              :class="orderCalculation.subtotal > 100000000 ? 'text-danger fs-5' : 'text-primary fs-5'"
                            >
                              {{ formatCurrency(orderCalculation.finalTotal) }}
                            </strong>
                          </div>
                          
                          <!-- ✅ CẢNH BÁO GIỚI HẠN 100 TRIỆU THEO SUBTOTAL -->
                          <div v-if="orderCalculation.subtotal > 100000000" class="mt-2">
                            <div class="alert alert-danger py-2 px-3 mb-0 small">
                              <i class="bi bi-exclamation-triangle-fill me-2"></i>
                              <strong>⚠️ VƯỢT GIỚI HẠN ĐẶT HÀNG ONLINE!</strong>
                              <br>
                              <span class="small">
                                Giá trị sản phẩm: <strong>{{ formatCurrency(orderCalculation.subtotal) }}</strong> vượt quá giới hạn 
                                <strong>100,000,000 VNĐ</strong>. 
                                Chính sách cửa hàng không cho phép đặt hàng online với giá trị sản phẩm vượt quá mức này.
                              </span>
                            </div>
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
            class="btn btn-warning me-2" 
            @click="reloadBookPricesFromDropdown"
          >
            <i class="bi bi-arrow-repeat me-1"></i>
            Cập nhật giá mới
          </button>
          <button 
            type="button" 
            class="btn btn-primary btn-submit" 
            @click="handleSubmitOrder"
            :disabled="!canSubmitOrder"
            :title="getSubmitButtonTooltip"
            :class="{
              'btn-danger': orderCalculation && orderCalculation.subtotal > 100000000,
              'btn-primary': !orderCalculation || orderCalculation.subtotal <= 100000000
            }"
          >
            <i class="bi bi-check-circle me-1" v-if="!orderCalculation || orderCalculation.subtotal <= 100000000"></i>
            <i class="bi bi-exclamation-triangle-fill me-1" v-else></i>
            {{ getSubmitButtonText }}
          </button>
          
          <!-- ✅ NOTE BÊN DƯỚI BUTTON KHI VƯỢT GIỚI HẠN -->
          <div v-if="orderCalculation && orderCalculation.subtotal > 100000000" class="mt-2">
            <div class="alert alert-danger py-2 px-3 mb-0 small">
              <i class="bi bi-info-circle me-1"></i>
              <strong>Lý do không thể đặt hàng:</strong> Giá trị sản phẩm {{ formatCurrency(orderCalculation.subtotal) }} vượt quá giới hạn {{ formatCurrency(100000000) }} theo chính sách cửa hàng. Vui lòng liên hệ khách hàng đặt hàng trực tiếp tại cửa hàng hoặc giảm số lượng sản phẩm.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <!-- Order Detail Modal -->
  <div class="modal fade" id="orderDetailModal" tabindex="-1" aria-labelledby="orderDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 class="modal-title" id="orderDetailModalLabel">
            <i class="bi bi-file-earmark-text me-2"></i>
            Chi tiết đơn hàng #{{ selectedOrder?.orderCode || selectedOrder?.code }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="selectedOrder">
          <!-- Order Header Info -->
          <div class="order-detail-header mb-4">
            <div class="row">
              <div class="col-md-8">
                <div class="info-section">
                  <h6 class="section-title">
                    <i class="bi bi-receipt me-2"></i>Thông tin đơn hàng
                  </h6>
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>Mã đơn hàng:</strong> {{ selectedOrder.orderCode || selectedOrder.code }}</p>
                      <p><strong>Loại đơn hàng:</strong> 
                        <span class="badge bg-info ms-2">{{ formatOrderType(selectedOrder.orderType) }}</span>
                      </p>
                      <p><strong>Ngày tạo:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
                      <p><strong>Nhân viên tạo:</strong> {{ selectedOrder.staffName || 'Hệ thống' }}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>Trạng thái:</strong> 
                        <StatusLabel 
                          :status="selectedOrder.orderStatus" 
                          :statusText="formatOrderStatus(selectedOrder.orderStatus)"
                          :statusClass="getOrderStatusClass(selectedOrder.orderStatus)"
                        />
                      </p>
                      <p><strong>Cập nhật lần cuối:</strong> {{ formatDate(selectedOrder.updatedAt) }}</p>
                      <p v-if="selectedOrder.notes"><strong>Ghi chú:</strong> {{ selectedOrder.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="info-section">
                  <h6 class="section-title">
                    <i class="bi bi-person me-2"></i>Thông tin khách hàng
                  </h6>
                  <p><strong>Tên:</strong> {{ selectedOrder.userName }}</p>
                  <p><strong>Email:</strong> {{ selectedOrder.userEmail }}</p>
                  <p v-if="selectedOrder.addressDetail">
                    <strong>Địa chỉ giao hàng:</strong><br>
                    <span class="text-muted">{{ selectedOrder.addressDetail }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items with Enhanced Display -->
          <div class="mb-4">
            <h6 class="section-title">
              <i class="bi bi-bag me-2"></i>Sản phẩm trong đơn hàng
            </h6>
            <div class="order-items-container">
              <div v-for="item in selectedOrder.itemDetails || selectedOrder.orderDetails" 
                   :key="item.id || item.bookId" 
                   class="order-item-detail">
                <div class="row align-items-center">
                  <div class="col-md-4">
                    <div class="item-info">
                      <h6 class="item-name">{{ item.bookName || item.bookTitle }}</h6>
                      <p class="item-code text-muted small">Mã sách: {{ item.bookCode }}</p>
                      <div v-if="item.isFlashSale" class="flash-sale-badge">
                        <i class="bi bi-fire"></i>
                        {{ item.flashSaleName }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2 text-center">
                    <div class="price-info">
                      <div v-if="item.originalPrice && item.isFlashSale">
                        <span class="original-price text-muted text-decoration-line-through small d-block">
                          {{ formatCurrency(item.originalPrice) }}
                        </span>
                        <strong class="sale-price text-danger">
                          {{ formatCurrency(item.unitPrice) }}
                        </strong>
                        <div class="badge bg-success small mt-1">
                          Tiết kiệm {{ formatCurrency(item.savedAmount || (item.originalPrice - item.unitPrice)) }}
                        </div>
                      </div>
                      <div v-else>
                        <strong>{{ formatCurrency(item.unitPrice) }}</strong>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-1 text-center">
                    <span class="quantity-badge">{{ item.quantity }}</span>
                  </div>
                  <div class="col-md-2 text-center">
                    <strong class="item-total">{{ formatCurrency(item.itemTotal || item.totalPrice) }}</strong>
                  </div>
                  <div class="col-md-2">
                    <div v-if="item.refundedQuantity && item.refundedQuantity > 0" class="refund-info-detail">
                      <div class="refund-badge">
                        <i class="bi bi-arrow-return-left me-1"></i>
                        Hoàn {{ item.refundedQuantity }} sản phẩm
                      </div>
                      <small class="refund-reason d-block text-muted">
                        {{ item.refundReasonDisplay || 'Không có lý do' }}
                      </small>
                      <span class="refund-status-badge" :class="{
                        'badge-success': item.refundStatusDisplay === 'Đã hoàn tiền',
                        'badge-info': item.refundStatusDisplay === 'Đang xử lý',
                        'badge-warning': item.refundStatusDisplay === 'Chờ duyệt',
                        'badge-danger': item.refundStatusDisplay === 'Từ chối'
                      }">
                        {{ item.refundStatusDisplay || 'Không xác định' }}
                      </span>
                    </div>
                    <span v-else class="text-muted small">Không có hoàn hàng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Vouchers Section -->
          <div class="mb-4" v-if="(selectedOrder.vouchers && selectedOrder.vouchers.length > 0) || 
                                   (selectedOrder.voucherDiscountAmount > 0) || 
                                   (selectedOrder.discountAmount > 0) ||
                                   (selectedOrder.regularVoucherDiscount > 0) || 
                                   (selectedOrder.shippingVoucherDiscount > 0) ||
                                   (selectedOrder.totalVoucherDiscount > 0)">
            <h6 class="section-title">
              <i class="bi bi-ticket-perforated me-2"></i>Vouchers đã áp dụng
            </h6>
            <div class="voucher-list">
              <!-- Display vouchers from vouchers array (primary source) -->
              <template v-if="selectedOrder.vouchers && selectedOrder.vouchers.length > 0">
                <div v-for="voucher in selectedOrder.vouchers" :key="voucher.id" class="voucher-item-detail">
                  <div class="voucher-header">
                    <div class="voucher-code">{{ voucher.code }}</div>
                    <div class="voucher-discount">-{{ formatCurrency(calculateIndividualVoucherDiscount(voucher, selectedOrder)) }}</div>
                  </div>
                  <div class="voucher-name">{{ voucher.name }}</div>
                  <div class="voucher-description small text-muted">{{ voucher.description }}</div>
                  <div class="voucher-type small">
                    <span class="badge" :class="{
                      'bg-primary': voucher.voucherCategory === 'NORMAL',
                      'bg-success': voucher.voucherCategory === 'SHIPPING',
                      'bg-warning': voucher.voucherCategory === 'FLASHSALE'
                    }">
                      {{ voucher.voucherCategory === 'NORMAL' ? 'Giảm giá sản phẩm' : 
                         voucher.voucherCategory === 'SHIPPING' ? 'Miễn phí vận chuyển' : 
                         voucher.voucherCategory }}
                    </span>
                    <span class="badge bg-info ms-1">
                      {{ voucher.discountType === 'FIXED_AMOUNT' ? 'Giảm cố định' : 'Giảm theo %' }}
                    </span>
                  </div>
                </div>
              </template>

              <template v-else>
                <!-- Product voucher discount -->
                <div v-if="selectedOrder.voucherDiscountAmount > 0" class="voucher-item-detail">
                  <div class="voucher-header">
                    <div class="voucher-code">{{ selectedOrder.voucherCode || 'PRODUCT_DISCOUNT' }}</div>
                    <div class="voucher-discount">-{{ formatCurrency(selectedOrder.voucherDiscountAmount) }}</div>
                  </div>
                  <div class="voucher-name">Voucher giảm giá sản phẩm</div>
                  <div class="voucher-description small text-muted">Áp dụng cho tổng giá trị đơn hàng</div>
                </div>

                <!-- General discount amount -->
                <div v-else-if="selectedOrder.discountAmount > 0" class="voucher-item-detail">
                  <div class="voucher-header">
                    <div class="voucher-code">DISCOUNT</div>
                    <div class="voucher-discount">-{{ formatCurrency(selectedOrder.discountAmount) }}</div>
                  </div>
                  <div class="voucher-name">Giảm giá tổng</div>
                  <div class="voucher-description small text-muted">Tổng số tiền được giảm cho đơn hàng</div>
                </div>

                <!-- Shipping discount -->
                <div v-if="selectedOrder.discountShipping > 0" class="voucher-item-detail">
                  <div class="voucher-header">
                    <div class="voucher-code">{{ selectedOrder.shippingVoucherCode || 'FREE_SHIPPING' }}</div>
                    <div class="voucher-discount">-{{ formatCurrency(selectedOrder.discountShipping) }}</div>
                  </div>
                  <div class="voucher-name">Voucher miễn phí vận chuyển</div>
                  <div class="voucher-description small text-muted">Giảm giá phí giao hàng</div>
                </div>

                <!-- Regular voucher discount (alternative field) -->
                <div v-if="selectedOrder.regularVoucherDiscount > 0" class="voucher-item-detail">
                  <div class="voucher-header">
                    <div class="voucher-code">{{ selectedOrder.regularVoucherCode || 'REGULAR_DISCOUNT' }}</div>
                    <div class="voucher-discount">-{{ formatCurrency(selectedOrder.regularVoucherDiscount) }}</div>
                  </div>
                  <div class="voucher-name">Voucher giảm giá thường</div>
                  <div class="voucher-description small text-muted">Voucher giảm giá cho đơn hàng</div>
                </div>

                <!-- Shipping voucher discount (alternative field) -->  
                <div v-if="selectedOrder.shippingVoucherDiscount > 0" class="voucher-item-detail">
                  <div class="voucher-header">
                    <div class="voucher-code">{{ selectedOrder.shippingVoucherCode || 'SHIP_DISCOUNT' }}</div>
                    <div class="voucher-discount">-{{ formatCurrency(selectedOrder.shippingVoucherDiscount) }}</div>
                  </div>
                  <div class="voucher-name">Voucher giảm phí ship</div>
                  <div class="voucher-description small text-muted">Giảm giá phí vận chuyển</div>
                </div>

                <div v-if="selectedOrder.totalVoucherDiscount > 0 && 
                          !selectedOrder.voucherDiscountAmount && 
                          !selectedOrder.discountAmount &&
                          !selectedOrder.regularVoucherDiscount &&
                          !selectedOrder.shippingVoucherDiscount" class="voucher-item-detail">
                  <div class="voucher-header">
                    <div class="voucher-code">TOTAL_DISCOUNT</div>
                    <div class="voucher-discount">-{{ formatCurrency(selectedOrder.totalVoucherDiscount) }}</div>
                  </div>
                  <div class="voucher-name">Tổng giảm giá voucher</div>
                  <div class="voucher-description small text-muted">Tất cả voucher đã áp dụng cho đơn hàng</div>
                </div>
              </template>
            </div>
          </div>

          <!-- Enhanced Order Summary -->
          <div class="order-summary-section">
            <h6 class="section-title mb-3">
              <i class="bi bi-calculator me-2"></i>Chi tiết thanh toán
            </h6>
            <div class="summary-table">
              <div class="summary-row">
                <span>Tạm tính sản phẩm:</span>
                <span>{{ formatCurrency(selectedOrder.subtotal || calculateOrderSubtotal(selectedOrder)) }}</span>
              </div>
              <div class="summary-row" v-if="selectedOrder.shippingFee > 0">
                <span>Phí vận chuyển:</span>
                <span>{{ formatCurrency(selectedOrder.shippingFee) }}</span>
              </div>
              
              <!-- Voucher Discounts - Using correct API fields -->
              <div class="summary-row discount" v-if="selectedOrder.voucherDiscountAmount > 0">
                <span>
                  <i class="bi bi-ticket-perforated me-1"></i>
                  Tổng giảm giá voucher:
                </span>
                <span>-{{ formatCurrency(selectedOrder.voucherDiscountAmount) }}</span>
              </div>
              
              <div class="summary-row discount" v-if="selectedOrder.discountAmount > 0 && selectedOrder.discountAmount !== selectedOrder.voucherDiscountAmount">
                <span>
                  <i class="bi bi-cash-coin me-1"></i>
                   Tổng giảm giá sản phẩm:
                </span>
                <span>-{{ formatCurrency(selectedOrder.discountAmount) }}</span>
              </div>
              
              <div class="summary-row discount" v-if="selectedOrder.discountShipping > 0">
                <span>
                  <i class="bi bi-truck me-1"></i>
                  Giảm giá phí ship:
                </span>
                <span>-{{ formatCurrency(selectedOrder.discountShipping) }}</span>
              </div>

              <div class="summary-row discount" v-if="selectedOrder.regularVoucherDiscount > 0 && !selectedOrder.voucherDiscountAmount">
                <span>
                  <i class="bi bi-ticket-perforated me-1"></i>
                  Giảm giá voucher thường:
                </span>
                <span>-{{ formatCurrency(selectedOrder.regularVoucherDiscount) }}</span>
              </div>
              
              <div class="summary-row discount" v-if="selectedOrder.shippingVoucherDiscount > 0 && !selectedOrder.discountShipping">
                <span>
                  <i class="bi bi-truck me-1"></i>
                  Voucher phí ship:
                </span>
                <span>-{{ formatCurrency(selectedOrder.shippingVoucherDiscount) }}</span>
              </div>

              <!-- Refund information -->
              <div class="summary-row refund" v-if="selectedOrder.totalRefundedAmount > 0">
                <span>
                  <i class="bi bi-arrow-return-left me-1"></i>
                  Số tiền đã hoàn:
                </span>
                <span>-{{ formatCurrency(selectedOrder.totalRefundedAmount) }}</span>
              </div>
              
              <div class="summary-row total">
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-currency-exchange text-warning fs-4"></i>
                  <span class="text-dark" style="font-size: 1.5rem; letter-spacing: 1px;">Tổng cộng:</span>
                </span>
                <span>
                  <strong class="text-success" style="font-size: 1.5rem; text-shadow: 0 2px 8px #e3e8ee; letter-spacing: 1px;">{{ formatCurrency(selectedOrder.totalAmount) }}</strong>
                </span>
              </div>
            </div>
            <div v-if="selectedOrder.message" class="order-message mt-3">
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                {{ selectedOrder.message }}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer bg-light">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="bi bi-x-circle me-2"></i>Đóng
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Address Modal -->
  <div class="modal fade" id="addAddressModal" tabindex="-1" aria-labelledby="addAddressModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addAddressModalLabel">
            <i class="bi bi-geo-alt me-2"></i>Thêm địa chỉ mới
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleSaveAddress">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Họ và tên *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="addressForm.recipientName"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số điện thoại *</label>
                <input 
                  type="tel" 
                  class="form-control" 
                  v-model="addressForm.phoneNumber"
                  placeholder="0123456789"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Địa chỉ *</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="addressForm.addressDetail"
                placeholder="Số nhà 1, ngõ 1"
                required
              />
            </div>

            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Tỉnh/Thành phố *</label>
                <select class="form-select" v-model="addressForm.provinceId" required @change="onProvinceChange">
                  <option value="">Chọn tỉnh/thành phố</option>
                  <option v-for="p in provinces" :key="p.ProvinceID" :value="p.ProvinceID">
                    {{ p.ProvinceName }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Quận/Huyện *</label>
                <select class="form-select" v-model="addressForm.districtId" required @change="onDistrictChange">
                  <option value="">Chọn quận/huyện</option>
                  <option v-for="d in districts" :key="d.DistrictID" :value="d.DistrictID">
                    {{ d.DistrictName || d.ProvinceName }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Phường/Xã *</label>
                <select class="form-select" v-model="addressForm.wardCode" required @change="onWardChange">
                  <option value="">Chọn phường/xã</option>
                  <option v-for="w in wards" :key="w.WardCode" :value="w.WardCode">
                    {{ w.WardName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Loại địa chỉ</label>
              <div class="form-check-group">
                <div class="form-check form-check-inline">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    name="addressType" 
                    id="home"
                    value="HOME"
                    v-model="addressForm.addressType"
                  />
                  <label class="form-check-label" for="home">Nhà riêng</label>
                </div>
                <div class="form-check form-check-inline">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    name="addressType" 
                    id="office"
                    value="OFFICE"
                    v-model="addressForm.addressType"
                  />
                  <label class="form-check-label" for="office">Văn phòng</label>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="isDefault"
                  v-model="addressForm.isDefault"
                />
                <label class="form-check-label" for="isDefault">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isSavingAddress"
              >
                <span v-if="isSavingAddress" class="spinner-border spinner-border-sm me-2"></span>
                Lưu địa chỉ
              </button>
            </div>
          </form>
        </div>
      </div>
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

// ✅ KHÔI PHỤC LẠI STATISTICS COMPONENTS - ĐÃ FIX INFINITE LOOP
// Import Statistics Components
import OverviewCards from '@/views/admin/components-admin/statistics/OverviewCards.vue';
import OrderPerformanceChart from '@/views/admin/components-admin/statistics/OrderPerformanceChart.vue';


// Filter visibility
const showFilter = ref(true);

// State variables
const loading = ref(false);
import LocationStats from '@/views/admin/components-admin/statistics/LocationStats.vue';

import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { Modal } from 'bootstrap';
import {
  getOrders, 
  createOrder, 
  getOrderById,
  calculateOrder,
  validateOrder,
  validatePrices, // ✅ THÊM VALIDATE PRICES
  updateOrderStatusTransition, // ✅ THÊM API CHUYỂN TRẠNG THÁI MỚI
  updateOrderStatus as updateOrderStatusAPI,
  cancelOrder as cancelOrderAPI,
  getOrderStatuses, 
  getOrderTypes,
  getUserAddressesDropdown,
  getUserAvailableVouchers,
  getVouchersDropdown,
  formatOrderStatus,
  getOrderStatusClass,
  // ✅ THÊM REFUND APIs MỚI
  uploadRefundMixedEvidence,
  validateRefundConditions,
  requestRefund,
  adminApproveRefund,
  adminRejectRefund,
  adminPartialRefund,
  adminFullRefund,
  getPendingRefunds
} from '@/services/admin/order';
import { getUsersForOrder, searchUsersDropdown } from '@/services/admin/user';
import { getBooksForOrder, getBooksDropdown, validateQuantity } from '@/services/admin/book';
import { addAddressAtAdmin } from '@/services/client/address';
import Swal from 'sweetalert2';
import { ghn } from '@/utils/giaohangnhanh';
import { getUserId } from '@/utils/utils.js';
import ExcelExportButton from '@/components/common/ExcelExportButton.vue';

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
// Thêm ref lưu địa chỉ hiện tại để tính phí ship sau này
const currentAddress = ref(null);
const selectedOrder = ref(null);
const orderCalculation = ref(null);
const isCalculating = ref(false);

// Status dropdown states
const openDropdowns = ref([]);  // Track which dropdowns are open

// Modal states
let addOrderModal = null;
let orderDetailModal = null;

// Address modal states
const isSavingAddress = ref(false);
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

// Address form
const addressForm = ref({
  recipientName: '',
  phoneNumber: '',
  addressDetail: '',
  provinceName: '',
  provinceId: '',
  districtName: '',
  districtId: '',
  wardName: '',
  wardCode: '',
  isDefault: false,
  addressType: 'HOME'
});

// Product search states
const productSearchTerm = ref('');
const productSearchResults = ref([]);
const showProductSearchResults = ref(false);
let productSearchTimeout = null;

// Customer search states
const customerSearchTerm = ref('');
const customerSearchResults = ref([]);
const showCustomerDropdown = ref(false);
const isSearchingCustomers = ref(false);
let customerSearchTimeout = null;

// New order form data
const newOrder = ref({
  id: '',
  userId: '',
  staffId: '',
  addressId: '',
  shippingFee: 0, // Không set mặc định, tính theo API
  orderType: window.location.pathname.includes('pos') ? 'COUNTER' : 'ONLINE',
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
  const basicValidation = newOrder.value.userId && 
         newOrder.value.addressId && 
         newOrder.value.items.length > 0 &&
         newOrder.value.items.every(detail => detail.bookId && detail.quantity > 0) &&
         !isCalculating.value;
         
  // ✅ KIỂM TRA THÊM GIỚI HẠN 100 TRIỆU THEO GIÁ TRỊ SẢN PHẨM (SUBTOTAL)
  if (!basicValidation) return false;
  
  const ORDER_VALUE_LIMIT = 100000000; // 100 triệu
  const currentSubtotal = orderCalculation.value ? orderCalculation.value.subtotal : 0;
  
  return currentSubtotal <= ORDER_VALUE_LIMIT;
});

// ✅ COMPUTED CHO BUTTON TEXT VÀ TOOLTIP
const getSubmitButtonText = computed(() => {
  const ORDER_VALUE_LIMIT = 100000000; // 100 triệu
  const currentSubtotal = orderCalculation.value ? orderCalculation.value.subtotal : 0;
  
  if (currentSubtotal > ORDER_VALUE_LIMIT) {
    return 'Vượt giới hạn đặt hàng online';
  }
  return 'Tạo đơn hàng';
});

const getSubmitButtonTooltip = computed(() => {
  if (!newOrder.value.userId) return 'Vui lòng chọn khách hàng';
  if (!newOrder.value.addressId) return 'Vui lòng chọn địa chỉ giao hàng';
  if (newOrder.value.items.length === 0) return 'Vui lòng thêm sản phẩm vào đơn hàng';
  if (!newOrder.value.items.every(detail => detail.bookId && detail.quantity > 0)) {
    return 'Vui lòng điền đầy đủ thông tin sản phẩm';
  }
  if (isCalculating.value) return 'Đang tính toán đơn hàng...';
  
  const ORDER_VALUE_LIMIT = 100000000; // 100 triệu
  const currentSubtotal = orderCalculation.value ? orderCalculation.value.subtotal : 0;
  
  if (currentSubtotal > ORDER_VALUE_LIMIT) {
    return `Chính sách cửa hàng: Giá trị sản phẩm không được vượt ${formatCurrency(ORDER_VALUE_LIMIT)}`;
  }
  
  return 'Click để tạo đơn hàng';
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
  
  // Add click outside handlers
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  // Remove click outside handlers
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('click', closeDropdowns);
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
    
    // Lọc bỏ trạng thái 'REFUND_REQUESTED' khỏi danh sách trạng thái
  orderStatuses.value = (statusesResponse.data || []).filter(status => status.value !== 'REFUND_REQUESTED');
  // Bỏ loại 'COUNTER' khỏi danh sách loại đơn hàng khi tạo đơn mới
  orderTypes.value = (typesResponse.data || []).filter(type => type.value !== 'COUNTER');
    
    // Process users từ API /api/users/dropdown (trả về array trực tiếp)
    if (usersResponse.data && Array.isArray(usersResponse.data.data)) {
      users.value = usersResponse.data.data.map(user => ({
        id: user.id,
        name: user.name
      }));
    } else {
      console.warn('Unexpected users API response:', usersResponse);
      users.value = [];
    }
    
    // Process books từ API /api/books (có pagination)
    if (booksResponse.data && booksResponse.data.content) {
      books.value = booksResponse.data.content.map(book => ({
        id: book.id,
        title: book.title || book.name || book.bookName,
        normalPrice: book.normalPrice || book.price || 0,
        flashSalePrice: book.flashSalePrice || null,
        isFlashSale: book.isFlashSale || false
      }));
    } else if (booksResponse.data && Array.isArray(booksResponse.data)) {
      books.value = booksResponse.data.map(book => ({
        id: book.id,
        title: book.title || book.name || book.bookName,
        normalPrice: book.normalPrice || book.price || 0,
        flashSalePrice: book.flashSalePrice || null,
        isFlashSale: book.isFlashSale || false
      }));
    } else {
      console.warn('Unexpected books API response:', booksResponse);
      books.value = [];
    }
    
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu dropdown:', error);
    showToast('error', 'Lỗi khi tải dữ liệu dropdown!');
  }
};

const loadUsersAndBooks = async () => {
  try {
    // Load users và books song song
    const [usersResponse, booksResponse] = await Promise.all([
      getUsersForOrder(),
      getBooksDropdown()
    ]);
    
    // Process users từ API /api/users/dropdown
    if (usersResponse.data && Array.isArray(usersResponse.data.data)) {
      users.value = usersResponse.data.data.map(user => ({
        id: user.id,
        name: user.name
      }));
    } else {
      console.warn('Unexpected users API response:', usersResponse);
      users.value = [];
    }
    
    // Process books từ API /api/books/dropdown với structure mới
    if (booksResponse.data && Array.isArray(booksResponse.data)) {
      books.value = booksResponse.data.map(book => ({
        id: book.id,
        title: book.name || book.title,
        normalPrice: book.normalPrice || 0,
        flashSalePrice: book.flashSalePrice || null,
        isFlashSale: book.isFlashSale || false
      }));
    } else {
      console.warn('Unexpected books API response:', booksResponse);
      books.value = [];
    }
    
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
    
    
    const response = await getOrders(params);
    
    if (response && response.data) {
      orders.value = response.data.content || [];
      currentPage.value = response.data.pageNumber || 0;
      totalPages.value = response.data.totalPages || 0;
      totalElements.value = response.data.totalElements || 0;
      isLastPage.value = response.data.last || false;
      
      // ✅ Không cần load available transitions riêng nữa - đã có trong OrderResponse
    }
    
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    
    orders.value = [];
    currentPage.value = 0;
    totalPages.value = 0;
    totalElements.value = 0;
    isLastPage.value = true;
    
    showToast('error', 'Không thể tải danh sách đơn hàng. Vui lòng thử lại!');
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

// Toggle filter visibility
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const openAddModal = async () => {
  resetForm();
  
  // Load fresh data for the modal
  await loadUsersAndBooks();
  
  // Set loại đơn hàng dựa trên context hiện tại
  const isInPOSMode = window.location.pathname.includes('pos') || 
                      window.location.hash.includes('pos') ||
                      document.title.includes('POS') ||
                      document.querySelector('.pos-indicator') // nếu có indicator element
  
  newOrder.value.orderType = isInPOSMode ? 'COUNTER' : 'ONLINE'
  
  
  addOrderModal.show();
};



const resetForm = () => {
  // Xác định loại đơn hàng mặc định theo context
  const defaultOrderType = window.location.pathname.includes('pos') ? 'COUNTER' : 'ONLINE'
  
  newOrder.value = {
    id: '',
    userId: '',
    staffId: '',
    addressId: '',
    shippingFee: 0,
    orderType: defaultOrderType,
    orderStatus: 'PENDING',
    notes: '',
    voucherIds: [],
    items: []
  };
  userAddresses.value = [];
  userVouchers.value = [];
  orderCalculation.value = null;
  currentAddress.value = null;
  isCalculating.value = false;
  
  // Reset customer search
  clearCustomerSearch();
};

const onUserChange = async () => {
  if (newOrder.value.userId) {
    await loadUserAddresses(newOrder.value.userId);
    await loadUserVouchers(newOrder.value.userId);
    
    // ❌ Không cần gọi calculateOrderPreview() ở đây vì watch đã handle
    // calculateOrderPreview();
  } else {
    userAddresses.value = [];
    userVouchers.value = [];
    orderCalculation.value = null;
  }
  newOrder.value.addressId = '';
  newOrder.value.voucherIds = [];
};

const onOrderTypeChange = () => {
  
  // Hiển thị thông báo cho user
  const typeText = newOrder.value.orderType === 'COUNTER' ? 'tại quầy' : 'online'
  showToast('info', 'Đã chuyển sang đơn ' + typeText)
  
  // ❌ Không cần gọi calculateOrderPreview() ở đây vì watch đã handle
  // if (newOrder.value.items.length > 0) {
  //   calculateOrderPreview()
  // }
};

const loadUserAddresses = async (userId) => {
  try {
    const response = await getUserAddressesDropdown(userId);
    
    // Directly use the addresses from API without transformation
    userAddresses.value = response || [];
    
    // Auto-select default address
    const defaultAddress = userAddresses.value.find(addr => addr.isDefault);
    if (defaultAddress && !newOrder.value.addressId) {
      newOrder.value.addressId = defaultAddress.id;
      currentAddress.value = defaultAddress;
    }
  } catch (error) {
    console.error('Error loading user addresses:', error);
    userAddresses.value = [];
    showToast('error', 'Lỗi khi tải địa chỉ người dùng');
  }
};

const onAddressChange = () => {
  currentAddress.value = userAddresses.value.find(addr => addr.id == newOrder.value.addressId) || null;
  calculateShippingFee();
  // ✅ MANUAL TRIGGER thay vì watch
  if (newOrder.value.userId && newOrder.value.items.length > 0) {
    calculateOrderPreview();
  }
};

const loadUserVouchers = async (userId) => {
  try {
    const response = await getUserAvailableVouchers(userId);
    userVouchers.value = response.data || [];
  } catch (error) {
    console.error('Lỗi khi lấy vouchers user:', error);
    userVouchers.value = [];
    showToast('error', 'Không thể tải danh sách voucher!');
  }
};

const addProductRow = () => {
  newOrder.value.items.push({
    bookId: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    isFlashSale: false,
    frontendPrice: 0,
    frontendFlashSalePrice: null
  });
};

const removeProductRow = (index) => {
  newOrder.value.items.splice(index, 1);
};

const onBookChange = async (detail, index) => {
  const selectedBook = books.value.find(book => book.id == detail.bookId);
  if (!selectedBook) {
    detail.unitPrice = 0;
    detail.isFlashSale = false;
    showToast('error', 'Sản phẩm không tồn tại hoặc đã hết hàng!');
    return;
  }
  
  // Sử dụng API dropdown mới: ưu tiên flashSalePrice nếu có flash sale
  const currentPrice = selectedBook.isFlashSale && selectedBook.flashSalePrice ? 
                      selectedBook.flashSalePrice : selectedBook.normalPrice;
  
  detail.unitPrice = currentPrice;
  detail.isFlashSale = selectedBook.isFlashSale || false;
  detail.frontendPrice = selectedBook.normalPrice;
  detail.frontendFlashSalePrice = selectedBook.flashSalePrice;
  
  
  calculateShippingFee();
  await calculateDetailTotal(detail);
};

// Watch for voucher changes to recalculate
const onVoucherChange = (event) => {
  
  // Ensure voucherIds is always an array
  if (!Array.isArray(newOrder.value.voucherIds)) {
    newOrder.value.voucherIds = [];
  }
  
  // ✅ MANUAL TRIGGER thay vì watch
  if (newOrder.value.userId && newOrder.value.items.length > 0) {
    // Add a small delay to ensure Vue has updated the model
    nextTick(() => {
      calculateOrderPreview();
    });
  }
};

// Toggle voucher selection
const toggleVoucher = (voucher) => {
  if (!canSelectVoucher(voucher) && !newOrder.value.voucherIds.includes(voucher.id)) {
    // Show toast why voucher can't be selected
    if (getCurrentSubtotal() < voucher.minOrderValue) {
      showToast('warning', `Cần đơn hàng tối thiểu ${formatCurrency(voucher.minOrderValue)}`);
    } else {
      showToast('warning', 'Không thể chọn thêm voucher cùng loại');
    }
    return;
  }

  if (newOrder.value.voucherIds.length >= 2 && !newOrder.value.voucherIds.includes(voucher.id)) {
    showToast('warning', 'Chỉ được chọn tối đa 2 voucher');
    return;
  }

  const index = newOrder.value.voucherIds.indexOf(voucher.id);
  if (index > -1) {
    // Remove voucher
    newOrder.value.voucherIds.splice(index, 1);
  } else {
    // Add voucher
    newOrder.value.voucherIds.push(voucher.id);
  }

  // Trigger recalculation
  onVoucherChange();
};

// Watch for shipping fee changes
const onShippingFeeChange = () => {
  // ✅ MANUAL TRIGGER thay vì watch
  if (newOrder.value.userId && newOrder.value.items.length > 0) {
    calculateOrderPreview();
  }
};

const calculateDetailTotal = async (detail) => {
  detail.totalPrice = (detail.quantity || 0) * (detail.unitPrice || 0);
  
  // Validate quantity khi có đủ thông tin
  if (detail.bookId && detail.quantity > 0) {
    try {
      const validateResponse = await validateQuantity(detail.bookId, detail.quantity);
      if (validateResponse.data && !validateResponse.data.valid) {
        showToast('error', validateResponse.data.message || 'Số lượng không hợp lệ');
        return; // Dừng lại nếu validate thất bại
      }
    } catch (error) {
      console.error('Lỗi khi validate quantity:', error);
      showToast('error', 'Lỗi khi kiểm tra số lượng sản phẩm');
      return;
    }
  }
  
  // Trigger order calculation if we have enough data
  // ✅ BÂY GIỜ SỬ DỤNG MANUAL TRIGGER
  if (newOrder.value.userId && newOrder.value.items.length > 0) {
    calculateShippingFee();
    calculateOrderPreview();
  }
};

// Wrapper function cho template
const onQuantityChange = async (detail) => {
  await calculateDetailTotal(detail);
};

// Tính toán đơn hàng tự động khi có thay đổi với DEBOUNCE
let calculateOrderTimeout = null;
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

  // ✅ DEBOUNCE để tránh gọi API liên tục
  if (calculateOrderTimeout) {
    clearTimeout(calculateOrderTimeout);
  }

  calculateOrderTimeout = setTimeout(async () => {
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


    const response = await calculateOrder(calculationData);
    
    if (response && response.data) {
      orderCalculation.value = response.data;
      
      // ❌ KHÔNG CẬP NHẬT LẠI ITEMS ĐỂ TRÁNH VÒNG LẶP VÔ HẠN
      // if (orderCalculation.value.itemDetails) {
      //   orderCalculation.value.itemDetails.forEach(item => {
      //     const detail = newOrder.value.items.find(d => d.bookId == item.bookId);
      //     if (detail) {
      //       detail.unitPrice = item.unitPrice;
      //       detail.totalPrice = item.itemTotal;
      //       detail.isFlashSale = item.isFlashSale;
      //       detail.savedAmount = item.savedAmount;
      //       detail.flashSaleName = item.flashSaleName;
      //     }
      //   });
      // }
    }
  } catch (error) {
    console.error('Lỗi khi tính toán đơn hàng:', error);
    orderCalculation.value = null;
  } finally {
    isCalculating.value = false;
  }
  }, 500); //  Debounce 500ms
};

const calculateShippingFee = async () => {
  if (!currentAddress.value) {
    newOrder.value.shippingFee = 0;
    return;
  }
  
  const selectedAddress = currentAddress.value;
  const orderItems = newOrder.value.items;
  // Mỗi quyển sách tính 200g, tổng cân nặng = tổng số lượng * 200
  const totalBooks = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalWeight = totalBooks * 200;

  if (!selectedAddress || totalWeight <= 0) {
    newOrder.value.shippingFee = 0;
    return;
  }

  try {
    const res = await ghn.calculateFee.calculateShippingFee({
      service_type_id: 2,
      to_ward_code: selectedAddress.wardCode,
      to_district_id: selectedAddress.districtId,
      weight: totalWeight
    });
    newOrder.value.shippingFee = res.total || 0;
  } catch (error) {
    console.error('Lỗi khi tính phí ship:', error);
    newOrder.value.shippingFee = 0;
  }
};


const handleSubmitOrder = async () => {
  if (!canSubmitOrder.value) {
    showToast('warning', 'Vui lòng điền đầy đủ thông tin đơn hàng!');
    return;
  }

  // ✅ KIỂM TRA GIỚI HẠN 100 TRIỆU THEO GIÁ TRỊ SẢN PHẨM (SUBTOTAL)
  const ORDER_VALUE_LIMIT = 100000000; // 100 triệu
  const currentSubtotal = orderCalculation.value ? orderCalculation.value.subtotal : 0;
  
  if (currentSubtotal > ORDER_VALUE_LIMIT) {
    showToast('error', 'Không thể đặt hàng online! Giá trị sản phẩm vượt quá 100 triệu VNĐ theo chính sách cửa hàng.');
    return;
  }

  // Validate all prices in the order using the new API
  // Chỉ gửi mảng [{bookId, frontendPrice}] cho validatePrices
  const pricePayload = newOrder.value.items.map(item => ({
    bookId: item.bookId,
    frontendPrice: item.unitPrice
  }));
  const isValid = await validateAllPrices();
  if (!isValid) return;

  try {
    // CHUẨN BỊ DỮ LIỆU ĐÚNG CHO TẠO ĐƠN HÀNG
    const orderData = {
      userId: newOrder.value.userId,
      staffId: getUserId(),
      addressId: newOrder.value.addressId,
      shippingFee: newOrder.value.shippingFee,
      orderType: newOrder.value.orderType,
      voucherIds: newOrder.value.voucherIds,
      notes: newOrder.value.notes,
      orderDetails: newOrder.value.items.map(item => ({
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        frontendPrice: item.unitPrice
      }))
    };


    let response;
    response = await createOrder(orderData);
    showToast('success', `Tạo đơn hàng thành công! Mã đơn: ${response.data?.orderCode || ''}`);


    addOrderModal.hide();
    resetForm();
    await fetchOrders();

  } catch (error) {
    console.error('Lỗi khi submit đơn hàng:', error);
    
    let errorMessage = 'Lỗi khi xử lý đơn hàng!';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
      
      // XỬ LÝ RIÊNG LỖI PRICE VALIDATION
      if (error.response.status === 400 && errorMessage.includes('thay đổi')) {
        Swal.fire({
          icon: 'warning',
          title: 'Giá sản phẩm đã thay đổi!',
          html: `<div style="text-align: left; white-space: pre-line;">${errorMessage}</div>`,
          confirmButtonText: 'Cập nhật giá mới',
          showCancelButton: true,
          cancelButtonText: 'Đóng'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await loadUsersAndBooks();
            newOrder.value.items.forEach((detail, idx) => {
              const selectedBook = books.value.find(book => book.id == detail.bookId);
              if (selectedBook) {
                const currentPrice = selectedBook.isFlashSale && selectedBook.flashSalePrice ? selectedBook.flashSalePrice : selectedBook.price;
                detail.unitPrice = currentPrice;
                detail.isFlashSale = selectedBook.isFlashSale || false;
                detail.frontendPrice = currentPrice;
              }
            });
            calculateOrderPreview();
          }
        });
        return;
      }
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

// Status Dropdown Methods
const toggleStatusDropdown = (orderId) => {
  const index = openDropdowns.value.indexOf(orderId);
  if (index > -1) {
    // Close dropdown if it's already open
    openDropdowns.value.splice(index, 1);
  } else {
    // Close all other dropdowns and open this one
    openDropdowns.value = [orderId];
  }
};

// Close dropdowns when clicking outside
const closeDropdowns = (event) => {
  // If clicking inside a status dropdown container, don't close
  if (event && event.target.closest('.status-dropdown-container')) {
    return;
  }
  openDropdowns.value = [];
};

// ✅ Hàm xử lý khi thay đổi trạng thái trong dropdown 
const handleStatusChange = async (order, newStatusValue) => {
  const newStatus = typeof newStatusValue === 'string' ? newStatusValue : newStatusValue.target?.value;
  const originalStatus = order.orderStatus;
  
  // Close dropdown first
  closeDropdowns();
  
  // Nếu không thay đổi thì return
  if (newStatus === originalStatus) {
    return;
  }
  
  // Gọi API update status
  const success = await updateOrderStatus(order.id, newStatus, originalStatus);
  
  // Nếu thất bại, không cần reset vì đã đóng dropdown
  return success;
};

// ✅ Hàm xử lý khi click từ action dropdown
const handleStatusChangeFromAction = async (order, newStatus) => {
  const originalStatus = order.orderStatus;
  
  // Nếu không thay đổi thì return
  if (newStatus === originalStatus) {
    return;
  }
  
  // Gọi API update status - không cần reset vì không có dropdown cần reset
  await updateOrderStatus(order.id, newStatus, originalStatus);
};

const updateOrderStatus = async (orderId, newStatus, originalStatusParam = null) => {
  const orderIndex = orders.value.findIndex(order => order.id === orderId);
  const currentOriginalStatus = originalStatusParam || (orderIndex !== -1 ? orders.value[orderIndex].orderStatus : null);
  
  try {
    // Lấy thông tin admin hiện tại
    const currentStaffId = getUserId();
    if (!currentStaffId) {
      Swal.fire('Lỗi', 'Không thể xác định thông tin admin', 'error');
      return false;
    }

    // Fetch trạng thái đơn hàng mới nhất từ backend
    const orderDetailRes = await getOrderById(orderId);
    const currentOrder = orderDetailRes?.data;
    if (!currentOrder) {
      Swal.fire('Lỗi', 'Không tìm thấy đơn hàng', 'error');
      return false;
    }

    // Xác nhận trước khi chuyển trạng thái
    const result = await Swal.fire({
      title: 'Xác nhận chuyển trạng thái',
      html: `
        <div class="text-start">
          <p>Chuyển từ <strong>"${formatOrderStatus(currentOrder.orderStatusDisplay)}"</strong> thành <strong>"${formatOrderStatus(newStatus)}"</strong>?</p>
          <div class="alert alert-info mt-3 small">
            <strong>Lưu ý:</strong> Hệ thống sẽ tự động cập nhật điểm, kho hàng và voucher.
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy'
    });

    if (!result.isConfirmed) {
      return false;
    }

    // Chuẩn bị dữ liệu transition theo tài liệu
    const transitionData = {
      orderId: orderId,
      currentStatus: currentOrder.orderStatus,
      newStatus: newStatus,
      performedBy: currentStaffId, // id admin thực hiện
      staffId: currentStaffId
    };

    // Thiết lập reason và notes dựa trên trạng thái đích
    if (newStatus === 'GOODS_RETURNED_TO_WAREHOUSE') {
      transitionData.reason = 'Hàng đã về kho';
      transitionData.notes = 'Đã kiểm tra chất lượng hàng hóa';
    } else {
      transitionData.reason = `Chuyển trạng thái từ ${formatOrderStatus(currentOrder.orderStatus)} thành ${formatOrderStatus(newStatus)}`;
      transitionData.notes = `Thực hiện bởi admin ID: ${currentStaffId}`;
    }

    // Thêm tracking number nếu chuyển sang SHIPPED
    // Không cần nhập mã vận đơn khi chuyển trạng thái SHIPPED


    // Gọi API chuyển trạng thái mới theo tài liệu
    const response = await updateOrderStatusTransition(orderId, transitionData);
    

    // Hiển thị thông báo thành công với business impact
    let successMessage = `Đã chuyển trạng thái thành công!`;
    if (response.data?.businessImpact) {
      const impact = response.data.businessImpact;
      if (impact.pointImpact?.pointsAwarded > 0) {
        successMessage += ` | +${impact.pointImpact.pointsAwarded} điểm`;
      }
      if (impact.pointImpact?.pointsDeducted > 0) {
        successMessage += ` | -${impact.pointImpact.pointsDeducted} điểm`;
      }
      if (impact.stockImpact?.itemsRestored?.length > 0) {
        successMessage += ` | Đã hoàn kho: ${impact.stockImpact.itemsRestored.length} SP`;
      }
      if (impact.voucherImpact?.vouchersRestored?.length > 0) {
        successMessage += ` | Đã hoàn voucher: ${impact.voucherImpact.vouchersRestored.length}`;
      }
    }
    // Hiển thị toast nhỏ góc phải, tự động tắt sau 2 giây
    showToast('success', successMessage);

    //  Chỉ update UI khi API thành công
    if (orderIndex !== -1) {
      orders.value[orderIndex].orderStatus = newStatus;
      //  Refresh lại đơn hàng để lấy availableTransitions mới từ backend
      await refreshOrderAfterStatusChange(orderId);
    }

    // Không cần refresh toàn bộ danh sách vì đã update UI trực tiếp
    // await fetchOrders();
    
    return true; // ✅ Return success
    
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    
    const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng';
    
    await Swal.fire({
      title: 'Lỗi!',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Đóng',
      timer: 3000,
      timerProgressBar: true
    });
    
    return false; // ✅ Return failure
  }
};

const cancelOrder = async (order) => {
  try {
    const { value: reason } = await Swal.fire({
      title: 'Hủy đơn hàng',
      html: `
        <div class="text-start">
          <p><strong>Mã đơn hàng:</strong> ${order.code}</p>
          <p><strong>Khách hàng:</strong> ${order.customerName}</p>
          <div class="alert alert-warning mt-3">
            <strong><i class="bi bi-exclamation-triangle"></i> Lưu ý quan trọng:</strong>
            <ul class="mb-0 mt-2">
              <li>Hủy đơn hàng sẽ hoàn lại số lượng sách vào kho</li>
              <li><strong>KHÔNG hoàn lại voucher đã sử dụng</strong></li>
              <li>Chỉ hoàn trả hàng mới được hoàn voucher</li>
              <li>Thao tác này không thể hoàn tác</li>
            </ul>
          </div>
          <div class="mt-3">
            <label class="form-label"><strong>Lý do hủy đơn hàng:</strong></label>
            <textarea id="cancelReason" class="form-control" placeholder="Nhập lý do hủy đơn hàng..." rows="3"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Xác nhận hủy',
      cancelButtonText: 'Không hủy',
      preConfirm: () => {
        const reason = document.getElementById('cancelReason').value;
        if (!reason.trim()) {
          Swal.showValidationMessage('Vui lòng nhập lý do hủy đơn hàng!');
          return false;
        }
        return reason.trim();
      }
    });
    
    if (reason) {
      await cancelOrderAPI(order.id, reason, order.userId);
      
      await Swal.fire({
        title: 'Đã hủy đơn hàng!',
        html: `
          <div class="text-start">
            <p>Đơn hàng <strong>${order.code}</strong> đã được hủy thành công</p>
            <div class="alert alert-success mt-3 small">
              <strong>Đã thực hiện:</strong>
              <ul class="mb-0 mt-2">
                <li>✅ Hoàn lại số lượng sách vào kho</li>
                <li>❌ Không hoàn voucher (theo chính sách)</li>
              </ul>
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Đóng'
      });
      
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

//  HÀM LẤY AVAILABLE TRANSITIONS TỪ ORDERRESPONSE 
const getAvailableStatusTransitionsForOrder = (order) => {
  // Lấy trực tiếp từ OrderResponse (theo tài liệu mới)
  let transitions = [];
  if (order.availableTransitions && Array.isArray(order.availableTransitions)) {
    transitions = order.availableTransitions;
  }
  return transitions;
};

//  COMPATIBILITY: Giữ tên hàm cũ để không break template
const getAvailableStatusTransitions = (currentStatus, order = null) => {
  if (order) {
    return getAvailableStatusTransitionsForOrder(order);
  }
  return [];
};

//  HÀM REFRESH ORDER SAU KHI CHUYỂN TRẠNG THÁI
const refreshOrderAfterStatusChange = async (orderId) => {
  try {
    // Lấy order mới từ backend (bao gồm availableTransitions mới)
    const response = await getOrderById(orderId);
    if (response?.data) {
      const orderIndex = orders.value.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        // Cập nhật order với data mới (bao gồm availableTransitions)
        orders.value[orderIndex] = response.data;
      }
    }
  } catch (error) {
    console.warn(`Không thể refresh order ${orderId}:`, error);
  }
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

const handleGoToPage = (pageNumber) => {
  currentPage.value = pageNumber;
  fetchOrders();
};

// Utility methods
// Đã thay thế getCurrentStaffId bằng getUserId từ utils.js

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

// Tính toán số tiền giảm giá thực tế cho từng voucher
const calculateIndividualVoucherDiscount = (voucher, order) => {
  try {
    const subtotal = order.subtotal || calculateOrderSubtotal(order);
    const shippingFee = order.shippingFee || 0;

    if (voucher.voucherCategory === 'SHIPPING') {
      // Voucher miễn phí vận chuyển
      if (voucher.discountType === 'FIXED_AMOUNT') {
        // Sử dụng discountAmount từ API hoặc tính toán
        const voucherValue = voucher.discountAmount || voucher.maxDiscountValue || 0;
        return Math.min(voucherValue, shippingFee);
      } else if (voucher.discountType === 'PERCENTAGE') {
        const percentage = voucher.discountPercentage || 0;
        const discountAmount = (shippingFee * percentage) / 100;
        return Math.min(discountAmount, voucher.maxDiscountValue || shippingFee);
      }
      
      // Fallback: sử dụng từ order
      return order.discountShipping || order.shippingVoucherDiscount || 0;
    } else {
      // Voucher giảm giá sản phẩm (NORMAL, FLASHSALE, etc.)
      if (voucher.discountType === 'FIXED_AMOUNT') {
        const voucherValue = voucher.discountAmount || voucher.maxDiscountValue || 0;
        return Math.min(voucherValue, subtotal);
      } else if (voucher.discountType === 'PERCENTAGE') {
        const percentage = voucher.discountPercentage || 0;
        const discountAmount = (subtotal * percentage) / 100;
        return Math.min(discountAmount, voucher.maxDiscountValue || subtotal);
      }
      
      // Fallback: nếu chỉ có 1 voucher product thì lấy toàn bộ discount
      const productVouchers = order.vouchers?.filter(v => v.voucherCategory !== 'SHIPPING') || [];
      if (productVouchers.length === 1) {
        return order.voucherDiscountAmount || order.discountAmount || 0;
      } else if (productVouchers.length > 1) {
        // Phân chia đều discount cho các voucher product
        return (order.voucherDiscountAmount || order.discountAmount || 0) / productVouchers.length;
      }
    }
    
    return 0;
  } catch (error) {
    console.warn('Error calculating voucher discount:', error, voucher);
    return 0;
  }
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
    
    'ONLINE': 'Đơn online'
   
  };
  return typeMap[type] || type;
};

// Add this method to handle 'Cập nhật giá mới' (Update Prices) action
const reloadBookPricesFromDropdown = async () => {
  // Reload books dropdown
  await loadUsersAndBooks();
  // For each item in the order, update price from dropdown
  newOrder.value.items.forEach(detail => {
    const selectedBook = books.value.find(book => book.id == detail.bookId);
    if (selectedBook) {
      detail.unitPrice = selectedBook.isFlashSale && selectedBook.flashSalePrice ? selectedBook.flashSalePrice : selectedBook.normalPrice;
      detail.isFlashSale = selectedBook.isFlashSale || false;
      detail.frontendPrice = selectedBook.normalPrice;
      detail.frontendFlashSalePrice = selectedBook.flashSalePrice;
      detail.totalPrice = (detail.quantity || 0) * (detail.unitPrice || 0);
    }
  });
  // Optionally, recalculate order preview
  calculateOrderPreview();
};

// Validate all prices in the order using the new API
const validateAllPrices = async () => {
  // Build array from current items: [{bookId, frontendPrice, quantity}]
  const payload = newOrder.value.items.map(detail => ({
    bookId: detail.bookId,
    frontendPrice: detail.unitPrice,
    quantity: detail.quantity
  }));
  try {
    const response = await validatePrices({ userId: newOrder.value.userId, payload });
    // Nếu API trả về data là "valid" (string) hoặc response.data.valid === true thì hợp lệ
    if (
      response &&
      response.data &&
      (response.data === "valid" || response.data.valid === true)
    ) {
      return true;
    }
    // Nếu không hợp lệ, hiển thị thông báo lỗi giá
    Swal.fire({
      icon: 'error',
      title: 'Lỗi giá sản phẩm',
      text: response.data.message || 'Có sản phẩm có giá không hợp lệ!'
    });
    return false;
  } catch (error) {
    // Nếu lỗi trả về từ backend là lỗi số lượng thì báo đúng message
    const errMsg = error?.response?.data?.message;
    if (errMsg && errMsg.toLowerCase().includes('số lượng')) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi số lượng sản phẩm',
        text: errMsg
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi xác thực giá',
        text: errMsg || 'Không thể xác thực giá sản phẩm!'
      });
    }
    return false;
  }
};

// ✅ Function kiểm tra voucher có thể chọn không (tối đa 1 shipping + 1 product)
const canSelectVoucher = (voucher) => {
  // Kiểm tra điều kiện đơn hàng tối thiểu
  const currentSubtotal = getCurrentSubtotal();
  if (currentSubtotal < voucher.minOrderValue) {
    return false;
  }

  // Kiểm tra giới hạn loại voucher
  const selectedVouchers = userVouchers.value.filter(v => newOrder.value.voucherIds.includes(v.id));
  const selectedShippingVouchers = selectedVouchers.filter(v => v.categoryVi && v.categoryVi.includes('vận chuyển'));
  const selectedProductVouchers = selectedVouchers.filter(v => v.categoryVi && v.categoryVi.includes('sản phẩm'));
  
  if (voucher.categoryVi && voucher.categoryVi.includes('vận chuyển')) {
    return selectedShippingVouchers.length === 0;
  } else {
    return selectedProductVouchers.length === 0;
  }
};

// Helper method to get current subtotal
const getCurrentSubtotal = () => {
  if (orderCalculation.value && orderCalculation.value.subtotal) {
    return orderCalculation.value.subtotal;
  }
  
  return newOrder.value.items.reduce((total, item) => {
    return total + ((item.quantity || 0) * (item.unitPrice || 0));
  }, 0);
};

// Helper method to get voucher type conflict message
const getVoucherTypeConflict = (voucher) => {
  const selectedVouchers = userVouchers.value.filter(v => newOrder.value.voucherIds.includes(v.id));
  const selectedShippingVouchers = selectedVouchers.filter(v => v.categoryVi && v.categoryVi.includes('vận chuyển'));
  const selectedProductVouchers = selectedVouchers.filter(v => v.categoryVi && v.categoryVi.includes('sản phẩm'));
  
  if (voucher.categoryVi && voucher.categoryVi.includes('vận chuyển')) {
    if (selectedShippingVouchers.length > 0) {
      return 'voucher vận chuyển khác';
    }
  } else {
    if (selectedProductVouchers.length > 0) {
      return 'voucher sản phẩm khác';
    }
  }
  return null;
};

// ✅ Clear product search
const clearProductSearch = () => {
  productSearchTerm.value = '';
  productSearchResults.value = [];
  showProductSearchResults.value = false;
};

// ✅ Book search functions
const onProductInputFocus = async () => {
  showProductSearchResults.value = true;
  
  // Gọi API ngay khi focus để load danh sách sản phẩm mặc định
  if (productSearchResults.value.length === 0) {
    try {
      
      // Gọi API với search rỗng để lấy danh sách mặc định
      const response = await getBooksDropdown({ search: '' });
      
      productSearchResults.value = response.data || [];
      showProductSearchResults.value = productSearchResults.value.length > 0;
      
      
    } catch (error) {
      console.error('Error loading initial product list:', error);
      productSearchResults.value = [];
      showProductSearchResults.value = false;
      showToast('error', 'Lỗi khi tải danh sách sản phẩm');
    }
  }
};

const onProductInputBlur = () => {
  // Delay hide để có thể click vào item trong dropdown
  setTimeout(() => {
    showProductSearchResults.value = false;
  }, 150);
};

const onProductSearch = async () => {
  // Clear previous timeout
  if (productSearchTimeout) {
    clearTimeout(productSearchTimeout);
  }
  
  // Set new timeout for debounced search
  productSearchTimeout = setTimeout(async () => {
    const searchTerm = productSearchTerm.value.trim();
    
    if (!searchTerm) {
      productSearchResults.value = [];
      showProductSearchResults.value = false;
      return;
    }
    
    try {
      let response;
      if (searchTerm) {
        // Search with term
        response = await getBooksDropdown({ search: searchTerm });
      } else {
        // Don't load all books when empty
        productSearchResults.value = [];
        showProductSearchResults.value = false;
        return;
      }
      
      productSearchResults.value = response.data || [];
      showProductSearchResults.value = productSearchResults.value.length > 0;
    } catch (error) {
      console.error('Product search error:', error);
      productSearchResults.value = [];
      showProductSearchResults.value = false;
    }
  }, 300);
};

// Click outside to close dropdown
const handleClickOutside = (event) => {
  const searchContainer = event.target.closest('.position-relative');
  if (!searchContainer) {
    showProductSearchResults.value = false;
    showCustomerDropdown.value = false;
  }
};

const addBookToOrder = (book) => {
  // Check if book already exists in order
  const existingItem = newOrder.value.items.find(item => item.bookId === book.id);
  if (existingItem) {
    // Increase quantity
    existingItem.quantity += 1;
    calculateDetailTotal(existingItem);
    showToast('info', 'Đã tăng số lượng sản phẩm có sẵn');
  } else {
    // Add new item
    const newItem = {
      bookId: book.id,
      quantity: 1,
      unitPrice: book.isFlashSale && book.flashSalePrice ? book.flashSalePrice : book.normalPrice,
      totalPrice: 0,
      isFlashSale: book.isFlashSale || false,
      frontendPrice: book.normalPrice,
      frontendFlashSalePrice: book.flashSalePrice,
      bookData: book // Store book data for display
    };
    
    newOrder.value.items.push(newItem);
    calculateDetailTotal(newItem);
    showToast('success', 'Đã thêm sản phẩm vào đơn hàng');
  }
  
  // Clear search using the function
  clearProductSearch();
};

// Customer search functions
const onCustomerSearch = async () => {
  // Clear previous timeout
  if (customerSearchTimeout) {
    clearTimeout(customerSearchTimeout);
  }
  
  // Show dropdown immediately
  showCustomerDropdown.value = true;
  
  // Set new timeout for debounced search
  customerSearchTimeout = setTimeout(async () => {
    const searchTerm = customerSearchTerm.value.trim();
    
    if (searchTerm.length < 2) {
      customerSearchResults.value = [];
      isSearchingCustomers.value = false;
      return;
    }
    
    try {
      isSearchingCustomers.value = true;
      const response = await searchUsersDropdown(searchTerm);
      
      // Fix: API response format is { status, message, data: [...] }
      if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        customerSearchResults.value = response.data.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email || ''
        }));
      } else if (response && response.data && Array.isArray(response.data)) {
        customerSearchResults.value = response.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email || ''
        }));
      } else {
        customerSearchResults.value = [];
      }
      
      
    } catch (error) {
      console.error('Error searching customers:', error);
      customerSearchResults.value = [];
      showToast('error', 'Lỗi khi tìm kiếm khách hàng');
    } finally {
      isSearchingCustomers.value = false;
    }
  }, 300);
};

const onCustomerInputFocus = async () => {
  showCustomerDropdown.value = true;
  
  // Gọi API ngay khi focus để load danh sách khách hàng
  if (customerSearchResults.value.length === 0) {
    try {
      isSearchingCustomers.value = true;
      
      // Gọi API với search rỗng để lấy danh sách mặc định
      const response = await searchUsersDropdown('');
      
      // Fix: API response format is { status, message, data: [...] }
      if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        customerSearchResults.value = response.data.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email || ''
        }));
      } else if (response && response.data && Array.isArray(response.data)) {
        customerSearchResults.value = response.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email || ''
        }));
      } else {
        customerSearchResults.value = [];
      }
      
      
    } catch (error) {
      console.error('Error loading initial customer list:', error);
      customerSearchResults.value = [];
      showToast('error', 'Lỗi khi tải danh sách khách hàng');
    } finally {
      isSearchingCustomers.value = false;
    }
  }
  
  // If there's already a search term, trigger search
  if (customerSearchTerm.value.trim().length >= 2) {
    onCustomerSearch();
  }
};

const selectCustomer = (customer) => {
  
  // Update form data
  newOrder.value.userId = customer.id;
  customerSearchTerm.value = `${customer.name} - ${customer.email}`;
  
  // Hide dropdown
  showCustomerDropdown.value = false;
  
  // Trigger user change to load addresses and vouchers
  onUserChange();
  
  showToast('success', `Đã chọn khách hàng: ${customer.name}`);
};

const onCustomerInputBlur = () => {
  // Delay hide để có thể click vào item trong dropdown
  setTimeout(() => {
    showCustomerDropdown.value = false;
  }, 150);
};

const clearCustomerSearch = () => {
  customerSearchTerm.value = '';
  customerSearchResults.value = [];
  showCustomerDropdown.value = false;
  isSearchingCustomers.value = false;
};

const getBookDisplayName = (bookId) => {
  if (!bookId) return '';
  
  // Find in current items
  const item = newOrder.value.items.find(item => item.bookId === bookId);
  if (item && item.bookData) {
    return `#${item.bookData.id} - ${item.bookData.name} (${item.bookData.bookCode})`;
  }
  
  const book = books.value.find(b => b.id === bookId);
  return book ? `#${book.id} - ${book.title || book.name} (${book.bookCode || ''})` : '';
};

const onBookSearch = async (event, detail, index) => {
  // This function is no longer used with the new search approach
};

const showBookDropdown = (index) => {
  // This function is no longer used with the new search approach
};

const hideBookDropdown = (index) => {
  // This function is no longer used with the new search approach
};

const selectBook = (book, detail, index) => {
  // This function is no longer used with the new search approach
};

const getBookDisplayText = (bookId) => {
  // Use the new function
  return getBookDisplayName(bookId);
};

// ✅ Address modal functions
const openAddAddressModal = async () => {
  if (!newOrder.value.userId) {
    showToast('warning', 'Vui lòng chọn khách hàng trước!');
    return;
  }
  
  // Reset form
  resetAddressForm();
  
  // Load provinces if not loaded
  if (provinces.value.length === 0) {
    await fetchProvinces();
  }
  
  // Auto-load user info if possible
  const selectedUser = users.value.find(u => u.id == newOrder.value.userId);
  if (selectedUser && selectedUser.name) {
    addressForm.value.recipientName = selectedUser.name;
  }
  
  // Use Bootstrap Modal
  const modalElement = document.getElementById('addAddressModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeAddressModal = () => {
  const modalElement = document.getElementById('addAddressModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
  resetAddressForm();
};

const resetAddressForm = () => {
  addressForm.value = {
    recipientName: '',
    phoneNumber: '',
    addressDetail: '',
    provinceName: '',
    provinceId: '',
    districtName: '',
    districtId: '',
    wardName: '',
    wardCode: '',
    isDefault: false,
    addressType: 'HOME'
  };
  districts.value = [];
  wards.value = [];
};

const fetchProvinces = async () => {
  try {
    const res = await ghn.address.getProvinces();
    const excludeIds = [2002, 298, 290, 286];
    provinces.value = (res.data || res)
      .filter(p => !excludeIds.includes(p.ProvinceID))
      .sort((a, b) => a.ProvinceName.localeCompare(b.ProvinceName));
  } catch (error) {
    console.error('Error fetching provinces:', error);
    showToast('error', 'Lỗi khi tải danh sách tỉnh/thành phố!');
  }
};

const fetchDistricts = async (provinceId) => {
  if (!provinceId) {
    districts.value = [];
    return;
  }
  try {
    const res = await ghn.address.getDistricts(provinceId);
    districts.value = (res.data || res)
      .sort((a, b) => (a.DistrictName || a.ProvinceName).localeCompare(b.DistrictName || b.ProvinceName));
  } catch (error) {
    console.error('Error fetching districts:', error);
    showToast('error', 'Lỗi khi tải danh sách quận/huyện!');
  }
};

const fetchWards = async (districtId) => {
  if (!districtId) {
    wards.value = [];
    return;
  }
  try {
    const res = await ghn.address.getWards(districtId);
    wards.value = (res.data || res)
      .sort((a, b) => a.WardName.localeCompare(b.WardName));
  } catch (error) {
    console.error('Error fetching wards:', error);
    showToast('error', 'Lỗi khi tải danh sách phường/xã!');
  }
};

const onProvinceChange = () => {
  const p = provinces.value.find(p => p.ProvinceID == addressForm.value.provinceId);
  addressForm.value.provinceName = p ? p.ProvinceName : '';
  addressForm.value.districtName = '';
  addressForm.value.districtId = '';
  addressForm.value.wardName = '';
  addressForm.value.wardCode = '';
  fetchDistricts(addressForm.value.provinceId);
};

const onDistrictChange = () => {
  const d = districts.value.find(d => d.DistrictID == addressForm.value.districtId);
  addressForm.value.districtName = d ? (d.DistrictName || d.ProvinceName) : '';
  addressForm.value.wardName = '';
  addressForm.value.wardCode = '';
  fetchWards(addressForm.value.districtId);
};

const onWardChange = () => {
  const w = wards.value.find(w => w.WardCode == addressForm.value.wardCode);
  addressForm.value.wardName = w ? w.WardName : '';
};

const handleSaveAddress = async () => {
  // Validate form
  const nameRegex = /^[A-Za-zÀ-ỹà-ỹ\s]{3,100}$/u;
  const phoneRegex = /^0\d{9}$/;
  
  if (!addressForm.value.recipientName || !addressForm.value.phoneNumber || !addressForm.value.addressDetail || 
      !addressForm.value.provinceId || !addressForm.value.districtId || !addressForm.value.wardCode) {
    showToast('error', 'Vui lòng điền đầy đủ thông tin bắt buộc');
    return;
  }
  
  if (!nameRegex.test(addressForm.value.recipientName.trim())) {
    showToast('error', 'Họ tên phải từ 3-100 ký tự, không chứa ký tự đặc biệt');
    return;
  }
  
  if (!phoneRegex.test(addressForm.value.phoneNumber.trim())) {
    showToast('error', 'Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0');
    return;
  }
  
  isSavingAddress.value = true;
  try {
    
    await addAddressAtAdmin(addressForm.value, newOrder.value.userId);
    showToast('success', 'Thêm địa chỉ thành công!');
    
    // Reload user addresses
    await loadUserAddresses(newOrder.value.userId);
    
    closeAddressModal();
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Lưu địa chỉ thất bại';
    showToast('error', errorMsg);
    console.error('Save address error:', error);
  }
};

// ✅ KHÔI PHỤC WATCH - ĐÃ FIX INFINITE LOOP
// Watch for changes to trigger order calculation
watch([
  () => newOrder.value.userId,
  () => newOrder.value.shippingFee,
  () => newOrder.value.voucherIds,
  () => newOrder.value.items?.length, // CHỈ WATCH LENGTH THAY VÌ DEEP WATCH
], () => {
  if (newOrder.value.userId && newOrder.value.items.length > 0) {
    calculateOrderPreview();
  }
}, { immediate: false }); // REMOVE DEEP WATCH

// Watch for address form changes
watch(() => addressForm.value.provinceId, (newVal) => {
  addressForm.value.districtName = '';
  addressForm.value.districtId = '';
  addressForm.value.wardName = '';
  addressForm.value.wardCode = '';
  fetchDistricts(newVal);
});

watch(() => addressForm.value.districtId, (newVal) => {
  addressForm.value.wardName = '';
  addressForm.value.wardCode = '';
  fetchWards(newVal);
});

// Watch for page changes
watch([currentPage, pageSize], () => {
  fetchOrders();
});

</script>

<style scoped>
@import "@/assets/css/admin-table-responsive.css";
@import '@/assets/css/admin-global.css';

/* Status Dropdown Styles */
.status-dropdown-container {
  position: relative;
}

.status-dropdown-container .btn {
  border: 1px solid rgba(0,0,0,0.125);
  background: white;
  transition: all 0.2s ease;
}

.status-dropdown-container .btn:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}

.status-dropdown-container .bi-chevron-down {
  font-size: 0.8em;
  transition: transform 0.2s ease;
}

.status-dropdown-container .bi-chevron-down.rotate-180 {
  transform: rotate(180deg);
}

.status-dropdown-container .dropdown-menu {
  border: 1px solid rgba(0,0,0,0.125);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  padding: 0px 0;
  min-width: 180px;
}

.status-dropdown-container .dropdown-header {
  padding: 8px 16px;
  margin: 0;
  font-size: 0.75em;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.status-dropdown-container .dropdown-item {
  border: none;
  border-radius: 6px;
  margin: 2px 2px 0px 0px;
  font-size: 0.85em;
  padding: 10px 2px;
  transition: all 0.2s ease;
  background: rgb(255, 255, 255);
}

.status-dropdown-container .dropdown-item:hover {
  background: rgba(0,123,255,0.1);
  transform: translateX(2px);
}

.status-dropdown-container .dropdown-item i {
  font-size: 0.9em;
  opacity: 0.7;
}

.status-dropdown-container .dropdown-item-text {
  font-size: 0.8em;
  color: #6c757d;
}

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
  width:  35px;
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

.voucher-item.disabled-voucher {
  background-color: #f8f9fa;
  opacity: 0.7;
  cursor: not-allowed;
}

.voucher-item.disabled-voucher:hover {
  transform: none;
  border-color: #ffc107;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
}

.voucher-item.disabled-voucher .form-check-input {
  cursor: not-allowed;
}

.voucher-item.disabled-voucher .form-check-label {
  cursor: not-allowed;
}

.voucher-warning .alert-warning {
  font-size: 0.875rem;
  border: none;
  background-color: #fff3cd;
  color: #856404;
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

/* Book search dropdown styles */
.hover-bg-light:hover {
  background-color: #f8f9fa !important;
}

.cursor-pointer {
  cursor: pointer;
}

/* Address modal styles */
.modal-fade {
  animation: fadeIn 0.3s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Voucher card improvements */
.voucher-item.card.selected {
  border-color: #007bff !important;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Statistics Section Styles */
.statistics-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
}

/* Loading Animation for Statistics */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.statistics-section {
  animation: fadeInUp 0.6s ease-out;
}

/* Responsive Design for Statistics */
@media (max-width: 1200px) {
  .statistics-section {
    padding: 1.5rem;
  }
}

@media (max-width: 992px) {
  .statistics-section .row {
    flex-direction: column;
  }
  
  .statistics-section .col-xl-8,
  .statistics-section .col-xl-4,
  .statistics-section .col-lg-6 {
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .statistics-section {
    padding: 1rem;
    margin: 0 -15px 2rem -15px;
    border-radius: 0;
  }
}

.voucher-item.card:hover {
  border-color: #6c757d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Filter collapse animation */
.filter-collapse {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.filter-collapsed {
  max-height: 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.loading-overlay.show {
  opacity: 1;
  visibility: visible;
}

.loading-overlay .spinner-border {
  width: 3rem;
  height: 3rem;
}

.loading-overlay p {
  margin-top: 1rem;
  color: #6c757d;
  font-weight: 500;
}

.card-body.loading {
  position: relative;
}

/* Sticky filter sidebar */
.sticky-filter {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

/* Compact filter styles */
.filter-card .card-body {
  padding: 1rem;
}

.filter-card .form-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

.filter-card .form-control-sm,
.filter-card .form-select-sm {
  padding: 0.4rem 0.6rem;
  font-size: 0.875rem;
}

/* Table status column fix */
.table td select.form-select {
  min-width: 140px !important;
  font-size: 0.8rem;
  white-space: nowrap;
}

/* Table status column fix */
.table td select.form-select {
  border: none;
}

.table td select.form-select option {
  padding: 8px 12px;
  font-weight: 600;
}

/* Status option colors */
.table td select.form-select option[value="PENDING"] {
  background-color: #fff3cd !important;
  color: #856404 !important;
}

.table td select.form-select option[value="CONFIRMED"] {
  background-color: #cce5ff !important;
  color: #0066cc !important;
}

.table td select.form-select option[value="SHIPPED"] {
  background-color: #e7f3ff !important;
  color: #0056b3 !important;
}

.table td select.form-select option[value="DELIVERED"] {
  background-color: #d4edda !important;
  color: #155724 !important;
}

.table td select.form-select option[value="CANCELED"] {
  background-color: #f8d7da !important;
  color: #721c24 !important;
}

.table td select.form-select option[value="REFUNDED"] {
  background-color: #f5c2c7 !important;
  color: #842029 !important;
}

/* Force layout to stay in same row */
.row {
  display: flex;
  flex-wrap: nowrap;
  margin: 0;
}

.row > [class*="col-"] {
  flex: 0 0 auto;
  padding: 0 15px;
}

.col-lg-4 {
  width: 33.333333%;
  max-width: 33.333333%;
}

.col-lg-8 {
  width: 66.666667%;
  max-width: 66.666667%;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .row {
    flex-wrap: wrap;
  }
  
  .sticky-filter {
    position: relative;
    top: auto;
    max-height: none;
    margin-bottom: 1rem;
  }
  
  .col-lg-4,
  .col-lg-8 {
    width: 100%;
    max-width: 100%;
  }
}

/* Table responsive improvements */
.table-responsive {
  border-radius: 0.5rem;
}

.table th {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  background-color: #f8f9fa !important;
}

.table td {
  font-size: 0.875rem;
  vertical-align: middle;
}

/* Enhanced Order Detail Modal Styles */
.modal-xl {
  max-width: 1200px;
}

.order-detail-header .info-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  height: 100%;
}

.section-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 12px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
}

.order-items-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.order-item-detail {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 12px;
  border-left: 4px solid #007bff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-item-detail:last-child {
  margin-bottom: 0;
}

.item-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.item-info .item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.item-code {
  font-size: 0.875rem;
  color: #6c757d;
}

.flash-sale-badge {
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  color: white;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.price-info .original-price {
  font-size: 0.875rem;
}

.price-info .sale-price {
  font-size: 1rem;
  font-weight: 600;
}

.quantity-badge {
  background: #e9ecef;
  padding: 6px 12px;
  border-radius: 15px;
  font-weight: 600;
  color: #495057;
}

.item-total {
  font-size: 1.125rem;
  color: #dc3545;
}

.refund-info-detail {
  background: #fff3cd;
  border-radius: 6px;
  padding: 8px;
}

.refund-badge {
  background: #ffc107;
  color: #212529;
  font-size: 0.75rem;
  padding: 3px 6px;
  border-radius: 10px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 4px;
}

.refund-reason {
  font-size: 0.75rem;
  line-height: 1.3;
}

.refund-status-badge {
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
}

.badge-success { background: #28a745; color: white; }
.badge-info { background: #17a2b8; color: white; }
.badge-warning { background: #ffc107; color: #212529; }
.badge-danger { background: #dc3545; color: white; }

/* Voucher List Styles */
.voucher-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.voucher-item-detail {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border: 1px solid #2196f3;
  border-radius: 10px;
  padding: 15px;
  position: relative;
}

.voucher-item-detail::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: linear-gradient(45deg, #2196f3, #9c27b0);
  border-radius: 2px;
}

.voucher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.voucher-code {
  font-weight: bold;
  color: #1976d2;
  font-size: 1rem;
  font-family: 'Courier New', monospace;
}

.voucher-discount {
  color: #d32f2f;
  font-weight: 700;
  font-size: 1.125rem;
}

.voucher-name {
  color: #424242;
  font-weight: 600;
  margin-bottom: 4px;
}

.voucher-description {
  color: #666;
  font-style: italic;
}

/* Enhanced Summary Table */
.order-summary-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
}

.summary-table {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f1f3f4;
  font-size: 0.95rem;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.discount {
  color: #28a745;
  background: rgba(40, 167, 69, 0.05);
  margin: 5px -10px;
  padding: 10px;
  border-radius: 6px;
}

.summary-row.refund {
  color: #dc3545;
  background: rgba(220, 53, 69, 0.05);
  margin: 5px -10px;
  padding: 10px;
  border-radius: 6px;
}

.summary-row.total {
  border-top: 2px solid #007bff;
  background: rgba(0, 123, 255, 0.05);
  margin: 10px -10px 0;
  padding: 15px 10px;
  border-radius: 6px;
  font-size: 1.125rem;
  font-weight: 600;
}

.order-message .alert {
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Modal Footer Styling */
.modal-footer.bg-light {
  border-top: 2px solid #e9ecef;
}

/* Voucher Type Styling */
.voucher-type {
  margin-top: 8px;
}

.voucher-type .badge {
  font-size: 0.7rem;
  padding: 3px 6px;
}

/* Customer Search Dropdown Styling */
.dropdown-menu.show {
  display: block;
  border: 1px solid #dee2e6;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border-radius: 0.375rem;
}

.dropdown-item.cursor-pointer {
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f8f9fa;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item-text {
  padding: 0.75rem 1rem;
  color: #6c757d;
}
</style>
