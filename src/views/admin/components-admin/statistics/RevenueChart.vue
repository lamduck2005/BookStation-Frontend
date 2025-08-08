<template>
  <div class="revenue-chart-container">
    <div class="card chart-card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
          <i class="bi bi-graph-up me-2 text-primary"></i>
          Biểu đồ doanh thu
        </h5>
        <div class="chart-controls">
          <div class="btn-group btn-group-sm me-2" role="group">
            <input 
              type="radio" 
              class="btn-check" 
              name="period" 
              id="daily" 
              autocomplete="off" 
              value="daily"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="daily">Ngày</label>

            <input 
              type="radio" 
              class="btn-check" 
              name="period" 
              id="weekly" 
              autocomplete="off" 
              value="weekly"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="weekly">Tuần</label>

            <input 
              type="radio" 
              class="btn-check" 
              name="period" 
              id="monthly" 
              autocomplete="off" 
              value="monthly"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="monthly">Tháng</label>
          </div>
          
          <!-- Debug button -->
          <button 
            class="btn btn-outline-secondary btn-sm"
            @click="fetchRevenueData"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
        </div>
      </div>
      
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="chart-loading">
          <div class="d-flex justify-content-center align-items-center" style="height: 300px;">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div v-else>
          <!-- No data message -->
          <div v-if="!chartData?.dataPoints || chartData.dataPoints.length === 0" class="text-center py-5">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Không có dữ liệu biểu đồ cho khoảng thời gian này
            </div>
            <button 
              class="btn btn-outline-primary btn-sm"
              @click="loadSampleData"
            >
              <i class="bi bi-database me-1"></i>
              Tải dữ liệu mẫu
            </button>
          </div>
          
          <div id="revenueChart" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { getRevenueChart, formatCurrency } from '@/services/admin/statistics';
import ApexCharts from 'apexcharts';
import Swal from 'sweetalert2';

console.log('📦 ApexCharts imported:', ApexCharts);

const loading = ref(true);
const selectedPeriod = ref('daily');
const chartData = ref(null);
let chart = null;
let fetchTimeout = null;


const fetchRevenueData = async () => {
  // Clear previous timeout
  if (fetchTimeout) {
    clearTimeout(fetchTimeout);
  }
  
  // Debounce API calls
  return new Promise((resolve) => {
    fetchTimeout = setTimeout(async () => {
      console.log('Fetching revenue data for period:', selectedPeriod.value);
      loading.value = true;
      
      try {
        const response = await getRevenueChart(selectedPeriod.value, 30);
        console.log('🔍 Revenue Chart API Response:', response);
        
        if (response && response.data && response.data.dataPoints) {
          chartData.value = response.data;
          console.log('📊 Chart data set:', chartData.value);
          console.log('📊 Data points count:', chartData.value.dataPoints.length);
          
          // Wait for DOM to update then render
          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 100)); // Extra wait
          renderChart();
        } else {
          console.error('❌ Invalid response structure:', response);
          chartData.value = null;
        }
      } catch (error) {
        console.error('❌ Error fetching revenue chart:', error);
        chartData.value = null;
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể tải dữ liệu biểu đồ doanh thu',
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

const renderChart = () => {
  console.log('🎨 Starting renderChart...');
  
  if (chart) {
    console.log('🗑️ Destroying existing chart...');
    chart.destroy();
    chart = null;
  }

  if (!chartData.value?.dataPoints || chartData.value.dataPoints.length === 0) {
    console.log('❌ No data points available:', chartData.value);
    return;
  }

  console.log('📊 Data points:', chartData.value.dataPoints);

  const chartElement = document.querySelector('#revenueChart');
  if (!chartElement) {
    console.error('❌ Chart element #revenueChart not found!');
    // Thử tìm lại sau một khoảng thời gian
    setTimeout(() => {
      renderChart();
    }, 100);
    return;
  }

  console.log('✅ Chart element found:', chartElement);

  const dataPoints = chartData.value.dataPoints;
  
  // Xử lý categories theo period và dữ liệu thật
  const categories = dataPoints.map(item => {
    const date = new Date(item.date);
    
    if (selectedPeriod.value === 'daily') {
      // Format: "08 Th1" (ngày + tháng ngắn)
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit',
        month: 'short'
      });
    } else if (selectedPeriod.value === 'weekly') {
      // Format: "Tuần 1" hoặc theo period từ API
      return item.period || `Tuần ${Math.ceil(date.getDate() / 7)}`;
    } else if (selectedPeriod.value === 'monthly') {
      // Format: "Th1 2025"
      return date.toLocaleDateString('vi-VN', { 
        month: 'short', 
        year: 'numeric'
      });
    }
    return item.period || item.date;
  });
  
  const revenues = dataPoints.map(item => item.revenue);

  console.log('🏷️ Categories:', categories);
  console.log('💰 Revenues:', revenues);

  const options = {
    series: [{
      name: 'Doanh thu',
      data: revenues,
      color: '#667eea'
    }],
    chart: {
      type: 'area',
      height: 300,
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
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
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#667eea',
            opacity: 0.7
          },
          {
            offset: 100,
            color: '#667eea',
            opacity: 0.1
          }
        ]
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#718096',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#718096',
          fontSize: '12px',
          fontWeight: 500
        },
        formatter: function (val) {
          if (val >= 1000000) {
            return (val / 1000000).toFixed(1) + 'M';
          } else if (val >= 1000) {
            return (val / 1000).toFixed(0) + 'K';
          }
          return val.toString();
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
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const dataPoint = dataPoints[dataPointIndex];
        const formattedDate = new Date(dataPoint.date).toLocaleDateString('vi-VN', {
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        });
        
        return `
          <div class="chart-tooltip">
            <div class="tooltip-header">${formattedDate}</div>
            <div class="tooltip-body">
              <div class="tooltip-row">
                <span class="tooltip-label">Doanh thu:</span>
                <span class="tooltip-value">${formatCurrency(dataPoint.revenue)}</span>
              </div>
              <div class="tooltip-row">
                <span class="tooltip-label">Số đơn hàng:</span>
                <span class="tooltip-value">${dataPoint.orderCount} đơn</span>
              </div>
              <div class="tooltip-row">
                <span class="tooltip-label">Trung bình/đơn:</span>
                <span class="tooltip-value">${formatCurrency(dataPoint.revenue / dataPoint.orderCount)}</span>
              </div>
            </div>
          </div>
        `;
      }
    },
    markers: {
      size: 6,
      colors: ['#667eea'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    }
  };

  console.log('⚙️ Chart options:', options);

  try {
    chart = new ApexCharts(chartElement, options);
    console.log('✅ ApexChart instance created:', chart);
    
    chart.render().then(() => {
      console.log('✅ Chart rendered successfully!');
      console.log('✅ Chart container content:', chartElement.innerHTML.length > 0 ? 'Has content' : 'Empty');
    }).catch(error => {
      console.error('❌ Error rendering chart:', error);
    });
  } catch (error) {
    console.error('❌ Error creating chart:', error);
  }
};

