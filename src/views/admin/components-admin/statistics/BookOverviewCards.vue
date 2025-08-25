<template>
  <div class="book-overview-cards">
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

    <!-- Statistics Cards - Theo API mới -->
    <div v-else class="row g-3">
      <!-- Total Books Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card books-card fancy-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper books-icon gradient-border">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="8" fill="#4F8A8B"/>
                  <path d="M6 19V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 19h12" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                  <path d="M9 10h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="text-end">
                <div class="stat-value text-gradient-primary stat-animated">
                  <AnimatedCounter :value="data?.totalBooks || 0" />
                </div>
                <div class="stat-label">Tổng số sách</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-muted">
                Có sẵn: <strong class="text-success">{{ data?.totalBooksInStock || 0 }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Status Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card inventory-card fancy-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper inventory-icon gradient-border">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="8" fill="#F9B208"/>
                  <path d="M7 17V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 17h10" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                  <path d="M10 10h4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="text-end">
                <div class="stat-value text-gradient-warning stat-animated">
                  <AnimatedCounter :value="data?.totalBooksInStock || 0" />
                </div>
                <div class="stat-label">Còn hàng</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-warning">
                Hết hàng: <strong>{{ data?.totalOutOfStock || 0 }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Discount Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card discount-card fancy-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper discount-icon gradient-border">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="8" fill="#43C59E"/>
                  <path d="M8 16l8-8" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="9.5" cy="14.5" r="1.5" fill="#fff"/>
                  <circle cx="14.5" cy="9.5" r="1.5" fill="#fff"/>
                </svg>
              </div>
              <div class="text-end">
                <div class="stat-value text-gradient-success stat-animated">
                  <AnimatedCounter :value="data?.totalBooksWithDiscount || 0" />
                </div>
                <div class="stat-label">Đang giảm giá</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-success">
                Khuyến mãi hiện tại
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Flash Sale Card -->
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card stats-card flash-sale-card fancy-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="icon-wrapper flash-sale-icon gradient-border">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="8" fill="#F76E11"/>
                  <path d="M13 2L3 14h9l-1 8L21 10h-8l1-8z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="text-end">
                <div class="stat-value text-gradient-danger stat-animated">
                  <AnimatedCounter :value="data?.totalBooksInFlashSale || 0" />
                </div>
                <div class="stat-label">Flash Sale</div>
              </div>
            </div>
            <div class="stat-footer">
              <small class="text-danger">
                Đang trong chương trình
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Insights Row - Đã loại bỏ do API mới không cung cấp -->
    <!-- API mới chỉ cung cấp 5 metrics cơ bản: totalBooks, totalBooksInStock, totalOutOfStock, totalBooksWithDiscount, totalBooksInFlashSale -->
    <div v-if="!loading && data" class="row g-3 mt-2">
      <!-- Stock Analysis Card -->
      <div class="col-lg-8">
        <div class="card insights-card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-graph-up me-2 text-primary"></i>
              Phân tích kho hàng
            </h6>
            <div class="row g-3">
              <div class="col-md-4">
                <div class="insight-item">
                  <div class="insight-value text-primary">{{ data?.totalBooks || 0 }}</div>
                  <div class="insight-label">Tổng sách</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="insight-item">
                  <div class="insight-value text-success">{{ stockPercentage }}%</div>
                  <div class="insight-label">% Còn hàng</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="insight-item">
                  <div class="insight-value text-warning">{{ outOfStockPercentage }}%</div>
                  <div class="insight-label">% Hết hàng</div>
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
import { ref, onMounted, computed, defineComponent, watch } from 'vue';
import axios from '@/utils/axios';

// AnimatedCounter component
const AnimatedCounter = defineComponent({
  name: 'AnimatedCounter',
  props: {
    value: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      default: 900 // ms
    }
  },
  setup(props) {
    const display = ref(props.value);
    let frame;
    let start;
    let from = props.value;
    let to = props.value;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / props.duration, 1);
      display.value = Math.floor(from + (to - from) * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        display.value = to;
      }
    };

    watch(() => props.value, (newVal, oldVal) => {
      from = display.value;
      to = newVal;
      start = null;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(animate);
    });

    return () => display.value.toLocaleString();
  }
});

// Data
const data = ref(null);
const loading = ref(true);
const error = ref(null);

// API call - Sử dụng axios thay vì fetch để fix lỗi 304
const fetchOverviewData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    console.log('📡 Calling API: /api/books/stats/overview');
    const response = await axios.get('/api/books/stats/overview');
    
    if (response.data && response.data.status === 200) {
      data.value = response.data.data;
      console.log('✅ Book overview data loaded:', data.value);
    } else {
      throw new Error(response.data?.message || 'Failed to fetch data');
    }
  } catch (err) {
    console.error('❌ Lỗi khi tải thống kê tổng quan sách:', err);
    error.value = err.response?.data?.message || err.message || 'Không thể tải dữ liệu thống kê';
  } finally {
    loading.value = false;
  }
};

// Computed properties for percentages
const stockPercentage = computed(() => {
  if (!data.value || !data.value.totalBooks) return 0;
  return Math.round((data.value.totalBooksInStock / data.value.totalBooks) * 100);
});

const outOfStockPercentage = computed(() => {
  if (!data.value || !data.value.totalBooks) return 0;
  return Math.round((data.value.totalOutOfStock / data.value.totalBooks) * 100);
});

const promotionPercentage = computed(() => {
  if (!data.value || !data.value.totalBooks) return 0;
  const totalPromotion = (data.value.totalBooksWithDiscount || 0) + (data.value.totalBooksInFlashSale || 0);
  return Math.round((totalPromotion / data.value.totalBooks) * 100);
});

// Lifecycle
onMounted(() => {
  fetchOverviewData();
});

// Expose methods to parent
defineExpose({
  fetchOverviewData
});
</script>

<style scoped>
@import '@/assets/css/gradient-stats.css';

.book-overview-cards {
  margin-bottom: 1.5rem;
}

/* Stats Cards */
.stats-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.stats-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--card-gradient-start), var(--card-gradient-end));
}

/* Icon Wrappers */
.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.stat-label {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 500;
  margin-top: 4px;
}

.stat-footer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
}

/* Insights Card */
.insights-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
}

.insights-card .card-title {
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 1rem;
}

.insight-item {
  text-align: center;
  padding: 12px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.insight-value {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.insight-label {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
}

/* Quick Stats Card */
.quick-stats-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #fff5e6 0%, #ffffff 100%);
}

.quick-stats-card .card-title {
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 1rem;
}

.quick-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
}

.quick-stat-item:last-child {
  border-bottom: none;
}

.quick-stat-item .label {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 500;
}

.quick-stat-item .value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
}

/* Loading Card */
.loading-card {
  background: linear-gradient(135deg, #f7fafc 0%, #ffffff 100%);
  border: 1px solid #e2e8f0;
}

.placeholder {
  background: linear-gradient(90deg, #e2e8f0 25%, #f7fafc 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: loading-shimmer 2s ease-in-out infinite;
  border-radius: 4px;
  height: 1em;
}

@keyframes loading-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Responsive Adjustments */
@media (max-width: 1200px) {
  .stat-value-gradient {
    font-size: 1.5rem;
  }
  
  .icon-wrapper {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .stat-value-gradient {
    font-size: 1.3rem;
  }
  
  .col-xl-3 {
    margin-bottom: 1rem;
  }
  
  .insight-item {
    margin-bottom: 1rem;
  }
  
  .insight-value {
    font-size: 1.1rem;
  }
}
</style>
