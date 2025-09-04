<template>
  <div class="admin-page container-fluid py-4">
    <!-- ========== THỐNG KÊ TỔNG QUAN VOUCHER ========== -->
    <OverviewStatsComponent :stats="stats" />

    <!-- ========== BỘ LỌC VOUCHER ========== -->
    <div class="card mb-5 shadow-lg border-0 filter-card">
      <div class="card-header bg-light border-0 py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-funnel me-2"></i>
            Bộ lọc tìm kiếm
          </h5>
          <button
            class="btn btn-sm btn-outline-secondary"
            type="button"
            @click="handleToggleFilter"
            :aria-expanded="showFilter"
          >
            <i
              :class="showFilter ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"
            ></i>
            {{ showFilter ? "Thu gọn" : "Mở rộng" }}
          </button>
        </div>
      </div>
      <div
        class="card-body filter-collapse"
        :class="{ 'filter-collapsed': !showFilter }"
      >
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-search me-1"></i>
              Tìm kiếm mã voucher
            </label>
            <input
              type="text"
              class="form-control"
              placeholder="Nhập mã voucher..."
              v-model="searchQuery"
            />
          </div>
          <!-- ✅ BỎ dropdown trạng thái -->
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-card-text me-1"></i>
              Tên voucher
            </label>
            <input
              type="text"
              class="form-control"
              placeholder="Nhập tên voucher..."
              v-model="nameFilter"
            />
          </div>
                     <div class="col-md-6">
             <label class="form-label">
               <i class="bi bi-tag me-1"></i>
               Danh mục voucher
             </label>
             <select
               class="form-select"
               v-model="voucherCategoryFilter"
             >
               <option value="">Tất cả danh mục</option>
               <option value="NORMAL">Giảm giá sản phẩm</option>
               <option value="SHIPPING">Giảm phí vận chuyển</option>
             </select>
           </div>
           <div class="col-md-6">
             <label class="form-label">
               <i class="bi bi-percent me-1"></i>
               Cách tính giảm
             </label>
             <select
               class="form-select"
               v-model="discountTypeFilter"
             >
               <option value="">Tất cả cách tính</option>
               <option value="PERCENTAGE">Phần trăm</option>
               <option value="FIXED_AMOUNT">Số tiền</option>
             </select>
           </div>
        </div>
        <div class="row g-3 pt-3 d-flex justify-content-center">
          <div class="col-md-1">
            <button class="btn btn-success w-100 me-2" @click="handleApplyFilter">
              <i class="bi bi-funnel"></i> Lọc
            </button>
          </div>
          <div class="col-md-2">
            <button class="btn btn-secondary w-100" @click="handleClearFilter">
              <i class="bi bi-x-circle me-1"></i> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================== BẢNG DANH SÁCH VOUCHER ================== -->
    <div class="card shadow-lg border-0 mb-4 admin-table-card">
      <div
        class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3"
      >
        <div>
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-ticket-perforated me-2"></i>
            Danh sách voucher
          </h5>
        </div>
        <div class="d-flex gap-2">
          <button
            class="btn btn-outline-info btn-sm py-2"
            @click="handleFetchVouchers"
            :disabled="loading"
          >
            <i class="bi bi-arrow-repeat me-1"></i> Làm mới
          </button>
          
          <!-- Nút Export Excel -->
          <ExcelExportButton 
            data-type="vouchers"
            button-text="Xuất Excel"
          />
          
          <button
            class="btn btn-primary btn-sm py-2"
            style="background-color: #33304e; border-color: #33304e"
            @click="handleOpenAddVoucher"
          >
            <i class="bi bi-plus-circle me-1"></i> Thêm mới
          </button>
        </div>
      </div>
      <div class="card-body p-0 position-relative">
        <!-- Loading overlay -->
        <div class="loading-overlay" :class="{ show: loading }">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p>Đang tải dữ liệu...</p>
        </div>

        <!-- Data table -->
        <div v-if="!loading">
          <table class="table align-middle table-hover mb-0">
            <thead>
              <tr>
                <th style="width: 40px">STT</th>
                <th style="width: 120px">Thao tác</th>
                <th style="width: 180px">MÃ VOUCHER</th>
                <th style="width: 250px">TÊN VOUCHER</th>
                <th style="width: 150px">NGÀY BẮT ĐẦU</th>
                <th style="width: 150px">NGÀY KẾT THÚC</th>
                <th style="width: 120px">LƯỢT DÙNG</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="listVoucher.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr
                v-else
                v-for="(voucher, index) in listVoucher"
                :key="voucher.id"
                class="align-middle"
              >
                <td class="py-3">{{ currentPage * pageSize + index + 1 }}</td>
                <td class="py-3">
                  <div class="d-flex gap-2">
                    <span class="tooltip-wrapper">
                      <button
                        class="btn btn-sm btn-outline-secondary"
                        @click="handleShowDetail(voucher)"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <span class="tooltip-bubble">Xem chi tiết</span>
                    </span>
                    <span class="tooltip-wrapper">
                      <EditButton
                        :tooltip="'Cập nhật voucher ' + voucher.code"
                        @click="handleOpenEditVoucher(voucher)"
                      />
                      <span class="tooltip-bubble">Chỉnh sửa</span>
                    </span>
                  </div>
                </td>
                <td class="py-3 fw-bold">
                  <router-link
                    :to="`/admin/userVoucher/${voucher.id}`"
                    class="text-decoration-none"
                  >
                    {{ voucher.code }}
                  </router-link>
                </td>
                <td class="py-3">
                  <div class="voucher-name-cell">
                    <span class="voucher-name" :title="voucher.name">
                      {{ voucher.name || "Chưa có tên" }}
                    </span>
                    <small
                      class="text-muted d-block mt-1"
                      v-if="voucher.voucherCategory"
                    >
                                             {{
                         voucher.voucherCategory === "NORMAL"
                           ? "Giảm giá sản phẩm"
                           : voucher.voucherCategory === "SHIPPING"
                           ? "Giảm phí vận chuyển"
                           : voucher.voucherCategory
                       }}
                    </small>
                  </div>
                </td>
                <!-- <td class="py-3">{{ voucher.start_time }}</td> -->
                <td class="py-3">
                  <span class="fw-bold">{{ voucher.startHour }}</span>
                  <br />
                  <small class="text-muted">{{ toDate1(voucher.startTime) }}</small>
                </td>
                <td class="py-3">
                  <span class="fw-bold">{{ voucher.endHour }}</span>
                  <br />
                  <small class="text-muted">{{ toDate1(voucher.endTime) }}</small>
                </td>
                <!-- ✅ BỎ cột trạng thái với ToggleStatus -->
                <td class="py-3">
                  <span
                    v-if="voucher.soLanDungConLai > 0"
                    class="badge bg-success"
                  >
                    {{ voucher.soLanDungConLai }}
                  </span>
                  <span v-else class="badge bg-danger">Hết lượt</span>
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
            @prev="handlePrevPage"
            @next="handleNextPage"
            @update:pageSize="handlePageSizeChange"
          />
        </div>
      </div>
    </div>

    <!-- Modal Thêm/Cập nhật Voucher -->
    <div
      v-if="showFormModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
    >
      <div class="modal-dialog modal-dialog-centered form-modal-dialog">
        <div class="modal-content">
          <div class="modal-header form-modal-header">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>
              {{ isEdit ? "Cập nhật voucher" : "Thêm voucher mới" }}
            </h5>
            <button
              type="button"
              class="custom-close-btn"
              @click="handleCloseFormModal"
              aria-label="Đóng"
              title="Đóng"
            >
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <div class="modal-body form-modal-body">
            <form @submit.prevent="handleSubmitVoucher">
              <div class="row">
                                 <div class="mb-2 col-6">
                   <label class="form-label">
                     Mã voucher <span style="color: red">*</span>
                     <small v-if="isEdit" class="text-muted ms-2"
                       >(Không thể thay đổi)</small
                     >
                   </label>
                   <input
                     v-model="formVoucher.code"
                     class="form-control"
                     :class="{ 'bg-light': isEdit }"
                     :disabled="isEdit"
                     placeholder="Nhập mã voucher"
                     required
                     pattern="^[A-Za-z0-9]{1,20}$"
                     maxlength="20"
                   />
                   <div v-if="isEdit" class="form-text text-warning">
                     <i class="bi bi-exclamation-triangle me-1"></i>
                     Mã voucher không thể thay đổi sau khi tạo
                   </div>
                 </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    Tên voucher <span style="color: red">*</span>
                  </label>
                  <input
                    v-model="formVoucher.name"
                    class="form-control"
                    placeholder="Nhập tên voucher"
                    required
                    maxlength="50"
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    Loại voucher <span style="color: red">*</span>
                    <small v-if="isEdit" class="text-muted ms-2"
                      >(Không thể thay đổi)</small
                    >
                  </label>
                  <select
                    v-model="formVoucher.voucherCategory"
                    class="form-select"
                    :class="{ 'bg-light': isEdit }"
                    :disabled="isEdit"
                    required
                  >
                    <option value="">Chọn loại voucher</option>
                                         <option value="NORMAL">Giảm giá sản phẩm</option>
                     <option value="SHIPPING">Giảm phí vận chuyển</option>
                  </select>
                  <div v-if="isEdit" class="form-text text-warning">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    Loại voucher không thể thay đổi sau khi tạo
                  </div>
                </div>
                                 <div class="mb-2 col-6">
                   <label class="form-label">
                     Kiểu giảm giá <span style="color: red">*</span>
                     <small v-if="isEdit" class="text-muted ms-2"
                       >(Không thể thay đổi)</small
                     >
                   </label>
                   <select
                     v-model="formVoucher.discountType"
                     class="form-select"
                     :class="{ 'bg-light': isEdit }"
                     :disabled="isEdit"
                     required
                   >
                     <option value="">Chọn kiểu giảm giá</option>
                     <option
                       value="PERCENTAGE"
                       v-if="formVoucher.voucherCategory === 'NORMAL'"
                     >
                       Phần trăm
                     </option>
                     <option value="FIXED_AMOUNT">Số tiền</option>
                   </select>
                   <div v-if="isEdit" class="form-text text-warning">
                     <i class="bi bi-exclamation-triangle me-1"></i>
                     Kiểu giảm giá không thể thay đổi sau khi tạo
                   </div>
                 </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Phần trăm giảm (%)
                  </label>
                  <input
                    v-model="formVoucher.discountPercentage"
                    type="number"
                    min="1"
                    max="20"
                    step="0.01"
                    class="form-control"
                    :disabled="formVoucher.discountType !== 'PERCENTAGE'"
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Số tiền giảm
                  </label>
                  <input
                    v-model="formVoucher.discountAmount"
                    type="number"
                    min="1000"
                    max="100000000"
                    step="0.01"
                    class="form-control"
                    :disabled="formVoucher.discountType !== 'FIXED_AMOUNT'"
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Ngày bắt đầu
                  </label>
                  <input
                    v-model="formVoucher.startTime"
                    type="datetime-local"
                    class="form-control"
                    required
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Ngày kết thúc
                  </label>
                  <input
                    v-model="formVoucher.endTime"
                    type="datetime-local"
                    class="form-control"
                    required
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Giá trị đơn tối thiểu
                  </label>
                  <input
                    v-model="formVoucher.minOrderValue"
                    type="number"
                    min="0"
                    max="100000000"
                    step="0.01"
                    class="form-control"
                    required
                  />
                </div>
                <div
                  class="mb-2 col-6"
                  v-if="formVoucher.discountType === 'PERCENTAGE'"
                >
                  <label class="form-label">
                    <span style="color: red">*</span> Giá trị giảm tối đa
                  </label>
                  <input
                    v-model="formVoucher.maxDiscountValue"
                    type="number"
                    min="0"
                    max="99999999"
                    step="0.01"
                    class="form-control"
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Giới hạn lượt dùng tổng cộng
                    <br>
                    <small class="text-muted">( Tổng lượt dùng voucher của tất cả người dùng )</small>
                  </label>
                  <input
                    v-model="formVoucher.usageLimit"
                    type="number"
                    min="1"
                    max="100"
                    class="form-control"
                    required
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Giới hạn lượt dùng mỗi người
                    <br>
                    <small class="text-muted">( Tổng lượt dùng của 1 người dùng )</small>
                  </label>
                  <input
                    v-model="formVoucher.usageLimitPerUser"
                    type="number"
                    min="1"
                    max="100"
                    class="form-control"
                    required
                  />
                </div>
                <div class="mb-2 col-12">
                  <label class="form-label">Mô tả</label>
                  <textarea
                    v-model="formVoucher.description"
                    class="form-control"
                    rows="2"
                    placeholder="Nhập mô tả voucher"
                    maxlength="500"
                  ></textarea>
                  <div class="form-text">
                    {{
                      formVoucher.description
                        ? formVoucher.description.length
                        : 0
                    }}/500 ký tự
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn form-btn-secondary"
              @click="handleCloseFormModal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn form-btn-primary"
              @click="handleSubmitVoucher"
            >
              {{ isEdit ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Chi tiết Voucher -->
    <div
      v-if="showDetailModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
    >
      <div class="modal-dialog modal-dialog-centered form-modal-dialog">
        <div class="modal-content">
          <div class="modal-header form-modal-header">
            <h5 class="modal-title">
              <i class="bi bi-info-circle me-2"></i>
              Chi tiết voucher: {{ selectedVoucher.name || "Trống" }}
            </h5>
            <button
              type="button"
              class="custom-close-btn"
              @click="handleCloseDetailModal"
              aria-label="Đóng"
              title="Đóng"
            >
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <div class="modal-body form-modal-body">
            <div class="row">
              <div class="col-6 mb-3">
                <label class="form-label">Mã voucher:</label>
                <div class="form-control bg-light">
                  {{ selectedVoucher.code || "Trống" }}
                </div>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Tên voucher:</label>
                <div class="form-control bg-light">
                  {{ selectedVoucher.name || "Trống" }}
                </div>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Loại voucher:</label>
                <div class="form-control bg-light">
                  {{
                    selectedVoucher.voucherCategory === "NORMAL"
                      ? "Giảm giá sản phẩm"
                      : selectedVoucher.voucherCategory === "SHIPPING"
                      ? "Giảm phí vận chuyển"
                      : "Trống"
                  }}
                </div>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Kiểu giảm giá:</label>
                <div class="form-control bg-light">
                  {{
                    selectedVoucher.discountType === "PERCENTAGE"
                      ? "Phần trăm"
                      : selectedVoucher.discountType === "FIXED_AMOUNT"
                      ? "Số tiền"
                      : "Trống"
                  }}
                </div>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Ngày bắt đầu:</label>
                <div class="form-control bg-light">
                  {{ selectedVoucher.start_time || "Trống" }}
                </div>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Ngày kết thúc:</label>
                <div class="form-control bg-light">
                  {{ selectedVoucher.end_time || "Trống" }}
                </div>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Giá trị đơn tối thiểu:</label>
                <div class="form-control bg-light">
                  {{ selectedVoucher.minOrderValue || "0" }}
                </div>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Giới hạn lượt dùng:</label>
                <div class="form-control bg-light">
                  {{ selectedVoucher.usageLimit || "0" }}
                </div>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Giới hạn/người:</label>
                <div class="form-control bg-light">
                  {{ selectedVoucher.usageLimitPerUser || "0" }}
                </div>
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Mô tả:</label>
                <div class="form-control bg-light">
                  {{ selectedVoucher.description || "Trống" }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn form-btn-secondary"
              @click="handleCloseDetailModal"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { showToast, showQuickConfirm } from "@/utils/swalHelper.js";
import { validate } from "@/utils/validation.js";
import { toDate1, toTime1,formatDate,formatDateTime } from "@/utils/utils.js";
// ========== IMPORT SERVICES ==========
import {
  getVouchers,
  createVouchers,
  updateVouchers,
  deleteVouchers,
  getVoucherStats,
} from "@/services/admin/voucher";

// ========== IMPORT COMPONENTS ==========
import Pagination from "@/components/common/Pagination.vue";
import EditButton from "@/components/common/EditButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import OverviewStatsComponent from "@/components/common/OverviewStatsComponent.vue";
import ExcelExportButton from "@/components/common/ExcelExportButton.vue";

// ========== REACTIVE VARIABLES ==========
const currentPage = ref(0);
const pageSize = ref(10);
const totalElements = ref(0);
const totalPages = ref(1);
const isLastPage = computed(() => currentPage.value >= totalPages.value - 1);
const itemsPerPageOptions = ref([5, 10, 20, 50]);

const listVoucher = ref([]);
const searchQuery = ref("");
const nameFilter = ref("");
const voucherCategoryFilter = ref("");
const discountTypeFilter = ref("");
const showDetailModal = ref(false);
const selectedVoucher = ref(null);
const showFormModal = ref(false);
const isEdit = ref(false);
const loading = ref(false);
const showFilter = ref(true);

const formVoucher = ref({
  id: null,
  code: "",
  name: "",
  description: "",
  voucherCategory: "",
  discountType: "",
  discountPercentage: "",
  discountAmount: "",
  startTime: "",
  endTime: "",
  minOrderValue: "",
  maxDiscountValue: "",
  usageLimit: "",
  usedCount: "",
  usageLimitPerUser: "",
  createdBy: "",
  updatedBy: "",
});

// ========== STATS DATA ==========
const stats = ref([
  { label: "Tổng số voucher", value: 0 },
  { label: "Voucher đang hoạt động", value: 0 },
  { label: "Lượt sử dụng voucher", value: 0 },
  { label: "Voucher phổ biến nhất", value: "—" },
]);

// ========== HANDLER FUNCTIONS ==========
const handleToggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const handleApplyFilter = () => {
  currentPage.value = 0;
  handleFetchVouchers();
};

const handleClearFilter = () => {
  searchQuery.value = "";
  nameFilter.value = "";
  voucherCategoryFilter.value = "";
  discountTypeFilter.value = "";
  currentPage.value = 0;
  handleFetchVouchers();
};

const handleFetchStats = async () => {
  try {
    const response = await getVoucherStats();
    const data = response.data || response;

    stats.value = [
      { label: "Tổng số voucher", value: data.totalVouchers || 0 },
      { label: "Voucher đang hoạt động", value: data.activeVouchers || 0 },
      { label: "Lượt sử dụng voucher", value: data.totalUsageCount || 0 },
      { label: "Voucher phổ biến nhất", value: data.mostPopularVoucher || "—" },
    ];
  } catch (error) {
    console.error("Lỗi khi tải thống kê voucher:", error);
    showToast("error", "Không thể tải thống kê voucher");
  }
};

const handleFetchVouchers = async () => {
  loading.value = true;
  try {
         const res = await getVouchers({
       page: currentPage.value,
       size: pageSize.value,
       code: searchQuery.value || null,
       name: nameFilter.value || null,
       voucherCategory: voucherCategoryFilter.value || null,
       discountType: discountTypeFilter.value || null,
     });

  listVoucher.value = res.content.map((voucher) => ({
  id: voucher.id,
  code: voucher.code,
  name: voucher.name,
  description: voucher.description,
  voucherCategory: voucher.voucherCategory,
  discountType: voucher.discountType,
  discountPercentage: voucher.discountPercentage,
  discountAmount: voucher.discountAmount,
  start_time: toDate1(voucher.startTime),
  end_time: toDate1(voucher.endTime),
  startHour: toTime1(voucher.startTime),   // nếu muốn thêm giờ
  endHour: toTime1(voucher.endTime),       // nếu muốn thêm giờ
  startTime: voucher.startTime,
  endTime: voucher.endTime,
  minOrderValue: voucher.minOrderValue,
  maxDiscountValue: voucher.maxDiscountValue,
  usageLimit: voucher.usageLimit,
  usedCount: voucher.usedCount,
  usageLimitPerUser: voucher.usageLimitPerUser,
  createdBy: voucher.createdBy,
  updatedBy: voucher.updatedBy,
  soLanDungConLai: Math.max(voucher.usageLimit - voucher.usedCount, 0),
}));


    totalElements.value = res.totalElements;
    totalPages.value = res.totalPages;

    await handleFetchStats();
  } catch (error) {
    console.error("Lỗi khi tải voucher:", error);
    showToast("error", "Không thể tải danh sách voucher");
  } finally {
    loading.value = false;
  }
};

const handleShowDetail = (voucher) => {
  selectedVoucher.value = voucher;
  showDetailModal.value = true;
};

const handleCloseDetailModal = () => {
  showDetailModal.value = false;
  selectedVoucher.value = null;
};

const handleOpenAddVoucher = () => {
  isEdit.value = false;
  formVoucher.value = {
    id: null,
    code: "",
    name: "",
    description: "",
    voucherCategory: "",
    discountType: "",
    discountPercentage: "",
    discountAmount: "",
    startTime: "",
    endTime: "",
    minOrderValue: "",
    maxDiscountValue: "",
    usageLimit: "",
    usedCount: "",
    usageLimitPerUser: "",
    createdBy: "admin",
    updatedBy: "",
  };
  showFormModal.value = true;
};

const handleOpenEditVoucher = (voucher) => {
  isEdit.value = true;
  
  // const toInputDate = (val) => {
  //   if (!val) return "";
  //   const d = new Date(val);
  //   if (isNaN(d.getTime())) return "";
  //   return d.toISOString().slice(0, 16);
  // };

 // Chuyển timestamp (long từ DB) sang chuỗi yyyy-MM-ddTHH:mm để hiển thị
const toInputDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";

  // Trừ đi timezone offset (phút -> ms) để datetime-local hiển thị đúng giờ
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};


  formVoucher.value = {
    id: voucher.id,
    code: voucher.code,
    name: voucher.name,
    description: voucher.description,
    voucherCategory: voucher.voucherCategory,
    discountType: voucher.discountType,
    discountPercentage: voucher.discountPercentage,
    discountAmount: voucher.discountAmount,
    startTime: toInputDate(voucher.startTime),
    endTime: toInputDate(voucher.endTime),
    minOrderValue: voucher.minOrderValue,
    maxDiscountValue: voucher.maxDiscountValue,
    usageLimit: voucher.usageLimit,
    usedCount: voucher.usedCount,
    usageLimitPerUser: voucher.usageLimitPerUser,
    createdBy: voucher.createdBy || "admin",
    updatedBy: voucher.updatedBy || "admin",
  };
  showFormModal.value = true;
};

const handleCloseFormModal = () => {
  showFormModal.value = false;
};

const handleValidateVoucherForm = () => {
  const v = formVoucher.value;

  // check trống hoặc = 0 cho các field bắt buộc
  if (!v.code || v.code.trim() === "") {
    showToast("error", "Mã voucher không được để trống");
    return false;
  }
  // Regex mã: A-Za-z0-9, 1-20 ký tự
  if (!/^[A-Za-z0-9]{1,20}$/.test(v.code)) {
    showToast("error", "Mã voucher chỉ gồm A-Z, a-z, 0-9 và dài 1-20 ký tự");
    return false;
  }
  if (!v.name || v.name.trim() === "") {
    showToast("error", "Tên voucher không được để trống");
    return false;
  }
  // Tên 1-50 ký tự
  if (v.name.trim().length < 1 || v.name.trim().length > 50) {
    showToast("error", "Tên voucher phải từ 1-50 ký tự");
    return false;
  }
  if (!v.voucherCategory) {
    showToast("error", "Loại voucher không được để trống");
    return false;
  }

  // Nếu loại giảm giá là % thì phần trăm 1-20, maxDiscountValue < 100 triệu
  if (v.discountType === "PERCENTAGE") {
    const percent = Number(v.discountPercentage);
    if (!percent || percent < 1 || percent > 20) {
      showToast("error", "Phần trăm giảm phải từ 1-20%");
      return false;
    }
    const maxVal = Number(v.maxDiscountValue ?? 0);
    if (!(maxVal > 0) || maxVal >= 100_000_000) {
      showToast("error", "Giá trị giảm tối đa phải > 0 và < 100,000,000");
      return false;
    }
  }

  // Nếu loại giảm giá là số tiền thì trong [1,000 ; 100,000,000]
  if (v.discountType === "FIXED_AMOUNT") {
    const amt = Number(v.discountAmount);
    if (!amt || amt < 1000 || amt > 100_000_000) {
      showToast("error", "Số tiền giảm phải từ 1,000 đến 100,000,000");
      return false;
    }
  }

  // Giá trị đơn tối thiểu 0 - 100 triệu
  if (v.minOrderValue === "" || v.minOrderValue === null || typeof v.minOrderValue === "undefined") {
    showToast("error", "Giá trị đơn tối thiểu không được để trống");
    return false;
  }
  const minOrder = Number(v.minOrderValue ?? 0);
  if (isNaN(minOrder) || minOrder < 0 || minOrder > 100_000_000) {
    showToast("error", "Giá trị đơn tối thiểu phải từ 0 đến 100,000,000");
    return false;
  }

  // Giới hạn tổng 1 - 100
  if (!v.usageLimit || v.usageLimit < 1 || v.usageLimit > 100) {
    showToast("error", "Giới hạn lượt dùng tổng cộng phải từ 1 đến 100");
    return false;
  }

  // Giới hạn mỗi người 1 - 100 và <= tổng cộng
  if (!v.usageLimitPerUser || v.usageLimitPerUser < 1 || v.usageLimitPerUser > 100) {
    showToast("error", "Giới hạn lượt dùng mỗi người phải từ 1 đến 100");
    return false;
  }
  if (Number(v.usageLimitPerUser) > Number(v.usageLimit)) {
    showToast("error", "Giới hạn mỗi người phải nhỏ hơn hoặc bằng tổng cộng");
    return false;
  }

  // thời gian
  if (!v.startTime) {
    showToast("error", "Ngày bắt đầu không được để trống");
    return false;
  }
  if (!v.endTime) {
    showToast("error", "Ngày kết thúc không được để trống");
    return false;
  }

  // --- gọi thêm validate cũ nếu cần ---
  const validations = [
    validate.voucher.code(v.code),
    validate.voucher.name(v.name),
    validate.voucher.description(v.description),
    validate.voucher.voucherCategory(v.voucherCategory),
    validate.voucher.discountType(v.discountType),
    validate.voucher.discountPercentage(v.discountPercentage, v.discountType),
    validate.voucher.discountAmount(v.discountAmount, v.discountType),
    validate.voucher.startTime(v.startTime),
    validate.voucher.endTime(v.endTime, v.startTime),
    validate.voucher.minOrderValue(v.minOrderValue),
    validate.voucher.maxDiscountValue(v.maxDiscountValue),
    validate.voucher.usageLimit(v.usageLimit),
    validate.voucher.usageLimitPerUser(v.usageLimitPerUser),
  ];

  for (const validation of validations) {
    if (validation !== null) {
      showToast("error", validation);
      return false;
    }
  }

  return true;
};


const adjustDateForServer = (val) => {
  if (!val) return null;
  const d = new Date(val);
  d.setHours(d.getHours() - 5); // Trừ lại 5 giờ
  return d.toISOString();
};


const handleSubmitVoucher = async () => {

  
  const result = await showQuickConfirm(
    isEdit.value ? "Xác nhận cập nhật" : "Xác nhận thêm mới",
    isEdit.value 
      ? "Bạn có chắc chắn muốn cập nhật voucher này?" 
      : "Bạn có chắc chắn muốn thêm voucher này?",
    "question",
    isEdit.value ? "Cập nhật" : "Thêm mới",
    "Hủy"
  );
  
  if (!result.isConfirmed) return;

  if (!handleValidateVoucherForm()) {
    return;
  }

  const toNumberOrNull = (val) => val === "" || val === null || typeof val === "undefined" ? null : Number(val);
  const toStringOrNull = (val) => val === "" || typeof val === "undefined" ? null : val;
  const toTimestampOrNull = (val) => val === "" || val === null || typeof val === "undefined" ? null : new Date(val).getTime();

const payload = {
  id: formVoucher.value.id, // Bắt buộc cho update
  code: formVoucher.value.code.trim(),
  name: toStringOrNull(formVoucher.value.name),
  description: toStringOrNull(formVoucher.value.description),
  voucherCategory: formVoucher.value.voucherCategory, // Enum: "NORMAL", ...
  discountType: formVoucher.value.discountType,       // Enum: "PERCENTAGE", "FIXED_AMOUNT"
  discountPercentage: toNumberOrNull(formVoucher.value.discountPercentage),
  discountAmount: toNumberOrNull(formVoucher.value.discountAmount),
  startTime: formVoucher.value.startTime ? new Date(formVoucher.value.startTime).getTime() : null,
  endTime: formVoucher.value.endTime ? new Date(formVoucher.value.endTime).getTime() : null,
  minOrderValue: toNumberOrNull(formVoucher.value.minOrderValue),
  maxDiscountValue: toNumberOrNull(formVoucher.value.maxDiscountValue),
  usageLimit: toNumberOrNull(formVoucher.value.usageLimit),
  usedCount: toNumberOrNull(formVoucher.value.usedCount),
  usageLimitPerUser: toNumberOrNull(formVoucher.value.usageLimitPerUser),
  status: formVoucher.value.status ?? 1,
  createdBy: formVoucher.value.createdBy || "system", // Không được null
  updatedBy: "admin"
};

  if (isEdit.value) {
    payload.id = formVoucher.value.id;
  }

  try {
    if (isEdit.value) {
      await updateVouchers(payload);
      showToast("success", "Cập nhật voucher thành công!");
    } else {
      await createVouchers(payload);
      showToast("success", "Thêm voucher thành công!");
    }
    handleCloseFormModal();
    await handleFetchVouchers();
  } catch (error) {
    let msg = "Có lỗi xảy ra!";
    if (error.response?.data?.message) {
      msg = error.response.data.message;
    }
    showToast("error", msg);
  }
};

// ========== PAGINATION FUNCTIONS ==========
const handlePrevPage = () => {
  if (currentPage.value > 0) currentPage.value--;
};

const handleNextPage = () => {
  if (currentPage.value < totalPages.value - 1) currentPage.value++;
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 0;
};

// ========== WATCH & LIFECYCLE ==========
watch([currentPage, pageSize], () => {
  handleFetchVouchers();
});

onMounted(() => {
  handleFetchStats();
  handleFetchVouchers();
});
</script>

<style scoped>
@import "@/assets/css/admin-global.css";
@import "@/assets/css/form-global.css";
@import "@/assets/css/form-detail-global.css";
/* Chỉ giữ lại style cho modal và phần riêng */
.modal-dialog {
  max-width: 800px !important;
}

.modal-content {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: none;
  max-height: calc(70vh + 150px);
  overflow: hidden;
}

.author-modal-header {
  border-bottom: 2px solid #ecae9e;
  border-radius: 15px 15px 0 0;
  padding: 0.8rem 1.2rem;
  position: relative;
  background: #f8fafc;
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
  font-size: 1.5rem;
  color: #333;
}

.author-modal-body {
  min-height: 320px;
  max-height: calc(45vh + 150px);
  overflow-y: auto;
  padding: 1.5rem 1.2rem 0.5rem 1.2rem;
}

.modal-footer {
  border-top: none;
  background: none;
  padding: 1rem 0 0 0;
  justify-content: flex-end;
}

.cursor-pointer {
  cursor: pointer;
}

/* Style cho cột tên voucher */
.voucher-name-cell {
  max-width: 250px; /* ✅ Tăng từ 200px lên 250px vì bỏ cột trạng thái */
}

.voucher-name {
  display: block;
  font-weight: 500;
  color: #2d3748;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.voucher-name-cell small {
  font-size: 0.75rem;
  font-weight: 400;
  color: #6c757d !important;
}

/* ✅ Style cho disabled select */
.form-select:disabled,
.form-select.bg-light {
  background-color: #f8f9fa !important;
  color: #6c757d !important;
  cursor: not-allowed !important;
  border-color: #dee2e6 !important;
}

.form-select:disabled option {
  color: #6c757d !important;
}

/* Style cho text warning */
.form-text.text-warning {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1200px) {
  .voucher-name-cell {
    max-width: 200px;
  }
}

@media (max-width: 900px) {
  .modal-dialog {
    max-width: 98vw !important;
  }
  .modal-content {
    max-height: 80vh;
  }
  .author-modal-body {
    max-height: 60vh;
  }

  /* Ẩn một số cột trên mobile */
  .table th:nth-child(4),
  .table td:nth-child(4) {
    display: none;
  }

  .voucher-name-cell {
    max-width: 150px;
  }
}
</style>
