<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        <i class="bi bi-book text-primary me-2"></i>
        Quản lý sách
      </h2>
      <AddButton @click="openAddModal" text="Thêm sách mới" />
    </div>

    <!-- Filters -->
    <div class="card mb-4 shadow-lg border-0">
      <div class="card-header bg-light border-0 py-3">
        <h5 class="mb-0 text-secondary">
          <i class="bi bi-funnel me-2"></i>
          Bộ lọc tìm kiếm
        </h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label for="searchQuery" class="form-label">
              <i class="bi bi-search me-1"></i>
              Tìm kiếm theo tên sách
            </label>
            <input
              type="text"
              class="form-control"
              id="searchQuery"
              v-model="searchQuery"
              @input="debouncedSearch"
              placeholder="Nhập tên sách..."
            />
          </div>
          <div class="col-md-2">
            <label for="bookCodeFilter" class="form-label">
              <i class="bi bi-upc-scan me-1"></i>
              Mã sách
            </label>
            <input
              type="text"
              class="form-control"
              id="bookCodeFilter"
              v-model="bookCodeFilter"
              @input="debouncedSearch"
              placeholder="Mã sách..."
            />
          </div>
          <div class="col-md-2">
            <label for="categoryFilter" class="form-label">
              <i class="bi bi-tags me-1"></i>
              Danh mục
            </label>
            <select
              class="form-select"
              id="categoryFilter"
              v-model="selectedCategory"
              @change="applyFilters"
            >
              <option value="">Tất cả danh mục</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label for="supplierFilter" class="form-label">
              <i class="bi bi-truck me-1"></i>
              Nhà cung cấp
            </label>
            <select
              class="form-select"
              id="supplierFilter"
              v-model="selectedSupplier"
              @change="applyFilters"
            >
              <option value="">Tất cả nhà cung cấp</option>
              <option
                v-for="supplier in suppliers"
                :key="supplier.id"
                :value="supplier.id"
              >
                {{ supplier.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label for="publisherFilter" class="form-label">
              <i class="bi bi-journal-bookmark me-1"></i>
              Nhà xuất bản
            </label>
            <select
              class="form-select"
              id="publisherFilter"
              v-model="selectedPublisher"
              @change="applyFilters"
            >
              <option value="">Tất cả nhà xuất bản</option>
              <option
                v-for="publisher in publishers"
                :key="publisher.id"
                :value="publisher.id"
              >
                {{ publisher.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label for="statusFilter" class="form-label">
              <i class="bi bi-toggle-on me-1"></i>
              Trạng thái
            </label>
            <select
              class="form-select"
              id="statusFilter"
              v-model="selectedStatus"
              @change="applyFilters"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>
        </div>

        <!-- Price Range -->
        <div class="row g-3 mt-2">
          <div class="col-md-2">
            <label for="minPrice" class="form-label">
              <i class="bi bi-currency-dollar me-1"></i>
              Giá tối thiểu
            </label>
            <input
              type="number"
              class="form-control"
              id="minPrice"
              v-model="minPrice"
              @input="debouncedSearch"
              placeholder="0"
              min="0"
            />
          </div>
          <div class="col-md-2">
            <label for="maxPrice" class="form-label">
              <i class="bi bi-currency-dollar me-1"></i>
              Giá tối đa
            </label>
            <input
              type="number"
              class="form-control"
              id="maxPrice"
              v-model="maxPrice"
              @input="debouncedSearch"
              placeholder="1000000"
              min="0"
            />
          </div>
          <div class="col-md-8 d-flex align-items-end">
            <button
              class="btn btn-outline-secondary me-2"
              @click="clearFilters"
            >
              <i class="bi bi-arrow-clockwise me-1"></i>
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card shadow-lg border-0">
      <div class="card-header bg-white border-0 py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-table me-2"></i>
            Danh sách sách ({{ totalElements }} sách)
          </h5>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 5%">#</th>
                <th style="width: 10%">Mã sách</th>
                <th style="width: 20%">Tên sách</th>
                <th style="width: 15%">Tác giả</th>
                <th style="width: 12%">Danh mục</th>
                <th style="width: 12%">Nhà cung cấp</th>
                <th style="width: 8%">Giá</th>
                <th style="width: 6%">Tồn kho</th>
                <th style="width: 6%">Trạng thái</th>
                <th style="width: 8%">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="books.length === 0">
                <td colspan="10" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="(book, index) in books" :key="book.id">
                <td>{{ currentPage * pageSize + index + 1 }}</td>
                <td>
                  <code class="text-primary">{{ book.bookCode }}</code>
                </td>
                <td>
                  <div>
                    <strong>{{ book.bookName }}</strong>
                    <div v-if="book.description" class="small text-muted">
                      {{ book.description.length > 40 ? book.description.substring(0, 40) + '...' : book.description }}
                    </div>
                  </div>
                </td>
                <td>
                  <div v-if="book.authors && book.authors.length > 0">
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
                <td>
                  <span class="badge bg-info text-dark">
                    {{ book.categoryName || 'Chưa phân loại' }}
                  </span>
                </td>
                <td>
                  <span class="badge bg-secondary">
                    {{ book.supplierName || 'Chưa có nhà cung cấp' }}
                  </span>
                </td>
                <td>
                  <strong class="text-success">
                    {{ formatCurrency(book.price) }}
                  </strong>
                </td>
                <td>
                  <span 
                    :class="book.stockQuantity === 0 ? 'badge bg-danger' : (book.stockQuantity < 10 ? 'badge bg-warning text-dark' : 'text-dark')"
                  >
                    {{ book.stockQuantity }}
                  </span>
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
                  <div class="d-flex gap-1">
                    <EditButton @click="openEditModal(book, index)" />
                    <button
                      class="btn btn-outline-danger btn-sm"
                      @click="handleDeleteBook(book.id, index)"
                      title="Xóa sách"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>          </tbody>
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
                      {{ category.name }}
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
                <div class="col-md-4">
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
</template>

<script setup>
import EditButton from '@/components/common/EditButton.vue';
import Pagination from '@/components/common/Pagination.vue';
import AddButton from '@/components/common/AddButton.vue';
import StatusLabel from '@/components/common/StatusLabel.vue';
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { Modal } from 'bootstrap';
import { getBooks, createBook, updateBook, getAuthorsDropdown, getCategoriesDropdown, getSuppliersDropdown, toggleBookStatus, deleteBook } from '@/services/admin/book';
import { getPublishersDropdown } from '@/services/admin/publisher';
import Swal from 'sweetalert2';

// Search and filter states
const searchQuery = ref('');
const bookCodeFilter = ref('');
const selectedCategory = ref('');
const selectedSupplier = ref('');
const selectedPublisher = ref('');
const selectedStatus = ref('');
const minPrice = ref('');
const maxPrice = ref('');

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
  authorIds: [] // BẮT BUỘC - Danh sách ID tác giả
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

// Load authors, categories, suppliers and publishers data
const loadDropdownData = async () => {
  try {
    const [authorsResponse, categoriesResponse, suppliersResponse, publishersResponse] = await Promise.all([
      getAuthorsDropdown(),
      getCategoriesDropdown(),
      getSuppliersDropdown(),
      getPublishersDropdown()
    ]);
    
    authors.value = authorsResponse.data || [];
    categories.value = categoriesResponse.data || [];
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

// Modal functions
const openAddModal = () => {
  isEditMode.value = false;
  console.log('=== DEBUG: openAddModal called ===');
  console.log('isEditMode.value:', isEditMode.value);
  
  newBook.value = {
    id: '',
    bookName: '',
    description: '',
    price: '',
    stockQuantity: '',
    publicationDate: '',
    categoryId: '',
    supplierId: '',
    bookCode: '',
    status: 1,
    authorIds: [] // Reset authorIds
  };
  
  console.log('=== DEBUG: Opening Add Modal ===');
  
  const modalElement = document.getElementById('addBookModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const openEditModal = (book, index) => {
  isEditMode.value = true;
  editIndex.value = index;
  
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
    authorIds: book.authors ? book.authors.map(author => author.id) : [] // Map authors to authorIds
  };
  
  console.log('=== DEBUG: Opening Edit Modal ===');
  
  const modalElement = document.getElementById('addBookModal');
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
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

  try {
    // Prepare data for API
    const bookData = {
      bookName: newBook.value.bookName.trim(),
      description: newBook.value.description?.trim() || '',
      price: parseFloat(newBook.value.price),
      stockQuantity: parseInt(newBook.value.stockQuantity),
      publicationDate: newBook.value.publicationDate || null,
      categoryId: newBook.value.categoryId || null,
      supplierId: newBook.value.supplierId || null,
      bookCode: newBook.value.bookCode?.trim() || '',
      status: parseInt(newBook.value.status),
      authorIds: newBook.value.authorIds // 🔥 BẮT BUỘC - Thêm authorIds
    };

    console.log('=== DEBUG: Submitting book data ===');
    console.log('bookData:', bookData);

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
const handleDeleteBook = async (bookId, index) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa',
    text: 'Bạn có chắc chắn muốn xóa sách này không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  });

  if (result.isConfirmed) {
    try {
      await deleteBook(bookId);
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Xóa sách thành công',
        timer: 2000,
        timerProgressBar: true
      });
      await fetchBooks();
    } catch (error) {
      console.error('Lỗi khi xóa sách:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể xóa sách',
        timer: 2000,
        timerProgressBar: true
      });
    }
  }
};

// Filter functions
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
    authorIds: [] // Reset authorIds
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
    authorIds: randomAuthorIds // 🔥 BẮT BUỘC - Random authorIds
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
</script>

<style scoped>
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
  min-width: 1200px; /* Ensure table has minimum width for proper scrolling */
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
</style>
