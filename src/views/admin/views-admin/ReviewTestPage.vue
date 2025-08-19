<template>
  <div class="review-test-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>🧪 Test Hệ Thống Đánh Giá</h1>
        <p>Kiểm tra AI phân tích sentiment và validation đánh giá</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalTests }}</div>
          <div class="stat-label">Tests thực hiện</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.positiveTests }}</div>
          <div class="stat-label">Đánh giá tích cực</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.negativeTests }}</div>
          <div class="stat-label">Đánh giá tiêu cực</div>
        </div>
      </div>
    </div>

    <!-- Test Instructions -->
    <div class="instructions-card">
      <h3>📋 Hướng dẫn test</h3>
      <div class="instructions-grid">
        <div class="instruction-item">
          <div class="instruction-icon">⭐</div>
          <div class="instruction-text">
            <strong>Đánh giá tích cực:</strong> Cần 4-5 sao + nội dung tích cực
          </div>
        </div>
        <div class="instruction-item">
          <div class="instruction-icon">🤖</div>
          <div class="instruction-text">
            <strong>AI Analysis:</strong> Sử dụng Groq API để phân tích sentiment
          </div>
        </div>
        <div class="instruction-item">
          <div class="instruction-icon">✅</div>
          <div class="instruction-text">
            <strong>Validation:</strong> Chỉ chấp nhận đánh giá đạt cả 2 điều kiện
          </div>
        </div>
        <div class="instruction-item">
          <div class="instruction-icon">🎯</div>
          <div class="instruction-text">
            <strong>Test Cases:</strong> Sử dụng ví dụ có sẵn để test nhanh
          </div>
        </div>
      </div>
    </div>

    <!-- Main Test Component -->
    <div class="test-component-container">
      <ReviewTester @review-analyzed="onReviewAnalyzed" />
    </div>

    <!-- Test History -->
    <div class="test-history" v-if="testHistory.length > 0">
      <h3>📊 Lịch sử test</h3>
      <div class="history-table">
        <div class="history-header">
          <div class="col-time">Thời gian</div>
          <div class="col-rating">Rating</div>
          <div class="col-text">Nội dung</div>
          <div class="col-result">Kết quả AI</div>
          <div class="col-status">Trạng thái</div>
        </div>
        <div 
          v-for="(test, index) in testHistory" 
          :key="index"
          class="history-row"
          :class="{ 'positive': test.isPositive, 'negative': !test.isPositive }"
        >
          <div class="col-time">{{ formatTime(test.timestamp) }}</div>
          <div class="col-rating">
            <span class="rating-stars">{{ '⭐'.repeat(test.rating) }}</span>
            {{ test.rating }}/5
          </div>
          <div class="col-text">
            <div class="text-preview">{{ test.text.substring(0, 50) }}...</div>
          </div>
          <div class="col-result">
            <span class="sentiment-badge" :class="test.sentiment">
              {{ test.isPositive ? '😊 Tích cực' : '😞 Tiêu cực' }}
            </span>
            <div class="confidence">{{ Math.round(test.confidence * 100) }}%</div>
          </div>
          <div class="col-status">
            <span class="status-badge" :class="test.accepted ? 'accepted' : 'rejected'">
              {{ test.accepted ? '✅ Chấp nhận' : '❌ Từ chối' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- API Information -->
    <div class="api-info">
      <h3>🔧 Thông tin API</h3>
      <div class="api-details">
        <div class="api-item">
          <strong>Model:</strong> llama-3.3-70b-versatile
        </div>
        <div class="api-item">
          <strong>Provider:</strong> Groq AI
        </div>
        <div class="api-item">
          <strong>Temperature:</strong> 0.3 (để kết quả ổn định)
        </div>
        <div class="api-item">
          <strong>Max Tokens:</strong> 200
        </div>
      </div>
    </div>

    <!-- Clear History Button -->
    <div class="actions" v-if="testHistory.length > 0">
      <button @click="clearHistory" class="clear-btn">
        🗑️ Xóa lịch sử test
      </button>
    </div>
  </div>
</template>

<script>
import ReviewTester from '@/components/admin/ReviewTester.vue'

export default {
  name: 'ReviewTestPage',
  components: {
    ReviewTester
  },
  data() {
    return {
      testHistory: [],
      stats: {
        totalTests: 0,
        positiveTests: 0,
        negativeTests: 0
      }
    }
  },
  mounted() {
    this.loadHistory();
  },
  methods: {
    onReviewAnalyzed(analysisData) {
      // Add to history
      const testEntry = {
        timestamp: new Date(),
        rating: analysisData.rating,
        text: analysisData.text,
        isPositive: analysisData.analysis.isPositive,
        sentiment: analysisData.analysis.sentiment,
        confidence: analysisData.analysis.confidence,
        accepted: analysisData.validation.isValid,
        reason: analysisData.analysis.reason
      };
      
      this.testHistory.unshift(testEntry);
      
      // Update stats
      this.stats.totalTests++;
      if (analysisData.analysis.isPositive) {
        this.stats.positiveTests++;
      } else {
        this.stats.negativeTests++;
      }
      
      // Save to localStorage
      this.saveHistory();
    },
    
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('vi-VN');
    },
    
    clearHistory() {
      this.testHistory = [];
      this.stats = {
        totalTests: 0,
        positiveTests: 0,
        negativeTests: 0
      };
      this.saveHistory();
    },
    
    saveHistory() {
      localStorage.setItem('reviewTestHistory', JSON.stringify({
        history: this.testHistory,
        stats: this.stats
      }));
    },
    
    loadHistory() {
      const saved = localStorage.getItem('reviewTestHistory');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.testHistory = data.history || [];
          this.stats = data.stats || { totalTests: 0, positiveTests: 0, negativeTests: 0 };
        } catch (error) {
          console.error('Error loading test history:', error);
        }
      }
    }
  }
}
</script>

