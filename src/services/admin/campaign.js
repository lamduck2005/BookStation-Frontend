import axios from '@/utils/axios'

// Campaign Management APIs
export const getCampaigns = async (params = {}) => {
  const response = await axios.get('/api/campaigns', { params });
  return response.data;
}

export const getCampaignById = async (id, userId = null) => {
  const params = userId ? { userId } : {};
  const response = await axios.get(`/api/campaigns/${id}`, { params });
  return response.data;
}

export const createCampaign = async (data) => {
  const response = await axios.post('/api/campaigns', data);
  return response.data;
}

export const updateCampaign = async (data) => {
  const response = await axios.put('/api/campaigns', data);
  return response.data;
}

export const updateCampaignStatus = async (id) => {
  const response = await axios.patch('/api/campaigns/status', null, {
    params: { id }
  });
  return response.data;
}

export const deleteCampaign = async (id) => {
  const response = await axios.delete(`/api/campaigns/${id}`);
  return response.data;
}
