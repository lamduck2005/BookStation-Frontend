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
    // Truyền userId lên query string
    const userId = orderData.userId;
    const payload = orderData.payload;
    const response = await client.post(`/api/orders/validate-prices?userId=${userId}`, payload);
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

// =============== REFUND APIs theo tài liệu mới ===============

// 🔹 STEP 1: Upload minh chứng (Optional) - Mixed Evidence
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

// Upload ảnh minh chứng hoàn hàng (tối đa 10 ảnh, mỗi ảnh ≤ 5MB)
export const uploadRefundImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
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
      formData.append('videos', file);
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

// 🔹 STEP 2: Kiểm tra điều kiện hoàn hàng
export const validateRefundConditions = async (orderId, userId) => {
  try {
    const response = await client.get(`/api/refunds/validate/${orderId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi kiểm tra điều kiện hoàn hàng:', error);
    throw error;
  }
};

// 🔹 STEP 3: Tạo yêu cầu hoàn hàng - API MỚI THEO TÀI LIỆU
export const requestRefund = async (userId, refundData) => {
  try {
    console.log('=== DEBUG: Creating refund request ===');
    console.log('User ID:', userId);
    console.log('Refund data:', refundData);
    
    const response = await client.post(`/api/refunds?userId=${userId}`, refundData);
    console.log('=== DEBUG: Refund request response ===');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo yêu cầu hoàn trả:', error);
    throw error;
  }
};

// 📝 USER THEO DÕI YÊU CẦU HOÀN HÀNG

// Lấy danh sách yêu cầu của user
export const getUserRefunds = async (userId, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/refunds/user/${userId}?${queryString}` : `/api/refunds/user/${userId}`;
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu cầu hoàn trả của user:', error);
    throw error;
  }
};

// Lấy chi tiết yêu cầu hoàn trả
export const getRefundDetail = async (refundRequestId, userId) => {
  try {
    const response = await client.get(`/api/refunds/${refundRequestId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết yêu cầu hoàn trả:', error);
    throw error;
  }
};

// 📝 ADMIN XEM DANH SÁCH YÊU CẦU HOÀN HÀNG

// Danh sách yêu cầu chờ phê duyệt
export const getPendingRefunds = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/refunds/pending?${queryString}` : '/api/refunds/pending';
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu cầu hoàn hàng chờ phê duyệt:', error);
    throw error;
  }
};

// Tất cả yêu cầu hoàn hàng (với filter)
export const getAllRefunds = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/refunds/all?${queryString}` : '/api/refunds/all';
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tất cả yêu cầu hoàn hàng:', error);
    throw error;
  }
};

// Chi tiết để phê duyệt (admin)
export const getRefundAdminDetail = async (refundRequestId) => {
  try {
    const response = await client.get(`/api/refunds/${refundRequestId}/admin-detail`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết yêu cầu hoàn trả (admin):', error);
    throw error;
  }
};

// 📝 ADMIN PHÊ DUYỆT/TỪ CHỐI YÊU CẦU HOÀN HÀNG

// Chấp nhận yêu cầu hoàn trả - API MỚI
export const adminApproveRefund = async (refundRequestId, adminId, approvalData) => {
  try {
    console.log('=== DEBUG: Admin approving refund ===');
    console.log('Refund Request ID:', refundRequestId);
    console.log('Admin ID:', adminId);
    console.log('Approval data:', approvalData);
    
    const response = await client.post(`/api/refunds/${refundRequestId}/approve?adminId=${adminId}`, approvalData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi phê duyệt yêu cầu hoàn trả:', error);
    throw error;
  }
};

// Từ chối yêu cầu hoàn trả - API MỚI
export const adminRejectRefund = async (refundRequestId, adminId, rejectionData) => {
  try {
    console.log('=== DEBUG: Admin rejecting refund ===');
    console.log('Refund Request ID:', refundRequestId);
    console.log('Admin ID:', adminId);
    console.log('Rejection data:', rejectionData);
    
    const response = await client.post(`/api/refunds/${refundRequestId}/reject?adminId=${adminId}`, rejectionData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi từ chối yêu cầu hoàn trả:', error);
    throw error;
  }
};

// 📝 ADMIN XỬ LÝ HOÀN TIỀN

// Xử lý hoàn tiền sau phê duyệt - API MỚI
export const processRefund = async (refundRequestId, adminId, processData) => {
  try {
    console.log('=== DEBUG: Processing refund ===');
    console.log('Refund Request ID:', refundRequestId);
    console.log('Admin ID:', adminId);
    console.log('Process data:', processData);
    
    const response = await client.post(`/api/refunds/${refundRequestId}/process?adminId=${adminId}`, processData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xử lý hoàn trả:', error);
    throw error;
  }
};

// 📝 ADMIN HOÀN HÀNG TRỰC TIẾP (BYPASS)

// Hoàn hàng một phần trực tiếp
export const adminPartialRefund = async (adminData) => {
  try {
    console.log('=== DEBUG: Admin partial refund ===');
    console.log('Admin refund data:', adminData);
    
    const response = await client.post('/api/refunds/admin/partial-refund', adminData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi hoàn trả một phần (admin):', error);
    throw error;
  }
};

// Hoàn hàng toàn bộ trực tiếp
export const adminFullRefund = async (adminData) => {
  try {
    console.log('=== DEBUG: Admin full refund ===');
    console.log('Admin refund data:', adminData);
    
    const response = await client.post('/api/refunds/admin/full-refund', adminData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi hoàn trả toàn bộ (admin):', error);
    throw error;
  }
};

// 📝 CÁC API HỖ TRỢ

// Thống kê hoàn hàng
export const getRefundStatistics = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/refunds/statistics?${queryString}` : '/api/refunds/statistics';
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê hoàn hàng:', error);
    throw error;
  }
};

