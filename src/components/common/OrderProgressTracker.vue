<template>
  <div class="order-progress-tracker">
    <!-- Loading State -->
    <div v-if="loading" class="progress-loading">
      <div class="loading-skeleton">
        <div class="skeleton-line"></div>
        <div class="skeleton-steps">
          <div v-for="i in 4" :key="i" class="skeleton-step">
            <div class="skeleton-circle"></div>
            <div class="skeleton-text"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Progress Content -->
    <div v-else class="progress-container">
      <div class="progress-line">
        <div 
          class="progress-line-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      
      <div class="progress-steps">
        <div 
          v-for="(step, index) in progressSteps" 
          :key="step.value"
          class="progress-step"
          :class="getStepClass(step.value)"
          :title="getStepTooltip(step.value)"
        >
          <div class="step-circle">
            <i :class="step.icon" class="step-icon"></i>
          </div>
          <div class="step-label">
            <span class="step-title">{{ step.displayName }}</span>
            <span v-if="step.value === currentStatus && stepDate" class="step-date">
              {{ formatDate(stepDate) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { getOrderProgressStatuses, getStatusState } from '@/services/client/orderStatus.js'

export default {
  name: 'OrderProgressTracker',
  props: {
    currentStatus: {
      type: String,
      required: true
    },
    orderDate: {
      type: [Number, String],
      default: null
    },
    orderType: {
      type: String,
      default: 'ONLINE'
    }
  },
  setup(props) {
    const progressSteps = ref([])
    const loading = ref(true)
    
    // Load progress steps từ API
    const loadProgressSteps = async () => {
      try {
        loading.value = true
        const steps = await getOrderProgressStatuses(props.currentStatus, props.orderType)
        progressSteps.value = steps
      } catch (error) {
        console.error('Error loading progress steps:', error)
        // Fallback về steps cơ bản
        progressSteps.value = [
          { value: 'PENDING', displayName: 'Chờ xử lý', icon: 'bi-clock' },
          { value: 'CONFIRMED', displayName: 'Đã xác nhận', icon: 'bi-check-circle' },
          { value: 'SHIPPED', displayName: 'Đang giao hàng', icon: 'bi-truck' },
          { value: 'DELIVERED', displayName: 'Đã giao hàng', icon: 'bi-check2-circle' }
        ]
      } finally {
        loading.value = false
      }
    }
    
    // Tính phần trăm tiến trình
    const progressPercentage = computed(() => {
      if (loading.value || progressSteps.value.length === 0) return 0
      
      const currentIndex = progressSteps.value.findIndex(step => step.value === props.currentStatus)
      if (currentIndex === -1) return 0
      
      const totalSteps = progressSteps.value.length
      
      // Đối với trạng thái cuối cùng, hiển thị 100%
      if (currentIndex === totalSteps - 1) {
        return 100
      }
      
      // Đối với các trạng thái khác, tính theo tỉ lệ
      return ((currentIndex + 1) / totalSteps) * 100
    })
    
    // Ngày của bước hiện tại
    const stepDate = computed(() => {
      return props.orderDate
    })
    
    // Lấy class cho mỗi bước
    const getStepClass = (stepValue) => {
      if (loading.value || progressSteps.value.length === 0) return 'step-pending'
      
      const state = getStatusState(stepValue, props.currentStatus, progressSteps.value)
      
      // Thêm class đặc biệt cho các trạng thái cụ thể
      const specialClasses = []
      if (stepValue === 'CANCELED') {
        specialClasses.push('step-canceled')
      } else if (['REFUNDED', 'PARTIALLY_REFUNDED'].includes(stepValue)) {
        specialClasses.push('step-refunded')
      } else if (['DELIVERY_FAILED'].includes(stepValue)) {
        specialClasses.push('step-failed')
      }
      
      return [`step-${state}`, ...specialClasses].join(' ')
    }
    
    // Lấy tooltip cho mỗi bước
    const getStepTooltip = (stepValue) => {
      const tooltips = {
        'PENDING': 'Đơn hàng đang chờ được xử lý',
        'CONFIRMED': 'Đơn hàng đã được xác nhận và chuẩn bị',
        'SHIPPED': 'Đơn hàng đang được vận chuyển',
        'DELIVERED': 'Đơn hàng đã được giao thành công',
        'CANCELED': 'Đơn hàng đã bị hủy',
        'DELIVERY_FAILED': 'Giao hàng không thành công',
        'REDELIVERING': 'Đang thực hiện giao hàng lại',
        'RETURNING_TO_WAREHOUSE': 'Đang trả hàng về kho',
        'REFUND_REQUESTED': 'Khách hàng đã yêu cầu hoàn trả',
        'AWAITING_GOODS_RETURN': 'Chờ lấy hàng hoàn trả',
        'GOODS_RECEIVED_FROM_CUSTOMER': 'Đã nhận hàng từ khách',
        'GOODS_RETURNED_TO_WAREHOUSE': 'Hàng đã về kho',
        'REFUNDING': 'Đang xử lý hoàn tiền',
        'REFUNDED': 'Đã hoàn tiền thành công',
        'PARTIALLY_REFUNDED': 'Đã hoàn tiền một phần'
      }
      
      return tooltips[stepValue] || stepValue
    }
    
    // Format ngày tháng
    const formatDate = (timestamp) => {
      if (!timestamp) return ''
      
      const date = new Date(typeof timestamp === 'number' ? timestamp : parseInt(timestamp))
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // Watch for changes in currentStatus to reload steps
    watch(() => props.currentStatus, () => {
      loadProgressSteps()
    })
    
    // Load initial data
    onMounted(() => {
      loadProgressSteps()
    })
    
    return {
      progressSteps,
      loading,
      progressPercentage,
      stepDate,
      getStepClass,
      getStepTooltip,
      formatDate
    }
  }
}
</script>

<style scoped>
.order-progress-tracker {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-container {
  position: relative;
}

.progress-line {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 3px;
  background: #e9ecef;
  z-index: 1;
  border-radius: 1.5px;
}

.progress-line-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
  transition: width 0.8s ease-in-out;
  border-radius: 1.5px;
  box-shadow: 0 1px 3px rgba(40, 167, 69, 0.3);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  max-width: 140px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.progress-step:hover {
  transform: translateY(-2px);
}

.step-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 3px solid #e9ecef;
  margin-bottom: 12px;
  transition: all 0.4s ease;
  position: relative;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-circle::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.3s ease;
}

.step-icon {
  font-size: 18px;
  color: #6c757d;
  transition: all 0.3s ease;
  font-weight: 600;
}

.step-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 40px;
}

.step-title {
  font-size: 13px;
  font-weight: 500;
  color: #6c757d;
  line-height: 1.4;
  text-align: center;
  transition: all 0.3s ease;
  max-width: 120px;
}

.step-date {
  font-size: 11px;
  color: #28a745;
  font-weight: 500;
  background: rgba(40, 167, 69, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
  white-space: nowrap;
}

/* Step States */
.step-completed .step-circle {
  background: #28a745;
  border-color: #28a745;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.step-completed .step-circle::before {
  background: rgba(40, 167, 69, 0.2);
  transform: scale(1.2);
}

.step-completed .step-icon {
  color: #fff;
  transform: scale(1.1);
}

.step-completed .step-title {
  color: #28a745;
  font-weight: 600;
}

.step-current .step-circle {
  background: #007bff;
  border-color: #007bff;
  animation: pulse-blue 2s infinite;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.5);
}

.step-current .step-circle::before {
  background: rgba(0, 123, 255, 0.2);
  animation: pulse-ring 2s infinite;
}

.step-current .step-icon {
  color: #fff;
  animation: bounce 1s infinite alternate;
}

.step-current .step-title {
  color: #007bff;
  font-weight: 700;
}

.step-pending .step-circle {
  background: #fff;
  border-color: #dee2e6;
}

.step-pending .step-icon {
  color: #adb5bd;
}

.step-pending .step-title {
  color: #adb5bd;
}

/* Animation */
@keyframes pulse-blue {
  0% {
    box-shadow: 0 4px 16px rgba(0, 123, 255, 0.5);
  }
  50% {
    box-shadow: 0 4px 20px rgba(0, 123, 255, 0.7);
  }
  100% {
    box-shadow: 0 4px 16px rgba(0, 123, 255, 0.5);
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes bounce {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

/* Special states */
.step-canceled .step-circle {
  background: #dc3545;
  border-color: #dc3545;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.step-canceled .step-circle::before {
  background: rgba(220, 53, 69, 0.2);
  transform: scale(1.2);
}

.step-canceled .step-icon {
  color: #fff;
}

.step-canceled .step-title {
  color: #dc3545;
  font-weight: 600;
}

.step-refunded .step-circle {
  background: #ffc107;
  border-color: #ffc107;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
}

.step-refunded .step-circle::before {
  background: rgba(255, 193, 7, 0.2);
  transform: scale(1.2);
}

.step-refunded .step-icon {
  color: #212529;
}

.step-refunded .step-title {
  color: #e67e22;
  font-weight: 600;
}

.step-failed .step-circle {
  background: #fd7e14;
  border-color: #fd7e14;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(253, 126, 20, 0.4);
}

.step-failed .step-circle::before {
  background: rgba(253, 126, 20, 0.2);
  transform: scale(1.2);
}

.step-failed .step-icon {
  color: #fff;
}

.step-failed .step-title {
  color: #fd7e14;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .order-progress-tracker {
    padding: 16px;
  }
  
  .progress-loading {
    padding: 16px;
  }
  
  .progress-line {
    left: 16px;
    right: 16px;
  }
  
  .progress-steps {
    gap: 8px;
  }
  
  .progress-step {
    max-width: 90px;
  }
  
  .skeleton-steps {
    gap: 8px;
  }
  
  .skeleton-step {
    max-width: 90px;
  }
  
  .step-circle, .skeleton-circle {
    width: 36px;
    height: 36px;
    margin-bottom: 8px;
  }
  
  .step-icon {
    font-size: 16px;
  }
  
  .step-title {
    font-size: 11px;
    max-width: 80px;
  }
  
  .skeleton-text {
    width: 60px;
    height: 10px;
  }
  
  .step-date {
    font-size: 10px;
    padding: 1px 4px;
  }
}

@media (max-width: 576px) {
  .order-progress-tracker {
    padding: 12px;
  }
  
  .progress-loading {
    padding: 12px;
  }
  
  .progress-steps, .skeleton-steps {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .progress-line, .skeleton-line {
    display: none;
  }
  
  .progress-step, .skeleton-step {
    flex-direction: row;
    max-width: none;
    width: 100%;
    text-align: left;
    align-items: center;
    padding: 8px 12px;
    border-radius: 8px;
    background: #f8f9fa;
    margin-bottom: 0;
  }
  
  .progress-step:hover {
    transform: none;
  }
  
  .step-circle, .skeleton-circle {
    margin-right: 12px;
    margin-bottom: 0;
    flex-shrink: 0;
  }
  
  .step-label {
    align-items: flex-start;
    flex: 1;
    text-align: left;
  }
  
  .step-title {
    text-align: left;
    max-width: none;
  }
  
  .skeleton-text {
    width: 120px;
    height: 12px;
    margin-left: 12px;
  }
  
  /* Add connector line for mobile */
  .progress-step:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 33px;
    bottom: -6px;
    width: 2px;
    height: 12px;
    background: #dee2e6;
  }
  
  .progress-step.step-completed:not(:last-child)::after {
    background: #28a745;
  }
  
  .progress-step.step-current:not(:last-child)::after {
    background: #007bff;
  }
}

/* Loading Skeleton */
.progress-loading {
  padding: 24px;
}

.loading-skeleton {
  position: relative;
}

.skeleton-line {
  height: 3px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-shimmer 2s infinite;
  border-radius: 1.5px;
  margin-bottom: 20px;
}

.skeleton-steps {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.skeleton-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 140px;
}

.skeleton-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-shimmer 2s infinite;
  margin-bottom: 12px;
}

.skeleton-text {
  width: 80px;
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-shimmer 2s infinite;
  border-radius: 6px;
}

@keyframes loading-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
