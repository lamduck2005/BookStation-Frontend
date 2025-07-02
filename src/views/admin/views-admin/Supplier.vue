<template>
  <div class="mb-3 mt-3">
    <h6 class="text-muted">Quản lý / <strong>Nhà cung cấp</strong></h6>
  </div>
  <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
    <div
      class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
      style="background-color: #ecae9e"
    >
      <i class="bi bi-funnel-fill me-2 text-dark"></i>
      <h5 class="mb-0">Bộ lọc</h5>
    </div>
    <div class="row g-3 m-2 mt-0 p-0 align-items-end">
      <div class="col-md-3">
        <label class="form-label mb-1">Tên nhà cung cấp</label>
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Tên nhà cung cấp"
          v-model="supplierNameFilter"
          @input="onFilterChange"
        />
      </div>
      <div class="col-md-3">
        <label class="form-label mb-1">Người đại diện</label>
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Người đại diện"
          v-model="contactNameFilter"
          @input="onFilterChange"
        />
      </div>
      <div class="col-md-3">
        <label class="form-label mb-1">Email</label>
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Email"
          v-model="emailFilter"
          @input="onFilterChange"
        />
      </div>
      <div class="col-md-3">
        <label class="form-label mb-1">Trạng thái</label>
        <select
          class="form-select form-select-sm"
          v-model="statusFilter"
          @change="onFilterChange"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Hoạt động">Hoạt động</option>
          <option value="Không hoạt động">Không hoạt động</option>
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

  <div class="d-flex justify-content-end mb-3">
    <button
      @click="openAddSupplier"
      class="btn btn-primary btn-sm py-2"
      style="background-color: #33304e; border-color: #33304e"
    >
      <i class="bi bi-plus-circle me-1"></i>
      Thêm nhà cung cấp mới
    </button>
  </div>

  <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
    <div
      class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
      style="background-color: #ecae9e"
    >
      <strong>Danh sách nhà cung cấp</strong>
    </div>
    <div class="p-3">
      <table class="table align-middle text-center">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên nhà cung cấp</th>
            <th>Người đại diện</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Người tạo</th>
            <th colspan="3">Actions</th>
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
          <tr v-else-if="pagedSuppliers.length === 0">
            <td :colspan="9" class="py-4 text-center text-muted">
              Không có dữ liệu
            </td>
          </tr>
          <tr
            v-else
            v-for="(supplier, index) in pagedSuppliers"
            :key="supplier.id"
          >
            <td @click="showDetail(supplier)" style="cursor: pointer">
              {{ currentPage * pageSize + index + 1 }}
            </td>
            <td @click="showDetail(supplier)" style="cursor: pointer">
              {{ supplier.supplierName }}
            </td>
            <td @click="showDetail(supplier)" style="cursor: pointer">
              {{ supplier.contactName }}
            </td>
            <td @click="showDetail(supplier)" style="cursor: pointer">
              {{ supplier.phoneNumber }}
            </td>
            <td @click="showDetail(supplier)" style="cursor: pointer">
              {{ supplier.email }}
            </td>
            <td style="width: 200px">
              <ToggleStatus
                :id="supplier.id"
                v-model="supplier.status"
                :true-value="1"
                :false-value="0"
                active-text="Hoạt động"
                inactive-text="Không hoạt động"
                @change="handleStatusChange(supplier, $event)"
              />
            </td>
            <td @click="showDetail(supplier)" style="cursor: pointer">
              {{ supplier.createdBy }}
            </td>
            <td style="width: 100px">
              <div @click.stop>
                <EditButton @click="openEditSupplier(supplier)" />
                <!-- <DeleteButton @click="deleteSupplierHandler(supplier)" /> -->
              </div>
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
        @prev="handlePrev"
        @next="handleNext"
        @update:pageSize="handlePageSizeChange"
      />
    </div>
  </div>

  <!-- Modal Thêm/Cập nhật nhà cung cấp -->
  <div
    class="modal fade"
    id="addSupplierModal"
    tabindex="-1"
    aria-labelledby="addSupplierModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #ecae9e">
          <h5 class="modal-title" id="addSupplierModalLabel">
            <i class="bi me-2 bi-plus-circle"></i>
            {{ isEditMode ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp mới" }}
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
          <form @submit.prevent="submitSupplierForm">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">
                  Tên nhà cung cấp <span class="text-danger">*</span>
                </label>
                <input
                  v-model="supplierForm.supplierName"
                  class="form-control form-control-sm"
                  placeholder="Nhập tên nhà cung cấp"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label">
                  Người đại diện <span class="text-danger">*</span>
                </label>
                <input
                  v-model="supplierForm.contactName"
                  class="form-control form-control-sm"
                  placeholder="Nhập tên người đại diện"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label">
                  Số điện thoại <span class="text-danger">*</span>
                </label>
                <input
                  v-model="supplierForm.phoneNumber"
                  class="form-control form-control-sm"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label">
                  Email <span class="text-danger">*</span>
                </label>
                <input
                  v-model="supplierForm.email"
                  class="form-control form-control-sm"
                  placeholder="Nhập email"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label">
                  Địa chỉ <span class="text-danger">*</span>
                </label>
                <input
                  v-model="supplierForm.address"
                  class="form-control form-control-sm"
                  placeholder="Nhập địa chỉ"
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
          <!-- <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Hủy
          </button> -->
          <button
            type="button"
            class="btn btn-primary"
            @click="submitSupplierForm"
            style="background-color: #33304e; border-color: #33304e"
          >
            {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditButton from "@/components/common/EditButton.vue";

import DeleteButton from "@/components/common/DeleteButton.vue";
import ToggleStatus from "@/components/common/ToggleStatus.vue";
import { showToast } from "@/utils/swalHelper";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  upStatusSupplier,
} from "@/services/admin/supplier";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import { ref, watch, onMounted } from "vue";
import Pagination from "@/components/common/Pagination.vue";

export default {
  components: {
    Pagination,
    EditButton,
    DeleteButton,
    ToggleStatus,
  },
  setup() {
    // Phân trang & filter
    const currentPage = ref(0);
    const pageSize = ref(10);
    const totalElements = ref(0);
    const totalPages = ref(1);
    const isLastPage = ref(false);
    const itemsPerPageOptions = ref([2, 5, 10, 25, 50]);
    const pagedSuppliers = ref([]);
    const searchQuery = ref("");
    const statusFilter = ref("");
    const phoneFilter = ref("");

    // Thêm các biến filter riêng biệt
    const supplierNameFilter = ref("");
    const contactNameFilter = ref("");
    const emailFilter = ref("");

    // Modal & form
    const isEditMode = ref(false);
    const supplierForm = ref({
      supplierName: "",
      contactName: "",
      phoneNumber: "",
      email: "",
      address: "",
    });
    const editingSupplier = ref(null);
    const formError = ref("");
    const loading = ref(false);

    // Lấy dữ liệu từ API
    async function fetchSuppliers() {
      loading.value = true;
      try {
        const params = {
          page: currentPage.value,
          size: pageSize.value,
          supplierName: supplierNameFilter.value || undefined,
          contactName: contactNameFilter.value || undefined,
          email: emailFilter.value || undefined,
          status:
            statusFilter.value === ""
              ? undefined
              : statusFilter.value === "Hoạt động"
              ? 1
              : statusFilter.value === "Không hoạt động"
              ? 0
              : undefined,
        };
        const data = await getSuppliers(params);
        pagedSuppliers.value = (data.content || []).map((item) => ({
          ...item,
          status: item.status === 1 ? 1 : 0,
        }));
        totalElements.value = data.totalElements || 0;
        totalPages.value = data.totalPages || 1;
        isLastPage.value = currentPage.value >= totalPages.value - 1;
      } catch (e) {
        showToast("error", "Không thể tải danh sách nhà cung cấp!");
      } finally {
        loading.value = false;
      }
    }

    // Watchers: gọi lại API khi filter/page thay đổi
    watch(
      [
        currentPage,
        pageSize,
        supplierNameFilter,
        contactNameFilter,
        emailFilter,
        statusFilter,
      ],
      fetchSuppliers,
      { immediate: true }
    );
    // Chỉ reset về trang 1 khi đổi pageSize
    watch(pageSize, () => {
      currentPage.value = 0;
    });
    // Khi filter, chỉ fetch lại dữ liệu, không reset currentPage
    watch(
      [searchQuery, statusFilter, phoneFilter, currentPage],
      fetchSuppliers,
      { immediate: true }
    );

    function onFilterChange() {
      currentPage.value = 0;
      fetchSuppliers();
    }
    function resetFilter() {
      supplierNameFilter.value = "";
      contactNameFilter.value = "";
      emailFilter.value = "";
      statusFilter.value = "";
      currentPage.value = 0;
    }

    // Validate email và phone
    function isValidEmail(email) {
      const regex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
    }
    function isValidPhone(phone) {
      const regex = /^0\d{9}$/;
      return regex.test(phone);
    }

    // Toggle trạng thái nhà cung cấp
    async function toggleStatus(supplier) {
      const newStatus =
        supplier.status === "Hoạt động" ? "Không hoạt động" : "Hoạt động";
      try {
        await upStatusSupplier(supplier.id, newStatus, 1); // 1 là id user cập nhật, sửa cho phù hợp
        supplier.status = newStatus;
        showToast("success", "Đã thay đổi trạng thái.");
        await fetchSuppliers();
      } catch (error) {
        showToast("error", "Cập nhật trạng thái thất bại!");
      }
    }

    // Mở modal thêm nhà cung cấp
    function openAddSupplier() {
      isEditMode.value = false;
      formError.value = "";
      supplierForm.value = {
        supplierName: "",
        contactName: "",
        phoneNumber: "",
        email: "",
        address: "",
        createdBy: "admin",
      };
      const modalElement = document.getElementById("addSupplierModal");
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }

    // Mở modal chỉnh sửa nhà cung cấp
    function openEditSupplier(supplier) {
      isEditMode.value = true;
      formError.value = "";
      editingSupplier.value = supplier;
      supplierForm.value = {
        supplierName: supplier.supplierName,
        contactName: supplier.contactName,
        phoneNumber: supplier.phoneNumber,
        email: supplier.email,
        address: supplier.address,
      };
      const modalElement = document.getElementById("addSupplierModal");
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }

    // Đóng modal nhà cung cấp
    function closeSupplierModal() {
      editingSupplier.value = null;
      formError.value = "";
    }

    // Xóa nhà cung cấp
    async function deleteSupplierHandler(supplier) {
      Swal.fire({
        title: `Xác nhận xóa nhà cung cấp?`,
        text: `Bạn có chắc chắn muốn xóa nhà cung cấp "${supplier.supplierName}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteSupplier(supplier.id);
            showToast("success", "Đã xóa thành công.");
            await fetchSuppliers();
          } catch (error) {
            showToast("error", "Xóa thất bại!");
          }
        }
      });
    }

    // Hiển thị chi tiết nhà cung cấp
    function showDetail(supplier) {
      Swal.fire({
        title: `<strong style=display:block;padding:8px 0;border-radius:6px;color:#2c2c54;">Chi tiết nhà cung cấp</strong>`,
        html: `
      <div style="max-height:400px;overflow:auto">
        <table class="table table-bordered text-start" style="background:#ecae9e;border-radius:8px;">
          <tr><th>Tên nhà cung cấp</th><td>${
            supplier.supplierName ?? "Không có dữ liệu"
          }</td></tr>
          <tr><th>Người đại diện</th><td>${
            supplier.contactName ?? "Không có dữ liệu"
          }</td></tr>
          <tr><th>Số điện thoại</th><td>${
            supplier.phoneNumber ?? "Không có dữ liệu"
          }</td></tr>
          <tr><th>Email</th><td>${
            supplier.email ?? "Không có dữ liệu"
          }</td></tr>
          <tr><th>Địa chỉ</th><td>${
            supplier.address ?? "Không có dữ liệu"
          }</td></tr>
          <tr><th>Trạng thái</th><td>${
            supplier.status == 1 ? "Hoạt động" : "Không hoạt động"
          }</td></tr>
          <tr><th>Người tạo</th><td>${
            supplier.createdBy ?? "Không có dữ liệu"
          }</td></tr>
          <tr><th>Ngày tạo</th><td>${formatDateTime(
            supplier.createdAt
          )}</td></tr>
          <tr><th>Người cập nhật</th><td>${
            supplier.updatedBy ?? "Không có dữ liệu"
          }</td></tr>
          <tr><th>Ngày cập nhật</th><td>${formatDateTime(
            supplier.updatedAt
          )}</td></tr>
        </table>
      </div>
    `,
        width: 600,
        confirmButtonText: "Đóng",
      });
    }

    // Hàm phân trang
    function handlePrev() {
      if (currentPage.value > 0) currentPage.value--;
    }
    function handleNext() {
      if (currentPage.value < totalPages.value - 1) currentPage.value++;
    }
    function handlePageSizeChange(newSize) {
      pageSize.value = newSize;
      currentPage.value = 0;
    }

    // Submit form thêm/sửa nhà cung cấp
    async function submitSupplierForm() {
      const { supplierName, contactName, phoneNumber, email, address } =
        supplierForm.value;
      if (!supplierName || !contactName || !phoneNumber || !email || !address) {
        formError.value = "Vui lòng điền đầy đủ thông tin bắt buộc (*)";
        return;
      }
      if (!isValidEmail(email)) {
        formError.value = "Email không hợp lệ";
        return;
      }
      if (!isValidPhone(phoneNumber)) {
        formError.value =
          "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 số)";
        return;
      }

      try {
        if (isEditMode.value && editingSupplier.value) {
          // Cập nhật
          await updateSupplier({
            id: editingSupplier.value.id,
            supplierName,
            contactName,
            phoneNumber,
            email,
            address,
            updatedBy: "admin",
          });
          showToast("success", "Đã cập nhật thành công.");
        } else {
          // Thêm mới
          await createSupplier({
            supplierName,
            contactName,
            phoneNumber,
            email,
            address,
            createdBy: "admin",
          });
          showToast("success", "Đã thêm thành công.");
        }
        // Đóng modal
        const modalElement = document.getElementById("addSupplierModal");
        const modal = Modal.getOrCreateInstance(modalElement);
        modal.hide();
        // Reload lại danh sách
        await fetchSuppliers();
      } catch (error) {
        formError.value = "Có lỗi xảy ra khi lưu nhà cung cấp!";
      }
    }

    function formatDateTime(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString("vi-VN", {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    const handleStatusChange = async (supplier, newStatus) => {
      try {
        await upStatusSupplier(supplier.id, newStatus, "admin"); // truyền "admin" là string
        showToast("success", "Đã thay đổi trạng thái.");
        await fetchSuppliers();
      } catch (error) {
        showToast("error", "Cập nhật trạng thái thất bại!");
      }
    };

    return {
      // Phân trang
      currentPage,
      pageSize,
      totalPages,
      totalElements,
      isLastPage,
      itemsPerPageOptions,
      // Dữ liệu
      pagedSuppliers,
      // Bộ lọc
      searchQuery,
      statusFilter,
      phoneFilter,
      supplierNameFilter,
      contactNameFilter,
      emailFilter,
      statusFilter,
      onFilterChange,
      resetFilter,
      // Modal & form
      isEditMode,
      supplierForm,
      editingSupplier,
      formError,
      openAddSupplier,
      openEditSupplier,
      closeSupplierModal,
      submitSupplierForm,
      deleteSupplierHandler,
      toggleStatus,
      showDetail,
      // Phân trang
      handlePrev,
      handleNext,
      handlePageSizeChange,
      handleStatusChange,
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
