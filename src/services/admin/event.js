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

// Lấy danh sách event types
export const getEventTypes = async () => {
  try {
    const response = await client.get('/api/events/event-types');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách event types:', error);
    throw error;
  }
};

// Lấy danh sách event categories dropdown
export const getEventCategoriesDropdown = async () => {
  try {
    const response = await client.get('/api/event-categories/dropdown');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách event categories dropdown:', error);
    throw error;
  }
};

// Lấy danh sách event statuses
export const getEventStatuses = async () => {
  try {
    const response = await client.get('/api/events/event-statuses');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách event statuses:', error);
    throw error;
  }
};

// Tạo event mới
export const createEvent = async (eventData) => {
  try {
    console.log('=== DEBUG: Sending data to backend ===');
    console.log('Event data:', eventData);
    console.log('ImageUrls in payload:', eventData.imageUrls);
    
    const response = await client.post('/api/events', eventData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('=== DEBUG: Response from backend ===');
    console.log('Response:', response);
    console.log('Response data:', response.data);
    
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
