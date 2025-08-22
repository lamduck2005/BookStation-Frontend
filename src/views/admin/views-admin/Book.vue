<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Quản lý sách</strong>
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
                <i class="bi bi-book me-1"></i>
                Tên sách
              </label>
              <input 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Nhập tên sách" 
                v-model="searchQuery" 
                @input="debouncedSearch"
                @keyup.enter="applyFilters"
              />
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-upc-scan me-1"></i>
                Mã sách
              </label>
              <input 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Nhập mã sách" 
                v-model="bookCodeFilter" 
                @input="debouncedSearch"
                @keyup.enter="applyFilters"
              />
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-tags me-1"></i>
                Danh mục
              </label>
              <select class="form-select form-select-sm" v-model="selectedCategory" @change="applyFilters">
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.categoryName || category.name }}
                </option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-truck me-1"></i>
                Nhà cung cấp
              </label>
              <select class="form-select form-select-sm" v-model="selectedSupplier" @change="applyFilters">
                <option value="">Tất cả nhà cung cấp</option>
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.name }}
                </option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-building me-1"></i>
                Nhà xuất bản
              </label>
              <select class="form-select form-select-sm" v-model="selectedPublisher" @change="applyFilters">
                <option value="">Tất cả nhà XB</option>
                <option v-for="publisher in publishers" :key="publisher.id" :value="publisher.id">
                  {{ publisher.name }}
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
                <option value="1">Hoạt động</option>
                <option value="0">Không hoạt động</option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-currency-dollar me-1"></i>
                Giá từ
              </label>
              <input 
                type="number" 
                class="form-control form-control-sm" 
                placeholder="Giá tối thiểu" 
                v-model="minPrice" 
                @input="debouncedSearch"
                min="0"
              />
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-currency-dollar me-1"></i>
                Giá đến
              </label>
              <input 
                type="number" 
                class="form-control form-control-sm" 
                placeholder="Giá tối đa" 
                v-model="maxPrice" 
                @input="debouncedSearch"
                min="0"
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
        <!-- Statistics Section -->
        <div class="statistics-section">
          <div class="section-header mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0 text-secondary">
                <i class="bi bi-graph-up me-2"></i>
                Thống kê sách
              </h5>
              
            </div>
          </div>
          
          <!-- Overview Cards -->
          <BookOverviewCards ref="overviewCardsRef" />
          
          <!-- Charts Section -->
          <div class="row mt-4">
            <div class="col-12">
              <div class="d-flex gap-2 mb-3 flex-wrap">
                <!-- Performance Chart Toggle -->
                <button 
                  class="btn btn-sm"
                  :class="showPerformanceChart ? 'btn-primary' : 'btn-outline-primary'"
                  @click="togglePerformanceChart"
                >
                  <i class="bi bi-graph-up-arrow me-1"></i>
                  {{ showPerformanceChart ? 'Ẩn biểu đồ' : 'Hiệu suất sách' }}
                </button>
              </div>
              
              <!-- Performance Chart -->
              <div v-show="showPerformanceChart" class="mb-4">
                <BookPerformanceChart ref="performanceChartRef" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Danh sách Book -->
        <div class="card shadow-lg border-0 mb-4 admin-table-card">
          <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
            <div>
              <h5 class="mb-0 text-secondary">
                <i class="bi bi-book me-2"></i>
                Danh sách sách ({{ totalElements }} sách)
              </h5>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-info btn-sm py-2" @click="fetchBooks" :disabled="loading">
                <i class="bi bi-arrow-repeat me-1"></i> Làm mới
              </button>
              
              <!-- Nút Export Excel -->
              <ExcelExportButton 
                data-type="books"
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
                      <th style="min-width: 100px;">Thao tác</th>
                      <th style="min-width: 120px;">Ảnh</th>
                      <th style="min-width: 200px;">ID & Tên sách</th>
                      <th style="min-width: 120px;">Mã sách & ISBN</th>
                      <th style="min-width: 150px;">Giá & Giảm giá</th>
                      <th style="min-width: 120px;">Số lượng & Đã bán</th>
                      <th style="min-width: 150px;">Hình thức & Flash Sale</th>
                      <th style="min-width: 150px;">Thể loại & NXB</th>
                      <th style="min-width: 120px;">Nhà cung cấp</th>
                      <th style="min-width: 150px;">Thông tin bổ sung</th>
                      <th style="min-width: 100px;">Trạng thái</th>
                      <th style="min-width: 150px;">Tác giả</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="books.length === 0">
                      <td colspan="13" class="text-center py-4 text-muted">
                        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                        Không có dữ liệu
                      </td>
                    </tr>
                    <tr v-for="(book, index) in books" :key="book.id">
                      <td style="text-align: center;">{{ currentPage * pageSize + index + 1 }}</td>
                      <td>
                        <div class="d-flex gap-1">
                          <EditButton @click="openEditModal(book, index)" />
                        </div>
                      </td>
                      <td>
                        <!-- 🔥 HIỂN THỊ ẢNH TỪ TRƯỜNG IMAGES (MẢNG URL) - THEO TÀI LIỆU API -->
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                          <template v-if="book.images && book.images.length">
                            <img
                              v-for="(img, idx) in book.images"
                              :key="idx"
                              :src="img"
                              alt="Ảnh sách"
                              style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; margin: 2px; cursor: pointer; transition: box-shadow 0.2s;"
                              @click="openImagePreview(img)"
                              @mouseover="event.target.style.boxShadow = '0 0 0 2px #ff7e5f'"
                              @mouseleave="event.target.style.boxShadow = ''"
                            />
                          </template>
                          <template v-else>
                            <span class="text-muted small">Không có ảnh</span>
                          </template>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span class="badge bg-danger me-2">id : {{ book.id }}</span>
                          <strong>{{ book.bookName }}</strong>
                          <div v-if="book.description" class="small text-muted mt-1">
                            {{ book.description.length > 40 ? book.description.substring(0, 40) + '...' : book.description }}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <code class="text-primary d-block">{{ book.bookCode }}</code>
                          <small v-if="book.isbn" class="text-muted">ISBN: {{ book.isbn }}</small>
                          <small v-else class="text-muted">Chưa có ISBN</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <!-- Nếu có giảm giá (discountActive = true) -->
                          <template v-if="book.discountActive && (book.discountValue > 0 || book.discountPercent > 0)">
                            <strong class="text-danger d-block">
                              Giá gốc: <span style="text-decoration: line-through;">{{ formatCurrency(book.price) }}</span>
                            </strong>
                            <strong class="text-success d-block">
                              Giá đang bán: {{ formatCurrency(book.calculatedFinalPrice || book.finalPrice || book.price) }}
                            </strong>
                            <div class="small mt-1">
                              <span v-if="book.discountValue && book.discountValue > 0" class="badge bg-warning text-dark">
                                Giảm: {{ formatCurrency(book.discountValue) }}
                              </span>
                              <span v-if="book.discountPercent && book.discountPercent > 0" class="badge bg-warning text-dark mx-1">
                                Giảm: {{ book.discountPercent }}%
                              </span>
                              <span class="badge bg-success ms-1">
                                Đang giảm giá
                              </span>
                            </div>
                          </template>
                          <!-- Nếu không có giảm giá -->
                          <template v-else>
                            <strong class="text-success d-block">
                              {{ formatCurrency(book.price) }}
                            </strong>
                            <small class="text-muted">Không giảm giá</small>
                          </template>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span 
                            :class="book.stockQuantity === 0 ? 'badge bg-danger' : (book.stockQuantity < 10 ? 'badge bg-warning text-dark' : 'text-dark fw-bold')"
                            class="d-block"
                          >
                            Tồn: {{ book.stockQuantity }}
                          </span>
                          <small class="text-info d-block">
                            Đã bán: {{ book.soldCount || 0 }}
                          </small>
                          <small class="text-warning d-block">
                            <span 
                              v-if="book.processingQuantity && book.processingQuantity > 0"
                              class="processing-quantity-hover"
                              @mouseenter="showProcessingOrdersPopup($event, book)"
                              @mouseleave="hideProcessingOrdersPopup"
                              :title="'Click để xem chi tiết ' + (book.processingQuantity || 0) + ' cuốn đang xử lý'"
                            >
                              <i class="bi bi-hourglass-split me-1"></i>
                              Đang xử lý: {{ book.processingQuantity }}
                            </span>
                            <span v-else>
                              <i class="bi bi-check-circle me-1"></i>
                              Đang xử lý: {{ book.processingQuantity || 0 }}
                            </span>
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <!-- Book Format -->
                          <div class="mb-2">
                            <span class="badge" :class="getBookFormatClass(book.bookFormat)">
                              {{ getBookFormatText(book.bookFormat) }}
                            </span>
                          </div>
                          <!-- Flash Sale Info -->
                          <div v-if="book.isInFlashSale" class="text-center">
                            <button 
                              class="btn btn-danger btn-sm mb-1" 
                              @click="goToFlashSaleManagement(book.id)"
                              title="Xem Flash Sale"
                            >
                              <i class="bi bi-lightning-fill"></i> FLASH SALE
                            </button>
                            <div class="small">
                              <div class="text-danger fw-bold">{{ formatCurrency(book.flashSalePrice) }}</div>
                              <div class="text-muted">Đã bán: {{ book.flashSaleSoldCount || 0 }}</div>
                              <div class="text-muted">Tồn : {{ book.flashSaleStock || 0 }}</div>
                              <div v-if="book.flashSaleEndTime" class="text-muted">
                                Kết thúc: {{ formatDateTime(book.flashSaleEndTime) }}
                              </div>
                            </div>
                          </div>
                          <span v-else class="text-muted small">Không có Flash Sale</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div class="mb-1">
                            <span class="badge bg-info text-dark">
                              {{ book.categoryName || 'Chưa phân loại' }}
                            </span>
                          </div>
                          <div>
                            <span class="badge bg-secondary">
                              {{ book.publisherName || 'Chưa có NXB' }}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-secondary">
                          {{ book.supplierName || 'Chưa có nhà cung cấp' }}
                        </span>
                      </td>
                      <td>
                        <div class="small">
                          <div v-if="book.language">
                            <strong>Ngôn ngữ:</strong> {{ book.language }}
                          </div>
                          <div v-if="book.pageCount">
                            <strong>Số trang:</strong> {{ book.pageCount }}
                          </div>
                          <div v-if="book.weight">
                            <strong>Trọng lượng:</strong> {{ book.weight }}g
                          </div>
                          <div v-if="book.dimensions">
                            <strong>Kích thước:</strong> {{ book.dimensions }}
                          </div>
                          <div v-if="book.translator">
                            <strong>Dịch giả:</strong> {{ book.translator }}
                          </div>
                          <div v-if="book.publicationDate">
                            <strong>Ngày XB:</strong> {{ formatDate(book.publicationDate) }}
                          </div>
                        </div>
                      </td>
                      <td>
                        <StatusLabel
                          :status="book.status"
                          :statusText="getStatusText(book.status)"
                          :statusClass="getStatusClass(book.status)"
                          :clickable="true"
                          @toggle="handleToggleStatus(book.id, index)"
                        />
                      </td>
                      <td>
                        <div v-if="book.authors && book.authors.length">
                          <span 
                            v-for="(author, index) in book.authors" 
                            :key="author.id"
                            class="badge bg-primary me-1 mb-1"
                          >
                            {{ author.authorName }}
                          </span>
                        </div>
                        <span v-else class="text-muted small">Chưa có tác giả</span>
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

  <!-- Add/Edit Book Modal -->
  <div class="modal fade" id="addBookModal" tabindex="-1" aria-labelledby="addBookModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable enhanced-modal">
      <div class="modal-content">
        <div class="modal-header gradient-header">
          <h5 class="modal-title" id="addBookModalLabel">
            <i class="bi bi-book me-2"></i>
            {{ isEditMode ? 'Chỉnh sửa sách' : 'Thêm sách mới' }}
          </h5>
          <button type="button" class="custom-close-btn" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body enhanced-body">
          <form @submit.prevent="handleSubmitBook">
            <!-- Thông tin cơ bản -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <i class="bi bi-info-circle"></i>
                </div>
                <h6 class="section-title">Thông tin cơ bản</h6>
              </div>
              
              <div class="row g-3">
                <div class="col-md-8">
                  <label for="bookName" class="form-label enhanced-label">
                    Tên sách <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control enhanced-input"
                    id="bookName"
                    v-model="newBook.bookName"
                    placeholder="Nhập tên sách..."
                    required
                  />
                </div>
                <div class="col-md-4">
                  <label for="bookCode" class="form-label enhanced-label">
                    Mã sách
                  </label>
                  <input
                    type="text"
                    class="form-control enhanced-input"
                    id="bookCode"
                    v-model="newBook.bookCode"
                    placeholder="Tự động tạo nếu để trống"
                  />
                </div>
              </div>

              <div class="row g-3 mt-2">
                <div class="col-12">
                  <label for="description" class="form-label enhanced-label">
                    Mô tả sách
                  </label>
                  <textarea
                    class="form-control enhanced-input"
                    id="description"
                    v-model="newBook.description"
                    rows="3"
                    placeholder="Nhập mô tả chi tiết về sách..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Phân loại và giá -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <i class="bi bi-tag"></i>
                </div>
                <h6 class="section-title">Phân loại và định giá</h6>
              </div>

              <div class="row g-3">
                <div class="col-12">
                  <label for="authorIds" class="form-label enhanced-label">
                    Tác giả <span class="text-danger">*</span>
                  </label>
                  
                  <!-- Multi-select dropdown -->
                  <select
                    class="form-select enhanced-input"
                    id="authorIds"
                    v-model="newBook.authorIds"
                    multiple
                    size="4"
                    required
                  >
                    <option
                      v-for="author in authors"
                      :key="author.id"
                      :value="author.id"
                    >
                      {{ author.name }}
                    </option>
                  </select>
                  
                  <!-- Selected authors display -->
                  <div v-if="newBook.authorIds.length > 0" class="mt-2">
                    <small class="text-muted">Tác giả đã chọn:</small>
                    <div class="mt-1">
                      <span 
                        v-for="authorId in newBook.authorIds" 
                        :key="authorId"
                        class="badge bg-primary me-1 mb-1"
                      >
                        {{ getAuthorNameById(authorId) }}
                        <i 
                          class="bi bi-x-circle ms-1" 
                          style="cursor: pointer;"
                          @click="removeAuthor(authorId)"
                        ></i>
                      </span>
                    </div>
                  </div>
                  
                  <div class="form-text">
                    <i class="bi bi-info-circle me-1"></i>
                    Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều tác giả
                  </div>
                </div>
              </div>

              <div class="row g-3 mt-2">
                <div class="col-md-6">
                  <label for="categoryId" class="form-label enhanced-label">
                    Danh mục
                  </label>
                  <select
                    class="form-select enhanced-input"
                    id="categoryId"
                    v-model="newBook.categoryId"
                  >
                    <option value="">Chọn danh mục</option>
                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.categoryName }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="supplierId" class="form-label enhanced-label">
                    Nhà cung cấp
                  </label>
                  <select
                    class="form-select enhanced-input"
                    id="supplierId"
                    v-model="newBook.supplierId"
                  >
                    <option value="">Chọn nhà cung cấp</option>
                    <option
                      v-for="supplier in suppliers"
                      :key="supplier.id"
                      :value="supplier.id"
                    >
                      {{ supplier.name }}
                    </option>
                  </select>
                </div>
              </div>
                
              <div class="row g-3 mt-2">
                <div class="col-md-6">
                  <label for="publisherId" class="form-label enhanced-label">
                    Nhà xuất bản
                  </label>
                  <select
                    class="form-select enhanced-input"
                    id="publisherId"
                    v-model="newBook.publisherId"
                  >
                    <option value="">Chọn nhà xuất bản</option>
                    <option
                      v-for="publisher in publishers"
                      :key="publisher.id"
                      :value="publisher.id"
                    >
                      {{ publisher.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row g-3 mt-2">
                <div class="col-md-4">
                  <label for="bookFormat" class="form-label enhanced-label">
                    Hình thức sách <span class="text-danger">*</span>
                  </label>
                  <select
                    class="form-select enhanced-input"
                    id="bookFormat"
                    v-model="newBook.bookFormat"
                    required
                  >
                    <option value="HARDCOVER">Bìa cứng</option>
                    <option value="PAPERBACK">Bìa mềm</option>
                    <option value="AUDIOBOOK">Sách nói</option>
                    <option value="EBOOK">Sách điện tử</option>
                    <option value="MAGAZINE">Tạp chí</option>
                    <option value="COMIC">Truyện tranh</option>
                    <option value="TEXTBOOK">Sách giáo khoa</option>
                    <option value="NOTEBOOK">Sổ tay</option>
                    <option value="JOURNAL">Nhật ký</option>
                    <option value="WORKBOOK">Sách bài tập</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="price" class="form-label enhanced-label">
                    Giá bán <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <input
                      type="number"
                      class="form-control enhanced-input"
                      id="price"
                      v-model="newBook.price"
                      placeholder="0"
                      min="0"
                      step="1000"
                      required
                    />
                    <span class="input-group-text">VNĐ</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="stockQuantity" class="form-label enhanced-label">
                    Số lượng tồn kho <span class="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    class="form-control enhanced-input"
                    id="stockQuantity"
                    v-model="newBook.stockQuantity"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <!-- Discount Section -->
              <div class="row g-3 mt-2">
                <div class="col-md-3">
                  <label class="form-label enhanced-label">
                    Loại giảm giá
                  </label>
                  <select 
                    class="form-select enhanced-input" 
                    v-model="discountType"
                    @change="onDiscountTypeChange"
                  >
                    <option value="">Không giảm giá</option>
                    <option value="amount">Giảm theo số tiền</option>
                    <option value="percent">Giảm theo phần trăm</option>
                  </select>
                </div>
                <div class="col-md-3" v-if="discountType === 'amount'">
                  <label for="discountValue" class="form-label enhanced-label">
                    Giảm giá (VNĐ)
                  </label>
                  <div class="input-group">
                    <input
                      type="number"
                      class="form-control enhanced-input"
                      id="discountValue"
                      v-model="newBook.discountValue"
                      @input="onDiscountValueChange"
                      placeholder="0"
                      min="0"
                      step="1000"
                    />
                    <span class="input-group-text">VNĐ</span>
                  </div>
                </div>
                <div class="col-md-3" v-if="discountType === 'percent'">
                  <label for="discountPercent" class="form-label enhanced-label">
                    Giảm giá (%)
                  </label>
                  <div class="input-group">
                    <input
                      type="number"
                      class="form-control enhanced-input"
                      id="discountPercent"
                      v-model="newBook.discountPercent"
                      @input="onDiscountPercentChange"
                      placeholder="0"
                      min="0"
                      max="100"
                      step="1"
                    />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
                <div class="col-md-3" v-if="discountType">
                  <label for="discountActive" class="form-label enhanced-label">
                    Kích hoạt giảm giá
                  </label>
                  <div class="form-check form-switch mt-2">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="discountActive"
                      v-model="newBook.discountActive"
                    />
                    <label class="form-check-label" for="discountActive">
                      {{ newBook.discountActive ? 'Đang giảm giá' : 'Không giảm giá' }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- ✅ Price Calculation Result Section -->
              <div class="row g-3 mt-3" v-if="isEditMode && (discountType === 'amount' || discountType === 'percent')">
                <div class="col-md-12">
                  <div class="card border-info" v-if="isCalculatingPrice">
                    <div class="card-body text-center">
                      <div class="spinner-border text-info me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                      <span>Đang tính toán giá...</span>
                    </div>
                  </div>
                  
                  <div class="card border-success" v-else-if="calculatedPrice">
                    <div class="card-header bg-success text-white">
                      <h6 class="mb-0">
                        <i class="bi bi-calculator me-2"></i>
                        Kết quả tính giá
                      </h6>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-6">
                          <strong>Giá gốc:</strong> {{ formatCurrency(calculatedPrice.originalPrice) }}
                        </div>
                        <div class="col-md-6">
                          <strong class="text-success">Giá sau giảm:</strong> {{ formatCurrency(calculatedPrice.finalPrice) }}
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-md-6">
                          <span class="text-info">Số tiền giảm:</span> {{ formatCurrency(calculatedPrice.discountAmount) }}
                        </div>
                        <div class="col-md-6 ">
                          <span class="text-info">Phần trăm giảm:</span> {{ calculatedPrice.discountPercent }}%
                        </div>
                      </div>
                      <div class="row mt-2" v-if="calculatedPrice.hasFlashSale">
                        <div class="col-12">
                          <div class="alert alert-warning mb-0">
                            <strong>⚠️ Thông báo:</strong> Sách này đang có Flash Sale với giá {{ formatCurrency(calculatedPrice.flashSalePrice) }}
                            (tiết kiệm {{ formatCurrency(calculatedPrice.flashSavings) }})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="alert alert-info" v-else-if="newBook.discountActive && discountType">
                    <i class="bi bi-info-circle me-2"></i>
                    Nhập giá trị giảm giá để xem kết quả tính toán
                  </div>
                </div>
              </div>

              <div class="row g-3 mt-2">
                <div class="col-md-12">
                  <label for="publicationDate" class="form-label enhanced-label">
                    Ngày xuất bản
                  </label>
                  <input
                    type="date"
                    class="form-control enhanced-input"
                    id="publicationDate"
                    v-model="publicationDateFormatted"
                  />
                </div>
              </div>
            </div>

            <!-- Trạng thái -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <i class="bi bi-gear"></i>
                </div>
                <h6 class="section-title">Cài đặt</h6>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label for="status" class="form-label enhanced-label">
                    Trạng thái
                  </label>
                  <select
                    class="form-select enhanced-input"
                    id="status"
                    v-model="newBook.status"
                  >
                    <option value="1">Hoạt động</option>
                    <option value="0">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Thêm MultiImageUpload vào modal Book -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <i class="bi bi-images"></i>
                </div>
                <h6 class="section-title">Hình ảnh sách</h6>
              </div>
              <div class="row">
                <div class="col-12">
                  <MultiImageUpload
                    v-model="bookImagesUrls"
                    label="Hình ảnh sách (Tối đa 5 ảnh)"
                    upload-endpoint="product-images"
                    :max-files="5"
                    :max-size="5 * 1024 * 1024"
                  />
                </div>
              </div>
            </div>

            <!-- Thông tin bổ sung về sách -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <i class="bi bi-clipboard-data"></i>
                </div>
                <h6 class="section-title">Thông tin bổ sung</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-4">
                  <label for="dimensions" class="form-label enhanced-label">Kích thước</label>
                  <input
                    type="text"
                    class="form-control enhanced-input"
                    id="dimensions"
                    v-model="newBook.dimensions"
                    placeholder="VD: 20x13x2"
                  />
                </div>
                <div class="col-md-4">
                  <label for="weight" class="form-label enhanced-label">Trọng lượng (gram)</label>
                  <input
                    type="number"
                    class="form-control enhanced-input"
                    id="weight"
                    v-model="newBook.weight"
                    placeholder="VD: 400"
                    min="0"
                  />
                </div>
                <div class="col-md-4">
                  <label for="language" class="form-label enhanced-label">Ngôn ngữ</label>
                  <input
                    type="text"
                    class="form-control enhanced-input"
                    id="language"
                    v-model="newBook.language"
                    placeholder="VD: Tiếng Việt"
                  />
                </div>
              </div>
              <div class="row g-3 mt-2">
                <div class="col-md-4">
                  <label for="pageCount" class="form-label enhanced-label">Số trang</label>
                  <input
                    type="number"
                    class="form-control enhanced-input"
                    id="pageCount"
                    v-model="newBook.pageCount"
                    placeholder="VD: 320"
                    min="0"
                  />
                </div>
                <div class="col-md-4">
                  <label for="isbn" class="form-label enhanced-label">ISBN</label>
                  <input
                    type="text"
                    class="form-control enhanced-input"
                    id="isbn"
                    v-model="newBook.isbn"
                    placeholder="VD: 978-604-2-12345-6"
                  />
                </div>
                <div class="col-md-4">
                  <label for="translator" class="form-label enhanced-label">Người dịch</label>
                  <input
                    type="text"
                    class="form-control enhanced-input"
                    id="translator"
                    v-model="newBook.translator"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer enhanced-footer">
          <button
            type="button"
            class="btn btn-outline-secondary fake-data-btn"
            @click="fillFakeData"
          >
            <i class="bi bi-magic me-1"></i>
            Điền dữ liệu mẫu
          </button>
          <button
            type="button"
            class="btn btn-cancel"
            @click="closeModal"
          >
            <i class="bi bi-x-circle me-1"></i>
            Hủy
          </button>
          <button
            type="button"
            class="btn btn-submit"
            @click="handleSubmitBook"
          >
            <i class="bi bi-check-circle me-1"></i>
            {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Image Preview Modal -->
  <ImagePreviewModal :show="showImagePreview" :image-url="previewImageUrl" @close="closeImagePreview" />

  <!-- Processing Orders Popup -->
  <ProcessingOrdersPopup
    :show="showProcessingPopup"
    :book-id="processingPopupBookId"
    :book-info="processingPopupBookInfo"
    :mouse-position="mousePosition"
    @close="hideProcessingOrdersPopup"
    @keep-open="cancelHideProcessingOrdersPopup"
  />
</template>

<script setup>
import EditButton from '@/components/common/EditButton.vue';
import Pagination from '@/components/common/Pagination.vue';
import AddButton from '@/components/common/AddButton.vue';
import StatusLabel from '@/components/common/StatusLabel.vue';
import MultiImageUpload from '@/components/common/MultiImageUpload.vue';
import ImagePreviewModal from '@/components/common/ImagePreviewModal.vue';
import ProcessingOrdersPopup from '@/components/common/ProcessingOrdersPopup.vue';
import BookOverviewCards from '@/views/admin/components-admin/statistics/BookOverviewCards.vue';
import BookPerformanceChart from '@/views/admin/components-admin/statistics/BookPerformanceChart.vue';
import ExcelExportButton from '@/components/common/ExcelExportButton.vue';
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { Modal } from 'bootstrap';
import { getBooks, createBook, updateBook, getAuthorsDropdown, getCategoriesDropdown, getSuppliersDropdown, toggleBookStatus, calculatePrice } from '@/services/admin/book';
import { getPublishersDropdown } from '@/services/admin/publisher';
import Swal from 'sweetalert2';
import { getAllCategoriesParentExcepNotNull, getAllCategoriesParentNotNull } from '@/services/admin/category';

// Statistics chart toggle
const showPerformanceChart = ref(false);
const overviewCardsRef = ref(null);
const performanceChartRef = ref(null);

// Filter collapse toggle
const showFilter = ref(true);

// Search and filter states
const searchQuery = ref('');
const bookCodeFilter = ref('');
const selectedCategory = ref('');
const selectedSupplier = ref('');
const selectedPublisher = ref('');
const selectedStatus = ref('');
const minPrice = ref('');
const maxPrice = ref('');

// Loading state
const loading = ref(false);

// New/Edit book form data
const newBook = ref({
  id: '',
  bookName: '',
  description: '',
  price: '',
  stockQuantity: '',
  publicationDate: '',
  categoryId: '',
  supplierId: '',
  publisherId: '',
  bookCode: '',
  status: 1,
  authorIds: [], // BẮT BUỘC - Danh sách ID tác giả
  bookImages: [],
  // Trường mới theo API
  bookFormat: 'PAPERBACK', // ✅ THÊM BOOK FORMAT - ENUM MỚI
  dimensions: '',
  weight: '',
  language: '',
  pageCount: '',
  isbn: '',
  translator: '',
  // Discount fields theo tài liệu
  discountValue: '', // Giảm tiền cố định
  discountPercent: '', // Giảm theo %
  discountActive: false // Bật/tắt giảm giá
});

// Computed property for date formatting
const publicationDateFormatted = computed({
  get() {
    if (!newBook.value.publicationDate) return '';
    const date = new Date(newBook.value.publicationDate);
    return date.toISOString().split('T')[0];
  },
  set(value) {
    if (value) {
      newBook.value.publicationDate = new Date(value).getTime();
    } else {
      newBook.value.publicationDate = '';
    }
  }
});

// Data for dropdowns
const authors = ref([]);
const categories = ref([]);
const suppliers = ref([]);
const publishers = ref([]);

// Track edit mode and index
const isEditMode = ref(false);
const editIndex = ref(null);

// Discount type ref
const discountType = ref('');

// ✅ Thêm state cho price calculation
const calculatedPrice = ref(null);
const isCalculatingPrice = ref(false);

// Pagination state
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

// Books data
const books = ref([]);

const fetchBooks = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
    };

    // Add filters if they have values
    if (searchQuery.value.trim()) {
      params.bookName = searchQuery.value.trim();
    }
    if (bookCodeFilter.value.trim()) {
      params.bookCode = bookCodeFilter.value.trim();
    }
    if (selectedCategory.value) {
      params.categoryId = selectedCategory.value;
    }
    if (selectedSupplier.value) {
      params.supplierId = selectedSupplier.value;
    }
    if (selectedPublisher.value) {
      params.publisherId = selectedPublisher.value;
    }
    if (selectedStatus.value !== '') {
      params.status = selectedStatus.value;
    }
    if (minPrice.value) {
      params.minPrice = minPrice.value;
    }
    if (maxPrice.value) {
      params.maxPrice = maxPrice.value;
    }

    console.log('Fetching books with params:', params);
    
    const data = await getBooks(params);
    books.value = data.data.content || [];
    totalPages.value = data.data.totalPages || 1;
    totalElements.value = data.data.totalElements || 0;
    isLastPage.value = data.data.last ?? (currentPage.value >= totalPages.value - 1);
    
    // 🔥 GỌI API TÍNH GIÁ CHO TỪNG SÁCH CÓ GIẢM GIÁ
    await calculatePricesForBooks();
    
    // 🔥 DEBUG: Kiểm tra API có trả về đúng trường images không
    if (books.value.length > 0) {
      console.log('=== DEBUG: First book data ===');
      console.log('book.images:', books.value[0].images);
      console.log('book.coverImageUrl:', books.value[0].coverImageUrl);
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: 'Không thể tải danh sách sách',
      timer: 2000,
      timerProgressBar: true
    });
  }
};