// Export báo cáo
export const exportRefundReport = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/refunds/export?${queryString}` : '/api/refunds/export';
    const response = await client.get(url, { responseType: 'blob' });
    return response;
  } catch (error) {
    console.error('Lỗi khi export báo cáo hoàn hàng:', error);
    throw error;
  }
};

// ===== LEGACY APIs (để tương thích với code cũ) =====

// Wrapper cho API cũ - hoàn trả một phần
export const partialRefund = async (orderId, refundData) => {
  try {
    // Chuyển đổi sang format mới
    const adminData = {
      orderId: orderId,
      adminId: refundData.adminId || 1,
      reason: refundData.reason || 'COMPENSATION',
      reasonDisplay: refundData.reasonDisplay || 'Bồi thường cho khách hàng',
      adminNote: refundData.adminNote || '',
      refundItems: refundData.refundItems || [],
      paymentMethod: refundData.paymentMethod || 'STORE_CREDIT',
      skipApproval: true
    };
    
    return await adminPartialRefund(adminData);
  } catch (error) {
    console.error('Lỗi khi hoàn trả một phần (legacy):', error);
    throw error;
  }
};

// Wrapper cho API cũ - hoàn trả toàn bộ
export const fullRefund = async (orderId, refundData) => {
  try {
    // Chuyển đổi sang format mới
    const adminData = {
      orderId: orderId,
      adminId: refundData.adminId || 1,
      reason: refundData.reason || 'OPERATIONAL_ERROR',
      reasonDisplay: refundData.reasonDisplay || 'Lỗi vận hành',
      adminNote: refundData.adminNote || '',
      paymentMethod: refundData.paymentMethod || 'BANK_TRANSFER',
      skipApproval: true
    };
    
    return await adminFullRefund(adminData);
  } catch (error) {
    console.error('Lỗi khi hoàn trả toàn bộ (legacy):', error);
    throw error;
  }
};

// Wrapper cho API cũ - phê duyệt/từ chối
export const approveRefund = async (refundId, status, adminNote, adminId) => {
  try {
    if (status === 'APPROVED') {
      const approvalData = {
        adminNote: adminNote || 'Yêu cầu hợp lệ. Đã phê duyệt.',
        approvedRefundAmount: null, // Để backend tự tính
        needsPhysicalReturn: true,
        returnAddress: 'Kho BookStation - 123 Đường ABC, Quận 1, TP.HCM',
        expectedReturnDays: 7
      };
      return await adminApproveRefund(refundId, adminId, approvalData);
    } else if (status === 'REJECTED') {
      const rejectionData = {
        rejectReason: 'OTHER',
        rejectReasonDisplay: 'Khác',
        adminNote: adminNote || 'Yêu cầu không hợp lệ.',
        suggestedAction: 'Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.'
      };
      return await adminRejectRefund(refundId, adminId, rejectionData);
    }
  } catch (error) {
    console.error('Lỗi khi phê duyệt/từ chối hoàn trả (legacy):', error);
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
    'PARTIALLY_REFUNDED': 'Hoàn tiền một phần',
    'GOODS_RETURNED_TO_WAREHOUSE': 'Hàng đã về kho'
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
    'PARTIALLY_REFUNDED': 'bg-warning text-dark',
    'GOODS_RETURNED_TO_WAREHOUSE': 'bg-info text-white'
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
      { value: 'PARTIALLY_REFUNDED', displayName: 'Hoàn tiền một phần' },
      { value: 'GOODS_RETURNED_TO_WAREHOUSE', displayName: 'Hàng đã về kho' }
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
