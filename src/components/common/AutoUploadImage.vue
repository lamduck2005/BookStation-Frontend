<template>
  <div class="auto-upload-image-component">
    <div class="form-group">
      <label class="form-label">{{ label }} <span v-if="required" class="text-danger">*</span></label>
      
      <!-- Hiển thị ảnh hiện tại -->
      <div v-if="currentImageUrl" class="current-image-container mb-3">
        <img 
          :src="currentImageUrl" 
          :alt="label"
          class="current-image"
          @error="handleImageError"
        />
        <div class="image-overlay">
          <button 
            type="button" 
            class="btn btn-sm btn-danger"
            @click="removeImage"
            title="Xóa ảnh"
          >
            <i class="fas fa-trash"></i>
          </button>
          <button 
            type="button" 
            class="btn btn-sm btn-primary ms-2"
            @click="triggerFileInput"
            title="Thay đổi ảnh"
          >
            <i class="fas fa-edit"></i>
          </button>
        </div>
      </div>

      <!-- Upload dropzone khi chưa có ảnh -->
      <div 
        v-else
        class="upload-dropzone p-4 text-center"
        :class="{ 'dragover': isDragOver }"
        @click="triggerFileInput"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
      >
        <div v-if="!isUploading">
          <i class="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
          <p class="mb-2">Click để chọn ảnh hoặc kéo thả vào đây</p>
          <small class="text-muted">{{ acceptedFormats }} - Tối đa {{ formatFileSize(maxSize) }}</small>
        </div>
        <div v-else>
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Đang upload...</span>
          </div>
          <p class="mb-2">Đang upload ảnh...</p>
          <div class="progress mb-2">
            <div 
              class="progress-bar" 
              role="progressbar" 
              :style="{ width: uploadProgress + '%' }"
            >
              {{ uploadProgress }}%
            </div>
          </div>
        </div>
      </div>

      <!-- File input ẩn -->
      <input
        ref="fileInput"
        type="file"
        class="d-none"
        :accept="acceptedTypes.join(',')"
        @change="handleFileSelect"
      />

      <!-- Preview ảnh được chọn (trước khi upload) -->
      <div v-if="previewImage && !currentImageUrl" class="preview-container mt-3">
        <img :src="previewImage" alt="Preview" class="preview-image" @error="handlePreviewError" />
        <div class="preview-info mt-2">
          <small class="text-muted">Preview - Đang upload...</small>
        </div>
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
  },
  compressionQuality: {
    type: Number,
    default: 0.8
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error']);

// Reactive data
const currentImageUrl = ref(props.modelValue);
const previewImage = ref('');
const isUploading = ref(false);
const uploadProgress = ref(0);
const isDragOver = ref(false);
const fileInput = ref(null);

// Computed
const acceptedFormats = computed(() => {
  return `Hỗ trợ: ${props.acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}`;
});

// Watch props
watch(() => props.modelValue, (newValue) => {
  currentImageUrl.value = newValue;
});

// Methods
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectAndUploadFile(file);
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    selectAndUploadFile(files[0]);
  }
};

const selectAndUploadFile = async (file) => {
  try {
    // Validate file
    const validation = await validateImage(file);
    console.log('File validation:', validation);

    // Show preview immediately
    previewImage.value = URL.createObjectURL(file);
    
    // Start upload process
    isUploading.value = true;
    uploadProgress.value = 0;

    let fileToUpload = file;
    
    // Compress if needed
    if (props.autoCompress && file.size > 500 * 1024) { // Compress if > 500KB
      console.log('Compressing image...');
      fileToUpload = await compressImage(file, props.maxWidth, props.compressionQuality);
    }

    // Upload to server
    const response = await uploadEventImage(fileToUpload, (progress) => {
      uploadProgress.value = Math.round(progress);
    });

    console.log('Upload response:', response);

    if (response.success && response.url) {
      // Update current image URL
      currentImageUrl.value = response.url;
      
      // Emit update to parent
      emit('update:modelValue', response.url);
      emit('upload-success', response.url);
      
      // Clear preview
      previewImage.value = '';
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Upload ảnh thành công',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      throw new Error('Upload failed');
    }

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clear preview on error
    previewImage.value = '';
    
    emit('upload-error', error);
    
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: error.message || 'Không thể upload ảnh. Vui lòng thử lại.'
    });
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
    
    // Clear file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const removeImage = () => {
  Swal.fire({
    title: 'Bạn có chắc chắn?',
    text: 'Bạn muốn xóa ảnh này?',
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

const handleImageError = () => {
  Swal.fire({
    icon: 'error',
    title: 'Lỗi!',
    text: 'Không thể tải ảnh. Vui lòng kiểm tra lại URL.'
  });
};

const handlePreviewError = () => {
  previewImage.value = '';
  Swal.fire({
    icon: 'error',
    title: 'Lỗi!',
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
.auto-upload-image-component {
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
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  flex-direction: column;
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

.progress {
  height: 8px;
  width: 200px;
}

@media (max-width: 576px) {
  .current-image {
    max-width: 150px;
    max-height: 100px;
  }
  
  .upload-dropzone {
    min-height: 100px;
  }
  
  .preview-container {
    max-width: 250px;
  }
}
</style>
