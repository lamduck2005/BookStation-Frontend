<template>
  <section class="high-rating-section py-5">
    <div class="container">
      <!-- Section header -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="section-header text-center">
            <div class="header-decoration mb-4">
              <div class="stars-container">
                <i class="bi bi-star-fill star-icon star-1"></i>
                <i class="bi bi-star-fill star-icon star-2"></i>
                <i class="bi bi-star-fill star-icon star-3"></i>
                <i class="bi bi-star-fill star-icon star-4"></i>
                <i class="bi bi-star-fill star-icon star-5"></i>
              </div>
              <div class="title-wrapper">
                <h2 class="section-title fw-bold mb-2">
                  <span class="highlight-text">Sách Được Yêu Thích</span>
                  <div class="title-decoration">
                    <span class="decoration-line"></span>
                    <i class="bi bi-heart-fill decoration-heart"></i>
                    <span class="decoration-line"></span>
                  </div>
                </h2>
              </div>
            </div>
            <div class="subtitle-container">
              <div class="rating-stats">
                <div class="stat-item">
                  <span class="stat-number">75%+</span>
                  <span class="stat-label">Đánh giá tích cực</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-number">⭐</span>
                  <span class="stat-label">Chất lượng cao</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-number">❤️</span>
                  <span class="stat-label">Được yêu thích</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="text-muted mt-3">Đang tải sách được yêu thích...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-5">
        <i class="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
        <p class="text-muted">{{ error }}</p>
        <button class="btn btn-outline-primary" @click="fetchBooks">
          <i class="bi bi-arrow-clockwise me-2"></i>Thử lại
        </button>
      </div>

      <!-- Books grid -->
      <div v-else class="high-rating-books">
        <div class="books-showcase">
          <div class="row g-4 justify-content-center">
            <div
              class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6"
              v-for="(book, index) in books"
              :key="book.id"
            >
              <div class="book-card-wrapper" :style="{ animationDelay: (index * 0.1) + 's' }">
                <!-- Rating overlay -->
                <div class="rating-overlay">
                  <div class="rating-badge-premium">
                    <div class="badge-content">
                      <i class="bi bi-award-fill badge-icon"></i>
                      <span class="badge-text">Yêu thích</span>
                    </div>
                    <div class="badge-shine"></div>
                  </div>
                </div>
                
                <!-- Product Card -->
                <div class="product-card-container">
                  <ProductCard :product="book" />
                </div>
                
                <!-- Hover effect overlay -->
                <div class="hover-overlay">
                  <div class="hover-content">
                    <i class="bi bi-heart-fill heart-icon"></i>
                    <span class="hover-text">Được {{ Math.floor(Math.random() * 25) + 75 }}% yêu thích</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="books.length === 0" class="empty-state py-5">
          <div class="empty-content">
            <div class="empty-icon-container">
              <i class="bi bi-heart empty-heart-1"></i>
              <i class="bi bi-book empty-book"></i>
              <i class="bi bi-heart empty-heart-2"></i>
            </div>
            <h4 class="empty-title">Chưa có sách được yêu thích</h4>
            <p class="empty-description">
              Hiện tại chưa có cuốn sách nào đạt được 75% đánh giá tích cực từ độc giả.
              <br>Hãy quay lại sau để khám phá những cuốn sách tuyệt vời!
            </p>
            <div class="empty-action">
              <button class="btn btn-empty-action" @click="fetchBooks(true)">
                <i class="bi bi-arrow-clockwise me-2"></i>
                Kiểm tra lại
              </button>
            </div>
          </div>
        </div>

        <!-- View more section -->
        <div v-if="hasMore || books.length > 5" class="view-more-section mt-5">
          <div class="text-center">
            <div class="view-more-container">
              <button 
                v-if="hasMore"
                class="btn btn-view-more"
                @click="loadMore"
                :disabled="loadingMore"
              >
                <span v-if="loadingMore" class="loading-content">
                  <span class="loading-spinner"></span>
                  <span class="loading-text">Đang tải thêm...</span>
                </span>
                <span v-else class="btn-content">
                  <i class="bi bi-plus-circle-fill btn-icon"></i>
                  <span class="btn-text">Khám phá thêm sách yêu thích</span>
                  <div class="btn-decoration">
                    <span class="decoration-dot"></span>
                    <span class="decoration-dot"></span>
                    <span class="decoration-dot"></span>
                  </div>
                </span>
              </button>
              
              <div v-else-if="books.length > 0" class="completion-message">
                <div class="completion-content">
                  <i class="bi bi-check-circle-fill completion-icon"></i>
                  <span class="completion-text">Bạn đã xem hết tất cả sách được yêu thích!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ProductCard from "@/components/common/ProductCard.vue";
