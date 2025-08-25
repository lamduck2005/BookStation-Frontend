<template>
  <div class="performance-chart-container">
    <div class="card chart-card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
          <i class="bi bi-graph-up me-2 text-primary"></i>
          Thống kê đơn hàng theo {{ getPeriodText() }}
        </h5>
        <div class="chart-controls">
          <div class="btn-group btn-group-sm me-2" role="group">
            <input 
              type="radio" 
              class="btn-check" 
              name="orderPeriod" 
              id="orderDay" 
              autocomplete="off" 
              value="day"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="orderDay">Ngày</label>

            <input 
              type="radio" 
              class="btn-check" 
              name="orderPeriod" 
              id="orderWeek" 
              autocomplete="off" 
              value="week"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="orderWeek">Tuần</label>

            <input 
              type="radio" 
              class="btn-check" 
              name="orderPeriod" 
              id="orderMonth" 
              autocomplete="off" 
              value="month"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="orderMonth">Tháng</label>

            <input 
              type="radio" 
              class="btn-check" 
              name="orderPeriod" 
              id="orderQuarter" 
              autocomplete="off" 
              value="quarter"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="orderQuarter">Quý</label>

            <input 
              type="radio" 
              class="btn-check" 
              name="orderPeriod" 
              id="orderYear" 
              autocomplete="off" 
              value="year"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="orderYear">Năm</label>
          </div>
          
          <button 
            type="button" 
            class="btn btn-outline-info btn-sm"
            @click="toggleCustomDateRange"
          >
            <i class="bi bi-calendar-range me-1"></i>
            Tùy chọn
          </button>
        </div>
      </div>

      <!-- Custom Date Range -->
      <div v-if="showCustomDateRange" class="card-body border-bottom">
        <div class="row align-items-center">
          <div class="col-md-4">
            <label class="form-label">Từ ngày:</label>
            <input 
              type="date" 
              class="form-control form-control-sm" 
              v-model="fromDate"
              :max="getTodayString()"
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Đến ngày:</label>
            <input 
              type="date" 
              class="form-control form-control-sm" 
              v-model="toDate"
              :max="getTodayString()"
            />
          </div>
          <div class="col-md-4">
            <div class="d-flex gap-2 mt-4">
              <button 
                type="button" 
                class="btn btn-primary btn-sm "
                @click="applyCustomDateRange"
                :disabled="!fromDate || !toDate"
              >
                <i class="bi bi-check me-1"></i>
                Áp dụng
              </button>
              <button 
                type="button" 
                class="btn btn-outline-secondary btn-sm"
                @click="clearCustomDateRange"
              >
                <i class="bi bi-x me-1"></i>
                Xóa
              </button>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <small class="text-muted">
            <i class="bi bi-info-circle me-1"></i>
            Chọn khoảng thời gian để xem chi tiết thống kê đơn hàng
          </small>
        </div>
      </div>
      
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="chart-loading">
          <div class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
            <div class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">Đang tải dữ liệu thống kê...</p>
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
          <div class="row mb-4" v-if="summaryStats">
            <div class="col-md-3">
              <div class="summary-card bg-primary text-white">
                <div class="card-body">
                  <h5 class="card-title">{{ summaryStats.totalOrders }}</h5>
                  <p class="card-subtitle">Tổng đơn hàng</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="summary-card bg-success text-white">
                <div class="card-body">
                  <h5 class="card-title">{{ formatCurrency(summaryStats.totalRevenue) }}</h5>
                  <p class="card-subtitle">Tổng doanh thu thuần</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="summary-card bg-info text-white">
                <div class="card-body">
                  <h5 class="card-title">{{ formatCurrency(summaryStats.averageOrderValue) }}</h5>
                  <p class="card-subtitle">Giá trị TB/Đơn</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="summary-card bg-warning text-white">
                <div class="card-body">
                  <h5 class="card-title">{{ summaryStats.completionRate }}%</h5>
                  <p class="card-subtitle">Tỷ lệ hoàn thành</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Chart Container -->
          <div class="chart-container">
            <div id="orderPerformanceChart"></div>
          </div>

          <!-- Chart Info -->
          <div class="chart-info" v-if="chartData && chartData.length > 0">
            <small class="text-muted">
              <i class="bi bi-info-circle me-1"></i>
              Hiển thị {{ chartData.length }} điểm dữ liệu. Click vào các điểm trên biểu đồ để xem chi tiết đơn hàng.
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Statistics Details Popup -->
    <OrderStatisticsPopup
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
import { ref, onMounted, nextTick, computed, watch, onUnmounted } from 'vue';
import { getOrderStatsSummary, formatCurrency } from '@/services/admin/orderStatistics';
import OrderStatisticsPopup from '@/components/common/OrderStatisticsPopup.vue';
import ApexCharts from 'apexcharts';
import Swal from 'sweetalert2';

