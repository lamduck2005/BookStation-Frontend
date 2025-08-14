<template>
  <div class="book-comparison-chart">
    <div class="card chart-card">
      <div class="card-header bg-transparent border-0 pb-0">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="card-title mb-0">
            <i class="bi bi-graph-up-arrow me-2 text-success"></i>
            So sánh hiệu suất sách
          </h6>
          <button 
            class="btn btn-outline-success btn-sm" 
            @click="resetComparison"
          >
            <i class="bi bi-arrow-clockwise me-1"></i>
            Reset
          </button>
        </div>
      </div>
      <div class="card-body">
        
        <!-- Book Selection -->
        <div class="row mb-4">
          <div class="col-md-6">
            <label class="form-label">Chọn sách thứ nhất <span class="text-danger">*</span></label>
            <div class="search-container">
              <input 
                type="text" 
                class="form-control"
                v-model="book1Search"
                @input="onBook1Search"
                placeholder="Tìm kiếm sách..."
                :disabled="loading"
              >
              <div v-if="book1Results.length > 0" class="search-dropdown">
                <div 
                  v-for="book in book1Results" 
                  :key="book.id"
                  class="search-item"
                  @click="selectBook1(book)"
                >
                  <div class="book-info">
                    <strong>{{ book.bookName }}</strong>
                    <div class="text-muted small">{{ formatCurrency(book.price) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectedBook1" class="selected-book mt-2">
              <div class="badge bg-primary">{{ selectedBook1.bookName }}</div>
            </div>
          </div>
          
          <div class="col-md-6">
            <label class="form-label">Chọn sách thứ hai (tùy chọn)</label>
            <div class="search-container">
              <input 
                type="text" 
                class="form-control"
                v-model="book2Search"
                @input="onBook2Search"
                placeholder="Tìm kiếm sách hoặc để trống để so sánh với trung bình"
                :disabled="loading"
              >
              <div v-if="book2Results.length > 0" class="search-dropdown">
                <div 
                  v-for="book in book2Results" 
                  :key="book.id"
                  class="search-item"
                  @click="selectBook2(book)"
                >
                  <div class="book-info">
                    <strong>{{ book.bookName }}</strong>
                    <div class="text-muted small">{{ formatCurrency(book.price) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectedBook2" class="selected-book mt-2">
              <div class="badge bg-info">{{ selectedBook2.bookName }}</div>
              <button class="btn btn-sm btn-outline-secondary ms-2" @click="clearBook2">
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Compare Button -->
        <div class="text-center mb-4">
          <button 
            class="btn btn-success"
            @click="compareBooks"
            :disabled="!selectedBook1 || loading"
          >
            <i class="bi bi-bar-chart me-2"></i>
            So sánh sách
          </button>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Đang so sánh...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải dữ liệu so sánh...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-5">
          <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
          <p class="mt-2 text-muted">{{ error }}</p>
          <button class="btn btn-outline-success btn-sm" @click="compareBooks">
            Thử lại
          </button>
        </div>
        
        <!-- Comparison Results -->
        <div v-else-if="comparisonData">
          <!-- Comparison Type Info -->
          <div class="comparison-type-info mb-4">
            <div class="alert" :class="comparisonTypeClass">
              <i class="bi" :class="comparisonTypeIcon"></i>
              <strong>{{ comparisonTypeText }}</strong>
              <div class="small mt-1">{{ comparisonDescription }}</div>
            </div>
          </div>
          
          <!-- Comparison Chart -->
          <div class="row">
            <div class="col-lg-8">
              <div class="chart-container mb-4">
                <canvas ref="comparisonChart" style="height: 400px;"></canvas>
              </div>
            </div>
            
            <!-- Key Metrics -->
            <div class="col-lg-4">
              <div class="metrics-panel">
                <h6 class="metrics-title">
                  <i class="bi bi-speedometer2 me-2"></i>
                  Metrics chính
                </h6>
                
                <!-- Performance Winner -->
                <div v-if="comparisonData.insight?.betterPerformer" class="winner-box mb-3">
                  <div class="winner-badge">🏆 Hiệu suất tốt hơn</div>
                  <div class="winner-name">{{ comparisonData.insight.betterPerformer }}</div>
                  <div class="winner-reason small text-muted">
                    {{ comparisonData.insight.reasonWhy }}
                  </div>
                  <div v-if="comparisonData.insight?.performanceDifference" class="winner-diff">
                    Chênh lệch: <strong>{{ comparisonData.insight.performanceDifference.toFixed(1) }}%</strong>
                  </div>
                </div>
                
                <!-- Book 1 Metrics -->
                <div class="book-metrics mb-3">
                  <div class="book-header bg-primary text-white">
                    📕 {{ comparisonData.book1?.bookName || 'Sách 1' }}
                  </div>
                  <div class="metric-item">
                    <span>Giá:</span>
                    <strong>{{ formatCurrency(comparisonData.book1?.price) }}</strong>
                  </div>
                  <div class="metric-item">
                    <span>Đã bán:</span>
                    <strong>{{ comparisonData.book1?.totalSold || 0 }}</strong>
                  </div>
                  <div class="metric-item">
                    <span>Doanh thu:</span>
                    <strong>{{ formatCurrency(comparisonData.book1?.totalRevenue) }}</strong>
                  </div>
                  <div class="metric-item">
                    <span>Đánh giá:</span>
                    <strong>⭐ {{ comparisonData.book1?.averageRating?.toFixed(1) || 'N/A' }}</strong>
                  </div>
                  <div class="metric-item">
                    <span>Hiệu suất:</span>
                    <span class="badge" :class="getPerformanceBadgeClass(comparisonData.book1?.performanceLevel)">
                      {{ getPerformanceLevelText(comparisonData.book1?.performanceLevel) }}
                    </span>
                  </div>
                </div>
                
                <!-- Book 2 or Average Metrics -->
                <div class="book-metrics mb-3">
                  <div class="book-header bg-info text-white">
                    {{ comparisonData.book2 ? '📘 ' + comparisonData.book2.bookName : '📊 Trung bình tất cả sách' }}
                  </div>
                  
                  <template v-if="comparisonData.book2">
                    <div class="metric-item">
                      <span>Giá:</span>
                      <strong>{{ formatCurrency(comparisonData.book2.price) }}</strong>
                    </div>
                    <div class="metric-item">
                      <span>Đã bán:</span>
                      <strong>{{ comparisonData.book2.totalSold || 0 }}</strong>
                    </div>
                    <div class="metric-item">
                      <span>Doanh thu:</span>
                      <strong>{{ formatCurrency(comparisonData.book2.totalRevenue) }}</strong>
                    </div>
                    <div class="metric-item">
                      <span>Đánh giá:</span>
                      <strong>⭐ {{ comparisonData.book2.averageRating?.toFixed(1) || 'N/A' }}</strong>
                    </div>
                    <div class="metric-item">
                      <span>Hiệu suất:</span>
                      <span class="badge" :class="getPerformanceBadgeClass(comparisonData.book2.performanceLevel)">
                        {{ getPerformanceLevelText(comparisonData.book2.performanceLevel) }}
                      </span>
                    </div>
                  </template>
                  
                  <template v-else-if="comparisonData.allBooksAverage">
                    <div class="metric-item">
                      <span>Giá TB:</span>
                      <strong>{{ formatCurrency(comparisonData.allBooksAverage.averagePrice) }}</strong>
                    </div>
                    <div class="metric-item">
                      <span>Bán TB:</span>
                      <strong>{{ comparisonData.allBooksAverage.averageSold?.toFixed(1) || 0 }}</strong>
                    </div>
                    <div class="metric-item">
                      <span>Doanh thu TB:</span>
                      <strong>{{ formatCurrency(comparisonData.allBooksAverage.averageRevenue) }}</strong>
                    </div>
                    <div class="metric-item">
                      <span>Đánh giá TB:</span>
                      <strong>⭐ {{ comparisonData.allBooksAverage.averageRating?.toFixed(1) || 'N/A' }}</strong>
                    </div>
                  </template>
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
import { ref, computed, nextTick, onUnmounted } from 'vue';
import { getBookComparison, searchBooksDropdown, formatCurrency, getPerformanceLevelText } from '@/services/admin/bookStatistics';
import Chart from 'chart.js/auto';

// Refs
const book1Search = ref('');
const book2Search = ref('');
const book1Results = ref([]);
const book2Results = ref([]);
const selectedBook1 = ref(null);
const selectedBook2 = ref(null);
const comparisonData = ref(null);
const loading = ref(false);
const error = ref(null);
const comparisonChart = ref(null);
const chartInstance = ref(null);

// Search timeouts
let book1SearchTimeout = null;
let book2SearchTimeout = null;

// Computed properties
const comparisonTypeClass = computed(() => {
  if (!comparisonData.value) return '';
  return comparisonData.value.comparisonType === 'BOOK_VS_BOOK' 
    ? 'alert-info' 
    : 'alert-warning';
});

const comparisonTypeIcon = computed(() => {
  if (!comparisonData.value) return '';
  return comparisonData.value.comparisonType === 'BOOK_VS_BOOK' 
    ? 'bi-arrows-angle-expand' 
    : 'bi-bar-chart-line';
});

const comparisonTypeText = computed(() => {
  if (!comparisonData.value) return '';
  return comparisonData.value.comparisonType === 'BOOK_VS_BOOK' 
    ? 'So sánh giữa 2 cuốn sách' 
    : 'So sánh với trung bình';
});

const comparisonDescription = computed(() => {
  if (!comparisonData.value) return '';
  return comparisonData.value.comparisonType === 'BOOK_VS_BOOK' 
    ? 'Phân tích trực tiếp giữa 2 cuốn sách cụ thể'
    : 'So sánh hiệu suất của sách với trung bình toàn bộ kho sách';
});

// Methods
const onBook1Search = () => {
  if (book1SearchTimeout) clearTimeout(book1SearchTimeout);
  book1SearchTimeout = setTimeout(() => {
    if (book1Search.value.trim().length >= 2) {
      searchBook1();
    } else {
      book1Results.value = [];
    }
  }, 300);
};

const onBook2Search = () => {
  if (book2SearchTimeout) clearTimeout(book2SearchTimeout);
  book2SearchTimeout = setTimeout(() => {
    if (book2Search.value.trim().length >= 2) {
      searchBook2();
    } else {
      book2Results.value = [];
    }
  }, 300);
};

const searchBook1 = async () => {
  try {
    const response = await searchBooksDropdown(book1Search.value, 8);
    if (response && response.status === 200 && response.data && Array.isArray(response.data)) {
      book1Results.value = response.data.map(book => ({
        id: book.bookId,
        bookName: book.bookName,
        isbn: book.isbn,
        imageUrl: book.imageUrl,
        price: 0 // API search chỉ trả dữ liệu cơ bản
      })).filter(book => 
        !selectedBook2.value || book.id !== selectedBook2.value.id
      );
    }
  } catch (err) {
    console.error('Lỗi tìm kiếm sách 1:', err);
    book1Results.value = [];
  }
};

const searchBook2 = async () => {
  try {
    const response = await searchBooksDropdown(book2Search.value, 8);
    if (response && response.status === 200 && response.data && Array.isArray(response.data)) {
      book2Results.value = response.data.map(book => ({
        id: book.bookId,
        bookName: book.bookName,
        isbn: book.isbn,
        imageUrl: book.imageUrl,
        price: 0 // API search chỉ trả dữ liệu cơ bản
      })).filter(book => 
        !selectedBook1.value || book.id !== selectedBook1.value.id
      );
    }
  } catch (err) {
    console.error('Lỗi tìm kiếm sách 2:', err);
    book2Results.value = [];
  }
};

const selectBook1 = (book) => {
  selectedBook1.value = book;
  book1Search.value = book.bookName;
  book1Results.value = [];
};

const selectBook2 = (book) => {
  selectedBook2.value = book;
  book2Search.value = book.bookName;
  book2Results.value = [];
};

const clearBook2 = () => {
  selectedBook2.value = null;
  book2Search.value = '';
  book2Results.value = [];
};

const compareBooks = async () => {
  if (!selectedBook1.value) {
    error.value = 'Vui lòng chọn ít nhất 1 cuốn sách';
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    
    // Gọi API mới với response structure chuẩn theo tài liệu v3.0
    const response = await getBookComparison(
      selectedBook1.value.id,
      selectedBook2.value?.id || null
    );
    
    if (response && response.status === 200 && response.data) {
      comparisonData.value = response.data;
      await nextTick();
      renderChart();
    } else {
      throw new Error('Dữ liệu so sánh không hợp lệ');
    }
  } catch (err) {
    console.error('Lỗi so sánh sách:', err);
    error.value = 'Không thể so sánh sách. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};

const renderChart = () => {
  if (!comparisonChart.value || !comparisonData.value) return;
  
  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = comparisonChart.value.getContext('2d');
  
  // Prepare data for radar chart
  const book1 = comparisonData.value.book1;
  const book2 = comparisonData.value.book2;
  const avgData = comparisonData.value.allBooksAverage;
  
  const labels = ['Giá bán', 'Số lượng bán', 'Doanh thu', 'Đánh giá', 'Tốc độ bán', 'Tăng trưởng'];
  
  // Normalize data to 0-100 scale for better visualization
  const normalizeValue = (value, max) => Math.min((value / max) * 100, 100);
  
  const maxPrice = Math.max(book1?.price || 0, book2?.price || avgData?.averagePrice || 0) || 100000;
  const maxSold = Math.max(book1?.totalSold || 0, book2?.totalSold || avgData?.averageSold || 0) || 100;
  const maxRevenue = Math.max(book1?.totalRevenue || 0, book2?.totalRevenue || avgData?.averageRevenue || 0) || 1000000;
  
  const book1Data = [
    normalizeValue(book1?.price || 0, maxPrice),
    normalizeValue(book1?.totalSold || 0, maxSold),
    normalizeValue(book1?.totalRevenue || 0, maxRevenue),
    (book1?.averageRating || 0) * 20, // Rating từ 0-5 => 0-100
    Math.min((book1?.salesVelocity || 0) * 20, 100),
    Math.min(Math.abs(book1?.growthRate || 0), 100)
  ];
  
  const datasets = [{
    label: book1?.bookName || 'Sách 1',
    data: book1Data,
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 2,
    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
  }];
  
  if (book2) {
    const book2Data = [
      normalizeValue(book2.price || 0, maxPrice),
      normalizeValue(book2.totalSold || 0, maxSold),
      normalizeValue(book2.totalRevenue || 0, maxRevenue),
      (book2.averageRating || 0) * 20,
      Math.min((book2.salesVelocity || 0) * 20, 100),
      Math.min(Math.abs(book2.growthRate || 0), 100)
    ];
    
    datasets.push({
      label: book2.bookName,
      data: book2Data,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
    });
  } else if (avgData) {
    const avgDataPoints = [
      normalizeValue(avgData.averagePrice || 0, maxPrice),
      normalizeValue(avgData.averageSold || 0, maxSold),
      normalizeValue(avgData.averageRevenue || 0, maxRevenue),
      (avgData.averageRating || 0) * 20,
      Math.min((avgData.averageVelocity || 0) * 20, 100),
      Math.min(Math.abs(avgData.averageGrowthRate || 0), 100)
    ];
    
    datasets.push({
      label: 'Trung bình tất cả',
      data: avgDataPoints,
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(255, 206, 86, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 206, 86, 1)'
    });
  }
  
  chartInstance.value = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'So sánh hiệu suất sách (Normalized to 0-100)',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: 'rgba(200, 200, 200, 0.3)'
          },
          pointLabels: {
            font: {
              size: 12,
              weight: 'bold'
            }
          },
          ticks: {
            display: false
          }
        }
      },
      elements: {
        line: {
          borderWidth: 3
        }
      }
    }
  });
};

