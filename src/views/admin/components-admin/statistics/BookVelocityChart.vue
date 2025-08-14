<template>
  <div class="book-velocity-chart">
    <div class="card chart-card">
      <div class="card-header bg-transparent border-0 pb-0">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="card-title mb-0">
            <i class="bi bi-speedometer2 me-2 text-warning"></i>
            Biểu đồ tốc độ bán sách
          </h6>
          <div class="chart-controls">
            <select 
              class="form-select form-select-sm me-2" 
              v-model="selectedChartType" 
              @change="fetchChartData"
              style="width: auto;"
            >
              <option value="daily">Tốc độ theo ngày</option>
              <option value="trend">Xu hướng tốc độ</option>
            </select>
            <button 
              class="btn btn-outline-warning btn-sm" 
              @click="fetchChartData"
              :disabled="loading"
            >
              <i class="bi bi-arrow-clockwise me-1"></i>
              Làm mới
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-warning" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải biểu đồ tốc độ...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-5">
          <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
          <p class="mt-2 text-muted">{{ error }}</p>
          <button class="btn btn-outline-warning btn-sm" @click="fetchChartData">
            Thử lại
          </button>
        </div>
        
        <!-- Chart Content -->
        <div v-else>
          <!-- Chart Container -->
          <div class="chart-container" style="height: 400px;">
            <canvas ref="chartCanvas"></canvas>
          </div>
          
          <!-- Velocity Stats Summary -->
          <div class="velocity-stats mt-3" v-if="chartData?.summary">
            <div class="row g-3">
              <div class="col-md-3">
                <div class="stat-item">
                  <div class="stat-value text-warning">{{ chartData.summary.averageVelocity?.toFixed(2) || '0.00' }}</div>
                  <div class="stat-label">Tốc độ TB</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-item">
                  <div class="stat-value text-success">{{ chartData.summary.peakVelocity?.toFixed(2) || '0.00' }}</div>
                  <div class="stat-label">Tốc độ cao nhất</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-item">
                  <div class="stat-value text-info">{{ chartData.summary.currentVelocity?.toFixed(2) || '0.00' }}</div>
                  <div class="stat-label">Tốc độ hiện tại</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-item">
                  <div class="stat-value" :class="velocityTrendClass">
                    <i class="bi" :class="velocityTrendIcon"></i>
                    {{ getTrendDirectionText(chartData.summary.overallTrend) }}
                  </div>
                  <div class="stat-label">Xu hướng tốc độ</div>
                </div>
              </div>
            </div>
            
            <!-- Velocity Growth Rate -->
            <div class="row g-3 mt-2">
              <div class="col-md-6">
                <div class="insight-item">
                  <span class="insight-label">Tăng trưởng tốc độ:</span>
                  <span class="insight-value" :class="getGrowthRateClass(chartData.summary.velocityGrowthRate)">
                    {{ formatGrowthRate(chartData.summary.velocityGrowthRate) }}%
                  </span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="insight-item">
                  <span class="insight-label">Mức hiệu suất:</span>
                  <span class="badge" :class="getPerformanceBadgeClass(chartData.summary.performanceLevel)">
                    {{ getPerformanceLevelText(chartData.summary.performanceLevel) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Recommendations -->
            <div v-if="chartData.summary.recommendations && chartData.summary.recommendations.length > 0" class="recommendations mt-3">
              <h6 class="recommendation-title">
                <i class="bi bi-lightbulb me-2 text-warning"></i>
                Đề xuất cải thiện
              </h6>
              <div class="recommendation-list">
                <div 
                  v-for="(recommendation, index) in chartData.summary.recommendations" 
                  :key="index"
                  class="recommendation-item"
                >
                  <i class="bi bi-check-circle-fill text-success me-2"></i>
                  {{ recommendation }}
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
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { getBookVelocityChart, formatCurrency, getPerformanceLevelText, getTrendDirectionText } from '@/services/admin/bookStatistics';
import Chart from 'chart.js/auto';

// Refs
const chartCanvas = ref(null);
const chartInstance = ref(null);
const chartData = ref(null);
const loading = ref(false);
const error = ref(null);
const selectedChartType = ref('trend');

// Computed properties
const velocityTrendClass = computed(() => {
  if (!chartData.value?.summary?.overallTrend) return 'text-muted';
  const trend = chartData.value.summary.overallTrend;
  switch (trend) {
    case 'INCREASING': return 'text-success';
    case 'DECREASING': return 'text-danger';
    case 'STABLE': return 'text-info';
    case 'VOLATILE': return 'text-warning';
    default: return 'text-muted';
  }
});

const velocityTrendIcon = computed(() => {
  if (!chartData.value?.summary?.overallTrend) return 'bi-dash';
  const trend = chartData.value.summary.overallTrend;
  switch (trend) {
    case 'INCREASING': return 'bi-arrow-up';
    case 'DECREASING': return 'bi-arrow-down';
    case 'STABLE': return 'bi-arrow-left-right';
    case 'VOLATILE': return 'bi-activity';
    default: return 'bi-dash';
  }
});

// Methods
const fetchChartData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    console.log('Fetching velocity chart data for:', selectedChartType.value);
    
    // Sử dụng performance-chart API thay vì velocity-chart riêng
    const response = await getBookVelocityChart({
      chartType: selectedChartType.value
    });
    
    console.log('Velocity chart response:', response);
    
    if (response?.status === 200 && response?.data) {
      // Convert performance data to velocity chart format
      chartData.value = convertPerformanceDataToVelocityFormat(response.data);
      await nextTick();
      renderChart();
    } else {
      throw new Error(response?.message || 'Dữ liệu tốc độ không hợp lệ');
    }
  } catch (err) {
    console.error('Lỗi khi tải biểu đồ tốc độ:', err);
    error.value = 'Không thể tải dữ liệu biểu đồ tốc độ';
    chartData.value = null;
  } finally {
    loading.value = false;
  }
};

