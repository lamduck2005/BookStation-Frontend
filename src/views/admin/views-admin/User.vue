<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">Admin / <strong>User</strong></h6>
    </div>
    <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #ecae9e"
      >
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-4">
          <label class="form-label">Tìm kiếm:</label>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập tên hoặc email"
            v-model="searchQuery"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="BANNED">Bị khóa</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Vai trò</label>
          <select class="form-select" v-model="selectedRole">
            <option value="">Tất cả vai trò</option>
            <option v-for="(label, id) in roleMap" :key="id" :value="id">
              {{ label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- Nút thêm mới -->
    <div class="d-flex justify-content-end mb-3">
      <button
        class="btn btn-primary"
        style="background-color: #33304e; border-color: #33304e"
        @click="openAddModal"
      >
        <i class="bi bi-plus-circle me-2"></i> Thêm mới
      </button>
    </div>
    <!-- Alert chú ý -->
    <div
      class="rank-warning-label d-flex align-items-center justify-content-center mb-3"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/128/3756/3756730.png"
        alt="Warning"
        class="rank-warning-icon me-2"
      />
      <span class="rank-warning-text">
        <strong>Chỉ Admin mới có quyền chỉnh sửa hoặc xóa người dùng!</strong>
      </span>
    </div>
    <!-- Danh sách User -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #ecae9e"
      >
        <strong>Danh sách Người dùng</strong>
      </div>
      <div class="p-3">
        <div class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Tổng chi tiêu</th>
                <th>Tổng điểm</th>
                <th>Ngày tạo</th>
                <th>Ngày cập nhật</th>
                <th style="width: 120px">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, idx) in users" :key="user.user_id">
                <td>{{ user.user_id }}</td>
                <td>{{ user.full_name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone_number }}</td>
                <td>
                  <span :class="['badge', roleBadgeClass(user.role_id)]">{{
                    roleMap[user.role_id] || "User"
                  }}</span>
                </td>
                <td>
                  <span :class="['badge', statusBadgeClass(user.status)]">{{
                    statusText(user.status)
                  }}</span>
                </td>
                <td>{{ formatCurrency(user.total_spent) }}</td>
                <td>{{ user.total_point }}</td>
                <td>{{ formatDate(user.created_at) }}</td>
                <td>{{ formatDate(user.updated_at) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary me-1"
                    @click="openEditModal(user)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="confirmDelete(user)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="11" class="text-center text-muted">
                  Không có dữ liệu
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <Pagination
          :page-number="currentPage"
          :total-pages="totalPages"
          :is-last-page="currentPage >= totalPages - 1"
          :page-size="pageSize"
          :items-per-page-options="itemsPerPageOptions"
          :total-elements="totalElements"
          @prev="handlePrev"
          @next="handleNext"
          @update:pageSize="handlePageSizeChange"
        />
      </div>
    </div>
    <!-- Modal Add/Edit User -->
    <div
      class="modal fade"
      id="userModal"
      tabindex="-1"
      aria-labelledby="userModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #ecae9e">
            <h5 class="modal-title" id="userModalLabel">
              <i
                class="bi me-2"
                :class="isEditMode ? 'bi-pencil' : 'bi-plus-circle'"
              ></i>
              {{ isEditMode ? "Sửa Người dùng" : "Thêm Người dùng" }}
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
            <form @submit.prevent="handleSubmitUser">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label"
                    >Họ tên <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    v-model="newUser.full_name"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Email <span class="text-danger">*</span></label
                  >
                  <input
                    type="email"
                    class="form-control"
                    v-model="newUser.email"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="newUser.phone_number"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Vai trò <span class="text-danger">*</span></label
                  >
                  <select
                    class="form-select"
                    v-model="newUser.role_id"
                    required
                  >
                    <option value="">Chọn vai trò</option>
                    <option
                      v-for="(label, id) in roleMap"
                      :key="id"
                      :value="id"
                    >
                      {{ label }}
                    </option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Trạng thái <span class="text-danger">*</span></label
                  >
                  <select class="form-select" v-model="newUser.status" required>
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="BANNED">Bị khóa</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Tổng chi tiêu</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model="newUser.total_spent"
                    min="0"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label">Tổng điểm</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model="newUser.total_point"
                    min="0"
                  />
                </div>
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
              @click="handleSubmitUser"
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
<script setup>
import Pagination from "@/components/common/Pagination.vue";
import { ref, computed, onMounted, watch } from "vue";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "@/services/admin/user";

const users = ref([]);
const totalElements = ref(0);
const totalPages = ref(1);
const currentPage = ref(0);
const pageSize = ref(10);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const searchQuery = ref("");
const selectedStatus = ref("");
const selectedRole = ref("");
const isEditMode = ref(false);
const newUser = ref({});
const loading = ref(false);

const roleMap = {
  1: "Admin",
  2: "User",
  3: "Staff",
};
const roleBadgeClass = (roleId) => {
  switch (Number(roleId)) {
    case 1:
      return "bg-danger-subtle text-danger";
    case 2:
      return "bg-primary-subtle text-primary";
    case 3:
      return "bg-warning-subtle text-warning";
    default:
      return "bg-secondary";
  }
};
const statusBadgeClass = (status) => {
  if (status === "ACTIVE") return "bg-success-subtle text-success";
  if (status === "BANNED") return "bg-danger-subtle text-danger";
  return "bg-secondary";
};
const statusText = (status) => {
  switch (status) {
    case "ACTIVE":
      return "Hoạt động";
    case "BANNED":
      return "Bị khóa";
    default:
      return status;
  }
};
function formatCurrency(val) {
  if (!val) return "-";
  return Number(val).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
function formatDate(val) {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("vi-VN");
}

function getUserParams() {
  return {
    page: currentPage.value,
    size: pageSize.value,
    full_name: searchQuery.value || undefined,
    status: selectedStatus.value || undefined,
    role_id: selectedRole.value || undefined,
  };
}

async function loadUsers() {
  loading.value = true;
  try {
    const res = await fetchUsers(getUserParams());
    if (res.data && res.data.data) {
      users.value = res.data.data.content;
      totalElements.value = res.data.data.totalElements;
      totalPages.value = res.data.data.totalPages;
    } else {
      users.value = [];
      totalElements.value = 0;
      totalPages.value = 1;
    }
  } catch (e) {
    users.value = [];
    totalElements.value = 0;
    totalPages.value = 1;
    Swal.fire({ icon: "error", title: "Lỗi tải dữ liệu người dùng!" });
  } finally {
    loading.value = false;
  }
}

onMounted(loadUsers);

watch([searchQuery, selectedStatus, selectedRole, pageSize], () => {
  currentPage.value = 0;
  loadUsers();
});

function handlePrev() {
  if (currentPage.value > 0) {
    currentPage.value--;
    loadUsers();
  }
}
function handleNext() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    loadUsers();
  }
}
function handlePageSizeChange(newSize) {
  pageSize.value = newSize;
  currentPage.value = 0;
  loadUsers();
}

function openAddModal() {
  isEditMode.value = false;
  newUser.value = {
    full_name: "",
    email: "",
    phone_number: "",
    role_id: "",
    status: "ACTIVE",
    total_spent: 0,
    total_point: 0,
  };
  showUserModal();
}
function openEditModal(user) {
  isEditMode.value = true;
  newUser.value = { ...user };
  showUserModal();
}
function showUserModal() {
  const el = document.getElementById("userModal");
  const modal = Modal.getOrCreateInstance(el);
  modal.show();
}
async function handleSubmitUser() {
  // Validate
  if (
    !newUser.value.full_name ||
    !newUser.value.email ||
    !newUser.value.role_id ||
    !newUser.value.status
  ) {
    Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Vui lòng nhập đủ thông tin bắt buộc!", showConfirmButton: false, timer: 2000 });
    return;
  }
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newUser.value.email)) {
    Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Email không hợp lệ!", showConfirmButton: false, timer: 2000 });
    return;
  }
  if (newUser.value.phone_number && !/^0\d{9,10}$/.test(newUser.value.phone_number)) {
    Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Số điện thoại không hợp lệ (bắt đầu bằng 0, 10-11 số)!", showConfirmButton: false, timer: 2000 });
    return;
  }
  if (Number(newUser.value.total_spent) < 0 || Number(newUser.value.total_point) < 0) {
    Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Tổng chi tiêu và tổng điểm phải >= 0!", showConfirmButton: false, timer: 2000 });
    return;
  }
  try {
    if (isEditMode.value) {
      await updateUser(newUser.value.user_id, newUser.value);
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Cập nhật thành công!", showConfirmButton: false, timer: 1500 });
    } else {
      await createUser(newUser.value);
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Thêm mới thành công!", showConfirmButton: false, timer: 1500 });
    }
    Modal.getOrCreateInstance(document.getElementById("userModal")).hide();
    loadUsers();
  } catch (e) {
    Swal.fire({ icon: "error", title: "Lỗi thao tác người dùng!" });
  }
}
async function confirmDelete(user) {
  Swal.fire({
    title: "Bạn chắc chắn muốn xóa?",
    text: `Xóa người dùng: ${user.full_name}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteUser(user.user_id);
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Đã xóa!", showConfirmButton: false, timer: 1500 });
        loadUsers();
      } catch (e) {
        Swal.fire({ icon: "error", title: "Lỗi xóa người dùng!" });
      }
    }
  });
}
async function handleToggleUserStatus(user) {
  try {
    await toggleUserStatus(user.user_id);
    Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Đã đổi trạng thái!", showConfirmButton: false, timer: 1200 });
    loadUsers();
  } catch (e) {
    Swal.fire({ icon: "error", title: "Lỗi đổi trạng thái!" });
  }
}
</script>
<style scoped>
/* ...reuse styles from Rank.vue... */
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
.rank-warning-label {
  background: #fff3cd;
  border: 1.5px solid #ffeeba;
  border-radius: 8px;
  padding: 10px 18px;
  margin-bottom: 18px;
  font-size: 1.08rem;
  color: #856404;
  font-family: "Segoe UI", "Arial", sans-serif;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.08);
}
.rank-warning-icon {
  width: 28px;
  height: 28px;
  margin-right: 8px;
}
.rank-warning-text {
  font-weight: 600;
  letter-spacing: 0.2px;
  font-size: 1.08rem;
}

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

/* Table responsive improvements */
.table-responsive {
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
}

.table-responsive table {
  min-width: 1100px; /* Ensure table has minimum width for proper scrolling */
}

.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive table fixes */
@media (max-width: 1200px) {
  .table-responsive table {
    min-width: 1200px;
  }
}

@media (max-width: 992px) {
  .table-responsive table {
    min-width: 1100px;
  }
}

@media (max-width: 768px) {
  .table-responsive table {
    min-width: 1000px;
  }
}
</style>
