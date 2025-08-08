<template>
  <div class="location-stats-container">
    <div class="card location-card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
          <i class="bi bi-geo-alt me-2 text-success"></i>
          Thống Kê Theo Địa Điểm
        </h5>
        <div class="location-controls">
          <select 
            class="form-select form-select-sm"
            v-model="selectedPeriod"
            @change="onPeriodChange"
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
          </select>
        </div>
      </div>
      
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="location-loading">
          <div class="row">
            <div class="col-lg-8">
              <div class="map-skeleton"></div>
            </div>
            <div class="col-lg-4">
              <div class="table-skeleton"></div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div v-else-if="locationData && locationData.length > 0" class="location-content">
          <div class="row g-3">
            <!-- Vietnam Map Column -->
            <div class="col-12 col-xl-7">
              <div class="map-container">
                <div class="map-header mb-3">
                  <h6 class="map-title">Bản đồ phân bố đơn hàng</h6>
                  <div class="color-legend">
                    <span class="legend-label">Cường độ:</span>
                    <div class="color-scale">
                      <div class="color-item">
                        <div class="color-box" style="background: #e8f5e8;"></div>
                        <span>Thấp</span>
                      </div>
                      <div class="color-item">
                        <div class="color-box" style="background: #a8d8a8;"></div>
                        <span>TB</span>
                      </div>
                      <div class="color-item">
                        <div class="color-box" style="background: #4CAF50;"></div>
                        <span>Cao</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Vietnam SVG Map -->
                <div class="vietnam-map" ref="mapContainer">
                  <svg viewBox="0 0 400 500" class="map-svg">
                    <!-- Simplified Vietnam provinces - You can replace with actual SVG paths -->
                    <g v-for="province in locationData" :key="province.provinceName">
                      <rect 
                        :x="getProvincePosition(province.provinceName).x" 
                        :y="getProvincePosition(province.provinceName).y"
                        :width="getProvinceSize(province.intensity).width"
                        :height="getProvinceSize(province.intensity).height"
                        :fill="getIntensityColor(province.intensity)"
                        :stroke="'#fff'"
                        :stroke-width="2"
                        class="province-rect"
                        @click="selectProvince(province)"
                        @mouseenter="showTooltip($event, province)"
                        @mouseleave="hideTooltip"
                      />
                      <text 
                        :x="getProvincePosition(province.provinceName).x + 15" 
                        :y="getProvincePosition(province.provinceName).y + 15"
                        class="province-label"
                        font-size="10"
                        fill="#333"
                      >
                        {{ getProvinceShortName(province.provinceName) }}
                      </text>
                    </g>
                  </svg>
                  
                  <!-- Map Tooltip -->
                  <div 
                    v-if="tooltip.show"
                    ref="tooltipEl"
                    class="map-tooltip"
                    :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
                  >
                    <div class="tooltip-title">{{ tooltip.data?.provinceName }}</div>
                    <div class="tooltip-content">
                      <div class="tooltip-row">
                        <span>Đơn hàng:</span>
                        <strong>{{ tooltip.data?.orderCount || 0 }}</strong>
                      </div>
                      <div class="tooltip-row">
                        <span>Doanh thu:</span>
                        <strong>{{ formatCurrency(tooltip.data?.totalAmount) }}</strong>
                      </div>
                      <div class="tooltip-row">
                        <span>Tỷ lệ:</span>
                        <strong>{{ tooltip.data?.percentage?.toFixed(1) }}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Provinces Table Column -->
            <div class="col-12 col-xl-5">
              <div class="provinces-table-container">
                <h6 class="table-title mb-3">Top tỉnh/thành</h6>
                
                <div class="provinces-list">
                  <div 
                    v-for="(province, index) in sortedProvinces" 
                    :key="province.provinceName"
                    class="province-item"
                    :class="{ 'selected': selectedProvince?.provinceName === province.provinceName }"
                    @click="selectProvince(province)"
                  >
                    <div class="province-rank">
                      <span class="rank-number" :class="getRankClass(index)">
                        {{ index + 1 }}
                      </span>
                    </div>
                    
                    <div class="province-info flex-grow-1">
                      <div class="province-name">{{ province.provinceName }}</div>
                      <div class="province-stats">
                        <span class="stat-item">
                          <i class="bi bi-box text-muted"></i>
                          {{ province.orderCount }} đơn
                        </span>
                        <span class="stat-item">
                          <i class="bi bi-percent text-muted"></i>
                          {{ province.percentage?.toFixed(1) }}%
                        </span>
                      </div>
                    </div>
                    
                    <div class="province-revenue">
                      <div class="revenue-amount">{{ formatCurrency(province.totalAmount) }}</div>
                      <div class="intensity-indicator" :style="{ backgroundColor: getIntensityColor(province.intensity) }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Province Details -->
          <div v-if="selectedProvince" class="province-details mt-4">
            <div class="details-card">
              <div class="details-header">
                <h6 class="details-title">
                  <i class="bi bi-info-circle me-2"></i>
                  Chi tiết {{ selectedProvince.provinceName }}
                </h6>
                <button class="btn btn-sm btn-outline-secondary" @click="selectedProvince = null">
                  <i class="bi bi-x"></i>
                </button>
              </div>
              <div class="details-content">
                <div class="row g-3">
                  <div class="col-md-3">
                    <div class="detail-stat">
                      <div class="stat-value">{{ selectedProvince.orderCount }}</div>
                      <div class="stat-label">Tổng đơn hàng</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="detail-stat">
                      <div class="stat-value">{{ formatCurrency(selectedProvince.totalAmount) }}</div>
                      <div class="stat-label">Tổng doanh thu</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="detail-stat">
                      <div class="stat-value">{{ selectedProvince.percentage?.toFixed(1) }}%</div>
                      <div class="stat-label">Tỷ lệ đóng góp</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="detail-stat">
                      <div class="stat-value">{{ formatCurrency(selectedProvince.totalAmount / selectedProvince.orderCount) }}</div>
                      <div class="stat-label">Giá trị TB/đơn</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state text-center py-4">
          <i class="bi bi-geo display-4 text-muted mb-3"></i>
          <h5 class="text-muted">Không có dữ liệu địa điểm</h5>
          <p class="text-muted">
            <span v-if="loading">Đang tải dữ liệu...</span>
            <span v-else>Chưa có đơn hàng nào từ các tỉnh/thành trong khoảng thời gian này hoặc dữ liệu địa chỉ chưa được cập nhật đầy đủ.</span>
          </p>
          <button 
            class="btn btn-outline-primary btn-sm"
            @click="fetchLocationData"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-arrow-clockwise me-2"></i>
            Thử lại
          </button>
        </div>
      </div>

      <!-- Summary Footer -->
      <div v-if="!loading && totalOrders > 0" class="card-footer">
        <div class="row text-center">
          <div class="col-3">
            <div class="footer-stat">
              <div class="stat-value">{{ locationData.length }}</div>
              <div class="stat-label">Tỉnh/Thành</div>
            </div>
          </div>
          <div class="col-3">
            <div class="footer-stat">
              <div class="stat-value">{{ totalOrders }}</div>
              <div class="stat-label">Tổng đơn hàng</div>
            </div>
          </div>
          <div class="col-3">
            <div class="footer-stat">
              <div class="stat-value">{{ formatCurrency(totalAmount) }}</div>
              <div class="stat-label">Tổng doanh thu</div>
            </div>
          </div>
          <div class="col-3">
            <div class="footer-stat">
              <div class="stat-value">{{ topProvince?.provinceName || 'N/A' }}</div>
              <div class="stat-label">Thị trường mạnh nhất</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getLocationStatistics, formatCurrency } from '@/services/admin/statistics';
