import client from '../../utils/axios.js';

// Lấy danh sách item theo flashSaleId cùng filter & paging
export const getAllFlashSaleItem = async (flashSaleId, params = {}) => {
  return await client.get(`/api/flash-sales/${flashSaleId}/items`, { params });
};

// Thêm mới item vào flash sale
export const addFlashSaleItem = async (flashSaleId, data) => {
  return await client.post(`/api/flash-sales/${flashSaleId}/items`, data);
};

// Cập nhật item
export const updateFlashSaleItem = async (flashSaleId, itemId, data) => {
  return await client.put(`/api/flash-sales/${flashSaleId}/items/${itemId}`, data);
};

// Toggle status
export const toggleStatusFlashSaleItem = async (flashSaleId, itemId) => {
  return await client.patch(`/api/flash-sales/${flashSaleId}/items/${itemId}/status`);
};

// Lấy thống kê flash sale item
export const getFlashSaleItemStats = async (flashSaleId) => {
  return await client.get(`/api/flash-sales/${flashSaleId}/items/stats`);
};