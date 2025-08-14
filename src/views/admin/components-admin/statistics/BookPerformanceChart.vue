<template>
  <div class="performance-chart-container">
    <div class="card chart-card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
          <i class="bi bi-graph-up-arrow me-2 text-primary"></i>
          Biểu đồ thống kê sách bán
        </h5>
        <div class="chart-controls">
          <!-- Period Selector -->
          <div class="btn-group btn-group-sm me-2" role="group">
            <input 
              type="radio" 
              class="btn-check" 
              name="chartPeriod" 
              id="day" 
              autocomplete="off" 
              value="day"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="day">Ngày</label>

            <input 
              type="radio" 
              class="btn-check" 
              name="chartPeriod" 
              id="week" 
              autocomplete="off" 
              value="week"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="week">Tuần</label>

            <input 
              type="radio" 
              class="btn-check" 
              name="chartPeriod" 
              id="month" 
              autocomplete="off" 
              value="month"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="month">Tháng</label>

            <input 
              type="radio" 
              class="btn-check" 
              name="chartPeriod" 
              id="year" 
              autocomplete="off" 
              value="year"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="year">Năm</label>

            <input 
              type="radio" 
              class="btn-check" 
              name="chartPeriod" 
              id="custom" 
              autocomplete="off" 
              value="custom"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="custom">Tùy chỉnh</label>
          </div>
          
          <button 
            class="btn btn-outline-secondary btn-sm"
            @click="fetchChartData"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      <!-- Custom Date Range -->
      <div v-if="selectedPeriod === 'custom'" class="card-body border-bottom">
        <div class="row">
          <div class="col-md-4">
            <label class="form-label">Từ ngày</label>
            <input 
              type="date" 
              class="form-control form-control-sm"
              v-model="fromDate"
              :max="toDate || getTodayString()"
            >
          </div>
          <div class="col-md-4">
            <label class="form-label">Đến ngày</label>
            <input 
              type="date" 
              class="form-control form-control-sm"
              v-model="toDate"
              :min="fromDate"
              :max="getTodayString()"
            >
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <button 
              class="btn btn-primary btn-sm"
              @click="applyCustomDateRange"
              :disabled="!fromDate || !toDate || loading"
            >
              <i class="bi bi-search me-1"></i>
              Áp dụng
            </button>
          </div>
        </div>
      </div>
      
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="chart-loading">
          <div class="d-flex justify-content-center align-items-center" style="height: 400px;">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
        </div>

        <!-- Chart Content -->
        <div v-else>
          <!-- Summary Stats Cards -->
          <div v-if="summaryStats" class="row mb-4">
            <div class="col-md-3">
              <div class="summary-card bg-primary text-white">
                <div class="card-body text-center">
                  <i class="bi bi-calendar-range fs-1 mb-2"></i>
                  <h6 class="card-subtitle mb-1">Số điểm thời gian</h6>
                  <h4 class="card-title mb-0">{{ summaryStats.totalDataPoints || 0 }}</h4>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="summary-card bg-success text-white">
                <div class="card-body text-center">
                  <i class="bi bi-currency-dollar fs-1 mb-2"></i>
                  <h6 class="card-subtitle mb-1">Tổng sách bán</h6>
                  <h4 class="card-title mb-0">{{ summaryStats.totalBooksSold || 0 }}</h4>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="summary-card bg-info text-white">
                <div class="card-body text-center">
                  <i class="bi bi-graph-up fs-1 mb-2"></i>
                  <h6 class="card-subtitle mb-1">Trung bình/ngày</h6>
                  <h4 class="card-title mb-0">{{ Math.round(summaryStats.averagePerDay || 0) }}</h4>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="summary-card bg-warning text-dark">
                <div class="card-body text-center">
                  <i class="bi bi-calendar-check fs-1 mb-2"></i>
                  <h6 class="card-subtitle mb-1">Cao nhất</h6>
                  <h4 class="card-title mb-0">{{ summaryStats.peakValue || 0 }}</h4>
                </div>
              </div>
            </div>
          </div>

          <!-- No data message -->
          <div v-if="!chartData || chartData.length === 0" class="text-center py-5">
            <i class="bi bi-graph-up text-muted" style="font-size: 4rem;"></i>
            <h5 class="text-muted mt-3">Không có dữ liệu</h5>
            <p class="text-muted">Chưa có dữ liệu thống kê sách cho khoảng thời gian này</p>
          </div>
          
          <!-- ApexCharts Chart Container -->
          <div v-else>
            <div id="bookPerformanceChart" class="chart-container"></div>
            <div class="chart-info mt-3">
              <div class="row">
                <div class="col-md-8">
                  <small class="text-muted">
                    <i class="bi bi-info-circle me-1 text-primary"></i>
                    <strong>Hướng dẫn sử dụng:</strong> 
                    <span class="text-primary fw-bold">Click vào các điểm tròn</span> trên biểu đồ để xem chi tiết sách bán
                  </small>
                </div>
                <div class="col-md-4 text-end">
                  <small class="text-muted">
                    <i class="bi bi-mouse me-1"></i>
                    Di chuyển chuột để xem thông tin chi tiết
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Book Statistics Details Popup -->
    <BookStatisticsPopup
      :show="showPopup"
      :selected-date="selectedChartDate"
      :period="selectedPeriod"
      :mouse-position="mousePosition"
      @close="closePopup"
      @limit-change="onPopupLimitChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { getBookStatsSummary } from '@/services/admin/bookStatistics';
