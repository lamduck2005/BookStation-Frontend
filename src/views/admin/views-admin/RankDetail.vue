<template>
  <div class="container-fluid py-4">
    <div class="mb-3">
      <h6 class="text-muted">
        Quản trị viên / <router-link to="/admin/rank">Xếp hạng</router-link> / <strong>Chi tiết xếp hạng: {{ rankName }}</strong>
      </h6>
    </div>
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-6">
          <label class="form-label">Tìm kiếm người dùng:</label>
          <input type="text" class="form-control" placeholder="Nhập tên người dùng hoặc email" v-model="searchQuery" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Không hoạt động</option>
          </select>
        </div>
      </div>
    </div>
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách người dùng thuộc rank {{ rankName }}</strong>
        <div class="ms-auto d-flex justify-content-end mb-3">
          <button class="btn btn-primary btn-sm py-2" :style="{ backgroundColor: '#33304e', borderColor: '#33304e' }" @click="showAddUserModal = true">
            <i class="bi bi-plus-circle me-1"></i> Thêm mới
          </button>
        </div>
      </div>
      <div class="p-3">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
              <td>{{ index + 1 + page * pageSize }}</td>
              <td>{{ user.userName }}</td>
              <td>{{ user.userEmail }}</td>
              <td style="width: 200px;">
                <span :class="user.status == 1 ? 'status-active' : 'status-inactive'">
                  {{ user.status == 1 ? 'Hoạt động' : 'Không hoạt động' }}
                </span>
              </td>
              <td>{{ user.createdAt ? new Date(user.createdAt).toLocaleString() : '-' }}</td>
            </tr>
          </tbody>
        </table>
        <Pagination
          :page-number="page"
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
    <!-- Add User to Rank Modal -->
    <div class="modal fade" :class="{ show: showAddUserModal }" tabindex="-1" style="display: block;" v-if="showAddUserModal">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content enhanced-modal">
          <div class="modal-header gradient-header">
            <h5 class="modal-title">
              <i class="bi bi-person-plus me-2"></i>
              Thêm rank cho người dùng
            </h5>
            <button type="button" class="custom-close-btn" @click="closeAddUserModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body enhanced-body">
            <form @submit.prevent="handleAddUserToRank">
              <!-- Section 1: Thông tin người dùng -->
              <div class="form-section">
                <div class="section-header">
                  <i class="bi bi-person section-icon"></i>
                  <h6 class="section-title">Thông tin người dùng</h6>
                </div>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label enhanced-label">User ID <span class="text-danger">*</span></label>
                    <input 
                      type="number" 
                      class="form-control enhanced-input" 
                      v-model="addUserId" 
                      placeholder="Nhập User ID"
                      required 
                      min="1" 
                    />
                    <div class="form-text">ID của người dùng cần thêm rank</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label enhanced-label">Trạng thái <span class="text-danger">*</span></label>
                    <select class="form-select enhanced-input" v-model="addStatus" required>
                      <option value="1">Hoạt động</option>
                      <option value="0">Không hoạt động</option>
                    </select>
                    <div class="form-text">Trạng thái của rank cho người dùng</div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Thông tin rank -->
              <div class="form-section">
                <div class="section-header">
                  <i class="bi bi-award section-icon"></i>
                  <h6 class="section-title">Thông tin Rank</h6>
                </div>
                <div class="row g-3">
                  <div class="col-md-12">
                    <label class="form-label enhanced-label">Rank <span class="text-danger">*</span></label>
                    <select class="form-select enhanced-input" v-model="addRankId" required>
                      <option value="">Chọn rank</option>
                      <option v-for="rank in rankOptions" :key="rank.id" :value="rank.id">
                        {{ rank.name }}
                      </option>
                    </select>
                    <div class="form-text">Chọn rank để gán cho người dùng</div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer enhanced-footer">
            <button type="button" class="btn btn-secondary btn-cancel" @click="closeAddUserModal">
              <i class="bi bi-x-circle me-1"></i>
              Hủy
            </button>
            <button type="button" class="btn btn-primary btn-submit" @click="handleAddUserToRank">
              <i class="bi bi-check-circle me-1"></i>
              Thêm mới
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddUserModal" class="modal-backdrop fade show"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import Pagination from '@/components/common/Pagination.vue';
import ToggleStatus from '@/components/common/ToggleStatus.vue';
import { getUserRanksByRankId, addUserToRank, toggleUserRankStatus } from '@/services/admin/userRank.js';
import { showToast } from '@/utils/swalHelper';
import { getRanksDropdown } from '@/services/admin/rank.js';

