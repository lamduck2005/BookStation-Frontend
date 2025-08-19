<template>
  <div class="review-tester">
    <div class="review-header">
      <h2>🧪 Test Đánh Giá & Phân Tích AI</h2>
      <p>Kiểm tra hệ thống đánh giá với AI phân tích sentiment tự động</p>
    </div>

    <div class="review-form">
      <!-- Star Rating -->
      <div class="rating-section">
        <label class="rating-label">Đánh giá của bạn:</label>
        <div class="star-rating">
          <button
            v-for="star in 5"
            :key="star"
            @click="setRating(star)"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
            class="star-btn"
            :class="{
              'star-filled': star <= (hoverRating || rating),
              'star-empty': star > (hoverRating || rating)
            }"
          >
            ⭐
          </button>
        </div>
        <span class="rating-text">{{ rating }}/5 sao</span>
      </div>

      <!-- Review Text -->
      <div class="review-text-section">
        <label class="review-label">Nội dung đánh giá:</label>
        <textarea
          v-model="reviewText"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
          class="review-textarea"
          :class="{ 'error': validationErrors.length > 0 }"
          rows="4"
        ></textarea>
        <div class="char-count">{{ reviewText.length }}/500 ký tự</div>
      </div>

      <!-- Analysis Button -->
      <div class="action-section">
        <button 
          @click="analyzeReview"
          :disabled="isAnalyzing || !canAnalyze"
          class="analyze-btn"
          :class="{ 'analyzing': isAnalyzing }"
        >
          <span v-if="isAnalyzing">🔄 Đang phân tích...</span>
          <span v-else>🤖 Phân tích AI</span>
        </button>
      </div>

      <!-- Validation Errors -->
      <div v-if="validationErrors.length > 0" class="validation-errors">
        <h4>❌ Lỗi validation:</h4>
        <ul>
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>
    </div>

    <!-- Analysis Result -->
    <div v-if="analysisResult" class="analysis-result">
      <div class="result-header">
        <h3>📊 Kết quả phân tích AI</h3>
      </div>

      <div class="result-content">
        <!-- Main Result -->
        <div class="main-result" :class="analysisResult.isPositive ? 'positive' : 'negative'">
          <div class="result-icon">
            {{ analysisResult.isPositive ? '✅' : '❌' }}
          </div>
          <div class="result-info">
            <h4>{{ analysisResult.isPositive ? 'ĐÁNH GIÁ TÍCH CỰC' : 'ĐÁNH GIÁ TIÊU CỰC' }}</h4>
            <p>{{ analysisResult.reason }}</p>
          </div>
        </div>

        <!-- Details -->
        <div class="result-details">
          <div class="detail-item">
            <span class="label">Sentiment:</span>
            <span class="value" :class="analysisResult.sentiment">
              {{ analysisResult.sentiment === 'positive' ? 'Tích cực' : 'Tiêu cực' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="label">Độ tin cậy:</span>
            <span class="value">{{ Math.round(analysisResult.confidence * 100) }}%</span>
          </div>
          <div class="detail-item">
            <span class="label">Trạng thái:</span>
            <span class="value" :class="validation.isValid ? 'accepted' : 'rejected'">
              {{ validation.isValid ? 'Chấp nhận' : 'Từ chối' }}
            </span>
          </div>
        </div>

        <!-- AI Raw Response -->
        <details class="ai-response">
          <summary>🔍 Xem chi tiết phản hồi AI</summary>
          <pre>{{ JSON.stringify(analysisResult, null, 2) }}</pre>
        </details>
      </div>

      <!-- Submit Section -->
      <div class="submit-section">
        <button 
          v-if="validation.isValid"
          @click="submitReview"
          class="submit-btn success"
        >
          ✅ Gửi đánh giá
        </button>
        <button 
          v-else
          disabled
          class="submit-btn disabled"
        >
          ❌ Không thể gửi
        </button>
      </div>
    </div>

    <!-- Test Examples -->
    <div class="test-examples">
      <h3>🎯 Ví dụ test nhanh:</h3>
      <div class="example-buttons">
        <button @click="loadExample('positive')" class="example-btn positive">
          Ví dụ tích cực
        </button>
        <button @click="loadExample('negative')" class="example-btn negative">
          Ví dụ tiêu cực
        </button>
        <button @click="loadExample('mixed')" class="example-btn mixed">
          Ví dụ trung tính
        </button>
        <button @click="clearForm" class="example-btn clear">
          Xóa form
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { analyzeSentiment, validateReview } from '@/services/ai/sentimentAnalysis.js'

export default {
  name: 'ReviewTester',
  data() {
    return {
      rating: 0,
      hoverRating: 0,
      reviewText: '',
      isAnalyzing: false,
      analysisResult: null,
      validation: null,
      validationErrors: [],
      
      // Test examples
      examples: {
        positive: {
          rating: 5,
          text: 'Sản phẩm rất tuyệt vời! Chất lượng tốt, giao hàng nhanh, tôi rất hài lòng với mua hàng này.'
        },
        negative: {
          rating: 2,
          text: 'Sản phẩm không như mong đợi, chất lượng kém, tôi rất thất vọng.'
        },
        mixed: {
          rating: 4,
          text: 'Sản phẩm tệ quá, không đáng mua, lần sau sẽ không mua nữa!'
        }
      }
    }
  },
  computed: {
    canAnalyze() {
      return this.rating > 0 && this.reviewText.trim().length >= 5;
    }
  },
  methods: {
    setRating(stars) {
      this.rating = stars;
      this.resetAnalysis();
    },
    
    async analyzeReview() {
      if (!this.canAnalyze) return;
      
      this.isAnalyzing = true;
      this.validationErrors = [];
      
      try {
        // Analyze sentiment with AI
        const analysis = await analyzeSentiment(this.reviewText, this.rating);
        this.analysisResult = analysis;
        
        // Validate review
        this.validation = validateReview(this.reviewText, this.rating, analysis);
        
        if (!this.validation.isValid) {
          this.validationErrors = this.validation.errors;
        }
        
        // Show success message
        this.$toast?.success(`Phân tích hoàn tất! Kết quả: ${analysis.isPositive ? 'Tích cực' : 'Tiêu cực'}`);
        
        // Emit event to parent
        this.$emit('review-analyzed', {
          rating: this.rating,
          text: this.reviewText,
          analysis: analysis,
          validation: this.validation
        });
        
      } catch (error) {
        console.error('Analysis error:', error);
        this.$toast?.error('Có lỗi khi phân tích đánh giá');
      } finally {
        this.isAnalyzing = false;
      }
    },
    
    submitReview() {
      if (!this.validation?.isValid) return;
      
      // Simulate submit
      this.$toast?.success('✅ Đánh giá đã được gửi thành công!');
      console.log('Review submitted:', {
        rating: this.rating,
        text: this.reviewText,
        analysis: this.analysisResult
      });
    },
    
    loadExample(type) {
      const example = this.examples[type];
      if (example) {
        this.rating = example.rating;
        this.reviewText = example.text;
        this.resetAnalysis();
      }
    },
    
    clearForm() {
      this.rating = 0;
      this.reviewText = '';
      this.resetAnalysis();
    },
    
    resetAnalysis() {
      this.analysisResult = null;
      this.validation = null;
      this.validationErrors = [];
    }
  },
  
  watch: {
    reviewText() {
      this.resetAnalysis();
    }
  }
}
</script>

<style scoped>
@import '@/assets/css/review-tester.css';

.review-tester {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.review-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.review-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.review-header p {
  margin: 0;
  opacity: 0.9;
}

.review-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

/* Star Rating */
.rating-section {
  margin-bottom: 25px;
}

.rating-label {
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.star-rating {
  display: flex;
  gap: 5px;
  margin-bottom: 8px;
}

.star-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 2px;
}

.star-btn:hover {
  transform: scale(1.1);
}

.star-filled {
  filter: brightness(1);
}

.star-empty {
  filter: brightness(0.3);
}

.rating-text {
  font-weight: 600;
  color: #666;
}

/* Review Text */
.review-text-section {
  margin-bottom: 25px;
}

.review-label {
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.review-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.review-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.review-textarea.error {
  border-color: #e74c3c;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

/* Action Section */
.action-section {
  text-align: center;
}

.analyze-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.analyze-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.analyze-btn.analyzing {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Validation Errors */
.validation-errors {
  background: #fee;
  border: 1px solid #e74c3c;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
}

.validation-errors h4 {
  margin: 0 0 10px 0;
  color: #e74c3c;
}

.validation-errors ul {
  margin: 0;
  padding-left: 20px;
}

.validation-errors li {
  color: #c0392b;
  margin-bottom: 5px;
}

/* Analysis Result */
.analysis-result {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.result-header {
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}

.result-header h3 {
  margin: 0;
  color: #333;
}

.result-content {
  padding: 20px;
}

.main-result {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.main-result.positive {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border: 1px solid #28a745;
}

.main-result.negative {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border: 1px solid #dc3545;
}

.result-icon {
  font-size: 32px;
  margin-right: 15px;
}

.result-info h4 {
  margin: 0 0 5px 0;
  font-size: 18px;
}

.result-info p {
  margin: 0;
  color: #666;
}

/* Result Details */
.result-details {
  display: grid;
  gap: 10px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.detail-item .label {
  font-weight: 600;
  color: #333;
}

.detail-item .value.positive {
  color: #28a745;
  font-weight: 600;
}

.detail-item .value.negative {
  color: #dc3545;
  font-weight: 600;
}

.detail-item .value.accepted {
  color: #28a745;
  font-weight: 600;
}

.detail-item .value.rejected {
  color: #dc3545;
  font-weight: 600;
}

/* AI Response */
.ai-response {
  margin-top: 15px;
}

.ai-response summary {
  cursor: pointer;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  font-weight: 600;
}

.ai-response pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 12px;
  margin-top: 10px;
}

/* Submit Section */
.submit-section {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.submit-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn.success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.submit-btn.success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.submit-btn.disabled {
  background: #6c757d;
  color: white;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Test Examples */
.test-examples {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.test-examples h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.example-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.example-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.example-btn.positive {
  background: #d4edda;
  color: #155724;
  border: 1px solid #28a745;
}

.example-btn.negative {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #dc3545;
}

.example-btn.mixed {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffc107;
}

.example-btn.clear {
  background: #e2e3e5;
  color: #383d41;
  border: 1px solid #6c757d;
}

.example-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .review-tester {
    padding: 10px;
  }
  
  .review-form {
    padding: 20px;
  }
  
  .example-buttons {
    flex-direction: column;
  }
  
  .example-btn {
    width: 100%;
  }
}
</style>