// 🔥 FUNCTION MỚI: Tính giá cho tất cả sách có giảm giá
const calculatePricesForBooks = async () => {
  try {
    for (let i = 0; i < books.value.length; i++) {
      const book = books.value[i];
      
      // Chỉ gọi API nếu sách có giảm giá active
      if (book.discountActive && (book.discountValue > 0 || book.discountPercent > 0)) {
        try {
          const response = await calculatePrice(
            book.id,
            book.discountValue || null,
            book.discountPercent || null,
            book.discountActive
          );
          
          if (response.status === 200 && response.data) {
            // Cập nhật giá tính được từ API vào book
            books.value[i].calculatedFinalPrice = response.data.finalPrice;
            books.value[i].calculatedDiscountAmount = response.data.discountAmount;
          }
        } catch (error) {
          console.error(`Lỗi khi tính giá cho sách ID ${book.id}:`, error);
          // Nếu API lỗi, giữ nguyên giá gốc
          books.value[i].calculatedFinalPrice = book.price;
        }
      }
    }
  } catch (error) {
    console.error('Lỗi khi tính giá cho danh sách sách:', error);
  }
};

// Load authors, categories, suppliers and publishers data
const loadDropdownData = async () => {
  try {
    const [authorsResponse, categoriesResponse, suppliersResponse, publishersResponse] = await Promise.all([
      getAuthorsDropdown(),
      getAllCategoriesParentNotNull(),
      getSuppliersDropdown(),
      getPublishersDropdown()
    ]);
    
    authors.value = authorsResponse.data || [];
    categories.value = categoriesResponse || [];
    suppliers.value = suppliersResponse.data || [];
    publishers.value = publishersResponse.data || [];
    
    console.log('authors.value:', authors.value);
    console.log('categories.value:', categories.value);
    console.log('suppliers.value:', suppliers.value);
    console.log('publishers.value:', publishers.value);
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu dropdown:', error);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: 'Không thể tải dữ liệu dropdown. Vui lòng thử lại.',
      timer: 3000,
      timerProgressBar: true
    });
  }
};

