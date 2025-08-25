import axios from '@/utils/axios'

// Rewards Management APIs
export const getRewardsByCampaign = async (campaignId) => {
  const response = await axios.get(`/api/rewards/campaign/${campaignId}`);
  return response.data;
}

export const createReward = async (data) => {
  const response = await axios.post('/api/rewards', data);
  return response.data;
}

export const updateReward = async (data) => {
  const response = await axios.put('/api/rewards', data);
  return response.data;
}

export const updateRewardStatus = async (id) => {
  const response = await axios.patch('/api/rewards/status', null, {
    params: { id }
  });
  return response.data;
}

export const deleteReward = async (id) => {
  const response = await axios.delete(`/api/rewards/${id}`);
  return response.data;
}

// Voucher dropdown for admin
export const getVouchersDropdown = async (search = '') => {
  const response = await axios.get('/api/vouchers/dropdown', {
    params: { search }
  });
  return response.data;
}
