<template>
  <div class="d-flex justify-content-end mb-3" style="margin-top: 10px; margin-right: 20px;">
    <button @click="addSupplier" class="custom-add-btn">
      <i class="bi bi-plus-circle me-2"></i> <strong>Thêm nhà cung cấp mới</strong>
    </button>
  </div>

  <div class="dashboard-container">
    <div class="dashboard-table">
      <table id="main-table" class="display">
        <thead>
          <tr class="text-center">
            <th>Tên nhà cung cấp</th>
            <th>Người đại diện</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Người tạo</th>
            <th colspan="3">Actions</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="(supplier, index) in listSupplier" :key="index">
            <td>{{ supplier.supplierName }}</td>
            <td>{{ supplier.contactName }}</td>
            <td>{{ supplier.phone }}</td>
            <td>{{ supplier.email }}</td>
            <td>{{ supplier.address }}</td>
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
                  style="font-weight: 700; min-width: 130px; padding-top: 4%; height: 30px;"
                >
                  {{ supplier.status }}
                </span>
              </div>
            </td>
            <td>{{ supplier.createdBy }}</td>
            <td class="action-cell">
              <a class="btn btn-primary tooltip-custom" data-tooltip="Chi tiết">
                <i class="bi bi-info-circle fs-5"></i>
              </a>
            </td>
            <td class="action-cell">
              <a class="btn btn-success tooltip-custom" data-tooltip="Cập nhật">
                <i class="bi bi-pencil fs-5"></i>
              </a>
            </td>
            <td class="action-cell">
              <a class="btn btn-danger tooltip-custom" data-tooltip="Xóa">
                <i class="bi bi-trash fs-5"></i>
              </a>
            </td>
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  </div>
</template>

<script>
export default {
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
    };
  },
  methods: {
    formatDateTime(dateStr) {
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
    },
    toggleStatus(supplier) {
      supplier.status =
        supplier.status === "Hoạt động" ? "Không hoạt động" : "Hoạt động";
    },
    addSupplier() {
      // Trigger add supplier logic or route
      alert("Thêm nhà cung cấp mới");
    }
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
</style>