import Swal from 'sweetalert2';

const loading = ref(true);
const selectedPeriod = ref('week');
const locationData = ref([]);
const selectedProvince = ref(null);
const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  data: null
});

const sortedProvinces = computed(() => {
  return [...locationData.value].sort((a, b) => b.orderCount - a.orderCount);
});

const totalOrders = computed(() => {
  return locationData.value.reduce((sum, province) => sum + province.orderCount, 0);
});

const totalAmount = computed(() => {
  return locationData.value.reduce((sum, province) => sum + province.totalAmount, 0);
});

const topProvince = computed(() => {
  return sortedProvinces.value[0];
});

const fetchLocationData = async () => {
  console.log('LocationStats: Fetching location data for period:', selectedPeriod.value);
  loading.value = true;
  try {
    const response = await getLocationStatistics(selectedPeriod.value);
    console.log('🔍 LocationStats API Response:', response);
    
    if (response && response.data && response.data.provinces) {
      // Lọc và xử lý dữ liệu - loại bỏ provinces có tên null/undefined
      const validProvinces = response.data.provinces
        .filter(province => province.provinceName && province.provinceName.trim() !== '')
        .map(province => ({
          ...province,
          // Đảm bảo các giá trị số hợp lệ
          orderCount: province.orderCount || 0,
          totalAmount: province.totalAmount || 0,
          percentage: province.percentage || 0,
          intensity: Math.max(0, Math.min(1, province.intensity || 0)) // Giới hạn 0-1
        }));
      
      locationData.value = validProvinces;
      console.log('📊 Processed location data:', validProvinces);
    } else {
      console.warn('❌ Invalid response structure:', response);
      locationData.value = [];
    }
  } catch (error) {
    console.error('❌ Error fetching location statistics:', error);
    locationData.value = [];
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải dữ liệu thống kê địa điểm',
      icon: 'error',
      timer: 3000,
      showConfirmButton: false
    });
  } finally {
    loading.value = false;
  }
};

