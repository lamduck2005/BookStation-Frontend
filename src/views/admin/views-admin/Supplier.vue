<template>
  <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
    <div
      class="d-flex align-items-center mb-3 text-bg-secondary p-2 m-0 rounded-top"
    >
      <i class="bi bi-funnel-fill me-2 text-dark"></i>
      <h5 class="mb-0">Bộ lọc</h5>
    </div>
    <div class="row g-3 m-2 mt-0 p-0 align-items-end">
      <div class="col-md-4">
        <label class="form-label mb-1">Tìm kiếm</label>
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Tên nhà cung cấp, đại diện, email"
          v-model="searchQuery"
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
      <div class="col-md-3">
        <label class="form-label mb-1">Số điện thoại</label>
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Nhập SĐT"
          v-model="phoneFilter"
          @input="onFilterChange"
        />
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button
          class="btn btn-outline-secondary btn-sm w-30"
          style="margin-left: 20px"
          @click="resetFilter"
        >
          <i class="bi bi-arrow-clockwise"></i>
        </button>
      </div>
    </div>
  </div>

  <div
    class="d-flex justify-content-end mb-3"
    style="margin-top: 10px; margin-right: 20px"
  >
    <button @click="openAddSupplier" class="custom-add-btn">
      <i class="bi bi-plus-circle me-2"></i>
      <strong style="font-weight: normal">Thêm nhà cung cấp mới</strong>
    </button>
  </div>

  <div class="dashboard-container">
    <div class="dashboard-table">
      <table id="main-table" class="display">
        <thead>
          <tr class="text-center">
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
        <tbody class="text-center">
          <tr v-for="(supplier, index) in pagedSuppliers" :key="supplier.id">
            <td>{{ (pageNumber - 1) * pageSize + index + 1 }}</td>
            <td>{{ supplier.supplierName }}</td>
            <td>{{ supplier.contactName }}</td>
            <td>{{ supplier.phone }}</td>
            <td>{{ supplier.email }}</td>
            <td class="status-cell align-middle">
              <div class="d-flex align-items-center gap-2">
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
                    padding-top: 5%;
                    height: 30px;
                  "
                >
                  {{ supplier.status }}
                </span>
              </div>
            </td>
            <td>{{ supplier.createdBy }}</td>
            <td class="action-cell">
              <div class="d-flex justify-content-center gap-2">
                <button
                  class="btn btn-light btn-sm p-1 tooltip-custom"
                  data-tooltip="Chi tiết"
                  @click="showDetail(supplier)"
                  style="min-width: 32px"
                >
                  <i class="bi bi-info-circle fs-6"></i>
                </button>
                <button
                  class="btn btn-light btn-sm p-1 tooltip-custom"
                  data-tooltip="Cập nhật"
                  @click="openEditSupplier(supplier)"
                  style="min-width: 32px"
                >
                  <i class="bi bi-pencil fs-6"></i>
                </button>
                <button
                  class="btn btn-light btn-sm p-1 tooltip-custom"
                  data-tooltip="Xóa"
                  @click="deleteSupplier(supplier)"
                  style="min-width: 32px"
                >
                  <i class="bi bi-trash fs-6 text-danger"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <Pagination
        :page-number="pageNumber"
        :total-pages="totalPages"
        :is-last-page="isLastPage"
        :page-size="pageSize"
        :items-per-page-options="itemsPerPageOptions"
        :total-elements="totalElements"
        @prev="prevPage"
        @next="nextPage"
        @update:pageSize="(val) => (pageSize = val)"
      />
      <!-- Pagination -->
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Common/Pagination.vue";
import Swal from "sweetalert2";
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      listSupplier: [
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
      ],
      // Thêm các biến phân trang
      pageNumber: 1,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1,
      isLastPage: false,
      itemsPerPageOptions: [2, 5, 10, 20, 50],
      // Bộ lọc
      searchQuery: "",
      statusFilter: "",
      phoneFilter: "",
    };
  },
  computed: {
    pagedSuppliers() {
      let filtered = this.listSupplier;

      // Lọc theo searchQuery (tên, đại diện, email)
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.supplierName.toLowerCase().includes(q) ||
            s.contactName.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q)
        );
      }
      // Lọc theo trạng thái
      if (this.statusFilter) {
        filtered = filtered.filter((s) => s.status === this.statusFilter);
      }
      // Lọc theo SĐT
      if (this.phoneFilter) {
        filtered = filtered.filter((s) => s.phone.includes(this.phoneFilter));
      }

      this.totalElements = filtered.length;
      this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
      this.isLastPage = this.pageNumber >= this.totalPages;

      const start = (this.pageNumber - 1) * this.pageSize;
      return filtered.slice(start, start + this.pageSize);
    },
  },
  watch: {
    pageSize() {
      this.pageNumber = 1;
    },
  },
  methods: {
    onFilterChange() {
      this.pageNumber = 1;
    },
    resetFilter() {
      this.searchQuery = "";
      this.statusFilter = "";
      this.phoneFilter = "";
      this.pageNumber = 1;
    },
    isValidEmail(email) {
      const regex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
    },
    isValidPhone(phone) {
      const regex = /^0\d{9}$/;
      return regex.test(phone);
    },
    toggleStatus(supplier) {
      supplier.status =
        supplier.status === "Hoạt động" ? "Không hoạt động" : "Hoạt động";
      Swal.fire("Thành công!", "Đã thay đổi trạng thái.", "success");
    },
    async openAddSupplier() {
      const { value: formValues } = await Swal.fire({
        title: "Thêm nhà cung cấp mới",
        html: `
      <style>
    .custom-swal-input {
      width: 100%;
      padding: 8px 12px;
      margin-top: 5px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 14px;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .custom-swal-input:focus {
      border-color: #3b82f6;
      outline: none;
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.4);
    }
    .swal2-popup label {
      font-weight: 600;
      margin-bottom: 5px;
      display: block;
      font-size: 14px;
    }
    .required-star {
      color: red;
      margin-left: 3px;
    }
  </style>
      <div style="text-align: left; font-size: 14px;">
        <div style="margin-bottom: 12px;">
          <label for="swal-supplierName">Tên nhà cung cấp:<span class="required-star">*</span></label>
          <input id="swal-supplierName" class="custom-swal-input" placeholder="Nhập tên nhà cung cấp">
        </div>
        <div style="margin-bottom: 12px;">
          <label for="swal-contactName">Người đại diện:<span class="required-star">*</span></label>
          <input id="swal-contactName" class="custom-swal-input" placeholder="Nhập tên người đại diện">
        </div>
        <div style="margin-bottom: 12px;">
          <label for="swal-phone">Số điện thoại:<span class="required-star">*</span></label>
          <input id="swal-phone" class="custom-swal-input" placeholder="Nhập số điện thoại">
        </div>
        <div style="margin-bottom: 12px;">
          <label for="swal-email">Email:<span class="required-star">*</span></label>
          <input id="swal-email" class="custom-swal-input" placeholder="Nhập email">
        </div>
        <div style="margin-bottom: 12px;">
          <label for="swal-address">Địa chỉ:<span class="required-star">*</span></label>
          <input id="swal-address" class="custom-swal-input" placeholder="Nhập địa chỉ">
        </div>
      </div>
    `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Thêm",
        cancelButtonText: "Hủy",
        preConfirm: () => {
          const supplierName = document
            .getElementById("swal-supplierName")
            .value.trim();
          const contactName = document
            .getElementById("swal-contactName")
            .value.trim();
          const phone = document.getElementById("swal-phone").value.trim();
          const email = document.getElementById("swal-email").value.trim();
          const address = document.getElementById("swal-address").value.trim();

          if (!supplierName || !contactName || !phone || !email || !address) {
            Swal.showValidationMessage(
              "Vui lòng điền đầy đủ thông tin bắt buộc (*)"
            );
            return false;
          }
          if (!this.isValidEmail(email)) {
            Swal.showValidationMessage("Email không hợp lệ");
            return false;
          }
          if (!this.isValidPhone(phone)) {
            Swal.showValidationMessage(
              "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 số)"
            );
            return false;
          }

          return { supplierName, contactName, phone, email, address };
        },
      });

      if (formValues) {
        const newSupplier = {
          id: Date.now(), // hoặc logic tạo id khác
          ...formValues,
          status: "Hoạt động",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "admin",
          updatedBy: "admin",
        };

        this.listSupplier.push(newSupplier);
        Swal.fire("Thành công!", "Đã thêm nhà cung cấp mới.", "success");
      }
    },
    async openEditSupplier(supplier) {
      const { value: formValues } = await Swal.fire({
        title: "Cập nhật nhà cung cấp",
        html: `

            <style>
    .custom-swal-input {
      width: 100%;
      padding: 8px 12px;
      margin-top: 5px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 14px;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .custom-swal-input:focus {
      border-color: #3b82f6;
      outline: none;
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.4);
    }
    .swal2-popup label {
      font-weight: 600;
      margin-bottom: 5px;
      display: block;
      font-size: 14px;
    }
    .required-star {
      color: red;
      margin-left: 3px;
    }
  </style>
          <div style="text-align: left; font-size: 14px;">
            <div style="margin-bottom: 12px;">
              <label for="swal-supplierName">Tên nhà cung cấp:<span class="required-star">*</span></label>
              <input id="swal-supplierName" class="custom-swal-input" value="${supplier.supplierName}">
            </div>
            <div style="margin-bottom: 12px;">
              <label for="swal-contactName">Người đại diện:<span class="required-star">*</span></label>
              <input id="swal-contactName" class="custom-swal-input" value="${supplier.contactName}">
            </div>
            <div style="margin-bottom: 12px;">
              <label for="swal-phone">Số điện thoại:<span class="required-star">*</span></label>
              <input id="swal-phone" class="custom-swal-input" value="${supplier.phone}">
            </div>
            <div style="margin-bottom: 12px;">
              <label for="swal-email">Email:<span class="required-star">*</span></label>
              <input id="swal-email" class="custom-swal-input" value="${supplier.email}">
            </div>
            <div style="margin-bottom: 12px;">
              <label for="swal-address">Địa chỉ:<span class="required-star">*</span></label>
              <input id="swal-address" class="custom-swal-input" value="${supplier.address}">
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Lưu",
        cancelButtonText: "Hủy",
        preConfirm: () => {
          const supplierName = document
            .getElementById("swal-supplierName")
            .value.trim();
          const contactName = document
            .getElementById("swal-contactName")
            .value.trim();
          const phone = document.getElementById("swal-phone").value.trim();
          const email = document.getElementById("swal-email").value.trim();
          const address = document.getElementById("swal-address").value.trim();

          if (!supplierName || !contactName || !phone || !email || !address) {
            Swal.showValidationMessage(
              "Vui lòng điền đầy đủ thông tin bắt buộc (*)"
            );
            return false;
          }
          if (!this.isValidEmail(email)) {
            Swal.showValidationMessage("Email không hợp lệ");
            return false;
          }
          if (!this.isValidPhone(phone)) {
            Swal.showValidationMessage(
              "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 số)"
            );
            return false;
          }

          return { supplierName, contactName, phone, email, address };
        },
      });

      if (formValues) {
        Object.assign(supplier, {
          ...formValues,
          updatedAt: new Date().toISOString(),
          updatedBy: "admin",
        });
        Swal.fire("Thành công!", "Đã cập nhật nhà cung cấp.", "success");
      }
    },
    deleteSupplier(supplier) {
      Swal.fire({
        title: `Xác nhận xóa nhà cung cấp?`,
        text: `Bạn có chắc chắn muốn xóa nhà cung cấp \"${supplier.supplierName}\"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          this.listSupplier = this.listSupplier.filter(
            (s) => s.id !== supplier.id
          );
          Swal.fire("Đã xóa!", "Nhà cung cấp đã được xóa.", "success");
        }
      });
    },

    formatDateTime(dateStr) {
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
    },

    showDetail(supplier) {
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
        <p><strong>Ngày tạo:</strong> ${this.formatDateTime(
          supplier.createdAt
        )}</p>
        <p><strong>Người cập nhật:</strong> ${supplier.updatedBy}</p>
        <p><strong>Ngày cập nhật:</strong> ${this.formatDateTime(
          supplier.updatedAt
        )}</p>
      </div>
    `,
        confirmButtonText: "Đóng",
      });
    },
    prevPage() {
      if (this.pageNumber > 1) this.pageNumber--;
    },
    nextPage() {
      if (this.pageNumber < this.totalPages) this.pageNumber++;
    },
  },
};
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
  margin-right: -10px;
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

th {
  font-weight: 700 !important;
  font-size: 14px !important;
  letter-spacing: 0.01em;
  padding-top: 7px !important;
  padding-bottom: 7px !important;
  background: #e41414;
}

td {
  font-size: 15px !important;
  vertical-align: middle !important;
}
</style>
