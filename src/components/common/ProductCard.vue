<template>
    <div class="product-card h-100">
        <div class="card border-0 shadow-sm h-100 cursor-pointer" @click="goToProductDetail">
            <!-- Badge container -->
            <div class="position-relative">
                <!-- Flash Sale badge -->
                <span v-if="product.isInFlashSale" class="badge bg-danger position-absolute top-0 start-0 m-2 z-index-1 sale-badge flash-sale-badge">
                    <i class="bi bi-lightning-fill me-1"></i>FLASH SALE
                </span>
                <!-- Regular Sale badge -->
                <span v-else-if="product.discountPercentage && product.discountPercentage > 0" class="badge bg-warning position-absolute top-0 start-0 m-2 z-index-1 sale-badge text-dark">
                    {{ getDisplayLabel() }}
                </span>
                
                <!-- Product image -->
                <div class="product-image-container">
                    <img 
                        :src="getProductImage()" 
                        :alt="product.bookName || product.name || 'Book'" 
                        class="card-img-top product-image"
                    >
                </div>
            </div>
            
            <!-- Card body -->
            <div class="card-body p-2 d-flex flex-column">
                <!-- Product category/type -->
                <div class="product-category mb-1">
                    <span class="badge" :class="getCategoryBadgeClass()">
                        {{ product.categoryName || product.categoryLabel || 'Sách' }}
                    </span>
                </div>
                
                <!-- Product name -->
                <h6 class="card-title product-name mb-2">
                    {{ product.bookName || product.name || 'Chưa có tên sách' }}
                </h6>
                
                <!-- Price section -->
                <div class="price-section mt-auto mb-2">
                    <div class="d-flex align-items-center gap-2">
                        <!-- Flash Sale Price -->
                        <span v-if="product.isInFlashSale && product.flashSalePrice" class="current-price fw-bold text-danger fs-6">
                            {{ formatPrice(product.flashSalePrice) }}
                        </span>
                        <!-- Regular Price -->
                        <span v-else class="current-price fw-bold text-danger fs-6">
                            {{ formatPrice(getCurrentPrice()) }}
                        </span>
                        
                        <!-- Original Price (crossed out) -->
                        <span v-if="getOriginalPrice()" class="original-price text-muted text-decoration-line-through small">
                            {{ formatPrice(getOriginalPrice()) }}
                        </span>
                        
                        <!-- Discount Badge -->
                        <span v-if="product.discountPercentage && product.discountPercentage > 0" class="discount-badge badge bg-danger small">
                            -{{ product.discountPercentage }}%
                        </span>
                    </div>
                </div>
                
                <!-- Sales info -->
                <div class="sales-info">
                    <!-- Thông báo hết hàng -->
                    <div v-if="isOutOfStock()" class="out-of-stock-badge mb-2">
                        <i class="bi bi-exclamation-triangle-fill me-1"></i>
                        <span>HẾT HÀNG</span>
                    </div>
                    
                    <!-- Thanh tiến trình khi còn hàng -->
                    <div v-else>
                        <div class="progress mb-1" style="height: 6px;">
                            <div 
                                class="progress-bar bg-danger" 
                                role="progressbar" 
                                :style="{ width: getSalesProgress() + '%' }"
                            ></div>
                        </div>
                        <small class="text-muted" style="font-size: 0.8rem;">
                            <!-- Flash Sale sold count for flash sale items -->
                            <span v-if="product.isInFlashSale && product.flashSaleSoldCount !== undefined">
                                Flash Sale đã bán {{ product.flashSaleSoldCount }}
                            </span>
                            <!-- Regular sold count -->
                            <span v-else>
                                Đã bán {{ product.soldCount || product.soldQuantity || product.sold || 0 }}
                            </span>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

// Router
const router = useRouter();

// Props
const props = defineProps({
    product: {
        type: Object,
        default: () => ({})
    }
})

const getCurrentPrice = () => {
    // Nếu có flash sale, ưu tiên hiển thị giá flash sale
    if (props.product.isInFlashSale && props.product.flashSalePrice) {
        return props.product.flashSalePrice
    }
    return props.product.price || props.product.currentPrice || 0
}

const getOriginalPrice = () => {
    // Nếu có flash sale, originalPrice là price thường
    if (props.product.isInFlashSale && props.product.flashSalePrice && props.product.originalPrice !== props.product.flashSalePrice) {
        return  props.product.originalPrice
    }
    return  false;
}

