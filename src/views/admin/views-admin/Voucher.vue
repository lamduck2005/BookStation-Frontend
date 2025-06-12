<template>
  <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
    <div
      class="d-flex align-items-center mb-3 text-bg-secondary p-2 m-0 rounded-top"
    >
      <i class="bi bi-funnel-fill me-2 text-dark"></i>
      <h5 class="mb-0">Bộ lọc</h5>
    </div>
    <div class="row g-3 m-2 mt-0 p-0 align-items-end">
      <div class="col-md-5">
        <label class="form-label mb-1">Tìm kiếm</label>
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Mã voucher, trạng thái, người tạo"
          v-model="searchQuery"
          @input="onFilterChange"
        />
      </div>
      <div class="col-md-5">
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
    <button @click="openAddVoucher" class="custom-add-btn">
      <i class="bi bi-plus-circle me-2"></i>
      <strong style="font-weight: normal">Thêm voucher mới</strong>
    </button>
  </div>

  <div class="dashboard-container">
    <div class="dashboard-table">
      <table id="main-table" class="display">
        <thead>
          <tr class="text-center">
            <th>STT</th>
            <th>Mã voucher</th>
            <th>Phần trăm giảm</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Đơn tối thiểu</th>
            <th>Giảm tối đa</th>
            <th>Trạng thái</th>
            <th>Người tạo</th>
            <th colspan="3">Actions</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="(voucher, index) in pagedVouchers" :key="voucher.id">
            <td>{{ (pageNumber - 1) * pageSize + index + 1 }}</td>
            <td>{{ voucher.code }}</td>
            <td>{{ voucher.discountPercentage }}</td>
            <td>{{ voucher.start_time }}</td>
            <td>{{ voucher.end_time }}</td>
            <td>{{ voucher.minOrderValue }}</td>
            <td>{{ voucher.maxDiscountValue }}</td>
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
            <td class="action-cell">
              <div class="d-flex justify-content-center gap-2">
                <button
                  class="btn btn-light btn-sm p-1 tooltip-custom"
                  data-tooltip="Chi tiết"
                  @click="showDetail(voucher)"
                  style="min-width: 32px"
                >
                  <i class="bi bi-info-circle fs-6"></i>
                </button>
                <button
                  class="btn btn-light btn-sm p-1 tooltip-custom"
                  data-tooltip="Cập nhật"
                  @click="openEditVoucher(voucher)"
                  style="min-width: 32px"
                >
                  <i class="bi bi-pencil fs-6"></i>
                </button>
                <button
                  class="btn btn-light btn-sm p-1 tooltip-custom"
                  data-tooltip="Xóa"
                  @click="deleteVoucher(voucher)"
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
      listVoucher: [
        {
          id: 1,
          code: "DG-001",
          discountPercentage: "10%",
          start_time: "2023-10-01 00:00:00",
          end_time: "2023-10-31 23:59:59",
          minOrderValue: "100000",
          maxDiscountValue: "50000",
          status: "Hoạt động",
          createdAt: "2023-10-01 10:00:00",
          updatedAt: "2023-10-01 10:00:00",
          createdBy: "admin",
          updatedBy: "admin",
        },
      ],
      pageNumber: 1,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1,
      isLastPage: false,
      itemsPerPageOptions: [2, 5, 10, 20, 50],
      searchQuery: "",
      statusFilter: "",
      createdByFilter: "",
    };
  },
  computed: {
    pagedVouchers() {
      let filtered = this.listVoucher;

      // Lọc theo searchQuery (mã voucher, trạng thái)
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.code.toLowerCase().includes(q) ||
            v.status.toLowerCase().includes(q) ||
            v.createdBy.toLowerCase().includes(q)
        );
      }
      // Lọc theo trạng thái
      if (this.statusFilter) {
        filtered = filtered.filter((v) => v.status === this.statusFilter);
      }
      // Lọc theo người tạo
      if (this.createdByFilter) {
        filtered = filtered.filter((v) =>
          v.createdBy.toLowerCase().includes(this.createdByFilter.toLowerCase())
        );
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
      this.createdByFilter = "";
      this.pageNumber = 1;
    },
    showDetail(voucher) {
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
    },
    async openAddVoucher() {
      const { value: formValues } = await Swal.fire({
        title: "Thêm voucher mới",
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
      <div style="text-align:left">
        <label><b>Mã voucher <span class="required-star">*</span></b></label>
        <input id="swal-code" class="custom-swal-input" placeholder="Nhập mã voucher">
        <label><b>Phần trăm giảm (%) <span class="required-star">*</span></b></label>
        <input id="swal-discount" class="custom-swal-input" placeholder="Nhập phần trăm giảm">
        <label><b>Ngày bắt đầu <span class="required-star">*</span></b></label>
        <input id="swal-start" class="custom-swal-input" type="datetime-local">
        <label><b>Ngày kết thúc <span class="required-star">*</span></b></label>
        <input id="swal-end" class="custom-swal-input" type="datetime-local">
        <label><b>Đơn tối thiểu <span class="required-star">*</span></b></label>
        <input id="swal-min" class="custom-swal-input" placeholder="Nhập giá trị đơn tối thiểu">
        <label><b>Giảm tối đa <span class="required-star">*</span></b></label>
        <input id="swal-max" class="custom-swal-input" placeholder="Nhập giá trị giảm tối đa">
      </div>
    `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Thêm",
        cancelButtonText: "Hủy",
        preConfirm: () => {
          const code = document.getElementById("swal-code").value.trim();
          const discount = document
            .getElementById("swal-discount")
            .value.trim();
          const start = document.getElementById("swal-start").value;
          const end = document.getElementById("swal-end").value;
          const min = document.getElementById("swal-min").value.trim();
          const max = document.getElementById("swal-max").value.trim();

          // Validate mã voucher
          if (!code) {
            Swal.showValidationMessage("Vui lòng nhập mã voucher!");
            return false;
          }
          if (code.length < 3 || code.length > 20) {
            Swal.showValidationMessage("Mã voucher phải từ 3-20 ký tự!");
            return false;
          }
          // Validate phần trăm giảm
          if (!discount) {
            Swal.showValidationMessage("Vui lòng nhập phần trăm giảm!");
            return false;
          }
          if (
            isNaN(Number(discount)) ||
            Number(discount) <= 0 ||
            Number(discount) > 100
          ) {
            Swal.showValidationMessage(
              "Phần trăm giảm phải là số từ 1 đến 100!"
            );
            return false;
          }
          // Validate ngày bắt đầu/kết thúc
          if (!start) {
            Swal.showValidationMessage("Vui lòng chọn ngày bắt đầu!");
            return false;
          }
          if (!end) {
            Swal.showValidationMessage("Vui lòng chọn ngày kết thúc!");
            return false;
          }
          if (new Date(start) >= new Date(end)) {
            Swal.showValidationMessage("Ngày kết thúc phải sau ngày bắt đầu!");
            return false;
          }
          // Validate đơn tối thiểu
          if (!min) {
            Swal.showValidationMessage("Vui lòng nhập giá trị đơn tối thiểu!");
            return false;
          }
          if (isNaN(Number(min)) || Number(min) < 0) {
            Swal.showValidationMessage("Đơn tối thiểu phải là số không âm!");
            return false;
          }
          // Validate giảm tối đa
          if (!max) {
            Swal.showValidationMessage("Vui lòng nhập giá trị giảm tối đa!");
            return false;
          }
          if (isNaN(Number(max)) || Number(max) < 0) {
            Swal.showValidationMessage("Giảm tối đa phải là số không âm!");
            return false;
          }
          // Validate giảm tối đa không lớn hơn đơn tối thiểu
          if (Number(max) > Number(min)) {
            Swal.showValidationMessage(
              "Giảm tối đa không được lớn hơn đơn tối thiểu!"
            );
            return false;
          }
          return {
            code,
            discountPercentage: discount + "%",
            start_time: start.replace("T", " "),
            end_time: end.replace("T", " "),
            minOrderValue: min,
            maxDiscountValue: max,
          };
        },
      });

      if (formValues) {
        const now = new Date().toISOString().slice(0, 19).replace("T", " ");
        this.listVoucher.push({
          id: Date.now(),
          ...formValues,
          status: "Hoạt động",
          createdAt: now,
          updatedAt: now,
          createdBy: "admin",
          updatedBy: "admin",
        });
        Swal.fire("Thành công!", "Đã thêm voucher mới.", "success");
      }
    },
    async openEditVoucher(voucher) {
      const { value: formValues } = await Swal.fire({
        title: "Cập nhật voucher",
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
      <div style="text-align:left">
        <label><b>Mã voucher <span class="required-star">*</span></b></label>
        <input id="swal-code" class="custom-swal-input" value="${
          voucher.code
        }" placeholder="Nhập mã voucher">
        <label><b>Phần trăm giảm (%) <span class="required-star">*</span></b></label>
        <input id="swal-discount" class="custom-swal-input" value="${voucher.discountPercentage.replace(
          "%",
          ""
        )}" placeholder="Nhập phần trăm giảm">
        <label><b>Ngày bắt đầu <span class="required-star">*</span></b></label>
        <input id="swal-start" class="custom-swal-input" type="datetime-local" value="${voucher.start_time.replace(
          " ",
          "T"
        )}">
        <label><b>Ngày kết thúc <span class="required-star">*</span></b></label>
        <input id="swal-end" class="custom-swal-input" type="datetime-local" value="${voucher.end_time.replace(
          " ",
          "T"
        )}">
        <label><b>Đơn tối thiểu <span class="required-star">*</span></b></label>
        <input id="swal-min" class="custom-swal-input" value="${
          voucher.minOrderValue
        }" placeholder="Nhập giá trị đơn tối thiểu">
        <label><b>Giảm tối đa <span class="required-star">*</span></b></label>
        <input id="swal-max" class="custom-swal-input" value="${
          voucher.maxDiscountValue
        }" placeholder="Nhập giá trị giảm tối đa">
      </div>
    `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Lưu",
        cancelButtonText: "Hủy",
        preConfirm: () => {
          const code = document.getElementById("swal-code").value.trim();
          const discount = document
            .getElementById("swal-discount")
            .value.trim();
          const start = document.getElementById("swal-start").value;
          const end = document.getElementById("swal-end").value;
          const min = document.getElementById("swal-min").value.trim();
          const max = document.getElementById("swal-max").value.trim();

          // Validate mã voucher
          if (!code) {
            Swal.showValidationMessage("Vui lòng nhập mã voucher!");
            return false;
          }
          if (code.length < 3 || code.length > 20) {
            Swal.showValidationMessage("Mã voucher phải từ 3-20 ký tự!");
            return false;
          }
          // Validate phần trăm giảm
          if (!discount) {
            Swal.showValidationMessage("Vui lòng nhập phần trăm giảm!");
            return false;
          }
          if (
            isNaN(Number(discount)) ||
            Number(discount) <= 0 ||
            Number(discount) > 100
          ) {
            Swal.showValidationMessage(
              "Phần trăm giảm phải là số từ 1 đến 100!"
            );
            return false;
          }
          // Validate ngày bắt đầu/kết thúc
          if (!start) {
            Swal.showValidationMessage("Vui lòng chọn ngày bắt đầu!");
            return false;
          }
          if (!end) {
            Swal.showValidationMessage("Vui lòng chọn ngày kết thúc!");
            return false;
          }
          if (new Date(start) >= new Date(end)) {
            Swal.showValidationMessage("Ngày kết thúc phải sau ngày bắt đầu!");
            return false;
          }
          // Validate đơn tối thiểu
          if (!min) {
            Swal.showValidationMessage("Vui lòng nhập giá trị đơn tối thiểu!");
            return false;
          }
          if (isNaN(Number(min)) || Number(min) < 0) {
            Swal.showValidationMessage("Đơn tối thiểu phải là số không âm!");
            return false;
          }
          // Validate giảm tối đa
          if (!max) {
            Swal.showValidationMessage("Vui lòng nhập giá trị giảm tối đa!");
            return false;
          }
          if (isNaN(Number(max)) || Number(max) < 0) {
            Swal.showValidationMessage("Giảm tối đa phải là số không âm!");
            return false;
          }
          // Validate giảm tối đa không lớn hơn đơn tối thiểu
          if (Number(max) > Number(min)) {
            Swal.showValidationMessage(
              "Giảm tối đa không được lớn hơn đơn tối thiểu!"
            );
            return false;
          }
          return {
            code,
            discountPercentage: discount + "%",
            start_time: start.replace("T", " "),
            end_time: end.replace("T", " "),
            minOrderValue: min,
            maxDiscountValue: max,
          };
        },
      });

      if (formValues) {
        Object.assign(voucher, {
          ...formValues,
          updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
          updatedBy: "admin",
        });
        Swal.fire("Thành công!", "Đã cập nhật voucher.", "success");
      }
    },
    deleteVoucher(voucher) {
      Swal.fire({
        title: `Xác nhận xóa voucher?`,
        text: `Bạn có chắc chắn muốn xóa voucher "${voucher.code}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          this.listVoucher = this.listVoucher.filter(
            (v) => v.id !== voucher.id
          );
          Swal.fire("Đã xóa!", "Voucher đã được xóa.", "success");
        }
      });
    },
    toggleStatus(voucher) {
      voucher.status =
        voucher.status === "Hoạt động" ? "Không hoạt động" : "Hoạt động";
      // Nếu muốn thông báo:
      // this.$nextTick(() => {
      //   Swal.fire("Thành công!", "Đã thay đổi trạng thái voucher.", "success");
      // });
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