import BookStatisticsPopup from '@/components/common/BookStatisticsPopup.vue';
import ApexCharts from 'apexcharts';
import Swal from 'sweetalert2';

// Reactive data
const chartData = ref([]);
const loading = ref(false);
const error = ref('');
const selectedPeriod = ref('day');
const fromDate = ref('');
const toDate = ref('');

// Chart instance
let chart = null;

// Popup state
const showPopup = ref(false);
const selectedChartDate = ref('');
const mousePosition = ref({ x: 0, y: 0 });

// Computed
const summaryStats = computed(() => {
  if (!chartData.value || chartData.value.length === 0) return null;
  
  const totalBooksSold = chartData.value.reduce((sum, item) => sum + (item.totalBooksSold || 0), 0);
  const totalDataPoints = chartData.value.length;
  const averagePerDay = totalDataPoints > 0 ? totalBooksSold / totalDataPoints : 0;
  const peakValue = Math.max(...chartData.value.map(item => item.totalBooksSold || 0));
  
  return {
    totalDataPoints,
    totalBooksSold,
    averagePerDay,
    peakValue
  };
});

// API call to fetch summary data theo tài liệu v4.0 mới
const fetchChartData = async () => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      try {
        loading.value = true;
        error.value = '';
        
        console.log('📡 Fetching book statistics summary:', {
          period: selectedPeriod.value,
          fromDate: fromDate.value,
          toDate: toDate.value
        });
        
        // Gọi Summary API (Tier 1) - lightweight data cho chart
        const response = await getBookStatsSummary(
          selectedPeriod.value, 
          fromDate.value, 
          toDate.value
        );
        
        console.log('📊 Summary API Response:', response);
        
        if (response && response.status === 200 && response.data) {
          chartData.value = response.data; // Mảng [{date: "2025-08-01", totalBooksSold: 87}, ...]
          console.log('✅ Chart data processed:', chartData.value);
          
          // Wait for DOM to update then render
          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 100));
          renderChart();
        } else {
          throw new Error(response.message || 'Failed to fetch summary data');
        }
      } catch (err) {
        console.error('❌ Error fetching summary data:', err);
        error.value = err.response?.data?.message || err.message || 'Không thể tải dữ liệu biểu đồ';
        chartData.value = [];
        
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể tải dữ liệu thống kê',
          icon: 'error',
          timer: 3000,
          showConfirmButton: false
        });
      } finally {
        loading.value = false;
        resolve();
      }
    }, 300); // 300ms debounce
  });
};

