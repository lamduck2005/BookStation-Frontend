<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">Quản lý / <strong>Phiếu giảm giá</strong></h6>
    </div>
    <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #ecae9e"
      >
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5 class="mb-0">Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0 align-items-end">
        <div class="col-md-6">
          <label class="form-label mb-1">Tìm kiếm</label>
          <input
            type="text"
            class="form-control"
            placeholder="Mã voucher, trạng thái, người tạo"
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
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #ecae9e"
      >
        <strong>Danh sách voucher</strong>
      </div>
      <div class="p-3">
        <table class="table align-middle text-center">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã voucher</th>
              <th>Phần trăm giảm</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
             
              <th>Trạng thái</th>
              <th>Người tạo</th>
              <th colspan="3">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(voucher, index) in pagedVouchers" :key="voucher.id">
              <td>{{ currentPage * pageSize + index + 1 }}</td>
              <td>{{ voucher.code }}</td>
              <td>{{ voucher.discountPercentage }}</td>
              <td>{{ voucher.start_time }}</td>
              <td>{{ voucher.end_time }}</td>
             
              <td>
                <div
                  class="d-flex align-items-center justify-content-center gap-2"
                >
                  <label class="switch m-0" style="transform: scale(0.85)">
                    <input
                      type="checkbox"
                      :checked="voucher.status === 'Hoạt động'"
                      @change="toggleStatus(voucher)"
                    />
                    <span class="slider round"></span>
                  </label>
                  <span
                    class="badge"
                    :class="
                      voucher.status === 'Hoạt động'
                        ? 'bg-success-subtle text-success'
                        : 'bg-secondary-subtle text-secondary'
                    "
                    style="
                      font-weight: 700;
                      width: 130px;
                      min-width: 110px;
                      font-size: 13px;
                      display: inline-block;
                      text-align: center;
                    "
                  >
                    {{ voucher.status }}
                  </span>
                </div>
              </td>
              <td>{{ voucher.createdBy }}</td>
              <td>
                <button
                  data-tooltip="Chi tiết"
                  @click="showDetail(voucher)"
                  style="min-width: 32px; margin-right: 5px"
                >
                  <i class="bi bi-info-circle fs-6"></i>
                </button>
                <button
                  data-tooltip="Cập nhật"
                  @click="openEditVoucher(voucher)"
                  style="min-width: 32px; margin-right: 5px"
                >
                  <i class="bi bi-pencil fs-6"></i>
                </button>
                <button
                  data-tooltip="Xóa"
                  @click="deleteVoucher(voucher)"
                  style="min-width: 32px; margin-right: 5px"
                >
                  <i class="bi bi-trash fs-6 text-danger"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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

    <!-- Modal Thêm/Cập nhật voucher -->
    <div
      class="modal fade"
      id="addVoucherModal"
      tabindex="-1"
      aria-labelledby="addVoucherModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #ecae9e">
            <h5 class="modal-title" id="addVoucherModalLabel">
              <i class="bi me-2 bi-plus-circle"></i>
              {{ isEditMode ? "Cập nhật voucher" : "Thêm voucher mới" }}
            </h5>
            <button
              type="button"
              class="custom-close-btn"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/694/694604.png"
                alt="Close"
              />
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitVoucherForm">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label"
                    >Mã voucher <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="voucherForm.code"
                    class="form-control"
                    placeholder="Nhập mã voucher (3-20 ký tự)"
                    type="text"
                    minlength="3"
                    maxlength="20"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Phần trăm giảm (%)
                    <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="voucherForm.discountPercentage"
                    class="form-control"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Nhập phần trăm giảm (1-100)"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Ngày bắt đầu <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="voucherForm.start_time"
                    class="form-control"
                    type="datetime-local"
                    placeholder="Chọn ngày bắt đầu"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Ngày kết thúc <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="voucherForm.end_time"
                    class="form-control"
                    type="datetime-local"
                    placeholder="Chọn ngày kết thúc"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Đơn tối thiểu <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="voucherForm.minOrderValue"
                    class="form-control"
                    type="number"
                    min="0"
                    placeholder="Nhập đơn tối thiểu (0 trở lên)"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Giảm tối đa <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="voucherForm.maxDiscountValue"
                    class="form-control"
                    type="number"
                    min="0"
                    placeholder="Nhập giảm tối đa (0 trở lên)"
                    required
                  />
                </div>
              </div>
              <div v-if="formError" class="alert alert-danger py-1 mt-3">
                {{ formError }}
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="submitVoucherForm"
              style="background-color: #33304e; border-color: #33304e"
            >
              {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Common/Pagination.vue";
import { showToast } from "@/utils/swalHelper";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import { ref, computed, watch } from "vue";

export default {
  components: {
    Pagination,
  },
  setup() {
    // Phân trang
    const currentPage = ref(0); // Bắt đầu từ 0
    const pageSize = ref(10);
    const totalElements = ref(0);
    const totalPages = ref(1);
    const isLastPage = computed(
      () => currentPage.value >= totalPages.value - 1
    );
    const itemsPerPageOptions = ref([5, 10, 20, 50]);

    // Dữ liệu voucher
    const listVoucher = ref([
      {
        id: 1,
        code: "DG-001",
        discountPercentage: "10%",
        start_time: "2023-10-01 00:00",
        end_time: "2023-10-31 23:59",
        minOrderValue: "100000",
        maxDiscountValue: "50000",
        status: "Hoạt động",
        createdAt: "2023-10-01 10:00",
        updatedAt: "2023-10-01 10:00",
        createdBy: "admin",
        updatedBy: "admin",
      },
    ]);

    // Bộ lọc
    const searchQuery = ref("");
    const statusFilter = ref("");
    const createdByFilter = ref("");

    // Modal & form
    const isEditMode = ref(false);
    const voucherForm = ref({
      code: "",
      discountPercentage: "",
      start_time: "",
      end_time: "",
      minOrderValue: "",
      maxDiscountValue: "",
    });
    const editingVoucher = ref(null);
    const formError = ref("");

    // Lọc và phân trang
    const pagedVouchers = computed(() => {
      let filtered = listVoucher.value;

      // Lọc theo searchQuery (mã voucher, trạng thái, người tạo)
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.code.toLowerCase().includes(q) ||
            v.status.toLowerCase().includes(q) ||
            v.createdBy.toLowerCase().includes(q)
        );
      }
      // Lọc theo trạng thái
      if (statusFilter.value) {
        filtered = filtered.filter((v) => v.status === statusFilter.value);
      }
      // Lọc theo người tạo
      if (createdByFilter.value) {
        filtered = filtered.filter((v) =>
          v.createdBy
            .toLowerCase()
            .includes(createdByFilter.value.toLowerCase())
        );
      }

      totalElements.value = filtered.length;
      totalPages.value = Math.max(
        1,
        Math.ceil(filtered.length / pageSize.value)
      );

      // Reset currentPage nếu vượt quá totalPages
      if (currentPage.value > totalPages.value - 1)
        currentPage.value = totalPages.value - 1;

      const start = currentPage.value * pageSize.value;
      return filtered.slice(start, start + pageSize.value);
    });

    // Watchers
    watch([pageSize, searchQuery, statusFilter, createdByFilter], () => {
      currentPage.value = 0;
    });

    // Methods
    function onFilterChange() {
      currentPage.value = 0;
    }
    function resetFilter() {
      searchQuery.value = "";
      statusFilter.value = "";
      createdByFilter.value = "";
      currentPage.value = 0;
    }
    function openAddVoucher() {
      isEditMode.value = false;
      formError.value = "";
      voucherForm.value = {
        code: "",
        discountPercentage: "",
        start_time: "",
        end_time: "",
        minOrderValue: "",
        maxDiscountValue: "",
      };
      const modalElement = document.getElementById("addVoucherModal");
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
    function openEditVoucher(voucher) {
      isEditMode.value = true;
      formError.value = "";
      editingVoucher.value = voucher;
      voucherForm.value = {
        code: voucher.code,
        discountPercentage: voucher.discountPercentage.replace("%", ""),
        start_time: voucher.start_time.replace(" ", "T"),
        end_time: voucher.end_time.replace(" ", "T"),
        minOrderValue: voucher.minOrderValue,
        maxDiscountValue: voucher.maxDiscountValue,
      };
      const modalElement = document.getElementById("addVoucherModal");
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
    function submitVoucherForm() {
      const {
        code,
        discountPercentage,
        start_time,
        end_time,
        minOrderValue,
        maxDiscountValue,
      } = voucherForm.value;

      // Validate
      if (!code || code.length < 3 || code.length > 20) {
        formError.value = "Mã voucher phải từ 3-20 ký tự!";
        return;
      }
      if (
        !discountPercentage ||
        isNaN(Number(discountPercentage)) ||
        Number(discountPercentage) <= 0 ||
        Number(discountPercentage) > 100
      ) {
        formError.value = "Phần trăm giảm phải là số từ 1 đến 100!";
        return;
      }
      if (!start_time) {
        formError.value = "Vui lòng chọn ngày bắt đầu!";
        return;
      }
      if (!end_time) {
        formError.value = "Vui lòng chọn ngày kết thúc!";
        return;
      }
      if (new Date(start_time) >= new Date(end_time)) {
        formError.value = "Ngày kết thúc phải sau ngày bắt đầu!";
        return;
      }
      if (
        !minOrderValue ||
        isNaN(Number(minOrderValue)) ||
        Number(minOrderValue) < 0
      ) {
        formError.value = "Đơn tối thiểu phải là số không âm!";
        return;
      }
      if (
        !maxDiscountValue ||
        isNaN(Number(maxDiscountValue)) ||
        Number(maxDiscountValue) < 0
      ) {
        formError.value = "Giảm tối đa phải là số không âm!";
        return;
      }
      if (Number(maxDiscountValue) > Number(minOrderValue)) {
        formError.value = "Giảm tối đa không được lớn hơn đơn tối thiểu!";
        return;
      }

      if (isEditMode.value && editingVoucher.value) {
        Object.assign(editingVoucher.value, {
          code,
          discountPercentage: discountPercentage + "%",
          start_time: start_time.replace("T", " "),
          end_time: end_time.replace("T", " "),
          minOrderValue,
          maxDiscountValue,
          updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
          updatedBy: "admin",
        });
        showToast("success", "Cập nhật voucher thành công.");
      } else {
        const now = new Date().toISOString().slice(0, 19).replace("T", " ");
        listVoucher.value.push({
          id: Date.now(),
          code,
          discountPercentage: discountPercentage + "%",
          start_time: start_time.replace("T", " "),
          end_time: end_time.replace("T", " "),
          minOrderValue,
          maxDiscountValue,
          status: "Hoạt động",
          createdAt: now,
          updatedAt: now,
          createdBy: "admin",
          updatedBy: "admin",
        });
        showToast("success", "Thêm voucher thành công.");
      }
      // Đóng modal bằng Bootstrap JS
      const modalElement = document.getElementById("addVoucherModal");
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.hide();
    }
    function deleteVoucher(voucher) {
      Swal.fire({
        title: `Xác nhận xóa voucher?`,
        text: `Bạn có chắc chắn muốn xóa voucher "${voucher.code}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          listVoucher.value = listVoucher.value.filter(
            (v) => v.id !== voucher.id
          );
          showToast("success", "Đã xóa thành công.");
        }
      });
    }
    function toggleStatus(voucher) {
      voucher.status =
        voucher.status === "Hoạt động" ? "Không hoạt động" : "Hoạt động";
      showToast("success", "Đã thay đổi trạng thái thành công.");
    }
    function showDetail(voucher) {
      Swal.fire({
        title: `<strong>Chi tiết voucher</strong>`,
        html: `
          <div style="text-align: left; font-size: 14px;">
            <p><strong>Mã voucher:</strong> ${voucher.code}</p>
            <p><strong>Phần trăm giảm:</strong> ${voucher.discountPercentage}</p>
            <p><strong>Ngày bắt đầu:</strong> ${voucher.start_time}</p>
            <p><strong>Ngày kết thúc:</strong> ${voucher.end_time}</p>
            <p><strong>Đơn tối thiểu:</strong> ${voucher.minOrderValue}</p>
            <p><strong>Giảm tối đa:</strong> ${voucher.maxDiscountValue}</p>
            <p><strong>Trạng thái:</strong> ${voucher.status}</p>
            <p><strong>Người tạo:</strong> ${voucher.createdBy}</p>
            <p><strong>Ngày tạo:</strong> ${voucher.createdAt}</p>
            <p><strong>Người cập nhật:</strong> ${voucher.updatedBy}</p>
            <p><strong>Ngày cập nhật:</strong> ${voucher.updatedAt}</p>
          </div>
        `,
        confirmButtonText: "Đóng",
      });
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

    return {
      // Phân trang
      currentPage,
      pageSize,
      totalPages,
      totalElements,
      isLastPage,
      itemsPerPageOptions,
      // Dữ liệu
      listVoucher,
      pagedVouchers,
      // Bộ lọc
      searchQuery,
      statusFilter,
      createdByFilter,
      onFilterChange,
      resetFilter,
      // Modal & form
      isEditMode,
      voucherForm,
      editingVoucher,
      formError,
      openAddVoucher,
      openEditVoucher,
      submitVoucherForm,
      deleteVoucher,
      toggleStatus,
      showDetail,
      // Phân trang
      prevPage,
      nextPage,
      handlePageSizeChange,
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
  max-width: 450px !important;
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
</style>
