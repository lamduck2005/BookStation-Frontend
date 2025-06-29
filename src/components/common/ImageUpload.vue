<template>
  <div class="image-upload-component">
    <!-- Current Image Display -->
    <div v-if="currentImageUrl && !isEditing" class="current-image-section mb-3">
      <label class="form-label">{{ label }}</label>
      <div class="current-image-container">
        <img 
          :src="currentImageUrl" 
          :alt="label"
          class="current-image"
          @error="handleImageError"
        />
        <div class="image-overlay">
          <button 
            type="button" 
            class="btn btn-sm btn-primary"
            @click="startEditing"
          >
            <i class="bi bi-pencil me-1"></i>Thay đổi
          </button>
          <button 
            type="button" 
            class="btn btn-sm btn-danger ms-2"
            @click="removeImage"
          >
            <i class="bi bi-trash me-1"></i>Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Section -->
    <div v-if="!currentImageUrl || isEditing">
      <label class="form-label">{{ label }}</label>
      
      <!-- Method Selection -->
      <div class="mb-3">
        <div class="btn-group" role="group">
          <input 
            type="radio" 
            class="btn-check" 
            id="method-url" 
            v-model="uploadMethod" 
            value="url"
          >
          <label class="btn btn-outline-primary" for="method-url">
            <i class="bi bi-link-45deg me-1"></i>URL
          </label>

          <input 
            type="radio" 
            class="btn-check" 
            id="method-upload" 
            v-model="uploadMethod" 
            value="upload"
          >
          <label class="btn btn-outline-primary" for="method-upload">
            <i class="bi bi-cloud-upload me-1"></i>Upload
          </label>
        </div>
      </div>

      <!-- URL Input Method -->
      <div v-if="uploadMethod === 'url'" class="url-input-section">
        <div class="input-group mb-3">
          <input 
            type="url" 
            class="form-control" 
            v-model="tempImageUrl"
            placeholder="Nhập URL ảnh (https://example.com/image.jpg)"
          />
          <button 
            class="btn btn-outline-secondary" 
            type="button"
            @click="previewUrl"
          >
            <i class="bi bi-eye"></i>
          </button>
        </div>
      </div>

      <!-- File Upload Method -->
      <div v-if="uploadMethod === 'upload'" class="file-upload-section">
        <!-- File Input -->
        <input 
          type="file" 
          class="form-control mb-3" 
          ref="fileInput"
          accept="image/*"
          @change="handleFileSelect"
        />

        <!-- Drag & Drop Area -->
        <div 
          class="upload-dropzone"
          :class="{ 'dragover': isDragOver }"
          @drop="handleDrop"
          @dragover.prevent="isDragOver = true"
          @dragleave="isDragOver = false"
          @dragenter.prevent
          @click="triggerFileInput"
        >
          <div class="text-center py-3">
            <i class="bi bi-cloud-upload display-6 text-muted"></i>
            <p class="mt-2 mb-0">Kéo thả ảnh vào đây hoặc click để chọn</p>
            <small class="text-muted">{{ acceptedFormats }}</small>
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploadProgress > 0" class="mt-3">
          <div class="progress">
            <div 
              class="progress-bar bg-success" 
              :style="{ width: uploadProgress + '%' }"
            >
              {{ uploadProgress }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div v-if="previewImage" class="preview-section mt-3">
        <div class="preview-container">
          <img 
            :src="previewImage" 
            alt="Preview"
            class="preview-image"
            @error="handlePreviewError"
          />
        </div>
        <div class="preview-info mt-2">
          <small class="text-muted">
            <span v-if="selectedFile">
              {{ selectedFile.name }} - {{ formatFileSize(selectedFile.size) }}
            </span>
            <span v-else>
              URL Preview
            </span>
          </small>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons mt-3">
        <button 
          type="button"
          class="btn btn-success"
          :disabled="!canSave || isUploading"
          @click="saveImage"
        >
          <i class="bi bi-check-lg me-1"></i>
          <span v-if="isUploading">Đang upload...</span>
          <span v-else>{{ isEditing ? 'Cập nhật' : 'Lưu ảnh' }}</span>
        </button>
        
        <button 
          type="button"
          class="btn btn-secondary ms-2"
          @click="cancelEdit"
        >
          <i class="bi bi-x-lg me-1"></i>Hủy
        </button>
        
        <button 
          type="button"
          class="btn btn-outline-danger ms-2"
          v-if="previewImage"
          @click="clearPreview"
        >
          <i class="bi bi-trash me-1"></i>Xóa preview
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { uploadEventImage, validateImage, compressImage } from '@/services/admin/upload';
import Swal from 'sweetalert2';

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Hình ảnh'
  },
  required: {
    type: Boolean,
    default: false
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  acceptedTypes: {
    type: Array,
    default: () => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  },
  autoCompress: {
    type: Boolean,
    default: true
  },
  maxWidth: {
    type: Number,
    default: 1200
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error']);

// Reactive data
const currentImageUrl = ref(props.modelValue);
const isEditing = ref(false);
const uploadMethod = ref('upload');
const tempImageUrl = ref('');
const selectedFile = ref(null);
const previewImage = ref('');
const isUploading = ref(false);
const uploadProgress = ref(0);
const isDragOver = ref(false);
const fileInput = ref(null);

// Computed
const acceptedFormats = computed(() => {
  return `Hỗ trợ: ${props.acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}`;
});

const canSave = computed(() => {
  if (uploadMethod.value === 'url') {
    return tempImageUrl.value.trim() !== '';
  } else {
    return selectedFile.value !== null;
  }
});

// Watch props
watch(() => props.modelValue, (newValue) => {
  currentImageUrl.value = newValue;
});

// Methods
const startEditing = () => {
  isEditing.value = true;
  resetForm();
};

const cancelEdit = () => {
  isEditing.value = false;
  resetForm();
};

const resetForm = () => {
  tempImageUrl.value = '';
  selectedFile.value = null;
  previewImage.value = '';
  uploadProgress.value = 0;
  isDragOver.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectFile(file);
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    selectFile(files[0]);
  }
};

const selectFile = async (file) => {
  try {
    // Validate file
    const validation = await validateImage(file);
    console.log('File validation:', validation);
    
    selectedFile.value = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
    
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'File không hợp lệ',
      text: error.message
    });
  }
};