let isUpdating = false;
const onPeriodChange = async () => {
  if (isUpdating) {
    console.log('Already updating, skipping...');
    return;
  }
  
  console.log('🔄 Period changed to:', selectedPeriod.value);
  isUpdating = true;
  
  try {
    // Destroy existing chart before fetching new data
    if (chart) {
      chart.destroy();
      chart = null;
    }
    
    await fetchRevenueData();
  } finally {
    isUpdating = false;
  }
};

const loadSampleData = () => {
  console.log('🧪 Loading sample data...');
  
  const sampleData = {
    dataPoints: [
      {
        date: "2025-01-01",
        period: "Thứ 2",
        revenue: 5000000.00,
        orderCount: 25
      },
      {
        date: "2025-01-02",
        period: "Thứ 3", 
        revenue: 7200000.00,
        orderCount: 32
      },
      {
        date: "2025-01-03",
        period: "Thứ 4",
        revenue: 6500000.00,
        orderCount: 28
      },
      {
        date: "2025-01-04",
        period: "Thứ 5",
        revenue: 8100000.00,
        orderCount: 35
      },
      {
        date: "2025-01-05",
        period: "Thứ 6",
        revenue: 9200000.00,
        orderCount: 42
      }
    ],
    periodType: "daily",
    totalRevenue: 36000000.00,
    totalOrders: 162
  };
  
  chartData.value = sampleData;
  nextTick(() => {
    renderChart();
  });
};

onMounted(() => {
  console.log('🚀 RevenueChart mounted, fetching data...');
  fetchRevenueData();
});
</script>

<style scoped>
.revenue-chart-container {
  margin-bottom: 2rem;
}

.chart-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: none;
  padding: 1.25rem 1.5rem;
}

.card-title {
  font-weight: 600;
}

.chart-controls .btn-outline-primary {
  color: rgba(255, 255, 255, 0.8);
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

.chart-container {
  min-height: 300px;
  width: 100%;
  position: relative;
}

.chart-container:empty::after {
  content: "Đang tải biểu đồ...";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-style: italic;
}

/* Khi chart đã render, không hiện text loading nữa */
.chart-container:not(:empty)::after {
  display: none;
}

.chart-loading {
  background: #f8f9fa;
  border-radius: 12px;
  margin: 1rem 0;
}

.chart-stats {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-item {
  padding: 0.75rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Custom Tooltip Styles */
:global(.chart-tooltip) {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 12px;
  border: 1px solid #e2e8f0;
}

:global(.tooltip-header) {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

:global(.tooltip-row) {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
}

:global(.tooltip-label) {
  color: #718096;
  font-size: 12px;
}

:global(.tooltip-value) {
  color: #2d3748;
  font-weight: 600;
  font-size: 12px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
  }
  
  .chart-controls {
    margin-top: 0.5rem;
  }
  
  .chart-stats {
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
}

/* Animation */
.chart-card {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
