<template>
  <div class="book-revenue-chart">
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="bi bi-bar-chart-line text-primary me-2"></i>
            Biểu đồ doanh thu & Bán sách
          </h5>
          <div class="d-flex gap-2">
            <select v-model="selectedChartType" class="form-select form-select-sm" style="width: auto;">
              <option value="daily">Theo ngày</option>
              <option value="weekly">Theo tuần</option>
              <option value="monthly">Theo tháng</option>
              <option value="yearly">Theo năm</option>
            </select>
            <button class="btn btn-outline-primary btn-sm" @click="fetchChartData">
              <i class="bi bi-arrow-repeat"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <!-- Summary Stats -->
        <div class="row mb-4" v-if="summaryStats">
          <div class="col-md-3 col-sm-6 mb-3">
            <div class="stats-card revenue">
              <div class="stats-icon">
                <i class="bi bi-cash-coin"></i>
              </div>
              <div class="stats-content">
                <h6>Tổng doanh thu</h6>
                <p class="stats-value">{{ formatCurrency(summaryStats.totalRevenue || 0) }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-3">
            <div class="stats-card books-sold">
              <div class="stats-icon">
                <i class="bi bi-book"></i>
              </div>
              <div class="stats-content">
                <h6>Sách đã bán</h6>
                <p class="stats-value">{{ summaryStats.totalBooksSold || 0 }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-3">
            <div class="stats-card avg-revenue">
              <div class="stats-icon">
                <i class="bi bi-graph-up"></i>
              </div>
              <div class="stats-content">
                <h6>DT trung bình/{{ getTimeUnit() }}</h6>
                <p class="stats-value">{{ formatCurrency(summaryStats.averageRevenue || 0) }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-3">
            <div class="stats-card growth">
              <div class="stats-icon">
                <i class="bi bi-trending-up"></i>
              </div>
              <div class="stats-content">
                <h6>Tăng trưởng</h6>
                <p class="stats-value" :class="getGrowthClass(summaryStats.growthRate)">
                  {{ summaryStats.growthRate >= 0 ? '+' : '' }}{{ summaryStats.growthRate?.toFixed(1) || 0 }}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="chart-container">
          <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 400px;">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>
          <div v-else-if="error" class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ error }}
          </div>
          <canvas v-else ref="chartCanvas" width="400" height="200"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { getBookSalesChart } from '@/services/admin/bookStatistics'
import Swal from 'sweetalert2'

Chart.register(...registerables)

// Reactive data
const chartCanvas = ref(null)
const chartInstance = ref(null)
const selectedChartType = ref('monthly')
const loading = ref(false)
const error = ref(null)
const summaryStats = ref(null)

// Chart colors
const colors = {
  revenue: {
    background: 'rgba(54, 162, 235, 0.1)',
    border: 'rgb(54, 162, 235)',
    fill: true
  },
  booksSold: {
    background: 'rgba(255, 99, 132, 0.1)', 
    border: 'rgb(255, 99, 132)',
    fill: false
  }
}

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getTimeUnit = () => {
  const units = {
    daily: 'ngày',
    weekly: 'tuần', 
    monthly: 'tháng',
    yearly: 'năm'
  }
  return units[selectedChartType.value] || 'kỳ'
}

const getGrowthClass = (rate) => {
  if (rate > 0) return 'text-success'
  if (rate < 0) return 'text-danger'
  return 'text-muted'
}

const calculateSummaryStats = (chartData) => {
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return null
  }

  const revenueData = chartData.datasets.find(d => d.label === 'Doanh thu')?.data || []
  const booksSoldData = chartData.datasets.find(d => d.label === 'Sách đã bán')?.data || []

  const totalRevenue = revenueData.reduce((sum, val) => sum + (val || 0), 0)
  const totalBooksSold = booksSoldData.reduce((sum, val) => sum + (val || 0), 0)
  const averageRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0

  // Calculate growth rate (comparing last period with previous)
  let growthRate = 0
  if (revenueData.length >= 2) {
    const lastPeriod = revenueData[revenueData.length - 1] || 0
    const previousPeriod = revenueData[revenueData.length - 2] || 0
    if (previousPeriod > 0) {
      growthRate = ((lastPeriod - previousPeriod) / previousPeriod) * 100
    }
  }

  return {
    totalRevenue,
    totalBooksSold, 
    averageRevenue,
    growthRate
  }
}

const destroyChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
}

const createChart = (data) => {
  destroyChart()
  
  const ctx = chartCanvas.value.getContext('2d')
  
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Biểu đồ doanh thu và bán sách - ${getTimeUnit()}`,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.dataset.label === 'Doanh thu') {
                label += formatCurrency(context.parsed.y)
              } else {
                label += context.parsed.y
              }
              return label
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: getTimeUnit().charAt(0).toUpperCase() + getTimeUnit().slice(1)
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Doanh thu (VNĐ)'
          },
          ticks: {
            callback: function(value) {
              return formatCurrency(value)
            }
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Số sách bán'
          },
          grid: {
            drawOnChartArea: false,
          },
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  })
}

const fetchChartData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Sử dụng API performance-chart mới
    const response = await getBookSalesChart(selectedChartType.value)
    
    if (response.status === 200 && response.data) {
      // Parse data từ performance-chart API structure mới
      const performanceData = response.data
      
      // Convert performance data sang chart data format
      const chartData = convertPerformanceDataToChartFormat(performanceData)
      
      // Calculate summary stats từ data mới
      summaryStats.value = calculateSummaryStatsFromPerformance(performanceData)
      
      await nextTick()
      createChart(chartData)
    } else {
      throw new Error(response.message || 'Không thể tải dữ liệu biểu đồ')
    }
  } catch (err) {
    console.error('Error fetching sales chart data:', err)
    error.value = err.message || 'Có lỗi xảy ra khi tải dữ liệu biểu đồ'
    
    Swal.fire({
      icon: 'error',
      title: 'Lỗi tải dữ liệu',
      text: error.value,
      confirmButtonText: 'Đóng'
    })
  } finally {
    loading.value = false
  }
}

// Convert performance data format to chart format
const convertPerformanceDataToChartFormat = (performanceData) => {
  if (!performanceData || !performanceData.dataPoints) {
    return { labels: [], datasets: [] }
  }
  
  const dataPoints = performanceData.dataPoints || []
  
  // Extract labels and data
  const labels = dataPoints.map(point => point.label || '')
  const revenueData = dataPoints.map(point => point.revenue || 0)
  const quantityData = dataPoints.map(point => point.quantitySold || 0)
  
  return {
    labels: labels,
    datasets: [
      {
        label: 'Doanh thu',
        data: revenueData,
        ...colors.revenue,
        yAxisID: 'y'
      },
      {
        label: 'Sách đã bán',
        data: quantityData,
        ...colors.booksSold,
        yAxisID: 'y1'
      }
    ]
  }
}

// Calculate summary stats từ performance data structure mới
const calculateSummaryStatsFromPerformance = (performanceData) => {
  if (!performanceData || !performanceData.summary) {
    return null
  }
  
  const summary = performanceData.summary
  
  return {
    totalRevenue: summary.totalRevenue || 0,
    totalBooksSold: summary.totalQuantitySold || 0,
    averageRevenue: summary.totalRevenue && performanceData.dataPoints?.length 
      ? summary.totalRevenue / performanceData.dataPoints.length 
      : 0,
    growthRate: summary.averageGrowthRate || 0
  }
}

// Watch for chart type changes
watch(selectedChartType, () => {
  fetchChartData()
})

// Lifecycle
onMounted(() => {
  fetchChartData()
})

// Expose methods for parent component
defineExpose({
  fetchChartData
})
</script>

<style scoped>
.book-revenue-chart {
  margin-bottom: 1.5rem;
}

.stats-card {
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  height: 100%;
  transition: transform 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stats-card.revenue {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left: 4px solid #2196f3;
}

.stats-card.books-sold {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
  border-left: 4px solid #e91e63;
}

.stats-card.avg-revenue {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-left: 4px solid #4caf50;
}

.stats-card.growth {
  background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
  border-left: 4px solid #ff9800;
}

.stats-icon {
  font-size: 2rem;
  margin-right: 1rem;
  opacity: 0.8;
}

.stats-content h6 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.25rem;
}

.stats-value {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}

.form-select-sm {
  min-width: 120px;
}

/* Responsive design */
@media (max-width: 768px) {
  .stats-card {
    margin-bottom: 1rem;
  }
  
  .stats-content h6 {
    font-size: 0.8rem;
  }
  
  .stats-value {
    font-size: 1.1rem;
  }
  
  .chart-container {
    height: 300px;
  }
}
</style>
