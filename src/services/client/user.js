import axios from '@/utils/axios'

// Client User APIs
export const getUserDetail = async (userId) => {
  const response = await axios.get(`/api/users/${userId}`);
  return response.data;
}

export const updateUserProfile = async (userId, userData) => {
  const response = await axios.put(`/api/users/${userId}`, userData);
  return response.data;
}

export const getUserCurrentInfo = async () => {
  // Lấy user ID từ utils
  const userId = getUserId();
  if (!userId) {
    throw new Error('User not logged in');
  }
  return await getUserDetail(userId);
}

// Import getUserId từ utils
import { getUserId } from '@/utils/utils';