<style scoped>
.review-test-page {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 28px;
}

.header-content p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.header-stats {
  display: flex;
  gap: 20px;
}

.stat-card {
  text-align: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  min-width: 100px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

/* Instructions */
.instructions-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.instructions-card h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.instructions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.instruction-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.instruction-icon {
  font-size: 24px;
  margin-right: 15px;
}

.instruction-text {
  flex: 1;
}

.instruction-text strong {
  color: #333;
}

/* Test Component Container */
.test-component-container {
  margin-bottom: 30px;
}

/* Test History */
.test-history {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.test-history h3 {
  margin: 0;
  padding: 20px 25px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  color: #333;
}

.history-table {
  font-size: 14px;
}

.history-header {
  display: grid;
  grid-template-columns: 100px 120px 1fr 150px 120px;
  gap: 15px;
  padding: 15px 25px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  font-weight: 600;
  color: #333;
}

.history-row {
  display: grid;
  grid-template-columns: 100px 120px 1fr 150px 120px;
  gap: 15px;
  padding: 15px 25px;
  border-bottom: 1px solid #f1f3f4;
  transition: background-color 0.2s ease;
}

.history-row:hover {
  background: #f8f9fa;
}

.history-row.positive {
  border-left: 4px solid #28a745;
}

.history-row.negative {
  border-left: 4px solid #dc3545;
}

.col-time {
  color: #666;
  font-size: 12px;
}

.col-rating {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rating-stars {
  font-size: 12px;
}

.col-text {
  color: #333;
}

.text-preview {
  font-size: 13px;
  line-height: 1.4;
}

.col-result {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sentiment-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.sentiment-badge.positive {
  background: #d4edda;
  color: #155724;
}

.sentiment-badge.negative {
  background: #f8d7da;
  color: #721c24;
}

.confidence {
  font-size: 11px;
  color: #666;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.accepted {
  background: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

/* API Info */
.api-info {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.api-info h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.api-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.api-item {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.api-item strong {
  color: #333;
}

/* Actions */
.actions {
  text-align: center;
}

.clear-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 1200px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .review-test-page {
    padding: 10px;
  }
  
  .page-header {
    padding: 20px;
  }
  
  .header-stats {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .stat-card {
    flex: 1;
    min-width: 80px;
  }
  
  .instructions-grid {
    grid-template-columns: 1fr;
  }
  
  .history-header,
  .history-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .history-header > div,
  .history-row > div {
    border-bottom: 1px solid #f1f3f4;
    padding-bottom: 5px;
  }
  
  .history-header > div:last-child,
  .history-row > div:last-child {
    border-bottom: none;
  }
  
  .api-details {
    grid-template-columns: 1fr;
  }
}
</style>
