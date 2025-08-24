<template>
  <!--  Book Statistics Details Popup -->
  <div 
    v-if="show" 
    class="book-stats-popup-overlay" 
    @click="closePopup"
  >
    <div 
      class="book-stats-popup" 
      :style="popupStyle"
      @click.stop
    >
      <!-- Header -->
      <div class="popup-header">
        <div class="popup-title">
          <i class="bi bi-calendar-event me-2"></i>
          <span>{{ formattedSelectedDate }}</span>
        </div>
        <div class="popup-controls">
         
          
          <button 
            type="button" 
            class="btn-close btn-close-white" 
            @click="closePopup"
          ></button>
        </div>
      </div>

      <!-- Body -->
      <div class="popup-body">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải chi tiết...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
        </div>

        <!-- Data State -->
        <div v-else-if="detailsData && detailsData.length > 0">
          <!-- Summary Stats Row -->
          <div class="row mb-4">
            <div class="col-md-4">
              <div class="summary-stat bg-primary">
                <i class="bi bi-graph-up-arrow"></i>
                <div class="stat-info">
                  <h6>Tổng doanh thu</h6>
            <h4 :title="`Tổng doanh thu: ${totalRevenue.toLocaleString()} VND`">{{ formatCurrency(totalRevenue) }}</h4>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="summary-stat bg-success">
                <i class="bi bi-bag-check"></i>
                <div class="stat-info">
                  <h6>Tổng số bán</h6>
            <h4 :title="`Tổng số bán: ${totalQuantitySold.toLocaleString()} cuốn`">{{ totalQuantitySold }}</h4>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="summary-stat bg-info">
                <i class="bi bi-collection"></i>
                <div class="stat-info">
                  <h6>Số loại sách</h6>
                  <h4>{{ detailsData.length }}</h4>
                </div>
              </div>
            </div>
          </div>

          <!-- Books List -->
          <div class="books-list">
            <h6 class="list-title">
              <i class="bi bi-list-ul me-2"></i>
              Chi tiết từng sách
            </h6>
            
            <div class="books-container">
              <div 
                v-for="(book, index) in detailsData" 
                :key="book.code"
                class="book-item"
              >
                <!-- Rank Badge -->
                <div class="rank-badge" :class="getRankBadgeClass(index + 1)">
                  #{{ index + 1 }}
                </div>

                <!-- Book Info -->
                <div class="book-info">
                  <div class="book-header">
                    <h6 class="book-name" :title="book.title">
                      {{ book.title }}
                    </h6>
                    <span class="book-code">{{ book.bookCode }}</span>
                  </div>
                  
                  <div class="book-meta">
                    <span class="isbn" v-if="book.isbn">
                      <i class="bi bi-upc-scan me-1"></i>
                      ISBN: {{ book.isbn }}
                    </span>
                    <span class="price">
                      <i class="bi bi-tag me-1"></i>
                      {{ formatCurrency(book.currentPrice) }}
                    </span>
                  </div>
                </div>

                <!-- Stats -->
                <div class="book-stats">
                  <!-- Revenue -->
                  <div class="stat-item">
                    <div class="stat-label">Doanh thu</div>
                    <div class="stat-value">
                      {{ formatCurrency(book.revenue) }}
                    </div>
                    <div class="stat-growth" v-if="book.revenueGrowthPercent !== undefined || book.revenueGrowthLabel">
                      <!-- Trường hợp có tăng trưởng % -->
                      <span 
                        v-if="book.revenueGrowthPercent !== null"
                        class="growth-badge"
                        :class="getGrowthClass(book.revenueGrowthPercent)"
                      >
                        <i :class="getGrowthIcon(book.revenueGrowthPercent)"></i>
                        {{ Math.abs(book.revenueGrowthPercent).toFixed(1) }}%
                      </span>
                      <!-- Trường hợp "Tăng mới" -->
                      <span 
                        v-else-if="book.revenueGrowthLabel"
                        class="growth-badge growth-new"
                      >
                        <i class="bi bi-plus-circle"></i>
                        {{ book.revenueGrowthLabel }}
                      </span>
                      <span class="growth-value" v-if="book.revenueGrowthValue">
                        ({{ formatCurrency(book.revenueGrowthValue) }})
                      </span>
                    </div>
                  </div>

                  <!-- Quantity -->
                  <div class="stat-item">
                    <div class="stat-label">Số lượng bán</div>
                    <div class="stat-value">
                      {{ book.totalQuantity }} cuốn
                    </div>
                     
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Data State -->
        <div v-else class="text-center py-4">
          <i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
          <h6 class="text-muted mt-2">Không có dữ liệu</h6>
          <p class="text-muted">Không tìm thấy thông tin sách cho ngày này</p>
        </div>
      </div>
 
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { getBookStatsDetails, formatCurrency } from '@/services/admin/bookStatistics';

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  selectedDate: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  period: {
    type: String, // day/week/month/year
    required: true
  },
  mousePosition: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
});

