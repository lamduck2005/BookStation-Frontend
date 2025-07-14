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

// Cập nhật đơn hàng
export const updateOrder = async (id, orderData) => {
  try {
    const response = await client.put(`/api/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật đơn hàng:', error);
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id, newStatus, staffId = null) => {
  try {
    const params = { newStatus };
    if (staffId) {
      params.staffId = staffId;
    }
    
    const response = await client.patch(`/api/orders/${id}/status`, null, { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    throw error;
  }
};

// Hủy đơn hàng
export const cancelOrder = async (id, reason = '', userId) => {
  try {
    const params = { userId };
    if (reason) {
      params.reason = reason;
    }
    
    const response = await client.patch(`/api/orders/${id}/cancel`, null, { params });
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
    const response = await client.get(`/api/addresses/user/${userId}/dropdown`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dropdown địa chỉ user:', error);
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
