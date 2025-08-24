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
              id="quarter" 
              autocomplete="off" 
              value="quarter"
              v-model="selectedPeriod"
              @change="onPeriodChange"
            >
            <label class="btn btn-outline-primary" for="quarter">Quý</label>

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
          </div>
          
          <!-- Custom Date Range Toggle -->
          <button 
            class="btn btn-outline-info btn-sm me-2"
            @click="toggleCustomDateRange"
            :class="{ 'active': showCustomDateRange }"
          >
            <i class="bi bi-calendar-range me-1"></i>
            Tùy chỉnh khoảng thời gian
          </button>
          
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
      <div v-if="showCustomDateRange" class="card-body border-bottom">
        <div class="row align-items-center">
          <div class="col-md-3">
            <label class="form-label">
              <i class="bi bi-calendar3 me-1"></i>
              Từ ngày
            </label>
            <input 
              type="date" 
              class="form-control form-control-sm"
              v-model="fromDate"
              :max="toDate || getTodayString()"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label">
              <i class="bi bi-calendar3 me-1"></i>
              Đến ngày
            </label>
            <input 
              type="date" 
              class="form-control form-control-sm"
              v-model="toDate"
              :min="fromDate"
              :max="getTodayString()"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label">
              <i class="bi bi-graph-up me-1"></i>
              Loại biểu đồ
            </label>
            <select class="form-select form-select-sm" v-model="selectedPeriod">
              <option value="day">Theo ngày</option>
              <option value="week">Theo tuần</option>
              <option value="month">Theo tháng</option>
              <option value="quarter">Theo quý</option>
              <option value="year">Theo năm</option>
            </select>
          </div>
          <div class="col-md-3 d-flex align-items-end gap-2 mt-4">
            <button 
              class="btn btn-primary btn-sm flex-grow-1"
              @click="applyCustomDateRange"
              :disabled="!fromDate || !toDate || loading"
            >
              <i class="bi bi-search me-1"></i>
              Áp dụng
            </button>
            <button 
              class="btn btn-outline-secondary btn-sm"
              @click="clearCustomDateRange"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        <div class="mt-2">
          <div class="note-box mt-2 p-3">
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-lightbulb-fill text-warning fs-5 me-2"></i>
              <span class="fw-bold text-dark me-1" style="font-size: 1rem; letter-spacing: 0.5px;">Lưu ý quan trọng</span>
              <button class="btn btn-link p-0 m-0 border-0 note-toggle-btn align-self-center ms-1" @click="noteOpen = !noteOpen" :aria-label="noteOpen ? 'Đóng lưu ý' : 'Mở lưu ý'">
                <i :class="noteOpen ? 'bi bi-chevron-up fs-4 text-primary' : 'bi bi-chevron-down fs-4 text-primary'"></i>
              </button>
            </div>
            <transition name="fade">
              <div v-show="noteOpen" class="note-content text-dark" style="font-size: 0.97rem;">
                <i class="bi bi-info-circle text-primary me-1"></i>
                Nếu <span class="fw-semibold text-primary">khoảng thời gian</span> bạn chọn <span class="fw-semibold">ngắn hơn 1 đơn vị thống kê</span> (ngày / tuần / tháng / quý / năm), hệ thống sẽ tự động trả về <span class="fw-semibold text-success">toàn bộ dữ liệu của đơn vị thống kê đó</span> chứa khoảng thời gian này.<br>
                <ul class="mt-2 mb-1 ps-4">
                  <li><i class="bi bi-calendar-week text-info me-1"></i> <span class="fw-semibold">Ví dụ 1:</span> Chọn kiểu <span class="text-primary">“Tuần”</span> nhưng chỉ chọn 3 ngày (02/05 → 04/05) → <span class="text-success">trả về toàn bộ tuần</span> chứa ngày 02/05.</li>
                  <li><i class="bi bi-calendar-month text-info me-1"></i> <span class="fw-semibold">Ví dụ 2:</span> Chọn kiểu <span class="text-primary">“Tháng”</span> nhưng chỉ chọn 10 ngày (05/03 → 14/03) → <span class="text-success">trả về toàn bộ tháng 3</span>.</li>
                </ul>
                <div class="d-flex align-items-center mt-2">
                  <i class="bi bi-star-fill text-warning me-1"></i>
                  <span class="text-muted" style="font-size: 0.93rem;">Điều này giúp đảm bảo số liệu thống kê luôn đầy đủ và chính xác.</span>
                </div>
              </div>
            </transition>
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
import { ref, onMounted, nextTick, computed, watch, onUnmounted } from 'vue';
// State for note open/close
const noteOpen = ref(false);
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
          console.log('  Chart data processed:', chartData.value);
          // Đánh dấu chartReady false để watcher xử lý lại
          chartReady.value = false;
          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 100));
          // chartReady sẽ được watcher set true nếu đủ điều kiện
        } else {
          throw new Error(response.message || 'Failed to fetch summary data');
        }
      } catch (err) {
        console.error('❌ Error fetching summary data:', err);
        error.value = err.response?.data?.message || err.message || 'Không thể tải dữ liệu biểu đồ';
        chartData.value = [];
        chartReady.value = false;
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
  
  // Destroy existing chart - Cải thiện logic destroy
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
  const chartElement = document.querySelector('#bookPerformanceChart');
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
    console.error('❌ Chart element #bookPerformanceChart not found!');
    chartReady.value = false;
    return;
  }

  console.log('  Chart element found:', chartElement);

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
      //   SỬA SCROLL BEHAVIOR - Cho phép cuộn trang khi hover
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
        //   CLICK HANDLER - Khi click vào điểm trên chart
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
    //   THÊM MARKERS - Điểm tròn để click (cải thiện UX)
    markers: {
      size: 6,
      colors: ['#667eea'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8,
        sizeOffset: 0
      },
      discrete: [],
      //   Cải thiện click area
      offsetX: 0,
      offsetY: 0
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
      offsetX: 10,
      offsetY: -10,
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif'
      },
      onDatasetHover: {
        highlightDataSeries: false
      },
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        if (dataPointIndex < 0 || !chartData.value || !chartData.value[dataPointIndex]) {
          return '';
        }
        
        const dataPoint = chartData.value[dataPointIndex];
        
        // Format date display
        let dateDisplay = '';
        let periodInfo = '';
        
        if (dataPoint.dateRange) {
          dateDisplay = dataPoint.dateRange;
        } else {
          dateDisplay = formatDateLabel(dataPoint.date, true);
        }
        
        // Build period-specific information
        if (dataPoint.period === 'daily') {
          periodInfo = `
            <div class="tooltip-row">
              <span class="tooltip-label">Ngày:</span>
              <span class="tooltip-value">${new Date(dataPoint.date).toLocaleDateString('vi-VN')}</span>
            </div>
          `;
        } else if (dataPoint.period === 'weekly') {
          periodInfo = `
            <div class="tooltip-row">
              <span class="tooltip-label">Tuần:</span>
              <span class="tooltip-value">${dataPoint.weekNumber ? `Tuần ${dataPoint.weekNumber}` : ''} ${dataPoint.year || ''}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-label">Thời gian:</span>
              <span class="tooltip-value">${dataPoint.startDate ? new Date(dataPoint.startDate).toLocaleDateString('vi-VN') : ''} - ${dataPoint.endDate ? new Date(dataPoint.endDate).toLocaleDateString('vi-VN') : ''}</span>
            </div>
          `;
        } else if (dataPoint.period === 'monthly') {
          periodInfo = `
            <div class="tooltip-row">
              <span class="tooltip-label">Tháng:</span>
              <span class="tooltip-value">${dataPoint.monthName || `Tháng ${dataPoint.monthNumber}`} ${dataPoint.year || ''}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-label">Thời gian:</span>
              <span class="tooltip-value">${dataPoint.startDate ? new Date(dataPoint.startDate).toLocaleDateString('vi-VN') : ''} - ${dataPoint.endDate ? new Date(dataPoint.endDate).toLocaleDateString('vi-VN') : ''}</span>
            </div>
          `;
        } else if (dataPoint.period === 'quarterly') {
          periodInfo = `
            <div class="tooltip-row">
              <span class="tooltip-label">Quý:</span>
              <span class="tooltip-value">Quý ${dataPoint.quarter || ''} năm ${dataPoint.year || ''}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-label">Thời gian:</span>
              <span class="tooltip-value">${dataPoint.startDate ? new Date(dataPoint.startDate).toLocaleDateString('vi-VN') : ''} - ${dataPoint.endDate ? new Date(dataPoint.endDate).toLocaleDateString('vi-VN') : ''}</span>
            </div>
          `;
        } else if (dataPoint.period === 'yearly') {
          periodInfo = `
            <div class="tooltip-row">
              <span class="tooltip-label">Năm:</span>
              <span class="tooltip-value">${dataPoint.year || new Date(dataPoint.date).getFullYear()}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-label">Thời gian:</span>
              <span class="tooltip-value">${dataPoint.startDate ? new Date(dataPoint.startDate).toLocaleDateString('vi-VN') : ''} - ${dataPoint.endDate ? new Date(dataPoint.endDate).toLocaleDateString('vi-VN') : ''}</span>
            </div>
          `;
        }
        
        return `
          <div class="apexcharts-tooltip-custom">
            <div class="tooltip-header">${dateDisplay}</div>
            <div class="tooltip-body">
              ${periodInfo}
              <div class="tooltip-row highlight">
                <span class="tooltip-label">Số sách bán:</span>
                <span class="tooltip-value">${dataPoint.totalBooksSold || 0} cuốn</span>
              </div>
              <div class="tooltip-row highlight">
                <span class="tooltip-label">Doanh thu thuần:</span>
                <span class="tooltip-value">${(dataPoint.netRevenue || 0).toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div class="tooltip-hint">
                <i class="bi bi-hand-index me-1"></i>
                <strong>Click vào điểm</strong> để xem chi tiết sách bán
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
    console.log('  ApexChart instance created:', chart);
    
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
  
  // Nếu không có custom date range thì fetch luôn
  if (!showCustomDateRange.value) {
    fetchChartData();
  }
};

const toggleCustomDateRange = () => {
  showCustomDateRange.value = !showCustomDateRange.value;
  
  if (!showCustomDateRange.value) {
    // Clear custom dates và fetch với period mặc định
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
    // For detailed tooltip - check if we have quarter and dateRange from API response
    if (selectedPeriod.value === 'quarter') {
      // Try to find the data point that matches this date
      const dataPoint = chartData.value.find(item => item.date === dateString);
      if (dataPoint && dataPoint.dateRange) {
        return dataPoint.dateRange; // "Q2 2025" from API
      }
      // Fallback to manual quarter calculation
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
      // Try to use dateRange from API response first
      const dataPoint = chartData.value.find(item => item.date === dateString);
      if (dataPoint && dataPoint.dateRange) {
        return dataPoint.dateRange; // "Q2 2025" from API
      }
      // Fallback to manual calculation
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

// Always return today in Vietnam timezone (Asia/Ho_Chi_Minh) for input type=date
const getTodayString = () => {
  try {
    // Use Intl.DateTimeFormat to get yyyy-MM-dd in Asia/Ho_Chi_Minh
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch (e) {
    // Fallback: UTC+7 manual
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
  // Popup tự động reload với limit mới
};

// Expose methods
defineExpose({
  fetchChartData
});

// Watcher: Khi chartData có dữ liệu và không loading, chart container đã xuất hiện, thì render chart
watch(
  [chartData, loading],
  async ([data, isLoading]) => {
    if (!isLoading && data && data.length > 0 && !chartReady.value) {
      await nextTick();
      // Wait a bit more to ensure DOM is fully ready
      setTimeout(() => {
        const chartElement = document.querySelector('#bookPerformanceChart');
        if (chartElement && !chartReady.value) {
          renderChart();
        }
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

/*   FIX SCROLL BEHAVIOR - Cho phép cuộn trang khi hover vào chart */
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

/*   ENHANCE MARKERS - Làm nổi bật và ổn định các điểm có thể click */
.chart-container :deep(.apexcharts-marker) {
  pointer-events: auto;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2));
  transition: none;
}

.chart-container :deep(.apexcharts-marker):hover {
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.4));
}

/*   STABLE HOVER AREA - Tạo vùng click lớn hơn để dễ click */
.chart-container :deep(.apexcharts-series-markers) {
  pointer-events: auto;
}

.chart-container :deep(.apexcharts-series-markers .apexcharts-marker) {
  stroke-width: 16;
  stroke: transparent;
}

/*  PREVENT FLICKER - Ngăn marker nhảy loạn */
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

/*  PREVENT TOOLTIP JUMPING */
.chart-container :deep(.apexcharts-tooltip.apexcharts-active) {
  pointer-events: none !important;
  position: fixed !important;
  will-change: auto !important;
  transform: translate3d(0,0,0) !important;
}

/*  TOOLTIP POSITIONING - Make it closer to cursor */
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

/*  CHART INFO STYLING */
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
/* Fade transition for note box */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.note-toggle-btn {
  outline: none;
  box-shadow: none;
  background: none;
  font-size: 1.2rem;
  color: #2563eb;
  transition: color 0.2s;
  margin-left: 2px;
}
.note-toggle-btn:hover {
  color: #1d4ed8;
}
</style>
