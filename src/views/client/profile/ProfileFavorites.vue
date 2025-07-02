<template>
  <div class="profile-favorites">
    <!-- Warning Alert -->
    <div class="alert alert-warning d-flex align-items-center mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span>Bạn vui lòng cắp nhật thông tin tài khoản:</span>
      <a href="#" class="ms-2 text-primary fw-bold">Cắp nhật thông tin ngay</a>
    </div>

    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Sản phẩm yêu thích</h2>
    </div>

    <!-- Favorites Content -->
    <div class="favorites-content">
      <div v-if="favoriteProducts.length === 0" class="no-favorites">
        <div class="empty-state">
          <i class="bi bi-heart text-muted"></i>
          <h5 class="text-muted mb-3">Bạn chưa có sản phẩm nào.</h5>
          <p class="text-muted mb-3">Hãy thêm những sản phẩm yêu thích để không bỏ lỡ cơ hội mua với giá tốt nhất.</p>
          <a href="/" class="btn btn-outline-primary">
            <i class="bi bi-arrow-left me-2"></i>
            Quay lại
          </a>
        </div>
      </div>

      <div v-else class="favorites-grid">
        <div class="row">
          <div v-for="product in favoriteProducts" :key="product.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="product-card">
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
                <button class="btn-favorite active" @click="removeFromFavorites(product.id)">
                  <i class="bi bi-heart-fill"></i>
                </button>
              </div>
              
              <div class="product-info">
                <h6 class="product-name">{{ product.name }}</h6>
                <div class="product-author" v-if="product.author">{{ product.author }}</div>
                
                <div class="product-price">
                  <span class="current-price">{{ formatCurrency(product.price) }}</span>
                  <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
                    {{ formatCurrency(product.originalPrice) }}
                  </span>
                </div>
                
                <div class="product-rating" v-if="product.rating">
                  <div class="stars">
                    <i v-for="star in 5" :key="star" 
                       class="bi" 
                       :class="star <= product.rating ? 'bi-star-fill' : 'bi-star'"
                    ></i>
                  </div>
                  <span class="rating-count">({{ product.reviewCount }})</span>
                </div>
              </div>
              
              <div class="product-actions">
                <button class="btn btn-primary btn-sm w-100" @click="addToCart(product)">
                  <i class="bi bi-cart-plus me-2"></i>
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Fake favorite products data (empty initially to show empty state)
const favoriteProducts = ref([])

// Uncomment to show products
// const favoriteProducts = ref([
//   {
//     id: 1,
//     name: 'Giáo Trình Chuẩn YCT 1 - Sách Bài Tập',
//     author: 'Tác giả ABC',
//     price: 58650,
//     originalPrice: 65000,
//     rating: 4.5,
//     reviewCount: 128,
//     image: '/src/assets/img/duck.png'
//   },
//   {
//     id: 2,
//     name: 'Combo Sách Giáo Khoa Lớp 1',
//     author: 'Nhà xuất bản Giáo dục',
//     price: 234000,
//     originalPrice: 280000,
//     rating: 4.8,
//     reviewCount: 95,
//     image: '/src/assets/img/duck.png'
//   },
//   {
//     id: 3,
//     name: 'Bộ Sách Văn Học Kinh Điển',
//     author: 'Nhiều tác giả',
//     price: 175000,
//     originalPrice: 200000,
//     rating: 4.3,
//     reviewCount: 67,
//     image: '/src/assets/img/duck.png'
//   },
//   {
//     id: 4,
//     name: 'Sách Thiếu Nhi Hay Nhất',
//     author: 'Tác giả XYZ',
//     price: 89000,
//     originalPrice: 95000,
//     rating: 4.7,
//     reviewCount: 156,
//     image: '/src/assets/img/duck.png'
//   }
// ])

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
}

// Remove from favorites
const removeFromFavorites = (productId) => {
  if (confirm('Bạn có chắc chắn muốn bỏ yêu thích sản phẩm này?')) {
    const index = favoriteProducts.value.findIndex(p => p.id === productId)
    if (index !== -1) {
      favoriteProducts.value.splice(index, 1)
    }
  }
}

// Add to cart
const addToCart = (product) => {
  // TODO: API call to add to cart
  alert(`Đã thêm "${product.name}" vào giỏ hàng`)
}
</script>

<style scoped>
.profile-favorites {
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

.favorites-content {
  margin-top: 24px;
}

.no-favorites .empty-state {
  text-align: center;
  padding: 60px 20px;
}

.no-favorites .empty-state i {
  font-size: 64px;
  margin-bottom: 20px;
}

.product-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  text-align: center;
  margin-bottom: 12px;
}

.product-image img {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;
}

.btn-favorite {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-favorite:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-favorite.active {
  background: #dc3545;
  color: white;
}

.product-info {
  flex: 1;
  margin-bottom: 12px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-author {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.product-price {
  margin-bottom: 8px;
}

.current-price {
  font-size: 16px;
  font-weight: 600;
  color: #dc3545;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  font-size: 12px;
  color: #ffc107;
}

.rating-count {
  font-size: 12px;
  color: #666;
}

.product-actions .btn {
  font-size: 13px;
  padding: 8px 16px;
}

@media (max-width: 768px) {
  .profile-favorites {
    padding: 16px;
  }
  
  .favorites-grid .col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  
  .product-image img {
    width: 80px;
    height: 110px;
  }
  
  .product-name {
    font-size: 13px;
  }
  
  .current-price {
    font-size: 14px;
  }
}
</style>
