<template>
  <div class="container-fluid py-4">
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <router-link to="/admin/rank">Rank</router-link> / <strong>Chi tiết Rank: {{ rankName }}</strong>
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
          <input type="text" class="form-control" placeholder="Nhập tên hoặc email" v-model="searchQuery" />
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
              <th>Ngày tham gia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
              <td>{{ index + 1 + page * pageSize }}</td>
              <td>{{ user.userName }}</td>
              <td>{{ user.userEmail }}</td>
              <td style="width: 200px;">
                <ToggleStatus :id="user.id" :model-value="Number(user.status)" :true-value="1" :false-value="0"
                  active-text="Hoạt động" inactive-text="Không hoạt động"
                  @change="handleUserRankStatusChange(user)" />
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
    <div class="modal fade" :class="{ show: showAddUserModal }" tabindex="-1" style="display: block;" v-if="showAddUserModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #ecae9e;">
            <h5 class="modal-title">
              <i class="bi me-2 bi-plus-circle"></i> Thêm rank cho người dùng
            </h5>
            <button type="button" class="custom-close-btn" @click="closeAddUserModal" style="background: transparent; border: none; box-shadow: none; outline: none;">
              <img src="https://cdn-icons-png.flaticon.com/128/1828/1828666.png" alt="Close" style="width: 24px; height: 24px;" />
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleAddUserToRank">
              <div class="mb-3">
                <label class="form-label">User ID <span class="text-danger">*</span></label>
                <input type="number" class="form-control" v-model="addUserId" required min="1" />
              </div>
              <div class="mb-3">
                <label class="form-label">Rank <span class="text-danger">*</span></label>
                <select class="form-select" v-model="addRankId" required>
                  <option v-for="rank in rankOptions" :key="rank.id" :value="rank.id">
                    {{ rank.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái <span class="text-danger">*</span></label>
                <select class="form-select" v-model="addStatus" required>
                  <option value="1">Hoạt động</option>
                  <option value="0">Không hoạt động</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" :style="{ backgroundColor: '#33304e', borderColor: '#33304e' }">Thêm mới</button>
            </form>
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
import axios from '@/utils/axios';
import Pagination from '@/components/common/Pagination.vue';
import ToggleStatus from '@/components/common/ToggleStatus.vue';
import { toggleUserRankStatus } from '@/services/admin/userRank.js';
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
const addRankId = ref(Number(rankId));
const addStatus = ref(1);
const rankOptions = ref([]);

const fetchUserRanks = async () => {
  try {
    const params = {
      page: page.value,
      size: pageSize.value,
      rankId,
    };
    if (searchQuery.value) {
      params.userName = searchQuery.value;
      params.email = searchQuery.value;
    }
    if (selectedStatus.value !== '') {
      params.status = selectedStatus.value;
    }
    const res = await axios.get(`/api/user-ranks/rank/${rankId}`, { params });
    const data = res.data?.data || {};
    users.value = data.content || [];
    totalPages.value = data.totalPages ?? 1;
    totalElements.value = data.totalElements ?? users.value.length;
    isLastPage.value = page.value >= totalPages.value - 1;
  } catch (e) {
    users.value = [];
    totalPages.value = 1;
    totalElements.value = 0;
    isLastPage.value = true;
  }
};

const fetchRankDropdown = async () => {
  try {
    const res = await getRanksDropdown();
    rankOptions.value = res.data?.data || [];
  } catch (e) {
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
  addRankId.value = Number(rankId);
  addStatus.value = 1;
}

async function handleAddUserToRank() {
  try {
    await axios.post('/api/user-ranks', {
      userId: Number(addUserId.value),
      rankId: Number(addRankId.value),
      status: Number(addStatus.value)
    });
    showToast('success', 'Thêm người dùng vào rank thành công!', 1500);
    fetchUserRanks();
    closeAddUserModal();
  } catch (e) {
    const status = e?.response?.status;
    const message = e?.response?.data?.message || '';
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
</style>