const previewUrl = () => {
  if (!tempImageUrl.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Chưa nhập URL',
      text: 'Vui lòng nhập URL ảnh để preview'
    });
    return;
  }
  
  previewImage.value = tempImageUrl.value;
};

const saveImage = async () => {
  try {
    let finalImageUrl = '';
    
    if (uploadMethod.value === 'url') {
      // Use URL directly
      finalImageUrl = tempImageUrl.value;
    } else {
      // Upload file
      isUploading.value = true;
      uploadProgress.value = 0;
      
      let fileToUpload = selectedFile.value;
      
      // Compress if needed
      if (props.autoCompress && selectedFile.value.size > 1024 * 1024) {
        fileToUpload = await compressImage(selectedFile.value, props.maxWidth);
      }
      
      const response = await uploadEventImage(fileToUpload, (progress) => {
        uploadProgress.value = progress;
      });
      
      finalImageUrl = response.data.url || response.url;
    }
    
    // Update values
    currentImageUrl.value = finalImageUrl;
    emit('update:modelValue', finalImageUrl);
    emit('upload-success', finalImageUrl);
    
    isEditing.value = false;
    resetForm();
    
    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: 'Ảnh đã được lưu thành công.',
      timer: 2000,
      showConfirmButton: false
    });
    
  } catch (error) {
    console.error('Save image error:', error);
    emit('upload-error', error);
    
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: error.response?.data?.message || 'Có lỗi xảy ra khi lưu ảnh.'
    });
  } finally {
    isUploading.value = false;
  }
};

const removeImage = () => {
  Swal.fire({
    title: 'Xác nhận xóa',
    text: 'Bạn có chắc chắn muốn xóa ảnh này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  }).then((result) => {
    if (result.isConfirmed) {
      currentImageUrl.value = '';
      emit('update:modelValue', '');
      
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa!',
        text: 'Ảnh đã được xóa.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
};

const clearPreview = () => {
  previewImage.value = '';
  selectedFile.value = null;
  tempImageUrl.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const handleImageError = () => {
  Swal.fire({
    icon: 'error',
    title: 'Lỗi tải ảnh',
    text: 'Không thể tải ảnh. Vui lòng kiểm tra lại URL.'
  });
};

const handlePreviewError = () => {
  previewImage.value = '';
  Swal.fire({
    icon: 'error',
    title: 'Lỗi preview',
    text: 'Không thể hiển thị ảnh preview.'
  });
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped>
.image-upload-component {
  width: 100%;
}

.current-image-container {
  position: relative;
  display: inline-block;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #dee2e6;
}

.current-image {
  max-width: 200px;
  max-height: 150px;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.current-image-container:hover .image-overlay {
  opacity: 1;
}

.upload-dropzone {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-dropzone:hover,
.upload-dropzone.dragover {
  border-color: #0d6efd;
  background-color: #e7f3ff;
}

.preview-container {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8f9fa;
  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 6px;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.btn-group .btn-check:checked + .btn {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.progress {
  height: 8px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@media (max-width: 576px) {
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons .btn {
    margin: 0.25rem 0 !important;
  }
}
</style>
