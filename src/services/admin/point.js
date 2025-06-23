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

// Tạo mới point
export const createPoint = async (pointData) => {
  try {
    // Không fix cứng email nữa, lấy từ pointData
    const response = await client.post('/api/points', pointData);
    return response.data;
  } catch (error) {
    console.error('Error creating point:', error);
    throw error;
  }
};

// Lấy orderId từ orderCode
export const getOrderIdByOrderCode = async (orderCode) => {
  try {
    const response = await client.get(`/api/orders/id`, { params: { orderCode } });
    return response.data;
  } catch (error) {
    console.error('Error fetching orderId by orderCode:', error);
    throw error;
  }
};

// Sửa point
export const updatePoint = async (id, pointData) => {
  try {
    const response = await client.put(`/api/points/${id}`, pointData);
    return response.data;
  } catch (error) {
    console.error('Error updating point:', error);
    throw error;
  }
};