const getIntensityColor = (intensity) => {
  const colors = [
    '#e8f5e8', // 0.0-0.2 - Very light green
    '#c8e6c8', // 0.2-0.4 - Light green  
    '#a8d8a8', // 0.4-0.6 - Medium green
    '#6bbf6b', // 0.6-0.8 - Dark green
    '#4CAF50', // 0.8-1.0 - Very dark green
  ];
  
  const index = Math.min(Math.floor(intensity * 5), 4);
  return colors[index];
};

const getProvincePosition = (provinceName) => {
  if (!provinceName) return { x: 200, y: 300 };
  
  // Simplified positioning - In real implementation, use actual coordinates
  const positions = {
    'Hồ Chí Minh': { x: 200, y: 400 },
    'Thành phố Hồ Chí Minh': { x: 200, y: 400 },
    'TP Hồ Chí Minh': { x: 200, y: 400 },
    'Hà Nội': { x: 180, y: 150 },
    'Thành phố Hà Nội': { x: 180, y: 150 },
    'Đà Nẵng': { x: 220, y: 250 },
    'Thành phố Đà Nẵng': { x: 220, y: 250 },
    'Cần Thơ': { x: 180, y: 420 },
    'Thành phố Cần Thơ': { x: 180, y: 420 },
    'Hải Phòng': { x: 200, y: 130 },
    'Thành phố Hải Phòng': { x: 200, y: 130 },
    'Bình Dương': { x: 210, y: 390 },
    'Tỉnh Bình Dương': { x: 210, y: 390 },
    'Đồng Nai': { x: 230, y: 400 },
    'Tỉnh Đồng Nai': { x: 230, y: 400 },
    'Khánh Hòa': { x: 260, y: 320 },
    'Tỉnh Khánh Hòa': { x: 260, y: 320 },
    'Lâm Đồng': { x: 220, y: 350 },
    'Tỉnh Lâm Đồng': { x: 220, y: 350 },
    'Thừa Thiên Huế': { x: 200, y: 220 },
    'Tỉnh Thừa Thiên Huế': { x: 200, y: 220 },
    'Cao Bằng': { x: 160, y: 80 },
    'Tỉnh Cao Bằng': { x: 160, y: 80 },
    'An Giang': { x: 160, y: 430 },
    'Tỉnh An Giang': { x: 160, y: 430 },
    'Bà Rịa - Vũng Tàu': { x: 240, y: 410 },
    'Tỉnh Bà Rịa - Vũng Tàu': { x: 240, y: 410 },
  };
  return positions[provinceName] || { x: 200, y: 300 };
};

