<template>
  <div class="minigame-container">
    <!-- Header với thông tin user -->
    <div class="user-info-header">
      <div class="user-stats">
        <div class="stat-item">
          <i class="fas fa-coins"></i>
          <span class="stat-value">{{ userInfo.total_point || 0 }}</span>
          <span class="stat-label">Điểm</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-gift"></i>
          <span class="stat-value">{{ userStats.totalOpened || 0 }}</span>
          <span class="stat-label">Hộp đã mở</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-trophy"></i>
          <span class="stat-value">{{ userStats.totalRewards || 0 }}</span>
          <span class="stat-label">Phần thưởng</span>
        </div>
      </div>
      
      <button class="history-btn" @click="showHistory = true">
        <i class="fas fa-history"></i>
        Lịch sử
      </button>
    </div>

    <!-- Chọn chiến dịch -->
    <div class="campaign-selection">
      <h2>🎮 Chọn Chiến Dịch Mở Hộp</h2>
      
      <!-- Loading campaigns -->
      <div v-if="loadingCampaigns" class="loading-campaigns">
        <div class="loading-spinner"></div>
        <p>Đang tải chiến dịch...</p>
      </div>
      
      <!-- Không có chiến dịch -->
      <div v-else-if="campaigns.length === 0" class="no-campaigns">
        <div class="no-campaigns-icon">📦</div>
        <h3>Không có chiến dịch nào đang hoạt động</h3>
        <p>Hãy quay lại sau để tham gia các chiến dịch mới nhé!</p>
      </div>
      
      <!-- Danh sách chiến dịch -->
      <div v-else class="campaigns-grid">
        <div 
          v-for="campaign in campaigns" 
          :key="campaign.id"
          class="campaign-card"
          :class="{ active: selectedCampaign?.id === campaign.id }"
          @click="selectCampaign(campaign)"
        >
          <div class="campaign-icon">
            <i class="fas fa-gift"></i>
          </div>
          
          <div class="campaign-info">
            <h3>{{ campaign.name }}</h3>
            
            <div class="campaign-stats-mini">
              <div class="stat-mini">
                <i class="fas fa-gift"></i>
                <span>{{ campaign.configFreeLimit }}</span>
              </div>
              <div class="stat-mini">
                <i class="fas fa-coins"></i>
                <span>{{ campaign.configPointCost }}</span>
              </div>
            </div>
            
            <div class="campaign-progress" v-if="campaignStats[campaign.id]">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${(campaignStats[campaign.id].freeOpenedCount / campaign.configFreeLimit) * 100}%` }"
                ></div>
              </div>
              <small>{{ campaignStats[campaign.id].freeOpenedCount || 0 }}/{{ campaign.configFreeLimit }}</small>
            </div>
          </div>
          
          <div class="campaign-status">
            <div class="status-dot active"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Giao diện chính minigame -->
    <div v-if="selectedCampaign" class="minigame-main">
      <!-- Thông tin chiến dịch -->
      <div class="campaign-info">
        <h3>{{ selectedCampaign.name }}</h3>
        <p v-if="selectedCampaign.description">{{ selectedCampaign.description }}</p>
      </div>

      <!-- Danh sách phần thưởng (scrollable) -->
      <div class="rewards-section">
        <h4>🎁 Phần Thưởng Có Thể Nhận</h4>
        <div class="rewards-container">
          <div 
            v-if="selectedCampaign.rewards && selectedCampaign.rewards.length > 0" 
            class="rewards-list"
          >
            <RewardCard
              v-for="reward in selectedCampaign.rewards"
              :key="reward.id"
              :reward="reward"
            />
          </div>
          <div v-else class="no-rewards">
            <p>Chưa có phần thưởng nào trong chiến dịch này</p>
          </div>
        </div>
      </div>

      <!-- Hộp mở quà -->
      <div class="box-section">
        <BoxAnimation
          :isOpening="isOpening"
          :result="currentResult"
          :canOpenFree="canOpenFree"
          :canOpenPoint="canOpenPoint"
          :freeRemaining="freeRemaining"
          :freeLimit="selectedCampaign.configFreeLimit"
          :pointCost="selectedCampaign.configPointCost"
          @open-box="handleOpenBox"
          @result-closed="handleResultClosed"
        />
      </div>
    </div>

    <!-- Modal lịch sử -->
    <div v-if="showHistory" class="history-modal" @click.self="showHistory = false">
      <div class="history-content">
        <div class="history-header">
          <h3>📜 Lịch Sử Mở Hộp</h3>
          <button class="close-btn" @click="showHistory = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div v-if="loadingHistory" class="loading-history">
          <div class="loading-spinner"></div>
          <p>Đang tải lịch sử...</p>
        </div>
        
        <div v-else-if="historyData.length === 0" class="no-history">
          <p>Bạn chưa mở hộp nào</p>
        </div>
        
        <div v-else class="history-list">
          <div 
            v-for="item in historyData" 
            :key="item.id"
            class="history-item"
            :class="{ 'has-reward': item.hasReward }"
          >
            <div class="history-info">
              <h4>{{ item.campaignName }}</h4>
              <p class="history-date">{{ formatDate(item.openDate) }}</p>
              <p class="history-type">
                <span :class="`type-${item.openType.toLowerCase()}`">
                  {{ item.openType === 'FREE' ? 'Miễn phí' : `${item.pointsSpent} điểm` }}
                </span>
              </p>
            </div>
            
            <div class="history-result">
              <div v-if="item.hasReward" class="reward-info">
                <i :class="item.rewardType === 'VOUCHER' ? 'fas fa-ticket-alt' : 'fas fa-coins'"></i>
                <span>{{ item.rewardName }}</span>
                <span v-if="item.voucherCode" class="voucher-code">{{ item.voucherCode }}</span>
              </div>
              <div v-else class="no-reward-info">
                <i class="fas fa-times-circle"></i>
                <span>Không trúng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Error Modal -->
    <ValidationErrorModal
      :show="showValidationError"
      :validation-errors="validationErrorData"
      @close="showValidationError = false"
      @reload="() => window.location.reload()"
    />

    <!-- Loading overlay -->
    <div v-if="isOpening" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner big"></div>
        <p>Đang mở hộp...</p>
        <p class="loading-tip">🤞 Chúc bạn may mắn!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import RewardCard from '@/components/common/RewardCard.vue'
import BoxAnimation from '@/components/common/BoxAnimation.vue'
import ValidationErrorModal from '@/components/common/ValidationErrorModal.vue'
import { getActiveCampaigns, openBox, getMinigameHistory, getUserCampaignStats } from '@/services/client/minigame'
import { getUserCurrentInfo } from '@/services/client/user'
import { getUserId } from '@/utils/utils'

// State data
const campaigns = ref([])
const selectedCampaign = ref(null)
const campaignStats = ref({})
const userInfo = ref({})
const userStats = ref({})
const historyData = ref([])

// Loading states
const loadingCampaigns = ref(false)
const loadingHistory = ref(false)
const isOpening = ref(false)

// UI states
const showHistory = ref(false)
const currentResult = ref(null)
const showValidationError = ref(false)
const validationErrorData = ref([])

// Computed
const canOpenFree = computed(() => {
  if (!selectedCampaign.value) return false
  const stats = campaignStats.value[selectedCampaign.value.id]
  return stats && stats.freeOpenedCount < selectedCampaign.value.configFreeLimit
})

const canOpenPoint = computed(() => {
  if (!selectedCampaign.value) return false
  return (userInfo.value.total_point || 0) >= selectedCampaign.value.configPointCost
})

const freeRemaining = computed(() => {
  if (!selectedCampaign.value) return 0
  const stats = campaignStats.value[selectedCampaign.value.id]
  return selectedCampaign.value.configFreeLimit - (stats?.freeOpenedCount || 0)
})

// Methods
const loadActiveCampaigns = async () => {
  loadingCampaigns.value = true
  try {
    const response = await getActiveCampaigns()
    campaigns.value = response.data || []
    
    // Tự động chọn chiến dịch đầu tiên
    if (campaigns.value.length > 0) {
      await selectCampaign(campaigns.value[0])
    }
  } catch (error) {
    console.error('Error loading campaigns:', error)
    showNotification('Không thể tải danh sách chiến dịch', 'error')
  } finally {
    loadingCampaigns.value = false
  }
}

const selectCampaign = async (campaign) => {
  selectedCampaign.value = campaign
  
  // Load stats cho campaign này
  try {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    const statsResponse = await getUserCampaignStats(userId, campaign.id)
    campaignStats.value[campaign.id] = statsResponse.data
  } catch (error) {
    console.error('Error loading campaign stats:', error)
    campaignStats.value[campaign.id] = { freeOpenedCount: 0 }
  }
}

const handleOpenBox = async (openType) => {
  if (!selectedCampaign.value || isOpening.value) return
  
  isOpening.value = true
  currentResult.value = null
  
  try {
    // Tạo validation data theo tài liệu
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    const currentStats = campaignStats.value[selectedCampaign.value.id] || { freeOpenedCount: 0 }
    
    const openData = {
      userId: userId,
      campaignId: selectedCampaign.value.id,
      openType: openType,
      
      // ⭐ Validation fields - BẮT BUỘC theo tài liệu
      frontendFreeLimit: selectedCampaign.value.configFreeLimit,
      frontendPointCost: selectedCampaign.value.configPointCost,
      frontendStartDate: selectedCampaign.value.startDate,
      frontendEndDate: selectedCampaign.value.endDate,
      frontendUserPoint: userInfo.value.total_point || 0,
      frontendFreeOpenedCount: currentStats.freeOpenedCount
    }
    
    const response = await openBox(openData)
    
    // ⭐ XỬ LÝ VALIDATION ERROR - theo tài liệu
    if (response.status === 400 && response.data.needReload) {
      handleValidationError(response.data)
      return
    }
    
    if (response.status === 200) {
      currentResult.value = response.data
      
      // Cập nhật state user
      updateUserState(response.data)
      
      // Hiển thị notification
      if (response.data.hasReward) {
        showNotification(`🎉 Chúc mừng! Bạn đã trúng ${response.data.rewardName}`, 'success')
      } else {
        showNotification(response.data.message, 'info')
      }
    } else {
      showNotification(response.data.message || 'Mở hộp thất bại', 'error')
    }
    
  } catch (error) {
    console.error('Error opening box:', error)
    showNotification('Lỗi kết nối: ' + error.message, 'error')
  } finally {
    setTimeout(() => {
      isOpening.value = false
    }, 2000) // Đợi animation hoàn thành
  }
}

const handleResultClosed = () => {
  currentResult.value = null
  // Reload campaign stats
  if (selectedCampaign.value) {
    selectCampaign(selectedCampaign.value)
  }
}

const updateUserState = (result) => {
  // Cập nhật điểm user
  userInfo.value.total_point = result.userCurrentPoints
  
  // Cập nhật stats chiến dịch
  const campaignId = selectedCampaign.value.id
  if (!campaignStats.value[campaignId]) {
    campaignStats.value[campaignId] = {}
  }
  
  campaignStats.value[campaignId].freeOpenedCount = 
    selectedCampaign.value.configFreeLimit - result.userRemainingFreeOpens
  
  // Cập nhật user stats
  userStats.value.totalOpened = result.userTotalOpenedInCampaign
  if (result.hasReward) {
    userStats.value.totalRewards = (userStats.value.totalRewards || 0) + 1
  }
}

const loadUserHistory = async () => {
  loadingHistory.value = true
  try {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    const response = await getMinigameHistory(userId)
    historyData.value = response.data || []
  } catch (error) {
    console.error('Error loading history:', error)
    showNotification('Không thể tải lịch sử', 'error')
  } finally {
    loadingHistory.value = false
  }
}

const handleValidationError = (errorData) => {
  validationErrorData.value = errorData.validationErrors || []
  showValidationError.value = true
}

const showNotification = (message, type = 'info') => {
  // Implement notification system
  console.log(`[${type.toUpperCase()}]`, message)
}

const formatDateRange = (start, end) => {
  const startDate = new Date(start).toLocaleDateString('vi-VN')
  const endDate = new Date(end).toLocaleDateString('vi-VN')
  return `${startDate} - ${endDate}`
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('vi-VN')
}

// Lifecycle
onMounted(async () => {
  // Load user info từ API
  try {
    const userResponse = await getUserCurrentInfo()
    if (userResponse.status === 200) {
      userInfo.value = userResponse.data
    }
  } catch (error) {
    console.error('Error loading user info:', error)
    // Fallback to getUserId for basic info
    const userId = getUserId()
    if (userId) {
      userInfo.value = { user_id: userId, total_point: 0 }
    }
  }
  
  // Load campaigns
  loadActiveCampaigns()
  
  // Load user history
  loadUserHistory()
})

// Watch for history modal
const watchHistory = () => {
  if (showHistory.value && historyData.value.length === 0) {
    loadUserHistory()
  }
}
</script>

<style scoped>
.minigame-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* User Info Header */
.user-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.user-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-item i {
  font-size: 24px;
  color: #667eea;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.history-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.history-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* Campaign Selection */
.campaign-selection {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.campaign-selection h2 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 24px;
  font-size: 28px;
}

/* Loading */
.loading-campaigns, .loading-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.big {
  width: 60px;
  height: 60px;
  border-width: 6px;
}

/* No Campaigns */
.no-campaigns {
  text-align: center;
  padding: 60px 20px;
}

.no-campaigns-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.no-campaigns h3 {
  color: #374151;
  margin-bottom: 8px;
}

.no-campaigns p {
  color: #6b7280;
}

/* Campaigns Grid */
.campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.campaign-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.campaign-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.campaign-card.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.campaign-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.campaign-info h3 {
  color: #1f2937;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.campaign-stats-mini {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
}

.stat-mini i {
  font-size: 12px;
}

.campaign-progress {
  margin-top: auto;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.campaign-progress small {
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
}

.campaign-status {
  position: absolute;
  top: 8px;
  right: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px #dcfce7;
}

.status-dot.active {
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    box-shadow: 0 0 0 2px #dcfce7;
  }
  50% {
    box-shadow: 0 0 0 6px rgba(220, 252, 231, 0.5);
  }
}

/* Minigame Main */
.minigame-main {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.campaign-info {
  text-align: center;
  margin-bottom: 32px;
}

.campaign-info h3 {
  color: #1f2937;
  font-size: 24px;
  margin-bottom: 8px;
}

.campaign-info p {
  color: #6b7280;
}

/* Rewards Section */
.rewards-section {
  margin-bottom: 32px;
}

.rewards-section h4 {
  color: #1f2937;
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.rewards-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.rewards-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.no-rewards {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

/* Box Section */
.box-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

/* History Modal */
.history-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.history-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.history-header h3 {
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.no-history {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.history-list {
  max-height: 60vh;
  overflow-y: auto;
  padding: 16px 24px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.history-item.has-reward {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-color: #22c55e;
}

.history-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-info h4 {
  color: #1f2937;
  margin: 0 0 8px 0;
  font-size: 16px;
}

.history-date {
  color: #6b7280;
  font-size: 14px;
  margin: 4px 0;
}

.history-type {
  font-size: 14px;
  margin: 4px 0;
}

.type-free {
  color: #059669;
  font-weight: 600;
}

.type-point {
  color: #d97706;
  font-weight: 600;
}

.history-result {
  text-align: right;
}

.reward-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  color: #059669;
}

.reward-info i {
  font-size: 20px;
}

.voucher-code {
  font-family: monospace;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.no-reward-info {
  color: #ef4444;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.no-reward-info i {
  font-size: 20px;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-content p {
  margin: 16px 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.loading-tip {
  font-size: 16px;
  opacity: 0.8;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .minigame-container {
    padding: 16px;
  }
  
  .user-info-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .user-stats {
    gap: 20px;
  }
  
  .campaigns-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
  
  .campaign-card {
    padding: 16px;
  }
  
  .campaign-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .campaign-info h3 {
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .stat-mini {
    font-size: 12px;
  }
  
  .campaign-config {
    grid-template-columns: 1fr;
  }
  
  .campaign-config {
    flex-direction: column;
    gap: 8px;
  }
  
  .rewards-list {
    grid-template-columns: 1fr;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .history-result {
    text-align: left;
    width: 100%;
  }
  
  .history-content {
    width: 95%;
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .campaign-selection h2 {
    font-size: 24px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .stat-item i {
    font-size: 20px;
  }
  
  .campaigns-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .campaign-card {
    padding: 12px;
  }
  
  .campaign-icon {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }
  
  .campaign-info h3 {
    font-size: 13px;
  }
}

/* Scrollbar styling */
.rewards-container::-webkit-scrollbar,
.history-list::-webkit-scrollbar {
  width: 6px;
}

.rewards-container::-webkit-scrollbar-track,
.history-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.rewards-container::-webkit-scrollbar-thumb,
.history-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.rewards-container::-webkit-scrollbar-thumb:hover,
.history-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>