// Emits
const emit = defineEmits(['close', 'limitChange']);

// Reactive data
const detailsData = ref([]);
const loading = ref(false);
const error = ref('');
const selectedLimit = ref(10);

// Computed
const formattedSelectedDate = computed(() => {
  if (!props.selectedDate) return '';
  
  const date = new Date(props.selectedDate);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('vi-VN', options);
});

const totalRevenue = computed(() => {
  return detailsData.value.reduce((sum, book) => sum + (book.revenue || 0), 0);
});

const totalQuantitySold = computed(() => {
  return detailsData.value.reduce((sum, book) => sum + (book.totalQuantity || 0), 0);
});

const popupStyle = computed(() => {
  // Positioning based on mouse click
  const { x, y } = props.mousePosition;
  
  // Ensure popup doesn't go off screen
  const maxWidth = window.innerWidth - 50;
  const maxHeight = window.innerHeight - 50;
  
  let left = x + 20;
  let top = y + 20;
  
  // Adjust if going off right edge
  if (left + 600 > maxWidth) {
    left = x - 620;
  }
  
  // Adjust if going off bottom edge
  if (top + 600 > maxHeight) {
    top = y - 620;
  }
  
  // Ensure minimum positioning
  left = Math.max(25, left);
  top = Math.max(25, top);
  
  return {
    left: `${left}px`,
    top: `${top}px`
  };
});

// Methods
const fetchDetails = async () => {
  if (!props.selectedDate || !props.period) return;
  
  try {
    loading.value = true;
    error.value = '';
    
    console.log('📊 Fetching book statistics details:', {
      period: props.period,
      date: props.selectedDate,
      limit: selectedLimit.value
    });
    
    const response = await getBookStatsDetails(props.period, props.selectedDate, selectedLimit.value);
    
    if (response && response.status === 200 && response.data) {
      detailsData.value = response.data;
      console.log('✅ Details data loaded:', detailsData.value);
    } else {
      throw new Error(response.message || 'Failed to fetch details');
    }
  } catch (err) {
    console.error('❌ Error fetching details:', err);
    error.value = err.response?.data?.message || err.message || 'Không thể tải chi tiết thống kê';
    detailsData.value = [];
  } finally {
    loading.value = false;
  }
};

const closePopup = () => {
  emit('close');
};

const onLimitChange = () => {
  emit('limitChange', selectedLimit.value);
  fetchDetails();
};

const getRankBadgeClass = (rank) => {
  if (rank === 1) return 'rank-gold';
  if (rank === 2) return 'rank-silver';
  if (rank === 3) return 'rank-bronze';
  return 'rank-default';
};

const getGrowthClass = (percent) => {
  if (percent > 0) return 'growth-positive';
  if (percent < 0) return 'growth-negative';
  return 'growth-neutral';
};

const getGrowthIcon = (percent) => {
  if (percent > 0) return 'bi bi-arrow-up';
  if (percent < 0) return 'bi bi-arrow-down';
  return 'bi bi-dash';
};


// Watchers
watch(() => props.show, (newShow) => {
  if (newShow) {
    fetchDetails();
  } else {
    // Reset data when closing
    detailsData.value = [];
    error.value = '';
  }
});

watch(() => [props.selectedDate, props.period], () => {
  if (props.show) {
    fetchDetails();
  }
});
</script>

