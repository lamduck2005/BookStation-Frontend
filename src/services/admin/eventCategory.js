import client from '@/utils/axios';

// Lấy danh sách event categories
export const getEventCategories = async (params = {}) => {
  try {
    const response = await client.get('/api/event-categories', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách event categories:', error);
    throw error;
  }
};

// Tạo event category mới
export const createEventCategory = async (categoryData) => {
  try {
    const response = await client.post('/api/event-categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo event category:', error);
    throw error;
  }
};

// Cập nhật event category
export const updateEventCategory = async (id, categoryData) => {
  try {
    const response = await client.put(`/api/event-categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật event category:', error);
    throw error;
  }
};

// Xóa event category
export const deleteEventCategory = async (id) => {
  try {
    const response = await client.delete(`/api/event-categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa event category:', error);
    throw error;
  }
};

// Lấy chi tiết event category
export const getEventCategoryById = async (id) => {
  try {
    const response = await client.get(`/api/event-categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết event category:', error);
    throw error;
  }
};
