<template>
  <div class="container-fluid py-4">
    <!-- ========== BỘ LỌC FLASH SALE ITEM ========== -->
    <div class="card mb-5 shadow-lg border-0 filter-card">
      <div class="card-header bg-light border-0 py-3">
        <h5 class="mb-0 text-secondary">
          <i class="bi bi-funnel me-2"></i>
          Bộ lọc tìm kiếm
        </h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <!-- <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-lightning-charge me-1"></i>
              FlashSale ID
            </label>
            <input type="number" class="form-control" v-model="filter.flashSaleId" placeholder="FlashSale ID" />
          </div> -->
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-book me-1"></i>
              Book ID
            </label>
            <input type="number" class="form-control" v-model="filter.bookId" placeholder="Book ID" />
          </div>
          <div class="col-md-2">
            <label class="form-label">
              <i class="bi bi-toggle-on me-1"></i>
              Trạng thái
            </label>
            <select class="form-select" v-model="filter.status">
              <option value="">Tất cả</option>
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Giá giảm tối thiểu</label>
            <input type="number" class="form-control" v-model="filter.minPrice" placeholder="Min price" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Giá giảm tối đa</label>
            <input type="number" class="form-control" v-model="filter.maxPrice" placeholder="Max price" />
          </div>
          <div class="col-md-2">
            <label class="form-label">% giảm tối thiểu</label>
            <input type="number" class="form-control" v-model="filter.minPercent" placeholder="Min %" />
          </div>
          <div class="col-md-2">
            <label class="form-label">% giảm tối đa</label>
            <input type="number" class="form-control" v-model="filter.maxPercent" placeholder="Max %" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Tồn kho tối thiểu</label>
            <input type="number" class="form-control" v-model="filter.minQuantity" placeholder="Min qty" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Tồn kho tối đa</label>
            <input type="number" class="form-control" v-model="filter.maxQuantity" placeholder="Max qty" />
          </div>
        </div>
        <div class="row g-3 pt-3 d-flex justify-content-center">
          <div class="col-md-1">
            <button class="btn btn-outline-success w-100 me-2" @click="searchWithFilter">
              <i class="bi bi-funnel"></i> Lọc
            </button>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle me-1"></i> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================== BẢNG FLASH SALE ITEM ================== -->
    <div class="card shadow-lg border-0 mb-4 flashsale-table-card">
      <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
        <div>
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-list-ul me-2"></i>
            Danh sách sản phẩm trong {{ flashSaleName || 'Flash Sale' }}
          </h5>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-info btn-sm py-2" @click="reloadPage" :disabled="loading">
            <i class="bi bi-arrow-repeat me-1"></i> Làm mới
          </button>
          <button class="btn btn-primary btn-sm py-2" style="background-color: #33304e; border-color: #33304e;" @click="openAddForm">
            <i class="bi bi-plus-circle me-1"></i> Thêm mới
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
        </div>
        <!-- Error -->
        <div v-else-if="error" class="alert alert-danger m-4" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ error }}
          <button class="btn btn-sm btn-outline-danger ms-2" @click="getDataFromApi(currentPage, pageSize)">Thử lại</button>
        </div>
        <!-- Table -->
        <div v-else>
          <table class="table align-middle table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 40px">#</th>
                <th>Sách</th>
                <th>Giá giảm</th>
                <th>% Giảm</th>
                <th>Tồn kho</th>
                <th>Giới hạn/người</th>
                <th style="width: 200px">Trạng thái</th>
                <th style="width: 120px">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="items.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-for="(item, index) in items" :key="item.id">
                <td class="py-3">{{ currentPage * pageSize + index + 1 }}</td>
                <td class="py-3">{{ item.bookName }}</td>
                <td class="py-3">{{ formatCurrency(item.discountPrice) }}</td>
                <td class="py-3">{{ item.discountPercentage }}%</td>
                <td class="py-3">{{ item.stockQuantity }}</td>
                <td class="py-3">{{ item.maxPurchasePerUser }}</td>
                <td class="py-3">
                  <ToggleStatus :id="item.id" v-model="item.status" :true-value="1" :false-value="0" active-text="Hoạt động" inactive-text="Không hoạt động" @change="handleStatusChange(item)" />
                </td>
                <td class="py-3">
                  <EditButton @click="openEditForm(item)" />
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
    <!-- ================== HẾT BẢNG ================== -->

    <!-- Modal Thêm/Sửa Item -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true" style="z-index: 10000;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalLabel">{{ isEditMode ? 'Chỉnh sửa' : 'Thêm mới' }}</h5>
            <button type="button" class="custom-close-btn" @click="closeModal"><i class="bx bx-x-circle"></i></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitForm">
              <div class="mb-3">
                <label class="form-label">Book ID <span class="text-danger">*</span></label>
                <input type="number" class="form-control" v-model="formData.bookId" required :disabled="isEditMode" />
              </div>
              <div class="mb-3">
                <label class="form-label">Giá giảm <span class="text-danger">*</span></label>
                <input type="number" step="0.01" class="form-control" v-model="formData.discountPrice" required />
              </div>
              <div class="mb-3">
                <label class="form-label">% Giảm <span class="text-danger">*</span></label>
                <input type="number" step="0.01" class="form-control" v-model="formData.discountPercentage" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Tồn kho <span class="text-danger">*</span></label>
                <input type="number" class="form-control" v-model="formData.stockQuantity" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Giới hạn mỗi người <span class="text-danger">*</span></label>
                <input type="number" class="form-control" v-model="formData.maxPurchasePerUser" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" v-model="formData.status">
                  <option :value="1">Hoạt động</option>
                  <option :value="0">Không hoạt động</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="handleSubmitForm">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { showToast } from '@/utils/swalHelper.js';
