<template>
  <div class="container-fluid py-4">
    <!-- User Statistics Section -->
    <div class="mb-4">
      <UserStatisticsCards />
    </div>

    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Quản lý người dùng</strong>
      </h6>
    </div>

    <!-- Layout 2 cột: Bộ lọc bên trái, Bảng bên phải -->
    <div class="row">
      <!-- Cột bộ lọc (bên trái) -->
      <div class="filter-sidebar" :class="{ 'filter-sidebar-collapsed': !showFilter }">
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
                <i :class="showFilter ? 'bi bi-chevron-left' : 'bi bi-chevron-right'"></i>
              </button>
            </div>
          </div>
          <div class="card-body filter-collapse" :class="{ 'filter-collapsed': !showFilter }">
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
                @input="debouncedSearch"
                @keyup.enter="applyFilters"
              />
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-toggle-on me-1"></i>
                Trạng thái
              </label>
              <select class="form-select form-select-sm" v-model="selectedStatus" @change="applyFilters">
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="BANNED">Bị khóa</option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-person-badge me-1"></i>
                Vai trò
              </label>
              <select class="form-select form-select-sm" v-model="selectedRole" @change="applyFilters">
                <option value="">Tất cả vai trò</option>
                <option v-for="role in rolesList" :key="role.id" :value="role.id">
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
      <div class="table-main-content" :class="{ 'table-main-content-expanded': !showFilter }">
        <!-- Alert chú ý -->
        <div class="alert alert-warning d-flex align-items-center mb-3" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <div>
            <strong>Chú ý:</strong> Chỉ Admin mới có quyền chỉnh sửa hoặc xóa người dùng!
          </div>
        </div>

        <!-- Danh sách User -->
        <div class="card shadow-lg border-0 mb-4 admin-table-card">
          <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
            <div>
              <h5 class="mb-0 text-secondary">
                <i class="bi bi-people me-2"></i>
                Danh sách người dùng
              </h5>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-info btn-sm py-2" @click="fetchUsers" :disabled="loading">
                <i class="bi bi-arrow-repeat me-1"></i> Làm mới
              </button>
              <button
                class="btn btn-success btn-sm"
                @click="openAddModal"
              >
                <i class="bi bi-plus-circle me-2"></i> Thêm mới
              </button>
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
              <div class="table-responsive">
                <table class="table align-middle table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th style="min-width: 50px;">STT</th>
                      <th style="min-width: 120px;">Thao tác</th>
                      <th style="min-width: 150px;">Họ tên</th>
                      <th style="min-width: 200px;">Email</th>
                      <th style="min-width: 120px;">SĐT</th>
                      <th style="min-width: 100px;">Vai trò</th>
                      <th style="min-width: 100px;">Trạng thái</th>
                      <th style="min-width: 130px;">Tổng chi tiêu</th>
                      <th style="min-width: 100px;">Tổng điểm</th>
                      <th style="min-width: 150px;">Ngày tạo</th>
                      <th style="min-width: 150px;">Ngày cập nhật</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(user, idx) in users" :key="user.user_id">
                      <td>{{ (currentPage * pageSize) + idx + 1 }}</td>
                      <td>
                        <div class="d-flex gap-2">
                          <EditButton
                            :user="user"
                            @edit="openEditModal(user)"
                          />
                        </div>
                      </td>
                      <td>
                        <strong>{{ user.full_name }}</strong>
                      </td>
                      <td>
                        <div>
                          {{ user.email }}
                        </div>
                      </td>
                      <td>{{ user.phone_number }}</td>
                      <td>
                        <span :class="['badge', roleBadgeClass(user.role_id)]">
                          {{ roleMap[user.role_id] || "User" }}
                        </span>
                      </td>
                      <td>
                        <span :class="['badge', statusBadgeClass(user.status)]">
                          {{ statusText(user.status) }}
                        </span>
                      </td>
                      <td>
                        <span class="text-success">{{ formatCurrency(user.total_spent) }}</span>
                      </td>
                      <td>
                        <span class="text-primary">{{ user.total_point }}</span>
                      </td>
                      <td>
                        <div class="small">
                          {{ formatDate(user.created_at) }}
                        </div>
                      </td>
                      <td>
                        <div class="small">
                          {{ formatDate(user.updated_at) }}
                        </div>
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
                      v-for="role in rolesList"
                      :key="role.id"
                      :value="role.id"
                    >
                      {{ role.tenVaiTro }}
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
              class="btn btn-outline-warning btn-sm rounded-pill fake-data-btn"
              @click="fillFakeData"
              v-if="!isEditMode"
              title="Điền dữ liệu mẫu để test nhanh"
            >
              <i class="bi bi-lightning me-1"></i> Dữ liệu mẫu
            </button>
            <div class="ms-auto">
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
import UserStatisticsCards from "@/views/admin/components-admin/statistics/UserStatisticsCards.vue";
import { ref, computed, onMounted, watch } from "vue";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import {
  fetchUsers,
  createUser,
  updateUser,
  
  toggleUserStatus,
  getDropdownRoles,
} from "@/services/admin/user";
import EditButton from "@/components/common/EditButton.vue";

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
const rolesList = ref([]);
const showFilter = ref(true);
const isLastPage = ref(false);

