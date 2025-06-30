<template>
  <div class="multi-image-upload-component">
    <div class="form-group">
      <label class="form-label">{{ label }}</label>
      
      <!-- Hiển thị ảnh hiện tại -->
      <div v-if="currentImages.length > 0" class="images-grid mb-3">
        <div 
          v-for="(imageUrl, index) in currentImages" 
          :key="index"
          class="image-item"
        >
          <img 
            :src="imageUrl" 
            :alt="`Image ${index + 1}`"
            class="current-image"
            @error="handleImageError(index)"
          />
          <div class="image-overlay">
            <button 
              type="button" 
              class="btn btn-sm btn-danger"
              @click="removeImage(index)"
              title="Xóa ảnh"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Upload dropzone -->
      <div 
        v-if="currentImages.length < maxFiles"
        class="upload-dropzone p-4 text-center"
        :class="{ 'dragover': isDragOver }"
        @click="triggerFileInput"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
      >
        <div v-if="!isUploading">
          <i class="fas fa-images fa-3x text-muted mb-3"></i>
          <p class="mb-2">Click để chọn ảnh hoặc kéo thả vào đây</p>
          <small class="text-muted">
            {{ acceptedFormats }} - Tối đa {{ maxFiles }} ảnh - Mỗi ảnh tối đa {{ formatFileSize(maxSize) }}
          </small>
          <br>
          <small class="text-info">Hiện có {{ currentImages.length }}/{{ maxFiles }} ảnh</small>
        </div>
        <div v-else>
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Đang upload...</span>
          </div>
          <p class="mb-2">Đang upload {{ uploadingCount }} ảnh...</p>
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

      <!-- Thông báo khi đã đủ ảnh -->
      <div v-if="currentImages.length >= maxFiles" class="alert alert-info">
        <i class="fas fa-info-circle"></i> Đã đạt tối đa {{ maxFiles }} ảnh
      </div>

      <!-- File input ẩn -->
      <input
        ref="fileInput"
        type="file"
        class="d-none"
        :accept="acceptedTypes.join(',')"
        multiple
        @change="handleFileSelect"
      />

      <!-- Preview các ảnh đang upload -->
      <div v-if="previewImages.length > 0" class="preview-grid mt-3">
        <div 
          v-for="(preview, index) in previewImages" 
          :key="index"
          class="preview-item"
        >
          <img :src="preview.url" :alt="`Preview ${index + 1}`" class="preview-image" />
          <div class="preview-info">
            <small class="text-info">Uploading...</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { uploadMultipleImages, validateImage, compressImage } from '@/services/common/upload';
