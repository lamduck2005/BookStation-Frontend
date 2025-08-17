<template>
  <div class="profile-bpoint">

    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Tài khoản B-Point</h2>
    </div>

    <!-- B-Point Balance Card -->
    <div class="bpoint-balance-card mb-4">
      <div class="balance-info">
        <div class="balance-icon">
          <i class="bi bi-coin"></i>
        </div>
        <div class="balance-details">
          <h3 class="balance-title">{{ bPointBalance }} B-Point</h3>
        </div>
      </div>
    </div>

    <!-- B-Point History -->
    <div class="bpoint-history">
      <div class="history-header">
        <div class="history-tabs">
          <button 
            v-for="tab in historyTabs" 
            :key="tab.key"
            class="history-tab"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="history-content">
        <div class="history-table-header">
          <div class="col-time">Thời gian</div>
          <div class="col-action">Hành động</div>
          <div class="col-balance-before">Số dư trước</div>
          <div class="col-transaction">Giá trị giao dịch</div>
          <div class="col-balance-after">Số dư sau</div>
        </div>

        <div v-if="filteredHistory.length === 0" class="no-history">
          <div class="empty-state">
            <i class="bi bi-clock-history text-muted"></i>
            <p class="text-muted">Chưa có lịch sử giao dịch nào.</p>
          </div>
        </div>

        <div v-else class="history-list">
          <div v-for="transaction in filteredHistory" :key="transaction.id" class="history-item">
            <div class="col-time">
              <div class="transaction-date">{{ formatDate(transaction.date) }}</div>
              <div class="transaction-time">{{ formatTime(transaction.date) }}</div>
            </div>
            <div class="col-action">
              <span class="action-text">{{ transaction.action }}</span>
            </div>
            <div class="col-balance-before">
              <span class="balance-amount">{{ transaction.balanceBefore }}</span>
            </div>
            <div class="col-transaction">
              <span 
                class="transaction-amount" 
                :class="{ 
                  'positive': transaction.type === 'earn',
                  'negative': transaction.type === 'spend' 
                }"
              >
                {{ transaction.type === 'earn' ? '+' : '-' }}{{ transaction.amount }}
              </span>
            </div>
            <div class="col-balance-after">
              <span class="balance-amount">{{ transaction.balanceAfter }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('all')
const topupAmount = ref('')
const bPointBalance = ref(0)

const historyTabs = [
  { key: 'all', label: 'Thời gian' },
  { key: 'earn', label: 'Hành động' },
  { key: 'spend', label: 'Số dư trước' },
  { key: 'transfer', label: 'Giá trị giao dịch' },
  { key: 'expire', label: 'Số dư sau' }
]

// Fake transaction history
const transactionHistory = ref([])

// Computed filtered history
const filteredHistory = computed(() => {
  if (activeTab.value === 'all') return transactionHistory.value
  return transactionHistory.value.filter(transaction => transaction.category === activeTab.value)
})

// Top up B-Point
const topUpBPoint = () => {
  if (!topupAmount.value.trim()) {
    alert('Vui lòng nhập mã nạp điểm')
    return
  }
  
  // TODO: API call to top up B-Point
  alert(`Đã nạp điểm với mã: ${topupAmount.value}`)
  topupAmount.value = ''
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

// Format time
const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.profile-bpoint {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.bpoint-balance-card {
  background: linear-gradient(135deg, #FFB74D 0%, #FF9800 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
}

.balance-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.balance-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  flex-shrink: 0;
}

.balance-details {
  flex: 1;
}

.balance-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 20px 0;
}

.top-up-section .form-label {
  color: white;
  font-weight: 500;
  margin-bottom: 12px;
}

.top-up-section .input-group {
  max-width: 400px;
}

.top-up-section .form-control {
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 12px 16px;
}

.top-up-section .form-control::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.top-up-section .form-control:focus {
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: none;
  background: rgba(255, 255, 255, 0.2);
}

.top-up-section .btn-primary {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 600;
  padding: 12px 24px;
}

.top-up-section .btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.bpoint-history {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.history-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.history-tabs {
  display: flex;
}

.history-tab {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  text-align: center;
  transition: all 0.2s ease;
}

.history-tab:hover {
  color: #333;
  background: #f8f9fa;
}

.history-tab.active {
  color: #dc3545;
  border-bottom-color: #dc3545;
  background: white;
}

.history-table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.history-content {
  background: white;
}

.no-history .empty-state {
  text-align: center;
  padding: 60px 20px;
}

.no-history .empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
}

.history-list {
  min-height: 200px;
}

.history-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.history-item:last-child {
  border-bottom: none;
}

.transaction-date {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.transaction-time {
  font-size: 12px;
  color: #666;
}

.action-text {
  font-size: 14px;
  color: #333;
}

.balance-amount {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.transaction-amount {
  font-size: 14px;
  font-weight: 600;
}

.transaction-amount.positive {
  color: #28a745;
}

.transaction-amount.negative {
  color: #dc3545;
}

@media (max-width: 768px) {
  .profile-bpoint {
    padding: 16px;
  }
  
  .balance-info {
    flex-direction: column;
    text-align: center;
  }
  
  .balance-icon {
    width: 60px;
    height: 60px;
    font-size: 28px;
    margin: 0 auto;
  }
  
  .balance-title {
    font-size: 24px;
  }
  
  .top-up-section .input-group {
    max-width: none;
  }
  
  .history-tabs {
    flex-wrap: wrap;
  }
  
  .history-tab {
    min-width: 50%;
    font-size: 12px;
    padding: 12px 8px;
  }
  
  .history-table-header,
  .history-item {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: left;
  }
  
  .history-table-header {
    display: none;
  }
  
  .history-item {
    background: #f8f9fa;
    margin-bottom: 12px;
    border-radius: 8px;
    border: none;
  }
  
  .history-item > div::before {
    content: attr(class);
    font-weight: 600;
    color: #666;
    font-size: 12px;
    display: block;
    margin-bottom: 4px;
    text-transform: capitalize;
  }
  
  .col-time::before { content: "Thời gian: "; }
  .col-action::before { content: "Hành động: "; }
  .col-balance-before::before { content: "Số dư trước: "; }
  .col-transaction::before { content: "Giao dịch: "; }
  .col-balance-after::before { content: "Số dư sau: "; }
}
</style>