// Watch filters and pagination
watch([pageSize], () => {
  currentPage.value = 0;
  fetchBooks();
});

watch([currentPage], () => {
  fetchBooks();
});

// Format currency function
const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Status functions
const getStatusText = (status) => {
  return status === 1 ? 'Hoạt động' : 'Không hoạt động';
};

const getStatusClass = (status) => {
  return status === 1 ? 'status-active' : 'status-inactive';
};

// ✅ BookFormat helper functions
const getBookFormatText = (format) => {
  const formatMap = {
    'HARDCOVER': 'Bìa cứng',
    'PAPERBACK': 'Bìa mềm',
    'AUDIOBOOK': 'Sách nói',
    'EBOOK': 'Sách điện tử',
    'MAGAZINE': 'Tạp chí',
    'COMIC': 'Truyện tranh',
    'TEXTBOOK': 'Sách giáo khoa',
    'NOTEBOOK': 'Sổ tay',
    'JOURNAL': 'Nhật ký',
    'WORKBOOK': 'Sách bài tập'
  };
  return formatMap[format] || format || 'Bìa mềm';
};

const getBookFormatClass = (format) => {
  const classMap = {
    'HARDCOVER': 'bg-primary',
    'PAPERBACK': 'bg-success',
    'AUDIOBOOK': 'bg-warning text-dark',
    'EBOOK': 'bg-info text-dark',
    'MAGAZINE': 'bg-secondary',
    'COMIC': 'bg-danger',
    'TEXTBOOK': 'bg-dark',
    'NOTEBOOK': 'bg-light text-dark',
    'JOURNAL': 'bg-purple',
    'WORKBOOK': 'bg-orange'
  };
  return classMap[format] || 'bg-success';
};

