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
      <div class="col-md-6">
        <label class="form-label mb-1">Tìm kiếm</label>
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Tên nhà cung cấp, đại diện, email"
          v-model="searchQuery"
          @input="onFilterChange"
        />
      </div>
      <div class="col-md-6">
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
          <tr v-for="(supplier, index) in pagedSuppliers" :key="supplier.id">
            <td>{{ currentPage * pageSize + index + 1 }}</td>
            <td>{{ supplier.supplierName }}</td>
            <td>{{ supplier.contactName }}</td>
            <td>{{ supplier.phone }}</td>
            <td>{{ supplier.email }}</td>
            <td class="status-cell align-middle">
              <div
                class="d-flex align-items-center gap-2 justify-content-center"
              >
                <label class="switch m-0">
                  <input
                    type="checkbox"
                    :checked="supplier.status === 'Hoạt động'"
                    @change="toggleStatus(supplier)"
                  />
                  <span class="slider round"></span>
                </label>
                <span
                  class="badge"
                  :class="
                    supplier.status === 'Hoạt động'
                      ? 'bg-success-subtle text-success'
                      : 'bg-secondary-subtle text-secondary'
                  "
                  style="
                    font-weight: 700;
                    min-width: 130px;
                    padding-top: 3%;
                    height: 30px;
                    font-size: 13px;
                  "
                >
                  {{ supplier.status }}
                </span>
              </div>
            </td>
            <td>{{ supplier.createdBy }}</td>
            <td >
             
                <button
                 
                  data-tooltip="Chi tiết"
                  @click="showDetail(supplier)"
                  style="min-width: 32px; margin-right: 5px"
                >
                  <i class="bi bi-info-circle fs-6"></i>
                </button>
                <button
               
                  data-tooltip="Cập nhật"
                  @click="openEditSupplier(supplier)"
                  style="min-width: 32px; margin-right: 5px"
                >
                  <i class="bi bi-pencil fs-6"></i>
                </button>
                <button
                 
                  data-tooltip="Xóa"
                  @click="deleteSupplier(supplier)"
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
                  v-model="supplierForm.phone"
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
    const isLastPage = computed(() => currentPage.value >= totalPages.value - 1);
    const itemsPerPageOptions = ref([5, 10, 25, 50]);

    // Dữ liệu nhà cung cấp
    const listSupplier = ref([
      {
        id: 1,
        supplierName: "Nhà cung cấp A",
        contactName: "Nguyễn Văn A",
        phone: "0123456789",
        email: "NXXA@gmail.com",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        status: "Hoạt động",
        createdAt: "2023-10-01 10:00:00",
        updatedAt: "2023-10-01 10:00:00",
        createdBy: "admin",
        updatedBy: "admin",
      },
    ]);

    // Bộ lọc
    const searchQuery = ref("");
    const statusFilter = ref("");
    const phoneFilter = ref("");

    // Modal & form
    const isEditMode = ref(false);
    const supplierForm = ref({
      supplierName: "",
      contactName: "",
      phone: "",
      email: "",
      address: "",
    });
    const editingSupplier = ref(null);
    const formError = ref("");

    // Lọc và phân trang
    const pagedSuppliers = computed(() => {
      let filtered = listSupplier.value;

      // Lọc theo searchQuery (tên, đại diện, email)
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.supplierName.toLowerCase().includes(q) ||
            s.contactName.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q)
        );
      }
      // Lọc theo trạng thái
      if (statusFilter.value) {
        filtered = filtered.filter((s) => s.status === statusFilter.value);
      }
      // Lọc theo SĐT
      if (phoneFilter.value) {
        filtered = filtered.filter((s) => s.phone.includes(phoneFilter.value));
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
    watch([pageSize, searchQuery, statusFilter, phoneFilter], () => {
      currentPage.value = 0;
    });

    // Methods
    function onFilterChange() {
      currentPage.value = 0;
    }
    function resetFilter() {
      searchQuery.value = "";
      statusFilter.value = "";
      phoneFilter.value = "";
      currentPage.value = 0;
    }
    function isValidEmail(email) {
      const regex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
    }
    function isValidPhone(phone) {
      const regex = /^0\d{9}$/;
      return regex.test(phone);
    }
    function toggleStatus(supplier) {
      supplier.status =
        supplier.status === "Hoạt động" ? "Không hoạt động" : "Hoạt động";
      showToast("success", "Đã thay đổi trạng thái.");
    }
    function openAddSupplier() {
      isEditMode.value = false;
      formError.value = "";
      supplierForm.value = {
        supplierName: "",
        contactName: "",
        phone: "",
        email: "",
        address: "",
      };
      const modalElement = document.getElementById("addSupplierModal");
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
    function openEditSupplier(supplier) {
      isEditMode.value = true;
      formError.value = "";
      editingSupplier.value = supplier;
      supplierForm.value = {
        supplierName: supplier.supplierName,
        contactName: supplier.contactName,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
      };
      const modalElement = document.getElementById("addSupplierModal");
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
    function closeSupplierModal() {
      editingSupplier.value = null;
      formError.value = "";
    }
    function submitSupplierForm() {
      const { supplierName, contactName, phone, email, address } =
        supplierForm.value;
      if (!supplierName || !contactName || !phone || !email || !address) {
        formError.value = "Vui lòng điền đầy đủ thông tin bắt buộc (*)";
        return;
      }
      if (!isValidEmail(email)) {
        formError.value = "Email không hợp lệ";
        return;
      }
      if (!isValidPhone(phone)) {
        formError.value =
          "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 số)";
        return;
      }
      if (isEditMode.value && editingSupplier.value) {
        Object.assign(editingSupplier.value, {
          supplierName,
          contactName,
          phone,
          email,
          address,
          updatedAt: new Date().toISOString(),
          updatedBy: "admin",
        });
        showToast("success", "Đã cập nhật thành công.");
      } else {
        listSupplier.value.push({
          id: Date.now(),
          supplierName,
          contactName,
          phone,
          email,
          address,
          status: "Hoạt động",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "admin",
          updatedBy: "admin",
        });
        showToast("success", "Đã thêm thành công.");
      }
      // Đóng modal bằng Bootstrap JS
      const modalElement = document.getElementById("addSupplierModal");
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.hide();
    }
    function deleteSupplier(supplier) {
      Swal.fire({
        title: `Xác nhận xóa nhà cung cấp?`,
        text: `Bạn có chắc chắn muốn xóa nhà cung cấp \"${supplier.supplierName}\"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          listSupplier.value = listSupplier.value.filter(
            (s) => s.id !== supplier.id
          );
          showToast("success", "Đã xóa thành công.");
        }
      });
    }
    function formatDateTime(dateStr) {
      const date = new Date(dateStr);
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
    function showDetail(supplier) {
      Swal.fire({
        title: `<strong>Chi tiết nhà cung cấp</strong>`,
        html: `
      <div style="text-align: left; font-size: 14px;">
        <p><strong>Tên nhà cung cấp:</strong> ${supplier.supplierName}</p>
        <p><strong>Người đại diện:</strong> ${supplier.contactName}</p>
        <p><strong>Số điện thoại:</strong> ${supplier.phone}</p>
        <p><strong>Email:</strong> ${supplier.email}</p>
        <p><strong>Địa chỉ:</strong> ${supplier.address}</p>
        <p><strong>Trạng thái:</strong> ${supplier.status}</p>
        <p><strong>Người tạo:</strong> ${supplier.createdBy}</p>
        <p><strong>Ngày tạo:</strong> ${formatDateTime(supplier.createdAt)}</p>
        <p><strong>Người cập nhật:</strong> ${supplier.updatedBy}</p>
        <p><strong>Ngày cập nhật:</strong> ${formatDateTime(
          supplier.updatedAt
        )}</p>
      </div>
    `,
        confirmButtonText: "Đóng",
      });
    }
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

    return {
      // Phân trang
      currentPage,
      pageSize,
      totalPages,
      totalElements,
      isLastPage,
      itemsPerPageOptions,
      // Dữ liệu
      listSupplier,
      pagedSuppliers,
      // Bộ lọc
      searchQuery,
      statusFilter,
      phoneFilter,
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
      deleteSupplier,
      toggleStatus,
      showDetail,
      // Phân trang
      handlePrev,
      handleNext,
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