const getProductImage = () => {
    // Ưu tiên lấy ảnh đầu tiên từ mảng images (theo tài liệu API)
    if (props.product.images && props.product.images.length > 0) {
        return props.product.images[0]
    }
    
    // Fallback to other image fields
    return props.product.imageUrl || 
           props.product.image || 
           props.product.coverImageUrl || 
           'https://via.placeholder.com/200x250?text=Book+Cover'
}

const getDisplayLabel = () => {
    if (props.product.isInFlashSale) {
        return 'FLASH SALE'
    }
    if (props.product.discountPercentage >= 30) {
        return 'HOT SALE'
    }
    if (props.product.discountPercentage > 0) {
        return 'GIẢM GIÁ'
    }
    return props.product.saleLabel || 'XU HƯỚNG'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  })
    .format(price || 0)
    .replace("₫", "đ");
};

const getCategoryBadgeClass = () => {
    // Dựa vào categoryName hoặc type
    const categoryName = props.product.categoryName?.toLowerCase() || ''
    
    if (categoryName.includes('văn học')) return 'bg-primary'
    if (categoryName.includes('kinh tế') || categoryName.includes('kinh doanh')) return 'bg-success'
    if (categoryName.includes('thiếu nhi')) return 'bg-warning text-dark'
    if (categoryName.includes('ngoại ngữ')) return 'bg-info'
    if (props.product.isInFlashSale) return 'bg-danger'
    
    return 'bg-secondary'
}

// Handle click to navigate - if flash sale, can optionally go to flash sale management
const goToProductDetail = () => {
    const productId = props.product.id || props.product.bookId
    if (productId) {
        // Nếu sản phẩm có flash sale, vẫn điều hướng đến trang chi tiết sản phẩm
        // Có thể thêm logic đặc biệt cho flash sale sau
        router.push({
            name: 'product-detail',
            params: { id: productId }
        })
    }
}

const getSalesProgress = () => {
  let sold = 0;
  let total = 0;
  
  if (props.product.isInFlashSale) {
    // Flash sale: dùng flashSaleSoldCount và flashSaleStockQuantity
    sold = props.product.flashSaleSoldCount || 0;
    total = props.product.flashSaleStockQuantity || 0;
  } else {
    // Thường: dùng soldCount và stockQuantity
    sold = props.product.soldCount || props.product.soldQuantity || props.product.sold || 0;
    total = props.product.stockQuantity || props.product.total || 100;
  }

  if (total === 0) return 0;
  return Math.min((sold / total) * 100, 100);
};

const isOutOfStock = () => {
  if (props.product.isInFlashSale) {
    // Flash sale: kiểm tra flashSaleStockQuantity
    const flashSaleStock = props.product.flashSaleStockQuantity || 0;
    const flashSaleSold = props.product.flashSaleSoldCount || 0;
    return (flashSaleStock - flashSaleSold) <= 0;
  } else {
    // Thường: kiểm tra stockQuantity
    const stock = props.product.stockQuantity || 0;
    const sold = props.product.soldCount || props.product.soldQuantity || props.product.sold || 0;
    return (stock - sold) <= 0;
  }
};
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-card:hover .card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.product-image-container {
  height: 180px;
  overflow: hidden;
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.sale-badge {
  z-index: 2;
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
}

.flash-sale-badge {
    background: linear-gradient(135deg, #ff4444, #cc0000) !important;
    color: white !important;
    font-weight: bold;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(255, 68, 68, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(255, 68, 68, 0);
    }
}

.product-name {
  font-size: 0.9rem;
  line-height: 1.3;
  min-height: 36px;
  max-height: 2.6em; /* Giới hạn tối đa 2 dòng, tự động xuống dòng */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Hiển thị tối đa 2 dòng */
  line-clamp: 2; /* Standard property for compatibility */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: normal; /* Cho phép xuống dòng */
}

.current-price {
  font-size: 1.1rem;
}

.original-price {
  font-size: 0.8rem;
}

.discount-badge {
  font-size: 0.75rem;
}

.product-category .badge {
  font-size: 0.7rem;
}

.z-index-1 {
  z-index: 1;
}

.out-of-stock-badge {
  background: linear-gradient(135deg, #ff6b6b, #ff5252);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  animation: shake 0.5s ease-in-out;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@media (max-width: 576px) {
  .product-image-container {
    height: 150px;
  }

  .product-name {
    font-size: 0.75rem;
  }

  .current-price {
    font-size: 0.9rem;
  }

  .card-body {
    padding: 0.75rem !important;
  }
}
</style>