// Modal functions
const openAddModal = () => {
  isEditMode.value = false;
  console.log('=== DEBUG: openAddModal called ===');
  console.log('isEditMode.value:', isEditMode.value);
  
  // Reset discount type
  discountType.value = '';
  
  newBook.value = {
    id: '',
    bookName: '',
    description: '',
    price: '',
    stockQuantity: '',
    publicationDate: '',
    categoryId: '',
    supplierId: '',
    publisherId: '',
    bookCode: '',
    status: 1,
    authorIds: [],
    bookImages: [],
    // Trường mới
    bookFormat: 'PAPERBACK',
    dimensions: '',
    weight: '',
    language: '',
    pageCount: '',
    isbn: '',
    translator: '',
    // Discount fields
    discountValue: '',
    discountPercent: '',
    discountActive: false
  };
  
  console.log('=== DEBUG: Opening Add Modal ===');
  
  const modalElement = document.getElementById('addBookModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const openEditModal = (book, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  // 🔥 QUAN TRỌNG: Luôn lấy bookImages từ book.images (mảng URL) - THEO TÀI LIỆU API
  // KHÔNG lấy từ coverImageUrl vì đây chỉ là ảnh bìa nhỏ cho thumbnail
  let bookImages = Array.isArray(book.images) ? [...book.images] : [];
  newBook.value = {
    id: book.id,
    bookName: book.bookName,
    description: book.description || '',
    price: book.price,
    stockQuantity: book.stockQuantity,
    publicationDate: book.publicationDate || '',
    categoryId: book.categoryId || '',
    supplierId: book.supplierId || '',
    publisherId: book.publisherId || '',
    bookCode: book.bookCode,
    status: book.status,
    authorIds: book.authors ? book.authors.map(author => author.id) : [],
    bookImages, // luôn đồng bộ với images
    // Trường mới
    bookFormat: book.bookFormat || 'PAPERBACK', // ✅ THÊM BOOK FORMAT
    dimensions: book.dimensions || '',
    weight: book.weight || '',
    language: book.language || '',
    pageCount: book.pageCount || '',
    isbn: book.isbn || '',
    translator: book.translator || '',
    // Discount fields
    discountValue: book.discountValue || '',
    discountPercent: book.discountPercent || '',
    discountActive: book.discountActive || false
  };
  
  // Set discountType based on existing discount values
  if (book.discountValue && book.discountValue > 0) {
    discountType.value = 'amount';
  } else if (book.discountPercent && book.discountPercent > 0) {
    discountType.value = 'percent';
  } else {
    discountType.value = '';
  }
  
  // ✅ Reset calculated price state
  calculatedPrice.value = null;
  isCalculatingPrice.value = false;
  
  console.log('=== DEBUG: Opening Edit Modal ===');
  
  const modalElement = document.getElementById('addBookModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
  
  // ✅ Gọi API tính giá nếu có discount
  if (newBook.value.discountActive && (newBook.value.discountValue > 0 || newBook.value.discountPercent > 0)) {
    setTimeout(() => {
      calculateBookPrice();
    }, 500); // Delay nhỏ để modal hiển thị trước
  }
};

const handleSubmitBook = async () => {
  // Validate form
  if (!newBook.value.bookName || newBook.value.bookName.trim() === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Cảnh báo!',
      text: 'Vui lòng nhập tên sách',
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }

  if (!newBook.value.price || newBook.value.price <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Cảnh báo!',
      text: 'Vui lòng nhập giá hợp lệ',
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }

  if (newBook.value.stockQuantity === '' || newBook.value.stockQuantity < 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Cảnh báo!',
      text: 'Vui lòng nhập số lượng tồn kho hợp lệ',
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }

  // 🔥 VALIDATION MỚI - BẮT BUỘC: Kiểm tra authorIds
  if (!newBook.value.authorIds || newBook.value.authorIds.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Cảnh báo!',
      text: 'Vui lòng chọn ít nhất một tác giả',
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }
  // Bỏ validation ảnh, ảnh không bắt buộc
  try {
    let imagesArr = newBook.value.bookImages || [];
    // Luôn ép kiểu về mảng string (url)
    if (imagesArr.length > 0 && typeof imagesArr[0] === 'object' && imagesArr[0].url) {
      imagesArr = imagesArr.map(img => img.url);
    }
    if (!Array.isArray(imagesArr)) imagesArr = [];
    
    const bookData = {
      bookName: newBook.value.bookName.trim(),
      description: newBook.value.description?.trim() || '',
      price: parseFloat(newBook.value.price),
      stockQuantity: parseInt(newBook.value.stockQuantity),
      publicationDate: newBook.value.publicationDate || null,
      categoryId: newBook.value.categoryId || null,
      supplierId: newBook.value.supplierId || null,
      publisherId: newBook.value.publisherId || null,
      bookCode: newBook.value.bookCode?.trim() || '',
      status: parseInt(newBook.value.status),
      authorIds: newBook.value.authorIds,
      images: imagesArr, // 🔥 CHỈ GỬI TRƯỜNG IMAGES - THEO TÀI LIỆU API
      bookFormat: newBook.value.bookFormat, // ✅ THÊM BOOK FORMAT
      dimensions: newBook.value.dimensions,
      weight: newBook.value.weight,
      language: newBook.value.language,
      pageCount: newBook.value.pageCount,
      isbn: newBook.value.isbn,
      translator: newBook.value.translator,
      // ✅ THÊM DISCOUNT FIELDS VÀO PAYLOAD
      discountValue: discountType.value === 'amount' ? parseFloat(newBook.value.discountValue) || null : null,
      discountPercent: discountType.value === 'percent' ? parseFloat(newBook.value.discountPercent) || null : null,
      discountActive: newBook.value.discountActive || false
    };

    console.log('=== DEBUG: Submitting book data ===');
    console.log('bookData.images:', bookData.images);

    if (isEditMode.value) {
      // Update book
      await updateBook(newBook.value.id, bookData);
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Cập nhật sách thành công',
        timer: 2000,
        timerProgressBar: true
      });
    } else {
      // Create new book
      await createBook(bookData);
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Thêm sách mới thành công',
        timer: 2000,
        timerProgressBar: true
      });
    }

    // Refresh data and close modal
    await fetchBooks();
    closeModal();
  } catch (error) {
    console.error('Lỗi khi lưu sách:', error);
    const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi lưu sách';
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: errorMessage,
      timer: 3000,
      timerProgressBar: true
    });
  }
};

