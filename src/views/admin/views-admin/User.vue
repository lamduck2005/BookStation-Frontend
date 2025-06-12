<template>
  <div style="padding: 32px">
    <!-- Search Filter -->
    <div class="mb-3">
      <h6 class="text-muted">Quản lý / <strong>Người dùng</strong></h6>
    </div>
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 text-bg-secondary p-2 m-0 rounded-top"
      >
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-6">
          <label class="form-label">Email hoặc Tên người dùng</label>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập email hoặc tên"
            v-model="searchQuery"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="d-flex align-items-center justify-content-between mt-5 mb-3">
      <h2 class="table-title m-0">Danh sách người dùng</h2>
    </div>
    <div class="dashboard-container">
      <div class="dashboard-table">
        <table
          id="user-table"
          class="table table-bordered table-hover align-middle text-center"
        >
          <thead class="text-center">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Họ và Tên</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUserList" :key="index">
              <td>{{ user.user_id }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.full_name }}</td>
              <td>{{ user.phone_number }}</td>
              <td>
                <div
                  class="d-flex align-items-center gap-2 justify-content-center"
                >
                  <label class="switch m-0">
                    <input
                      type="checkbox"
                      :checked="user.status === 'active'"
                      @change="toggleUserStatus(user)"
                    />
                    <span class="slider round"></span>
                  </label>
                  <span
                    class="badge"
                    :class="
                      user.status === 'active'
                        ? 'bg-success-subtle text-success'
                        : 'bg-secondary-subtle text-secondary'
                    "
                    style="font-weight: 700; min-width: 110px; height: 30px"
                  >
                    {{ statusText(user.status) }}
                  </span>
                </div>
              </td>
              <td>{{ formatDateTime(user.created_at) }}</td>
              <td class="action-cell">
                <a
                  class="btn btn-custom tooltip-custom"
                  data-tooltip="Chi tiết"
                  @click="viewUserDetail(user)"
                >
                  <i class="bi bi-info-circle fs-5"></i>
                </a>
                <a
                  class="btn btn-custom tooltip-custom"
                  data-tooltip="Cập nhật"
                  @click="editUser(user)"
                >
                  <i class="bi bi-pencil fs-5"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Popup for Edit User -->
    <div
      class="modal-overlay"
      v-if="showModal"
      @click="closeModalOnOutsideClick"
    >
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h5>
            {{ isEditMode ? "Cập nhật người dùng" : "Chi tiết người dùng" }}
          </h5>
          <i class="bi bi-x-lg close-icon" @click="closeModal"></i>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">ID</label>
            <input
              type="text"
              class="form-control"
              v-model="newUser.user_id"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              type="text"
              class="form-control"
              v-model="newUser.email"
              :readonly="!isEditMode"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Họ và Tên</label>
            <input
              type="text"
              class="form-control"
              v-model="newUser.full_name"
              :readonly="!isEditMode"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Số điện thoại</label>
            <input
              type="text"
              class="form-control"
              v-model="newUser.phone_number"
              :readonly="!isEditMode"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Trạng thái</label>
            <select
              class="form-select"
              v-model="newUser.status"
              :disabled="!isEditMode"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
          <!-- Additional fields can be added here -->
          <div class="mb-3">
            <label class="form-label">Ngày tạo</label>
            <input
              type="text"
              class="form-control"
              v-model="newUser.created_at"
              readonly
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Đóng
          </button>
          <button
            v-if="isEditMode"
            type="button"
            class="btn btn-primary"
            @click="saveUser"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Chi Tiết User -->
    <div
      class="modal-overlay"
      v-if="showDetailModal"
      @click="closeDetailModalOnOutsideClick"
    >
      <div class="modal-detail modal-detail-wide" @click.stop>
        <div class="modal-header">
          <h5>Chi tiết người dùng</h5>
          <i class="bi bi-x-lg close-icon" @click="showDetailModal = false"></i>
        </div>
        <div class="modal-body-detail modal-body-detail-grid">
          <div class="detail-field">
            <label class="form-label">ID</label>
            <input
              type="text"
              class="form-control"
              :value="newUser.user_id"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Email</label>
            <input
              type="text"
              class="form-control"
              :value="newUser.email"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Họ và Tên</label>
            <input
              type="text"
              class="form-control"
              :value="newUser.full_name"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Số điện thoại</label>
            <input
              type="text"
              class="form-control"
              :value="newUser.phone_number"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Trạng thái</label>
            <input
              type="text"
              class="form-control"
              :value="statusText(newUser.status)"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Ngày tạo</label>
            <input
              type="text"
              class="form-control"
              :value="newUser.created_at"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Ngày cập nhật</label>
            <input
              type="text"
              class="form-control"
              :value="newUser.updated_at"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Người cập nhật</label>
            <input
              type="text"
              class="form-control"
              :value="newUser.updated_by"
              readonly
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="showDetailModal = false"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { showToast } from "@/utils/swalHelper";

