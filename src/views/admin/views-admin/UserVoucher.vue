<template>
  <div class="admin-page container-fluid py-4">
    <!-- Bộ lọc tìm kiếm -->
    <div class="card mb-5 shadow-lg border-0 filter-card">
      <div class="card-header bg-light border-0 py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-funnel me-2"></i>
            Bộ lọc tìm kiếm
          </h5>
          <button 
            class="btn btn-sm btn-outline-secondary" 
            type="button" 
            @click="toggleFilter"
            :aria-expanded="showFilter"
          >
            <i :class="showFilter ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
            {{ showFilter ? 'Thu gọn' : 'Mở rộng' }}
          </button>
        </div>
      </div>
      <div class="card-body filter-collapse" :class="{ 'filter-collapsed': !showFilter }">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-search me-1"></i>
              Tìm kiếm theo tên
            </label>
            <input
              type="text"
              class="form-control"
              placeholder="Nhập tên người dùng"
              v-model="searchName"
            />
          </div>
        </div>
        <div class="row g-3 pt-3 d-flex justify-content-center">
          <div class="col-md-1">
            <button class="btn btn-success w-100 me-2" @click="searchWithFilter">
              <i class="bi bi-funnel"></i> Lọc
            </button>
          </div>
          <div class="col-md-2">
            <button class="btn btn-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle me-1"></i> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Danh sách User Voucher -->
    <div class="card shadow-lg border-0 mb-4 admin-table-card">
      <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
        <div>
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-people me-2"></i>
            Danh sách người dùng nhận voucher
          </h5>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-info btn-sm py-2" @click="loadUsers" :disabled="loading">
            <i class="bi bi-arrow-repeat me-1"></i> Làm mới
          </button>
          
          <button class="btn btn-success btn-sm py-2" @click="openAddForm">
            <i class="bi bi-plus-circle me-1"></i> Phát voucher
          </button>
          
          <button class="btn btn-warning btn-sm py-2" @click="confirmGiveAll" :disabled="givingAll">
            <span v-if="givingAll" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-people me-1"></i> Phát cho tất cả người dùng
          </button>
          
          <!-- Dropdown phát theo hạng -->
          <div class="dropdown">
            <button 
              class="btn btn-outline-primary btn-sm py-2 dropdown-toggle" 
              type="button" 
              @click="toggleRankDropdown"
              :disabled="givingAll"
              :aria-expanded="showRankDropdown"
            >
              <i class="bi bi-award me-1"></i> Phát theo hạng
            </button>
            
            <ul class="dropdown-menu" :class="{ 'show': showRankDropdown }">
              <li>
                <button 
                  class="dropdown-item" 
                  type="button"
                  @click="handleRankSelect('silver')"
                >
                  <i class="bi bi-award-fill text-secondary me-2"></i>
                  Hạng Bạc
                </button>
              </li>
              <li>
                <button 
                  class="dropdown-item" 
                  type="button"
                  @click="handleRankSelect('gold')"
                >
                  <i class="bi bi-award-fill text-warning me-2"></i>
                  Hạng Vàng
                </button>
              </li>
              <li>
                <button 
                  class="dropdown-item" 
                  type="button"
                  @click="handleRankSelect('diamond')"
                >
                  <i class="bi bi-award-fill text-info me-2"></i>
                  Hạng Kim cương
                </button>
              </li>
            </ul>
          </div>
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
                <th style="width: 200px">Tên người dùng</th>
                <th style="width: 180px">Mã voucher</th>
                <th style="width: 120px">Số lần dùng</th>
                <th style="width: 150px">Ngày nhận</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-else v-for="(user, idx) in paginatedUsers" :key="user.id" class="align-middle" style="vertical-align: middle;">
                <td class="py-3">{{ currentPage * pageSize + idx + 1 }}</td>
                <td class="py-3 fw-bold">{{ user.fullName }}</td>
                <td class="py-3">{{ user.voucherCode }}</td>
                <td class="py-3">
                  <span class="badge bg-primary">{{ user.usedCount }}</span>
                </td>
                <td class="py-3">
                  <span class="fw-bold">{{ toTime(user.createdAt) }}</span>
                  <br />
                  <small class="text-muted">{{ toDate(user.createdAt) }}</small>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="p-3">
            <Pagination :page-number="currentPage" :total-pages="totalPages" :is-last-page="isLastPage"
              :page-size="pageSize" :items-per-page-options="itemsPerPageOptions" :total-elements="totalElements"
              @prev="handlePrev" @next="handleNext" @update:pageSize="handlePageSizeChange" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Thêm User Voucher -->
    <div class="modal fade" id="addUserVoucherModal" tabindex="-1" aria-labelledby="addUserVoucherModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header form-modal-header">
            <h5 class="modal-title" id="addUserVoucherModalLabel">
              <i class="bi bi-plus-circle me-2"></i>
              Phát voucher cho người dùng
            </h5>
            <button type="button" class="custom-close-btn" data-bs-dismiss="modal" aria-label="Close">
              <i class="bx bx-x-circle"></i>
            </button>
          </div>

          <div class="modal-body form-modal-body">
            <form @submit.prevent="submitAddForm">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">
                    Chọn người dùng <span class="text-danger">*</span>
                  </label>
                  <Multiselect 
                    v-model="formSelected.customer" 
                    :options="dropdowns.customers.options" 
                    :searchable="true"
                    :internal-search="true" 
                    :close-on-select="true" 
                    :clear-on-select="false" 
                    label="fullName" 
                    track-by="id" 
                    placeholder="Chọn người dùng để phát voucher"
                  >
                    <template #option="{ option }">
                      <div class="d-flex flex-column">
                        <strong>{{ option.fullName || option.name }}</strong>
                        <small v-if="option.phone" class="text-muted">{{ option.phone }}</small>
                        <small v-if="option.email" class="text-muted">{{ option.email }}</small>
                      </div>
                    </template>
                  </Multiselect>
                </div>
                <div class="col-12">
                  <input type="hidden" class="form-control" v-model="addForm.voucherId" readonly />
                </div>
                <div class="col-12">
                  <p class="my-5"></p>
                </div>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn form-btn-secondary" data-bs-dismiss="modal">
              Hủy
            </button>
            <button type="submit" class="btn form-btn-primary" @click="submitAddForm" :disabled="!formSelected.customer">
              Thêm mới
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Pagination from "@/components/common/Pagination.vue";
import { ref, computed, onMounted, watch, reactive } from "vue";
import { Modal } from "bootstrap";
import { showToast, showQuickConfirm } from "@/utils/swalHelper";
import { getUsersByVoucherId, giveVoucherToAll } from "@/services/admin/voucher";
import { addVoucherForNewuser, distributeVoucherToSilver, distributeVoucherToGold, distributeVoucherToDiamond } from "@/services/client/userVoucher";
import { getUserIdByEmail } from "@/services/admin/user";
import { getCustomersDropdown } from "@/services/admin/select.js";
import { toDate, toTime } from "@/utils/utils.js";
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

