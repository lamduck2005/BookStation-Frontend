<template>
  <div class="profile-reviews">
    <!-- Warning Alert -->
    <div class="alert alert-warning d-flex align-items-center mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span>Bạn vui lòng cắp nhật thông tin tài khoản:</span>
      <a href="#" class="ms-2 text-primary fw-bold">Cắp nhật thông tin ngay</a>
    </div>

    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Nhận xét của tôi</h2>
    </div>

    <!-- Reviews Content -->
    <div class="reviews-content">
      <div v-if="userReviews.length === 0" class="no-reviews">
        <div class="empty-state">
          <i class="bi bi-chat-quote text-muted"></i>
          <h5 class="text-muted mb-3">Bạn chưa có nhận xét nào.</h5>
          <p class="text-muted mb-3">Hãy chia sẻ trải nghiệm của bạn về những sản phẩm đã mua để giúp người khác đưa ra quyết định tốt hơn.</p>
          <a href="/" class="btn btn-outline-primary">
            <i class="bi bi-arrow-left me-2"></i>
            Quay lại
          </a>
        </div>
      </div>

      <div v-else class="reviews-list">
        <div v-for="review in userReviews" :key="review.id" class="review-card mb-4">
          <div class="review-header">
            <div class="product-info">
              <div class="product-image">
                <img :src="review.product.image" :alt="review.product.name" />
              </div>
              <div class="product-details">
                <h6 class="product-name">{{ review.product.name }}</h6>
                <p class="product-author" v-if="review.product.author">{{ review.product.author }}</p>
              </div>
            </div>
            <div class="review-date">
              {{ formatDate(review.date) }}
            </div>
          </div>

          <div class="review-content">
            <div class="review-rating">
              <div class="stars">
                <i v-for="star in 5" :key="star" 
                   class="bi" 
                   :class="star <= review.rating ? 'bi-star-fill' : 'bi-star'"
                ></i>
              </div>
              <span class="rating-text">{{ getRatingText(review.rating) }}</span>
            </div>

            <div class="review-text" v-if="review.comment">
              <p>{{ review.comment }}</p>
            </div>

            <div class="review-images" v-if="review.images && review.images.length > 0">
              <div class="image-gallery">
                <img v-for="image in review.images" :key="image" :src="image" alt="Review image" />
              </div>
            </div>
          </div>

          <div class="review-actions">
            <button class="btn btn-sm btn-outline-primary" @click="editReview(review)">
              <i class="bi bi-pencil me-1"></i>
              Chỉnh sửa
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="deleteReview(review.id)">
              <i class="bi bi-trash me-1"></i>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Fake user reviews data (empty initially to show empty state)
const userReviews = ref([])

// Uncomment to show reviews
// const userReviews = ref([
//   {
//     id: 1,
//     product: {
//       id: 1,
//       name: 'Giáo Trình Chuẩn YCT 1 - Sách Bài Tập',
//       author: 'Tác giả ABC',
//       image: '/src/assets/img/duck.png'
//     },
//     rating: 5,
//     comment: 'Sách rất hay và bổ ích. Nội dung được trình bày rõ ràng, dễ hiểu. Tôi rất hài lòng với sản phẩm này.',
//     date: '2025-01-15T10:30:00',
//     images: [
//       '/src/assets/img/duck.png',
//       '/src/assets/img/duck.png'
//     ]
//   },
//   {
//     id: 2,
//     product: {
//       id: 2,
//       name: 'Combo Sách Giáo Khoa Lớp 1',
//       author: 'Nhà xuất bản Giáo dục',
//       image: '/src/assets/img/duck.png'
//     },
//     rating: 4,
//     comment: 'Chất lượng sách tốt, giao hàng nhanh. Tuy nhiên giá hơi cao so với mặt bằng chung.',
//     date: '2025-01-10T14:20:00',
//     images: []
//   },
//   {
//     id: 3,
//     product: {
//       id: 3,
//       name: 'Bộ Sách Văn Học Kinh Điển',
//       author: 'Nhiều tác giả',
//       image: '/src/assets/img/duck.png'
//     },
//     rating: 5,
//     comment: 'Bộ sách tuyệt vời! Rất đáng để sưu tầm và đọc.',
//     date: '2025-01-05T09:15:00',
//     images: ['/src/assets/img/duck.png']
//   }
// ])

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

// Get rating text
const getRatingText = (rating) => {
  const ratingTexts = {
    1: 'Rất không hài lòng',
    2: 'Không hài lòng',
    3: 'Bình thường',
    4: 'Hài lòng',
    5: 'Rất hài lòng'
  }
  return ratingTexts[rating] || ''
}

// Edit review
const editReview = (review) => {
  // TODO: Open edit review modal
  alert(`Chỉnh sửa đánh giá cho sản phẩm: ${review.product.name}`)
}

// Delete review
const deleteReview = (reviewId) => {
  if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
    const index = userReviews.value.findIndex(r => r.id === reviewId)
    if (index !== -1) {
      userReviews.value.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.profile-reviews {
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

.reviews-content {
  margin-top: 24px;
}

.no-reviews .empty-state {
  text-align: center;
  padding: 60px 20px;
}

.no-reviews .empty-state i {
  font-size: 64px;
  margin-bottom: 20px;
}

.review-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.2s ease;
}

.review-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.product-image {
  width: 60px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.product-author {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.review-date {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.review-content {
  margin-bottom: 16px;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  font-size: 16px;
  color: #ffc107;
}

.rating-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.review-text {
  margin-bottom: 16px;
}

.review-text p {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.review-images {
  margin-bottom: 16px;
}

.image-gallery {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.image-gallery img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.image-gallery img:hover {
  transform: scale(1.05);
}

.review-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.review-actions .btn {
  font-size: 13px;
  padding: 6px 16px;
}

@media (max-width: 768px) {
  .profile-reviews {
    padding: 16px;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .product-info {
    gap: 12px;
  }
  
  .product-image {
    width: 50px;
    height: 70px;
  }
  
  .product-name {
    font-size: 14px;
  }
  
  .review-actions {
    justify-content: flex-start;
  }
  
  .image-gallery img {
    width: 60px;
    height: 60px;
  }
}
</style>