// Convert performance data to velocity format for backward compatibility
const convertPerformanceDataToVelocityFormat = (performanceData) => {
  if (!performanceData) return null;
  
  return {
    dataPoints: performanceData.dataPoints?.map(point => ({
      timestamp: point.timestamp,
      label: point.label,
      velocity: point.quantitySold || 0,
      acceleraton: point.growthRateQuantity || 0,
      trend: point.trend || 'STABLE'
    })) || [],
    summary: {
      averageVelocity: performanceData.summary?.totalQuantitySold 
        ? performanceData.summary.totalQuantitySold / (performanceData.dataPoints?.length || 1)
        : 0,
      totalAcceleration: performanceData.summary?.averageGrowthRate || 0,
      overallTrend: performanceData.summary?.overallTrend || 'STABLE',
      performanceLevel: 'AVERAGE', // Default since không có trong API mới
      recommendations: [
        performanceData.summary?.overallTrend === 'INCREASING' 
          ? 'Tốc độ bán hàng đang tăng tốt'
          : 'Cần cải thiện chiến lược marketing'
      ]
    }
  };
};

const renderChart = () => {
  if (!chartCanvas.value || !chartData.value) return;
  
  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  const dataPoints = chartData.value.dataPoints || [];
  
  // If no data points, show empty state
  if (dataPoints.length === 0) {
    chartInstance.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Không có dữ liệu'],
        datasets: [{
          label: 'Tốc độ',
          data: [0],
          borderColor: 'rgba(255, 193, 7, 1)',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderWidth: 2,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Biểu đồ tốc độ (${getChartTypeLabel()}) - Chưa có dữ liệu`,
            font: { size: 16, weight: 'bold' }
          },
          legend: { display: false }
        }
      }
    });
    return;
  }

  // Prepare chart data
  const labels = dataPoints.map(point => point.label || formatTimestamp(point.timestamp));
  const velocityData = dataPoints.map(point => point.velocity || 0);
  const accelerationData = dataPoints.map(point => point.acceleration || 0);
  const revenueVelocityData = dataPoints.map(point => point.revenueVelocity || 0);
  
  // Create datasets based on chart type
  const datasets = [
    {
      label: 'Tốc độ bán (cuốn/ngày)',
      data: velocityData,
      borderColor: 'rgba(255, 193, 7, 1)',
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      yAxisID: 'y'
    }
  ];

  // Add acceleration line for trend chart
  if (selectedChartType.value === 'trend') {
    datasets.push({
      label: 'Gia tốc',
      data: accelerationData,
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: false,
      borderDash: [5, 5],
      yAxisID: 'y1'
    });
  }

  // Add revenue velocity for daily chart
  if (selectedChartType.value === 'daily' && revenueVelocityData.some(v => v > 0)) {
    datasets.push({
      label: 'Tốc độ doanh thu (VNĐ/ngày)',
      data: revenueVelocityData,
      borderColor: 'rgba(40, 167, 69, 1)',
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: false,
      yAxisID: 'y2'
    });
  }
  
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: `Biểu đồ tốc độ bán sách (${getChartTypeLabel()})`,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              if (label.includes('doanh thu')) {
                return `${label}: ${formatCurrency(context.parsed.y)}`;
              } else if (label.includes('Gia tốc')) {
                return `${label}: ${context.parsed.y.toFixed(2)}`;
              } else {
                return `${label}: ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Thời gian'
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.3)'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Tốc độ (cuốn/ngày)'
          },
          grid: {
            color: 'rgba(255, 193, 7, 0.2)'
          },
          ticks: {
            callback: function(value) {
              return value.toFixed(1);
            }
          }
        },
        y1: {
          type: 'linear',
          display: selectedChartType.value === 'trend',
          position: 'right',
          title: {
            display: true,
            text: 'Gia tốc'
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: function(value) {
              return value.toFixed(2);
            }
          }
        },
        y2: {
          type: 'linear',
          display: selectedChartType.value === 'daily',
          position: 'right',
          title: {
            display: true,
            text: 'Tốc độ doanh thu (VNĐ/ngày)'
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      },
    },
  });
};