const route = useRoute();
const rankId = route.params.id;
const rankName = route.query.name || '';
const searchQuery = ref('');
const selectedStatus = ref('');
const users = ref([]);
const page = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(0);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const isLastPage = ref(false);
const showAddUserModal = ref(false);
const addUserId = ref('');
const addRankId = ref('');
const addStatus = ref(1);
const rankOptions = ref([]);

const fetchUserRanks = async () => {
  try {
    const params = {
      page: page.value,
      size: pageSize.value,
    };
    
    if (searchQuery.value) {
      params.search = searchQuery.value; // Thay đổi param name nếu cần
    }
    
    if (selectedStatus.value !== '') {
      params.status = selectedStatus.value;
    }
    
    console.log('Fetching user ranks with params:', params); // Debug log
    
    const response = await getUserRanksByRankId(rankId, params);
    const data = response.data || {};
    
    console.log('User ranks response:', response); // Debug log
    
    users.value = data.content || [];
    totalPages.value = data.totalPages ?? 1;
    totalElements.value = data.totalElements ?? users.value.length;
    isLastPage.value = data.last ?? (page.value >= totalPages.value - 1);
  } catch (e) {
    console.error('Error fetching user ranks:', e);
    users.value = [];
    totalPages.value = 1;
    totalElements.value = 0;
    isLastPage.value = true;
    showToast('error', 'Lỗi khi tải danh sách người dùng!', 3000);
  }
};

const fetchRankDropdown = async () => {
  try {
    const response = await getRanksDropdown();
    console.log('Rank dropdown response:', response); // Debug log
    
    // Kiểm tra structure của response
    if (response.data && Array.isArray(response.data)) {
      rankOptions.value = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      rankOptions.value = response.data.data;
    } else {
      rankOptions.value = [];
      console.warn('Unexpected rank dropdown response structure:', response);
    }
  } catch (e) {
    console.error('Error fetching rank dropdown:', e);
    rankOptions.value = [];
  }
};

