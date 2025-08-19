<template>
  <div class="rank-statistics-cards">
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

    <!-- Statistics Cards -->
    <div v-else class="row g-3">
      <!-- Total Ranks Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card ranks-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper ranks-icon">
                <i class="bi bi-award"></i>
              </div>
              <div class="text-end">
                <div class="stat-value">{{ getTotalRanks() }}</div>
                <div class="stat-label">Tổng số xếp hạng</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-muted">
                Đang hoạt động
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Most Popular Rank Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card popular-rank-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper popular-rank-icon">
                <i class="bi bi-trophy"></i>
              </div>
              <div class="text-end">
                <div class="stat-value small-text">{{ getMostPopularRank().rankName || 'N/A' }}</div>
                <div class="stat-label">Xếp hạng phổ biến</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-success">
                <strong>{{ formatNumber(getMostPopularRank().userCount) }} người dùng</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Highest Average Points Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card highest-points-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper highest-points-icon">
                <i class="bi bi-gem"></i>
              </div>
              <div class="text-end">
                <div class="stat-value small-text">{{ getHighestPointsRank().rankName || 'N/A' }}</div>
                <div class="stat-label">Điểm trung bình cao nhất</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-warning">
                <strong>{{ formatNumber(getHighestPointsRank().averagePoints) }} điểm</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Fastest Growing Rank Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card growing-rank-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper growing-rank-icon">
                <i class="bi bi-graph-up-arrow"></i>
              </div>
              <div class="text-end">
                <div class="stat-value small-text">{{ getFastestGrowingRank().rankName || 'N/A' }}</div>
                <div class="stat-label">Tăng trưởng nhanh nhất</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-success">
                <strong>+{{ formatPercentage(getFastestGrowingRank().growthRate) }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rank User Counts Row -->
    <div v-if="!loading && data?.rankUserCounts && data.rankUserCounts.length > 0" class="row g-3 mt-2">
      <div class="col-12">
        <div class="card insights-card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-bar-chart me-2 text-primary"></i>
              Số lượng người dùng theo xếp hạng
            </h6>
            <div class="row g-3">
              <div 
                v-for="rank in data.rankUserCounts" 
                :key="rank.rankName"
                class="col-lg-3 col-md-4 col-sm-6"
              >
                <div class="rank-item-card">
                  <div class="d-flex align-items-center">
                    <div class="rank-icon-large me-3" :class="getRankIconClass(rank.rankName)">
                      <i :class="getRankIcon(rank.rankName)"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="rank-title">{{ rank.rankName }}</div>
                      <div class="rank-stats">
                        <div class="stat-row">
                          <span class="stat-label">Người dùng:</span>
                          <span class="stat-value-inline">{{ formatNumber(rank.userCount) }}</span>
                        </div>
                        <div class="stat-row">
                          <span class="stat-label">Chi tiêu tối thiểu:</span>
                          <span class="stat-value-inline">{{ formatCurrency(rank.minSpent) }}</span>
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

    <!-- Average Points by Rank Row -->
    <div v-if="!loading && data?.averagePointsByRank && data.averagePointsByRank.length > 0" class="row g-3 mt-2">
      <div class="col-lg-8">
        <div class="card insights-card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-graph-up me-2 text-success"></i>
              Điểm trung bình theo xếp hạng
            </h6>
            <div class="row g-2">
              <div 
                v-for="rank in data.averagePointsByRank" 
                :key="rank.rankName"
                class="col-md-6"
              >
                <div class="d-flex align-items-center p-3 border rounded bg-light">
                  <div class="rank-icon me-3" :class="getRankIconClass(rank.rankName)">
                    <i :class="getRankIcon(rank.rankName)"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-bold">{{ rank.rankName }}</div>
                    <small class="text-muted">{{ formatCurrency(rank.minSpent) }} - Chi tiêu tối thiểu</small>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold text-primary">{{ formatNumber(rank.averagePoints) }}</div>
                    <small class="text-muted">điểm TB</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card actions-card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-lightning-charge me-2 text-warning"></i>
              Hành động nhanh
            </h6>
            <div class="d-grid gap-2">
                  <button class="btn btn-outline-warning btn-sm" @click="refreshData">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Làm mới dữ liệu
              </button>
              <button class="btn btn-outline-info btn-sm" @click="exportData">
                <i class="bi bi-download me-1"></i>
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly Growth Rates Row -->
    <div v-if="!loading && data?.monthlyGrowthRates && data.monthlyGrowthRates.length > 0" class="row g-3 mt-2">
      <div class="col-12">
        <div class="card insights-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="card-title mb-0">
                <i class="bi bi-trending-up me-2 text-info"></i>
                Tỷ lệ tăng trưởng hàng tháng theo xếp hạng
              </h6>
              <button 
                class="btn btn-sm btn-outline-secondary" 
                type="button" 
                @click="showGrowthChart = !showGrowthChart"
                :aria-expanded="showGrowthChart"
              >
                <i :class="showGrowthChart ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
              </button>
            </div>
            <div v-show="showGrowthChart" class="row g-3">
              <div 
                v-for="growth in data.monthlyGrowthRates" 
                :key="growth.rankName"
                class="col-lg-4 col-md-6"
              >
                <div class="growth-card">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="rank-info">
                      <div class="rank-name">{{ growth.rankName }}</div>
                      <div class="growth-rate" :class="getGrowthRateClass(growth.growthRate)">
                        <i :class="getGrowthIcon(growth.growthRate)"></i>
                        {{ formatPercentage(growth.growthRate) }}
                      </div>
                    </div>
                    <div class="text-end">
                      <div class="current-users">{{ formatNumber(growth.currentMonthUsers) }}</div>
                      <small class="text-muted">hiện tại</small>
                    </div>
                  </div>
                  <div class="growth-details">
                    <small class="text-muted">
                      Tháng trước: {{ formatNumber(growth.previousMonthUsers) }}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getRankStatistics, formatNumber, formatPercentage, formatCurrency } from '@/services/admin/moduleStatistics';