const resetComparison = () => {
  selectedBook1.value = null;
  selectedBook2.value = null;
  book1Search.value = '';
  book2Search.value = '';
  book1Results.value = [];
  book2Results.value = [];
  comparisonData.value = null;
  error.value = null;
  
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
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

// Cleanup
onUnmounted(() => {
  if (book1SearchTimeout) clearTimeout(book1SearchTimeout);
  if (book2SearchTimeout) clearTimeout(book2SearchTimeout);
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});

// Expose methods
defineExpose({
  resetComparison
});
</script>

<style scoped>
.book-comparison-chart {
  margin-bottom: 1.5rem;
}

.chart-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
}

.card-title {
  color: #2d3748;
  font-weight: 600;
}

/* Search Container */
.search-container {
  position: relative;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.search-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f3f4;
}

.search-item:hover {
  background: #f8faff;
}

.search-item:last-child {
  border-bottom: none;
}

.book-info strong {
  color: #2d3748;
}

/* Selected Books */
.selected-book {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Comparison Type Info */
.comparison-type-info .alert {
  border-radius: 12px;
  border: none;
  padding: 16px;
  margin-bottom: 0;
}

/* Chart Container */
.chart-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Metrics Panel */
.metrics-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
}

.metrics-title {
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

/* Winner Box */
.winner-box {
  background: linear-gradient(135deg, #ffd700, #ffed4a);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  color: #2d3748;
}

.winner-badge {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.winner-name {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.winner-reason {
  margin-bottom: 8px;
}

.winner-diff {
  font-size: 0.9rem;
  font-weight: 600;
}

/* Book Metrics */
.book-metrics {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.book-header {
  padding: 12px 16px;
  font-weight: 600;
  font-size: 0.95rem;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #f1f3f4;
  font-size: 0.9rem;
}

.metric-item:last-child {
  border-bottom: none;
}

.metric-item span:first-child {
  color: #718096;
  font-weight: 500;
}

/* Badge Colors */
.bg-orange {
  background-color: #fd7e14 !important;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .metrics-panel {
    margin-top: 20px;
  }
  
  .chart-container {
    height: 300px !important;
  }
  
  .search-dropdown {
    max-height: 200px;
  }
}
</style>