const closeModal = () => {
  const modalElement = document.getElementById('addBookModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};

// Helper functions for authors
const getAuthorNameById = (authorId) => {
  const author = authors.value.find(a => a.id === authorId);
  return author ? author.name : 'Unknown';
};

const removeAuthor = (authorId) => {
  newBook.value.authorIds = newBook.value.authorIds.filter(id => id !== authorId);
};

// Discount type handler
const onDiscountTypeChange = () => {
  // Reset discount values when type changes
  newBook.value.discountValue = '';
  newBook.value.discountPercent = '';
  newBook.value.discountActive = false;
  
  // Reset calculated price
  calculatedPrice.value = null;
  
  if (!discountType.value) {
    newBook.value.discountActive = false;
  }
};

// ✅ Function để gọi API tính giá
const calculateBookPrice = async () => {
  if (!newBook.value.id || isEditMode.value === false) {
    console.log('Không thể tính giá: cần bookId và phải ở chế độ edit');
    return;
  }
  
  if (!newBook.value.discountActive) {
    calculatedPrice.value = null;
    return;
  }
  
  try {
    isCalculatingPrice.value = true;
    
    const response = await calculatePrice(
      newBook.value.id,
      discountType.value === 'amount' ? newBook.value.discountValue : null,
      discountType.value === 'percent' ? newBook.value.discountPercent : null,
      newBook.value.discountActive
    );
    
    if (response.status === 200) {
      calculatedPrice.value = response.data;
      console.log('✅ Price calculation result:', calculatedPrice.value);
    }
  } catch (error) {
    console.error('❌ Lỗi khi tính giá sách:', error);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: 'Không thể tính giá sách. Vui lòng thử lại.',
      timer: 3000,
      timerProgressBar: true
    });
  } finally {
    isCalculatingPrice.value = false;
  }
};

