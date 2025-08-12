import client from '../../utils/axios.js';

// Lấy danh sách review, có hỗ trợ truyền params filter & paging
export const getAllReview = async (params = {}) => {
  return await client.get('/api/reviews', { params });
};

// Tạo review mới
export const addReview = async (data) => {
  return await client.post('/api/reviews', data);
};

// Cập nhật review
export const updateReview = async (id, data) => {
  return await client.put(`/api/reviews/${id}`, data);
};

// Đổi trạng thái hiển thị (APPROVED ↔ HIDDEN)
export const toggleStatusReview = async (id) => {
  return await client.patch(`/api/reviews/${id}/status`);
};

// Lấy stats
export const getReviewStats = async () => {
  return await client.get('/api/reviews/stats');
};
