import axios from '@/utils/axios';

// ===== REFUND APIs THEO TÀI LIỆU MỚI =====

// 🔹 STEP 1: Upload minh chứng (Optional) - Mixed Evidence theo tài liệu
export const uploadRefundMixedEvidence = async (images, videos) => {
  try {
    const formData = new FormData();
    
    if (images && images.length > 0) {
      images.forEach(file => {
        formData.append('images', file);
      });
    }
    
    if (videos && videos.length > 0) {
      videos.forEach(file => {
        formData.append('videos', file);
      });
    }
    
    const response = await axios.post('/api/refund-evidence/mixed', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload mixed refund evidence error:', error);
    throw error;
  }
};

// Upload ảnh minh chứng hoàn hàng (tối đa 10 ảnh, mỗi ảnh ≤ 5MB)
export const uploadRefundImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await axios.post('/api/refund-evidence/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload refund images error:', error);
    throw error;
  }
};

// Upload video minh chứng hoàn hàng (tối đa 3 video, mỗi video ≤ 50MB)
export const uploadRefundVideos = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('videos', file);
    });
    
    const response = await axios.post('/api/refund-evidence/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload refund videos error:', error);
    throw error;
  }
};

// 🔹 STEP 2: Kiểm tra điều kiện hoàn hàng
export const validateRefundConditions = async (orderId, userId) => {
  try {
    const response = await axios.get(`/api/refunds/validate/${orderId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Validate refund conditions error:', error);
    throw error;
  }
};

// 🔹 STEP 3: Tạo yêu cầu hoàn hàng - API MỚI THEO TÀI LIỆU
export const createRefundRequest = async (userId, refundData) => {
  try {
    console.log('=== DEBUG: Creating refund request ===');
    console.log('User ID:', userId);
    console.log('Refund data:', refundData);
    
    const response = await axios.post(`/api/refunds?userId=${userId}`, refundData);
    console.log('=== DEBUG: Refund request response ===');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Create refund request error:', error);
    throw error;
  }
};

// 📝 USER THEO DÕI YÊU CẦU HOÀN HÀNG

// Lấy danh sách yêu cầu hoàn hàng của user
export const getUserRefunds = async (userId, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/refunds/user/${userId}?${queryString}` : `/api/refunds/user/${userId}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Get user refunds error:', error);
    throw error;
  }
};

// Lấy chi tiết yêu cầu hoàn trả
export const getRefundDetail = async (refundRequestId, userId) => {
  try {
    const response = await axios.get(`/api/refunds/${refundRequestId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get refund detail error:', error);
    throw error;
  }
};

// ===== ENUMS VÀ CONSTANTS =====

// Lý do hoàn hàng theo tài liệu
export const REFUND_REASONS = {
  PRODUCT_DEFECT: { value: 'PRODUCT_DEFECT', display: 'Sản phẩm bị lỗi' },
  NOT_AS_DESCRIBED: { value: 'NOT_AS_DESCRIBED', display: 'Không đúng mô tả' },
  DAMAGED_SHIPPING: { value: 'DAMAGED_SHIPPING', display: 'Hư hỏng trong vận chuyển' },
  WRONG_ITEM: { value: 'WRONG_ITEM', display: 'Gửi sai sản phẩm' },
  QUALITY_ISSUE: { value: 'QUALITY_ISSUE', display: 'Vấn đề chất lượng' },
  OTHER: { value: 'OTHER', display: 'Khác' }
};

// Loại hoàn hàng
export const REFUND_TYPES = {
  FULL: { value: 'FULL', display: 'Hoàn trả toàn bộ' },
  PARTIAL: { value: 'PARTIAL', display: 'Hoàn trả một phần' }
};

// Trạng thái hoàn hàng
export const REFUND_STATUS = {
  PENDING: { value: 'PENDING', display: 'Chờ phê duyệt' },
  APPROVED: { value: 'APPROVED', display: 'Đã phê duyệt' },
  REJECTED: { value: 'REJECTED', display: 'Đã từ chối' },
  COMPLETED: { value: 'COMPLETED', display: 'Hoàn thành' }
};

// Validation rules theo tài liệu
export const VALIDATION_RULES = {
  CUSTOMER_NOTE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000
  },
  EVIDENCE_IMAGES: {
    MAX_COUNT: 10,
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    VALID_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  },
  EVIDENCE_VIDEOS: {
    MAX_COUNT: 3,
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    VALID_FORMATS: ['video/mp4', 'video/avi', 'video/mov']
  }
};

// Helper functions
export const getRefundReasonOptions = () => {
  return Object.values(REFUND_REASONS);
};

export const getRefundTypeOptions = () => {
  return Object.values(REFUND_TYPES);
};

export const validateRefundForm = (refundData) => {
  const errors = [];
  
  // Validate customer note
  if (!refundData.customerNote || refundData.customerNote.length < VALIDATION_RULES.CUSTOMER_NOTE.MIN_LENGTH) {
    errors.push(`Ghi chú phải có ít nhất ${VALIDATION_RULES.CUSTOMER_NOTE.MIN_LENGTH} ký tự`);
  }
  
  if (refundData.customerNote && refundData.customerNote.length > VALIDATION_RULES.CUSTOMER_NOTE.MAX_LENGTH) {
    errors.push(`Ghi chú không được vượt quá ${VALIDATION_RULES.CUSTOMER_NOTE.MAX_LENGTH} ký tự`);
  }
  
  // Validate refund items for partial refund
  if (refundData.refundType === 'PARTIAL' && (!refundData.refundItems || refundData.refundItems.length === 0)) {
    errors.push('Phải chọn ít nhất một sản phẩm để hoàn trả một phần');
  }
  
  return errors;
};

export const validateEvidenceFiles = (images = [], videos = []) => {
  const errors = [];
  
  // Validate images
  if (images.length > VALIDATION_RULES.EVIDENCE_IMAGES.MAX_COUNT) {
    errors.push(`Chỉ được tải tối đa ${VALIDATION_RULES.EVIDENCE_IMAGES.MAX_COUNT} ảnh`);
  }
  
  images.forEach((file, index) => {
    if (file.size > VALIDATION_RULES.EVIDENCE_IMAGES.MAX_SIZE) {
      errors.push(`Ảnh ${index + 1} quá lớn (tối đa 5MB)`);
    }
    
    if (!VALIDATION_RULES.EVIDENCE_IMAGES.VALID_FORMATS.includes(file.type)) {
      errors.push(`Ảnh ${index + 1} không đúng định dạng (cho phép: JPG, PNG, WebP)`);
    }
  });
  
  // Validate videos  
  if (videos.length > VALIDATION_RULES.EVIDENCE_VIDEOS.MAX_COUNT) {
    errors.push(`Chỉ được tải tối đa ${VALIDATION_RULES.EVIDENCE_VIDEOS.MAX_COUNT} video`);
  }
  
  videos.forEach((file, index) => {
    if (file.size > VALIDATION_RULES.EVIDENCE_VIDEOS.MAX_SIZE) {
      errors.push(`Video ${index + 1} quá lớn (tối đa 50MB)`);
    }
    
    if (!VALIDATION_RULES.EVIDENCE_VIDEOS.VALID_FORMATS.includes(file.type)) {
      errors.push(`Video ${index + 1} không đúng định dạng (cho phép: MP4, AVI, MOV)`);
    }
  });
  
  return errors;
};
