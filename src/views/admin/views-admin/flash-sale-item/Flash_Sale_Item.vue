<template>
  <div style="padding: 32px;">
    <div class="mb-3">
      <h6 class="text-muted">
        Quản lý / Chương trình Flashsale / <strong>Sản phẩm Flash Sale</strong>
      </h6>
    </div>  

    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 text-bg-secondary p-2 m-0 rounded-top" id="">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-6">
          <label class="form-label">Tên sách:</label>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập tên sách"
            v-model="searchQuery"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả</option>
            <option value="available">Còn hàng</option>
            <option value="out">Hết hàng</option>
          </select>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-between mt-5 mb-3">
      <h2 class="table-title m-0">Sản phẩm trong "Flashsale ngày đọc sách"</h2>
      <button @click="addFlashSale" class="custom-add-btn">
        <i class="bi bi-plus-circle me-2"></i> <span>Thêm mới</span>
      </button>
    </div>
    <div class="dashboard-container">
      <div class="dashboard-table">
        <table id="main-table" class="display">
          <thead>
            <tr class="text-center">
              <th>ID</th>
              <th>Tên sách</th>
              <th>Giá giảm</th>
              <th>% giảm</th>
              <th>Số lượng còn lại</th>
              <th>Giới hạn lượt mua/khách hàng</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr v-for="(item, index) in filteredList" :key="index">
              <td>{{ item.id }}</td>
              <td>{{ getBookName(item.bookId) }}</td>
              <td>{{ item.discountPrice }}</td>
              <td>{{ item.discountPercentage }}</td>
              <td>{{ item.stockQuantity }}</td>
              <td>{{ item.maxPurchasePerUser }}</td>
              <td class="action-cell">
                <a class="btn btn-custom tooltip-custom" data-tooltip="Chi tiết" @click="viewFlashSaleDetail(item)">
                  <i class="bi bi-info-circle fs-5"></i>
                </a>
                <a class="btn btn-custom tooltip-custom" data-tooltip="Cập nhật" @click="editFlashSale(item)">
                  <i class="bi bi-pencil fs-5"></i>
                </a>
                <a class="btn btn-custom tooltip-custom" data-tooltip="Xóa" @click="deleteFlashSale(item)">
                  <i class="bi bi-trash fs-5"></i>
                </a>
              </td>
            </tr>
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>


    </div>
    <Pagination
      :page-number="0"
      :total-pages="1"
      :is-last-page="isLastPage"
      :page-size="10"
      :items-per-page-options="[10, 20, 50, 100]"
      :total-elements="100"
      @prev="prevPage"
      @next="nextPage"
      @update:pageSize="val => pageSize = val"
    />

    <!-- Modal Popup for Add/Edit Flashsale -->
    <div class="modal-overlay" v-if="showModal" @click="closeModalOnOutsideClick">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h5>
            {{ isDetailMode ? 'Chi tiết Flashsale' : (isEditMode ? 'Cập nhật Flashsale' : 'Thêm Flashsale mới') }}
          </h5>
          <i
            class="bi bi-x-lg close-icon"
            @click="closeModal"
          ></i>
        </div>
        <div class="modal-body">
          <div v-if="isDetailMode">
            <div class="mb-3">
              <label class="form-label">ID</label>
              <input type="text" class="form-control" :value="newFlashSaleItem.id" readonly>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label required">Chọn sách</label>
            <select class="form-select" v-model="newFlashSaleItem.bookId" :disabled="isDetailMode">
              <option v-for="book in bookList" :key="book.id" :value="book.id">{{ book.name }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label required">Giá giảm</label>
            <input type="number" class="form-control" v-model="newFlashSaleItem.discountPrice" :readonly="isDetailMode" />
          </div>
          <div class="mb-3">
            <label class="form-label required">% giảm</label>
            <input type="number" class="form-control" v-model="newFlashSaleItem.discountPercentage" :readonly="isDetailMode" />
          </div>
          <div class="mb-3">
            <label class="form-label required">Số lượng</label>
            <input type="number" class="form-control" v-model="newFlashSaleItem.stockQuantity" :readonly="isDetailMode" />
          </div>
          <div class="mb-3">
            <label class="form-label required">Giới hạn mua/khách</label>
            <input type="number" class="form-control" v-model="newFlashSaleItem.maxPurchasePerUser" :readonly="isDetailMode" />
          </div>
          <div v-if="isDetailMode">
            <div class="mb-3">
              <label class="form-label">Ngày tạo</label>
              <input type="text" class="form-control" :value="newFlashSaleItem.createdAt" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Ngày cập nhật</label>
              <input type="text" class="form-control" :value="newFlashSaleItem.updatedAt" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Người tạo</label>
              <input type="text" class="form-control" :value="newFlashSaleItem.createdBy" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Người cập nhật</label>
              <input type="text" class="form-control" :value="newFlashSaleItem.updatedBy" readonly>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
          <button v-if="!isDetailMode" type="button" class="btn btn-primary" @click="saveFlashSale">{{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}</button>
        </div>
      </div>
    </div>

    <!-- Modal Chi Tiết Flashsale Item -->
    <div class="modal-overlay" v-if="showDetailModal" @click="closeDetailModalOnOutsideClick">
      <div class="modal-detail modal-detail-wide" @click.stop>
        <div class="modal-header">
          <h5>Chi tiết sản phẩm Flashsale</h5>
          <i class="bi bi-x-lg close-icon" @click="showDetailModal = false"></i>
        </div>
        <div class="modal-body-detail modal-body-detail-grid">
          <div class="detail-field">
            <label class="form-label">ID</label>
            <input type="text" class="form-control" :value="newFlashSaleItem.id" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Tên sách</label>
            <input type="text" class="form-control" :value="getBookName(newFlashSaleItem.bookId)" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Giá giảm</label>
            <input type="text" class="form-control" :value="newFlashSaleItem.discountPrice" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">% giảm</label>
            <input type="text" class="form-control" :value="newFlashSaleItem.discountPercentage" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Số lượng</label>
            <input type="text" class="form-control" :value="newFlashSaleItem.stockQuantity" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Giới hạn mua/khách</label>
            <input type="text" class="form-control" :value="newFlashSaleItem.maxPurchasePerUser" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Ngày tạo</label>
            <input type="text" class="form-control" :value="newFlashSaleItem.createdAt" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Ngày cập nhật</label>
            <input type="text" class="form-control" :value="newFlashSaleItem.updatedAt" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Người tạo</label>
            <input type="text" class="form-control" :value="newFlashSaleItem.createdBy" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Người cập nhật</label>
            <input type="text" class="form-control" :value="newFlashSaleItem.updatedBy" readonly>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showDetailModal = false">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Pagination from '@/components/common/Pagination.vue';
import { showToast } from '@/utils/swalHelper';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const flashSaleId = Number(route.params.id);

const searchQuery = ref("");
const selectedStatus = ref("");
const startDate = ref("");
const endDate = ref("");
const showModal = ref(false);
const isEditMode = ref(false);
const isDetailMode = ref(false);
const showDetailModal = ref(false);

const newFlashSaleItem = ref({
  bookId: '',
  discountPrice: '',
  discountPercentage: '',
  stockQuantity: '',
  maxPurchasePerUser: '',
  createdAt: '',
  updatedAt: '',
  createdBy: '',
  updatedBy: ''
});

const bookList = ref([
  { id: 1, name: 'Đắc Nhân Tâm' },
  { id: 2, name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu' },
  { id: 3, name: 'Nhà Giả Kim' },
  { id: 4, name: 'Bí Mật Của May Mắn' },
  { id: 5, name: 'Totto-chan Bên Cửa Sổ' },
  { id: 6, name: 'Không Gia Đình' },
  { id: 7, name: 'Harry Potter' },
  { id: 8, name: 'Sherlock Holmes' },
  { id: 9, name: 'Dế Mèn Phiêu Lưu Ký' },
  { id: 10, name: 'Sapiens: Lược Sử Loài Người' },
]);

const listFlashSaleItem = ref([
  {
    id: 1,
    flashSaleId: 1,
    bookId: 1,
    discountPrice: 50000,
    discountPercentage: 20,
    stockQuantity: 100,
    maxPurchasePerUser: 2,
    createdAt: '2024-06-01 08:00:00',
    updatedAt: '2024-06-01 08:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 2,
    flashSaleId: 1,
    bookId: 2,
    discountPrice: 60000,
    discountPercentage: 15,
    stockQuantity: 80,
    maxPurchasePerUser: 1,
    createdAt: '2024-06-01 08:00:00',
    updatedAt: '2024-06-01 08:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 11,
    flashSaleId: 1,
    bookId: 3,
    discountPrice: 70000,
    discountPercentage: 10,
    stockQuantity: 60,
    maxPurchasePerUser: 2,
    createdAt: '2024-06-01 09:00:00',
    updatedAt: '2024-06-01 09:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 12,
    flashSaleId: 1,
    bookId: 4,
    discountPrice: 80000,
    discountPercentage: 25,
    stockQuantity: 50,
    maxPurchasePerUser: 3,
    createdAt: '2024-06-01 09:30:00',
    updatedAt: '2024-06-01 09:30:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 13,
    flashSaleId: 1,
    bookId: 5,
    discountPrice: 90000,
    discountPercentage: 30,
    stockQuantity: 40,
    maxPurchasePerUser: 1,
    createdAt: '2024-06-01 10:00:00',
    updatedAt: '2024-06-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 14,
    flashSaleId: 1,
    bookId: 6,
    discountPrice: 100000,
    discountPercentage: 5,
    stockQuantity: 30,
    maxPurchasePerUser: 2,
    createdAt: '2024-06-01 10:30:00',
    updatedAt: '2024-06-01 10:30:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 15,
    flashSaleId: 1,
    bookId: 7,
    discountPrice: 110000,
    discountPercentage: 12,
    stockQuantity: 20,
    maxPurchasePerUser: 1,
    createdAt: '2024-06-01 11:00:00',
    updatedAt: '2024-06-01 11:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 16,
    flashSaleId: 1,
    bookId: 8,
    discountPrice: 120000,
    discountPercentage: 18,
    stockQuantity: 10,
    maxPurchasePerUser: 2,
    createdAt: '2024-06-01 11:30:00',
    updatedAt: '2024-06-01 11:30:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 17,
    flashSaleId: 1,
    bookId: 9,
    discountPrice: 130000,
    discountPercentage: 22,
    stockQuantity: 15,
    maxPurchasePerUser: 1,
    createdAt: '2024-06-01 12:00:00',
    updatedAt: '2024-06-01 12:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 18,
    flashSaleId: 1,
    bookId: 10,
    discountPrice: 140000,
    discountPercentage: 8,
    stockQuantity: 12,
    maxPurchasePerUser: 2,
    createdAt: '2024-06-01 12:30:00',
    updatedAt: '2024-06-01 12:30:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 3,
    flashSaleId: 2,
    bookId: 3,
    discountPrice: 70000,
    discountPercentage: 10,
    stockQuantity: 50,
    maxPurchasePerUser: 3,
    createdAt: '2024-06-02 09:00:00',
    updatedAt: '2024-06-02 09:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 4,
    flashSaleId: 2,
    bookId: 4,
    discountPrice: 80000,
    discountPercentage: 25,
    stockQuantity: 60,
    maxPurchasePerUser: 2,
    createdAt: '2024-06-02 09:00:00',
    updatedAt: '2024-06-02 09:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 5,
    flashSaleId: 3,
    bookId: 5,
    discountPrice: 90000,
    discountPercentage: 30,
    stockQuantity: 40,
    maxPurchasePerUser: 1,
    createdAt: '2024-06-03 10:00:00',
    updatedAt: '2024-06-03 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 6,
    flashSaleId: 3,
    bookId: 6,
    discountPrice: 100000,
    discountPercentage: 5,
    stockQuantity: 30,
    maxPurchasePerUser: 2,
    createdAt: '2024-06-03 10:00:00',
    updatedAt: '2024-06-03 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 7,
    flashSaleId: 4,
    bookId: 7,
    discountPrice: 110000,
    discountPercentage: 12,
    stockQuantity: 20,
    maxPurchasePerUser: 1,
    createdAt: '2024-06-04 11:00:00',
    updatedAt: '2024-06-04 11:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 8,
    flashSaleId: 4,
    bookId: 8,
    discountPrice: 120000,
    discountPercentage: 18,
    stockQuantity: 10,
    maxPurchasePerUser: 2,
    createdAt: '2024-06-04 11:00:00',
    updatedAt: '2024-06-04 11:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 9,
    flashSaleId: 5,
    bookId: 9,
    discountPrice: 130000,
    discountPercentage: 22,
    stockQuantity: 15,
    maxPurchasePerUser: 1,
    createdAt: '2024-06-05 12:00:00',
    updatedAt: '2024-06-05 12:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 10,
    flashSaleId: 5,
    bookId: 10,
    discountPrice: 140000,
    discountPercentage: 8,
    stockQuantity: 12,
    maxPurchasePerUser: 2,
    createdAt: '2024-06-05 12:00:00',
    updatedAt: '2024-06-05 12:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
]);

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  return date
    .toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

const toggleStatus = (flash) => {
  flash.status = flash.status === "Hoạt động" ? "Không hoạt động" : "Hoạt động";
}

const addFlashSale = () => {
  isEditMode.value = false;
  isDetailMode.value = false;
  newFlashSaleItem.value = {
    bookId: '',
    discountPrice: '',
    discountPercentage: '',
    stockQuantity: '',
    maxPurchasePerUser: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  };
  showModal.value = true;
}

const closeModal = () => {
  showModal.value = false;
}

const closeModalOnOutsideClick = (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    closeModal();
  }
}

const saveFlashSale = () => {
  // Xử lý logic lưu Flashsale ở đây
  if (isEditMode.value) {
    showToast('success', 'Cập nhật Flashsale thành công');
  } else {
    showToast('success', 'Thêm Flashsale thành công');
  }
  closeModal();
}

const editFlashSale = (flash) => {
  isEditMode.value = true;
  isDetailMode.value = false;
  newFlashSaleItem.value = {
    id: flash.id,
    bookId: flash.bookId,
    discountPrice: flash.discountPrice,
    discountPercentage: flash.discountPercentage,
    stockQuantity: flash.stockQuantity,
    maxPurchasePerUser: flash.maxPurchasePerUser,
    createdAt: flash.createdAt,
    updatedAt: flash.updatedAt,
    createdBy: flash.createdBy,
    updatedBy: flash.updatedBy
  };
  showModal.value = true;
}

const formatDateTimeForInput = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
}

const deleteFlashSale = (flash) => {
  // Xử lý logic xóa Flashsale ở đây
  showToast('success', 'Xóa Flashsale thành công');
}

const viewFlashSaleDetail = (item) => {
  isEditMode.value = false;
  isDetailMode.value = true;
  newFlashSaleItem.value = { ...item };
  showDetailModal.value = true;
}

const getBookName = (bookId) => {
  const book = bookList.value.find(b => b.id === bookId);
  return book ? book.name : '';
};

const getFlashSaleName = (flashSaleId) => {
  return `Flash Sale #${flashSaleId}`;
};

const flashSaleName = getFlashSaleName(flashSaleId);

const closeDetailModalOnOutsideClick = (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    showDetailModal.value = false;
  }
}

const filteredList = computed(() => {
  return listFlashSaleItem.value.filter(i =>
    i.flashSaleId === flashSaleId &&
    (!searchQuery.value || getBookName(i.bookId).toLowerCase().includes(searchQuery.value.toLowerCase())) &&
    (!selectedStatus.value ||
      (selectedStatus.value === 'available' && i.stockQuantity > 0) ||
      (selectedStatus.value === 'out' && i.stockQuantity <= 0))
  );
});
</script>

<style>
.custom-add-btn {
  background-color: #196f3d;
  color: #fff;
  font-weight: bold;
  border: none;
  height: 50px;
  padding: 0 20px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.custom-add-btn:hover {
  background-color: #2ecc71;
  color: white;
}

.action-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  margin-right: 0;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #28a745;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.tooltip-custom {
  position: relative;
  cursor: pointer;
}

.tooltip-custom::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 100;
}

.tooltip-custom::before {
  content: "";
  position: absolute;
  bottom: 115%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #333;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tooltip-custom:hover::after,
.tooltip-custom:hover::before {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}

.btn-custom {
  background-color: #ebebeb;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h5 {
  margin: 0;
  font-weight: bold;
}

.close-icon {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #e9ecef;
}

.required::after {
  content: "*";
  color: red;
  margin-left: 4px;
}

.table-title {
  font-size: 2rem;
  /* font-weight: bold; */
  color: #ff2727;
}

.modal-detail {
  background-color: white;
  border-radius: 8px;
  width: 700px;
  max-width: 98vw;
  max-height: 90vh;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}
.modal-body-detail {
  padding: 1.5rem;
  max-height: 65vh;
  overflow-y: auto;
}

/* Style cho modal-detail-wide và grid */
.modal-detail-wide {
  width: 900px;
}
.modal-body-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
  padding: 2rem;
}
.detail-field {
  display: flex;
  flex-direction: column;
}
</style>
