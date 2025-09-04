<!-- Demo Page để test OrderProgressTracker component -->
<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <h2 class="mb-4">Demo Order Progress Tracker (API-based)</h2>
        <p class="text-muted mb-4">
          Component sử dụng API <code>GET /api/orders/order-statuses</code> để lấy danh sách trạng thái động
        </p>
        
        <!-- Test với các trạng thái khác nhau -->
        <div class="demo-section mb-5">
          <h4>1. Đơn hàng bình thường - Đang chờ xử lý</h4>
          <OrderProgressTracker 
            currentStatus="PENDING"
            :orderDate="Date.now()"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>2. Đơn hàng đã xác nhận</h4>
          <OrderProgressTracker 
            currentStatus="CONFIRMED"
            :orderDate="Date.now() - 86400000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>3. Đơn hàng đang giao</h4>
          <OrderProgressTracker 
            currentStatus="SHIPPED"
            :orderDate="Date.now() - 172800000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>4. Đơn hàng đã giao thành công</h4>
          <OrderProgressTracker 
            currentStatus="DELIVERED"
            :orderDate="Date.now() - 259200000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>5. Đơn hàng đã hủy</h4>
          <OrderProgressTracker 
            currentStatus="CANCELED"
            :orderDate="Date.now() - 86400000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>6. Đơn hàng giao thất bại</h4>
          <OrderProgressTracker 
            currentStatus="DELIVERY_FAILED"
            :orderDate="Date.now() - 172800000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>7. Đang giao lại</h4>
          <OrderProgressTracker 
            currentStatus="REDELIVERING"
            :orderDate="Date.now() - 86400000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>8. Yêu cầu hoàn trả</h4>
          <OrderProgressTracker 
            currentStatus="REFUND_REQUESTED"
            :orderDate="Date.now() - 86400000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>9. Đang hoàn tiền</h4>
          <OrderProgressTracker 
            currentStatus="REFUNDING"
            :orderDate="Date.now() - 43200000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>10. Đã hoàn tiền hoàn tất</h4>
          <OrderProgressTracker 
            currentStatus="REFUNDED"
            :orderDate="Date.now() - 21600000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>11. Hoàn tiền một phần</h4>
          <OrderProgressTracker 
            currentStatus="PARTIALLY_REFUNDED"
            :orderDate="Date.now() - 21600000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>12. Chờ lấy hàng hoàn trả</h4>
          <OrderProgressTracker 
            currentStatus="AWAITING_GOODS_RETURN"
            :orderDate="Date.now() - 32400000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>13. Đã nhận hàng từ khách</h4>
          <OrderProgressTracker 
            currentStatus="GOODS_RECEIVED_FROM_CUSTOMER"
            :orderDate="Date.now() - 21600000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>14. Hàng đã về kho</h4>
          <OrderProgressTracker 
            currentStatus="GOODS_RETURNED_TO_WAREHOUSE"
            :orderDate="Date.now() - 10800000"
            orderType="ONLINE"
          />
        </div>

        <div class="demo-section mb-5">
          <h4>15. Đang trả về kho</h4>
          <OrderProgressTracker 
            currentStatus="RETURNING_TO_WAREHOUSE"
            :orderDate="Date.now() - 86400000"
            orderType="ONLINE"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderProgressTracker from '@/components/common/OrderProgressTracker.vue'

export default {
  name: 'OrderProgressDemo',
  components: {
    OrderProgressTracker
  }
}
</script>

<style scoped>
.demo-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.demo-section h4 {
  color: #495057;
  margin-bottom: 15px;
  font-size: 1.1rem;
}
</style>
