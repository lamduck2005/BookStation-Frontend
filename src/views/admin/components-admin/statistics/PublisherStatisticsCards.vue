<template>
  <div class="publisher-statistics-cards">
    <!-- Loading State -->
    <div v-if="loading" class="row g-3">
      <div v-for="i in 4" :key="i" class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card loading-card">
          <div class="card-body">
            <div class="placeholder-glow">
              <div class="placeholder col-6 mb-2"></div>
              <div class="placeholder col-8 mb-3"></div>
              <div class="placeholder col-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Book Statistics by Publisher Row -->
    <div v-if="!loading && data?.bookStatistics && data.bookStatistics.length > 0" class="row g-3 mt-2">
      <div class="col-12">
        <div class="card insights-card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-bar-chart me-2 text-primary"></i>
              Số đầu sách theo nhà xuất bản
            </h6>
            <div class="row g-3">
              <div 
                v-for="publisher in data.bookStatistics.slice(0, 8)" 
                :key="publisher.publisherName"
                class="col-lg-3 col-md-4 col-sm-6"
              >
                <div class="publisher-item-card">
                  <div class="d-flex align-items-center">
                    <div class="publisher-icon me-3">
                      <i class="bi bi-building-fill"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="publisher-name">{{ truncateText(publisher.publisherName, 15) }}</div>
                      <div class="publisher-stats">
                        <div class="stat-row">
                          <span class="stat-label">Đầu sách:</span>
                          <span class="stat-value-inline">{{ formatNumber(publisher.totalBooks) }}</span>
                        </div>
                        <div v-if="publisher.newBooksThisMonth" class="stat-row">
                          <span class="stat-label">Mới tháng này:</span>
                          <span class="stat-value-inline text-success">{{ formatNumber(publisher.newBooksThisMonth) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Publishers by Revenue Row -->
    <div v-if="!loading && data?.topPublishersByRevenue && data.topPublishersByRevenue.length > 0" class="row g-3 mt-2">
      <div class="col-lg-8">
        <div class="card insights-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="card-title mb-0">
                <i class="bi bi-trophy me-2 text-warning"></i>
                Top nhà xuất bản theo doanh thu từ sách
              </h6>
              <button 
                class="btn btn-sm btn-outline-secondary" 
                type="button" 
                @click="showRevenueChart = !showRevenueChart"
                :aria-expanded="showRevenueChart"
              >
                <i :class="showRevenueChart ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
              </button>
            </div>
            <div v-show="showRevenueChart" class="row g-2">
              <div 
                v-for="(publisher, index) in data.topPublishersByRevenue.slice(0, 5)" 
                :key="publisher.publisherName"
                class="col-md-12"
              >
                <div class="d-flex align-items-center p-3 border rounded top-publisher-item">
                  <div class="rank-badge me-3" :class="getRankBadgeClass(index)">{{ index + 1 }}</div>
                  <div class="flex-grow-1">
                    <div class="fw-bold">{{ publisher.publisherName }}</div>
                    <small class="text-muted">Đã bán: {{ formatNumber(publisher.totalQuantitySold) }} cuốn</small>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold text-success">{{ formatCurrency(publisher.totalRevenue) }}</div>
                    <small class="text-muted">doanh thu</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card insights-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="card-title mb-0">
                <i class="bi bi-graph-up-arrow me-2 text-success"></i>
                Top theo số lượng bán
              </h6>
              <button 
                class="btn btn-sm btn-outline-secondary" 
                type="button" 
                @click="showQuantityChart = !showQuantityChart"
                :aria-expanded="showQuantityChart"
              >
                <i :class="showQuantityChart ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
              </button>
            </div>
            <div v-show="showQuantityChart" class="quantity-rankings">
              <div 
                v-for="(publisher, index) in data.topPublishersByQuantity?.slice(0, 3) || []" 
                :key="publisher.publisherName"
                class="quantity-item"
              >
                <div class="d-flex align-items-center">
                  <div class="quantity-rank">{{ index + 1 }}</div>
                  <div class="flex-grow-1">
                    <div class="publisher-name-small">{{ truncateText(publisher.publisherName, 12) }}</div>
                    <div class="quantity-value">{{ formatNumber(publisher.totalQuantitySold) }} cuốn</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Row -->
    <!-- <div v-if="!loading" class="row g-3 mt-2">
      <div class="col-12">
        <div class="card actions-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title mb-1">
                  <i class="bi bi-lightning-charge me-2 text-warning"></i>
                  Hành động nhanh
                </h6>
                <small class="text-light">Quản lý thông tin nhà xuất bản</small>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-light btn-sm" @click="refreshData">
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  Làm mới
                </button>
                <button class="btn btn-outline-light btn-sm" @click="exportData">
                  <i class="bi bi-download me-1"></i>
                  Xuất báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPublisherStatistics, formatNumber, formatCurrency } from '@/services/admin/moduleStatistics';
import Swal from 'sweetalert2';

const loading = ref(true);
const data = ref(null);
const showRevenueChart = ref(false);
const showQuantityChart = ref(false);

const fetchPublisherStatistics = async () => {
  loading.value = true;
  try {
    const response = await getPublisherStatistics();
    if (response.status === 200) {
      data.value = response.data;
    } else {
      throw new Error('Failed to fetch publisher statistics');
    }
  } catch (error) {
    console.error('Error fetching publisher statistics:', error);
    
    // Fallback data để tránh lỗi hiển thị
    data.value = {
      bookStatistics: [
        { publisherName: "NXB Kim Đồng", totalBooks: 450, newBooksThisMonth: 12 },
        { publisherName: "NXB Trẻ", totalBooks: 380, newBooksThisMonth: 8 },
        { publisherName: "NXB Giáo dục", totalBooks: 520, newBooksThisMonth: 15 }
      ],
      revenueStatistics: [
        { publisherName: "NXB Kim Đồng", totalRevenue: 25000000.00, totalQuantitySold: 1250 },
        { publisherName: "NXB Trẻ", totalRevenue: 22000000.00, totalQuantitySold: 1100 }
      ],
      topPublishersByRevenue: [
        { publisherName: "NXB Kim Đồng", totalRevenue: 25000000.00, totalQuantitySold: 1250 },
        { publisherName: "NXB Trẻ", totalRevenue: 22000000.00, totalQuantitySold: 1100 }
      ],
      topPublishersByQuantity: [
        { publisherName: "NXB Trẻ", totalQuantitySold: 1500, totalRevenue: 22000000.00 },
        { publisherName: "NXB Kim Đồng", totalQuantitySold: 1250, totalRevenue: 25000000.00 }
      ]
    };
    
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải dữ liệu thống kê nhà xuất bản - Hiển thị dữ liệu mẫu',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    });
  } finally {
    loading.value = false;
  }
};

const getTotalPublishers = () => {
  if (data.value?.bookStatistics) {
    return data.value.bookStatistics.length;
  }
  return 0;
};

const getTotalBooks = () => {
  if (data.value?.bookStatistics) {
    return data.value.bookStatistics.reduce((total, publisher) => total + (publisher.totalBooks || 0), 0);
  }
  return 0;
};

const getNewBooksThisMonth = () => {
  if (data.value?.bookStatistics) {
    return data.value.bookStatistics.reduce((total, publisher) => total + (publisher.newBooksThisMonth || 0), 0);
  }
  return 0;
};

const getTotalRevenue = () => {
  if (data.value?.revenueStatistics) {
    return data.value.revenueStatistics.reduce((total, publisher) => total + (publisher.totalRevenue || 0), 0);
  }
  return 0;
};

const getTotalQuantitySold = () => {
  if (data.value?.revenueStatistics) {
    return data.value.revenueStatistics.reduce((total, publisher) => total + (publisher.totalQuantitySold || 0), 0);
  }
  return 0;
};

const getRankBadgeClass = (index) => {
  if (index === 0) return 'gold-badge';
  if (index === 1) return 'silver-badge';
  if (index === 2) return 'bronze-badge';
  return 'default-badge';
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const refreshData = async () => {
  await fetchPublisherStatistics();
  Swal.fire({
    title: 'Thành công!',
    text: 'Đã làm mới dữ liệu thống kê nhà xuất bản',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  });
};

const exportData = () => {
  Swal.fire({
    title: 'Xuất báo cáo',
    text: 'Tính năng xuất báo cáo sẽ được triển khai sớm',
    icon: 'info',
    timer: 2000,
    showConfirmButton: false
  });
};

onMounted(() => {
  fetchPublisherStatistics();
});
</script>

<style scoped>
@import '@/assets/css/gradient-stats.css';

/* Statistics Cards Styling */
.stats-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.stats-card .card-body {
  padding: 1.5rem;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.publishers-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.books-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.revenue-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.quantity-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  color: #2d3748;
}

.stat-value.small-text {
  font-size: 1rem;
  font-weight: 600;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
  margin-top: 0.25rem;
}

.stat-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* Insights Card */
.insights-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  background: white;
}

/* Publisher Item Card */
.publisher-item-card {
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.publisher-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.publisher-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.publisher-name {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.publisher-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.stat-label {
  color: #718096;
}

.stat-value-inline {
  font-weight: 600;
  color: #2d3748;
}

/* Top Publisher Item */
.top-publisher-item {
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.top-publisher-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rank-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.gold-badge {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #fff;
}

.silver-badge {
  background: linear-gradient(135deg, #C0C0C0 0%, #808080 100%);
  color: #fff;
}

.bronze-badge {
  background: linear-gradient(135deg, #CD7F32 0%, #A0522D 100%);
  color: #fff;
}

.default-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

/* Quantity Rankings */
.quantity-rankings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quantity-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.quantity-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quantity-rank {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  margin-right: 0.75rem;
}

.publisher-name-small {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
}

.quantity-value {
  font-weight: 700;
  color: #4facfe;
  font-size: 0.875rem;
}

/* Actions Card */
.actions-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.actions-card .card-title {
  color: white;
}

/* Loading Cards */
.loading-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.placeholder {
  background-color: #dee2e6;
  border-radius: 4px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats-card .card-body {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .icon-wrapper {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  
  .publisher-item-card {
    padding: 0.75rem;
  }
  
  .quantity-rankings {
    gap: 0.75rem;
  }
}
</style>
