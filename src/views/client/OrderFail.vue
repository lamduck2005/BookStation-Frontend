<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="mt-2">Đang tải thông tin...</div>
        </div>

        <!-- Failed state -->
        <div v-else class="text-center">
          <div class="mb-4">
            <div class="fail-icon mx-auto mb-3">
              <i class="fas fa-ban text-danger" style="font-size: 5rem;"></i>
            </div>
            <h2 class="text-danger mb-2">Thanh toán thất bại</h2>
            <p class="text-muted">{{ reasonMessage }}</p>
          </div>

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

<script>
export default {
  name: 'OrderFail',
  data() {
    return {
      loading: false,
      reasonMessage: ''
    }
  },
  mounted() {
    const reason = this.$route.query.reason || 'failed'

    const reasonMap = {
      checksum: 'Sai chữ ký xác thực (checksum không khớp). Yêu cầu thanh toán có thể đã bị chỉnh sửa hoặc cấu hình sai.',
      txnref: 'Mã tham chiếu giao dịch không hợp lệ. Vui lòng thử thanh toán lại.',
      badSessionId: 'SessionId không hợp lệ. Vui lòng tiến hành thanh toán lại từ đầu.',
      failed: 'Giao dịch thanh toán không thành công. Bạn có thể thử lại hoặc chọn phương thức thanh toán khác.',
      sessionNotFound: 'Không tìm thấy thông tin phiên thanh toán. Vui lòng thử lại.',
      order: 'Thanh toán thành công nhưng tạo đơn hàng gặp lỗi. Đơn hàng chưa được ghi nhận. Vui lòng liên hệ chúng tôi để được hỗ trợ.'
    }

    this.reasonMessage = reasonMap[reason] || reasonMap.failed
  }
}
</script>

<style scoped>
.fail-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(220, 53, 69, 0.1); /* Danger color */
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
  .fail-icon {
    width: 100px;
    height: 100px;
  }

  .fail-icon i {
    font-size: 4rem !important;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style>
