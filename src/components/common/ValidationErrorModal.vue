<template>
  <div v-if="show" class="validation-error-overlay" @click.self="handleClose">
    <div class="validation-error-modal">
      <!-- Header với icon warning -->
      <div class="modal-header">
        <div class="warning-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Dữ Liệu Đã Thay Đổi!</h3>
        <button class="close-btn" @click="handleClose">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <p class="main-message">
          Thông tin của bạn đã được cập nhật từ hệ thống. Vui lòng tải lại trang để đồng bộ dữ liệu.
        </p>
        
        <!-- Danh sách lỗi validation -->
        <div v-if="validationErrors.length > 0" class="validation-errors">
          <h4>Chi tiết thay đổi:</h4>
          <ul>
            <li v-for="error in validationErrors" :key="error" class="error-item">
              <i class="fas fa-info-circle"></i>
              {{ error }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer với nút actions -->
      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose">
          <i class="fas fa-times"></i>
          Đóng
        </button>
        <button class="reload-btn" @click="handleReload">
          <i class="fas fa-sync-alt"></i>
          Tải Lại Trang
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  validationErrors: {
    type: Array,
    default: () => []
  },
  autoClose: {
    type: Boolean,
    default: false
  },
  autoReloadTime: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close', 'reload'])

const handleClose = () => {
  emit('close')
}

const handleReload = () => {
  emit('reload')
  window.location.reload()
}

// Auto reload nếu được bật
if (props.autoClose && props.show) {
  setTimeout(() => {
    handleReload()
  }, props.autoReloadTime)
}
</script>

<style scoped>
.validation-error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.validation-error-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
  border: 3px solid #f59e0b;
}

/* Header */
.modal-header {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 24px;
  position: relative;
  text-align: center;
  border-bottom: 2px solid #f59e0b;
}

.warning-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
  color: white;
  animation: pulse 2s infinite;
}

.modal-header h3 {
  color: #92400e;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #374151;
}

/* Content */
.modal-content {
  padding: 24px;
}

.main-message {
  color: #374151;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: center;
}

.validation-errors {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
}

.validation-errors h4 {
  color: #dc2626;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.validation-errors ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.error-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7f1d1d;
  font-size: 14px;
  margin-bottom: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #dc2626;
}

.error-item:last-child {
  margin-bottom: 0;
}

.error-item i {
  color: #dc2626;
  flex-shrink: 0;
}

/* Footer */
.modal-footer {
  background: #f9fafb;
  padding: 20px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn, .reload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.cancel-btn {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.cancel-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.reload-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.reload-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
}

.reload-btn:active {
  transform: translateY(0);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .validation-error-modal {
    width: 95%;
    margin: 20px;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .warning-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .modal-header h3 {
    font-size: 20px;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 16px 20px;
    flex-direction: column;
  }
  
  .cancel-btn, .reload-btn {
    width: 100%;
    justify-content: center;
  }
}</style>
