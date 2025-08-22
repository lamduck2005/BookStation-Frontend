<template>
  <div class="reward-card" :class="[`reward-${reward.type.toLowerCase()}`, { 'reward-available': isAvailable }]">
    <!-- Header với icon và tên thưởng -->
    <div class="reward-header">
      <div class="reward-icon">
        <i v-if="reward.type === 'VOUCHER'" class="fas fa-ticket-alt"></i>
        <i v-else-if="reward.type === 'POINTS'" class="fas fa-coins"></i>
      </div>
      <div class="reward-info">
        <h3 class="reward-name">{{ reward.name }}</h3>
        <p class="reward-description" v-if="reward.description">{{ reward.description }}</p>
      </div>
    </div>

    <!-- Thông tin giá trị -->
    <div class="reward-value">
      <span v-if="reward.type === 'VOUCHER'" class="value-text">
        {{ formatCurrency(reward.value) }}
      </span>
      <span v-else-if="reward.type === 'POINTS'" class="value-text">
        +{{ reward.value }} điểm
      </span>
    </div>

    <!-- Xác suất trúng -->
    <div class="reward-probability">
      <div class="probability-bar">
        <div 
          class="probability-fill" 
          :style="{ width: `${reward.probability}%` }"
        ></div>
      </div>
      <span class="probability-text">{{ reward.probability }}%</span>
    </div>

    <!-- Số lượng còn lại -->
    <div class="reward-quantity">
      <i class="fas fa-box"></i>
      <span>Còn {{ reward.quantityRemaining || 0 }}</span>
    </div>

    <!-- Hiệu ứng shine khi có thể trúng -->
    <div v-if="isAvailable" class="reward-shine"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  reward: {
    type: Object,
    required: true
  }
})

// Kiểm tra phần thưởng còn khả dụng
const isAvailable = computed(() => {
  return props.reward.quantityRemaining && props.reward.quantityRemaining > 0
})

// Format tiền tệ VNĐ
const formatCurrency = (value) => {
  if (!value) return '0đ'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}
</script>

<style scoped>
.reward-card {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;
  padding: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
  min-height: 180px;
}

.reward-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.reward-card.reward-available {
  border-color: #fbbf24;
}

.reward-card.reward-available:hover {
  border-color: #f59e0b;
}

.reward-card.reward-voucher {
  background: linear-gradient(135deg, #faf5ff, #fdf2f8);
}

.reward-card.reward-voucher.reward-available {
  border-color: #a855f7;
}

.reward-card.reward-points {
  background: linear-gradient(135deg, #fffbeb, #fff7ed);
}

.reward-card.reward-points.reward-available {
  border-color: #fbbf24;
}

/* Header */
.reward-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.reward-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.reward-voucher .reward-icon {
  background-color: #ede9fe;
  color: #9333ea;
}

.reward-points .reward-icon {
  background-color: #fef3c7;
  color: #d97706;
}

.reward-info {
  flex: 1;
  min-width: 0;
}

.reward-name {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reward-description {
  font-size: 14px;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Giá trị */
.reward-value {
  margin-bottom: 16px;
  text-align: center;
}

.value-text {
  font-size: 24px;
  font-weight: 700;
}

.reward-voucher .value-text {
  color: #9333ea;
}

.reward-points .value-text {
  color: #d97706;
}

/* Xác suất */
.reward-probability {
  margin-bottom: 12px;
}

.probability-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 8px;
}

.probability-fill {
  height: 100%;
  transition: all 0.5s ease-out;
}

.reward-voucher .probability-fill {
  background: linear-gradient(90deg, #a855f7, #ec4899);
}

.reward-points .probability-fill {
  background: linear-gradient(90deg, #fbbf24, #fb923c);
}

.probability-text {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

/* Số lượng */
.reward-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

/* Hiệu ứng shine */
.reward-shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.3) 50%, transparent 60%);
  animation: shine 2s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%);
  }
  100% {
    transform: translateX(100%) translateY(100%);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .reward-card {
    padding: 12px;
    min-height: 160px;
  }
  
  .reward-name {
    font-size: 16px;
  }
  
  .value-text {
    font-size: 20px;
  }
}
</style>
