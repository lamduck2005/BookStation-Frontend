<template>
  <div class="admin-page container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Admin / <strong>Quản lý chiến dịch mở hộp</strong>
      </h6>
    </div>

    <!-- Layout 2 cột: Bộ lọc bên trái, Bảng bên phải -->
    <div class="row">
      <!-- Cột bộ lọc (bên trái) -->
      <div class="col-lg-2 col-xl-2" :class="{ 'd-none': !showFilter }">
        <div class="card filter-card sticky-filter">
          <div class="card-header bg-light border-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bi bi-funnel me-2"></i>
                Bộ lọc
              </h5>
              <button 
                class="btn btn-sm btn-outline-secondary" 
                type="button" 
                @click="toggleFilter"
                title="Ẩn bộ lọc"
              >
                <i class="bi bi-eye-slash"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-gift me-1"></i>
                Tên chiến dịch
              </label>
              <input 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Nhập tên chiến dịch" 
                v-model="searchName" 
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
                <option value="1">Hoạt động</option>
                <option value="0">Không hoạt động</option>
              </select>
            </div>
            
            <div class="mb-3">
              <button class="btn btn-secondary btn-sm w-100" @click="resetFilters">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Reset bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột bảng (bên phải) -->
      <div class="col-lg-10 col-xl-10" :class="{ 'col-lg-12 col-xl-12': !showFilter }">
        <div class="card admin-table-card">
          <div class="card-header bg-light border-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bi bi-gift-fill me-2"></i>
                Danh sách chiến dịch mở hộp
              </h5>
              <div class="d-flex gap-2">
                <button 
                  v-if="!showFilter"
                  class="btn btn-outline-secondary btn-sm" 
                  @click="toggleFilter"
                  title="Hiện bộ lọc"
                >
                  <i class="bi bi-funnel me-1"></i>
                  Bộ lọc
                </button>
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
                  <th>Tên chiến dịch</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Cấu hình</th>
                  <th>Thống kê</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="campaign in campaigns" :key="campaign.id">
                  <td>
                    <div class="d-flex gap-1">
                      <button 
                        class="btn btn-warning btn-sm"
                        @click="goToRewardPage(campaign.id)"
                        title="Quản lý phần thưởng"
                      >
                        <i class="bi bi-gift"></i>
                      </button>
                      <EditButton @click="showEditModal(campaign)" />
                      <DeleteButton @click="deleteCampaign(campaign)" />
                    </div>
                  </td>
                  <td>
                    <strong class="text-primary">{{ campaign.id }}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>{{ campaign.name }}</strong>
                      <div class="text-muted small text-wrap" style="max-width: 250px;">{{ campaign.description }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="small">
                      <strong>Bắt đầu:</strong> {{ formatDateTime(campaign.startDate) }}<br>
                      <strong>Kết thúc:</strong> {{ formatDateTime(campaign.endDate) }}
                    </div>
                  </td>
                  <td>
                    <ToggleStatus
                      :id="campaign.id"
                      v-model="campaign.status"
                      @change="updateStatus(campaign, $event)"
                    />
                  </td>
                  <td>
                    <div class="small">
                      <span class="badge bg-success me-1">Free: {{ campaign.configFreeLimit }}</span><br>
                      <span class="badge bg-info">Cost: {{ campaign.configPointCost }} điểm</span>
                    </div>
                  </td>
                  <td>
                    <div class="small">
                      <div>Người tham gia: <strong>{{ campaign.totalParticipants || 0 }}</strong></div>
                      <div>Lượt mở: <strong>{{ campaign.totalOpened || 0 }}</strong></div>
                      <div>Còn lại: <strong>{{ campaign.remainingRewards || 0 }}</strong></div>
                    </div>
                  </td>
                  <td>
                    <div class="small">
                      {{ formatDateTime(campaign.createdAt) }}
                    </div>
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
              @goToPage="handleGoToPage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit Campaign Modal -->
  <div class="modal fade" id="campaignModal" tabindex="-1" aria-labelledby="campaignModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="campaignModalLabel">
            <i class="bi bi-gift me-2"></i>
            {{ editingCampaign ? 'Chỉnh sửa chiến dịch' : 'Thêm chiến dịch mới' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCampaign">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="campaignName" class="form-label">Tên chiến dịch *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="campaignName"
                    v-model="campaignForm.name" 
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="campaignStatus" class="form-label">Trạng thái</label>
                  <select class="form-select" id="campaignStatus" v-model="campaignForm.status">
                    <option :value="1">Hoạt động</option>
                    <option :value="0">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="startDate" class="form-label">Ngày bắt đầu *</label>
                  <input 
                    type="datetime-local" 
                    class="form-control" 
                    id="startDate"
                    v-model="campaignForm.startDate" 
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="endDate" class="form-label">Ngày kết thúc *</label>
                  <input 
                    type="datetime-local" 
                    class="form-control" 
                    id="endDate"
                    v-model="campaignForm.endDate" 
                    required
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="configFreeLimit" class="form-label">Giới hạn lượt miễn phí *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="configFreeLimit"
                    v-model="campaignForm.configFreeLimit" 
                    min="0"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="configPointCost" class="form-label">Chi phí điểm mỗi lượt *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="configPointCost"
                    v-model="campaignForm.configPointCost" 
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="campaignDescription" class="form-label">Mô tả</label>
              <textarea 
                class="form-control" 
                id="campaignDescription"
                v-model="campaignForm.description" 
                rows="3"
              ></textarea>
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="bi bi-check-circle me-1"></i>
                {{ editingCampaign ? 'Cập nhật' : 'Thêm mới' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Modal } from 'bootstrap';
import { showToast } from '@/utils/swalHelper';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import { useRouter } from 'vue-router';
import ToggleStatus from '@/components/common/ToggleStatus.vue';
import Pagination from '@/components/common/Pagination.vue';
import AddButton from '@/components/common/AddButton.vue';
import EditButton from '@/components/common/EditButton.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  updateCampaignStatus,
  deleteCampaign as deleteCampaignApi
} from '@/services/admin/campaign';

const router = useRouter();

// Data
const campaigns = ref([]);
const loading = ref(false);
const showFilter = ref(true);

// Form data
const campaignForm = ref({
  name: '',
  startDate: '',
  endDate: '',
  configFreeLimit: 3,
  configPointCost: 100,
  description: '',
  status: 1
});

const editingCampaign = ref(null);

// Filter data
const searchName = ref('');
const selectedStatus = ref('');

// Pagination data
const currentPage = ref(0);
const totalPages = ref(0);
const totalElements = ref(0);
const pageSize = ref(10);
const isLastPage = ref(true);
const itemsPerPageOptions = ref([5, 10, 15, 20]);

// Methods
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString('vi-VN');
};

const closeModalSafely = (modalId) => {
  const modal = Modal.getInstance(document.getElementById(modalId));
  if (modal) {
    modal.hide();
  }
  
  // Clean up any remaining backdrop and body styles
  setTimeout(() => {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }, 300);
};

const loadCampaigns = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    };
    
    if (searchName.value.trim()) {
      params.name = searchName.value.trim();
    }
    
    if (selectedStatus.value !== '') {
      params.status = parseInt(selectedStatus.value);
    }

    const response = await getCampaigns(params);
    campaigns.value = response.content || [];
    totalPages.value = response.totalPages || 0;
    totalElements.value = response.totalElements || 0;
    isLastPage.value = response.last || true;
  } catch (error) {
    showToast('Lỗi khi tải danh sách chiến dịch: ' + error.message, 'error');
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = debounce(() => {
  currentPage.value = 0;
  loadCampaigns();
}, 500);

const applyFilters = () => {
  currentPage.value = 0;
  loadCampaigns();
};

const resetFilters = () => {
  searchName.value = '';
  selectedStatus.value = '';
  currentPage.value = 0;
  loadCampaigns();
};

const showAddModal = () => {
  editingCampaign.value = null;
  campaignForm.value = {
    name: '',
    startDate: '',
    endDate: '',
    configFreeLimit: 3,
    configPointCost: 100,
    description: '',
    status: 1
  };
  const modal = new Modal(document.getElementById('campaignModal'));
  modal.show();
};

const showEditModal = (campaign) => {
  editingCampaign.value = campaign;
  campaignForm.value = {
    id: campaign.id,
    name: campaign.name,
    startDate: new Date(campaign.startDate).toISOString().slice(0, 16),
    endDate: new Date(campaign.endDate).toISOString().slice(0, 16),
    configFreeLimit: campaign.configFreeLimit,
    configPointCost: campaign.configPointCost,
    description: campaign.description,
    status: campaign.status
  };
  const modal = new Modal(document.getElementById('campaignModal'));
  modal.show();
};


const goToRewardPage = (id) => {
  const targetPath = `/admin/campaigns/${id}/rewards`;
  if (router.currentRoute.value.path === targetPath) {
    // Nếu đã ở đúng route, force reload bằng cách push lại với query
    router.replace({ path: targetPath, query: { t: Date.now() } });
  } else {
    router.push(targetPath);
  }
};

const saveCampaign = async () => {
  loading.value = true;
  try {
    const formData = {
      ...campaignForm.value,
      startDate: new Date(campaignForm.value.startDate).getTime(),
      endDate: new Date(campaignForm.value.endDate).getTime(),
      createdBy: 1 // TODO: Get from auth
    };

    if (editingCampaign.value) {
      await updateCampaign(formData);
      showToast('Cập nhật chiến dịch thành công!', 'success');
    } else {
      await createCampaign(formData);
      showToast('Thêm chiến dịch thành công!', 'success');
    }

    // Properly close modal and remove backdrop
    closeModalSafely('campaignModal');
    
    loadCampaigns();
  } catch (error) {
    showToast('Lỗi khi lưu chiến dịch: ' + error.message, 'error');
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (campaign, status) => {
  try {
    const response = await updateCampaignStatus(campaign.id);
    campaign.status = status; // Update the local state
    showToast(response.message || 'Cập nhật trạng thái thành công!', 'success');
  } catch (error) {
    campaign.status = campaign.status === 1 ? 0 : 1; // Revert
    showToast('Lỗi khi cập nhật trạng thái: ' + error.message, 'error');
  }
};

const deleteCampaign = async (campaign) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa?',
    text: `Bạn có chắc chắn muốn xóa chiến dịch "${campaign.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  });

  if (result.isConfirmed) {
    try {
      await deleteCampaignApi(campaign.id);
      showToast('Xóa chiến dịch thành công!', 'success');
      loadCampaigns();
    } catch (error) {
      showToast('Lỗi khi xóa chiến dịch: ' + error.message, 'error');
    }
  }
};

// Pagination methods
const handlePrev = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    loadCampaigns();
  }
};

const handleNext = () => {
  if (!isLastPage.value) {
    currentPage.value++;
    loadCampaigns();
  }
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 0;
  loadCampaigns();
};

const handleGoToPage = (page) => {
  currentPage.value = page;
  loadCampaigns();
};

onMounted(() => {
  loadCampaigns();
  
  // Add event listener for modal close events
  const campaignModal = document.getElementById('campaignModal');
  if (campaignModal) {
    campaignModal.addEventListener('hidden.bs.modal', () => {
      // Clean up any remaining backdrop and body styles
      setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
      }, 100);
    });
  }
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