// Reactive data
const chartData = ref([]);
const loading = ref(false);
const error = ref('');
const selectedPeriod = ref('day');
const fromDate = ref('');
const toDate = ref('');
const showCustomDateRange = ref(false);

// Chart instance
let chart = null;
// Chart ready state
const chartReady = ref(false);

// Popup state
const showPopup = ref(false);
const selectedChartDate = ref('');
const mousePosition = ref({ x: 0, y: 0 });

// Computed
const summaryStats = computed(() => {
  if (!chartData.value || chartData.value.length === 0) return null;
  
  const totalOrders = chartData.value.reduce((sum, item) => sum + (item.totalOrders || 0), 0);
  const totalRevenue = chartData.value.reduce((sum, item) => sum + (item.netRevenue || 0), 0);
  const completedOrders = chartData.value.reduce((sum, item) => sum + (item.completedOrders || 0), 0);
  
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  
  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    completionRate
  };
});

// API call to fetch summary data
const fetchChartData = async () => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      try {
        loading.value = true;
        error.value = '';
        
        console.log('📡 Fetching order statistics summary:', {
          period: selectedPeriod.value,
          fromDate: fromDate.value,
          toDate: toDate.value
        });
        
        // Call Summary API (Tier 1) - lightweight data for chart
        const response = await getOrderStatsSummary(
          selectedPeriod.value,
          fromDate.value || null,
          toDate.value || null
        );
        
        console.log('📊 Summary API Response:', response);
        
        if (response && response.status === 200 && response.data) {
          chartData.value = response.data;
          chartReady.value = false; // Will be set to true by watcher if conditions are met
        } else {
          throw new Error(response.message || 'Không nhận được dữ liệu hợp lệ');
        }
      } catch (err) {
        console.error('❌ Error fetching summary data:', err);
        error.value = err.response?.data?.message || err.message || 'Không thể tải dữ liệu biểu đồ';
        chartData.value = [];
        chartReady.value = false;
      } finally {
        loading.value = false;
        resolve();
      }
    }, 300); // 300ms debounce
  });
};

