<template>
  <div class="point-statistics-cards">
    <!-- Loading State -->
    <div v-if="loading" class="row g-3">
      <div v-for="i in 5" :key="i" class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
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

   

    <!-- Top Point Earners Row -->
    <div v-if="!loading && data?.topPointEarners && data.topPointEarners.length > 0" class="row g-3 mt-2">
      <div class="col-lg-8">
        <div class="card insights-card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-trophy me-2 text-warning"></i>
              Top 10 người dùng kiếm điểm nhiều nhất
            </h6>
            <div class="row g-2">
              <div 
                v-for="(user, index) in data.topPointEarners.slice(0, 10)" 
                :key="user.email"
                class="col-md-6"
              >
                <div class="d-flex align-items-center p-2 border rounded top-earner-item">
                  <div class="rank-badge me-3" :class="getRankBadgeClass(index)">{{ index + 1 }}</div>
                  <div class="flex-grow-1">
                    <div class="fw-bold">{{ user.fullName || 'N/A' }}</div>
                    <small class="text-muted">{{ user.email }}</small>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold text-primary">{{ formatNumber(user.totalPointsEarned) }}</div>
                    <small class="badge" :class="getRankBadgeClassByName(user.rankName)">{{ user.rankName }}</small>
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
            <h6 class="card-title mb-3">
              <i class="bi bi-graph-up-arrow me-2 text-success"></i>
              Thống kê điểm tháng này
            </h6>
            <div class="point-insights">
              <div class="insight-row">
                <div class="insight-icon earned">
                  <i class="bi bi-plus-circle"></i>
                </div>
                <div class="insight-content">
                  <div class="insight-label">Điểm kiếm được</div>
                  <div class="insight-value text-success">{{ formatNumber(data?.pointsEarnedThisMonth) }}</div>
                </div>
              </div>
              
              <div class="insight-row">
                <div class="insight-icon spent">
                  <i class="bi bi-dash-circle"></i>
                </div>
                <div class="insight-content">
                  <div class="insight-label">Điểm đã tiêu</div>
                  <div class="insight-value text-warning">{{ formatNumber(data?.pointsSpentThisMonth) }}</div>
                </div>
              </div>
              
              <div class="insight-row">
                <div class="insight-icon balance">
                  <i class="bi bi-calculator"></i>
                </div>
                <div class="insight-content">
                  <div class="insight-label">Tỷ lệ sử dụng</div>
                  <div class="insight-value" :class="getUsageRateClass()">{{ getUsageRate() }}%</div>
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
                <small class="text-light">Quản lý thông tin điểm thưởng</small>
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
import { getPointStatistics, formatNumber, formatPercentage } from '@/services/admin/moduleStatistics';
import Swal from 'sweetalert2';

const loading = ref(true);
const data = ref(null);

const fetchPointStatistics = async () => {
  loading.value = true;
  try {
    const response = await getPointStatistics();
    if (response.status === 200) {
      data.value = response.data;
    } else {
      throw new Error('Failed to fetch point statistics');
    }
  } catch (error) {
    console.error('Error fetching point statistics:', error);
    
    // Fallback data để tránh lỗi hiển thị
    data.value = {
      averagePointsPerUser: 3250.75,
      totalSystemPoints: 4063750,
      pointsEarnedThisMonth: 156000,
      pointsSpentThisMonth: 89000,
      topPointEarners: [
        { 
          fullName: "Trần Thị B", 
          email: "tranthib@example.com", 
          totalPointsEarned: 25000, 
          rankName: "Gold" 
        },
        { 
          fullName: "Nguyễn Văn C", 
          email: "nguyenvanc@example.com", 
          totalPointsEarned: 22000, 
          rankName: "Silver" 
        },
        { 
          fullName: "Lê Thị D", 
          email: "lethid@example.com", 
          totalPointsEarned: 18000, 
          rankName: "Silver" 
        }
      ]
    };
    
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải dữ liệu thống kê điểm - Hiển thị dữ liệu mẫu',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    });
  } finally {
    loading.value = false;
  }
};

const getPointsBalance = () => {
  if (data.value) {
    return (data.value.pointsEarnedThisMonth || 0) - (data.value.pointsSpentThisMonth || 0);
  }
  return 0;
};

const getBalanceClass = () => {
  const balance = getPointsBalance();
  if (balance > 0) return 'text-success';
  if (balance < 0) return 'text-danger';
  return 'text-muted';
};

const getBalanceText = () => {
  const balance = getPointsBalance();
  if (balance > 0) return '+ Tích cực';
  if (balance < 0) return '- Tiêu nhiều';
  return 'Cân bằng';
};

const getUsageRate = () => {
  if (data.value && data.value.pointsEarnedThisMonth > 0) {
    const rate = (data.value.pointsSpentThisMonth / data.value.pointsEarnedThisMonth) * 100;
    return Math.round(rate);
  }
  return 0;
};

const getUsageRateClass = () => {
  const rate = getUsageRate();
  if (rate >= 80) return 'text-danger';
  if (rate >= 50) return 'text-warning';
  return 'text-success';
};

const getRankBadgeClass = (index) => {
  if (index === 0) return 'gold-badge';
  if (index === 1) return 'silver-badge';
  if (index === 2) return 'bronze-badge';
  return 'default-badge';
};

const getRankBadgeClassByName = (rankName) => {
  const classes = {
    'Bronze': 'bg-warning text-dark',
    'Silver': 'bg-secondary text-white',
    'Gold': 'bg-warning text-dark',
    'Diamond': 'bg-info text-white'
  };
  return classes[rankName] || 'bg-secondary text-white';
};

const refreshData = async () => {
  await fetchPointStatistics();
  Swal.fire({
    title: 'Thành công!',
    text: 'Đã làm mới dữ liệu thống kê điểm',
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
  fetchPointStatistics();
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

.avg-points-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.total-points-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.earned-points-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.spent-points-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.balance-points-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  color: #2d3748;
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

/* Top Earner Item */
.top-earner-item {
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.top-earner-item:hover {
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

/* Point Insights */
.point-insights {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.insight-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.insight-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  color: white;
}

.insight-icon.earned { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.insight-icon.spent { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.insight-icon.balance { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.insight-content {
  flex-grow: 1;
}

.insight-label {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.insight-value {
  font-size: 1.125rem;
  font-weight: 700;
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
  
  .point-insights {
    gap: 0.75rem;
  }
  
  .insight-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
}
</style>