import Swal from 'sweetalert2';

const loading = ref(true);
const data = ref(null);
const showGrowthChart = ref(false);

const fetchRankStatistics = async () => {
  loading.value = true;
  try {
    const response = await getRankStatistics();
    if (response.status === 200) {
      data.value = response.data;
    } else {
      throw new Error('Failed to fetch rank statistics');
    }
  } catch (error) {
    console.error('Error fetching rank statistics:', error);
    
    // Fallback data để tránh lỗi hiển thị
    data.value = {
      rankUserCounts: [
        { rankName: "Bronze", userCount: 800, minSpent: 0.00 },
        { rankName: "Silver", userCount: 300, minSpent: 1000000.00 },
        { rankName: "Gold", userCount: 150, minSpent: 5000000.00 }
      ],
      averagePointsByRank: [
        { rankName: "Bronze", averagePoints: 2500.50, minSpent: 0.00 },
        { rankName: "Silver", averagePoints: 8500.75, minSpent: 1000000.00 },
        { rankName: "Gold", averagePoints: 15000.25, minSpent: 5000000.00 }
      ],
      monthlyGrowthRates: [
        { 
          rankName: "Silver", 
          currentMonthUsers: 320, 
          previousMonthUsers: 300, 
          growthRate: 6.67 
        },
        { 
          rankName: "Gold", 
          currentMonthUsers: 155, 
          previousMonthUsers: 150, 
          growthRate: 3.33 
        }
      ]
    };
    
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải dữ liệu thống kê xếp hạng - Hiển thị dữ liệu mẫu',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    });
  } finally {
    loading.value = false;
  }
};

const getTotalRanks = () => {
  if (data.value?.rankUserCounts) {
    return data.value.rankUserCounts.length;
  }
  return 0;
};

const getMostPopularRank = () => {
  if (data.value?.rankUserCounts && data.value.rankUserCounts.length > 0) {
    return data.value.rankUserCounts.reduce((prev, current) => 
      (prev.userCount > current.userCount) ? prev : current
    );
  }
  return { rankName: '', userCount: 0 };
};

const getHighestPointsRank = () => {
  if (data.value?.averagePointsByRank && data.value.averagePointsByRank.length > 0) {
    return data.value.averagePointsByRank.reduce((prev, current) => 
      (prev.averagePoints > current.averagePoints) ? prev : current
    );
  }
  return { rankName: '', averagePoints: 0 };
};

const getFastestGrowingRank = () => {
  if (data.value?.monthlyGrowthRates && data.value.monthlyGrowthRates.length > 0) {
    return data.value.monthlyGrowthRates.reduce((prev, current) => 
      (prev.growthRate > current.growthRate) ? prev : current
    );
  }
  return { rankName: '', growthRate: 0 };
};

const getRankIcon = (rankName) => {
  const icons = {
    'Bronze': 'bi bi-award-fill',
    'Silver': 'bi bi-gem',
    'Gold': 'bi bi-trophy-fill',
    'Diamond': 'bi bi-diamond-fill'
  };
  return icons[rankName] || 'bi bi-award';
};

const getRankIconClass = (rankName) => {
  const classes = {
    'Bronze': 'text-warning',
    'Silver': 'text-secondary',
    'Gold': 'text-warning',
    'Diamond': 'text-info'
  };
  return classes[rankName] || 'text-muted';
};

const getGrowthRateClass = (growthRate) => {
  if (growthRate > 0) return 'text-success';
  if (growthRate < 0) return 'text-danger';
  return 'text-muted';
};

const getGrowthIcon = (growthRate) => {
  if (growthRate > 0) return 'bi bi-arrow-up';
  if (growthRate < 0) return 'bi bi-arrow-down';
  return 'bi bi-dash';
};

const refreshData = async () => {
  await fetchRankStatistics();
  Swal.fire({
    title: 'Thành công!',
    text: 'Đã làm mới dữ liệu thống kê xếp hạng',
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
  fetchRankStatistics();
});
</script>

<style scoped>
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

.ranks-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.popular-rank-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.highest-points-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.growing-rank-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

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

/* Rank Item Card */
.rank-item-card {
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.rank-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.rank-icon-large {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.rank-title {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.rank-stats {
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

/* Growth Card */
.growth-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.growth-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.rank-name {
  font-weight: 700;
  color: #2d3748;
}

.growth-rate {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.current-users {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.growth-details {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Actions Card */
.actions-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #8f97bc 0%, #432e57 100%);
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

.rank-icon {
  font-size: 1.2rem;
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
  
  .rank-item-card {
    padding: 0.75rem;
  }
}
</style>
