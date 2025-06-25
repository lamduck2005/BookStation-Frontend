import axios from '@/utils/axios';

export const toggleUserRankStatus = async (id) => {
  try {
    const response = await axios.patch(`/api/user-ranks/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đổi trạng thái user-rank:', error);
    throw error;
  }
};
