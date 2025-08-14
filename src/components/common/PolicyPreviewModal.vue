<template>
  <div 
    v-if="show" 
    class="policy-preview-modal"
    @click="closePreview"
  >
    <div 
      class="modal-content policy-preview-content" 
      @click.stop
    >
      <div class="policy-preview-header">
        <h5 class="policy-preview-title">
          <i class="bi bi-shield-check text-primary me-2"></i>
          Chính sách BookStation
        </h5>
        <button 
          type="button" 
          class="btn-close" 
          @click="closePreview"
        ></button>
      </div>
      
      <div class="policy-preview-body">
        <!-- Sử dụng lại component PoliciesPage nhưng ẩn hero section -->
        <PoliciesPage :isModal="true" />
        
        <!-- Quick actions ở bottom -->
        <div class="quick-actions">
          <button 
            class="btn btn-outline-secondary btn-sm me-2"
            @click="closePreview"
          >
            <i class="bi bi-x-lg me-1"></i>
            Đóng
          </button>
          <RouterLink 
            to="/policies" 
            class="btn btn-primary btn-sm"
            @click="closePreview"
          >
            <i class="bi bi-book me-1"></i>
            Đọc chi tiết
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PoliciesPage from '@/views/client/PoliciesPage.vue'

export default {
  name: 'PolicyPreviewModal',
  components: {
    PoliciesPage
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  methods: {
    closePreview() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.policy-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(3px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.policy-preview-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 900px;
  width: 95%;
  max-height: 85vh;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
  border: 1px solid #e9ecef;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.policy-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.policy-preview-title {
  margin: 0;
  color: #495057;
  font-weight: 600;
  font-size: 1.2rem;
}

.btn-close {
  padding: 0.5rem;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-close:hover {
  opacity: 1;
}

.policy-preview-body {
  overflow-y: auto;
  max-height: calc(85vh - 80px);
  padding: 0;
}

/* Override styles for modal version */
.policy-preview-body :deep(.hero-section) {
  display: none;
}

.policy-preview-body :deep(.policies-page) {
  padding: 0;
  background: transparent;
}

.policy-preview-body :deep(.container) {
  max-width: 100%;
  padding: 1rem;
}

.policy-preview-body :deep(.policy-nav) {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 5;
  padding: 1rem;
  margin: -1rem -1rem 1rem -1rem;
  border-bottom: 1px solid #e9ecef;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .policy-preview-modal {
    padding: 0.5rem;
  }
  
  .policy-preview-content {
    max-width: 100%;
    width: 100%;
    max-height: 95vh;
    border-radius: 8px;
  }
  
  .policy-preview-header {
    padding: 0.75rem 1rem;
  }
  
  .policy-preview-title {
    font-size: 1rem;
  }
  
  .policy-preview-body :deep(.container) {
    padding: 0.75rem;
  }
  
  .policy-preview-body :deep(.policy-nav) {
    padding: 0.75rem;
    margin: -0.75rem -0.75rem 0.75rem -0.75rem;
  }
}

/* Scrollbar styling */
.policy-preview-body::-webkit-scrollbar {
  width: 6px;
}

.policy-preview-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.policy-preview-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.policy-preview-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