const users = ref([]);
const totalElements = ref(0);
const currentPage = ref(0);
const pageSize = ref(10);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const searchName = ref("");
const loading = ref(false);
const givingAll = ref(false);
const showFilter = ref(true);

// Dropdown state
const showRankDropdown = ref(false);
const selectedRank = ref("");

// Modal state
const addForm = ref({
  userId: "",
  voucherId: props.id,
});

// Multiselect state
const dropdowns = reactive({
  customers: { options: [] }
});

const formSelected = reactive({
  customer: null
});

// Lấy voucherId từ props
const voucherId = Number(props.id);

// Lọc theo tên người dùng
const filteredUsers = computed(() => {
  if (!searchName.value) return users.value;
  return users.value.filter((u) =>
    u.fullName.toLowerCase().includes(searchName.value.toLowerCase())
  );
});

// Phân trang
const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / pageSize.value)
);
const paginatedUsers = computed(() =>
  filteredUsers.value.slice(
    currentPage.value * pageSize.value,
    (currentPage.value + 1) * pageSize.value
  )
);

// Kiểm tra có phải trang cuối không
const isLastPage = computed(() => currentPage.value >= totalPages.value - 1);

const searchWithFilter = () => {
  currentPage.value = 0;
};

const clearFilters = () => {
  searchName.value = "";
  currentPage.value = 0;
};

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

async function loadUsers() {
  loading.value = true;
  try {
    const res = await getUsersByVoucherId(voucherId);
    users.value = res;
    totalElements.value = res.length;
    // Reset về trang đầu khi load lại
    currentPage.value = 0;
  } catch (error) {
    users.value = [];
    totalElements.value = 0;
    showToast("error", "Không thể tải danh sách người dùng");
  } finally {
    loading.value = false;
  }
}

// Load dropdown customers
const handleGetDropdown = async () => {
  try {
    const customersRes = await getCustomersDropdown();
    if (customersRes && customersRes.data) {
      dropdowns.customers.options = customersRes.data;
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách customers:', error);
    dropdowns.customers.options = [];
  }
};

// Pagination methods
const handlePrev = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const handleNext = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 0;
};

// Modal handlers
function openAddForm() {
  addForm.value = {
    userId: "",
    voucherId: props.id,
  };
  formSelected.customer = null;
  showAddFormModal();
}

