import client from '@/utils/axios';

// Lấy danh sách event history
export const getEventHistory = async (params = {}) => {
  try {
    const response = await client.get('/api/admin/event-history', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách event history:', error);
    throw error;
  }
};

// Tạo event history mới
export const createEventHistory = async (historyData) => {
  try {
    const response = await client.post('/api/admin/event-history', historyData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo event history:', error);
    throw error;
  }
};

// Xóa event history
export const deleteEventHistory = async (id) => {
  try {
    const response = await client.delete(`/api/admin/event-history/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa event history:', error);
    throw error;
  }
};

// Lấy chi tiết event history
export const getEventHistoryById = async (id) => {
  try {
    const response = await client.get(`/api/admin/event-history/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết event history:', error);
    throw error;
  }
};
