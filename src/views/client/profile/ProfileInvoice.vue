<template>
  <div class="profile-invoice">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Thông tin xuất hóa đơn GTGT</h2>
    </div>

    <!-- Invoice Info Form -->
    <div class="invoice-form-card">
      <form @submit.prevent="saveInvoiceInfo">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="buyerName" class="form-label">Họ tên người mua hàng</label>
            <input 
              type="text" 
              class="form-control" 
              id="buyerName"
              v-model="invoiceInfo.buyerName"
              placeholder="Nhập họ tên người mua hàng"
            >
          </div>
          <div class="col-md-6 mb-3">
            <label for="companyName" class="form-label">Tên công ty</label>
            <input 
              type="text" 
              class="form-control" 
              id="companyName"
              v-model="invoiceInfo.companyName"
              placeholder="Nhập tên công ty"
            >
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="companyAddress" class="form-label">Địa chỉ công ty</label>
            <input 
              type="text" 
              class="form-control" 
              id="companyAddress"
              v-model="invoiceInfo.companyAddress"
              placeholder="Nhập địa chỉ công ty"
            >
          </div>
          <div class="col-md-6 mb-3">
            <label for="taxCode" class="form-label">Mã số thuế công ty</label>
            <input 
              type="text" 
              class="form-control" 
              id="taxCode"
              v-model="invoiceInfo.taxCode"
              placeholder="Nhập mã số thuế"
            >
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-4">
            <label for="invoiceEmail" class="form-label">Email nhận hóa đơn</label>
            <input 
              type="email" 
              class="form-control" 
              id="invoiceEmail"
              v-model="invoiceInfo.invoiceEmail"
              placeholder="Nhập email nhận hóa đơn"
            >
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-save">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Invoice information
const invoiceInfo = reactive({
  buyerName: '',
  companyName: '',
  companyAddress: '',
  taxCode: '',
  invoiceEmail: ''
})

// Save invoice information
const saveInvoiceInfo = () => {
  // TODO: API call to save invoice info
  console.log('Saving invoice info:', invoiceInfo)
  // Show success message
  alert('Đã lưu thông tin xuất hóa đơn thành công!')
}
</script>

<style scoped>
.profile-invoice {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.invoice-form-card {
  padding-top: 24px;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-control {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-control::placeholder {
  color: #999;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.btn-save {
  background: #dc3545;
  border: none;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.btn-save:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .profile-invoice {
    padding: 16px;
  }
  
  .form-actions {
    margin-top: 24px;
  }
  
  .btn-save {
    width: 100%;
  }
}
</style>
