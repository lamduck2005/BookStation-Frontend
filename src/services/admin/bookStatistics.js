import axios from '@/utils/axios';

// ========================================
// ✅ BOOK STATISTICS API v4.0 FINAL - 2-TIER ARCHITECTURE
// Backend đã cập nhật theo tài liệu v4.0 Final 2-Tier Documentation
// ========================================

// 🏗️ **TIER 1 - SUMMARY API** - Dữ liệu nhẹ cho chart overview
export const getBookStatsSummary = async (period, fromDate = null, toDate = null) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('period', period); // day/week/month/quarter/year
    
    // ✅ CONVERT DATES TO TIMESTAMP - Khi có fromDate/toDate thì append vào (theo tài liệu API v5)
    if (fromDate && toDate && fromDate.trim() !== '' && toDate.trim() !== '') {
      let fromTimestamp, toTimestamp;
      
      // Convert fromDate to timestamp if it's a string
      if (typeof fromDate === 'string') {
        fromTimestamp = new Date(fromDate).getTime();
      } else {
        fromTimestamp = fromDate;
      }
      
      // Convert toDate to timestamp if it's a string  
      if (typeof toDate === 'string') {
        toTimestamp = new Date(toDate).getTime();
      } else {
        toTimestamp = toDate;
      }
      
      queryParams.append('fromDate', fromTimestamp.toString());
      queryParams.append('toDate', toTimestamp.toString());
      
      console.log('📊 Summary API (with custom date range):', {
        period,
        originalFromDate: fromDate,
        originalToDate: toDate,
        fromTimestamp,
        toTimestamp
      });
    } else {
      console.log('📊 Summary API (default period range):', {
        period
      });
    }
    
    console.log('📊 Summary API Call:', {
      period,
      url: `/api/books/statistics/summary?${queryParams.toString()}`
    });
    
    const response = await axios.get(`/api/books/statistics/summary?${queryParams.toString()}`);
    return response.data;
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tổng quan thống kê sách:', error);
    throw error;
  }
};

// 🔍 **TIER 2 - DETAILS API** - Chi tiết sách khi click vào chart point
export const getBookStatsDetails = async (period, date, limit = 10) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('period', period); // day/week/month/year
    
    // ✅ CONVERT DATE TO TIMESTAMP - Theo tài liệu API yêu cầu Long timestamp
    let timestamp;
    if (typeof date === 'string') {
      // Convert YYYY-MM-DD string to timestamp
      timestamp = new Date(date).getTime();
    } else if (typeof date === 'number') {
      // Already a timestamp
      timestamp = date;
    } else {
      throw new Error('Invalid date format. Expected string (YYYY-MM-DD) or number (timestamp)');
    }
    
    queryParams.append('date', timestamp.toString()); // API yêu cầu timestamp số
    queryParams.append('limit', limit); // số sách muốn lấy (default: 10)
    
    console.log('📊 Details API Call:', {
      period,
      originalDate: date,
      timestamp,
      limit,
      url: `/api/books/statistics/details?${queryParams.toString()}`
    });
    
    const response = await axios.get(`/api/books/statistics/details?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết thống kê sách:', error);
    throw error;
  }
};

// ========================================
// LEGACY APIs - VẪN HOẠT ĐỘNG
// ========================================

// 1. ✅ TỔNG QUAN THỐNG KÊ SÁCH (FOR DASHBOARD CARDS) 
export const getBookStatsOverview = async () => {
  try {
    const response = await axios.get('/api/books/stats/overview');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tổng quan thống kê sách:', error);
    throw error;
  }
};

// 2. ✅ SO SÁNH SÁCH (BOOK COMPARISON)
export const getBookComparison = async (book1Id, book2Id = null) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('book1Id', book1Id);
    if (book2Id) {
      queryParams.append('book2Id', book2Id);
    }
    
    const response = await axios.get(`/api/books/stats/compare?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi so sánh sách:', error);
    throw error;
  }
};

// 3. 🗑️ DEPRECATED - SẼ THAY THẾ BẰNG 2-TIER API
export const getBookPerformanceChart = async (chartType = 'daily', params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('chartType', chartType);
    
    // Optional parameters theo tài liệu mới
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);
    
    const response = await axios.get(`/api/books/stats/performance-chart?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy biểu đồ hiệu suất:', error);
    throw error;
  }
};

// 4. ✅ TÌM KIẾM SÁCH CHO DROPDOWN (BOOK SEARCH DROPDOWN)
export const searchBooksDropdown = async (query, limit = 10) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('limit', limit);
    
    const response = await axios.get(`/api/books/search-dropdown?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sách:', error);
    throw error;
  }
};

// ========================================
// WRAPPER FUNCTIONS FOR BACKWARD COMPATIBILITY
// ========================================

// Wrapper cho sales chart - sử dụng performance-chart API
export const getBookSalesChart = async (chartType = 'daily', params = {}) => {
  return await getBookPerformanceChart(chartType, params);
};

// Wrapper cho velocity chart - sử dụng performance-chart API  
export const getBookVelocityChart = async (params = {}) => {
  const chartType = params.chartType || 'daily';
  return await getBookPerformanceChart(chartType, params);
};

// ========================================
// HELPER FUNCTIONS
// ========================================

// Helper function để format currency
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Helper function để format percentage
export const formatPercentage = (value) => {
  if (!value && value !== 0) return '0%';
  return `${value.toFixed(1)}%`;
};

// Helper function để format performance level text
export const getPerformanceLevelText = (level) => {
  const levels = {
    'EXCELLENT': 'Xuất sắc',
    'GOOD': 'Tốt',
    'AVERAGE': 'Trung bình',
    'POOR': 'Kém',
    'VERY_POOR': 'Rất kém'
  };
  return levels[level] || level || 'Không xác định';
};

// Helper function để format trend direction
export const getTrendDirectionText = (direction) => {
  const directions = {
    'INCREASING': 'Tăng',
    'DECREASING': 'Giảm', 
    'STABLE': 'Ổn định',
    'VOLATILE': 'Biến động'
  };
  return directions[direction] || direction || 'Không xác định';
};