<style scoped>
.book-stats-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.book-stats-popup {
  position: absolute;
  width: 600px;
  max-width: calc(100vw - 50px);
  max-height: calc(100vh - 50px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  animation: popupSlideIn 0.3s ease-out;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.popup-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-title {
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.popup-controls {
  display: flex;
  align-items: center;
}

.popup-controls .form-select {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.875rem;
  min-width: 120px;
}

.popup-controls .form-select:focus {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

.popup-body {
  padding: 1.25rem;
  max-height: 500px;
  overflow-y: auto;
}


/* --- Summary Stat Modern Gradient Card --- */
.summary-stat {
  background: linear-gradient(120deg, #6a93ff 0%, #a4e0ff 100%);
  color: #fff;
  padding: 0.8rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;
  box-shadow: 0 2px 12px 0 rgba(106,147,255,0.08), 0 1px 3px 0 rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
  transition: transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s;
}
.summary-stat.bg-success {
  background: linear-gradient(120deg, #43e97b 0%, #38f9d7 100%);
}
.summary-stat.bg-info {
  background: linear-gradient(120deg, #43c6ac 0%, #191654 100%);
}
.summary-stat:hover {
  transform: translateY(-3px) scale(1.025);
  box-shadow: 0 8px 32px 0 rgba(106,147,255,0.18), 0 3px 12px 0 rgba(0,0,0,0.08);
  z-index: 2;
}
.summary-stat i {
  font-size: 1.7rem;
  margin-right: 0.7rem;
  opacity: 1;
  background: rgba(255,255,255,0.18);
  border-radius: 50%;
  padding: 0.32rem 0.45rem;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.06);
  transition: background 0.2s;
}
.summary-stat:hover i {
  background: rgba(255,255,255,0.28);
}
.stat-info h6 {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.93;
  letter-spacing: 0.5px;
  font-weight: 500;
}
.stat-info h4 {
  
  margin: 0;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #fff 60%, #e0eaff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 1px 4px rgba(106,147,255,0.10);
}

.list-title {
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.books-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.books-container::-webkit-scrollbar {
  width: 6px;
}

.books-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.books-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.books-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.book-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  background: #fafbfc;
  transition: all 0.2s ease;
}

.book-item:hover {
  background: white;
  border-color: #cbd5e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.rank-badge {
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #744210;
}

.rank-silver {
  background: linear-gradient(135deg, #c0c0c0, #e5e7eb);
  color: #374151;
}

.rank-bronze {
  background: linear-gradient(135deg, #cd7f32, #d97706);
  color: white;
}

.rank-default {
  background: linear-gradient(135deg, #6b7280, #9ca3af);
  color: white;
}

.book-info {
  flex: 1;
  margin-right: 1rem;
}

.book-header {
  margin-bottom: 0.5rem;
}

.book-name {
  font-weight: 600;
  margin: 0;
  padding: 0.125rem 0.375rem;
  color: #2d3748;
  font-size: 0.95rem;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-code {
  font-size: 0.75rem;
  color: #718096;
  background: #edf2f7;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  
}

.book-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.book-meta span {
  font-size: 0.8rem;
  color: #718096;
}

.book-stats {
  flex-shrink: 0;
  text-align: right;
  min-width: 140px;
}

.stat-item {
  margin-bottom: 0.75rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.stat-growth {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.growth-badge {
  font-size: 0.7rem;
  padding: 0.125rem 0.375rem;
  border-radius: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.growth-positive {
  background: #d1fae5;
  color: #065f46;
}

.growth-negative {
  background: #fee2e2;
  color: #991b1b;
}

.growth-neutral {
  background: #e5e7eb;
  color: #374151;
}

.growth-new {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  animation: pulseGlow 2s infinite;
}

@keyframes pulseGlow {
  0%, 100% { 
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
  }
  50% { 
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
  }
}

.growth-value {
  font-size: 0.7rem;
  color: #9ca3af;
  font-weight: normal;
}

.popup-footer {
  background: #f8fafc;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .book-stats-popup {
    width: calc(100vw - 20px);
    left: 10px !important;
    top: 10px !important;
  }
  
  .book-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .book-stats {
    margin-top: 0.75rem;
    text-align: left;
    min-width: auto;
  }
  
  .popup-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .popup-controls .form-select {
    min-width: 100px;
  }
}
</style>
<style scoped>
.hover-tooltip {
  position: relative;
  cursor: pointer;
  color: #2eab00;
  transition: color 0.2s;
}
.hover-tooltip:hover, .hover-tooltip:focus {
  color: #2563eb;
}
</style>