// Render ApexCharts chart
const renderChart = () => {
  console.log('🎨 Starting renderChart...');
  
  // Destroy existing chart
  if (chart) {
    console.log('🗑️ Destroying existing chart...');
    try {
      chart.destroy();
    } catch (error) {
      console.warn('⚠️ Error destroying chart:', error);
    }
    chart = null;
  }

  // Clear chart container content to prevent duplication
  const chartElement = document.querySelector('#orderPerformanceChart');
  if (chartElement) {
    chartElement.innerHTML = '';
  }

  if (!chartData.value || chartData.value.length === 0) {
    console.log('❌ No summary data available:', chartData.value);
    chartReady.value = false;
    return;
  }

  console.log('📊 Summary data:', chartData.value);

  if (!chartElement) {
    console.error('❌ Chart element #orderPerformanceChart not found!');
    chartReady.value = false;
    return;
  }

  console.log('✅ Chart element found:', chartElement);

  // Prepare data for chart
  const categories = chartData.value.map(item => {
    return formatDateLabel(item.date);
  });
  
  const totalOrdersData = chartData.value.map(item => item.totalOrders || 0);
  const revenueData = chartData.value.map(item => item.netRevenue || 0);

  console.log('🏷️ Categories:', categories);
  console.log('📦 Total orders data:', totalOrdersData);
  console.log('💰 Revenue data:', revenueData);

  // ApexCharts configuration
  const options = {
    series: [
      {
        name: 'Số đơn hàng',
        type: 'column',
        yAxisIndex: 0,
        data: totalOrdersData
      },
      {
        name: 'Doanh thu (VND)',
        type: 'line',
        yAxisIndex: 1,
        data: revenueData
      }
    ],
    chart: {
      type: 'line',
      height: 400,
      fontFamily: 'Inter, sans-serif',
      selection: {
        enabled: false
      },
      zoom: {
        autoScaleYaxis: false
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      events: {
        dataPointSelection: function(event, chartContext, config) {
          console.log('📊 Data point clicked:', config);
          
          if (config.dataPointIndex !== undefined && chartData.value[config.dataPointIndex]) {
            const selectedData = chartData.value[config.dataPointIndex];
            console.log('📊 Selected data:', selectedData);
            
            // Store mouse position for popup
            mousePosition.value = { x: event.clientX, y: event.clientY };
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
      width: [0, 3],
      curve: 'smooth'
    },
    markers: {
      size: [0, 6],
      colors: ['#667eea'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        sizeOffset: 2
      }
    },
    fill: {
      opacity: [0.85, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100]
      }
    },
    xaxis: {
      categories: categories,
      title: {
        text: `Thời gian (${getPeriodText()})`,
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
    yaxis: [
      {
        title: {
          text: 'Số đơn hàng',
          style: {
            fontSize: '14px',
            fontWeight: 600,
            color: '#667eea'
          }
        },
        labels: {
          style: {
            colors: '#667eea',
            fontSize: '12px'
          },
          formatter: function (val) {
            return Math.round(val).toLocaleString();
          }
        }
      },
      {
        opposite: true,
        title: {
          text: 'Doanh thu (VND)',
          style: {
            fontSize: '14px',
            fontWeight: 600,
            color: '#38a169'
          }
        },
        labels: {
          style: {
            colors: '#38a169',
            fontSize: '12px'
          },
          formatter: function (val) {
            return formatCurrency(val);
          }
        }
      }
    ],
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      shared: false,
      intersect: false,
      followCursor: true,
      fixed: {
        enabled: false
      },
      x: {
        show: true
      },
      y: {
        show: true
      },
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const data = chartData.value[dataPointIndex];
        if (!data) return '';
        
        const formattedDate = formatDateLabel(data.date, true);
        
        return `
          <div class="chart-tooltip">
            <div class="tooltip-header">
              ${formattedDate}
            </div>
            <div class="tooltip-body">
              <div class="tooltip-row highlight">
                <span class="tooltip-label">Tổng đơn hàng:</span>
                <span class="tooltip-value">${data.totalOrders || 0}</span>
              </div>
              <div class="tooltip-row">
                <span class="tooltip-label">Hoàn thành:</span>
                <span class="tooltip-value">${data.completedOrders || 0}</span>
              </div>
              <div class="tooltip-row">
                <span class="tooltip-label">Đã hủy:</span>
                <span class="tooltip-value">${data.canceledOrders || 0}</span>
              </div>
              <div class="tooltip-row highlight">
                <span class="tooltip-label">Doanh thu tuần:</span>
                <span class="tooltip-value">${formatCurrency(data.netRevenue || 0)}</span>
              </div>
              <div class="tooltip-row">
                <span class="tooltip-label">AOV:</span>
                <span class="tooltip-value">${formatCurrency(data.aov || 0)}</span>
              </div>
              <div class="tooltip-hint">
                💡 Click để xem chi tiết đơn hàng
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
        radius: 12
      }
    },
    colors: ['#667eea', '#38a169']
  };

  console.log('⚙️ Chart options:', options);

  try {
    chart = new ApexCharts(chartElement, options);
    console.log('✅ ApexChart instance created:', chart);
    
    chart.render().then(() => {
      console.log('🎨 Chart rendered successfully!');
      chartReady.value = true;
    }).catch((error) => {
      console.error('❌ Error rendering chart:', error);
      chartReady.value = false;
    });
  } catch (err) {
    console.error('❌ Error creating ApexChart:', err);
    chartReady.value = false;
  }
};

// Event handlers
const onPeriodChange = () => {
  console.log('📊 Period changed to:', selectedPeriod.value);
  
  // If no custom date range then fetch immediately
  if (!showCustomDateRange.value) {
    fetchChartData();
  }
};

const toggleCustomDateRange = () => {
  showCustomDateRange.value = !showCustomDateRange.value;
  
  if (!showCustomDateRange.value) {
    // Clear custom dates and fetch with default period
    fromDate.value = '';
    toDate.value = '';
    fetchChartData();
  }
};

const applyCustomDateRange = () => {
  if (fromDate.value && toDate.value) {
    console.log('📅 Applying custom date range:', fromDate.value, 'to', toDate.value, 'with period:', selectedPeriod.value);
    fetchChartData();
  }
};

const clearCustomDateRange = () => {
  fromDate.value = '';
  toDate.value = '';
  showCustomDateRange.value = false;
  fetchChartData();
};

// Helper functions
const getPeriodText = () => {
  const periods = {
    'day': 'ngày',
    'week': 'tuần', 
    'month': 'tháng',
    'quarter': 'quý',
    'year': 'năm'
  };
  
  if (showCustomDateRange.value && fromDate.value && toDate.value) {
    return `${periods[selectedPeriod.value] || 'thời gian'} (${fromDate.value} đến ${toDate.value})`;
  }
  
  return periods[selectedPeriod.value] || 'thời gian';
};

const formatDateLabel = (dateString, detailed = false) => {
  const date = new Date(dateString);
  
  if (detailed) {
    // For detailed tooltip
    if (selectedPeriod.value === 'quarter') {
      const dataPoint = chartData.value.find(item => item.date === dateString);
      if (dataPoint && dataPoint.dateRange) {
        return dataPoint.dateRange;
      }
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      return `Quý ${quarter} năm ${date.getFullYear()}`;
    }
    
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
    case 'quarter':
      const dataPoint = chartData.value.find(item => item.date === dateString);
      if (dataPoint && dataPoint.dateRange) {
        return dataPoint.dateRange.replace('Quý', 'Q');
      }
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      return `Q${quarter} ${date.getFullYear()}`;
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
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch (e) {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const vn = new Date(utc + 7 * 60 * 60000);
    const yyyy = vn.getFullYear();
    const mm = String(vn.getMonth() + 1).padStart(2, '0');
    const dd = String(vn.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
};

// Popup handlers
const closePopup = () => {
  showPopup.value = false;
  selectedChartDate.value = '';
};

const onPopupLimitChange = (newLimit) => {
  console.log('📊 Popup limit changed to:', newLimit);
};

// Expose methods
defineExpose({
  fetchChartData
});

// Watcher: When chartData has data and not loading, then render chart
watch(
  [chartData, loading],
  async ([data, isLoading]) => {
    if (!isLoading && data && data.length > 0 && !chartReady.value) {
      await nextTick();
      setTimeout(() => {
        renderChart();
      }, 100);
    }
  },
  { immediate: false }
);

// Initialize
onMounted(() => {
  fetchChartData();
});

// Cleanup when component unmounts
onUnmounted(() => {
  if (chart) {
    try {
      chart.destroy();
    } catch (error) {
      console.warn('⚠️ Error destroying chart on unmount:', error);
    }
    chart = null;
  }
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

.chart-controls .btn-outline-info {
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.3);
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.chart-controls .btn-outline-info:hover,
.chart-controls .btn-outline-info.active {
  background-color: rgba(23, 162, 184, 0.8);
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

.chart-container :deep(.apexcharts-marker) {
  pointer-events: auto;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2));
  transition: none;
}

.chart-container :deep(.apexcharts-marker):hover {
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.4));
}

.chart-container :deep(.apexcharts-series-markers) {
  pointer-events: auto;
}

.chart-container :deep(.apexcharts-series-markers .apexcharts-marker) {
  stroke-width: 16;
  stroke: transparent;
}

.chart-container :deep(.apexcharts-series) {
  pointer-events: auto;
}

.chart-container :deep(.apexcharts-series .apexcharts-marker) {
  pointer-events: auto;
}

.chart-container :deep(.apexcharts-tooltip) {
  pointer-events: none !important;
  transform: none !important;
  transition: none !important;
}

.chart-container :deep(.apexcharts-tooltip.apexcharts-active) {
  pointer-events: none !important;
  position: fixed !important;
  will-change: auto !important;
  transform: translate3d(0,0,0) !important;
}

.chart-container :deep(.apexcharts-tooltip) {
  pointer-events: none !important;
  transform: none !important;
  transition: none !important;
  margin-top: 150px !important;
  margin-left: 300px !important;
}

.chart-container :deep(.apexcharts-tooltip.apexcharts-active) {
  opacity: 1 !important;
  visibility: visible !important;
}

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
:global(.chart-tooltip),
:global(.apexcharts-tooltip-custom) {
  background: white !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
  padding: 16px !important;
  border: 1px solid #e2e8f0 !important;
  font-family: 'Inter', sans-serif !important;
  max-width: 350px !important;
  z-index: 9999 !important;
  pointer-events: none !important;
  position: fixed !important;
}

:global(.tooltip-header) {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  text-align: center;
}

:global(.tooltip-body) {
  font-size: 13px;
}

:global(.tooltip-row) {
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
  padding: 4px 0;
}

:global(.tooltip-row.highlight) {
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border-radius: 6px;
  padding: 8px 12px;
  margin: 8px -4px;
  border-left: 3px solid #667eea;
}

:global(.tooltip-label) {
  color: #718096;
  font-weight: 500;
  flex: 0 0 auto;
  margin-right: 12px;
}

:global(.tooltip-value) {
  color: #2d3748;
  font-weight: 600;
  text-align: right;
  flex: 1;
}

:global(.tooltip-row.highlight .tooltip-value) {
  color: #667eea;
  font-weight: 700;
}

:global(.tooltip-hint) {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  color: #9ca3af;
  font-size: 12px;
  font-style: italic;
  text-align: center;
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
