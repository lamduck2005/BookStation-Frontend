<template>
  <div class="user-statistics-cards">
    <!-- Loading State -->
    <div v-if="loading" class="row g-3">
      <div v-for="i in 6" :key="i" class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
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
      <!-- Total Users Card -->
      <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div class="card stats-card users-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper users-icon">
                <i class="bi bi-people"></i>
              </div>
              <div class="text-end">
                <div class="stat-value">{{ formatNumber(data?.totalUsers) }}</div>
                <div class="stat-label">Tổng người dùng</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-muted">
                Hoạt động: <strong>{{ formatNumber(data?.activeUsers) }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- New Users This Month Card -->
      <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div class="card stats-card new-users-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper new-users-icon">
                <i class="bi bi-person-plus"></i>
              </div>
              <div class="text-end">
                <div class="stat-value">{{ formatNumber(data?.newUsersThisMonth) }}</div>
                <div class="stat-label">Người dùng mới tháng</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-success">
                Tuần này: <strong>{{ formatNumber(data?.newUsersThisWeek) }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Users Card -->
      <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div class="card stats-card active-users-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper active-users-icon">
                <i class="bi bi-person-check"></i>
              </div>
              <div class="text-end">
                <div class="stat-value">{{ formatNumber(data?.activeUsers) }}</div>
                <div class="stat-label">Người dùng hoạt động</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-info">
                Tỷ lệ: <strong>{{ formatPercentage(data?.activityRate) }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Purchasing Users Card -->
      <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div class="card stats-card purchasing-users-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper purchasing-users-icon">
                <i class="bi bi-cart-check"></i>
              </div>
              <div class="text-end">
                <div class="stat-value">{{ formatNumber(data?.purchasingUsers) }}</div>
                <div class="stat-label">Đã mua hàng</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-success">
                Tỷ lệ: <strong>{{ formatPercentage(data?.purchaseRate) }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Registered Only Users Card -->
      <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div class="card stats-card registered-only-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper registered-only-icon">
                <i class="bi bi-person-x"></i>
              </div>
              <div class="text-end">
                <div class="stat-value">{{ formatNumber(data?.registeredOnlyUsers) }}</div>
                <div class="stat-label">Chỉ đăng ký</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-warning">
                Chưa mua hàng
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Top User by Points Card -->
      <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div class="card stats-card top-user-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper top-user-icon">
                <i class="bi bi-trophy"></i>
              </div>
              <div class="text-end">
                <div class="stat-value small-text">{{ getTopUserName() }}</div>
                <div class="stat-label">Top điểm cao nhất</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-warning">
                <strong>{{ formatNumber(getTopUserPoints()) }} điểm</strong>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserStatistics, formatNumber, formatPercentage } from '@/services/admin/moduleStatistics';
import Swal from 'sweetalert2';

const loading = ref(true);
const data = ref(null);

const fetchUserStatistics = async () => {
  loading.value = true;
  try {
    const response = await getUserStatistics();
    if (response.status === 200) {
      data.value = response.data;
    } else {
      throw new Error('Failed to fetch user statistics');
    }
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    
    // Fallback data để tránh lỗi hiển thị
    data.value = {
      totalUsers: 1250,
      newUsersThisMonth: 85,
      newUsersThisWeek: 23,
      activeUsers: 1100,
      activityRate: 88.0,
      usersByRank: [
        { rankName: "Bronze", userCount: 800 },
        { rankName: "Silver", userCount: 300 },
        { rankName: "Gold", userCount: 150 }
      ],
      topUsersByPoint: [
        { 
          fullName: "Nguyễn Văn A", 
          email: "nguyenvana@example.com", 
          totalPoint: 15000, 
          rankName: "Gold" 
        }
      ],
      purchasingUsers: 950,
      registeredOnlyUsers: 300,
      purchaseRate: 76.0
    };
    
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải dữ liệu thống kê người dùng - Hiển thị dữ liệu mẫu',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    });
  } finally {
    loading.value = false;
  }
};

const getTopUserName = () => {
  if (data.value?.topUsersByPoint && data.value.topUsersByPoint.length > 0) {
    return data.value.topUsersByPoint[0].fullName || 'N/A';
  }
  return 'N/A';
};

const getTopUserPoints = () => {
  if (data.value?.topUsersByPoint && data.value.topUsersByPoint.length > 0) {
    return data.value.topUsersByPoint[0].totalPoint || 0;
  }
  return 0;
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

const refreshData = async () => {
  await fetchUserStatistics();
  Swal.fire({
    title: 'Thành công!',
    text: 'Đã làm mới dữ liệu thống kê người dùng',
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
  fetchUserStatistics();
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

.users-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.new-users-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.active-users-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.purchasing-users-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.registered-only-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.top-user-icon { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333 !important; }

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

.insight-item {
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 8px;
}

.insight-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.insight-label {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
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

/* Rank Badge */
.rank-badge {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
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
}
</style>