import { getHighPositiveRatingBooks } from "@/services/admin/book";

// Reactive data
const books = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(0);
const hasMore = ref(true);
const pageSize = 5;

// Fetch books function
const fetchBooks = async (reset = false) => {
  try {
    if (reset) {
      loading.value = true;
      currentPage.value = 0;
      books.value = [];
      error.value = null;
    } else {
      loadingMore.value = true;
    }

    const response = await getHighPositiveRatingBooks({
      page: currentPage.value,
      size: pageSize
    });

    if (response.status === 200 && response.data) {
      const newBooks = response.data.content || [];
      
      if (reset) {
        books.value = newBooks;
      } else {
        books.value = [...books.value, ...newBooks];
      }

      // Check if there are more pages
      hasMore.value = currentPage.value + 1 < response.data.totalPages;
      
      if (reset) {
        loading.value = false;
      } else {
        loadingMore.value = false;
      }
    } else {
      throw new Error(response.message || 'Lỗi khi tải dữ liệu');
    }
  } catch (err) {
    console.error('Error fetching high rating books:', err);
    error.value = 'Không thể tải danh sách sách được yêu thích. Vui lòng thử lại.';
    loading.value = false;
    loadingMore.value = false;
  }
};

// Load more books
const loadMore = async () => {
  if (!hasMore.value || loadingMore.value) return;
  
  currentPage.value++;
  await fetchBooks(false);
};

// Mount hook
onMounted(() => {
  fetchBooks(true);
});
</script>