import Swal from 'sweetalert2';

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: 'Hình ảnh'
  },
  maxFiles: {
    type: Number,
    default: 5
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB per file
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
  },
  uploadEndpoint: {
    type: String,
    default: 'event-images'
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error']);

// Reactive data
const currentImages = ref([...props.modelValue]);
const previewImages = ref([]);
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadingCount = ref(0);
const isDragOver = ref(false);
const fileInput = ref(null);

// Computed
const acceptedFormats = computed(() => {
  return `Hỗ trợ: ${props.acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}`;
});

// Watch props
watch(() => props.modelValue, (newValue) => {
  currentImages.value = [...newValue];
});

// Methods
const triggerFileInput = () => {
  if (currentImages.value.length >= props.maxFiles) {
    Swal.fire({
      icon: 'warning',
      title: 'Thông báo',
      text: `Chỉ được phép tối đa ${props.maxFiles} ảnh`
    });
    return;
  }
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    selectAndUploadFiles(files);
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  
  const files = Array.from(event.dataTransfer.files);
  if (files.length > 0) {
    selectAndUploadFiles(files);
  }
};

const selectAndUploadFiles = async (files) => {
  try {
    // Kiểm tra số lượng file
    const availableSlots = props.maxFiles - currentImages.value.length;
    if (files.length > availableSlots) {
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: `Chỉ có thể thêm ${availableSlots} ảnh nữa. Bạn đã chọn ${files.length} ảnh.`
      });
      return;
    }

    // Validate tất cả file trước
    const validFiles = [];
    for (const file of files) {
      try {
        await validateImage(file);
        validFiles.push(file);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'File không hợp lệ',
          text: `${file.name}: ${error.message}`
        });
        return;
      }
    }

    // Tạo preview cho tất cả file
    const previews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file: file
    }));
    
    previewImages.value = previews;

    // Bắt đầu upload
    isUploading.value = true;
    uploadingCount.value = validFiles.length;
    uploadProgress.value = 0;

    // Compress files nếu cần
    const filesToUpload = [];
    for (const file of validFiles) {
      let fileToUpload = file;
      if (props.autoCompress && file.size > 500 * 1024) { // Compress if > 500KB
        console.log('Compressing image:', file.name);
        fileToUpload = await compressImage(file, props.maxWidth, props.compressionQuality);
      }
      filesToUpload.push(fileToUpload);
    }

    // Upload tất cả files
    const response = await uploadMultipleImages(filesToUpload, props.uploadEndpoint, (progress) => {
      uploadProgress.value = Math.round(progress);
    });

    console.log('Upload response:', response);

    if (response.success && response.urls && response.urls.length > 0) {
      // Thêm URLs vào danh sách hiện tại
      const newImages = [...currentImages.value, ...response.urls];
      currentImages.value = newImages;
      
      // Emit update to parent
      emit('update:modelValue', newImages);
      emit('upload-success', response.urls);
      
      // Clear previews
      previewImages.value = [];
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: `Upload ${response.urls.length} ảnh thành công`,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      throw new Error('Upload failed');
    }

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clear previews on error
    previewImages.value = [];
    
    emit('upload-error', error);
    
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: error.message || 'Không thể upload ảnh. Vui lòng thử lại.'
    });
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
    uploadingCount.value = 0;
    
    // Clear file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const removeImage = (index) => {
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
      currentImages.value.splice(index, 1);
      emit('update:modelValue', currentImages.value);
      
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

const handleImageError = (index) => {
  console.error(`Failed to load image at index ${index}`);
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
.multi-image-upload-component {
  width: 100%;
  max-width: 100%;
}

.multi-image-upload-component * {
  box-sizing: border-box;
}

.images-grid,
.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
  max-width: 100%;
}

.image-item,
.preview-item {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  width: 80px;
  height: 80px;
}

.current-image,
.preview-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  display: block;
  border-radius: 4px;
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

.image-item:hover .image-overlay {
  opacity: 1;
}

.preview-info {
  padding: 4px;
  background: white;
  border-top: 1px solid #dee2e6;
  font-size: 0.7rem;
  text-align: center;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-info small {
  margin: 0;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 76px;
}

.upload-dropzone {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 100px;
  padding: 1.5rem;
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

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.progress {
  height: 8px;
  width: 200px;
}

/* Đảm bảo ảnh luôn nhỏ gọn như ban đầu */
.multi-image-upload-component .image-item,
.multi-image-upload-component .preview-item {
  width: 80px !important;
  height: 80px !important;
  max-width: 80px !important;
  max-height: 80px !important;
}

.multi-image-upload-component .current-image,
.multi-image-upload-component .preview-image {
  width: 80px !important;
  height: 60px !important;
  max-width: 80px !important;
  max-height: 60px !important;
  object-fit: cover !important;
}

@media (max-width: 576px) {
  .images-grid,
  .preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 8px;
  }
  
  .image-item,
  .preview-item {
    width: 70px !important;
    height: 70px !important;
  }
  
  .current-image,
  .preview-image {
    width: 70px !important;
    height: 50px !important;
  }
  
  .upload-dropzone {
    min-height: 80px;
    padding: 2rem;
  }
  
  .preview-info {
    height: 20px;
    font-size: 0.65rem;
  }
}
</style>