const handlePrev = () => {
  if (page.value > 0) {
    page.value--;
    fetchUserRanks();
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    page.value++;
    fetchUserRanks();
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  page.value = 0;
  fetchUserRanks();
};

watch([searchQuery, pageSize, selectedStatus], () => {
  page.value = 0;
  fetchUserRanks();
});

onMounted(() => {
  fetchUserRanks();
  fetchRankDropdown();
});

function closeAddUserModal() {
  showAddUserModal.value = false;
  addUserId.value = '';
  addRankId.value = '';
  addStatus.value = 1;
}

async function handleAddUserToRank() {
  // Validation
  if (!addUserId.value || addUserId.value <= 0) {
    showToast('error', 'Vui lòng nhập User ID hợp lệ!', 3000);
    return;
  }
  
  if (!addRankId.value) {
    showToast('error', 'Vui lòng chọn Rank!', 3000);
    return;
  }
  
  if (addStatus.value === '') {
    showToast('error', 'Vui lòng chọn trạng thái!', 3000);
    return;
  }
  
  try {
    const payload = {
      userId: Number(addUserId.value),
      rankId: Number(addRankId.value),
      status: Number(addStatus.value)
    };
    
    console.log('Sending payload:', payload); // Debug log
    
    const response = await addUserToRank(payload);
    
    console.log('Response:', response); // Debug log
    
    showToast('success', 'Thêm người dùng vào rank thành công!', 2000);
    fetchUserRanks();
    closeAddUserModal();
  } catch (e) {
    console.error('Error adding user to rank:', e); // Debug log
    const status = e?.response?.status;
    const message = e?.response?.data?.message || 'Có lỗi xảy ra khi thêm người dùng vào rank';
    showToast('error', `Thêm thất bại! [${status}] ${message}`, 4000);
  }
}

async function handleUserRankStatusChange(user) {
  const oldStatus = user.status; // Lưu trạng thái cũ trước khi đổi
  user.status = oldStatus === 1 ? 0 : 1; // Đảo trạng thái trên UI ngay khi click toggle
  try {
    const res = await toggleUserRankStatus(user.id); // Gọi API đổi trạng thái trên backend
    // Nếu backend trả về message và status thì show toast theo kết quả
    if (res && res.status && res.message) {
      showToast(
        res.status === 200 ? 'success' : 'error',
        res.message,
        2000
      );
    } else {
      showToast('success', 'Đổi trạng thái thành công!', 1500);
    }
    fetchUserRanks(); // Refresh lại danh sách cho chắc chắn
  } catch (e) {
    user.status = oldStatus; // Nếu lỗi, trả lại trạng thái cũ để toggle không bị sai màu/trạng thái
    // Hiển thị thông báo lỗi chi tiết từ backend
    const status = e?.response?.status || e?.status || 'Lỗi';
    const message = e?.response?.data?.message || e?.message || 'Đổi trạng thái thất bại!';
    showToast('error', `Lỗi ${status}: ${message}`, 3000);
  }
}
</script>
<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

/* Enhanced Modal Styles */
.modal-lg {
  max-width: 700px !important;
}

.modal-dialog-scrollable {
  max-height: 90vh;
}

.modal-dialog-scrollable .modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

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

.gradient-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
  background-size: 300% 100%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.modal-title {
  font-weight: 600;
  color: #2c2c54;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.enhanced-body {
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.enhanced-footer {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 0.875rem 1.25rem;
  border-radius: 0 0 15px 15px;
}

/* Form Section Styles */
.form-section {
  margin-bottom: 1.75rem;
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #ecae9e;
  position: relative;
  transition: all 0.3s ease;
}

.form-section:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.form-section:nth-child(1) {
  border-left-color: #ecae9e;
}

.form-section:nth-child(2) {
  border-left-color: #4ecdc4;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f3f4;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, #ecae9e, #4ecdc4);
  border-radius: 1px;
}

.section-icon {
  font-size: 1rem;
  color: #ecae9e;
  margin-right: 0.5rem;
  padding: 0.4rem;
  background: rgba(236, 174, 158, 0.1);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  margin: 0;
  font-weight: 600;
  color: #2c2c54;
  font-size: 0.95rem;
}

/* Enhanced Form Controls */
.enhanced-label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #495057;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

.enhanced-label .text-danger {
  margin-left: 0.25rem;
}

.enhanced-input {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  background: #ffffff;
}

.enhanced-input:focus {
  border-color: #ecae9e;
  box-shadow: 0 0 0 0.15rem rgba(236, 174, 158, 0.25);
  background: #ffffff;
}

.enhanced-input:hover {
  border-color: #d49489;
}

/* Button Styles */
.btn-submit {
  background: linear-gradient(135deg, #ecae9e 0%, #d49489 100%);
  border: none;
  border-radius: 20px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(236, 174, 158, 0.3);
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(236, 174, 158, 0.4);
  background: linear-gradient(135deg, #d49489 0%, #c08579 100%);
}

.btn-cancel {
  border: 1px solid #6c757d;
  border-radius: 20px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  background: transparent;
  color: #6c757d;
}

.btn-cancel:hover {
  background: #6c757d;
  color: white;
  transform: translateY(-1px);
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

/* Form text */
.form-text {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

/* Modal backdrop */
.modal-backdrop {
  z-index: 1040;
}

.modal {
  z-index: 1050;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .enhanced-modal {
    margin: 0.5rem;
  }
  
  .enhanced-body {
    padding: 0.75rem;
  }
  
  .form-section {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .modal-lg {
    max-width: 95% !important;
  }
}

/* Animation for form sections */
.form-section {
  animation: slideInUp 0.4s ease-out;
}

.form-section:nth-child(1) {
  animation-delay: 0s;
}

.form-section:nth-child(2) {
  animation-delay: 0.1s;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
