<template>
  <div class="admin-page container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="text-muted">
          Admin / <router-link to="/admin/campaigns" class="text-decoration-none">Quản lý chiến dịch</router-link> / <strong>Quản lý phần thưởng</strong>
        </h6>
        <button class="btn btn-outline-secondary btn-sm" @click="goBack">
          <i class="bi bi-arrow-left me-1"></i>
          Quay lại
        </button>
      </div>
    </div>

    <!-- Campaign Info -->
    <div class="card mb-4" v-if="campaign">
      <div class="card-body">
        <h5 class="card-title">{{ campaign.name }}</h5>
        <div class="row">
          <div class="col-md-3">
            <small class="text-muted">Thời gian:</small><br>
            <strong>{{ formatDateTime(campaign.startDate) }}</strong> đến <strong>{{ formatDateTime(campaign.endDate) }}</strong>
          </div>
          <div class="col-md-3">
            <small class="text-muted">Cấu hình:</small><br>
            <span class="badge bg-success me-2">Free: {{ campaign.configFreeLimit }}</span>
            <span class="badge bg-info">Cost: {{ campaign.configPointCost }} điểm</span>
          </div>
          <div class="col-md-3">
            <small class="text-muted">Trạng thái:</small><br>
            <span :class="campaign.status ? 'badge bg-success' : 'badge bg-secondary'">
              {{ campaign.status ? 'Hoạt động' : 'Không hoạt động' }}
            </span>
          </div>
          <div class="col-md-3">
            <small class="text-muted">Mô tả:</small><br>
            <span>{{ campaign.description || 'Không có mô tả' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Rewards Table -->
    <div class="card admin-table-card">
      <div class="card-header bg-light border-0 py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="bi bi-gift-fill me-2"></i>
            Danh sách phần thưởng
          </h5>
          <div class="d-flex gap-2">
            <AddButton @click="showAddModal" />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-4 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Đang tải dữ liệu...</p>
      </div>

      <!-- Table with proper responsive class -->
      <div v-else class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th class="action-column">Thao tác</th>
              <th>ID</th>
              <th>Loại</th>
              <th>Tên phần thưởng</th>
              <th>Giá trị</th>
              <th>Số lượng</th>
              <th>Xác suất</th>
              <th>Trạng thái</th>
              <th>Thống kê</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reward in rewards" :key="reward.id" :class="{ 'table-secondary': !reward.status }">
              <td>
                <div class="d-flex gap-1">
                  <EditButton @click="showEditModal(reward)" />
                  <DeleteButton @click="deleteReward(reward)" />
                </div>
              </td>
              <td>
                <strong class="text-primary">{{ reward.id }}</strong>
              </td>
              <td>
                <span :class="getRewardTypeClass(reward.type)">
                  {{ getRewardTypeLabel(reward.type) }}
                </span>
              </td>
              <td>
                <div>
                  <strong>{{ reward.name }}</strong>
                  <div class="text-muted small text-wrap" style="max-width: 250px;">{{ reward.description }}</div>
                </div>
              </td>
              <td>
                <div v-if="reward.type === 'VOUCHER'" class="small">
                  <strong>{{ reward.voucherName }}</strong><br>
                  <code>{{ reward.voucherCode }}</code>
                </div>
                <div v-else-if="reward.type === 'POINTS'" class="small">
                  <strong>{{ reward.pointValue }} điểm</strong>
                </div>
                <div v-else class="small text-muted">
                  Không có giá trị
                </div>
              </td>
              <td>
                <div class="small">
                  <div><strong>Tổng:</strong> {{ reward.quantityTotal }}</div>
                  <div><strong>Còn:</strong> {{ reward.quantityRemaining }}</div>
                </div>
              </td>
              <td>
                <span class="badge bg-primary">{{ reward.probability }}%</span>
              </td>
              <td>
                <ToggleStatus
                  :id="reward.id"
                  v-model="reward.status"
                  @change="updateStatus(reward, $event)"
                />
              </td>
              <td>
                <div class="small">
                  <div><strong>Đã phát:</strong> {{ reward.distributedCount || 0 }}</div>
                  <div><strong>Tỷ lệ:</strong> {{ reward.distributedPercentage || 0 }}%</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Add/Edit Reward Modal -->
  <div class="modal fade" id="rewardModal" tabindex="-1" aria-labelledby="rewardModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="rewardModalLabel">
            <i class="bi bi-gift me-2"></i>
            {{ editingReward ? 'Chỉnh sửa phần thưởng' : 'Thêm phần thưởng mới' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveReward">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="rewardType" class="form-label">Loại phần thưởng *</label>
                  <select class="form-select" id="rewardType" v-model="rewardForm.type" required>
                    <option value="VOUCHER">Voucher</option>
                    <option value="POINTS">Điểm thưởng</option>
                    <option value="NONE">Không trúng</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="rewardStatus" class="form-label">Trạng thái</label>
                  <select class="form-select" id="rewardStatus" v-model="rewardForm.status">
                    <option :value="1">Hoạt động</option>
                    <option :value="0">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label for="rewardName" class="form-label">Tên phần thưởng *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="rewardName"
                    v-model="rewardForm.name" 
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Voucher specific fields -->
            <div v-if="rewardForm.type === 'VOUCHER'" class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label for="voucherSelect" class="form-label">Chọn voucher *</label>
                  <select class="form-select" id="voucherSelect" v-model="rewardForm.voucherId" required>
                    <option value="">-- Chọn voucher --</option>
                    <option v-for="voucher in voucherOptions" :key="voucher.id" :value="voucher.id">
                      {{ voucher.name }} ({{ voucher.code }})
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Points specific fields -->
            <div v-if="rewardForm.type === 'POINTS'" class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="pointValue" class="form-label">Giá trị điểm *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="pointValue"
                    v-model="rewardForm.pointValue" 
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="quantityTotal" class="form-label">Số lượng *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="quantityTotal"
                    v-model="rewardForm.quantityTotal" 
                    min="1"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="probability" class="form-label">Xác suất (%) *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="probability"
                    v-model="rewardForm.probability" 
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="rewardDescription" class="form-label">Mô tả</label>
              <textarea 
                class="form-control" 
                id="rewardDescription"
                v-model="rewardForm.description" 
                rows="3"
              ></textarea>
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="bi bi-check-circle me-1"></i>
                {{ editingReward ? 'Cập nhật' : 'Thêm mới' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Modal } from 'bootstrap';
import { showToast } from '@/utils/swalHelper';
import Swal from 'sweetalert2';
import ToggleStatus from '@/components/common/ToggleStatus.vue';
import AddButton from '@/components/common/AddButton.vue';
import EditButton from '@/components/common/EditButton.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
import {
  getRewardsByCampaign,
  createReward,
  updateReward,
  updateRewardStatus,
  deleteReward as deleteRewardApi,
  getVouchersDropdown
} from '@/services/admin/reward';
import { getCampaignById } from '@/services/admin/campaign';

const router = useRouter();
const route = useRoute();

// Data
const campaignId = ref(parseInt(route.params.id));
const campaign = ref(null);
const rewards = ref([]);
const loading = ref(false);
const voucherOptions = ref([]);

// Form data
const rewardForm = ref({
  campaignId: campaignId.value,
  type: 'VOUCHER',
  name: '',
  description: '',
  voucherId: null,
  pointValue: null,
  quantityTotal: 1,
  probability: 1.0,
  status: 1
});

const editingReward = ref(null);

// Methods
const goBack = () => {
  router.push('/admin/campaigns');
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString('vi-VN');
};

const getRewardTypeClass = (type) => {
  switch (type) {
    case 'VOUCHER': return 'badge bg-success';
    case 'POINTS': return 'badge bg-warning';
    case 'NONE': return 'badge bg-secondary';
    default: return 'badge bg-light';
  }
};

const getRewardTypeLabel = (type) => {
  switch (type) {
    case 'VOUCHER': return 'Voucher';
    case 'POINTS': return 'Điểm';
    case 'NONE': return 'Không trúng';
    default: return type;
  }
};

const loadCampaign = async () => {
  try {
    const response = await getCampaignById(campaignId.value);
    campaign.value = response;
  } catch (error) {
    showToast('Lỗi khi tải thông tin chiến dịch: ' + error.message, 'error');
  }
};

const loadRewards = async () => {
  loading.value = true;
  try {
    const response = await getRewardsByCampaign(campaignId.value);
    rewards.value = response.data || [];
  } catch (error) {
    showToast('Lỗi khi tải danh sách phần thưởng: ' + error.message, 'error');
  } finally {
    loading.value = false;
  }
};

const loadVoucherOptions = async () => {
  try {
    const response = await getVouchersDropdown();
    voucherOptions.value = response.data || [];
  } catch (error) {
    console.error('Error loading voucher options:', error);
  }
};

const showAddModal = () => {
  editingReward.value = null;
  rewardForm.value = {
    campaignId: campaignId.value,
    type: 'VOUCHER',
    name: '',
    description: '',
    voucherId: null,
    pointValue: null,
    quantityTotal: 1,
    probability: 1.0,
    status: 1
  };
  const modal = new Modal(document.getElementById('rewardModal'));
  modal.show();
};

const showEditModal = (reward) => {
  editingReward.value = reward;
  rewardForm.value = {
    id: reward.id,
    campaignId: campaignId.value,
    type: reward.type,
    name: reward.name,
    description: reward.description,
    voucherId: reward.voucherId,
    pointValue: reward.pointValue,
    quantityTotal: reward.quantityTotal,
    probability: reward.probability,
    status: reward.status
  };
  const modal = new Modal(document.getElementById('rewardModal'));
  modal.show();
};

const saveReward = async () => {
  loading.value = true;
  try {
    const formData = {
      ...rewardForm.value,
      createdBy: 1 // TODO: Get from auth
    };

    if (editingReward.value) {
      await updateReward(formData);
      showToast('Cập nhật phần thưởng thành công!', 'success');
    } else {
      await createReward(formData);
      showToast('Thêm phần thưởng thành công!', 'success');
    }

    const modal = Modal.getInstance(document.getElementById('rewardModal'));
    modal.hide();
    loadRewards();
  } catch (error) {
    showToast('Lỗi khi lưu phần thưởng: ' + error.message, 'error');
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (reward, status) => {
  try {
    const response = await updateRewardStatus(reward.id);
    reward.status = status;
    showToast(response.message || 'Cập nhật trạng thái thành công!', 'success');
  } catch (error) {
    reward.status = reward.status === 1 ? 0 : 1; // Revert
    showToast('Lỗi khi cập nhật trạng thái: ' + error.message, 'error');
  }
};

const deleteReward = async (reward) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa?',
    text: `Bạn có chắc chắn muốn xóa phần thưởng "${reward.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  });

  if (result.isConfirmed) {
    try {
      await deleteRewardApi(reward.id);
      showToast('Xóa phần thưởng thành công!', 'success');
      loadRewards();
    } catch (error) {
      showToast('Lỗi khi xóa phần thưởng: ' + error.message, 'error');
    }
  }
};

onMounted(() => {
  loadCampaign();
  loadRewards();
  loadVoucherOptions();
});
</script>

<style scoped>
@import '@/assets/css/admin-table-responsive.css';

/* Filter sidebar styles - giống Rank.vue */
.filter-sidebar {
  width: 250px;
  position: sticky;
  top: 20px;
  height: fit-content;
  z-index: 10;
  transition: all 0.3s ease;
}

.filter-sidebar-collapsed {
  width: 60px;
}

.filter-card {
  border-radius: 15px;
  overflow: hidden;
}

.filter-collapse {
  transition: all 0.3s ease;
  opacity: 1;
  max-height: 1000px;
}

.filter-collapsed {
  opacity: 0;
  max-height: 0;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
}

/* Table main content styles */
.table-main-content {
  margin-left: 270px;
  transition: margin-left 0.3s ease;
}

.table-main-content-expanded {
  margin-left: 80px;
}

/* Admin table card */
.admin-table-card {
  border-radius: 15px;
  overflow: hidden;
}

/* Loading overlay */
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

/* Responsive styles */
@media (max-width: 1200px) {
  .table-main-content {
    margin-left: 270px;
  }
  
  .table-main-content-expanded {
    margin-left: 80px;
  }
}

@media (max-width: 991.98px) {
  .filter-sidebar {
    width: 100%;
    margin-bottom: 1rem;
    position: relative;
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

.filter-card {
  position: sticky;
  top: 20px;
  z-index: 1000;
}

.filter-collapse {
  max-height: 400px;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.filter-collapsed {
  max-height: 0;
  overflow: hidden;
}

.bg-gradient-primary {
  background: linear-gradient(90deg, #6c5ce7 0%, #74b9ff 100%);
}

.sticky-filter {
  position: sticky;
  top: 20px;
}
</style>
