import client from '../../utils/axios.js';

// Gọi API lấy danh sách rank sử dụng axios đã cấu hình
export const getRanks = async () => {
  try {
    const response = await client.get('/api/ranks');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách rank:', error);
    throw error;
  }
};
