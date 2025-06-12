<template>
  <div style="padding: 32px;">
    <div class="mb-3">
      <h6 class="text-muted">
        Quản lý / <strong>Chương trình Flashsale</strong>
      </h6>
    </div>  

    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 text-bg-secondary p-2 m-0 rounded-top" id="">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-4">
          <label class="form-label">Tên Flashsale:</label>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập tên Flashsale"
            v-model="searchQuery"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Không hoạt động</option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label">Từ ngày</label>
          <input
            type="date"
            class="form-control"
            v-model="startDate"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Đến ngày</label>
          <input
            type="date"
            class="form-control"
            v-model="endDate"
          />
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-between mt-5 mb-3">
      <h2 class="table-title m-0">Danh sách chương trình Flashsale</h2>
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
              <th>Tên Flashsale</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th>Trạng thái</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr v-for="(flash, index) in listFlashSale" :key="index">
              <td>{{ flash.id }}</td>
              <td>{{ flash.name }}</td>
              <td>{{ formatDateTime(flash.startTime) }}</td>
              <td>{{ formatDateTime(flash.endTime) }}</td>
              <td class="status-cell align-middle">
                <div class="d-flex align-items-center gap-2">
                  <label class="switch m-0">
                    <input
                      type="checkbox"
                      :checked="flash.status === 'Hoạt động'"
                      @change="toggleStatus(flash)"
                    />
                    <span class="slider round"></span>
                  </label>
                  <span
                    class="badge"
                    :class="
                      flash.status === 'Hoạt động'
                        ? 'bg-success-subtle text-success'
                        : 'bg-secondary-subtle text-secondary'
                    "
                    style="font-weight: 700; min-width: 130px; padding-top: 4%; height: 30px;"
                  >
                    {{ flash.status }}
                  </span>
                </div>
              </td>
              <td class="action-cell">
                <a class="btn btn-custom tooltip-custom" data-tooltip="Chi tiết" @click="viewFlashSaleDetail(flash)">
                  <i class="bi bi-info-circle fs-5"></i>
                </a>
                <a class="btn btn-custom tooltip-custom" data-tooltip="Thêm sản phẩm vào Flash Sale" @click="goToFlashSaleItem(flash)">
                  <i class="bi bi-bag-plus fs-5"></i>
                </a>
                <a class="btn btn-custom tooltip-custom" data-tooltip="Cập nhật" @click="editFlashSale(flash)">
                  <i class="bi bi-pencil fs-5"></i>
                </a>
                <a class="btn btn-custom tooltip-custom" data-tooltip="Xóa" @click="deleteFlashSale(flash)">
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
              <input type="text" class="form-control" :value="newFlashSale.id" readonly>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label required">Tên Flashsale</label>
            <input
              type="text"
              class="form-control"
              v-model="newFlashSale.name"
              :readonly="isDetailMode"
              placeholder="Nhập tên Flashsale"
            >
          </div>
          <div class="mb-3">
            <label class="form-label required">Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              class="form-control"
              v-model="newFlashSale.startTime"
              :readonly="isDetailMode"
            >
          </div>
          <div class="mb-3">
            <label class="form-label required">Thời gian kết thúc</label>
            <input
              type="datetime-local"
              class="form-control"
              v-model="newFlashSale.endTime"
              :readonly="isDetailMode"
            >
          </div>
          <div class="mb-3">
            <label class="form-label required">Trạng thái</label>
            <select class="form-select" v-model="newFlashSale.status" :disabled="isDetailMode">
              <option value="Hoạt động">Hoạt động</option>
              <option value="Không hoạt động">Không hoạt động</option>
            </select>
          </div>
          <div v-if="isDetailMode">
            <div class="mb-3">
              <label class="form-label">Ngày tạo</label>
              <input type="text" class="form-control" :value="newFlashSale.createdAt" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Ngày cập nhật</label>
              <input type="text" class="form-control" :value="newFlashSale.updatedAt" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Người tạo</label>
              <input type="text" class="form-control" :value="newFlashSale.createdBy" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Người cập nhật</label>
              <input type="text" class="form-control" :value="newFlashSale.updatedBy" readonly>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
          <button v-if="!isDetailMode" type="button" class="btn btn-primary" @click="saveFlashSale">{{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}</button>
        </div>
      </div>
    </div>

    <!-- Modal Chi Tiết Flashsale -->
    <div class="modal-overlay" v-if="showDetailModal" @click="closeDetailModalOnOutsideClick">
      <div class="modal-detail modal-detail-wide" @click.stop>
        <div class="modal-header">
          <h5>Chi tiết Flashsale</h5>
          <i class="bi bi-x-lg close-icon" @click="showDetailModal = false"></i>
        </div>
        <div class="modal-body-detail modal-body-detail-grid">
          <div class="detail-field">
            <label class="form-label">ID</label>
            <input type="text" class="form-control" :value="newFlashSale.id" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Tên Flashsale</label>
            <input type="text" class="form-control" :value="newFlashSale.name" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Thời gian bắt đầu</label>
            <input type="text" class="form-control" :value="newFlashSale.startTime" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Thời gian kết thúc</label>
            <input type="text" class="form-control" :value="newFlashSale.endTime" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Trạng thái</label>
            <input type="text" class="form-control" :value="newFlashSale.status" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Ngày tạo</label>
            <input type="text" class="form-control" :value="newFlashSale.createdAt" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Ngày cập nhật</label>
            <input type="text" class="form-control" :value="newFlashSale.updatedAt" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Người tạo</label>
            <input type="text" class="form-control" :value="newFlashSale.createdBy" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Người cập nhật</label>
            <input type="text" class="form-control" :value="newFlashSale.updatedBy" readonly>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const searchQuery = ref("");
const selectedStatus = ref("");
const startDate = ref("");
const endDate = ref("");
const showModal = ref(false);
const isEditMode = ref(false);
const isDetailMode = ref(false);
const showDetailModal = ref(false);

const newFlashSale = ref({
  name: '',
  startTime: '',
  endTime: '',
  status: 'Hoạt động'
});

const listFlashSale = ref([
  {
    id: 1,
    name: "Flash Sale tháng 6",
    startTime: "2024-06-01 08:00:00",
    endTime: "2024-06-01 20:00:00",
    status: "Hoạt động",
    createdAt: "2024-05-20 09:00:00",
    updatedAt: "2024-05-20 09:00:00",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: 2,
    name: "Flash Sale ngày đọc sách",
    startTime: "2024-06-21 09:00:00",
    endTime: "2024-06-21 21:00:00",
    status: "Hoạt động",
    createdAt: "2024-05-22 10:00:00",
    updatedAt: "2024-05-22 10:00:00",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: 3,
    name: "Flash Sale hè rực rỡ",
    startTime: "2024-06-10 10:00:00",
    endTime: "2024-06-10 22:00:00",
    status: "Không hoạt động",
    createdAt: "2024-05-25 11:00:00",
    updatedAt: "2024-05-25 11:00:00",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: 4,
    name: "Flash Sale cuối tuần",
    startTime: "2024-06-15 08:30:00",
    endTime: "2024-06-15 20:30:00",
    status: "Hoạt động",
    createdAt: "2024-05-28 12:00:00",
    updatedAt: "2024-05-28 12:00:00",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: 5,
    name: "Flash Sale sách thiếu nhi",
    startTime: "2024-06-20 09:30:00",
    endTime: "2024-06-20 21:30:00",
    status: "Không hoạt động",
    createdAt: "2024-05-30 13:00:00",
    updatedAt: "2024-05-30 13:00:00",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: 6,
    name: "Flash Sale sách ngoại ngữ",
    startTime: "2024-06-25 10:00:00",
    endTime: "2024-06-25 22:00:00",
    status: "Hoạt động",
    createdAt: "2024-06-01 14:00:00",
    updatedAt: "2024-06-01 14:00:00",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: 7,
    name: "Flash Sale sách kỹ năng",
    startTime: "2024-06-27 08:00:00",
    endTime: "2024-06-27 20:00:00",
    status: "Hoạt động",
    createdAt: "2024-06-03 15:00:00",
    updatedAt: "2024-06-03 15:00:00",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: 8,
    name: "Flash Sale sách tâm lý",
    startTime: "2024-06-29 09:00:00",
    endTime: "2024-06-29 21:00:00",
    status: "Không hoạt động",
    createdAt: "2024-06-05 16:00:00",
    updatedAt: "2024-06-05 16:00:00",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: 9,
    name: "Flash Sale sách công nghệ",
    startTime: "2024-06-30 10:00:00",
    endTime: "2024-06-30 22:00:00",
    status: "Hoạt động",
    createdAt: "2024-06-07 17:00:00",
    updatedAt: "2024-06-07 17:00:00",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: 10,
    name: "Flash Sale sách văn học",
    startTime: "2024-06-12 08:30:00",
    endTime: "2024-06-12 20:30:00",
    status: "Không hoạt động",
    createdAt: "2024-06-10 18:00:00",
    updatedAt: "2024-06-10 18:00:00",
    createdBy: "admin",
    updatedBy: "admin",
  },
]);

const router = useRouter();

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
  newFlashSale.value = {
    name: '',
    startTime: '',
    endTime: '',
    status: 'Hoạt động'
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
  newFlashSale.value = {
    id: flash.id,
    name: flash.name,
    startTime: formatDateTimeForInput(flash.startTime),
    endTime: formatDateTimeForInput(flash.endTime),
    status: flash.status,
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

const viewFlashSaleDetail = (flash) => {
  isEditMode.value = false;
  isDetailMode.value = true;
  newFlashSale.value = {
    id: flash.id,
    name: flash.name,
    startTime: formatDateTimeForInput(flash.startTime),
    endTime: formatDateTimeForInput(flash.endTime),
    status: flash.status,
    createdAt: flash.createdAt,
    updatedAt: flash.updatedAt,
    createdBy: flash.createdBy,
    updatedBy: flash.updatedBy
  };
  showDetailModal.value = true;
}

const goToFlashSaleItem = (flash) => {
  router.push(`/admin/flash-sale/${flash.id}/items`);
}

const closeDetailModalOnOutsideClick = (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    showDetailModal.value = false;
  }
}

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
  font-weight: bold;
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