// ✅ Function để handle khi thay đổi discount value
const onDiscountValueChange = () => {
  if (newBook.value.discountValue && parseFloat(newBook.value.discountValue) > 0) {
    newBook.value.discountActive = true;
    calculateBookPrice();
  } else {
    newBook.value.discountActive = false;
    calculatedPrice.value = null;
  }
};

// ✅ Function để handle khi thay đổi discount percent
const onDiscountPercentChange = () => {
  if (newBook.value.discountPercent && parseFloat(newBook.value.discountPercent) > 0) {
    newBook.value.discountActive = true;
    calculateBookPrice();
  } else {
    newBook.value.discountActive = false;
    calculatedPrice.value = null;
  }
};

// Toggle status function
const handleToggleStatus = async (bookId, index) => {
  try {
    await toggleBookStatus(bookId);
    books.value[index].status = books.value[index].status === 1 ? 0 : 1;
    
    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: 'Cập nhật trạng thái thành công',
      timer: 2000,
      timerProgressBar: true
    });
  } catch (error) {
    console.error('Lỗi khi chuyển trạng thái:', error);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: 'Không thể cập nhật trạng thái',
      timer: 2000,
      timerProgressBar: true
    });
  }
};

// Delete book function

// Filter functions
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const applyFilters = () => {
  console.log('Applying filters:', {
    searchQuery: searchQuery.value,
    bookCodeFilter: bookCodeFilter.value,
    selectedCategory: selectedCategory.value,
    selectedSupplier: selectedSupplier.value,
    selectedPublisher: selectedPublisher.value,
    selectedStatus: selectedStatus.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value
  });
  currentPage.value = 0;
  fetchBooks();
};

const clearFilters = () => {
  searchQuery.value = '';
  bookCodeFilter.value = '';
  selectedCategory.value = '';
  selectedSupplier.value = '';
  selectedPublisher.value = '';
  selectedStatus.value = '';
  minPrice.value = '';
  maxPrice.value = '';
  currentPage.value = 0;
  fetchBooks();
};

// Debounce function for search input
let searchTimeout = null;
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
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

