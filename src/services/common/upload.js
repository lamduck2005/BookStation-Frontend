import axios from 'axios';

// Backend API URL
const BACKEND_API_URL = 'http://localhost:8080';

// ============= GENERIC UPLOAD FUNCTIONS =============

/**
 * Upload single image - Generic function for any module
 * @param {File} file - Image file to upload
 * @param {string} moduleOrEndpoint - Module name (events, users, products, categories, orders, reviews) or old endpoint
 * @param {function} onUploadProgress - Progress callback
 * @returns {Promise} Upload response
 */
export const uploadSingleImage = async (file, moduleOrEndpoint = 'events', onUploadProgress = null) => {
  try {
    // Map old endpoint names to new module names for backward compatibility
    const endpointToModuleMap = {
      'event-image': 'events',
      'event-images': 'events',
      'product-image': 'products',
      'product-images': 'products',
      'user-avatar': 'users',
      'category-image': 'categories',
      'category-images': 'categories',
      'order-image': 'orders',
      'order-images': 'orders',
      'review-image': 'reviews',
      'review-images': 'reviews'
    };
    
    // Convert old endpoint to new module name if needed
    const module = endpointToModuleMap[moduleOrEndpoint] || moduleOrEndpoint;
    
    const formData = new FormData();
    formData.append('image', file);
    
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

    const response = await axios.post(`${BACKEND_API_URL}/api/upload/image/${module}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple images - Generic function for any module
 * @param {File[]} files - Array of image files
 * @param {string} moduleOrEndpoint - Module name (events, users, products, categories, orders, reviews) or old endpoint
 * @param {function} onUploadProgress - Progress callback
 * @returns {Promise} Upload response
 */
export const uploadMultipleImages = async (files, moduleOrEndpoint = 'events', onUploadProgress = null) => {
  try {
    // Map old endpoint names to new module names for backward compatibility
    const endpointToModuleMap = {
      'event-images': 'events',
      'event-image': 'events',
      'product-images': 'products', 
      'product-image': 'products',
      'user-avatar': 'users',
      'category-images': 'categories',
      'category-image': 'categories',
      'order-images': 'orders',
      'order-image': 'orders',
      'review-images': 'reviews',
      'review-image': 'reviews'
    };
    
    // Convert old endpoint to new module name if needed
    const module = endpointToModuleMap[moduleOrEndpoint] || moduleOrEndpoint;
    
    const formData = new FormData();
    
    // Append multiple files
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    
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

    console.log('=== UPLOAD DEBUG ===');
    console.log('Original moduleOrEndpoint:', moduleOrEndpoint);
    console.log('Mapped module:', module);
    console.log('Files count:', files.length);
    console.log('API URL:', `${BACKEND_API_URL}/api/upload/images/${module}`);

    try {
      // Try new API first
      const response = await axios.post(`${BACKEND_API_URL}/api/upload/images/${module}`, formData, config);
      console.log('New API success:', response.data);
      return response.data;
    } catch (newApiError) {
      console.log('New API failed, trying old API...', newApiError.message);
      
      // Fallback to old API if new API fails (according to API guide backward compatibility)
      let oldApiUrl;
      if (module === 'events') {
        oldApiUrl = `${BACKEND_API_URL}/api/upload/event-images`;
      } else if (module === 'products') {
        oldApiUrl = `${BACKEND_API_URL}/api/upload/product-images`;
      } else {
        // For other modules, try original endpoint if it was provided
        oldApiUrl = `${BACKEND_API_URL}/api/upload/${moduleOrEndpoint}`;
      }
      
      console.log('Trying old API URL:', oldApiUrl);
      
      try {
        const response = await axios.post(oldApiUrl, formData, config);
        console.log('Old API success:', response.data);
        return response.data;
      } catch (oldApiError) {
        console.error('Both APIs failed:');
        console.error('New API error:', newApiError.response?.data || newApiError.message);
        console.error('Old API error:', oldApiError.response?.data || oldApiError.message);
        throw newApiError; // Throw original error
      }
    }
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
};

/**
 * Delete image - Generic function
 * @param {string} imageUrl - URL of image to delete
 * @returns {Promise} Delete response
 */
export const deleteImage = async (imageUrl) => {
  try {
    const response = await axios.delete(`${BACKEND_API_URL}/api/upload/image`, {
      data: { imageUrl },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// ============= SPECIFIC FUNCTIONS FOR MODULES =============

// Event Images
export const uploadEventImage = (file, onUploadProgress) => 
  uploadSingleImage(file, 'events', onUploadProgress);

export const uploadMultipleEventImages = (files, onUploadProgress) => 
  uploadMultipleImages(files, 'events', onUploadProgress);

export const deleteEventImage = (imageUrl) => 
  deleteImage(imageUrl);

// Product Images
export const uploadProductImage = (file, onUploadProgress) => 
  uploadSingleImage(file, 'products', onUploadProgress);

export const uploadMultipleProductImages = (files, onUploadProgress) => 
  uploadMultipleImages(files, 'products', onUploadProgress);

export const deleteProductImage = (imageUrl) => 
  deleteImage(imageUrl);

// User Avatar
export const uploadUserAvatar = (file, onUploadProgress) => 
  uploadSingleImage(file, 'users', onUploadProgress);

export const deleteUserAvatar = (imageUrl) => 
  deleteImage(imageUrl);

// Category Images
export const uploadCategoryImage = (file, onUploadProgress) => 
  uploadSingleImage(file, 'categories', onUploadProgress);

export const deleteCategoryImage = (imageUrl) => 
  deleteImage(imageUrl);

// Order Images (if needed)
export const uploadOrderImage = (file, onUploadProgress) => 
  uploadSingleImage(file, 'orders', onUploadProgress);

export const uploadMultipleOrderImages = (files, onUploadProgress) => 
  uploadMultipleImages(files, 'orders', onUploadProgress);

export const deleteOrderImage = (imageUrl) => 
  deleteImage(imageUrl);

// Review Images
export const uploadReviewImage = (file, onUploadProgress) => 
  uploadSingleImage(file, 'reviews', onUploadProgress);

export const uploadMultipleReviewImages = (files, onUploadProgress) => 
  uploadMultipleImages(files, 'reviews', onUploadProgress);

export const deleteReviewImage = (imageUrl) => 
  deleteImage(imageUrl);

// ============= VALIDATION AND UTILITY FUNCTIONS =============

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @param {Object} options - Validation options
 * @returns {Promise} Validation result
 */
export const validateImage = (file, options = {}) => {
  const {
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    maxSize = 5 * 1024 * 1024, // 5MB
    minWidth = 200,
    minHeight = 200
  } = options;

  return new Promise((resolve, reject) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      reject(new Error('File type not allowed. Please upload JPG, PNG, GIF, or WebP images.'));
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      reject(new Error(`File size too large. Maximum size is ${(maxSize / (1024 * 1024)).toFixed(1)}MB.`));
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

/**
 * Compress image before upload
 * @param {File} file - Image file to compress
 * @param {number} maxWidth - Maximum width
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<File>} Compressed file
 */
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
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Convert bytes to human readable format
 * @param {number} bytes - Bytes to convert
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate preview URL for file
 * @param {File} file - File to generate preview for
 * @returns {string} Preview URL
 */
export const generatePreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revoke preview URL to free memory
 * @param {string} url - Preview URL to revoke
 */
export const revokePreviewUrl = (url) => {
  URL.revokeObjectURL(url);
};