const getProvinceSize = (intensity) => {
  const baseSize = 20;
  const size = baseSize + (intensity * 15);
  return { width: size, height: size };
};

const getProvinceShortName = (provinceName) => {
  if (!provinceName) return 'N/A';
  
  const shortNames = {
    'Hồ Chí Minh': 'HCM',
    'Thành phố Hồ Chí Minh': 'HCM',
    'TP Hồ Chí Minh': 'HCM',
    'Hà Nội': 'HN',
    'Thành phố Hà Nội': 'HN',
    'Đà Nẵng': 'ĐN',
    'Thành phố Đà Nẵng': 'ĐN',
    'Cần Thơ': 'CT',
    'Thành phố Cần Thơ': 'CT',
    'Hải Phòng': 'HP',
    'Thành phố Hải Phòng': 'HP',
    'Bình Dương': 'BD',
    'Tỉnh Bình Dương': 'BD',
    'Đồng Nai': 'ĐN',
    'Tỉnh Đồng Nai': 'ĐN',
    'Khánh Hòa': 'KH',
    'Tỉnh Khánh Hòa': 'KH',
    'Lâm Đồng': 'LĐ',
    'Tỉnh Lâm Đồng': 'LĐ',
    'Thừa Thiên Huế': 'TTH',
    'Tỉnh Thừa Thiên Huế': 'TTH',
    'Cao Bằng': 'CB',
    'Tỉnh Cao Bằng': 'CB',
    'An Giang': 'AG',
    'Tỉnh An Giang': 'AG',
    'Bà Rịa - Vũng Tàu': 'BR-VT',
    'Tỉnh Bà Rịa - Vũng Tàu': 'BR-VT'
  };
  
  return shortNames[provinceName] || provinceName.substring(0, 3).toUpperCase();
};

const getRankClass = (index) => {
  switch (index) {
    case 0: return 'rank-first';
    case 1: return 'rank-second';  
    case 2: return 'rank-third';
    default: return 'rank-normal';
  }
};

const selectProvince = (province) => {
  selectedProvince.value = selectedProvince.value?.provinceName === province.provinceName 
    ? null 
    : province;
};

const showTooltip = (event, province) => {
  tooltip.value = {
    show: true,
    x: event.clientX + 10,
    y: event.clientY - 10,
    data: province
  };
};

const hideTooltip = () => {
  tooltip.value.show = false;
};

let isUpdating = false;
let fetchTimeout = null;

const onPeriodChange = async () => {
  if (isUpdating) {
    console.log('LocationStats: Already updating, skipping...');
    return;
  }
  
  console.log('LocationStats: Period changed to:', selectedPeriod.value);
  isUpdating = true;
  
  // Clear previous timeout
  if (fetchTimeout) {
    clearTimeout(fetchTimeout);
  }
  
  // Debounce API calls
  return new Promise((resolve) => {
    fetchTimeout = setTimeout(async () => {
      try {
        selectedProvince.value = null;
        await fetchLocationData();
      } finally {
        isUpdating = false;
        resolve();
      }
    }, 300);
  });
};

onMounted(() => {
  fetchLocationData();
});
</script>

<style scoped>
.location-stats-container {
  margin-bottom: 2rem;
}

.location-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border-bottom: none;
  padding: 1.25rem 1.5rem;
}

.card-title {
  font-weight: 600;
}

.location-controls .form-select {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 0.875rem;
}

