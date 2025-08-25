import axios from '@/utils/axios'

// Client Minigame APIs
export const getActiveCampaigns = async () => {
  const response = await axios.get('/api/campaigns/active');
  return response.data;
}

export const openBox = async (data) => {
  // Ensure all required validation fields are included according to MINIGAME_UPDATE_DOCS
  const openBoxRequest = {
    userId: data.userId,
    campaignId: data.campaignId,
    openType: data.openType, // "FREE" or "POINT"
    
    // Required validation fields for data synchronization
    frontendFreeLimit: data.frontendFreeLimit,
    frontendPointCost: data.frontendPointCost,
    frontendStartDate: data.frontendStartDate,
    frontendEndDate: data.frontendEndDate,
    frontendUserPoint: data.frontendUserPoint,
    frontendFreeOpenedCount: data.frontendFreeOpenedCount
  };
  
  const response = await axios.post('/api/minigame/open-box', openBoxRequest);
  return response.data;
}

export const getMinigameHistory = async (userId, campaignId = null) => {
  const params = campaignId ? { campaignId } : {};
  const response = await axios.get(`/api/minigame/history/user/${userId}`, { params });
  return response.data;
}

export const getUserCampaignStats = async (userId, campaignId) => {
  const response = await axios.get(`/api/minigame/stats/user/${userId}/campaign/${campaignId}`);
  return response.data;
}