const getChartTypeLabel = () => {
  const labels = {
    'daily': 'Theo ngày',
    'trend': 'Xu hướng'
  };
  return labels[selectedChartType.value] || selectedChartType.value;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  
  switch (selectedChartType.value) {
    case 'daily':
      return date.toLocaleDateString('vi-VN');
    case 'trend':
      return `Kỳ ${date.getMonth() + 1}/${date.getFullYear()}`;
    default:
      return date.toLocaleDateString('vi-VN');
  }
};

const getPerformanceBadgeClass = (level) => {
  const classes = {
    'EXCELLENT': 'bg-success',
    'GOOD': 'bg-info',
    'AVERAGE': 'bg-warning text-dark',
    'POOR': 'bg-orange',
    'VERY_POOR': 'bg-danger'
  };
  return classes[level] || 'bg-secondary';
};

const getGrowthRateClass = (rate) => {
  if (!rate) return 'text-muted';
  if (rate > 0) return 'text-success';
  if (rate < 0) return 'text-danger';
  return 'text-muted';
};

const formatGrowthRate = (rate) => {
  if (!rate && rate !== 0) return '0.0';
  const formatted = rate.toFixed(1);
  return rate > 0 ? `+${formatted}` : formatted;
};

// Lifecycle
onMounted(() => {
  fetchChartData();
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});

// Expose methods
defineExpose({
  fetchChartData
});
</script>

<style scoped>
.book-velocity-chart {
  margin-bottom: 1.5rem;
}

.chart-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #fffbf0 0%, #ffffff 100%);
}

.card-title {
  color: #2d3748;
  font-weight: 600;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Velocity Stats */
.velocity-stats {
  background: rgba(255, 251, 235, 0.8);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.stat-item {
  text-align: center;
  padding: 12px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.insight-label {
  color: #718096;
  font-weight: 500;
  font-size: 0.9rem;
}

.insight-value {
  font-weight: 600;
  color: #2d3748;
}

/* Recommendations */
.recommendations {
  background: linear-gradient(135deg, #fff3cd 0%, #ffffff 100%);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.recommendation-title {
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  font-size: 0.85rem;
  color: #4a5568;
  line-height: 1.4;
}

.bg-orange {
  background-color: #fd7e14 !important;
  color: white;
}

/* Chart Controls */
.chart-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-outline-warning:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .stat-item {
    margin-bottom: 1rem;
  }
  
  .chart-container {
    height: 300px !important;
  }
  
  .chart-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .chart-controls .form-select {
    width: 100% !important;
  }
  
  .recommendation-item {
    font-size: 0.8rem;
  }
}
</style>