.location-controls .form-select:focus {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

.location-controls .form-select option {
  background-color: #fff;
  color: #333;
}

.location-content {
  padding: 1rem 0;
}

.map-container {
  background: linear-gradient(135deg, #f8fffe 0%, #f0fff4 100%);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2f8f2;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.map-title {
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.color-legend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.color-scale {
  display: flex;
  gap: 0.5rem;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #718096;
}

.color-box {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid #ccc;
}

.vietnam-map {
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  min-height: 300px;
}

.map-svg {
  width: 100%;
  height: auto;
  max-height: 350px;
}

.province-rect {
  cursor: pointer;
  transition: all 0.3s ease;
}

.province-rect:hover {
  stroke-width: 3;
  opacity: 0.8;
}

.province-label {
  pointer-events: none;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.map-tooltip {
  position: fixed;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  pointer-events: none;
  min-width: 180px;
}

.tooltip-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.tooltip-content .tooltip-row {
  display: flex;
  justify-content: space-between;
  margin: 0.25rem 0;
  font-size: 0.875rem;
}

.provinces-table-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  height: fit-content;
}

.table-title {
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1rem 0;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.provinces-list {
  max-height: 400px;
  overflow-y: auto;
}

.province-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.province-item:hover {
  border-color: #43e97b;
  box-shadow: 0 2px 10px rgba(67, 233, 123, 0.15);
  transform: translateY(-1px);
}

.province-item.selected {
  border-color: #43e97b;
  background: linear-gradient(135deg, #f0fff4 0%, #ecfdf5 100%);
}

.province-rank {
  margin-right: 0.75rem;
}

.rank-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.rank-first {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #744210;
}

.rank-second {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  color: #4a5568;
}

.rank-third {
  background: linear-gradient(135deg, #cd7f32 0%, #dfa55a 100%);
  color: #744210;
}

.rank-normal {
  background: #e2e8f0;
  color: #4a5568;
}

.province-info {
  min-width: 0;
}

.province-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.province-stats {
  display: flex;
  gap: 0.75rem;
}

.stat-item {
  font-size: 0.75rem;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.province-revenue {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.revenue-amount {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.intensity-indicator {
  width: 30px;
  height: 4px;
  border-radius: 2px;
}

.province-details {
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.details-card {
  background: linear-gradient(135deg, #f0fff4 0%, #ecfdf5 100%);
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  overflow: hidden;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(67, 233, 123, 0.1);
  border-bottom: 1px solid #a7f3d0;
}

.details-title {
  font-weight: 600;
  color: #065f46;
  margin: 0;
}

.details-content {
  padding: 1.5rem;
}

.detail-stat {
  text-align: center;
}

.detail-stat .stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.25rem;
}

.detail-stat .stat-label {
  font-size: 0.75rem;
  color: #047857;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-footer {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-top: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
}

.footer-stat .stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.footer-stat .stat-label {
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.location-loading {
  padding: 2rem 0;
}

.map-skeleton,
.table-skeleton {
  background: #f8f9fa;
  border-radius: 12px;
  height: 350px;
}

.empty-state {
  padding: 3rem 1rem;
}

/* Scrollbar Styling */
.provinces-list::-webkit-scrollbar {
  width: 4px;
}

.provinces-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.provinces-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.provinces-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .location-content .row {
    flex-direction: column;
  }
  
  .provinces-table-container {
    margin-top: 1rem;
  }
}

@media (max-width: 992px) {
  .provinces-table-container {
    max-height: none;
  }
  
  .provinces-list {
    max-height: 300px;
  }
  
  .map-container {
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .location-controls {
    margin-top: 0.75rem;
    width: 100%;
  }
  
  .location-controls .form-select {
    width: 100%;
  }
  
  .map-container,
  .provinces-table-container {
    padding: 1rem;
  }
  
  .map-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .color-scale {
    flex-wrap: wrap;
  }
  
  .province-stats {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .province-item {
    flex-wrap: wrap;
  }
  
  .province-revenue {
    margin-top: 0.5rem;
    align-items: flex-start;
  }
}

/* Animation */
.location-card {
  animation: slideInLeft 0.6s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.province-item {
  animation: fadeInUp 0.6s ease-out;
}

.province-item:nth-child(1) { animation-delay: 0.1s; }
.province-item:nth-child(2) { animation-delay: 0.2s; }
.province-item:nth-child(3) { animation-delay: 0.3s; }
.province-item:nth-child(4) { animation-delay: 0.4s; }
.province-item:nth-child(5) { animation-delay: 0.5s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
