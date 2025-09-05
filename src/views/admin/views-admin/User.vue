<template>
  <div class="admin-page container-fluid py-4">
    <!-- User Statistics Section -->
    <div class="mb-4">
      <UserStatisticsCards />
    </div>

    <!-- Layout 2 cột: Bộ lọc bên trái, Bảng bên phải -->
    <div class="row">
      <!-- Cột bộ lọc (bên trái) -->
      <div
        class="filter-sidebar"
        :class="{ 'filter-sidebar-collapsed': !showFilter }"
      >
        <div class="card shadow-lg border-0 filter-card sticky-filter">
          <div class="card-header bg-light border-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0 text-secondary">
                <i class="bi bi-funnel me-2"></i>
                Bộ lọc
              </h6>
              <button
                class="btn btn-sm btn-outline-secondary"
                type="button"
                @click="toggleFilter"
                :aria-expanded="showFilter"
              >
                <i
                  :class="
                    showFilter ? 'bi bi-chevron-left' : 'bi bi-chevron-right'
                  "
                ></i>
              </button>
            </div>
          </div>
          <div
            class="card-body filter-collapse"
            :class="{ 'filter-collapsed': !showFilter }"
          >
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-search me-1"></i>
                Tìm kiếm
              </label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Nhập tên hoặc email"
                v-model="searchQuery"
                @keyup.enter="applyFilters"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-toggle-on me-1"></i>
                Trạng thái
              </label>
              <select
                class="form-select form-select-sm"
                v-model="selectedStatus"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Ngừng hoạt động</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-person-badge me-1"></i>
                Vai trò
              </label>
              <select class="form-select form-select-sm" v-model="selectedRole">
                <option value="">Tất cả vai trò</option>
                <option
                  v-for="role in rolesList"
                  :key="role.id"
                  :value="role.id"
                >
                  {{ role.tenVaiTro }}
                </option>
              </select>
            </div>

            <div class="d-grid gap-2">
              <button class="btn btn-success btn-sm" @click="applyFilters">
                <i class="bi bi-funnel me-1"></i> Áp dụng lọc
              </button>
              <button class="btn btn-secondary btn-sm" @click="clearFilters">
                <i class="bi bi-x-circle me-1"></i> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột bảng (bên phải) -->
      <div
        class="table-main-content"
        :class="{ 'table-main-content-expanded': !showFilter }"
      >
        <!-- Danh sách User -->
        <div class="card shadow-lg border-0 mb-4 admin-table-card">
          <div
            class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3"
          >
            <div>
              <h5 class="mb-0 text-secondary">
                <i class="bi bi-people me-2"></i>
                Danh sách người dùng
              </h5>
            </div>
            <div class="d-flex gap-2">
              <button
                class="btn btn-outline-info btn-sm py-2"
                @click="fetchUsers"
                :disabled="loading"
              >
                <i class="bi bi-arrow-repeat me-1"></i> Làm mới
              </button>
              
              <!-- Nút Export Excel -->
              <ExcelExportButton data-type="users" button-text="Xuất Excel" />
            </div>
          </div>
          <div class="card-body p-0" :class="{ loading: loading }">
            <div class="loading-overlay" :class="{ show: loading }">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Đang tải...</span>
              </div>
              <p>Đang tải dữ liệu...</p>
            </div>

            <!-- Data table -->
            <div>
                <table class="table align-middle table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                    <th style="width: 40px">#</th>
                    <th style="width: 120px">Thao tác</th>
                    <th style="width: 150px">Họ tên</th>
                    <th style="width: 200px">Email</th>
                    <th style="width: 120px">SĐT</th>
                    <th style="width: 100px">Vai trò</th>
                    <th style="width: 100px">Trạng thái</th>
                    <th style="width: 130px">Tổng chi tiêu</th>
                    <th style="width: 100px">Tổng điểm</th>
                    <th style="width: 150px">Ngày tạo</th>
                    <th style="width: 150px">Ngày cập nhật</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr v-if="users.length === 0">
                    <td colspan="11" class="text-center py-4 text-muted">
                      <i class="bi bi-inbox me-2"></i>
                      Không có dữ liệu
                    </td>
                  </tr>
                  <tr
                    v-for="(user, idx) in users"
                    :key="user.user_id"
                    class="align-middle"
                    style="vertical-align: middle"
                  >
                    <td class="py-3">{{ currentPage * pageSize + idx + 1 }}</td>
                    <td class="py-3">
                        <div class="d-flex gap-2">
                        <span class="tooltip-wrapper">
                          <button
                            class="btn btn-sm btn-outline-secondary action-btn"
                            @click="viewUser(user)"
                          >
                            <i class="bi bi-eye"></i>
                          </button>
                          <span class="tooltip-bubble">Xem chi tiết</span>
                        </span>
                        <span v-if="user.isRetail != 1" class="tooltip-wrapper">
                          <EditButton
                            :user="user"
                            @click="openEditModal(user)"
                          />
                          <span class="tooltip-bubble">Chỉnh sửa</span>
                        </span>
                      </div>
                    </td>
                    <td class="py-3 fw-bold">
                      {{ user.full_name }}
                      <span
                        v-if="user.isRetail === 1"
                        class="badge bg-info ms-2"
                        style="font-size: 12px"
                        >Khách hàng vãng lai</span
                      >
                    </td>
                    <td class="py-3">{{ user.email }}</td>
                    <td class="py-3">{{ user.phone_number }}</td>
                    <td class="py-3">
                      <span
                        :class="['badge', getRoleInfo(user.role_name).class]"
                      >
                        {{ getRoleInfo(user.role_name).text }}
                        </span>
                      </td>
                    <td class="py-3">
                      <span
                        :class="['badge', getStatusInfo(user.status).class]"
                      >
                        {{ getStatusInfo(user.status).text }}
                        </span>
                      </td>
                    <td class="py-3">
                        <span class="text-success">{{
                          formatCurrency(user.total_spent)
                        }}</span>
                      </td>
                    <td class="py-3">
                        <span class="text-primary">{{ user.total_point }}</span>
                      </td>
                    <td class="py-3">
                      <span class="fw-bold">{{ toTime(user.created_at) }}</span>
                      <br />
                      <small class="text-muted">{{
                        toDate(user.created_at)
                      }}</small>
                    </td>
                    <td class="py-3">
                      <span class="fw-bold">{{ toTime(user.updated_at) }}</span>
                      <br />
                      <small class="text-muted">{{
                        toDate(user.updated_at)
                      }}</small>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Pagination -->
              <div class="p-3">
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
          </div>
        </div>
      </div>
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
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- header dùng form-modal-header -->
        <div class="modal-header form-modal-header">
          <h5 class="modal-title" id="userModalLabel">
            <i class="bi bi-pencil me-2"></i>
            Cập nhật người dùng
          </h5>
          <button
            type="button"
            class="custom-close-btn"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="bx bx-x-circle"></i>
          </button>
        </div>

        <!-- body dùng form-modal-body -->
        <div class="modal-body form-modal-body">
          <form @submit.prevent="handleSubmitUser">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">
                  Họ tên <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newUser.full_name"
                  placeholder="Nhập họ và tên"
                  :disabled="isReadOnly"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label">
                  Email <span class="text-danger">*</span>
                </label>
                <input
                  type="email"
                  class="form-control"
                  v-model="newUser.email"
                  placeholder="Nhập địa chỉ email"
                  required
                  disabled
                />
              </div>
              <div class="col-12">
                <label class="form-label">Số điện thoại</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newUser.phone_number"
                  placeholder="Nhập số điện thoại"
                  :disabled="isReadOnly"
                />
              </div>
              <div class="col-12">
                <label class="form-label">
                  Vai trò <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select"
                  v-model="newUser.role_id"
                  required
                  :disabled="currentUserRole != 'ADMIN'"
                >
                  <option value="">Chọn vai trò</option>
                  <option
                    v-for="role in rolesList"
                    :key="role.id"
                    :value="role.id"
                  >
                    {{ role.tenVaiTro }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">
                  Trạng thái <span class="text-danger">*</span>
                </label>
                <select class="form-select" v-model="newUser.status" required>
                  <option value="1">Hoạt động</option>
                  <option value="0">Ngừng hoạt động</option>
                </select>
              </div>
              <div class="col-12" hidden>
                <label class="form-label">Tổng chi tiêu</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="newUser.total_spent"
                  min="0"
                  placeholder="Nhập tổng chi tiêu"
                  :disabled="isReadOnly"
                />
              </div>
              <div class="col-12" hidden>
                <label class="form-label">Tổng điểm</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="newUser.total_point"
                  min="0"
                  placeholder="Nhập tổng điểm"
                  :disabled="isReadOnly"
                />
              </div>
            </div>
          </form>
        </div>

        <!-- footer chỉ dùng modal-footer + form-btn-* -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn form-btn-secondary"
            data-bs-dismiss="modal"
          >
            Hủy
          </button>

          <button
            v-if="!isReadOnly"
            type="button"
            class="btn form-btn-primary"
            @click="handleSubmitUser"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal chi tiết người dùng -->
  <div
    v-if="showDetailModal"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
  >
    <div class="modal-dialog" style="max-width: 600px">
      <div class="modal-content">
        <div class="modal-header form-modal-header">
          <h5 class="modal-title">
            <i class="bi bi-info-circle me-2"></i>
            Chi tiết người dùng
          </h5>
          <button
            type="button"
            class="custom-close-btn"
            @click="closeDetailModal"
          >
            <i class="bx bx-x-circle"></i>
          </button>
        </div>
        <div class="modal-body form-modal-body">
          <table class="detail-info-table">
            <tbody>
              <tr>
                <td class="detail-label">ID</td>
                <td class="detail-value">{{ detailUser.user_id }}</td>
              </tr>
              <tr>
                <td class="detail-label">Họ tên</td>
                <td class="detail-value">
                  {{ detailUser.full_name || "Chưa có dữ liệu" }}
                </td>
              </tr>
              <tr>
                <td class="detail-label">Email</td>
                <td class="detail-value">{{ detailUser.email }}</td>
              </tr>
              <tr>
                <td class="detail-label">Số điện thoại</td>
                <td class="detail-value">
                  {{ detailUser.phone_number || "Chưa có dữ liệu" }}
                </td>
              </tr>
              <tr>
                <td class="detail-label">Vai trò</td>
                <td class="detail-value">
                  <span
                    :class="['badge', getRoleInfo(detailUser.role_name).class]"
                  >
                    {{ getRoleInfo(detailUser.role_name).text }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="detail-label">Trạng thái</td>
                <td class="detail-value">
                  <span
                    :class="['badge', getStatusInfo(detailUser.status).class]"
                  >
                    {{ getStatusInfo(detailUser.status).text }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="detail-label">Xác thực email</td>
                <td class="detail-value">
                  <span
                    :class="[
                      'badge',
                      detailUser.email_verified
                        ? 'badge-success'
                        : 'badge-warning',
                    ]"
                  >
                    {{
                      detailUser.email_verified
                        ? "Đã xác thực"
                        : "Chưa xác thực"
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="detail-label">Tổng chi tiêu</td>
                <td class="detail-value">
                  <span class="text-success fw-bold">{{
                    formatCurrency(detailUser.total_spent)
                  }}</span>
                </td>
              </tr>
              <tr>
                <td class="detail-label">Tổng điểm</td>
                <td class="detail-value">
                  <span class="text-primary fw-bold">{{
                    detailUser.total_point
                  }}</span>
                </td>
              </tr>
              <tr>
                <td class="detail-label">Ngày tạo</td>
                <td class="detail-value">
                  {{ toTime(detailUser.created_at) }} -
                  {{ toDate(detailUser.created_at) }}
                </td>
              </tr>
              <tr>
                <td class="detail-label">Ngày cập nhật</td>
                <td class="detail-value">
                  {{ toTime(detailUser.updated_at) }} -
                  {{ toDate(detailUser.updated_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn form-btn-secondary"
            @click="closeDetailModal"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Pagination from "@/components/common/Pagination.vue";
import UserStatisticsCards from "@/views/admin/components-admin/statistics/UserStatisticsCards.vue";
import { ref, computed, onMounted, watch } from "vue";
import { Modal } from "bootstrap";
import { showToast, showAlert, showQuickConfirm } from "@/utils/swalHelper";
import {
  fetchUsers,
  updateUser,
  toggleUserStatus,
  getDropdownRoles,
} from "@/services/admin/user";
import EditButton from "@/components/common/EditButton.vue";
import {
  getUserId,
  getUserRole,
  formatCurrency,
  toDate,
  toTime,
} from "@/utils/utils.js";
import { validate } from "@/utils/validation.js";
import ExcelExportButton from "@/components/common/ExcelExportButton.vue";

const users = ref([]);
const totalElements = ref(0);
const totalPages = ref(1);
const currentPage = ref(0);
const pageSize = ref(10);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const searchQuery = ref("");
const selectedStatus = ref("");
const selectedRole = ref("");

const newUser = ref({});
const loading = ref(false);
const rolesList = ref([]);
const showFilter = ref(true);
const isLastPage = ref(false);

// Modal chi tiết người dùng
const showDetailModal = ref(false);
const detailUser = ref({
  user_id: "",
  full_name: "",
  email: "",
  phone_number: "",
  role_id: "",
  role_name: "",
  status: "",
  email_verified: null,
  created_at: "",
  updated_at: "",
  total_spent: 0,
  total_point: 0,
});

const applyFilters = () => {
  currentPage.value = 0;
  loadUsers();
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedStatus.value = "";
  selectedRole.value = "";
  currentPage.value = 0;
  loadUsers();
};

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const roleMap = computed(() => {
  const map = {};
  rolesList.value.forEach((role) => {
    map[role.id] = role.tenVaiTro;
  });
  return map;
});
// Hàm đơn giản để lấy badge class và text dựa trên role_name
const getRoleInfo = (roleName) => {
  const roleMap = {
    ADMIN: { class: "badge-danger", text: "Quản trị viên" },
    STAFF: { class: "badge-warning", text: "Nhân viên" },
    CUSTOMER: { class: "badge-primary", text: "Khách hàng" },
  };
  return (
    roleMap[roleName] || { class: "badge-secondary", text: "Không xác định" }
  );
};

const getStatusInfo = (status) => {
  const statusMap = {
    1: { class: "badge-success", text: "Hoạt động" },
    0: { class: "badge-danger", text: "Ngừng hoạt động" },
  };
  return (
    statusMap[Number(status)] || {
      class: "badge-secondary",
      text: "Không xác định",
    }
  );
};

function getUserParams() {
  return {
    page: currentPage.value,
    size: pageSize.value,
    full_name: searchQuery.value || undefined,
    status: selectedStatus.value || undefined,
    role_id: selectedRole.value || undefined,
    userId: getUserId(), // <--- bổ sung param userId
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
    showAlert("Lỗi tải dữ liệu người dùng!", "", "error");
  } finally {
    loading.value = false;
  }
}

async function loadRoles() {
  try {
    const res = await getDropdownRoles();
    if (res.data && res.data.data) {
      rolesList.value = res.data.data;
    }
  } catch (e) {
    console.error("Lỗi tải danh sách vai trò:", e);
    // Fallback data nếu API lỗi
    rolesList.value = [
      { id: 1, tenVaiTro: "Quản trị viên" },
      { id: 2, tenVaiTro: "Khách hàng" },
      { id: 3, tenVaiTro: "Nhân viên" },
    ];
  }
}

onMounted(() => {
  loadRoles();
  loadUsers();
});

watch([pageSize], () => {
  currentPage.value = 0;
  loadUsers();
});

// Pagination methods
const handlePrev = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    loadUsers();
  }
};

const handleNext = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    loadUsers();
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 0;
  loadUsers();
};

// Hàm xem chi tiết người dùng
const viewUser = (user) => {
  detailUser.value = { ...user };
  showDetailModal.value = true;
};

// Hàm đóng modal chi tiết
const closeDetailModal = () => {
  showDetailModal.value = false;
  detailUser.value = {
    user_id: "",
    full_name: "",
    email: "",
    phone_number: "",
    role_id: "",
    role_name: "",
    status: "",
    email_verified: null,
    created_at: "",
    updated_at: "",
    total_spent: 0,
    total_point: 0,
  };
};

function openEditModal(user) {
  newUser.value = { ...user };
  showUserModal();
}
function showUserModal() {
  const el = document.getElementById("userModal");
  const modal = Modal.getOrCreateInstance(el);
  modal.show();
}
async function handleSubmitUser() {
  const result = await showQuickConfirm(
    "Xác nhận lưu thay đổi",
    "Bạn có chắc chắn muốn lưu những thay đổi này?",
    "info",
    "Cập nhật",
    "Hủy"
  );
  if (!result.isConfirmed) return;

  // Validate
  // Validate using common validation functions
  const validations = [
    validate.required(newUser.value.full_name, "Họ tên"),
    validate.required(newUser.value.email, "Email"),
    validate.required(newUser.value.role_id, "Vai trò"),
    validate.status(newUser.value.status),
    validate.email(newUser.value.email),
    validate.phone(newUser.value.phone_number),
    validate.number(newUser.value.total_spent, "Tổng chi tiêu", {
      allowNegative: false,
    }),
    validate.number(newUser.value.total_point, "Tổng điểm", {
      allowNegative: false,
    }),
  ];

  // Check if any validation failed
  for (const validation of validations) {
    if (validation !== null) {
      showToast("error", validation);
    return;
  }
  }

  // Đảm bảo status là số
  const userData = {
    ...newUser.value,
    status: Number(newUser.value.status),
  };

  try {
    await updateUser(userData.user_id, userData);
    showToast("success", "Cập nhật thành công!");
    Modal.getOrCreateInstance(document.getElementById("userModal")).hide();
    loadUsers();
  } catch (e) {
    showAlert("Lỗi thao tác người dùng!", "", "error");
  }
}

async function handleToggleUserStatus(user) {
  try {
    await toggleUserStatus(user.user_id);
    showToast("success", "Đã đổi trạng thái!");
    loadUsers();
  } catch (e) {
    showAlert("Lỗi đổi trạng thái!", "", "error");
  }
}

const currentUserRole = getUserRole(); // 'ADMIN' hoặc 'NHANVIEN'
const isStaff = computed(() => currentUserRole !== "ADMIN");

// Khi staff mở modal với 1 user có role_name === 'ADMIN', thì read-only
const isEditingAdmin = computed(() => newUser.value.role_name === "ADMIN");
const isReadOnly = computed(() => isStaff.value && isEditingAdmin.value);
</script>

<style scoped>
@import "@/assets/css/admin-global.css";
@import "@/assets/css/form-global.css";
@import "@/assets/css/form-detail-global.css";

/* Layout 2 cột cho filter sidebar */
.filter-sidebar {
  width: 250px;
  transition: all 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
  padding-right: 15px;
}

.filter-sidebar-collapsed {
  width: 100px;
}

.filter-sidebar-collapsed .filter-card .card-body {
  opacity: 0;
  pointer-events: none;
  max-height: 0;
  padding: 0;
}

.filter-sidebar-collapsed .filter-card .card-header h6 {
  opacity: 0;
}

.filter-sidebar-collapsed .filter-card .card-header {
  padding: 0.75rem;
  text-align: center;
}

.filter-sidebar-collapsed .filter-card .card-header .d-flex {
  justify-content: center !important;
}

.filter-sidebar-collapsed .filter-card .card-header .btn {
  margin: 0;
}

/* Table content */
.table-main-content {
  flex: 1;
  transition: all 0.3s ease;
  margin-left: 0;
  min-width: 0;
}

.table-main-content-expanded {
  margin-left: 0;
}
/* Sticky filter */
.sticky-filter {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.row > [class*="col-"] {
  padding: 0;
}
</style>