<style scoped>
.high-rating-section {
  background: linear-gradient(135deg, #fff8f0 0%, #f0f8ff 50%, #fff0f8 100%);
  position: relative;
  overflow: hidden;
}

.high-rating-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(107, 203, 119, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 193, 7, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

/* Header Styles */
.section-header {
  position: relative;
  z-index: 2;
}

.header-decoration {
  position: relative;
}

.stars-container {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.star-icon {
  font-size: 1.5rem;
  color: #ffd93d;
  filter: drop-shadow(0 2px 4px rgba(255, 217, 61, 0.3));
  animation: twinkle 2s ease-in-out infinite;
}

.star-1 { animation-delay: 0s; }
.star-2 { animation-delay: 0.2s; }
.star-3 { animation-delay: 0.4s; }
.star-4 { animation-delay: 0.6s; }
.star-5 { animation-delay: 0.8s; }

@keyframes twinkle {
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.8; 
  }
  50% { 
    transform: scale(1.2); 
    opacity: 1; 
  }
}

.title-wrapper {
  position: relative;
}

.section-title {
  font-size: 2.8rem;
  font-weight: 800;
  position: relative;
}

.highlight-text {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 25%, #6bcf7f 50%, #4ecdc4 75%, #45b7d1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: gradientShift 4s ease-in-out infinite;
  text-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.decoration-line {
  height: 3px;
  width: 60px;
  background: linear-gradient(90deg, transparent, #ff6b6b, transparent);
  border-radius: 2px;
}

.decoration-heart {
  color: #ff6b6b;
  font-size: 1.2rem;
  animation: heartPulse 2s ease-in-out infinite;
}

@keyframes heartPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.subtitle-container {
  margin-top: 30px;
}

.rating-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 2px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.stat-divider {
  width: 2px;
  height: 30px;
  background: linear-gradient(to bottom, transparent, #ddd, transparent);
}

/* Books Showcase */
.books-showcase {
  position: relative;
  z-index: 2;
}

.book-card-wrapper {
  position: relative;
  transition: all 0.4s ease;
  animation: fadeInUp 0.8s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.book-card-wrapper:hover {
  transform: translateY(-15px) scale(1.05);
  z-index: 10;
}

.rating-overlay {
  position: absolute;
  top: -5px;
  right: -5px;
  z-index: 15;
}

.rating-badge-premium {
  position: relative;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  transform: rotate(-10deg);
  transition: all 0.3s ease;
}

.book-card-wrapper:hover .rating-badge-premium {
  transform: rotate(0deg) scale(1.1);
}

.badge-content {
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
  z-index: 2;
}

.badge-icon {
  font-size: 0.9rem;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.badge-text {
  font-size: 0.8rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.badge-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: 100%; }
}

.product-card-container {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  transition: all 0.4s ease;
}

.book-card-wrapper:hover .product-card-container {
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.hover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  padding: 15px;
  transform: translateY(100%);
  transition: all 0.4s ease;
  border-radius: 0 0 15px 15px;
}

.book-card-wrapper:hover .hover-overlay {
  transform: translateY(0);
}

.hover-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.heart-icon {
  color: #ff6b6b;
  font-size: 1.2rem;
  animation: heartBeat 1.5s ease-in-out infinite;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.hover-text {
  font-size: 0.9rem;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

/* Loading and Error States */
.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #ff6b6b;
}

/* View More Section */
.view-more-section {
  position: relative;
}

.view-more-container {
  position: relative;
  display: inline-block;
}

.btn-view-more {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  border: none;
  color: white;
  padding: 15px 40px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  cursor: pointer;
}

.btn-view-more:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
  background: linear-gradient(135deg, #ff5252 0%, #ff7043 100%);
}

.btn-view-more:active {
  transform: translateY(-1px) scale(1.02);
}

.btn-view-more:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  z-index: 2;
}

.btn-icon {
  font-size: 1.3rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.btn-text {
  white-space: nowrap;
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.btn-decoration {
  display: flex;
  gap: 4px;
  margin-left: 10px;
}

.decoration-dot {
  width: 4px;
  height: 4px;
  background: rgba(255,255,255,0.7);
  border-radius: 50%;
  animation: wave 1.5s ease-in-out infinite;
}

.decoration-dot:nth-child(1) { animation-delay: 0s; }
.decoration-dot:nth-child(2) { animation-delay: 0.2s; }
.decoration-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes wave {
  0%, 100% { transform: translateY(0); opacity: 0.7; }
  50% { transform: translateY(-5px); opacity: 1; }
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  white-space: nowrap;
}

.completion-message {
  padding: 20px;
  background: rgba(108, 207, 127, 0.1);
  border: 2px solid rgba(108, 207, 127, 0.3);
  border-radius: 25px;
  backdrop-filter: blur(10px);
}

.completion-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #28a745;
}

.completion-icon {
  font-size: 1.5rem;
  animation: checkmark 0.6s ease-out;
}

@keyframes checkmark {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.completion-text {
  font-weight: 600;
  font-size: 1.1rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 50px 20px;
}

.empty-content {
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  font-size: 3rem;
}

.empty-heart-1, .empty-heart-2 {
  color: #ffc1cc;
  animation: float 3s ease-in-out infinite;
}

.empty-heart-1 {
  animation-delay: 0s;
}

.empty-heart-2 {
  animation-delay: 1s;
}

.empty-book {
  color: #ccc;
  animation: bookWiggle 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes bookWiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.empty-title {
  color: #666;
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.empty-description {
  color: #888;
  line-height: 1.6;
  margin-bottom: 30px;
  font-size: 1rem;
}

.btn-empty-action {
  background: linear-gradient(135deg, #6c757d 0%, #868e96 100%);
  border: none;
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.btn-empty-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
  background: linear-gradient(135deg, #5a6268 0%, #6c757d 100%);
  color: white;
}

/* Button Styles */
.btn-outline-primary {
  border: 2px solid #ff6b6b;
  color: #ff6b6b;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-outline-primary:hover {
  background: #ff6b6b;
  border-color: #ff6b6b;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-title {
    font-size: 2.2rem;
  }
  
  .stars-container {
    gap: 5px;
  }
  
  .star-icon {
    font-size: 1.2rem;
  }
  
  .rating-stats {
    gap: 15px;
  }
  
  .stat-item {
    padding: 10px 15px;
  }
  
  .stat-divider {
    display: none;
  }
  
  .book-card-wrapper:hover {
    transform: translateY(-10px) scale(1.02);
  }
  
  .btn-view-more {
    padding: 12px 30px;
    font-size: 1rem;
  }
  
  .btn-text {
    font-size: 0.95rem;
  }
}

@media (max-width: 576px) {
  .section-title {
    font-size: 1.8rem;
  }
  
  .rating-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .high-rating-section {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
  
  .rating-badge-premium {
    padding: 6px 10px;
    transform: rotate(-5deg);
  }
  
  .badge-text {
    font-size: 0.7rem;
  }
  
  .btn-view-more {
    padding: 10px 25px;
    font-size: 0.9rem;
  }
  
  .btn-decoration {
    display: none;
  }
  
  .completion-message {
    padding: 15px;
  }
  
  .completion-text {
    font-size: 1rem;
  }
}

/* Enhanced animations */
@media (prefers-reduced-motion: no-preference) {
  .book-card-wrapper:nth-child(even) {
    animation-direction: alternate;
  }
  
  .book-card-wrapper:hover {
    animation-play-state: paused;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .high-rating-section {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #2d1b69 100%);
  }
  
  .stat-item {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .stat-number, .stat-label {
    color: #fff;
  }
}
</style>
