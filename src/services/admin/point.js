import client from '../../utils/axios.js';

// Lấy danh sách lịch sử point với pagination và filter
export const getPointHistory = async (page = 0, size = 10, filters = {}) => {
  try {
    const params = {
      page,
      size,
      ...filters
    };
    
    // Loại bỏ các tham số rỗng
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });

    const response = await client.get('/api/points', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching point history:', error);
    throw error;
  }
};

// Có thể thêm các API khác liên quan đến point
export const getPointById = async (id) => {
  try {
    const response = await client.get(`/api/points/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching point by id:', error);
    throw error;
  }
};