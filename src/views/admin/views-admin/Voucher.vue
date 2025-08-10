<template>
  <div class="container-fluid py-4">
    <!-- <div class="mb-3">
      <h6 class="text-muted">Quản lý / <strong>Phiếu giảm giá</strong></h6>
    </div> -->
    <!-- Bộ lọc -->
    <div class="bg-light-darker p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #f3fcf9"  >
        <i class="bi bi-funnel-fill me-2 text-green"></i>
        <h5 class="mb-0 text-secondary">
          
              Bộ lọc tìm kiếm
            </h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0 align-items-end">
        <div class="col-md-6">
          <label class="form-label mb-1">Tìm kiếm</label>
          <input
            type="text"
            class="form-control"
            placeholder="Mã voucher"
            v-model="searchQuery"
            @input="onFilterChange"
          />
        </div>

        <div class="col-md-6">
          <label class="form-label mb-1">Trạng thái</label>
          <select
            class="form-select"
            v-model="statusFilter"
            @change="onFilterChange"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Không hoạt động">Không hoạt động</option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label mb-1">Tên voucher</label>
          <input
            type="text"
            class="form-control"
            placeholder="Tên voucher"
            v-model="nameFilter"
            @input="onFilterChange"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label mb-1">Loại voucher</label>
          <select
            class="form-select"
            v-model="voucherTypeFilter"
            @change="onFilterChange"
          >
            <option value="">Tất cả loại</option>
            <option value="PERCENTAGE">Phần trăm</option>
            <option value="FIXED_AMOUNT">Số tiền</option>
          </select>
        </div>
        <div class="col-12 d-flex justify-content-end">
          <button
            class="btn btn-secondary btn-sm"
            type="button"
            @click="resetFilter"
          >
            Hủy lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Nút thêm mới -->
    <div class="d-flex justify-content-end mb-3">
      <button
        @click="openAddVoucher"
        class="btn btn-primary btn-sm py-2"
        style="background-color: #33304e; border-color: #33304e"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Thêm voucher mới
      </button>
    </div>

    <!-- Danh sách Voucher -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-3 m-0 rounded-top"
        style="background-color: #475569"
      >
        <strong style="color: white;">Danh sách voucher</strong>
      </div>
      <div class="p-3">
        <table class="table align-middle text-center">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã voucher</th>
              <!-- <th>Phần trăm giảm</th> -->
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Lần dùng còn lại</th>
              <th colspan="3">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td :colspan="9" class="py-4 text-center">
                <div
                  class="spinner-border text-primary me-2"
                  role="status"
                  style="width: 2rem; height: 2rem"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                Đang tải dữ liệu...
              </td>
            </tr>
            <tr v-else-if="listVoucher.length === 0">
              <td :colspan="9" class="py-4 text-center text-muted">
                Không có dữ liệu
              </td>
            </tr>
            <tr
              v-else
              v-for="(voucher, index) in listVoucher"
              :key="voucher.id"
              @click="showDetail(voucher)"
              class="cursor-pointer"
            >
              <td>{{ currentPage * pageSize + index + 1 }}</td>
              <td @click.stop>
                <router-link
                  :to="`/admin/userVoucher/${voucher.id}`"
                  class="text-decoration-none"
                >
                  {{ voucher.code }}
                </router-link>
              </td>
              <!-- <td>{{ voucher.discountPercentage }}%</td> -->
              <td>{{ voucher.start_time }}</td>
              <td>{{ voucher.end_time }}</td>
              <td style="width: 200px">
                <ToggleStatus
                  :id="voucher.id"
                  v-model="voucher.status"
                  :true-value="1"
                  :false-value="0"
                  active-text="Hoạt động"
                  inactive-text="Không hoạt động"
                  @change="toggleStatus(voucher, $event)"
                  @click.stop
                />
              </td>
              <td>
                <span v-if="voucher.soLanDungConLai > 0">
                  {{ voucher.soLanDungConLai }}
                </span>
                <span v-else class="text-danger fw-bold">Hết lượt</span>
              </td>
              <td>
                <div @click.stop>
                  <EditButton
                    :tooltip="'Cập nhật voucher ' + voucher.code"
                    @click="openEditVoucher(voucher)"
                  />
                  <!-- <DeleteButton
                    :tooltip="'Xóa voucher ' + voucher.code"
                    @click="deleteVoucher(voucher)"
                  /> -->
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
        @prev="prevPage"
        @next="nextPage"
        @update:pageSize="handlePageSizeChange"
      />
    </div>
  </div>

  <!-- Modal chi tiết voucher -->
  <div
    v-if="showDetailModal"
    class="modal fade show"
    style="display: block; background: rgba(0, 0, 0, 0.3)"
    tabindex="-1"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Chi tiết voucher</h5>
        </div>
        <div class="modal-body" v-if="selectedVoucher">
          <p><strong>Mã voucher:</strong> {{ selectedVoucher.code }}</p>
          <p>
            <strong>Phần trăm giảm:</strong>
            {{ selectedVoucher.discountPercentage }}%
          </p>
          <p><strong>Ngày bắt đầu:</strong> {{ selectedVoucher.start_time }}</p>
          <p><strong>Ngày kết thúc:</strong> {{ selectedVoucher.end_time }}</p>
          <p>
            <strong>Giá trị đơn tối thiểu:</strong>
            {{ selectedVoucher.minOrderValue?.toLocaleString() }} đ
          </p>
          <p>
            <strong>Giá trị giảm tối đa:</strong>
            {{ selectedVoucher.maxDiscountValue?.toLocaleString() }} đ
          </p>
          <p>
            <strong>Trạng thái:</strong>
            {{ selectedVoucher.status == 1 ? "Hoạt động" : "Không hoạt động" }}
          </p>
          <p><strong>Người tạo:</strong> {{ selectedVoucher.createdBy }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeDetailModal">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Thêm/Cập nhật Voucher -->
  <div
    class="modal fade show"
    tabindex="-1"
    style="display: block; background: rgba(0, 0, 0, 0.3)"
    v-if="showFormModal"
  >
    <div class="modal-dialog modal-dialog-centered custom-modal-dialog">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #ecae9e">
          <h5 class="modal-title">
            {{ isEdit ? "Cập nhật voucher" : "Thêm voucher mới" }}
          </h5>
          <button
            type="button"
            class="custom-close-btn"
            @click="closeFormModal"
            aria-label="Đóng"
            title="Đóng"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitVoucher">
            <div class="row">
              <div class="mb-2 col-6">
                <label class="form-label">
                  Mã voucher <span style="color: red">*</span>
                </label>
                <input
                  v-model="formVoucher.code"
                  class="form-control"
                  placeholder="Nhập mã voucher"
                />
              </div>
              <div class="mb-2 col-6">
                <label class="form-label">
                  Tên voucher <span style="color: red">*</span>
                </label>
                <input
                  v-model="formVoucher.name"
                  class="form-control"
                  placeholder="Nhập tên voucher"
                />
              </div>
              <div class="mb-2 col-6">
                <label class="form-label">
                  Loại voucher <span style="color: red">*</span>
                </label>
                <select
                  v-model="formVoucher.voucherCategory"
                  class="form-select"
                >
                  <option value="">Chọn loại voucher</option>
                  <option value="NORMAL">Thường</option>
                  <option value="SHIPPING">Giảm Giá SHIPPING</option>
                  <!-- Thêm các loại khác nếu có -->
                </select>
              </div>
              <div class="mb-2 col-6">
                <label class="form-label">
                  Kiểu giảm giá <span style="color: red">*</span>
                </label>
                <select v-model="formVoucher.discountType" class="form-select">
                  <option value="">Chọn kiểu giảm giá</option>
                  <option value="PERCENTAGE">Phần trăm</option>
                  <option value="FIXED_AMOUNT">Số tiền</option>
                </select>
              </div>
              <div class="mb-2 col-6">
                <label class="form-label"
                  ><span style="color: red">*</span> Phần trăm giảm (%)</label
                >
                <input
                  v-model="formVoucher.discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  class="form-control"
                  :disabled="formVoucher.discountType !== 'PERCENTAGE'"
                />
              </div>
              <div class="mb-2 col-6">
                <label class="form-label"
                  ><span style="color: red">*</span> Số tiền giảm</label
                >
                <input
                  v-model="formVoucher.discountAmount"
                  type="number"
                  min="0"
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
                  step="0.01"
                  class="form-control"
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
                  step="0.01"
                  class="form-control"
                />
              </div>

              <div class="mb-2 col-6">
                <label class="form-label">
                  <span style="color: red">*</span> Giới hạn lượt dùng
                </label>
                <input
                  v-model="formVoucher.usageLimit"
                  type="number"
                  min="0"
                  class="form-control"
                />
              </div>
              <!-- <div class="mb-2 col-6">
                <label class="form-label">
                  <span style="color: red">*</span> Đã dùng
                </label>
                <input
                  v-model="formVoucher.usedCount"
                  type="number"
                  min="0"
                  class="form-control"
                />
              </div> -->
              <div class="mb-2 col-6">
                <label class="form-label">
                  <span style="color: red">*</span> Giới hạn/người
                </label>
                <input
                  v-model="formVoucher.usageLimitPerUser"
                  type="number"
                  min="0"
                  class="form-control"
                />
              </div>
              <!-- <div class="mb-2 col-6">
                <label class="form-label">
                  <span style="color: red">*</span> Trạng thái
                </label>
                <select v-model="formVoucher.status" class="form-select">
                  <option :value="1">Hoạt động</option>
                  <option :value="0">Không hoạt động</option>
                </select>
              </div> -->
              <!-- <div class="mb-2 col-6">
                <label class="form-label">Người tạo</label>
                <input
                  v-model="formVoucher.createdBy"
                  class="form-control"
                  readonly
                />
              </div>
              <div class="mb-2 col-6">
                <label class="form-label">Người cập nhật</label>
                <input
                  v-model="formVoucher.updatedBy"
                  class="form-control"
                  readonly
                />
              </div> -->
              <div class="mb-2 col-12">
                <label class="form-label">Mô tả</label>
                <textarea
                  v-model="formVoucher.description"
                  class="form-control"
                  rows="2"
                  placeholder="Nhập mô tả voucher"
                ></textarea>
              </div>
              <div class="modal-footer col-12">
                <button type="submit" class="btn btn-primary">
                  {{ isEdit ? "Cập nhật" : "Thêm mới" }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditButton from "@/components/common/EditButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import ToggleStatus from "@/components/common/ToggleStatus.vue";
import Pagination from "@/components/common/Pagination.vue";
import { getUserId, getUserFullName } from "@/utils/utils";
import { Modal } from "bootstrap";
import { ref, computed, watch, onMounted } from "vue";
import {
  getVouchers,
  createVouchers,
  updateVouchers,
  deleteVouchers,
  upStatusVouchers,
} from "@/services/admin/voucher";
import Swal from "sweetalert2";
import { showToast } from "@/utils/swalHelper";

export default {
  components: {
    Pagination,
    EditButton,
    DeleteButton,
    ToggleStatus,
    showToast,
  },
  setup() {
    const currentPage = ref(0);
    const pageSize = ref(10);
    const totalElements = ref(0);
    const totalPages = ref(1);
    const isLastPage = computed(
      () => currentPage.value >= totalPages.value - 1
    );
    const voucherChannel = new BroadcastChannel("voucher-status");

    const itemsPerPageOptions = ref([5, 10, 20, 50]);

    const listVoucher = ref([]);

    const searchQuery = ref("");
    const statusFilter = ref("");
    const nameFilter = ref("");
    const voucherTypeFilter = ref("");
    const showDetailModal = ref(false);
    const selectedVoucher = ref(null);
    const showFormModal = ref(false);
    const isEdit = ref(false);
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
      status: 1,
      createdBy: "",
      updatedBy: "",
    });
    const loading = ref(false);

    onMounted(() => {
      fetchVouchers();
    });

    async function fetchVouchers() {
      loading.value = true;
      try {
        const res = await getVouchers({
          page: currentPage.value,
          size: pageSize.value,
          code: searchQuery.value || null,
          name: nameFilter.value || null,
          voucherType: voucherTypeFilter.value || null,
          status:
            statusFilter.value === ""
              ? null
              : statusFilter.value === "Hoạt động"
              ? 1
              : 0,
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
          start_time: formatDate(voucher.startTime),
          end_time: formatDate(voucher.endTime),
          startTime: voucher.startTime,
          endTime: voucher.endTime,
          minOrderValue: voucher.minOrderValue,
          maxDiscountValue: voucher.maxDiscountValue,
          usageLimit: voucher.usageLimit,
          usedCount: voucher.usedCount,
          usageLimitPerUser: voucher.usageLimitPerUser,
          status: voucher.status,
          createdBy: voucher.createdBy,
          updatedBy: voucher.updatedBy,
          // Tính số lần dùng còn lại
          soLanDungConLai: Math.max(voucher.usageLimit - voucher.usedCount, 0),
        }));

        totalElements.value = res.totalElements;
        totalPages.value = res.totalPages;
      } catch (error) {
        console.error("Lỗi khi tải voucher:", error);
      } finally {
        loading.value = false;
      }
    }

    function formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    watch([currentPage, pageSize], () => {
      fetchVouchers();
    });

    function onFilterChange() {
      currentPage.value = 0;
      fetchVouchers();
    }

    function prevPage() {
      if (currentPage.value > 0) currentPage.value--;
    }

    function nextPage() {
      if (currentPage.value < totalPages.value - 1) currentPage.value++;
    }

    function handlePageSizeChange(newSize) {
      pageSize.value = newSize;
      currentPage.value = 0;
    }

    function showDetail(voucher) {
      Swal.fire({
        title: `Chi tiết voucher: ${voucher.name ?? "Trống"}`,
        html: `
          <div style="max-height:400px;overflow:auto">
            <table class="table table-bordered text-start">
              <tr><th>Mã</th><td>${voucher.code ?? "Trống"}</td></tr>
              <tr><th>Tên</th><td>${
                voucher.name ?? "Trống"
              }</td></tr>
              <tr><th>Mô tả</th><td>${
                voucher.description ?? "Trống"
              }</td></tr>
             <tr><th>Loại</th><td>${
  voucher.voucherCategory === "NORMAL"
    ? "Thường"
    : voucher.voucherCategory === "SHIPPING"
    ? "Giảm Giá SHIPPING"
    : "Trống"
}</td></tr>
<tr><th>Kiểu giảm giá</th><td>${
  voucher.discountType === "PERCENTAGE"
    ? "Phần trăm"
    : voucher.discountType === "FIXED_AMOUNT"
    ? "Số tiền"
    : "Trống"
}</td></tr>

              <tr><th>Phần trăm giảm</th><td>${
                voucher.discountPercentage ?? "0"
              }</td></tr>
              <tr><th>Số tiền giảm</th><td>${
                voucher.discountAmount ?? "0"
              }</td></tr>
              <tr><th>Bắt đầu</th><td>${
                voucher.start_time ?? "Trống"
              }</td></tr>
              <tr><th>Kết thúc</th><td>${
                voucher.end_time ?? "Trống"
              }</td></tr>
              <tr><th>Đơn tối thiểu</th><td>${
                voucher.minOrderValue ?? "0"
              }</td></tr>
              <tr><th>Giảm tối đa</th><td>${
                voucher.maxDiscountValue ?? "0"
              }</td></tr>
              <tr><th>Giới hạn lượt dùng</th><td>${
                voucher.usageLimit ?? "0"
              }</td></tr>
              <tr><th>Đã dùng</th><td>${
                voucher.usedCount ?? "0"
              }</td></tr>
              <tr><th>Giới hạn/người</th><td>${
                voucher.usageLimitPerUser ?? "0"
              }</td></tr>
              <tr><th>Trạng thái</th><td>${
                voucher.status == 1
                  ? "Hoạt động"
                  : voucher.status == 0
                  ? "Không hoạt động"
                  : ""
              }</td></tr>
              <tr><th>Người tạo</th><td>${
                voucher.createdBy ?? "Trống"
              }</td></tr>
              <tr><th>Người cập nhật</th><td>${
                voucher.updatedBy ?? "Trống"
              }</td></tr>
            </table>
          </div>
        `,
        width: 600,
        confirmButtonText: "Đóng",
      });
    }
    function closeDetailModal() {
      showDetailModal.value = false;
      selectedVoucher.value = null;
    }
    function openAddVoucher() {
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
        status: 1,
        createdBy: getUserFullName(),
        updatedBy: "",
      };
      showFormModal.value = true;
    }
    // Thêm mới hoặc cập nhật voucher
    async function submitVoucher() {
      formVoucher.value.code = formVoucher.value.code.trim();

      // Validate rỗng
      if (
        !formVoucher.value.code ||
        !formVoucher.value.voucherCategory ||
        !formVoucher.value.discountType ||
        !formVoucher.value.startTime ||
        !formVoucher.value.endTime ||
        formVoucher.value.minOrderValue === "" ||
        !formVoucher.value.createdBy
      ) {
        showToast("error", "Vui lòng nhập đầy đủ thông tin!");
        return;
      }

const codeExists = listVoucher.value.some((v) => {
  const currentCode = formVoucher.value.code.trim().toLowerCase();
  const voucherCode = v.code.trim().toLowerCase();
  const sameCode = voucherCode === currentCode;
  const isDifferentId = isEdit.value ? v.id !== formVoucher.value.id : true;
  return sameCode && isDifferentId;
});

if (codeExists) {
  showToast("error", "Mã voucher đã tồn tại trong hệ thống!");
  return;
}



      // Validate số
      if (
        formVoucher.value.discountType === "PERCENTAGE" &&
        (isNaN(formVoucher.value.discountPercentage) ||
          formVoucher.value.discountPercentage < 1 ||
          formVoucher.value.discountPercentage > 100)
      ) {
        showToast("error", "Phần trăm giảm phải từ 1 đến 100!");
        return;
      }
      if (
        formVoucher.value.discountType === "FIXED_AMOUNT" &&
        (isNaN(formVoucher.value.discountAmount) ||
          Number(formVoucher.value.discountAmount) < 1)
      ) {
        showToast("error", "Số tiền giảm phải lớn hơn 0!");
        return;
      }
      if (
        formVoucher.value.minOrderValue !== "" &&
        (isNaN(formVoucher.value.minOrderValue) ||
          Number(formVoucher.value.minOrderValue) < 0)
      ) {
        showToast("error", "Giá trị đơn tối thiểu phải >= 0!");
        return;
      }
      if (
        formVoucher.value.maxDiscountValue !== "" &&
        (isNaN(formVoucher.value.maxDiscountValue) ||
          Number(formVoucher.value.maxDiscountValue) < 0)
      ) {
        showToast("error", "Giá trị giảm tối đa phải >= 0!");
        return;
      }
      // if (
      //   formVoucher.value.maxDiscountValue !== "" &&
      //   formVoucher.value.minOrderValue !== "" &&
      //   Number(formVoucher.value.maxDiscountValue) >
      //     Number(formVoucher.value.minOrderValue)
      // ) {
      //   showToast(
      //     "error",
      //     "Giá trị giảm tối đa không được lớn hơn giá trị đơn tối thiểu!"
      //   );
      //   return;
      // }

      // Validate ngày
      const start = new Date(formVoucher.value.startTime);
      const end = new Date(formVoucher.value.endTime);
      if (end <= start) {
        showToast("error", "Ngày kết thúc phải sau ngày bắt đầu!");
        return;
      }

      // Helper chuyển đổi
      const toNumberOrNull = (val) =>
        val === "" || val === null || typeof val === "undefined"
          ? null
          : Number(val);

      const toStringOrNull = (val) =>
        val === "" || typeof val === "undefined" ? null : val;

      const toTimestampOrNull = (val) =>
        val === "" || val === null || typeof val === "undefined"
          ? null
          : new Date(val).getTime();

      const payload = {
        code: formVoucher.value.code,
        name: toStringOrNull(formVoucher.value.name),
        description: toStringOrNull(formVoucher.value.description),
        voucherCategory: formVoucher.value.voucherCategory, // "FIXED_AMOUNT" hoặc "PERCENTAGE"
        discountType: formVoucher.value.discountType,
        discountPercentage: toNumberOrNull(
          formVoucher.value.discountPercentage
        ),
        discountAmount: toNumberOrNull(formVoucher.value.discountAmount),
        startTime: toTimestampOrNull(formVoucher.value.startTime),
        endTime: toTimestampOrNull(formVoucher.value.endTime),
        minOrderValue: toNumberOrNull(formVoucher.value.minOrderValue),
        maxDiscountValue: toNumberOrNull(formVoucher.value.maxDiscountValue),
        usageLimit: toNumberOrNull(formVoucher.value.usageLimit),
        usedCount: toNumberOrNull(formVoucher.value.usedCount),
        usageLimitPerUser: toNumberOrNull(formVoucher.value.usageLimitPerUser),
        status: toNumberOrNull(formVoucher.value.status),
        createdBy: formVoucher.value.createdBy,
        updatedBy: getUserFullName(),
      };
      if (isEdit.value) {
        payload.id = formVoucher.value.id;
      }

      try {
        
    if (payload.discountType === "FIXED_AMOUNT") {
      payload.maxDiscountValue = 0; // đảm bảo luôn là 0
    }
        if (isEdit.value) {
          await updateVouchers(payload);
          voucherChannel.postMessage("updated");
          showToast("success", "Cập nhật voucher thành công!");
        } else {
          await createVouchers(payload);
          showToast("success", "Thêm voucher thành công!");
        }
        closeFormModal();
        fetchVouchers();
      } catch (error) {
        let msg = "Có lỗi xảy ra!";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          msg = error.response.data.message;
        }
        showToast("error", msg);
      }
    }

    // // Xóa voucher
    async function deleteVoucher(voucher) {
      if (
        confirm(
          `Bạn có chắc chắn muốn xóa voucher "${voucher.code}"? Hành động này không thể hoàn tác!`
        )
      ) {
        try {
          await deleteVouchers(voucher.id);
          showToast("success", "Xóa voucher thành công!");
          fetchVouchers();
        } catch (error) {
          showToast("error", "Xóa voucher thất bại!");
        }
      }
    }

    // Đổi trạng thái voucher
    async function toggleStatus(voucher, newStatus) {
      try {
        await upStatusVouchers(
          voucher.id,
          newStatus,
          voucher.createdBy || "getUserFullName()"
        );
        voucherChannel.postMessage("updated");
        showToast("success", "Cập nhật trạng thái thành công!");
        fetchVouchers();
      } catch (error) {
        showToast("error", "Cập nhật trạng thái thất bại!");
      }
    }

    // Khi click Sửa voucher
    function openEditVoucher(voucher) {
      isEdit.value = true;

      function toInputDate(val) {
        if (!val) return "";
        const d = new Date(val);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 16);
      }

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
        status: voucher.status,
        createdBy: voucher.createdBy || "admin",
        updatedBy: voucher.updatedBy || "admin",
      };
      showFormModal.value = true;
    }
    function closeFormModal() {
      showFormModal.value = false;
    }

    // Watch voucherType để reset trường còn lại về 0
    watch(
      () => formVoucher.value.voucherType,
      (newType) => {
        if (newType === "PERCENTAGE") {
          formVoucher.value.discountAmount = 0;
        } else if (newType === "FIXED_AMOUNT") {
          formVoucher.value.discountPercentage = 0;
        }
      }
    );

    function resetFilter() {
      searchQuery.value = "";
      statusFilter.value = "";
      nameFilter.value = "";
      voucherTypeFilter.value = "";
      currentPage.value = 0;
      fetchVouchers();
    }

    return {
      currentPage,
      pageSize,
      totalPages,
      totalElements,
      isLastPage,
      itemsPerPageOptions,
      listVoucher,
      searchQuery,
      statusFilter,
      nameFilter,
      voucherTypeFilter,
      onFilterChange,
      prevPage,
      nextPage,
      handlePageSizeChange,
      showDetail,
      closeDetailModal,
      openAddVoucher,
      openEditVoucher,
      deleteVoucher,
      toggleStatus,
      showDetailModal,
      selectedVoucher,
      showFormModal,
      isEdit,
      formVoucher,
      openAddVoucher,
      openEditVoucher,
      closeFormModal,
      submitVoucher,
      resetFilter,
      loading,
    };
  },
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.modal-dialog {
  max-width: 700px !important; /* Tăng từ 450px lên 700px */
}

.modal-content {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: none;
  max-height: calc(70vh + 150px); /* Tăng thêm 150px */
  overflow: hidden;
}

.modal-header {
  border-bottom: 2px solid #ecae9e;
  border-radius: 15px 15px 0 0;
  padding: 0.8rem 1.2rem;
  position: relative;
  background-color: #ecae9e !important;
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
  font-size: 2rem; /* Tăng kích thước */
  font-weight: bold; /* Đậm hơn */
  color: #33304e; /* Màu đậm hơn */
  line-height: 1;
  transition: color 0.2s;
}
.custom-close-btn:hover {
  color: #e74c3c; /* Đổi màu khi hover */
}

.custom-close-btn img {
  width: 30px;
  height: 30px;
}

/* Switch toggle cho trạng thái */
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

/* Tooltip giống Review */
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

.custom-modal-dialog {
  max-width: 800px !important;
  width: 95vw;
}

.modal-body {
  max-height: calc(45vh + 150px); /* Tăng thêm 150px */
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 900px) {
  .custom-modal-dialog {
    max-width: 98vw !important;
  }
  .modal-content {
    max-height: 80vh;
  }
  .modal-body {
    max-height: 60vh;
  }
}
</style>