// Debounce search function
let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
};

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
  rolesList.value.forEach(role => {
    map[role.id] = role.tenVaiTro;
  });
  return map;
});
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
      { id: 3, tenVaiTro: "Nhân viên" }
    ];
  }
}

onMounted(() => {
  loadRoles();
  loadUsers();
});

watch([searchQuery, selectedStatus, selectedRole, pageSize], () => {
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

async function handleToggleUserStatus(user) {
  try {
    await toggleUserStatus(user.user_id);
    Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Đã đổi trạng thái!", showConfirmButton: false, timer: 1200 });
    loadUsers();
  } catch (e) {
    Swal.fire({ icon: "error", title: "Lỗi đổi trạng thái!" });
  }
}

// Hàm điền dữ liệu mẫu
function fillFakeData() {
  const sampleData = [
    {
      full_name: "Nguyễn Văn An",
      email: "nguyen.van.an@example.com",
      phone_number: "0901234567",
      role_id: 2,
      status: "ACTIVE",
      total_spent: 1500000,
      total_point: 150
    },
    {
      full_name: "Trần Thị Bình",
      email: "tran.thi.binh@example.com",
      phone_number: "0912345678",
      role_id: 2,
      status: "ACTIVE",
      total_spent: 2300000,
      total_point: 230
    },
    {
      full_name: "Lê Hoàng Cường",
      email: "le.hoang.cuong@example.com",
      phone_number: "0923456789",
      role_id: 3,
      status: "ACTIVE",
      total_spent: 800000,
      total_point: 80
    }
  ];
  
  const randomSample = sampleData[Math.floor(Math.random() * sampleData.length)];
  newUser.value = { ...randomSample };
}
</script>

<style scoped>
@import "@/assets/css/admin-table-responsive.css";
@import '@/assets/css/admin-global.css';

/* Filter Sidebar - Thu sang trái */
.filter-sidebar {
  width: 250px;
  transition: all 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
}

.filter-sidebar-collapsed {
  width: 60px;
}

.filter-sidebar-collapsed .filter-card .card-body {
  opacity: 0;
  pointer-events: none;
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

/* Table content - Mở rộng khi filter đóng */
.table-main-content {
  flex: 1;
  transition: all 0.3s ease;
  margin-left: 15px;
}

.table-main-content-expanded {
  margin-left: 15px;
}

/* Enhanced Modal Styles */
.enhanced-modal {
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: none;
  overflow: hidden;
}

.gradient-header {
  background: linear-gradient(135deg, #ecae9e 0%, #d49489 100%);
  border-bottom: none;
  border-radius: 15px 15px 0 0;
  padding: 1rem 1.25rem;
  position: relative;
}

.gradient-header .modal-title {
  font-weight: 600;
  color: #2c2c54;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.custom-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 0.6rem;
  cursor: pointer;
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c2c54;
  transition: all 0.3s ease;
}

.custom-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.custom-close-btn img {
  width: 20px;
  height: 20px;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.loading-overlay.show {
  opacity: 1;
  visibility: visible;
}

.loading-overlay .spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Sticky filter sidebar */
.sticky-filter {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

/* Compact filter styles */
.filter-card .card-body {
  padding: 1rem;
}

.filter-card .form-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

.filter-card .form-control-sm,
.filter-card .form-select-sm {
  padding: 0.4rem 0.6rem;
  font-size: 0.875rem;
}

/* Filter collapse */
.filter-collapse {
  transition: all 0.3s ease;
  overflow: hidden;
}

.filter-collapsed {
  max-height: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  opacity: 0;
}

/* Force layout to stay in same row */
.row {
  display: flex;
  flex-wrap: nowrap;
  margin: 0;
}

.row > [class*="col-"] {
  flex: 0 0 auto;
  padding: 0 15px;
}

.col-lg-2 {
  width: 16.666667%;
  max-width: 16.666667%;
}

.col-lg-10 {
  width: 83.333333%;
  max-width: 83.333333%;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .row {
    flex-wrap: wrap;
  }
  
  .sticky-filter {
    position: relative;
    top: auto;
    max-height: none;
    margin-bottom: 1rem;
  }
  
  .col-lg-2,
  .col-lg-10 {
    width: 100%;
    max-width: 100%;
  }
}

/* Table responsive improvements */
.table-responsive {
  border-radius: 0.5rem;
}

.table th {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  background-color: #f8f9fa !important;
}

.table td {
  font-size: 0.875rem;
  vertical-align: middle;
}

/* Admin table card styling */
.admin-table-card {
  border-radius: 0.75rem;
  overflow: hidden;
}

.admin-table-card .card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.admin-table-card .card-header h5 {
  margin: 0;
  font-weight: 600;
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

/* Fake data button styling */
.fake-data-btn {
  background-color: #fff3cd !important;
  border-color: #ffeaa7 !important;
  color: #856404 !important;
  font-weight: 500;
  transition: all 0.3s ease;
}

.fake-data-btn:hover {
  background-color: #ffeaa7 !important;
  border-color: #fdcb6e !important;
  color: #6c5ce7 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.fake-data-btn:active {
  transform: translateY(0);
}

.modal-footer {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}

.modal-footer .ms-auto {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 991.98px) {
  .filter-sidebar {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .filter-sidebar-collapsed {
    width: 100%;
  }
  
  .table-main-content {
    margin-left: 0;
  }
  
  .table-main-content-expanded {
    margin-left: 0;
  }
}
</style>
