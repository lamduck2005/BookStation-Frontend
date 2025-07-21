import client from '@/utils/axios';

// ===== ORDER CALCULATION & VALIDATION APIs =====

// API tính toán đơn hàng trước khi tạo (xem trước chi phí)
export const calculateOrder = async (orderData) => {
  try {
    console.log('=== DEBUG: Calculating order preview ===');
    console.log('Calculation data:', orderData);
    
    const response = await client.post('/api/orders/calculate', orderData);
    console.log('=== DEBUG: Order calculation response ===');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tính toán đơn hàng:', error);
    throw error;
  }
};

// API validate đơn hàng trước khi tạo
export const validateOrder = async (orderData) => {
  try {
    const response = await client.post('/api/orders/validate', orderData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi validate đơn hàng:', error);
    throw error;
  }
};

// ✅ API validate giá sản phẩm - THEO TÀI LIỆU MỚI
export const validatePrices = async (orderData) => {
  try {
    console.log('=== DEBUG: Validating prices ===');
    console.log('Order data for validation:', orderData);
    
    const response = await client.post('/api/orders/validate-prices', orderData);
    console.log('=== DEBUG: Price validation response ===');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi validate giá sản phẩm:', error);
    throw error;
  }
};

// ===== ORDER CRUD APIs =====

// Lấy danh sách đơn hàng với filter và pagination
export const getOrders = async (params = {}) => {
  try {
    const response = await client.get('/api/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    throw error;
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (id) => {
  try {
    const response = await client.get(`/api/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    throw error;
  }
};

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    console.log('=== DEBUG: Sending order data to backend ===');
    console.log('Order data:', orderData);
    
    const response = await client.post('/api/orders', orderData);
    console.log('=== DEBUG: Order creation response ===');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    throw error;
  }
};


// ===== ORDER STATUS TRANSITION API - THEO TÀI LIỆU =====

// API chuyển trạng thái đơn hàng theo tài liệu mới
export const updateOrderStatusTransition = async (orderId, transitionData) => {
  try {
    console.log('=== DEBUG: Order status transition ===');
    console.log('Order ID:', orderId);
    console.log('Transition data:', transitionData);
    
    const response = await client.post(`/api/orders/${orderId}/status-transition`, transitionData);
    console.log('=== DEBUG: Status transition response ===');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi chuyển trạng thái đơn hàng:', error);
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng (API cũ - deprecated)
export const updateOrderStatus = async (id, newStatus, staffId = null) => {
  try {
    // Theo tài liệu API mới: PATCH /api/orders/{orderId}/status?newStatus=CONFIRMED&staffId=1
    const response = await client.patch(`/api/orders/${id}/status?newStatus=${newStatus}&staffId=${staffId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    throw error;
  }
};

// Hủy đơn hàng
export const cancelOrder = async (id, reason = '', userId) => {
  try {
    // Theo tài liệu API mới: PATCH /api/orders/{orderId}/cancel?reason=Khách hủy&userId=123
    const response = await client.patch(`/api/orders/${id}/cancel?reason=${encodeURIComponent(reason)}&userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error);
    throw error;
  }
};

// Xóa đơn hàng
export const deleteOrder = async (id) => {
  try {
    const response = await client.delete(`/api/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa đơn hàng:', error);
    throw error;
  }
};

// Lấy đơn hàng theo user
export const getOrdersByUser = async (userId) => {
  try {
    const response = await client.get(`/api/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng theo user:', error);
    throw error;
  }
};

// Lấy đơn hàng theo trạng thái
export const getOrdersByStatus = async (status) => {
  try {
    const response = await client.get(`/api/orders/status/${status}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng theo trạng thái:', error);
    throw error;
  }
};

// Tìm ID đơn hàng theo mã
export const getOrderIdByCode = async (orderCode) => {
  try {
    const response = await client.get('/api/orders/id', { 
      params: { orderCode } 
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tìm ID đơn hàng theo mã:', error);
    throw error;
  }
};

// ===== DROPDOWN APIs =====

// Lấy danh sách trạng thái đơn hàng
export const getOrderStatuses = async () => {
  try {
    const response = await client.get('/api/orders/order-statuses');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách trạng thái đơn hàng:', error);
    throw error;
  }
};

// Lấy danh sách loại đơn hàng
export const getOrderTypes = async () => {
  try {
    const response = await client.get('/api/orders/order-types');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loại đơn hàng:', error);
    throw error;
  }
};

// Lấy dropdown đơn hàng
export const getOrdersDropdown = async () => {
  try {
    const response = await client.get('/api/orders/dropdown');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dropdown đơn hàng:', error);
    throw error;
  }
};

// ===== SUPPORTING APIs =====

// Lấy dropdown địa chỉ user
export const getUserAddressesDropdown = async (userId) => {
  try {
    // Thay đổi endpoint để lấy toàn bộ địa chỉ của user theo tài liệu mới
    const response = await client.get('/api/addresses', {
      params: { userId }
    });
    // API mới trả về { status, message, data: [] } → chỉ cần mảng data
    return response.data?.data || [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách địa chỉ user:', error);
    throw error;
  }
};

// Lấy vouchers available cho user  
export const getUserAvailableVouchers = async (userId) => {
  try {
    const response = await client.get(`/api/vouchers/user/${userId}/available`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy vouchers available cho user:', error);
    throw error;
  }
};

// Lấy dropdown vouchers (tất cả vouchers để admin chọn)
export const getVouchersDropdown = async () => {
  try {
    const response = await client.get('/api/vouchers/dropdown');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dropdown vouchers:', error);
    throw error;
  }
};

// =============== REFUND APIs theo tài liệu ===============

// Upload ảnh minh chứng hoàn hàng (tối đa 10 ảnh, mỗi ảnh ≤ 5MB)
export const uploadRefundImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await client.post('/api/refund-evidence/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi upload ảnh minh chứng hoàn hàng:', error);
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
    
    const response = await client.post('/api/refund-evidence/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi upload video minh chứng hoàn hàng:', error);
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
    
    const response = await client.post('/api/refund-evidence/mixed', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi upload minh chứng hoàn hàng (ảnh + video):', error);
    throw error;
  }
};

// Khách hàng gửi yêu cầu hoàn trả (có admin xem xét)
export const requestRefund = async (orderId, refundData) => {
  try {
    console.log('=== DEBUG: Requesting refund ===');
    console.log('Order ID:', orderId);
    console.log('Refund data:', refundData);
    
    const response = await client.post(`/api/orders/${orderId}/request-refund`, refundData);
    console.log('=== DEBUG: Refund request response ===');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu hoàn trả:', error);
    throw error;
  }
};

// Admin chấp nhận hoàn trả
export const adminApproveRefund = async (orderId, adminId, adminNotes) => {
  try {
    const response = await client.post('/api/orders/admin/approve-refund', {
      orderId,
      adminId,
      approved: true,
      adminNotes
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi chấp nhận hoàn trả:', error);
    throw error;
  }
};

// Admin từ chối hoàn trả
export const adminRejectRefund = async (orderId, adminId, adminNotes) => {
  try {
    const response = await client.post('/api/orders/admin/reject-refund', {
      orderId,
      adminId,
      approved: false,
      adminNotes
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi từ chối hoàn trả:', error);
    throw error;
  }
};

// Hoàn trả một phần (trực tiếp - không cần admin duyệt)
export const partialRefund = async (orderId, refundData) => {
  try {
    const response = await client.post(`/api/orders/${orderId}/partial-refund`, refundData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi hoàn trả một phần:', error);
    throw error;
  }
};

// Hoàn trả toàn bộ (trực tiếp - không cần admin duyệt)
export const fullRefund = async (orderId, refundData) => {
  try {
    const response = await client.post(`/api/orders/${orderId}/full-refund`, refundData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi hoàn trả toàn bộ:', error);
    throw error;
  }
};

// Lấy danh sách yêu cầu hoàn hàng chờ phê duyệt (cho admin)
export const getPendingRefunds = async () => {
  try {
    const response = await client.get('/api/refunds/pending');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu cầu hoàn hàng:', error);
    throw error;
  }
};

// Admin phê duyệt/từ chối yêu cầu hoàn hàng
export const approveRefund = async (refundId, status, adminNote, adminId) => {
  try {
    const response = await client.patch(`/api/refunds/${refundId}/approve?adminId=${adminId}`, {
      status, // "APPROVED" hoặc "REJECTED"
      adminNote
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi phê duyệt yêu cầu hoàn hàng:', error);
    throw error;
  }
};

// Admin xử lý hoàn trả (sau khi approved)
export const processRefund = async (refundId, adminId) => {
  try {
    const response = await client.post(`/api/refunds/${refundId}/process?adminId=${adminId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xử lý hoàn trả:', error);
    throw error;
  }
};

// ===== HELPER FUNCTIONS =====

// Format order status text
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
    'PARTIALLY_REFUNDED': 'Hoàn tiền một phần'
  };
  return statusMap[status] || status;
};

// Get status class for styling
export const getOrderStatusClass = (status) => {
  const statusClasses = {
    'PENDING': 'bg-warning text-dark',
    'CONFIRMED': 'bg-primary',
    'SHIPPED': 'bg-info',
    'DELIVERED': 'bg-success',
    'CANCELED': 'bg-danger',
    'REFUNDING': 'bg-warning text-dark',
    'REFUNDED': 'bg-secondary',
    'RETURNED': 'bg-dark',
    'PARTIALLY_REFUNDED': 'bg-warning text-dark'
  };
  return statusClasses[status] || 'bg-secondary';
};

// Fallback data for dropdowns (if backend APIs are not ready)
export const getFallbackOrderStatuses = () => {
  return {
    status: 200,
    message: "Thành công",
    data: [
      { value: 'PENDING', displayName: 'Chờ xử lý' },
      { value: 'CONFIRMED', displayName: 'Đã xác nhận' },
      { value: 'SHIPPED', displayName: 'Đang giao hàng' },
      { value: 'DELIVERED', displayName: 'Đã giao hàng' },
      { value: 'CANCELED', displayName: 'Đã hủy' },
      { value: 'REFUNDING', displayName: 'Đang hoàn tiền' },
      { value: 'REFUNDED', displayName: 'Đã hoàn tiền' },
      { value: 'RETURNED', displayName: 'Đã trả hàng' },
      { value: 'PARTIALLY_REFUNDED', displayName: 'Hoàn tiền một phần' }
    ]
  };
};

export const getFallbackOrderTypes = () => {
  return {
    status: 200,
    message: "Thành công", 
    data: [
      { value: 'NORMAL', displayName: 'Đơn hàng thường' },
      { value: 'FLASH_SALE', displayName: 'Đơn hàng flash sale' },
      { value: 'PROMOTION', displayName: 'Đơn hàng khuyến mãi' },
      { value: 'PRE_ORDER', displayName: 'Đơn hàng đặt trước' }
    ]
  };
};

export const getFallbackUsersDropdown = () => {
  return {
    status: 200,
    message: "Thành công",
    data: [
      { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com' },
      { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com' },
      { id: 3, name: 'Lê Văn C', email: 'levanc@example.com' },
      { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com' },
      { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com' }
    ]
  };
};

export const getFallbackBooksDropdown = () => {
  return {
    status: 200,
    message: "Thành công",
    data: [
      { id: 1, title: 'Clean Code', price: 350000, isFlashSale: false },
      { id: 2, title: 'Design Patterns', price: 420000, isFlashSale: true },
      { id: 3, title: 'Refactoring', price: 380000, isFlashSale: false },
      { id: 4, title: 'The Pragmatic Programmer', price: 450000, isFlashSale: false },
      { id: 5, title: 'Effective Java', price: 390000, isFlashSale: true }
    ]
  };
};