const resetBookModal = () => {
  isEditMode.value = false;
  editIndex.value = null;
  
  // ✅ Reset calculated price states
  calculatedPrice.value = null;
  isCalculatingPrice.value = false;
  discountType.value = '';
  
  newBook.value = {
    id: '',
    bookName: '',
    description: '',
    price: '',
    stockQuantity: '',
    publicationDate: '',
    categoryId: '',
    supplierId: '',
    publisherId: '',
    bookCode: '',
    status: 1,
    authorIds: [],
    bookImages: [],
    // Trường mới
    bookFormat: 'PAPERBACK', // ✅ RESET BOOK FORMAT  
    dimensions: '',
    weight: '',
    language: '',
    pageCount: '',
    isbn: '',
    translator: '',
    // Discount fields
    discountValue: '',
    discountPercent: '',
    discountActive: false
  };
};

let modalElement = null;

onMounted(() => {
  modalElement = document.getElementById('addBookModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', resetBookModal);
  }
  loadDropdownData();
  fetchBooks();
});

onUnmounted(() => {
  if (modalElement) {
    modalElement.removeEventListener('hidden.bs.modal', resetBookModal);
  }
});

// Đảm bảo MultiImageUpload luôn trả về mảng URL
const bookImagesUrls = computed({
  get() {
    const arr = newBook.value.bookImages || [];
    // Nếu là object (có .url) thì map sang url
    if (arr.length > 0 && typeof arr[0] === 'object' && arr[0].url) {
      return arr.map(img => img.url);
    }
    // Nếu là string thì trả về luôn
    if (arr.length === 0) return [];
    if (typeof arr[0] === 'string') return arr;
    return [];
  },
  set(val) {
    // Luôn ép kiểu về mảng string (url)
    if (!val || !Array.isArray(val)) {
      newBook.value.bookImages = [];
    } else {
      newBook.value.bookImages = val.map(img => typeof img === 'object' && img.url ? img.url : img);
    }
    // Log để debug
    console.log('bookImagesUrls setter:', newBook.value.bookImages);
  }
});

// Watch để log khi thay đổi ảnh
watch(() => bookImagesUrls.value, (val) => {
  console.log('bookImagesUrls changed:', val);
  // Nếu xóa hết ảnh thì đảm bảo bookImages là []
  if (!val || val.length === 0) {
    newBook.value.bookImages = [];
  }
});

// Fake data function
const fillFakeData = () => {
  console.log('=== DEBUG: fillFakeData called ===');
  console.log('isEditMode.value:', isEditMode.value);
  
  // Kiểm tra dữ liệu dropdown trước khi fill
  if (authors.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Cảnh báo!',
      text: 'Chưa có dữ liệu tác giả. Vui lòng tải lại trang.',
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }
  
  // Generate unique name with timestamp
  const timestamp = Date.now();
  const bookNames = [
    'Doraemon tập mới',
    'One Piece tập đặc biệt',
    'Naruto phiên bản mới',
    'Sherlock Holmes tập kinh điển',
    'Harry Potter và bí mật mới',
    'Conan thám tử lừng danh',
    'Dragon Ball Super',
    'Attack on Titan tập cuối'
  ];
  
  const descriptions = [
    'Cuốn sách hay và thú vị dành cho mọi lứa tuổi',
    'Tác phẩm kinh điển được yêu thích nhất',
    'Câu chuyện hấp dẫn với nhiều tình tiết bất ngờ',
    'Nội dung giáo dục và giải trí cao',
    'Phù hợp cho việc học tập và nghiên cứu'
  ];
  
  // Generate random dates (past 1-3 years)
  const now = new Date();
  const publicationDate = new Date(now.getTime() - (Math.random() * 3 + 1) * 365 * 24 * 60 * 60 * 1000);
  
  // Pick random values
  const randomBookName = bookNames[Math.floor(Math.random() * bookNames.length)];
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  const randomPrice = [50000, 75000, 100000, 120000, 150000, 200000][Math.floor(Math.random() * 6)];
  const randomStock = [10, 25, 50, 100, 200][Math.floor(Math.random() * 5)];
  
  // Random select from dropdown data
  const randomCategoryId = categories.value.length > 0 ? 
    categories.value[Math.floor(Math.random() * categories.value.length)].id : '';
  
  const randomSupplierId = suppliers.value.length > 0 ? 
    suppliers.value[Math.floor(Math.random() * suppliers.value.length)].id : '';
    
  const randomPublisherId = publishers.value.length > 0 ? 
    publishers.value[Math.floor(Math.random() * publishers.value.length)].id : '';
  
  const randomStatus = Math.random() > 0.2 ? 1 : 0; // 80% active
  
  // 🔥 Random select authors (BẮT BUỘC) - Chọn 1-3 tác giả ngẫu nhiên
  const randomAuthorIds = [];
  if (authors.value.length > 0) {
    const numAuthors = Math.min(Math.floor(Math.random() * 3) + 1, authors.value.length); // 1-3 tác giả
    const shuffled = [...authors.value].sort(() => 0.5 - Math.random());
    randomAuthorIds.push(...shuffled.slice(0, numAuthors).map(author => author.id));
  }
  
  newBook.value = {
    ...newBook.value,
    bookName: `${randomBookName} #${timestamp}`,
    description: randomDescription,
    price: randomPrice,
    stockQuantity: randomStock,
    publicationDate: publicationDate.getTime(),
    categoryId: randomCategoryId,
    supplierId: randomSupplierId,
    publisherId: randomPublisherId,
    bookCode: `BOOK${timestamp}`,
    status: randomStatus,
    authorIds: randomAuthorIds, // 🔥 BẮT BUỘC - Random authorIds
    bookFormat: ['HARDCOVER', 'PAPERBACK', 'AUDIOBOOK', 'EBOOK'][Math.floor(Math.random() * 4)] // ✅ Random format
  };
  
  // Thêm dữ liệu mẫu cho các trường bổ sung
  const fakeImages = [
    'https://cdn.example.com/new1.jpg',
    'https://cdn.example.com/new2.jpg'
  ];
  newBook.value = {
    ...newBook.value,
    dimensions: '20x13x2',
    weight: 400,
    language: 'Tiếng Việt',
    pageCount: 320,
    isbn: '978-604-2-12345-6',
    translator: 'Nguyễn Văn A',
    bookImages: fakeImages // đồng bộ với MultiImageUpload
  };
  
  // Show success message
  Swal.fire({
    icon: 'success',
    title: 'Đã điền dữ liệu mẫu!',
    text: 'Dữ liệu mẫu đã được điền vào form',
    timer: 1500,
    timerProgressBar: true
  });
};

// State for image preview modal
const previewImageUrl = ref('');
const showImagePreview = ref(false);
const openImagePreview = (url) => {
  previewImageUrl.value = url;
  showImagePreview.value = true;
};
const closeImagePreview = () => {
  showImagePreview.value = false;
  previewImageUrl.value = '';
};

// State for processing orders popup
const showProcessingPopup = ref(false);
const processingPopupBookId = ref(null);
const processingPopupBookInfo = ref({});
const mousePosition = ref({ x: 0, y: 0 });
const hidePopupTimeout = ref(null);

const cancelHideProcessingOrdersPopup = () => {
  if (hidePopupTimeout.value) {
    clearTimeout(hidePopupTimeout.value);
    hidePopupTimeout.value = null;
  }
};

const showProcessingOrdersPopup = (event, book) => {
  // Clear any pending hide timeout first
  cancelHideProcessingOrdersPopup();
  if (!showProcessingPopup.value) {
    mousePosition.value = { x: event.clientX, y: event.clientY };
    processingPopupBookId.value = book.id;
    processingPopupBookInfo.value = {
      bookName: book.bookName,
      bookCode: book.bookCode,
      processingQuantity: book.processingQuantity
    };
    showProcessingPopup.value = true;
  }
};

