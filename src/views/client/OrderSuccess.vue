<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="mt-2">Đang tải thông tin đơn hàng...</div>
        </div>

        <!-- Success state -->
        <div v-else-if="!error" class="text-center">
          <!-- Success icon -->
          <div class="mb-4">
            <div class="success-icon mx-auto mb-3">
              <i class="fas fa-check-circle text-success" style="font-size: 5rem;"></i>
            </div>
            <h2 class="text-success mb-2">Đặt hàng thành công!</h2>
            <p class="text-muted">Cảm ơn bạn đã tin tưởng BookStation</p>
          </div>
          <!-- Fail icon -->
          <div class="mb-4" hidden>
            <div class="success-icon mx-auto mb-3">
              <i class="fas fa-ban text-danger" style="font-size: 5rem;"></i>
            </div>
            <h2 class="text-danger mb-2">Đặt hàng thất bại!</h2>
            <p class="text-muted">Vui lòng thử lại</p>
          </div>

          <!-- Order info -->
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title mb-3">Thông tin đơn hàng</h5>
              <div class="row text-start">
                <div class="col-6">
                  <strong>Mã đơn hàng:</strong>
                </div>
                <div class="col-6">
                  {{ orderId || 'Không xác định' }}
                </div>
              </div>
              <hr class="my-2">
              <div class="row text-start">
                <div class="col-6">
                  <strong>Thời gian đặt:</strong>
                </div>
                <div class="col-6">
                  {{ formatDateTime(Date.now()) }}
                </div>
              </div>
              <hr class="my-2">
              <div class="row text-start">
                <div class="col-6">
                  <strong>Trạng thái:</strong>
                </div>
                <div class="col-6">
                  <span class="badge bg-warning">Chờ xác nhận</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Next steps -->
          <div class="alert alert-info">
            <h6 class="alert-heading">
              <i class="fas fa-info-circle me-2"></i>Bước tiếp theo
            </h6>
            <ul class="mb-0 text-start">
              <li>Chúng tôi sẽ xác nhận đơn hàng trong vòng 2 giờ</li>
              <li>Đơn hàng sẽ được đóng gói và giao đến bạn trong 2-3 ngày</li>
              <li>Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi"</li>
            </ul>
          </div>

          <!-- Action buttons -->
          <div class="d-grid gap-2 d-md-flex justify-content-md-center">
            <button 
              class="btn btn-primary me-md-2" 
              @click="$router.push('/profile/orders')"
            >
              <i class="fas fa-list me-2"></i>Xem đơn hàng của tôi
            </button>
            <button 
              class="btn btn-outline-primary" 
              @click="$router.push('/')"
            >
              <i class="fas fa-home me-2"></i>Tiếp tục mua sắm
            </button>
          </div>
        </div>

        <!-- Error state -->
        <div v-else class="text-center py-5">
          <div class="mb-4">
            <i class="fas fa-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
          </div>
          <h4 class="text-warning mb-3">Có lỗi xảy ra</h4>
          <p class="text-muted mb-4">{{ error }}</p>
          <div class="d-grid gap-2 d-md-flex justify-content-md-center">
            <button class="btn btn-primary me-md-2" @click="$router.push('/cart')">
              Quay lại giỏ hàng
            </button>
            <button class="btn btn-outline-primary" @click="$router.push('/')">
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref(null)
const orderId = ref(null)

const formatDateTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadOrderDetails = async () => {
  try {
    loading.value = true
    // Gọi API để lấy chi tiết đơn hàng
    // const response = await getOrderDetails(orderId.value)
    // orderDetails = response.data
  } catch (error) {
    console.error('Error loading order details:', error)
    error.value = 'Không thể tải thông tin đơn hàng.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Lấy order ID từ route params
  orderId.value = route.params.orderId
  
  console.log('📋 OrderSuccess mounted with orderId:', orderId.value)
  console.log('📋 Route params:', route.params)
  
  if (!orderId.value) {
    error.value = 'Không tìm thấy thông tin đơn hàng.'
    return
  }

  // Có thể gọi API để lấy chi tiết đơn hàng nếu cần
  // loadOrderDetails()
})
</script>

<style scoped>
.success-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(25, 135, 84, 0.1);
}

.card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.alert {
  border-radius: 8px;
}

.btn {
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
}

.btn-primary {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-primary:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.btn-outline-primary {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-primary:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

@media (max-width: 768px) {
  .success-icon {
    width: 100px;
    height: 100px;
  }
  
  .success-icon i {
    font-size: 4rem !important;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}
</style>
