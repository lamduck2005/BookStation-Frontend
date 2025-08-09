import client from '@/utils/axios';

export const getBooksDropdown = async () => {
  try {
    const response = await client.get('/api/select/books');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error);
    throw error;
  }
};

export const getUsersDropdown = async () => {
  try {
    const response = await client.get('/api/select/users');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw error;
  }
};
