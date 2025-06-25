import client from '../../utils/axios.js';

// Gọi API lấy danh sách rank sử dụng axios đã cấu hình
export const getRanks = async (params = {}) => {
  try {
    const response = await client.get('/api/ranks', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách rank:', error);
    throw error;
  }
};

// Toggle status API
export const toggleRankStatus = async (id) => {
  try {
    const response = await client.patch(`/api/ranks/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đổi trạng thái rank:', error);
    throw error;
  }
};

// Thêm mới rank
export const createRank = async (payload) => {
  try {
    const response = await client.post('/api/ranks', payload);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm rank:', error);
    throw error;
  }
};
