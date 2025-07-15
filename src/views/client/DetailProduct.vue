<template>
  <div class="product-detail-page">
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div v-else-if="book" class="product-detail-container">
      <!-- Left Panel - Fixed -->
      <div class="left-panel">
        <!-- Product Image -->
        <div class="product-image-section">
          <div class="main-image-container">
            <img
              :src="(book.images && book.images.length > 0) ? book.images[mainImageIndex] : (book.coverImageUrl || 'https://via.placeholder.com/400x500?text=No+Image')"
              :alt="book.bookName"
              class="main-image"
            />
            <!-- Gift Badge -->
            <div class="gift-badge">
              <span class="gift-text">QUÀ TẶNG</span>
              <span class="gift-text">GIẤY KHEN</span>
            </div>
          </div>
          <!-- Thumbnail Images -->
          <div class="thumbnail-container">
            <div
              v-for="(img, idx) in book.images"
              :key="img"
              class="thumbnail-item"
              :class="{ active: mainImageIndex === idx }"
              @click="mainImageIndex = idx"
            >
              <img :src="img" :alt="'Thumbnail ' + (idx + 1)" />
            </div>
            <div v-if="!book.images || book.images.length === 0" class="thumbnail-item active">
              <img :src="book.coverImageUrl || 'https://via.placeholder.com/80x100'" alt="Thumbnail" />
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="action-buttons">
            <button
              class="btn btn-outline-danger btn-lg add-cart-btn"
              :disabled="book.stockQuantity <= 0 || addingToCart"
              @click="addToCart(false)"
            >
              <i v-if="addingToCart" class="fa fa-spinner fa-spin me-2"></i>
              <i v-else class="fa fa-shopping-cart me-2"></i>
              {{ addingToCart ? 'Đang thêm...' : (book.stockQuantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng') }}
            </button>
            <button
              class="btn btn-danger btn-lg buy-now-btn"
              @click="buyNow"
              :disabled="book.stockQuantity <= 0 || addingToCart"
            >
              <i v-if="addingToCart" class="fa fa-spinner fa-spin me-2"></i>
              {{ addingToCart ? 'Đang xử lý...' : (book.stockQuantity > 0 ? 'Mua ngay' : 'Hết hàng') }}
            </button>
          </div>
        </div>
        
        <!-- BookStation Policies -->
        <div class="bookstation-policies">
          <h5 class="policy-title">Chính sách ưu đãi của BookStation</h5>
          
          <div class="policy-item">
            <i class="fa fa-truck text-danger"></i>
            <div class="policy-content">
              <strong>Thời gian giao hàng:</strong> Giao nhanh và uy tín
            </div>
          </div>
          
          <div class="policy-item">
            <i class="fa fa-undo text-danger"></i>
            <div class="policy-content">
              <strong>Chính sách đổi trả:</strong> Đổi trả miễn phí toàn quốc
            </div>
          </div>
          
          <div class="policy-item">
            <i class="fa fa-users text-danger"></i>
            <div class="policy-content">
              <strong>Chính sách khách sỉ:</strong> Ưu đãi khi mua số lượng lớn
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Panel - Scrollable -->
      <div class="right-panel">
        <div class="product-info-section">
          <!-- Product Header -->
          <div class="product-header">
            <h1 class="product-title">{{ book.bookName }}</h1>
            
            <div class="product-meta">
              <div class="meta-row">
                <span class="meta-label">Nhà cung cấp:</span>
                <span class="meta-value text-primary">{{ book.supplierName || 'Chưa cập nhật' }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Tác giả:</span>
                <span class="meta-value">
                  <span v-if="book.authors && book.authors.length > 0">
                    {{ book.authors.map(author => author.authorName).join(', ') }}
                  </span>
                  <span v-else>Chưa cập nhật</span>
                </span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Nhà xuất bản:</span>
                <span class="meta-value">{{ book.publisherName || 'Chưa cập nhật' }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Hình thức bìa:</span>
                <span class="meta-value">{{ book.format || 'Bìa Mềm' }}</span>
              </div>
            </div>
            
            <div class="rating-section">
              <div class="star-rating">
                <template v-for="i in 5" :key="i">
                  <i class="fa fa-star" :class="i <= (book.averageRating || 0) ? 'text-warning' : 'text-muted'"></i>
                </template>
              </div>
              <span class="review-count">({{ book.reviewCount || 0 }} đánh giá)</span>
              <span class="sold-count">| Đã bán {{ book.soldCount || 0 }}</span>
            </div>
          </div>
          
          <!-- Flash Sale Section -->
          <div v-if="book.flashSalePrice !== null" class="flash-sale-section">
            <div class="flash-sale-container">
              <div class="flash-sale-header">
                <i class="fa fa-bolt"></i>
                <span>FLASH SALE</span>
              </div>
              <div class="countdown-timer">
                {{ countdownDisplay }}
              </div>
              <div class="flash-sale-progress">
                <div class="progress-text">
                  Đã bán {{ book.flashSaleSoldCount || 0 }}
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Price Section -->
          <div class="price-section">
            <div class="price-display">
              <span class="current-price">{{ formatPrice(book.price) }}</span>
              <span v-if="book.flashSalePrice !== null || book.discountPercent" class="original-price">
                {{ formatPrice(calculateOriginalPrice()) }}
              </span>
              <span v-if="book.flashSaleDiscount" class="discount-percent">-{{ book.flashSaleDiscount }}%</span>
              <span v-else-if="book.discountPercent" class="discount-percent">-{{ book.discountPercent }}%</span>
            </div>
            
            <!-- Stock Info -->
            <div class="stock-info">
              <span class="stock-text text-primary">{{ book.stockQuantity || 0 }} nhà sách còn hàng</span>
            </div>
          </div>
          
          <!-- Promotions -->
          <div class="promotions-section">
            <h6 class="section-title">Ưu đãi liên quan</h6>
            <div class="promo-grid">
              <div class="promo-item">
                <i class="fa fa-percent text-warning"></i>
                <span>Mã giảm 10k - to...</span>
              </div>
              <div class="promo-item">
                <i class="fa fa-percent text-warning"></i>
                <span>Mã giảm 20k - to...</span>
              </div>
              <div class="promo-item">
                <i class="fa fa-credit-card text-primary"></i>
                <span>Vpbank: giảm 50...</span>
              </div>
              <div class="promo-item">
                <i class="fa fa-credit-card text-primary"></i>
                <span>Shopeepay: giảm...</span>
              </div>
            </div>
          </div>
          
          <!-- Quantity Selector -->
          <div class="quantity-section">
            <span class="quantity-label">Số lượng:</span>
            <div class="quantity-controls">
              <button class="quantity-btn" @click="decreaseQuantity">−</button>
              <input type="number" v-model="quantity" min="1" class="quantity-input" />
              <button class="quantity-btn" @click="increaseQuantity">+</button>
            </div>
          </div>
          
          <!-- Product Details -->
          <div class="details-section">
            <h4 class="section-title">Thông tin chi tiết</h4>
            <div class="details-table">
              <div class="detail-row">
                <span class="detail-label">Mã hàng</span>
                <span class="detail-value">{{ book.isbn || 'Chưa cập nhật' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tên Nhà Cung Cấp</span>
                <span class="detail-value text-primary">{{ book.supplierName || 'Chưa cập nhật' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tác giả</span>
                <span class="detail-value">
                  <span v-if="book.authors && book.authors.length > 0">
                    {{ book.authors.map(author => author.authorName).join(', ') }}
                  </span>
                  <span v-else>Chưa cập nhật</span>
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Người Dịch</span>
                <span class="detail-value">{{ book.translator || 'Chưa cập nhật' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">NXB</span>
                <span class="detail-value">{{ book.publisherName || 'Chưa cập nhật' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Năm XB</span>
                <span class="detail-value">{{ book.publishedYear || 'Chưa cập nhật' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Ngôn Ngữ</span>
                <span class="detail-value">{{ book.language || 'Tiếng Việt' }}</span>
              </div>
              <div class="detail-row" v-if="book.weight">
                <span class="detail-label">Trọng lượng (gr)</span>
                <span class="detail-value">{{ book.weight }}</span>
              </div>
              <div class="detail-row" v-if="book.dimensions">
                <span class="detail-label">Kích Thước Bao Bì</span>
                <span class="detail-value">{{ book.dimensions }}</span>
              </div>
              <div class="detail-row" v-if="book.pageCount">
                <span class="detail-label">Số trang</span>
                <span class="detail-value">{{ book.pageCount }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Hình thức</span>
                <span class="detail-value">{{ book.format || 'Bìa Mềm' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Sản phẩm bán chạy nhất</span>
                <span class="detail-value text-primary">Top 100 sản phẩm Kỹ năng sống bán chạy của tháng</span>
              </div>
            </div>
          </div>
          
          <!-- Product Description -->
          <div class="description-section" v-if="book.description">
            <h4 class="section-title">Mô tả sản phẩm</h4>
            <div class="description-content">
              <h5>{{ book.bookName }}</h5>
              <div v-html="book.description"></div>
              <button class="btn btn-link text-primary p-0 expand-btn">Xem thêm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="error-container">
      <h3>Không tìm thấy sản phẩm</h3>
      <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <button class="btn btn-primary" @click="$router.push('/')">
        Quay về trang chủ
      </button>
    </div>
  </div>
</template>

<script>
import { getBookDetail } from '@/services/client/book.js'
import { addToCart as addToCartAPI } from '@/services/client/cart.js'
import { createSessionFromCart } from '@/services/client/checkout.js'
import { showToast } from '@/utils/swalHelper.js'
import { getUserId } from '@/utils/utils.js'
import { createFlashSaleCountdown, formatCountdownTime } from '@/utils/flashSaleUtils.js'

export default {
  name: 'DetailProduct',
  data() {
    return {
      book: null,
      loading: true,
      error: null,
      flashSaleCountdown: null,
      countdownDisplay: 'Hết hạn',
      quantity: 1,
      addingToCart: false,
      mainImageIndex: 0 // Thêm state để chọn ảnh chính
    }
  },
  computed: {
    progressPercentage() {
      if (!this.book || !this.book.flashSalePrice) return 0
      const soldCount = this.book.flashSaleSoldCount || 0
      const totalStock = this.book.stockQuantity || 1
      return Math.min((soldCount / (soldCount + totalStock)) * 100, 100)
    }
  },
  async mounted() {
    await this.loadBookDetail()
  },
  beforeUnmount() {
    if (this.flashSaleCountdown) {
      this.flashSaleCountdown.clear()
    }
  },
  methods: {
    async loadBookDetail() {
      try {
        this.loading = true
        const bookId = this.$route.params.id
        
        if (!bookId) {
          this.error = 'Không tìm thấy ID sản phẩm'
          return
        }

        const response = await getBookDetail(bookId)
        
        if (response.status === 200) {
          this.book = response.data
          
          // Nếu có flash sale, setup countdown timer
          if (this.book.flashSalePrice !== null && this.book.flashSaleEndTime) {
            this.setupCountdownTimer()
          }
        } else {
          this.error = 'Không thể tải thông tin sản phẩm'
        }
      } catch (error) {
        console.error('Error loading book detail:', error)
        this.error = 'Đã xảy ra lỗi khi tải thông tin sản phẩm'
      } finally {
        this.loading = false
      }
    },
    
    setupCountdownTimer() {
      if (!this.book.flashSaleEndTime) return
      
      // Dọn dẹp countdown cũ nếu có
      if (this.flashSaleCountdown) {
        this.flashSaleCountdown.clear()
      }
      
      this.flashSaleCountdown = createFlashSaleCountdown(
        this.book.flashSaleEndTime,
        this.book.serverTime,
        // Callback khi flash sale hết hạn
        () => {
          this.countdownDisplay = 'Hết hạn'
          console.log('Flash sale expired for book:', this.book.bookName)
          showToast('info', 'Flash sale đã kết thúc. Đang cập nhật giá...')
          // Flash sale đã kết thúc, reload trang để cập nhật giá
          this.loadBookDetail()
        },
        // Callback cập nhật countdown display (sử dụng format full)
        (countdownText) => {
          // Sử dụng trực tiếp countdownText được truyền từ utility
          this.countdownDisplay = countdownText
        },
        'full' // Sử dụng format full
      )
    },
    
    formatPrice(price) {
      if (!price) return '0 đ'
      return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
    },
    
    calculateOriginalPrice() {
      if (!this.book) return 0
      
      // Nếu có originalPrice từ backend, dùng nó
      if (this.book.originalPrice) {
        return this.book.originalPrice
      }
      
      // Nếu có flash sale, tính ngược từ price và discount
      if (this.book.flashSalePrice !== null && this.book.flashSaleDiscount) {
        return Math.round(this.book.price / (1 - this.book.flashSaleDiscount / 100))
      }
      
      // Nếu có discount, tính ngược từ price và discount
      if (this.book.discountPercent) {
        return Math.round(this.book.price / (1 - this.book.discountPercent / 100))
      }
      
      if (this.book.discountValue) {
        return this.book.price + this.book.discountValue
      }
      
      // Nếu không có gì, trả về price hiện tại
      return this.book.price
    },
    
    buyNow() {
      if (!this.book || this.book.stockQuantity <= 0 || this.addingToCart) {
        return
      }
      
      // Kiểm tra đăng nhập
      const userId = getUserId()
      if (!userId) {
        showToast('error', 'Vui lòng đăng nhập để mua hàng')
        this.$router.push('/auth')
        return
      }
      
      // Mua ngay: tạo checkout session từ cart và redirect thẳng đến checkout
      this.buyNowDirect()
    },
    
    async buyNowDirect() {
      try {
        this.addingToCart = true
        
        const userId = getUserId()
        
        // Bước 1: Thêm sản phẩm vào giỏ hàng
        const cartData = {
          userId: userId,
          bookId: this.book.id,
          quantity: this.quantity
        }
        
        const addCartResponse = await addToCartAPI(cartData)
        
        if (addCartResponse.status === 200) {
          // Bước 2: Tạo checkout session từ cart
          const sessionResponse = await createSessionFromCart(userId)
          
          if (sessionResponse.status === 201) {
            const sessionId = sessionResponse.data.id
            
            // Bước 3: Redirect thẳng đến checkout page
            showToast('success', 'Đang chuyển đến trang thanh toán...')
            setTimeout(() => {
              this.$router.push(`/checkout/${sessionId}`)
            }, 300)
          } else {
            throw new Error('Không thể tạo phiên checkout')
          }
        } else {
          throw new Error('Không thể thêm sản phẩm vào giỏ hàng')
        }
        
      } catch (error) {
        console.error('Error in buy now process:', error)
        
        let errorMessage = 'Có lỗi xảy ra khi mua hàng'
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        showToast('error', errorMessage)
      } finally {
        this.addingToCart = false
      }
    },
    
    async addToCart(isBuyNow = false) {
      if (!this.book || this.book.stockQuantity <= 0 || this.addingToCart) {
        return
      }
      
      // Kiểm tra đăng nhập
      const userId = getUserId()
      if (!userId) {
        showToast('error', 'Vui lòng đăng nhập để thêm vào giỏ hàng')
        this.$router.push('/auth')
        return
      }
      
      try {
        this.addingToCart = true
        
        const cartData = {
          userId: userId,
          bookId: this.book.id,
          quantity: this.quantity
        }
        
        const response = await addToCartAPI(cartData)
        
        if (response.status === 200) {
          // Hiển thị thông báo thành công
          showToast('success', response.data.message || 'Thêm sản phẩm vào giỏ hàng thành công!', 'top-end', true, 1000)
          
          // Nếu có flash sale, hiển thị số tiền tiết kiệm
              if (response.data.data?.savedAmount > 0) {
                setTimeout(() => {
                  showToast('info', `Bạn đã tiết kiệm ${this.formatPrice(response.data.data.savedAmount)}!`, 'center', true, 300)
                }, 300)
          }
        // Nếu có thông báo hết hàng flash sale
        if (response.data.data?.flashSaleStockLeft !== undefined && response.data.data?.flashSaleStockLeft !== null) {
          // Nếu đã có đủ số lượng trong giỏ, flash sale không đủ hàng
          if (response.data.data.flashSaleStockLeft === 0 && response.data.data.cartQuantity) {
            setTimeout(() => {
              showToast('warning', `Bạn đã có ${response.data.data.cartQuantity} trong giỏ. Flash sale không đủ hàng. Còn lại: ${response.data.data.cartQuantity}`, 'top-end', true, 1000)
            }, 300)
          } else if (response.data.data.flashSaleStockLeft > 0 && response.data.data.cartQuantity) {
            setTimeout(() => {
              showToast('warning', `Bạn đã có ${response.data.data.cartQuantity} trong giỏ. Flash sale không đủ hàng. Còn lại: ${response.data.data.flashSaleStockLeft}`, 'top-end', true, 1000)
            }, 300)
          }
        }
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        
        // Xử lý các loại lỗi khác nhau
        let errorMessage = 'Có lỗi xảy ra khi thêm vào giỏ hàng'
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response?.status === 404) {
          errorMessage = 'Không tìm thấy sản phẩm'
        } else if (error.response?.status === 400) {
          errorMessage = 'Thông tin không hợp lệ'
        }
        
        showToast('error', errorMessage)
      } finally {
        this.addingToCart = false
      }
    },
    
    increaseQuantity() {
      if (this.quantity < (this.book?.stockQuantity || 1)) {
        this.quantity++
      }
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    }
  }
}
</script>

<style scoped>
/* Main Layout */
.product-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;
}

.product-detail-container {
  display: flex;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* Left Panel - Fixed */
.left-panel {
  width: 45%;
  flex-shrink: 0;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  background: white;
}

.product-image-section {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.main-image-container {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.main-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
}

/* Flash Sale Section - Right Panel */
.flash-sale-section {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.flash-sale-container {
  text-align: center;
}

.flash-sale-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 12px;
}

.flash-sale-header i {
  margin-right: 8px;
  animation: flash 1s infinite;
}

@keyframes flash {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.5; }
}

.countdown-timer {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 12px;
  font-family: 'Courier New', monospace;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.flash-sale-progress {
  text-align: center;
}

.progress-text {
  font-size: 0.9rem;
  margin-bottom: 8px;
  opacity: 0.9;
}

.progress-bar-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto;
  max-width: 200px;
}

.progress-bar {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
}

/* Gift Badge */
.gift-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: white;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.gift-text {
  display: block;
  line-height: 1.2;
}

/* Thumbnails */
.thumbnail-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.thumbnail-item {
  width: 60px;
  height: 75px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s;
}

.thumbnail-item.active {
  border-color: #dc3545;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-more {
  width: 60px;
  height: 75px;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #666;
  cursor: pointer;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-cart-btn,
.buy-now-btn {
  flex: 1;
  height: 50px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.3s;
}

.add-cart-btn {
  border: 2px solid #dc3545;
  color: #dc3545;
  background: white;
}

.add-cart-btn:hover:not(:disabled) {
  background: #dc3545;
  color: white;
}

.buy-now-btn {
  background: #dc3545;
  color: white;
  border: 2px solid #dc3545;
}

.buy-now-btn:hover:not(:disabled) {
  background: #b02a37;
  border-color: #b02a37;
}

.add-cart-btn:disabled,
.buy-now-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* BookStation Policies */
.bookstation-policies {
  border-top: 1px solid #e0e0e0;
  padding: 20px;
  background: #fafafa;
}

.policy-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.policy-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  padding: 8px 0;
}

.policy-item i {
  margin-right: 12px;
  margin-top: 2px;
  font-size: 1.1rem;
}

.policy-content {
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Right Panel - Scrollable */
.right-panel {
  width: 55%;
  flex: 1;
  overflow-y: auto;
  background: white;
}

.product-info-section {
  padding: 20px 30px;
}

/* Product Header */
.product-header {
  margin-bottom: 20px;
}

.product-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
}

.product-meta {
  margin-bottom: 15px;
}

.meta-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.meta-label {
  min-width: 120px;
  color: #666;
  font-weight: 500;
}

.meta-value {
  color: #333;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.star-rating i {
  font-size: 1rem;
}

.review-count {
  color: #f39c12;
}

.sold-count {
  color: #666;
}

/* Price Section */
.price-section {
  background: #fff5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #ffe0e0;
}

.price-display {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.current-price {
  font-size: 2rem;
  font-weight: bold;
  color: #dc3545;
}

.original-price {
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
}

.discount-percent {
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.stock-info {
  margin-top: 10px;
}

.stock-text {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Section Styles */
.promotions-section,
.quantity-section,
.details-section,
.description-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

/* Promotions */
.promo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.promo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: background-color 0.3s;
}

.promo-item:hover {
  background: #f8f9fa;
}

/* Quantity */
.quantity-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-label {
  font-weight: 500;
  color: #333;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.quantity-btn {
  width: 35px;
  height: 35px;
  border: none;
  background: #f8f9fa;
  color: #333;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.quantity-btn:hover {
  background: #e9ecef;
}

.quantity-input {
  width: 60px;
  height: 35px;
  border: none;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
}

.quantity-input:focus {
  outline: none;
}

/* Details Table */
.details-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.detail-row {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row:nth-child(even) {
  background: #f8f9fa;
}

.detail-label {
  font-weight: 500;
  color: #666;
  min-width: 150px;
  flex-shrink: 0;
}

.detail-value {
  color: #333;
  flex: 1;
}

/* Description */
.description-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
}

.description-content h5 {
  color: #333;
  margin-bottom: 15px;
}

.expand-btn {
  margin-top: 10px;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-detail-container {
    flex-direction: column;
    height: auto;
  }
  
  .left-panel,
  .right-panel {
    width: 100%;
  }
  
  .left-panel {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .right-panel {
    overflow-y: visible;
  }
  
  .product-info-section {
    padding: 15px 20px;
  }
  
  .promo-grid {
    grid-template-columns: 1fr;
  }
  
  .current-price {
    font-size: 1.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .thumbnail-container {
    flex-wrap: wrap;
  }
}
</style>
