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

export const getCustomersDropdown = async () => {
  try {
    const response = await client.get('/api/select/users/customers');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng:', error);
    throw error;
  }
};

export const getStaffsDropdown = async () => {
  try {
    const response = await client.get('/api/select/users/staffs');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhân viên:', error);
    throw error;
  }
};

export const getAdminsDropdown = async () => {
  try {
    const response = await client.get('/api/select/users/admins');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách quản lý:', error);
    throw error;
  }
};


