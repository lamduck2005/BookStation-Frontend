import axios from '@/utils/axios';

// Upload evidence cho refund
export const uploadRefundImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await axios.post('/api/upload/images/refund', formData, {
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

export const uploadRefundVideos = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('videos', file);
    });
    
    const response = await axios.post('/api/upload/videos/refund', formData, {
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

// Tạo yêu cầu hoàn hàng
export const createRefundRequest = async (refundData, userId) => {
  try {
    const response = await axios.post(`/api/refunds/create?userId=${userId}`, refundData);
    return response.data;
  } catch (error) {
    console.error('Create refund request error:', error);
    throw error;
  }
};

// Lấy danh sách yêu cầu hoàn hàng của user
export const getUserRefunds = async (userId) => {
  try {
    const response = await axios.get(`/api/refunds/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user refunds error:', error);
    throw error;
  }
};