import EditButton from '@/components/common/EditButton.vue';
import Pagination from '@/components/common/Pagination.vue';
import ToggleStatus from '@/components/common/ToggleStatus.vue';
import {
  getAllFlashSaleItem,
  addFlashSaleItem,
  updateFlashSaleItem,
  toggleStatusFlashSaleItem
} from '@/services/admin/flashSaleItem.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const defaultFlashSaleId = route.params.id ? parseInt(route.params.id) : '';

// Filter object
const filter = ref({
  flashSaleId: defaultFlashSaleId,
  bookId: '',
  status: '',
  minPrice: '',
  maxPrice: '',
  minPercent: '',
  maxPercent: '',
  minQuantity: '',
  maxQuantity: ''
});

const items = ref([]);
const flashSaleName = ref('');

// Pagination
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);

const loading = ref(false);
const error = ref(null);

const isEditMode = ref(false);
const formData = ref({
  id: '',
  bookId: '',
  discountPrice: '',
  discountPercentage: '',
  stockQuantity: '',
  maxPurchasePerUser: '',
  status: 1
});

// Helper: currency
function formatCurrency(value) {
  if (value === null || value === undefined) return '';
  return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// API
const getDataFromApi = async (page, size) => {
  loading.value = true;
  error.value = null;
  try {
    const params = { page, size };
    Object.entries(filter.value).forEach(([key, val]) => {
      if (val !== '' && val !== null && val !== undefined) params[key] = val;
    });
    const res = await getAllFlashSaleItem(defaultFlashSaleId, params);
    const resData = res.data.data;
    if (res && res.status === 200 && resData) {
      items.value = resData.content;
      currentPage.value = resData.pageNumber;
      pageSize.value = resData.pageSize;
      totalElements.value = resData.totalElements;
      totalPages.value = resData.totalPages;
      isLastPage.value = currentPage.value >= totalPages.value - 1;
      if (resData.content && resData.content.length > 0) {
        flashSaleName.value = resData.content[0].flashSaleName || '';
      }
    } else {
      items.value = [];
      totalElements.value = 0;
      totalPages.value = 1;
      isLastPage.value = true;
    }
  } catch (err) {
    error.value = 'Lỗi khi tải dữ liệu!';
    items.value = [];
  } finally {
    loading.value = false;
  }
};

// Filter actions
const searchWithFilter = () => {
  getDataFromApi(0, pageSize.value);
};
const clearFilters = () => {
  filter.value = {
    flashSaleId: defaultFlashSaleId,
    bookId: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    minPercent: '',
    maxPercent: '',
    minQuantity: '',
    maxQuantity: ''
  };
  getDataFromApi(0, pageSize.value);
};

// Reload
const reloadPage = () => {
  getDataFromApi(currentPage.value, pageSize.value);
};

// Toggle status
const handleStatusChange = async (item) => {
  try {
    await toggleStatusFlashSaleItem(defaultFlashSaleId, item.id);
    showToast('success', 'Thay đổi trạng thái thành công!');
  } catch (error) {
    showToast('error', error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

// Modal actions
const openAddForm = () => {
  isEditMode.value = false;
  resetFormData();
  const modal = Modal.getOrCreateInstance(document.getElementById('formModal'));
  modal.show();
};

const openEditForm = (item) => {
  isEditMode.value = true;
  formData.value = {
    id: item.id,
    bookId: item.bookId,
    discountPrice: item.discountPrice,
    discountPercentage: item.discountPercentage,
    stockQuantity: item.stockQuantity,
    maxPurchasePerUser: item.maxPurchasePerUser,
    status: item.status
  };
  const modal = Modal.getOrCreateInstance(document.getElementById('formModal'));
  modal.show();
};

const validateForm = () => {
  const f = formData.value;
  if (!f.bookId || !f.discountPrice || !f.discountPercentage || !f.stockQuantity || !f.maxPurchasePerUser) {
    showToast('error', 'Vui lòng nhập đầy đủ thông tin!');
    return false;
  }
  if (f.discountPercentage < 0 || f.discountPercentage > 100) {
    showToast('error', 'Phần trăm giảm giá phải từ 0-100');
    return false;
  }
  return true;
};

const handleSubmitForm = async () => {
  try {
    if (!validateForm()) return;
    const submitData = {
      flashSaleId: defaultFlashSaleId,
      bookId: parseInt(formData.value.bookId),
      discountPrice: parseFloat(formData.value.discountPrice),
      discountPercentage: parseFloat(formData.value.discountPercentage),
      stockQuantity: parseInt(formData.value.stockQuantity),
      maxPurchasePerUser: parseInt(formData.value.maxPurchasePerUser),
      status: parseInt(formData.value.status)
    };
    if (!isEditMode.value) {
      await addFlashSaleItem(defaultFlashSaleId, submitData);
      showToast('success', 'Thêm mới thành công!');
    } else {
      await updateFlashSaleItem(defaultFlashSaleId, formData.value.id, submitData);
      showToast('success', 'Cập nhật thành công!');
    }
    closeModal();
    await getDataFromApi(currentPage.value, pageSize.value);
  } catch (error) {
    showToast('error', error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

const closeModal = () => {
  const modal = Modal.getOrCreateInstance(document.getElementById('formModal'));
  modal.hide();
};

const handlePrev = () => {
  if (currentPage.value > 0) getDataFromApi(currentPage.value - 1, pageSize.value);
};
const handleNext = () => {
  if (!isLastPage.value) getDataFromApi(currentPage.value + 1, pageSize.value);
};
const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  getDataFromApi(0, newSize);
};

const resetFormData = () => {
  formData.value = {
    id: '',
    bookId: '',
    discountPrice: '',
    discountPercentage: '',
    stockQuantity: '',
    maxPurchasePerUser: '',
    status: 1
  };
};

onMounted(() => {
  getDataFromApi(currentPage.value, pageSize.value);
});
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.modal-dialog {
  max-width: 650px !important;
}

.modal-content {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: none;
}

.modal-header {
  border-bottom: 2px solid #ecae9e;
  border-radius: 15px 15px 0 0;
  padding: 0.8rem 1.2rem;
  position: relative;
}

.modal-title {
  font-weight: 600;
  color: #2c2c54;
  font-size: 1.1rem;
}

.custom-close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.filter-card,
.flashsale-table-card {
  border-radius: 0.8rem !important;
  overflow: hidden;
}
</style>