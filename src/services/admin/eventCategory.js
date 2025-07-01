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
    // Chuyển đổi dữ liệu để khớp với API backend
    const payload = {
      categoryName: categoryData.name || categoryData.categoryName,
      description: categoryData.description || '',
      iconUrl: categoryData.iconUrl || '',
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : 
                (categoryData.status !== undefined ? Boolean(Number(categoryData.status)) : true)
    };
    
    console.log('Sending payload to backend:', payload);
    const response = await client.post('/api/event-categories', payload);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo event category:', error);
    throw error;
  }
};

// Cập nhật event category
export const updateEventCategory = async (id, categoryData) => {
  try {
    // Chuyển đổi dữ liệu để khớp với API backend
    const payload = {
      categoryName: categoryData.name || categoryData.categoryName,
      description: categoryData.description || '',
      iconUrl: categoryData.iconUrl || '',
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : 
                (categoryData.status !== undefined ? Boolean(Number(categoryData.status)) : true)
    };
    
    console.log('Sending update payload to backend:', payload);
    const response = await client.put(`/api/event-categories/${id}`, payload);
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
