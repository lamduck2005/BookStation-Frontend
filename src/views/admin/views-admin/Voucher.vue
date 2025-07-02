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
        <div class="table-responsive">
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
              <tr
                v-for="(voucher, index) in listVoucher"
                :key="voucher.id"
                @click="showDetail(voucher)"
              class="cursor-pointer"
            >
              <td>{{ currentPage * pageSize + index + 1 }}</td>
              <td>{{ voucher.code }}</td>
              <td>{{ voucher.discountPercentage }}%</td>
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
              <td>{{ voucher.createdBy }}</td>
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
            <p>
              <strong>Ngày bắt đầu:</strong> {{ selectedVoucher.start_time }}
            </p>
            <p>
              <strong>Ngày kết thúc:</strong> {{ selectedVoucher.end_time }}
            </p>
            <p>
              <strong>Giá trị đơn tối thiểu:</strong>
              {{ selectedVoucher.minOrderValue?.toLocaleString() }} đ
            </p>
            <p>
              <strong>Giá trị giảm tối đa:</strong>
              {{ selectedVoucher.maxDiscountValue?.toLocaleString() }} đ
            </p>
            <p><strong>Trạng thái:</strong> {{ selectedVoucher.status == 1 ?'Hoạt động':'Không hoạt động' }}</p>
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
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #ecae9e">
            <h5 class="modal-title">
              {{ isEdit ? "Cập nhật voucher" : "Thêm voucher mới" }}
            </h5>
            <!-- <button
              type="button"
              class="custom-close-btn"
              @click="closeFormModal"
            >
              <span aria-hidden="true">&times;</span>
            </button> -->
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitVoucher">
              <div class="mb-2">
                <label class="form-label">
                  Mã voucher <span style="color: red">*</span>
                </label>
                <input
                  v-model="formVoucher.code"
                  class="form-control"
                  placeholder="Nhập mã voucher, ví dụ: SUMMER25"
                />
               
              </div>
              <div class="mb-2">
                <label class="form-label">
                  Phần trăm giảm (%) <span style="color: red">*</span>
                </label>
                <input
                  v-model="formVoucher.discountPercentage"
                  type="number"
                  min="1"
                  max="100"
                  class="form-control"
                  placeholder="Nhập số từ 1 đến 100"
                />
               
              </div>
              <div class="mb-2">
                <label class="form-label">
                  Ngày bắt đầu <span style="color: red">*</span>
                </label>
                <input
                  v-model="formVoucher.startTime"
                  type="datetime-local"
                  class="form-control"
                  placeholder="Chọn ngày bắt đầu"
                />
               
              </div>
              <div class="mb-2">
                <label class="form-label">
                  Ngày kết thúc <span style="color: red">*</span>
                </label>
                <input
                  v-model="formVoucher.endTime"
                  type="datetime-local"
                  class="form-control"
                  placeholder="Chọn ngày kết thúc"
                />
              
              </div>
              <div class="mb-2">
                <label class="form-label">
                  Giá trị đơn tối thiểu <span style="color: red">*</span>
                </label>
                <input
                  v-model="formVoucher.minOrderValue"
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="Nhập số tiền tối thiểu, ví dụ: 200000"
                />
               
              </div>
              <div class="mb-2">
                <label class="form-label">
                  Giá trị giảm tối đa <span style="color: red">*</span>
                </label>
                <input
                  v-model="formVoucher.maxDiscountValue"
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="Nhập số tiền tối đa được giảm, ví dụ: 50000"
                />
             
              </div>
              <!-- <div class="mb-2">
                <label class="form-label">
                  Trạng thái <span style="color: red">*</span>
                </label>
                <select v-model="formVoucher.status" class="form-select">
                  <option :value="1">Hoạt động</option>
                  <option :value="0">Không hoạt động</option>
                </select>
              
              </div> -->
              <!-- <div class="mb-2">
                <label class="form-label">Người tạo</label>
                <input
                  v-model="formVoucher.createdBy"
                  class="form-control"
                  required
                />
              </div> -->
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeFormModal"
                >
                  Hủy
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ isEdit ? "Cập nhật" : "Thêm mới" }}
                </button>
              </div>
            </form>
          </div>
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
import { showToast } from "@/utils/swalHelper";
import { Modal } from "bootstrap";
import { ref, computed, watch, onMounted } from "vue";
import {
  getVouchers,
  createVouchers,
  updateVouchers,
  deleteVouchers,
  upStatusVouchers,
} from "@/services/admin/voucher";

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
    const itemsPerPageOptions = ref([5, 10, 20, 50]);

    const listVoucher = ref([]);

    const searchQuery = ref("");
    const statusFilter = ref("");
    const showDetailModal = ref(false);
    const selectedVoucher = ref(null);
    const showFormModal = ref(false);
    const isEdit = ref(false);
    const formVoucher = ref({
      id: null,
      code: "",
      discountPercentage: "",
      startTime: "",
      endTime: "",
      minOrderValue: "",
      maxDiscountValue: "",
      status: 1,
      createdBy: "",
    });

    onMounted(() => {
      fetchVouchers();
    });

    async function fetchVouchers() {
      try {
        const res = await getVouchers({
          page: currentPage.value,
          size: pageSize.value,
          code: searchQuery.value || null,
          status:
            statusFilter.value === ""
              ? null
              : statusFilter.value === "Hoạt động"
              ? 1
              : 0,
        });

        listVoucher.value = res.content.map((v) => ({
          id: v.id,
          code: v.code,
          discountPercentage: v.discountPercentage,
          start_time: formatDate(v.startTime),
          end_time: formatDate(v.endTime),
          startTime: v.startTime, // giữ lại trường gốc
          endTime: v.endTime, // giữ lại trường gốc
          minOrderValue: v.minOrderValue,
          maxDiscountValue: v.maxDiscountValue,
          status: v.status,
          createdBy: v.createdBy,
        }));

        totalElements.value = res.totalElements;
        totalPages.value = res.totalPages;
      } catch (error) {
        console.error("Lỗi khi tải voucher:", error);
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

    // Dummy handlers for buttons (implement logic as needed)
    function showDetail(voucher) {
      selectedVoucher.value = voucher;
      showDetailModal.value = true;
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
        discountPercentage: "",
        startTime: "",
        endTime: "",
        minOrderValue: "",
        maxDiscountValue: "",
        status: 1,
        createdBy: "admin",
      };
      showFormModal.value = true;
    }
    // Thêm mới hoặc cập nhật voucher
    async function submitVoucher() {
      // Validate rỗng
      if (
        !formVoucher.value.code ||
        !formVoucher.value.discountPercentage ||
        !formVoucher.value.startTime ||
        !formVoucher.value.endTime ||
        formVoucher.value.minOrderValue === "" ||
        formVoucher.value.maxDiscountValue === "" ||
        formVoucher.value.status === "" ||
        !formVoucher.value.createdBy
      ) {
        showToast("error", "Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      // Validate số
      if (
        isNaN(formVoucher.value.discountPercentage) ||
        formVoucher.value.discountPercentage < 1 ||
        formVoucher.value.discountPercentage > 100
      ) {
        showToast("error", "Phần trăm giảm phải từ 1 đến 100!");
        return;
      }
      if (
        isNaN(formVoucher.value.minOrderValue) ||
        formVoucher.value.minOrderValue < 0
      ) {
        showToast("error", "Giá trị đơn tối thiểu phải >= 0!");
        return;
      }
      if (
        isNaN(formVoucher.value.maxDiscountValue) ||
        formVoucher.value.maxDiscountValue < 0
      ) {
        showToast("error", "Giá trị giảm tối đa phải >= 0!");
        return;
      }
      if (
        Number(formVoucher.value.maxDiscountValue) >
        Number(formVoucher.value.minOrderValue)
      ) {
        showToast(
          "error",
          "Giá trị giảm tối đa không được lớn hơn giá trị đơn tối thiểu!"
        );
        return;
      }

      // Validate ngày
      const start = new Date(formVoucher.value.startTime);
      const end = new Date(formVoucher.value.endTime);
      if (end <= start) {
        showToast("error", "Ngày kết thúc phải sau ngày bắt đầu!");
        return;
      }

      // Chuyển đổi ngày về ISO 8601
      const toISOString = (val) => (val ? new Date(val).toISOString() : null);

      const payload = {
        ...formVoucher.value,
        discountPercentage: Number(formVoucher.value.discountPercentage),
        minOrderValue: Number(formVoucher.value.minOrderValue),
        maxDiscountValue: Number(formVoucher.value.maxDiscountValue),
        status: Number(formVoucher.value.status),
        startTime: toISOString(formVoucher.value.startTime),
        endTime: toISOString(formVoucher.value.endTime),
      };

      try {
        if (isEdit.value) {
          await updateVouchers(payload);
          showToast("success", "Cập nhật voucher thành công!");
        } else {
          await createVouchers(payload);
          showToast("success", "Thêm voucher thành công!");
        }
        closeFormModal();
        fetchVouchers();
      } catch (error) {
        showToast("error", "Có lỗi xảy ra!");
      }
    }

    // Xóa voucher
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
          voucher.createdBy || "admin"
        );
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
        discountPercentage: voucher.discountPercentage,
        startTime: toInputDate(voucher.startTime), // lấy trường gốc
        endTime: toInputDate(voucher.endTime), // lấy trường gốc
        minOrderValue: voucher.minOrderValue,
        maxDiscountValue: voucher.maxDiscountValue,
        status: voucher.status,
        createdBy: voucher.createdBy || "admin",
      };
      showFormModal.value = true;
    }
    function closeFormModal() {
      showFormModal.value = false;
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