function showAddFormModal() {
  const el = document.getElementById("addUserVoucherModal");
  const modal = Modal.getOrCreateInstance(el);
  modal.show();
}

async function submitAddForm() {
  if (!formSelected.customer) {
    showToast("error", "Vui lòng chọn người dùng!");
    return;
  }

  addForm.value.userId = formSelected.customer.id;

  const exists = users.value.some(
    (user) => user.userId === addForm.value.userId
  );
  if (exists) {
    showToast("error", "Người dùng này đã nhận voucher trước đó.");
    return;
  }

  try {
    const response = await addVoucherForNewuser(addForm.value);
    const message = response?.data?.message || "Phát voucher thành công!";
    Modal.getOrCreateInstance(document.getElementById("addUserVoucherModal")).hide();
    showToast("success", message);
    await loadUsers();
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Thêm thất bại!";
    showToast("error", errorMessage);
  }
}

async function confirmGiveAll() {
  const result = await showQuickConfirm(
    "Phát voucher cho TẤT CẢ người dùng?",
    "Bạn có chắc chắn muốn phát voucher này đến tất cả người dùng?",
    "question",
    "Phát ngay",
    "Hủy"
  );

  if (!result.isConfirmed) return;

  givingAll.value = true;
  try {
    const response = await giveVoucherToAll(voucherId);
    const message = response?.data?.message || "Đã phát voucher cho tất cả người dùng!";
    showToast("success", message);
    await loadUsers();
  } catch (e) {
    const errorMessage = e?.response?.data?.message || "Lỗi khi phát voucher hàng loạt!";
    showToast("error", errorMessage);
  } finally {
    givingAll.value = false;
  }
}

// Hàm phát voucher theo hạng
async function distributeByRank(rank) {
  const rankNames = {
    'silver': 'Bạc',
    'gold': 'Vàng', 
    'diamond': 'Kim cương'
  };
  
  const result = await showQuickConfirm(
    `Phát voucher cho người dùng hạng ${rankNames[rank]}?`,
    `Bạn có chắc chắn muốn phát voucher này đến tất cả người dùng hạng ${rankNames[rank]}?`,
    "question",
    "Phát ngay",
    "Hủy"
  );

  if (!result.isConfirmed) return;

  givingAll.value = true;
  try {
    let response;
    switch (rank) {
      case 'silver':
        response = await distributeVoucherToSilver(voucherId);
        break;
      case 'gold':
        response = await distributeVoucherToGold(voucherId);
        break;
      case 'diamond':
        response = await distributeVoucherToDiamond(voucherId);
        break;
      default:
        throw new Error('Hạng không hợp lệ');
    }
    
    const message = response?.data?.message || `Đã phát voucher cho người dùng hạng ${rankNames[rank]}!`;
    showToast("success", message);
    await loadUsers();
  } catch (e) {
    const errorMessage = e?.response?.data?.message || `Lỗi khi phát voucher cho hạng ${rankNames[rank]}!`;
    showToast("error", errorMessage);
  } finally {
    givingAll.value = false;
  }
}

// Hàm xử lý khi chọn hạng từ dropdown
const handleRankSelect = (rank) => {
  selectedRank.value = rank;
  showRankDropdown.value = false;
  distributeByRank(rank);
};

// Hàm đóng/mở dropdown
const toggleRankDropdown = () => {
  showRankDropdown.value = !showRankDropdown.value;
};

// Đóng dropdown khi click bên ngoài
const closeRankDropdown = () => {
  showRankDropdown.value = false;
};

onMounted(() => {
  loadUsers();
  handleGetDropdown();
  
  // Thêm event listener để đóng dropdown khi click bên ngoài
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
      closeRankDropdown();
    }
  });
});

watch([pageSize], () => {
  currentPage.value = 0;
});
</script>

<style scoped>
@import "@/assets/css/admin-global.css";
@import "@/assets/css/form-global.css";
@import "@/assets/css/vue-multiselect.css";

/* Filter collapse */
.filter-collapse {
  transition: all 0.3s ease;
  overflow: hidden;
}

.filter-collapsed {
  max-height: 0;
  padding: 0;
  opacity: 0;
  pointer-events: none;
}

/* Dropdown styling */
.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
  padding: 0.5rem 0;
  min-width: 200px;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.dropdown-item:active {
  background-color: #e9ecef;
}

/* Icon colors for ranks */
.text-secondary {
  color: #6c757d !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-info {
  color: #0dcaf0 !important;
}

/* Dropdown button styling */
.dropdown-toggle::after {
  margin-left: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dropdown-menu {
    min-width: 180px;
  }
  
  .dropdown-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
