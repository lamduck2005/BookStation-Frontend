import axiosInstance from '../../utils/axios.js';

// Lấy danh sách địa chỉ của user
export const getAddresses = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/addresses?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
};

// Lấy địa chỉ mặc định của user
export const getDefaultAddress = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/addresses?userId=${userId}`);
    if (response.data.success && response.data.data) {
      // Tìm địa chỉ mặc định
      const defaultAddress = response.data.data.find(address => address.isDefault);
      return defaultAddress || response.data.data[0]; // Nếu không có default thì lấy địa chỉ đầu tiên
    }
    return null;
  } catch (error) {
    console.error('Error fetching default address:', error);
    throw error;
  }
};

// Tạo địa chỉ mới
export const createAddress = async (addressData) => {
  try {
    const response = await axiosInstance.post('/api/addresses', addressData);
    return response.data;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
};

// Cập nhật địa chỉ
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await axiosInstance.put(`/api/addresses/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Xóa địa chỉ
export const deleteAddress = async (addressId) => {
  try {
    const response = await axiosInstance.delete(`/api/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// Đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId) => {
  try {
    const response = await axiosInstance.put(`/api/addresses/${addressId}/default`);
    return response.data;
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};
