import axios from 'axios';

// Backend API URL - sẽ tích hợp upload vào Spring Boot
const BACKEND_API_URL = 'http://localhost:8080';

// Upload ảnh lên Backend API (thay vì Upload Server)
export const uploadEventImage = async (file, onUploadProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    // Nếu có callback để track progress
    if (onUploadProgress) {
      config.onUploadProgress = (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(progress);
      };
    }

    // Gọi Backend API - KHÔNG CẦN Upload Server riêng
    const response = await axios.post(`${BACKEND_API_URL}/api/upload/event-image`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error);
    throw error;
  }
};

// Upload multiple images - gọi Backend API
export const uploadMultipleEventImages = async (files, onUploadProgress = null) => {
  try {
    console.log('=== DEBUG: uploadMultipleEventImages to Backend API ===');
    console.log('Files to upload:', files);
    console.log('Number of files:', files.length);
    
    const formData = new FormData();
    
    // Append multiple files
    for (let i = 0; i < files.length; i++) {
      console.log(`Appending file ${i}:`, files[i].name, 'Size:', files[i].size);
      formData.append('images', files[i]);
    }
    
    console.log('FormData created, calling Backend API...');
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onUploadProgress) {
      config.onUploadProgress = (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(progress);
      };
    }

    // Gọi Backend API - KHÔNG CẦN Upload Server riêng
    const response = await axios.post(`${BACKEND_API_URL}/api/upload/event-images`, formData, config);
    
    console.log('=== DEBUG: Upload response from Backend ===');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('=== DEBUG: Upload error ===');
    console.error('Error:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Xóa ảnh từ Backend API
export const deleteEventImage = async (imageUrl) => {
  try {
    // Gọi Backend API - KHÔNG CẦN Upload Server riêng
    const response = await axios.delete(`${BACKEND_API_URL}/api/upload/event-image`, {
      data: { imageUrl },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa ảnh:', error);
    throw error;
  }
};

// Validate ảnh trước khi upload
export const validateImage = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const minWidth = 200;
  const minHeight = 200;

  return new Promise((resolve, reject) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      reject(new Error('File type not allowed. Please upload JPG, PNG, GIF, or WebP images.'));
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      reject(new Error('File size too large. Maximum size is 5MB.'));
      return;
    }

    // Check image dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width < minWidth || img.height < minHeight) {
        reject(new Error(`Image dimensions too small. Minimum size is ${minWidth}x${minHeight}px.`));
        return;
      }
      
      resolve({
        isValid: true,
        dimensions: {
          width: img.width,
          height: img.height
        },
        size: file.size,
        type: file.type
      });
    };
    
    img.onerror = () => {
      reject(new Error('Invalid image file.'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Compress ảnh trước khi upload (optional)
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(resolve, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Tạo thumbnail từ ảnh
export const generateThumbnail = (file, width = 300, height = 200) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      
      // Calculate crop area to maintain aspect ratio
      const imgRatio = img.width / img.height;
      const canvasRatio = width / height;
      
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      
      if (imgRatio > canvasRatio) {
        // Image is wider, crop width
        sw = img.height * canvasRatio;
        sx = (img.width - sw) / 2;
      } else {
        // Image is taller, crop height
        sh = img.width / canvasRatio;
        sy = (img.height - sh) / 2;
      }
      
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
      
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
