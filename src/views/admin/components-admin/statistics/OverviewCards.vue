<template>
  <div class="overview-cards">
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
      <!-- Total Orders Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card orders-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper orders-icon">
                <i class="bi bi-cart-check"></i>
              </div>
              <div class="text-end">
                <div class="stat-value gradient-text-orders">{{ data?.totalOrdersToday || 0 }}</div>
                <div class="stat-label">Đơn hàng hôm nay</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-muted">
                Tổng tháng này: <strong>{{ data?.totalOrdersThisMonth || 0 }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Net Revenue Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card revenue-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper revenue-icon">
                <i class="bi bi-currency-dollar"></i>
              </div>
              <div class="text-end">
                <div class="stat-value gradient-text-revenue">{{ formatCurrency(data?.netRevenueToday) }}</div>
                <div class="stat-label">Doanh thu thuần hôm nay</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-success">
                Tổng tháng này: <strong>{{ formatCurrency(data?.netRevenueThisMonth) }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Refunded Orders Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card refunded-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper refunded-icon">
                <i class="bi bi-arrow-return-left"></i>
              </div>
              <div class="text-end">
                <div class="stat-value gradient-text-refunded">{{ data?.refundedOrdersToday || 0 }}</div>
                <div class="stat-label">Đơn hoàn trả hôm nay</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-warning">
                Tổng tháng này: <strong>{{ data?.refundedOrdersThisMonth || 0 }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Canceled Orders Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card canceled-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper canceled-icon">
                <i class="bi bi-x-circle"></i>
              </div>
              <div class="text-end">
                <div class="stat-value gradient-text-canceled">{{ data?.canceledOrdersToday || 0 }}</div>
                <div class="stat-label">Đơn hủy hôm nay</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-danger">
                Tổng tháng này: <strong>{{ data?.canceledOrdersThisMonth || 0 }}</strong>
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
import { getOverviewStatistics, formatCurrency, formatPercentage } from '@/services/admin/statistics';
import Swal from 'sweetalert2';

const loading = ref(true);
const data = ref(null);

const fetchOverviewData = async () => {
  loading.value = true;
  try {
    const response = await getOverviewStatistics();
    if (response.status === 200) {
      data.value = response.data;
    } else {
      throw new Error('Failed to fetch overview statistics');
    }
  } catch (error) {
    console.error('Error fetching overview statistics:', error);
    
    // ✅ FALLBACK DATA để tránh lỗi hiển thị
    data.value = {
      totalOrdersToday: Math.floor(Math.random() * 50) + 10,
      totalOrdersThisMonth: Math.floor(Math.random() * 500) + 100,
      netRevenueToday: Math.floor(Math.random() * 5000000) + 1000000,
      netRevenueThisMonth: Math.floor(Math.random() * 50000000) + 10000000,
      refundedOrdersToday: Math.floor(Math.random() * 5) + 1,
      refundedOrdersThisMonth: Math.floor(Math.random() * 20) + 5,
      canceledOrdersToday: Math.floor(Math.random() * 3),
      canceledOrdersThisMonth: Math.floor(Math.random() * 15) + 2
    };
    
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải dữ liệu thống kê tổng quan - Hiển thị dữ liệu mẫu',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    });
  } finally {
    loading.value = false;
  }
};

const refreshData = async () => {
  await fetchOverviewData();
  Swal.fire({
    title: 'Thành công!',
    text: 'Đã làm mới dữ liệu thống kê',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  });
};

const exportData = () => {
  // TODO: Implement export functionality
  Swal.fire({
    title: 'Thông báo',
    text: 'Tính năng xuất báo cáo đang được phát triển',
    icon: 'info',
    timer: 2000,
    showConfirmButton: false
  });
};

// Helper methods for summary section
const calculateSuccessRate = () => {
  if (!data.value) return '0';
  const total = data.value.totalOrdersToday || 0;
  const failed = (data.value.refundedOrdersToday || 0) + (data.value.canceledOrdersToday || 0);
  const successful = total - failed;
  const rate = total > 0 ? (successful / total) * 100 : 0;
  return Math.round(rate * 10) / 10; // Round to 1 decimal place
};

const getSuccessRateClass = () => {
  const rate = calculateSuccessRate();
  if (rate >= 90) return 'text-success';
  if (rate >= 75) return 'text-warning';
  return 'text-danger';
};

onMounted(() => {
  fetchOverviewData();
});
</script>

<style scoped>
.overview-cards {
  margin-bottom: 2rem;
}

.stats-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}


.card-body {
  padding: 1.5rem;
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.orders-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.revenue-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.refunded-icon {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.canceled-icon {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.stat-footer {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.insights-card,
.actions-card,
.summary-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.summary-card .card-body {
  padding: 1.25rem 1.5rem;
}

.summary-stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.summary-item {
  font-size: 0.9rem;
}

.summary-divider {
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0.25rem;
}

.success-rate {
  text-align: right;
}

.rate-label {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-right: 0.5rem;
}

.rate-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.insight-item {
  text-align: center;
  padding: 0.5rem;
}

.insight-value {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.insight-label {
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.loading-card {
  background: #f8f9fa;
}

.placeholder {
  background-color: #dee2e6;
  border-radius: 0.375rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stat-value {
    font-size: 1.5rem;
  }
  
  .icon-wrapper {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  
  .card-body {
    padding: 1rem;
  }

  .summary-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .summary-divider {
    display: none;
  }

  .success-rate {
    text-align: left;
    margin-top: 0.5rem;
  }
}

/* Animation */
.stats-card {
  animation: fadeInUp 0.6s ease-out;
}

.stats-card:nth-child(1) { animation-delay: 0.1s; }
.stats-card:nth-child(2) { animation-delay: 0.2s; }
.stats-card:nth-child(3) { animation-delay: 0.3s; }
.stats-card:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Gradient text for stat values */
.gradient-text-orders {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-revenue {
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-refunded {
  background: linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-canceled {
  background: linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

</style>
