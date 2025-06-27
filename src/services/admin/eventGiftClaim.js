import client from '@/utils/axios';

// Lấy danh sách event gift claims
export const getEventGiftClaims = async (params = {}) => {
  try {
    const response = await client.get('/api/admin/event-gift-claims', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách event gift claims:', error);
    throw error;
  }
};

// Tạo event gift claim mới
export const createEventGiftClaim = async (claimData) => {
  try {
    const response = await client.post('/api/admin/event-gift-claims', claimData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo event gift claim:', error);
    throw error;
  }
};

// Cập nhật event gift claim
export const updateEventGiftClaim = async (id, claimData) => {
  try {
    const response = await client.put(`/api/admin/event-gift-claims/${id}`, claimData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật event gift claim:', error);
    throw error;
  }
};

// Xóa event gift claim
export const deleteEventGiftClaim = async (id) => {
  try {
    const response = await client.delete(`/api/admin/event-gift-claims/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa event gift claim:', error);
    throw error;
  }
};

// Lấy chi tiết event gift claim
export const getEventGiftClaimById = async (id) => {
  try {
    const response = await client.get(`/api/admin/event-gift-claims/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết event gift claim:', error);
    throw error;
  }
};

// Duyệt/từ chối claim
export const approveEventGiftClaim = async (id, approvalData) => {
  try {
    const response = await client.put(`/api/admin/event-gift-claims/${id}/approve`, approvalData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi duyệt event gift claim:', error);
    throw error;
  }
};
