import client from '@/utils/axios';

// Lấy danh sách ranks
export const getRanks = async (params = {}) => {
  try {
    const response = await client.get('/api/ranks', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách ranks:', error);
    throw error;
  }
};

// Lấy danh sách ranks dropdown
export const getRanksDropdown = async () => {
  try {
    const response = await client.get('/api/ranks/dropdown');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách ranks dropdown:', error);
    throw error;
  }
};

// Tạo rank mới
export const createRank = async (rankData) => {
  try {
    const response = await client.post('/api/ranks', rankData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo rank:', error);
    throw error;
  }
};

// Cập nhật rank
export const updateRank = async (id, rankData) => {
  try {
    const response = await client.put(`/api/ranks/${id}`, rankData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật rank:', error);
    throw error;
  }
};

// Xóa rank
export const deleteRank = async (id) => {
  try {
    const response = await client.delete(`/api/ranks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa rank:', error);
    throw error;
  }
};

// Cập nhật trạng thái rank
export const updateRankStatus = async (id, status, updatedBy) => {
  try {
    const response = await client.patch(`/api/ranks/status`, null, {
      params: { id, status, updatedBy }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái rank:', error);
    throw error;
  }
};

// Lấy chi tiết rank
export const getRankById = async (id) => {
  try {
    const response = await client.get(`/api/ranks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết rank:', error);
    throw error;
  }
};
