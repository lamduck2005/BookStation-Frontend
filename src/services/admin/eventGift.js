import client from '@/utils/axios';

// Lấy danh sách event gifts
export const getEventGifts = async (params = {}) => {
  try {
    const response = await client.get('/api/event-gifts', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách event gifts:', error);
    throw error;
  }
};

// Tạo event gift mới
export const createEventGift = async (giftData) => {
  try {
    const response = await client.post('/api/event-gifts', giftData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo event gift:', error);
    throw error;
  }
};

// Cập nhật event gift
export const updateEventGift = async (id, giftData) => {
  try {
    const response = await client.put(`/api/event-gifts/${id}`, giftData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật event gift:', error);
    throw error;
  }
};

// Xóa event gift
export const deleteEventGift = async (id) => {
  try {
    const response = await client.delete(`/api/event-gifts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa event gift:', error);
    throw error;
  }
};

// Lấy chi tiết event gift
export const getEventGiftById = async (id) => {
  try {
    const response = await client.get(`/api/event-gifts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết event gift:', error);
    throw error;
  }
};
