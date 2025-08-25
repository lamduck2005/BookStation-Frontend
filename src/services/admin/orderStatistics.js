import client from '@/utils/axios';

// ===== ORDER STATISTICS APIs - Tier 1 & Tier 2 Architecture =====

/**
 * TIER 1: Order Statistics Summary API
 * Lấy dữ liệu tổng quan cho charts/graphs
 * 
 * @param {string} period - "day", "week", "month", "quarter", "year"
 * @param {string} fromDate - Custom start date (YYYY-MM-DD format, optional)
 * @param {string} toDate - Custom end date (YYYY-MM-DD format, optional)
 * @returns {Promise} API response with summary data
 */
export const getOrderStatsSummary = async (period = 'day', fromDate = null, toDate = null) => {
  try {
    console.log('📡 Fetching order statistics summary:', {
      period,
      fromDate,
      toDate
    });

    // Build query parameters
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    
    // Handle custom date range
    if (fromDate && toDate) {
      // Convert YYYY-MM-DD to timestamp
      const fromTimestamp = new Date(fromDate + 'T00:00:00').getTime();
      const toTimestamp = new Date(toDate + 'T23:59:59').getTime();
      
      params.append('fromDate', fromTimestamp.toString());
      params.append('toDate', toTimestamp.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/api/orders/statistics/summary?${queryString}` : '/api/orders/statistics/summary';
    
    console.log('📡 API URL:', url);
    
    const response = await client.get(url);
    
    console.log('✅ Order statistics summary response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching order statistics summary:', error);
    throw error;
  }
};

/**
 * TIER 2: Order Statistics Details API
 * Lấy chi tiết đơn hàng khi click vào điểm cụ thể trên chart
 * 
 * @param {string} period - "day", "week", "month", "quarter", "year"
 * @param {string} date - Target date (YYYY-MM-DD format)
 * @param {number} limit - Number of orders to fetch (default 10)
 * @returns {Promise} API response with detailed orders
 */
export const getOrderStatsDetails = async (period, date, limit = 10) => {
  try {
    console.log('📡 Fetching order statistics details:', {
      period,
      date,
      limit
    });

    // Convert date to timestamp (middle of the day for better matching)
    const dateTimestamp = new Date(date + 'T12:00:00').getTime();

    // Build query parameters
    const params = new URLSearchParams({
      period: period,
      date: dateTimestamp.toString(),
      limit: limit.toString()
    });

    const url = `/api/orders/statistics/details?${params.toString()}`;
    
    console.log('📡 API URL:', url);
    
    const response = await client.get(url);
    
    console.log('✅ Order statistics details response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching order statistics details:', error);
    throw error;
  }
};

/**
 * Format currency to Vietnamese format
 * @param {number} amount - Amount in VND
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0 ₫';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format order status for display
 * @param {string} status - Order status code
 * @returns {string} Display name
 */
export const formatOrderStatus = (status) => {
  const statusMap = {
    'PENDING': 'Chờ xác nhận',
    'CONFIRMED': 'Đã xác nhận', 
    'PROCESSING': 'Đang xử lý',
    'SHIPPED': 'Đã gửi hàng',
    'DELIVERED': 'Đã giao hàng',
    'CANCELED': 'Đã hủy',
    'PARTIALLY_REFUNDED': 'Hoàn trả một phần',
    'REFUNDED': 'Hoàn trả toàn bộ'
  };
  
  return statusMap[status] || status;
};

/**
 * Get order status badge class for styling
 * @param {string} status - Order status code
 * @returns {string} CSS class name
 */
export const getOrderStatusClass = (status) => {
  const statusClasses = {
    'PENDING': 'status-pending',
    'CONFIRMED': 'status-confirmed',
    'PROCESSING': 'status-processing', 
    'SHIPPED': 'status-shipped',
    'DELIVERED': 'status-delivered',
    'CANCELED': 'status-canceled',
    'PARTIALLY_REFUNDED': 'status-refunded',
    'REFUNDED': 'status-refunded'
  };
  
  return statusClasses[status] || 'status-default';
};

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number|null} Percentage change or null if no previous value
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
};
