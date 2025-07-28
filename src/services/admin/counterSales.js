import axios from '@/utils/axios';

// Tạo đơn hàng tại quầy
export const createCounterOrder = async (orderData) => {
  try {
    const response = await axios.post('/api/counter-sales', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating counter order:', error);
    throw error;
  }
};

// Tính toán giá tại quầy (Preview)
export const calculateCounterOrder = async (orderData) => {
  try {
    const response = await axios.post('/api/counter-sales/calculate', orderData);
    return response.data;
  } catch (error) {
    console.error('Error calculating counter order:', error);
    throw error;
  }
};

// Xem chi tiết đơn hàng tại quầy
export const getCounterOrderById = async (orderId) => {
  try {
    const response = await axios.get(`/api/counter-sales/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting counter order:', error);
    throw error;
  }
};

// Hủy đơn hàng tại quầy
export const cancelCounterOrder = async (orderId, staffId, reason = '') => {
  try {
    const response = await axios.patch(`/api/counter-sales/${orderId}/cancel`, null, {
      params: { staffId, reason }
    });
    return response.data;
  } catch (error) {
    console.error('Error canceling counter order:', error);
    throw error;
  }
};

// Tìm kiếm Voucher cho Counter Sales
export const searchVouchers = async (query = '', limit = 10) => {
  try {
    const response = await axios.get('/api/vouchers/search', {
      params: { query, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching vouchers:', error);
    throw error;
  }
};
