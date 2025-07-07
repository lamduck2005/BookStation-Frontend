<template>
  <div class="profile-addresses">
    <!-- Warning Alert -->
    <div class="alert alert-warning d-flex align-items-center mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span>Bạn vui lòng cập nhật thông tin tài khoản:</span>
      <a href="#" class="ms-2 text-primary fw-bold">Cập nhật thông tin ngay</a>
    </div>

    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Số địa chỉ</h2>
      <button class="btn btn-danger" @click="showAddAddressModal = true">
        <i class="bi bi-plus-circle me-2"></i>
        Thêm địa chỉ mới
      </button>
    </div>

    <!-- Addresses List -->
    <div class="addresses-list">
      <div v-if="addresses.length === 0" class="no-addresses">
        <div class="empty-state">
          <i class="bi bi-geo-alt text-muted"></i>
          <p class="text-muted">Bạn chưa có địa chỉ nào.</p>
          <button class="btn btn-outline-primary" @click="showAddAddressModal = true">
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      </div>

      <div v-else class="row">
        <div v-for="address in addresses" :key="address.id" class="col-md-6 mb-4">
          <div class="address-card">
            <div class="address-header d-flex justify-content-between align-items-start">
              <div class="address-info">
                <h5 class="address-name">{{ address.name }}</h5>
                <p class="address-phone mb-1">{{ address.phone }}</p>
                <p class="address-text mb-0">{{ address.fullAddress }}</p>
              </div>
              <div class="address-actions">
                <button 
                  class="btn btn-sm btn-outline-secondary me-2" 
                  @click="editAddress(address)"
                >
                  Sửa
                </button>
                <button 
                  class="btn btn-sm btn-outline-danger" 
                  @click="deleteAddress(address.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
            
            <div class="address-footer mt-3">
              <div class="address-labels">
                <span v-if="address.isDefault" class="badge bg-success">Mặc định</span>
                <span v-if="address.type === 'home'" class="badge bg-info">Nhà riêng</span>
                <span v-if="address.type === 'office'" class="badge bg-warning">Văn phòng</span>
              </div>
              
              <div class="address-shipping-info">
                <small class="text-muted">{{ address.shippingNote }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Address Modal -->
    <div class="modal" :class="{ 'show d-block': showAddAddressModal }" v-if="showAddAddressModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới' }}
            </h5>
            <button type="button" class="btn-close" @click="closeAddressModal"></button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="saveAddress">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Họ và tên *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="addressForm.name"
                    placeholder="Vũ Linh"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Số điện thoại *</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    v-model="addressForm.phone"
                    placeholder="0346447583"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Địa chỉ *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="addressForm.address"
                  placeholder="phố 31 đông đa"
                  required
                />
              </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <label class="form-label">Tỉnh/Thành phố *</label>
                  <select class="form-select" v-model="addressForm.province" required>
                    <option value="">Chọn tỉnh/thành phố</option>
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">Hồ Chí Minh</option>
                    <option value="danang">Đà Nẵng</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Quận/Huyện *</label>
                  <select class="form-select" v-model="addressForm.district" required>
                    <option value="">Chọn quận/huyện</option>
                    <option value="dongda">Đông Đa</option>
                    <option value="hoankiem">Hoàn Kiếm</option>
                    <option value="badinh">Ba Đình</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Phường/Xã *</label>
                  <select class="form-select" v-model="addressForm.ward" required>
                    <option value="">Chọn phường/xã</option>
                    <option value="benngh">Bến Nghé</option>
                    <option value="bachmai">Bạch Mai</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Loại địa chỉ</label>
                <div class="form-check-group">
                  <div class="form-check form-check-inline">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="addressType" 
                      id="home"
                      value="home"
                      v-model="addressForm.type"
                    />
                    <label class="form-check-label" for="home">Nhà riêng</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="addressType" 
                      id="office"
                      value="office"
                      v-model="addressForm.type"
                    />
                    <label class="form-check-label" for="office">Văn phòng</label>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="isDefault"
                    v-model="addressForm.isDefault"
                  />
                  <label class="form-check-label" for="isDefault">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeAddressModal">
                  Hủy
                </button>
                <button type="submit" class="btn btn-danger">
                  {{ editingAddress ? 'Cập nhật' : 'Thêm địa chỉ' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal Backdrop -->
    <div class="modal-backdrop show" v-if="showAddAddressModal"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const showAddAddressModal = ref(false)
const editingAddress = ref(null)

// Fake addresses data
const addresses = ref([
  {
    id: 1,
    name: 'Vũ Linh',
    phone: '0346447583',
    address: 'phố 31 đông đa',
    province: 'Hà Nội',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    fullAddress: 'phố 31 đông đa, Phường Bến Nghé, Quận 1, Hà Nội, VN',
    type: 'home',
    isDefault: true,
    shippingNote: 'Địa chỉ thanh toán mặc định'
  },
  {
    id: 2,
    name: 'linh vugk',
    phone: '0989898990',
    address: 'phố 31 đông đa',
    province: 'Hà Nội',
    district: 'Quận Hai Bà Trưng',
    ward: 'Phường Bạch Mai',
    fullAddress: 'phố 31 đông đa, Phường Bạch Mai, Quận Hai Bà Trưng, Hà Nội, VN',
    type: 'office',
    isDefault: false,
    shippingNote: 'Địa chỉ khác'
  },
  {
    id: 3,
    name: 'linh vu',
    phone: '0989898990',
    address: 'td',
    province: 'Thụy Sĩ',
    district: '',
    ward: '',
    fullAddress: 'td, ffgj, Appenzell Innerrhoden, CH',
    type: 'home',
    isDefault: false,
    shippingNote: 'Địa chỉ khác'
  }
])

// Address form
const addressForm = reactive({
  name: '',
  phone: '',
  address: '',
  province: '',
  district: '',
  ward: '',
  type: 'home',
  isDefault: false
})

// Reset form
const resetForm = () => {
  Object.assign(addressForm, {
    name: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    type: 'home',
    isDefault: false
  })
}

// Close modal
const closeAddressModal = () => {
  showAddAddressModal.value = false
  editingAddress.value = null
  resetForm()
}

// Edit address
const editAddress = (address) => {
  editingAddress.value = address
  Object.assign(addressForm, address)
  showAddAddressModal.value = true
}

// Save address
const saveAddress = () => {
  if (editingAddress.value) {
    // Update existing address
    const index = addresses.value.findIndex(a => a.id === editingAddress.value.id)
    if (index !== -1) {
      addresses.value[index] = { 
        ...editingAddress.value, 
        ...addressForm,
        fullAddress: `${addressForm.address}, ${addressForm.ward}, ${addressForm.district}, ${addressForm.province}`
      }
    }
  } else {
    // Add new address
    const newAddress = {
      id: Date.now(),
      ...addressForm,
      fullAddress: `${addressForm.address}, ${addressForm.ward}, ${addressForm.district}, ${addressForm.province}`,
      shippingNote: addressForm.isDefault ? 'Địa chỉ thanh toán mặc định' : 'Địa chỉ khác'
    }
    addresses.value.push(newAddress)
  }
  
  closeAddressModal()
}

// Delete address
const deleteAddress = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
    const index = addresses.value.findIndex(a => a.id === id)
    if (index !== -1) {
      addresses.value.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.profile-addresses {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.addresses-list {
  margin-top: 24px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
}

.address-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
  transition: box-shadow 0.2s ease;
}

.address-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.address-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.address-phone {
  font-size: 14px;
  color: #666;
}

.address-text {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

.address-actions {
  display: flex;
  gap: 8px;
}

.address-labels {
  margin-bottom: 8px;
}

.address-labels .badge {
  margin-right: 8px;
  font-size: 11px;
}

.address-shipping-info small {
  font-size: 12px;
}

.form-check-group {
  display: flex;
  gap: 20px;
}

.modal {
  background: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  margin: 30px auto;
}

.modal-content {
  border: none;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 20px 24px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.form-control, .form-select {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
}

.form-control:focus, .form-select:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

@media (max-width: 768px) {
  .profile-addresses {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .address-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .address-actions {
    align-self: flex-start;
  }
}
</style>
