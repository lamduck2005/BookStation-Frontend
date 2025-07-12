<template>
  <div class="profile-addresses">
    

    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Sổ địa chỉ</h2>
      <button class="btn btn-primary" @click="showAddAddressModal = true">
        <i class="bi bi-plus-circle me-2"></i>
        Thêm địa chỉ mới
      </button>
    </div>

    <!-- Addresses List -->
    <div class="addresses-list">
      <!-- Loading State -->
      <div v-if="isLoadingAddresses" class="loading-state text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải danh sách địa chỉ...</p>
      </div>

      <div v-else-if="addresses.length === 0" class="no-addresses">
        <div class="empty-state">
          <i class="bi bi-geo-alt text-muted"></i>
          <p class="text-muted">Bạn chưa có địa chỉ nào.</p>
          <button class="btn btn-outline-primary" @click="showAddAddressModal = true">
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      </div>

      <div v-else class="row addresses-grid">
        <div v-for="address in addresses" :key="address.id" class="col-md-6 mb-4">
          <div class="address-card animate-fade-in">
            <div class="address-header d-flex justify-content-between align-items-start">
              <div class="address-info">
                <h5 class="address-name">{{ address.recipientName }}</h5>
                <p class="address-phone mb-1">{{ address.phoneNumber }}</p>
                <p class="address-text mb-0">{{ address.addressDetail }}, {{ address.wardName }}, {{ address.districtName }}, {{ address.provinceName }}</p>
              </div>
              <div class="address-actions">
                <button 
                  class="btn btn-sm btn-outline-secondary me-2" 
                  :disabled="isLoadingEditAddress"
                  @click="editAddress(address)"
                >
                  <span v-if="isLoadingEditAddress && editingAddress?.id === address.id" class="spinner-border spinner-border-sm me-1" role="status"></span>
                  Sửa
                </button>
                <button 
                  class="btn btn-sm btn-outline-danger" 
                  :disabled="isDeletingAddress"
                  @click="deleteAddress(address.id)"
                >
                  <span v-if="isDeletingAddress && deletingAddressId === address.id" class="spinner-border spinner-border-sm me-1" role="status"></span>
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
            
            <div class="address-footer mt-3">
              <div class="address-labels">
                <span v-if="address.isDefault" class="badge bg-success">Mặc định</span>
                <span v-if="address.addressType === 'HOME'" class="badge bg-info">
                  <i class="bi bi-house-door me-1"></i>Nhà riêng
                </span>
                <span v-if="address.addressType === 'OFFICE'" class="badge bg-warning">
                  <i class="bi bi-building me-1"></i>Văn phòng
                </span>
              </div>
              
              <div class="address-shipping-info">
                <small class="text-muted">{{ address.isDefault ? 'Địa chỉ thanh toán mặc định' : 'Địa chỉ khác' }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Address Modal -->
    <div class="modal modal-fade" :class="{ 'show d-block': showAddAddressModal }" v-if="showAddAddressModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content animate-scale-in">
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
                    v-model="addressForm.recipientName"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Số điện thoại *</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    v-model="addressForm.phoneNumber"
                    placeholder="0123456789"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Địa chỉ *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="addressForm.addressDetail"
                  placeholder="Số nhà 1, ngõ 1"
                  required
                />
              </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <label class="form-label">Tỉnh/Thành phố *</label>
                  <select class="form-select" v-model="addressForm.provinceId" required @change="onProvinceChange">
                    <option value="">Chọn tỉnh/thành phố</option>
                    <option v-for="p in provinces" :key="p.ProvinceID" :value="p.ProvinceID">
                      {{ p.ProvinceName }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Quận/Huyện *</label>
                  <select class="form-select" v-model="addressForm.districtId" required @change="onDistrictChange">
                    <option value="">Chọn quận/huyện</option>
                    <option v-for="d in districts" :key="d.DistrictID" :value="d.DistrictID">
                      {{ d.DistrictName || d.ProvinceName }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Phường/Xã *</label>
                  <select class="form-select" v-model="addressForm.wardCode" required @change="onWardChange">
                    <option value="">Chọn phường/xã</option>
                    <option v-for="w in wards" :key="w.WardCode" :value="w.WardCode">
                      {{ w.WardName }}
                    </option>
                  </select>
                </div>
                <span class="text-danger fst-italic m-1">{{ isLoadingEditAddress ? 'Đang tải dữ liệu địa chỉ, vui lòng chờ...' : '' }}</span>
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
                      value="HOME"
                      v-model="addressForm.addressType"
                    />
                    <label class="form-check-label" for="home">Nhà riêng</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="addressType" 
                      id="office"
                      value="OFFICE"
                      v-model="addressForm.addressType"
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
                    :disabled="addresses.length === 0 && !editingAddress"
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
                <button type="submit" class="btn btn-primary" :disabled="isSavingAddress">
                  <span v-if="isSavingAddress" class="spinner-border spinner-border-sm me-2" role="status"></span>
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
import { ghn } from '@/utils/giaohangnhanh'
import { ref, reactive, onMounted, watch } from 'vue'
import { getAddresses, addAddress, updateAddress as updateAddressApi, deleteAddress as deleteAddressApi } from '@/services/client/address'
import { showToast, showQuickConfirm } from '@/utils/swalHelper'

const showAddAddressModal = ref(false)
const editingAddress = ref(null)
const isLoadingEditAddress = ref(false)
const isSavingAddress = ref(false)
const isDeletingAddress = ref(false)
const deletingAddressId = ref(null)

// Danh sách địa chỉ động
const provinces = ref([])
const districts = ref([])
const wards = ref([])

// Danh sách địa chỉ trả về từ server
const addresses = ref([])
const isLoadingAddresses = ref(false)

const fetchAddresses = async () => {
  isLoadingAddresses.value = true
  try {
    const res = await getAddresses()
    const raw = res.data?.data || []
    addresses.value = raw.map(a => ({ ...a, addressType: ['HOME','OFFICE'].includes(a.addressType) ? a.addressType : 'HOME' }))
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Không thể lấy danh sách địa chỉ'
    showToast('error', errorMsg)
    console.error('Fetch addresses error:', error)
  } finally {
    isLoadingAddresses.value = false
  }
}

// Address form
const addressForm = reactive({
  recipientName: '',
  phoneNumber: '',
  addressDetail: '',
  provinceName: '',
  provinceId: '',
  districtName: '',
  districtId: '',
  wardName: '',
  wardCode: '',
  isDefault: false,
  addressType: 'HOME'
})

// Hàm lấy danh sách tỉnh/thành
const fetchProvinces = async () => {
  const res = await ghn.address.getProvinces()
  // Lọc bỏ các tỉnh test theo ID
  const excludeIds = [2002, 298, 290, 286]
  provinces.value = (res.data || res)
    .filter(p => !excludeIds.includes(p.ProvinceID))
    .sort((a, b) => a.ProvinceName.localeCompare(b.ProvinceName))
}
// Hàm lấy danh sách quận/huyện
const fetchDistricts = async (provinceId) => {
  if (!provinceId) {
    districts.value = []
    return
  }
  const res = await ghn.address.getDistricts(provinceId)
  districts.value = (res.data || res)
    .sort((a, b) => (a.DistrictName || a.ProvinceName).localeCompare(b.DistrictName || b.ProvinceName))
}
// Hàm lấy danh sách phường/xã
const fetchWards = async (districtId) => {
  if (!districtId) {
    wards.value = []
    return
  }
  const res = await ghn.address.getWards(districtId)
  wards.value = (res.data || res)
    .sort((a, b) => a.WardName.localeCompare(b.WardName))
}

// Watch để tự động load quận/huyện khi chọn tỉnh
watch(() => addressForm.provinceId, (newVal) => {
  addressForm.districtName = ''
  addressForm.districtId = ''
  addressForm.wardName = ''
  addressForm.wardCode = ''
  fetchDistricts(newVal)
})
// Watch để tự động load phường/xã khi chọn quận
watch(() => addressForm.districtId, (newVal) => {
  addressForm.wardName = ''
  addressForm.wardCode = ''
  fetchWards(newVal)
})

// Watch để tự động tích mặc định và disable checkbox khi thêm địa chỉ đầu tiên
watch(showAddAddressModal, (val) => {
  if (val && !editingAddress.value) {
    // mở modal thêm mới
    addressForm.isDefault = addresses.value.length === 0
  }
})

// Regex utils
const nameRegex = /^[A-Za-zÀ-ỹà-ỹ\s]{3,100}$/u
const phoneRegex = /^0\d{9}$/

const validateForm = () => {
  if (!addressForm.recipientName || !addressForm.phoneNumber || !addressForm.addressDetail || !addressForm.provinceId || !addressForm.districtId || !addressForm.wardCode) {
    return 'Vui lòng điền đầy đủ thông tin bắt buộc';
  }
  if (!nameRegex.test(addressForm.recipientName.trim())) {
    return 'Họ tên phải từ 3-100 ký tự, không chứa ký tự đặc biệt';
  }
  if (!phoneRegex.test(addressForm.phoneNumber.trim())) {
    return 'Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0';
  }
  return '';
}

// Reset form
const resetForm = () => {
  Object.assign(addressForm, {
    recipientName: '',
    phoneNumber: '',
    addressDetail: '',
    provinceName: '',
    provinceId: '',
    districtName: '',
    districtId: '',
    wardName: '',
    wardCode: '',
    isDefault: false,
    addressType: 'HOME'
  })
}

// Close modal
const closeAddressModal = () => {
  showAddAddressModal.value = false
  editingAddress.value = null
  resetForm()
}

// Edit address
const editAddress = async (address) => {
  isLoadingEditAddress.value = true
  showAddAddressModal.value = true


  editingAddress.value = address
  // Gán các trường cơ bản
  addressForm.recipientName = address.recipientName
  addressForm.phoneNumber = address.phoneNumber
  addressForm.addressDetail = address.addressDetail
  addressForm.addressType = ['HOME','OFFICE'].includes(address.addressType) ? address.addressType : 'HOME'
  addressForm.isDefault = address.isDefault

  // Gán provinceId
  addressForm.provinceId = address.provinceId
  await fetchDistricts(address.provinceId)
  addressForm.districtId = address.districtId
  await fetchWards(address.districtId)
  addressForm.wardCode = address.wardCode

  // Gán tên tỉnh/quận/phường
  addressForm.provinceName = address.provinceName
  addressForm.districtName = address.districtName
  addressForm.wardName = address.wardName

  isLoadingEditAddress.value = false
}

const saveAddress = async () => {
  // Auto set mặc định nếu là địa chỉ đầu tiên
  if (!editingAddress.value && addresses.value.length === 0) {
    addressForm.isDefault = true
  }

  // Validate
  const validationMsg = validateForm()
  if (validationMsg) {
    showToast('error', validationMsg)
    return
  }

  isSavingAddress.value = true
  try {
    if (editingAddress.value) {
      await updateAddressApi(editingAddress.value.id, { ...addressForm })
      showToast('success', 'Cập nhật địa chỉ thành công!')
    } else {
      await addAddress({ ...addressForm })
      showToast('success', 'Thêm địa chỉ thành công!')
    }
    await fetchAddresses()
    closeAddressModal()
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Lưu địa chỉ thất bại'
    showToast('error', errorMsg)
    console.error('Save address error:', error)
  } finally {
    isSavingAddress.value = false
  }
}

const deleteAddress = async (id) => {
  const addr = addresses.value.find(a => a.id === id)
  let confirmText = 'Bạn có chắc chắn muốn xóa địa chỉ này?'
  if (addr?.isDefault) {
    confirmText = 'Đây là địa chỉ mặc định, sau khi xóa hệ thống sẽ tự đặt mặc định cho địa chỉ khác (nếu có). Bạn có chắc chắn?'
  }

  const result = await showQuickConfirm(
    'Xác nhận xóa',
    confirmText,
    'warning',
    'Xóa',
    'Hủy',
    'btn-danger'
  )
  if (!result.isConfirmed) return

  isDeletingAddress.value = true
  deletingAddressId.value = id
  try {
    await deleteAddressApi(id)
    showToast('success', 'Xóa địa chỉ thành công!')
    await fetchAddresses()
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Xóa địa chỉ thất bại'
    showToast('error', errorMsg)
    console.error('Delete address error:', error)
  } finally {
    isDeletingAddress.value = false
    deletingAddressId.value = null
  }
}

const onProvinceChange = () => {
  const p = provinces.value.find(p => p.ProvinceID == addressForm.provinceId)
  addressForm.provinceName = p ? p.ProvinceName : ''
}
const onDistrictChange = () => {
  const d = districts.value.find(d => d.DistrictID == addressForm.districtId)
  addressForm.districtName = d ? (d.DistrictName || d.ProvinceName) : ''
}
const onWardChange = () => {
  const w = wards.value.find(w => w.WardCode == addressForm.wardCode)
  addressForm.wardName = w ? w.WardName : ''
}

onMounted(() => {
  fetchProvinces()
  fetchAddresses()
})
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

.loading-state {
  text-align: center;
  padding: 60px 20px;
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

.modal-fade {
  animation: fadeIn 0.3s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeInUp 0.4s ease-out;
}

.addresses-grid .address-card:nth-child(odd) {
  animation-delay: 0.1s;
}

.addresses-grid .address-card:nth-child(even) {
  animation-delay: 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
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