// Thêm nhiều user mẫu
const userList = ref([
  {
    user_id: 1,
    email: "user1@example.com",
    full_name: "Nguyễn Văn A",
    phone_number: "0123456789",
    status: "active",
    created_at: "2024-06-01",
    updated_at: "2024-06-01",
    updated_by: "admin",
    total_point: 100,
    current_rank_id: 1,
    total_spent: 150.0,
    role_id: 2,
  },
  {
    user_id: 2,
    email: "user2@example.com",
    full_name: "Trần Thị B",
    phone_number: "0987654321",
    status: "inactive",
    created_at: "2024-06-02",
    updated_at: "2024-06-02",
    updated_by: "admin",
    total_point: 80,
    current_rank_id: 2,
    total_spent: 200.5,
    role_id: 2,
  },
  {
    user_id: 3,
    email: "user3@example.com",
    full_name: "Lê Văn C",
    phone_number: "0912345678",
    status: "active",
    created_at: "2024-06-03",
    updated_at: "2024-06-03",
    updated_by: "admin",
    total_point: 120,
    current_rank_id: 1,
    total_spent: 300.0,
    role_id: 2,
  },
  {
    user_id: 4,
    email: "user4@example.com",
    full_name: "Phạm Thị D",
    phone_number: "0934567890",
    status: "inactive",
    created_at: "2024-06-04",
    updated_at: "2024-06-04",
    updated_by: "admin",
    total_point: 60,
    current_rank_id: 2,
    total_spent: 80.0,
    role_id: 2,
  },
  {
    user_id: 5,
    email: "user5@example.com",
    full_name: "Hoàng Văn E",
    phone_number: "0978123456",
    status: "active",
    created_at: "2024-06-05",
    updated_at: "2024-06-05",
    updated_by: "admin",
    total_point: 200,
    current_rank_id: 1,
    total_spent: 500.0,
    role_id: 2,
  },
  {
    user_id: 6,
    email: "user6@example.com",
    full_name: "Đỗ Thị F",
    phone_number: "0965432187",
    status: "inactive",
    created_at: "2024-06-06",
    updated_at: "2024-06-06",
    updated_by: "admin",
    total_point: 30,
    current_rank_id: 2,
    total_spent: 40.0,
    role_id: 2,
  },
  {
    user_id: 7,
    email: "user7@example.com",
    full_name: "Ngô Văn G",
    phone_number: "0943218765",
    status: "active",
    created_at: "2024-06-07",
    updated_at: "2024-06-07",
    updated_by: "admin",
    total_point: 170,
    current_rank_id: 1,
    total_spent: 420.0,
    role_id: 2,
  },
  {
    user_id: 8,
    email: "user8@example.com",
    full_name: "Bùi Thị H",
    phone_number: "0932187654",
    status: "inactive",
    created_at: "2024-06-08",
    updated_at: "2024-06-08",
    updated_by: "admin",
    total_point: 55,
    current_rank_id: 2,
    total_spent: 60.0,
    role_id: 2,
  },
  {
    user_id: 9,
    email: "user9@example.com",
    full_name: "Vũ Văn I",
    phone_number: "0921876543",
    status: "active",
    created_at: "2024-06-09",
    updated_at: "2024-06-09",
    updated_by: "admin",
    total_point: 90,
    current_rank_id: 1,
    total_spent: 210.0,
    role_id: 2,
  },
  {
    user_id: 10,
    email: "user10@example.com",
    full_name: "Trịnh Thị K",
    phone_number: "0918765432",
    status: "inactive",
    created_at: "2024-06-10",
    updated_at: "2024-06-10",
    updated_by: "admin",
    total_point: 40,
    current_rank_id: 2,
    total_spent: 70.0,
    role_id: 2,
  },
]);

const searchQuery = ref("");
const selectedStatus = ref("");
const showModal = ref(false);
const isEditMode = ref(false);
const showDetailModal = ref(false);
const newUser = ref({});

const filteredUserList = computed(() => {
  return userList.value.filter(
    (user) =>
      (!searchQuery.value ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.full_name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())) &&
      (!selectedStatus.value || user.status === selectedStatus.value)
  );
});

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("vi-VN");
};

const closeModalOnOutsideClick = (event) => {
  if (event.target.classList.contains("modal-overlay")) {
    closeModal();
  }
};

const closeDetailModalOnOutsideClick = (event) => {
  if (event.target.classList.contains("modal-overlay")) {
    showDetailModal.value = false;
  }
};

const viewUserDetail = (user) => {
  newUser.value = { ...user };
  showDetailModal.value = true;
  isEditMode.value = false;
};

const editUser = (user) => {
  newUser.value = { ...user };
  showModal.value = true;
  isEditMode.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveUser = () => {
  // Update user data logic here
  showToast("success", "Cập nhật người dùng: " + newUser.value.user_id);
  closeModal();
};

const statusText = (status) => {
  switch (status) {
    case "active":
      return "Hoạt động";
    case "inactive":
      return "Không hoạt động";
    default:
      return status;
  }
};

const statusClass = (status) => {
  switch (status) {
    case "active":
      return "badge bg-success-subtle text-success";
    case "inactive":
      return "badge bg-secondary-subtle text-secondary";
    default:
      return "badge bg-secondary";
  }
};

// Toggle trạng thái user
function toggleUserStatus(user) {
  user.status = user.status === "active" ? "inactive" : "active";
}
</script>

<style>
/* ...existing styles... */
.table-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ff2727;
}
.action-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
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
.close-icon {
  cursor: pointer;
  width: 16px;
  height: 16px;
}
.modal-body,
.modal-footer {
  padding: 1rem;
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
</style>
