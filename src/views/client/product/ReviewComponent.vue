<template>
  <div class="review-section mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="review-header">
        <h4 class="fw-bold mb-3">Đánh giá của khách hàng</h4>
        <div class="overall-rating d-flex align-items-center">
          <h5 class="me-2 mb-0 fw-bold">Xếp hạng trung bình</h5>
        </div>
        <div class="d-flex align-items-center mt-2">
          <span class="rating-score me-2 fs-4 fw-bold">{{ averageRating }}</span>
          <div class="stars me-3">
            <i v-for="star in 5" :key="star" 
               :class="['fas fa-star', star <= Math.floor(averageRating) ? 'text-warning' : 'text-muted']"></i>
          </div>
          <span class="text-muted">( {{ totalReviews }} lượt đánh giá )</span>
        </div>
      </div>
      <button class="btn btn-danger px-4 py-2" :class="{ 'disabled' : !createReviewButtonStatus,}" @click="toggleWriteForm">
        {{ createReviewButtonText }}
      </button>
    </div>

    
    <!-- Filter and Sort Section -->
    <div class="filter-sort-section mb-4 p-3 bg-light rounded">
      <div class="row align-items-center">
        <!-- Sort Dropdown -->
        <div class="col-md-6 col-12 mb-2 mb-md-0">
          <label class="form-label fw-semibold me-2">Sắp xếp:</label>
          <select v-model="sortBy" @change="handleSortChange" class="form-select d-inline-block" style="width: auto;">
            <option v-for="option in sortByOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <select v-model="sortDirection" @change="handleSortChange" class="form-select d-inline-block ms-2" style="width: auto;">
            <option v-for="option in sortDirectionOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        
        <!-- Rating Filter -->
        <div class="col-md-6 col-12">
          <div class="d-flex align-items-center">
            <label class="form-label fw-semibold me-2 mb-0">Lọc theo sao:</label>
            <div class="rating-filter me-3">
              <i v-for="star in 5" :key="star"
                 @click="setRatingFilter(star)"
                 :class="[
                   'fas fa-star rating-filter-star', 
                   star <= (ratingFilter || 0) ? 'text-warning' : 'text-muted'
                 ]"></i>
            </div>
            <button v-if="ratingFilter > 0" @click="clearFilter" class="btn btn-sm btn-outline-secondary">
              <i class="fas fa-times"></i> Xoá bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Write Review Form (Collapse) -->
    <div class="collapse" :class="{ 'show': showWriteForm }" id="writeReviewForm">
      <div class="write-review-form mt-4 p-4">
        <h5 class="mb-3 fw-bold text-center">{{ editingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá mới' }}</h5>
        
        <form @submit.prevent="submitReview">
          <!-- Rating Stars -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Đánh giá của bạn:</label>
            <div class="rating-input d-flex align-items-center justify-content-center">
              <div class="star-rating me-3">
                <i v-for="star in 5" :key="star"
                   @click="setRating(star)"
                   @mouseover="hoverRating = star"
                   @mouseleave="hoverRating = 0"
                   :class="[
                     'fas fa-star rating-star', 
                     star <= (hoverRating || formReviewObject.rating) ? 'text-warning active' : 'text-muted'
                   ]"></i>
              </div>
              <span class="rating-text ms-2">{{ getRatingText(formReviewObject.rating) }}</span>
            </div>
          </div>

          <!-- Comment -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Nhận xét của bạn:</label>
            <textarea 
              v-model="formReviewObject.comment"
              class="form-control"
              rows="4" 
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              maxlength="500"
              required></textarea>
            <small class="text-muted">{{ formReviewObject.comment.length }}/500 ký tự</small>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="cancelWrite">
              <i class="fas fa-times me-1"></i>Hủy bỏ
            </button>
            <button type="submit" class="btn btn-outline-success">
              <i class="fas fa-paper-plane me-1"></i>{{ isEditingReview ? 'Cập nhật' : 'Gửi đánh giá' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="reviews-list">
      <div v-for="rv in reviews" :key="rv.id" class="review-item mb-4 pb-4 border-bottom">
                <div class="d-flex">
          <div class="review-avatar me-3">
             <i class='bxr  bx-user-circle fs-1 text-danger'  ></i> 
          </div>
          
          <div class="review-content flex-grow-1">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 class="mb-1 fw-bold">{{ rv.userName }}</h6>
                <small class="text-muted">{{ formatTimeAgo(rv.reviewDate) }}</small>
                <span v-if="rv.reviewStatus === 'EDITED'" class="text-muted ms-2 fst-italic">( đã chỉnh sửa )</span>
              </div>
            </div>
            
            <div class="review-stars mb-2 d-flex align-items-center">
              <i v-for="star in 5" :key="star" 
                 :class="['fas fa-star small', star <= rv.rating ? 'text-warning' : 'text-muted']"></i>
                  <button v-if="rv.userId === userId && canCreate.value === false" class="btn btn-sm btn-link ms-2" @click="startEdit(rv)"><i class="fas fa-edit"></i></button>
                </div>
            
            <p class="review-text mb-0">{{ rv.comment }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Load more reviews button (optional) -->
    <div class="text-center mt-4">
      <button class="btn btn-outline-primary" @click="loadMore">{{ isLastPage ? 'Thu gọn' : 'Xem thêm đánh giá' }}</button>
    </div>
  </div>
</template>

<script setup>
import { getBookPublishedReviews, getBookPublishedAverage, createReview, updateReview, canCreateReview, canEditReview, hasPurchasedBook, getUserReview } from '@/services/client/review'
import { showToast } from '@/utils/swalHelper'
import { getUserId } from '@/utils/utils'
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const bookId = ref()
const userId = ref()
// Reactive data
const showWriteForm = ref(false)
const hoverRating = ref(0)
const reviews = ref([])
const totalReviews = ref(0)
const averageRating = ref(0)
const page = ref(0)
const size = 3
const isLastPage = ref(false)
const formReviewObject = ref({
  bookId: 0,
  userId: 0,
  rating: 0,
  comment: '',
  reviewStatus: ''
})


const canCreate = ref(true)
const canEdit = ref(true)
const hasPurchased = ref(true)
const isEditingReview = ref(false)
const editingReview = ref(null)


const createReviewButtonText = ref('Viết đánh giá')
const createReviewButtonStatus = ref(true)

const sortBy = ref('reviewDate')
const sortDirection = ref('DESC')  
const ratingFilter = ref(0)

const sortByOptions = [
  { value: 'reviewDate', label: 'Ngày đánh giá' },
  { value: 'rating', label: 'Số sao' },
  // { value: 'id', label: 'Mới nhất' }
]

const sortDirectionOptions = [
  { value: 'DESC', label: 'Giảm dần' },
  { value: 'ASC', label: 'Tăng dần' }
]

// Methods
const formatTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)
  
  if (years > 0) return `${years} năm trước`
  if (months > 0) return `${months} tháng trước`
  if (days > 0) return `${days} ngày trước`
  if (hours > 0) return `${hours} giờ trước`
  if (minutes > 0) return `${minutes} phút trước`
  return 'Vừa xong'
}


const handleLoadAverageRating = async () => {
  try {
    const response = await getBookPublishedAverage(bookId.value)
    // làm tròn 1 chữ số thập phân
    const rawAvg = response.data.data || 0
    averageRating.value = Math.round(rawAvg * 10) / 10
    console.log('Loaded average rating for product:', bookId.value)
  } catch (error) {
    console.error('Error loading average rating:', error)
  }
}

const handleFetchReviews = async (reset = false) => {
  try {
    const params = { 
      page: page.value, 
      size,
      sortBy: sortBy.value,
      sortDirection: sortDirection.value
    }
    
    // Add rating filter if selected
    if (ratingFilter.value > 0) {
      params.rating = ratingFilter.value
    }
    
    const res = await getBookPublishedReviews(bookId.value, params)
    const paginated = res.data.data
    console.log("🚀 ~ handleFetchReviews ~ paginated:", paginated.content)

    if (reset) {
      //reset mảng reviews về trang đầu
      reviews.value = paginated.content
    } else {
      //thêm vào mảng reviews
      reviews.value.push(...paginated.content)
    }
    totalReviews.value = paginated.totalElements
    isLastPage.value = paginated.last ?? (page.value + 1 >= paginated.totalPages)
  } catch (err) {
    console.error('Err load reviews', err)
  }
}

const loadMore = async () => {
  if (isLastPage.value) {
    // Thu gọn về trang đầu
    page.value = 0
    await handleFetchReviews(true)
    return
  }
  page.value += 1
  await handleFetchReviews(false)
}

const toggleWriteForm = async () => {
  showWriteForm.value = !showWriteForm.value
  if (!showWriteForm.value) {
    resetForm()
  } 

    await handleGetUserReview()
  
}

const setRating = (rating) => {
  formReviewObject.value.rating = rating
}

const getRatingText = (rating) => {
  const texts = {
    0: 'Chưa đánh giá',
    1: 'Rất tệ',
    2: 'Tệ', 
    3: 'Tốt',
    4: 'Rất tốt',
    5: 'Tuyệt vời'
  }
  return texts[rating] || 'Chưa đánh giá'
}

const resetForm = () => {
  formReviewObject.value = {
    rating: 0,
    comment: ''
  }
  hoverRating.value = 0
}

const cancelWrite = () => {
  resetForm()
  showWriteForm.value = false
  isEditingReview.value = false
}

const submitReview = async () => {
  if (!createReviewButtonStatus.value) return
  
  try {
    formReviewObject.value.bookId = bookId.value
    formReviewObject.value.userId = userId.value

    if (!isEditingReview.value) {
      formReviewObject.value.reviewStatus = 'APPROVED'
      await createReview(bookId.value, formReviewObject.value)
      showToast('success', 'Đã tạo đánh giá sách thành công!')
    } else {
      formReviewObject.value.reviewStatus = 'EDITED'
      await updateReview(bookId.value, editingReview.value.id, formReviewObject.value)
      showToast('success', 'Đã cập nhật đánh giá thành công!')
    }
    // reload list & permission
    page.value = 0
    await handleFetchReviews(true)
    await handleLoadPermission()
    resetForm()
    showWriteForm.value = false
    isEditingReview.value = false
  } catch (error) {
    console.error('Error submitting review:', error)
    showToast('error', error.response.data.message || 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!')
  }
}


const startEdit = (rv) => {
  formReviewObject.value.rating = rv.rating
  formReviewObject.value.comment = rv.comment
  showWriteForm.value = true
}

const handleLoadPermission = async () => {
  try {
    const fetchCanCreate = await canCreateReview(bookId.value, userId.value)
    const fetchCanEdit = await canEditReview(bookId.value, userId.value)
    const fetchHasPurchased = await hasPurchasedBook(bookId.value, userId.value)

    canCreate.value = fetchCanCreate.data.data
    canEdit.value = fetchCanEdit.data.data
    hasPurchased.value = fetchHasPurchased.data.data

    if (!hasPurchased.value) {
      createReviewButtonText.value = 'Vui lòng mua sách để đánh giá'
      createReviewButtonStatus.value = false
    } else if (canCreate.value && !canEdit.value) {
      createReviewButtonText.value = 'Viết đánh giá'
      createReviewButtonStatus.value = true
    } else if (!canCreate.value  && canEdit.value ) {
      createReviewButtonText.value = 'Chỉnh sửa đánh giá'
      createReviewButtonStatus.value = true
      isEditingReview.value = true
    } else if (!canCreate.value && !canEdit.value) {
      createReviewButtonText.value = 'Đã đạt giới hạn chỉnh sửa đánh giá'
      createReviewButtonStatus.value = false
    }
  } catch (err) {
    canCreate.value = false
    canEdit.value = false
    hasPurchased.value = false
  }
}

const handleGetUserReview = async () => {
  const res = await getUserReview(bookId.value, userId.value)
  if (res.data.data) {
    editingReview.value = res.data.data
    isEditingReview.value = true
    formReviewObject.value.rating = editingReview.value.rating
    formReviewObject.value.comment = editingReview.value.comment
  }
}

const setRatingFilter = (rating) => {
  ratingFilter.value = ratingFilter.value === rating ? 0 : rating
  handleFilterChange()
}

const clearFilter = () => {
  ratingFilter.value = 0
  handleFilterChange()
}

const handleSortChange = () => {
  page.value = 0
  handleFetchReviews(true)
}

const handleFilterChange = () => {
  page.value = 0
  handleFetchReviews(true)
}

// Lifecycle
onMounted(() => {
  bookId.value = route.params.id
  userId.value = getUserId() || 0
  handleFetchReviews(true)
  handleLoadAverageRating()
  handleLoadPermission()
  handleGetUserReview()
})

</script>

<style scoped>
.review-section {
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.review-header h4 {
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
}

.review-header h4::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b, #ffa500);
  border-radius: 2px;
}

.overall-rating h5 {
  color: #34495e;
  font-weight: 600;
}

.rating-score {
  color: #2c3e50;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stars i {
  font-size: 1rem;
  margin-right: 2px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(255, 193, 7, 0.3));
}

.stars i.text-warning {
  color: #ffc107 !important;
  animation: starGlow 2s ease-in-out infinite alternate;
}

@keyframes starGlow {
  0% { filter: drop-shadow(0 2px 4px rgba(255, 193, 7, 0.3)); }
  100% { filter: drop-shadow(0 4px 8px rgba(255, 193, 7, 0.5)); }
}

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(238, 90, 82, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-danger::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-danger:hover::before {
  left: 100%;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ff5722 0%, #d32f2f 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(238, 90, 82, 0.4);
}

.btn-danger:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(238, 90, 82, 0.3);
}

.reviews-list {
  margin-top: 2rem;
}

.review-item {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: none !important;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.review-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #ff6b6b, #ffa500);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.review-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.review-item:hover::before {
  opacity: 1;
}

.review-avatar {
  position: relative;
}

.review-avatar img {
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.review-avatar:hover img {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.verified-badge {
  font-size: 0.7rem;
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: #ffffff;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.verified-badge i {
  font-size: 0.8rem;
}

.review-content h6 {
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.review-content small {
  color: #7f8c8d;
  font-weight: 500;
}

.review-stars {
  margin: 0.5rem 0;
}

.review-stars i {
  font-size: 0.85rem;
  margin-right: 1px;
  transition: all 0.2s ease;
}

.review-stars i.text-warning {
  color: #f39c12 !important;
}

.review-text {
  color: #34495e;
  line-height: 1.7;
  font-weight: 400;
  margin-top: 0.75rem;
  position: relative;
  padding-left: 1rem;
}

.review-text::before {
  content: '"';
  position: absolute;
  left: 0;
  top: -5px;
  font-size: 2rem;
  color: #e0e6ed;
  font-family: serif;
  line-height: 1;
}



/* Responsive adjustments */
@media (max-width: 992px) {
  .review-section {
    margin: 0 1.5rem;
    max-width: calc(100% - 3rem);
  }
}

@media (max-width: 768px) {
  .review-section {
    padding: 1.5rem;
    border-radius: 15px;
    margin: 0 1rem;
    max-width: calc(100% - 2rem);
  }
  
  .review-item {
    padding: 1rem;
  }
  
  .review-header h4 {
    font-size: 1.3rem;
  }
  
  .rating-score {
    font-size: 1.5rem;
  }
}

/* Loading animation */
.review-item {
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation for review items */
.review-item:nth-child(1) { animation-delay: 0.1s; }
.review-item:nth-child(2) { animation-delay: 0.2s; }
.review-item:nth-child(3) { animation-delay: 0.3s; }
.review-item:nth-child(4) { animation-delay: 0.4s; }

.review-content {
  min-width: 0;
}

/* Write Review Form Styles */
.write-review-form {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s ease forwards;
}

.rating-input {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.star-rating .rating-star {
  font-size: 1.8rem;
  cursor: pointer;
  margin: 0 0.2rem;
  transition: color 0.2s ease;
}

.star-rating .rating-star:hover {
  transform: scale(1.1);
}

.rating-text {
  font-size: 1rem;
  font-weight: 500;
  color: #495057;
  min-width: 80px;
}

/* Filter and Sort Section Styles */
.filter-sort-section {
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.filter-sort-section:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.rating-filter-star {
  font-size: 1.2rem;
  cursor: pointer;
  margin: 0 0.1rem;
  transition: all 0.2s ease;
}

.rating-filter-star:hover {
  transform: scale(1.2);
  filter: drop-shadow(0 2px 4px rgba(255, 193, 7, 0.4));
}

.rating-filter-star.text-warning {
  color: #ffc107 !important;
}

.form-select {
  border-radius: 8px;
  border: 1px solid #ced4da;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-select:focus {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25);
}

@media (max-width: 768px) {
  .filter-sort-section .row > div {
    text-align: center;
  }
  
  .rating-filter {
    justify-content: center;
  }
}
</style>
