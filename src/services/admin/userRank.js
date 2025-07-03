import axios from '@/utils/axios';

// Lấy danh sách user-ranks theo rank ID
export const getUserRanksByRankId = async (rankId, params = {}) => {
  try {
    const response = await axios.get(`/api/user-ranks/rank/${rankId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách user-ranks theo rank ID:', error);
    throw error;
  }
};

// Thêm user vào rank
export const addUserToRank = async (userData) => {
  try {
    const response = await axios.post('/api/user-ranks', userData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm user vào rank:', error);
    throw error;
  }
};

// Đổi trạng thái user-rank
export const toggleUserRankStatus = async (id) => {
  try {
    const response = await axios.patch(`/api/user-ranks/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đổi trạng thái user-rank:', error);
    throw error;
  }
};