const hideProcessingOrdersPopup = () => {
  cancelHideProcessingOrdersPopup();
  hidePopupTimeout.value = setTimeout(() => {
    showProcessingPopup.value = false;
    processingPopupBookId.value = null;
    processingPopupBookInfo.value = {};
  }, 250); // slight increase for user move
};

// Format date function
const formatDate = (timestamp) => {
  if (!timestamp) return 'Chưa có';
  const date = new Date(timestamp);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Format datetime function
const formatDateTime = (timestamp) => {
  if (!timestamp) return 'Chưa có';
  const date = new Date(timestamp);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Navigate to flash sale management
const goToFlashSaleManagement = (bookId) => {
  // Có thể điều hướng đến trang quản lý flash sale với bookId
  console.log('Navigate to flash sale management for book:', bookId);
  // router.push({ name: 'admin-flash-sale', query: { bookId } });
  // Tạm thời alert thông báo
  Swal.fire({
    title: 'Thông báo',
    text: `Chuyển đến quản lý Flash Sale cho sách ID: ${bookId}`,
    icon: 'info',
    confirmButtonText: 'OK'
  });
};

// Toggle function for performance chart
const togglePerformanceChart = () => {
  showPerformanceChart.value = !showPerformanceChart.value;
  if (showPerformanceChart.value && performanceChartRef.value) {
    // Refresh performance chart data when opened
    setTimeout(() => {
      performanceChartRef.value.fetchChartData();
    }, 100);
  }
};

const refreshStatistics = () => {
  // Refresh overview cards
  if (overviewCardsRef.value) {
    overviewCardsRef.value.fetchOverviewStats();
  }
  
  // Refresh performance chart if it's open
  if (showPerformanceChart.value && performanceChartRef.value) {
    performanceChartRef.value.fetchChartData();
  }
  
  Swal.fire({
    icon: 'success',
    title: 'Đã làm mới!',
    text: 'Dữ liệu thống kê đã được cập nhật',
    timer: 1500,
    timerProgressBar: true
  });
};
</script>

<style scoped>
@import "@/assets/css/admin-table-responsive.css";
@import '@/assets/css/admin-global.css';

.table th,
.table td {
  vertical-align: middle;
  border-color: #e9ecef;
}

/* Enhanced Modal Styles */
.modal-lg {
  max-width: 900px;
}

.modal-dialog-scrollable {
  height: calc(100vh - 2rem);
}

.modal-dialog-scrollable .modal-body {
  overflow-y: auto;
}

.enhanced-modal {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 15px;
  overflow: hidden;
}

.gradient-header {
  background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
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
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.modal-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.enhanced-body {
  background: linear-gradient(135deg, #fafbfc 0%, #f1f3f5 100%);
  padding: 2rem;
}

.enhanced-footer {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-top: 1px solid #e9ecef;
  padding: 1rem 2rem;
}

/* Form Section Styles */
.form-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #6c757d;
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease-out;
}

.form-section:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.form-section:nth-child(1) {
  border-left-color: #17a2b8;
}

.form-section:nth-child(2) {
  border-left-color: #28a745;
}

.form-section:nth-child(3) {
  border-left-color: #6f42c1;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f1f3f4;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, #6c757d, #adb5bd);
  border-radius: 1px;
}

.section-icon {
  background: linear-gradient(135deg, #ecae9e 0%, #d49489 100%);
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 16px;
}

.section-title {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Enhanced Form Controls */
.enhanced-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.enhanced-label .text-danger {
  color: #e74c3c !important;
}

.enhanced-input {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.enhanced-input:focus {
  border-color: #ff7e5f;
  box-shadow: 0 0 0 0.2rem rgba(255, 126, 95, 0.25);
  background: white;
  transform: translateY(-1px);
}

.enhanced-input:hover {
  border-color: #ced4da;
  background: white;
}

/* Multi-select specific styles */
.enhanced-input[multiple] {
  min-height: 120px;
  padding: 0.5rem 0.75rem;
}

.enhanced-input[multiple] option {
  padding: 0.5rem;
  border-radius: 4px;
  margin: 2px 0;
}

.enhanced-input[multiple] option:checked {
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  color: white;
  font-weight: 500;
}

/* Button Styles */
.fake-data-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.fake-data-btn:hover {
  background: linear-gradient(135deg, #ee5a52, #ff6b6b);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(238, 90, 82, 0.4);
  color: white;
}

.btn-submit {
  background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background: linear-gradient(135deg, #feb47b 0%, #ff7e5f 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 126, 95, 0.4);
  color: white;
}

.btn-cancel {
  background: #6c757d;
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 117, 125, 0.4);
  color: white;
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
  color: white;
  transition: all 0.3s ease;
}

.custom-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

/* Status Styles */
.status-active {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
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
  font-size: 0.75em;
  padding: 0.375rem 0.5rem;
}

.bg-info {
  background-color: #0dcaf0 !important;
}

/* Author badge styles */
.badge.bg-primary {
  font-size: 0.8em;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.badge.bg-primary .bi-x-circle:hover {
  color: #ffdddd;
  transform: scale(1.2);
}

/* BookFormat badge colors */
.bg-purple {
  background-color: #6f42c1 !important;
  color: white;
}

.bg-orange {
  background-color: #fd7e14 !important;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .modal-lg {
    max-width: 95%;
  }
}

@media (max-width: 992px) {
  .enhanced-body {
    padding: 1rem;
  }
  
  .form-section {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .modal-dialog-scrollable {
    height: 100vh;
    margin: 0;
  }
  
  .enhanced-modal {
    border-radius: 0;
  }
}

/* Modal positioning fix */
.modal-dialog {
  margin: 1rem auto;
}

@media (min-height: 600px) {
  .modal-dialog {
    margin: 2rem auto;
  }
}

/* Animation for form sections */
.form-section {
  animation: slideInUp 0.6s ease-out;
}

.form-section:nth-child(1) {
  animation-delay: 0.1s;
}

.form-section:nth-child(2) {
  animation-delay: 0.2s;
}

.form-section:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Table responsive improvements */
.table-responsive {
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
}

.table-responsive table {
  min-width: 1600px; /* Tăng từ 1200px để phù hợp với nhiều cột hơn */
}

.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Processing quantity hover effect */
.processing-quantity-hover {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid transparent;
}

.processing-quantity-hover:hover {
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid rgba(255, 193, 7, 0.5);
  color: #d39e00 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
}

.processing-quantity-hover:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(255, 193, 7, 0.4);
}

/* Responsive table fixes */
@media (max-width: 1400px) {
  .table-responsive table {
    min-width: 1400px;
  }
}

@media (max-width: 1200px) {
  .table-responsive table {
    min-width: 1200px;
  }
}

@media (max-width: 992px) {
  .table-responsive table {
    min-width: 1000px;
  }
}

@media (max-width: 768px) {
  .table-responsive table {
    min-width: 900px;
  }
}

/* Filter Card Styles (từ Order.vue) */
.filter-card {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.sticky-filter {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
}

.filter-collapse {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.filter-collapsed {
  max-height: 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  opacity: 0;
}

.admin-table-card {
  min-height: 600px;
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

.loading-overlay .spinner-border {
  width: 3rem;
  height: 3rem;
}

.loading {
  position: relative;
}

/* Statistics section */
.statistics-section {
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(226, 232, 240, 0.5);
}
</style>
