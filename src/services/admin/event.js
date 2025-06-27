import client from '@/utils/axios';

// Lấy danh sách events
export const getEvents = async (params = {}) => {
  try {
    const response = await client.get('/api/events', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách events:', error);
    throw error;
  }
};

// Tạo event mới
export const createEvent = async (eventData) => {
  try {
    const response = await client.post('/api/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo event:', error);
    throw error;
  }
};

// Cập nhật event
export const updateEvent = async (id, eventData) => {
  try {
    const response = await client.put(`/api/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật event:', error);
    throw error;
  }
};

// Xóa event
export const deleteEvent = async (id) => {
  try {
    const response = await client.delete(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa event:', error);
    throw error;
  }
};

// Lấy chi tiết event
export const getEventById = async (id) => {
  try {
    const response = await client.get(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết event:', error);
    throw error;
  }
};
