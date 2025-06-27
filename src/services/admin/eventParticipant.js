import client from '@/utils/axios';

// Lấy danh sách event participants
export const getEventParticipants = async (params = {}) => {
  try {
    const response = await client.get('/api/admin/event-participants', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách event participants:', error);
    throw error;
  }
};

// Tạo event participant mới
export const createEventParticipant = async (participantData) => {
  try {
    const response = await client.post('/api/admin/event-participants', participantData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo event participant:', error);
    throw error;
  }
};

// Cập nhật event participant
export const updateEventParticipant = async (id, participantData) => {
  try {
    const response = await client.put(`/api/admin/event-participants/${id}`, participantData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật event participant:', error);
    throw error;
  }
};

// Xóa event participant
export const deleteEventParticipant = async (id) => {
  try {
    const response = await client.delete(`/api/admin/event-participants/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa event participant:', error);
    throw error;
  }
};

// Lấy chi tiết event participant
export const getEventParticipantById = async (id) => {
  try {
    const response = await client.get(`/api/admin/event-participants/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết event participant:', error);
    throw error;
  }
};
