import axios from '@/utils/axios';

// Lấy danh sách đơn hàng của user (không phân trang)
export const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(`/api/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user orders error:', error);
    throw error;
  }
};

// Lấy danh sách đơn hàng của user (có phân trang)
export const getUserOrdersPaginated = async (userId, page = 0, size = 10) => {
  try {
    const response = await axios.get(`/api/orders/user/${userId}/pagination?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Get user orders paginated error:', error);
    throw error;
  }
};

// Hủy đơn hàng
export const cancelOrder = async (orderId, reason, userId) => {
  try {
    const response = await axios.patch(`/api/orders/${orderId}/cancel?reason=${encodeURIComponent(reason)}&userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Cancel order error:', error);
    throw error;
  }
};

// Lấy chi tiết đơn hàng
export const getOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(`/api/orders/${orderId}/detail`);
    return response.data;
  } catch (error) {
    console.error('Get order details error:', error);
    throw error;
  }
};

// Format order status display
export const formatOrderStatus = (status) => {
  const statusMap = {
    'PENDING': 'Chờ xử lý',
    'CONFIRMED': 'Đã xác nhận', 
    'SHIPPED': 'Đang giao hàng',
    'DELIVERED': 'Đã giao hàng',
    'CANCELED': 'Đã hủy',
    'REFUNDING': 'Đang hoàn tiền',
    'REFUNDED': 'Đã hoàn tiền',
    'RETURNED': 'Đã trả hàng',
    'PARTIALLY_REFUNDED': 'Hoàn tiền một phần',
    'GOODS_RETURNED_TO_WAREHOUSE': 'Hàng đã về kho'
  };
  return statusMap[status] || status;
};

// Get order status class for UI
export const getOrderStatusClass = (status) => {
  const statusClasses = {
    'PENDING': 'status-pending',
    'CONFIRMED': 'status-processing', 
    'SHIPPED': 'status-shipping',
    'DELIVERED': 'status-completed',
    'CANCELED': 'status-cancelled',
    'REFUNDING': 'status-pending',
    'REFUNDED': 'status-returned',
    'RETURNED': 'status-returned',
    'PARTIALLY_REFUNDED': 'status-returned',
    'GOODS_RETURNED_TO_WAREHOUSE': 'status-warehouse'
  };
  return statusClasses[status] || '';
};

// Check if order can be cancelled
export const canCancelOrder = (orderStatus) => {
  return orderStatus === 'PENDING';
};

// Check if order can be refunded  
export const canRefundOrder = (orderStatus) => {
  return orderStatus === 'DELIVERED';
};

// ===== REFUND APIs theo tài liệu =====

// Khách hàng gửi yêu cầu hoàn trả (có admin xem xét)
export const requestRefund = async (orderId, refundData) => {
  try {
    console.log('=== DEBUG: Client requesting refund ===');
    console.log('Order ID:', orderId);
    console.log('Refund data:', JSON.stringify(refundData, null, 2));
    
    const response = await axios.post(`/api/orders/${orderId}/request-refund`, refundData);
    console.log('=== DEBUG: Client refund request response ===');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Client refund request error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
};

// Upload ảnh minh chứng hoàn hàng (tối đa 10 ảnh, mỗi ảnh ≤ 5MB)
export const uploadRefundImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
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
      formData.append('files', file);
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

// Upload cả ảnh và video minh chứng hoàn hàng
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
    console.error('Upload refund mixed evidence error:', error);
    throw error;
  }
};