// Render ApexCharts chart cho Summary data mới
const renderChart = () => {
  console.log('🎨 Starting renderChart...');
  
  // Destroy existing chart
  if (chart) {
    console.log('🗑️ Destroying existing chart...');
    chart.destroy();
    chart = null;
  }

  if (!chartData.value || chartData.value.length === 0) {
    console.log('❌ No summary data available:', chartData.value);
    return;
  }

  console.log('📊 Summary data:', chartData.value);

  const chartElement = document.querySelector('#bookPerformanceChart');
  if (!chartElement) {
    console.error('❌ Chart element #bookPerformanceChart not found!');
    setTimeout(() => {
      renderChart();
    }, 100);
    return;
  }

  console.log('✅ Chart element found:', chartElement);

  // Chuẩn bị dữ liệu cho biểu đồ từ Summary API
  const categories = chartData.value.map(item => {
    return formatDateLabel(item.date);
  });
  
  const totalBooksSoldData = chartData.value.map(item => item.totalBooksSold || 0);

  console.log('🏷️ Categories:', categories);
  console.log('📦 Total books sold data:', totalBooksSoldData);

  // ApexCharts configuration cho Summary data
  const options = {
    series: [
      {
        name: 'Số sách bán',
        data: totalBooksSoldData,
        color: '#667eea'
      }
    ],
    chart: {
      type: 'area',
      height: 400,
      fontFamily: 'Inter, sans-serif',
      // ✅ SỬA SCROLL BEHAVIOR - Cho phép cuộn trang khi hover
      selection: {
        enabled: false
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: false
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      },
      events: {
        // ✅ CLICK HANDLER - Khi click vào điểm trên chart
        dataPointSelection: function(event, chartContext, config) {
          const dataPointIndex = config.dataPointIndex;
          if (dataPointIndex >= 0 && chartData.value[dataPointIndex]) {
            const selectedData = chartData.value[dataPointIndex];
            console.log('📍 Chart point clicked:', selectedData);
            
            // Store mouse position cho popup positioning
            mousePosition.value = {
              x: event.clientX,
              y: event.clientY
            };
            
            // Set selected date và show popup
            selectedChartDate.value = selectedData.date;
            showPopup.value = true;
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    // ✅ THÊM MARKERS - Điểm tròn để click
    markers: {
      size: 6,
      colors: ['#667eea'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 10,
        sizeOffset: 3
      },
      discrete: []
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: categories,
      title: {
        text: `Thống kê sách bán theo ${getPeriodText()}`,
        style: {
          fontSize: '14px',
          fontWeight: 600,
          color: '#2d3748'
        }
      },
      labels: {
        style: {
          colors: '#718096',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Số sách bán',
        style: {
          fontSize: '14px',
          fontWeight: 600,
          color: '#667eea'
        }
      },
      labels: {
        formatter: function (val) {
          return Math.round(val);
        },
        style: {
          colors: '#667eea',
          fontSize: '11px'
        }
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    tooltip: {
      theme: 'light',
      shared: false,
      intersect: true,
      followCursor: true,
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const dataPoint = chartData.value[dataPointIndex];
        const formattedDate = formatDateLabel(dataPoint.date, true);
        
        return `
          <div class="chart-tooltip">
            <div class="tooltip-header">${formattedDate}</div>
            <div class="tooltip-body">
              <div class="tooltip-row">
                <span class="tooltip-label">Số sách bán:</span>
                <span class="tooltip-value">${dataPoint.totalBooksSold} cuốn</span>
              </div>
              <div class="tooltip-hint">
                <i class="bi bi-hand-index me-1"></i>
                <strong>Click vào điểm tròn</strong> để xem chi tiết từng sách
              </div>
            </div>
          </div>
        `;
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontWeight: 500,
      markers: {
        width: 12,
        height: 12,
        radius: 4
      }
    }
  };

  console.log('⚙️ Chart options:', options);

  try {
    chart = new ApexCharts(chartElement, options);
    console.log('✅ ApexChart instance created:', chart);
    
    chart.render().then(() => {
      console.log('🎨 Chart rendered successfully!');
    });
  } catch (err) {
    console.error('❌ Error creating ApexChart:', err);
  }
};

// Event handlers
const onPeriodChange = () => {
  console.log('📊 Period changed to:', selectedPeriod.value);
  
  // Reset custom dates when changing away from custom
  if (selectedPeriod.value !== 'custom') {
    fromDate.value = '';
    toDate.value = '';
    fetchChartData();
  }
};

const applyCustomDateRange = () => {
  if (fromDate.value && toDate.value) {
    console.log('📅 Applying custom date range:', fromDate.value, 'to', toDate.value);
    fetchChartData();
  }
};

// Helper functions
const getPeriodText = () => {
  const periods = {
    'day': 'ngày',
    'week': 'tuần', 
    'month': 'tháng',
    'year': 'năm',
    'custom': 'khoảng thời gian'
  };
  return periods[selectedPeriod.value] || 'thời gian';
};

const formatDateLabel = (dateString, detailed = false) => {
  const date = new Date(dateString);
  
  if (detailed) {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Format based on period
  switch (selectedPeriod.value) {
    case 'day':
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    case 'week':
      return `T${getWeekNumber(date)}/${date.getFullYear()}`;
    case 'month':
      return date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
    case 'year':
      return date.getFullYear().toString();
    default:
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }
};

const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Popup handlers
const closePopup = () => {
  showPopup.value = false;
  selectedChartDate.value = '';
};

const onPopupLimitChange = (newLimit) => {
  console.log('📊 Popup limit changed to:', newLimit);
  // Popup tự động reload với limit mới
};

// Expose methods
defineExpose({
  fetchChartData
});

// Initialize
onMounted(() => {
  fetchChartData();
});
</script>

<style scoped>
.performance-chart-container {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1.25rem 1.5rem;
}

.card-title {
  color: white;
  font-weight: 600;
}

.chart-controls .btn-group {
  border-radius: 8px;
  overflow: hidden;
}

.chart-controls .btn-outline-primary {
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.3);
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.chart-controls .btn-outline-primary:hover,
.chart-controls .btn-check:checked + .btn-outline-primary {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.summary-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin-bottom: 1rem;
}

.summary-card:hover {
  transform: translateY(-5px);
}

.summary-card .card-body {
  padding: 1.5rem;
}

.summary-card .card-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin: 0;
}

.summary-card .card-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

.chart-container {
  min-height: 400px;
  width: 100%;
  position: relative;
  overflow: visible;
}

/* ✅ FIX SCROLL BEHAVIOR - Cho phép cuộn trang khi hover vào chart */
.chart-container :deep(.apexcharts-canvas) {
  pointer-events: auto;
}

.chart-container :deep(.apexcharts-svg) {
  overflow: visible;
}

.chart-container :deep(.apexcharts-inner) {
  pointer-events: none;
}

.chart-container :deep(.apexcharts-series) {
  pointer-events: auto;
}

.chart-container :deep(.apexcharts-marker) {
  pointer-events: auto;
  cursor: pointer;
}

/* ✅ ENHANCE MARKERS - Làm nổi bật các điểm có thể click */
.chart-container :deep(.apexcharts-marker) {
  pointer-events: auto;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
}

.chart-container :deep(.apexcharts-marker):hover {
  transform: scale(1.4);
  transition: transform 0.2s ease;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.6));
}

/* ✅ CHART INFO STYLING */
.chart-info {
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 16px;
}

.chart-loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-info {
  text-align: center;
  margin-top: 1rem;
}

/* Custom tooltip styles - global */
:global(.chart-tooltip) {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  padding: 16px;
  border: 1px solid #e2e8f0;
  font-family: 'Inter', sans-serif;
}

:global(.tooltip-header) {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

:global(.tooltip-body) {
  font-size: 13px;
}

:global(.tooltip-row) {
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
}

:global(.tooltip-label) {
  color: #718096;
  font-weight: 500;
}

:global(.tooltip-value) {
  color: #2d3748;
  font-weight: 600;
}

:global(.tooltip-hint) {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  color: #9ca3af;
  font-size: 12px;
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .summary-card {
    margin-bottom: 1rem;
  }
  
  .chart-container {
    min-height: 350px;
  }
}

@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .chart-controls {
    justify-content: center;
  }
  
  .chart-controls .btn-group {
    flex-wrap: wrap;
  }
  
  .chart-container {
    min-height: 300px;
  }
  
  .summary-card .card-body {
    padding: 1rem;
  }
  
  .summary-card .card-title {
    font-size: 1.5rem;
  }
}
</style>
