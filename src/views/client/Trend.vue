<template>
    <section class="trend-section py-5">
        <div class="container">
            <!-- Section header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="section-header">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="bi bi-graph-up-arrow text-danger fs-4"></i>
                                <h2 class="section-title fw-bold text-dark mb-0">Xu Hướng Mua Sắm</h2>
                            </div>
                            <p class="text-muted mb-0">Những sản phẩm được yêu thích nhất hiện tại</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Navigation tabs -->
            <div class="row mb-4">
                <div class="col-12">
                    <ul class="nav nav-pills justify-content-center gap-2" id="trendTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button 
                                class="nav-link active px-4 py-2" 
                                id="today-tab" 
                                data-bs-toggle="pill" 
                                data-bs-target="#today" 
                                type="button" 
                                role="tab"
                                @click="activeTab = 'today'"
                            >
                                Xu Hướng Theo Ngày
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button 
                                class="nav-link px-4 py-2" 
                                id="hot-tab" 
                                data-bs-toggle="pill" 
                                data-bs-target="#hot" 
                                type="button" 
                                role="tab"
                                @click="activeTab = 'hot'"
                            >
                                Sách HOT - Giảm Sốc
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button 
                                class="nav-link px-4 py-2" 
                                id="bestseller-tab" 
                                data-bs-toggle="pill" 
                                data-bs-target="#bestseller" 
                                type="button" 
                                role="tab"
                                @click="activeTab = 'bestseller'"
                            >
                                Bestseller Ngoại Văn
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Tab content -->
            <div class="tab-content" id="trendTabsContent">
                <!-- Xu hướng theo ngày -->
                <div class="tab-pane fade show active" id="today" role="tabpanel" v-if="activeTab === 'today'">
                    <div class="row g-3">
                        <div class="col-lg-2 col-md-4 col-sm-6 col-6" v-for="product in trendProducts" :key="product.id">
                            <ProductCard :product="product" />
                        </div>
                    </div>
                </div>

                <!-- Sách HOT -->
                <div class="tab-pane fade" id="hot" role="tabpanel" v-if="activeTab === 'hot'">
                    <div class="row g-3">
                        <div class="col-lg-2 col-md-4 col-sm-6 col-6" v-for="product in hotProducts" :key="product.id">
                            <ProductCard :product="product" />
                        </div>
                    </div>
                </div>

                <!-- Bestseller -->
                <div class="tab-pane fade" id="bestseller" role="tabpanel" v-if="activeTab === 'bestseller'">
                    <div class="row g-3">
                        <div class="col-lg-2 col-md-4 col-sm-6 col-6" v-for="product in bestsellerProducts" :key="product.id">
                            <ProductCard :product="product" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- View more button -->
            <div class="row mt-4">
                <div class="col-12 text-center">
                    <button class="btn btn-outline-danger btn-lg px-5 py-2">
                        Xem thêm sản phẩm
                        <i class="bi bi-arrow-right ms-2"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '@/components/common/ProductCard.vue'

// Reactive data
const activeTab = ref('today')

// Sample data for trending products
const trendProducts = ref([
    {
        id: 1,
        name: 'Boxset Manga - Silver Spoon: Tập 1 - 15 (Hộp 1...)sdfdsfsdsdfsdf',
        category: 'xu-huong',
        categoryLabel: 'Xu hướng',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 690000,
        originalPrice: 726000,
        discount: 4,
        sold: 155,
        saleLabel: 'FREESHIP SILVERSPOON'
    },
    {
        id: 2,
        name: 'Doraemon - Movie Story Màu - Nobita Và Cuộc Phiêu Lưu...',
        category: 'moi',
        categoryLabel: 'Mới',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 33250,
        originalPrice: 35000,
        discount: 5,
        sold: 42,
        saleLabel: 'Mới'
    },
    {
        id: 3,
        name: 'Ba Lô Fancy Bestie Forever - Clever Hippo BH1234/PINK',
        category: 'hot',
        categoryLabel: 'Hot',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 815150,
        originalPrice: 959000,
        discount: 15,
        sold: 20
    },
    {
        id: 4,
        name: 'Bộ Thẻ Sưu Tập - Card Collection Thám Tử Lừng Danh...',
        category: 'moi',
        categoryLabel: 'Mới',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 58500,
        originalPrice: 69000,
        discount: 15,
        sold: 17
    },
    {
        id: 5,
        name: 'English Grammar In Use With Answer And Interactive E-...',
        category: 'moi',
        categoryLabel: 'Mới',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 337000,
        originalPrice: 375000,
        discount: 10,
        sold: 3
    },
    {
        id: 6,
        name: 'Harry Potter và Hòn đá Phù thủy',
        category: 'bestseller',
        categoryLabel: 'Bestseller',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 120000,
        originalPrice: 150000,
        discount: 20,
        sold: 89
    }
])

const hotProducts = ref([
    {
        id: 7,
        name: 'One Piece - Tập 100 (Bản đặc biệt)',
        category: 'hot',
        categoryLabel: 'Hot',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 45000,
        originalPrice: 60000,
        discount: 25,
        sold: 234,
        saleLabel: 'HOT SALE'
    },
    {
        id: 8,
        name: 'Attack on Titan - Final Season',
        category: 'hot',
        categoryLabel: 'Hot',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 55000,
        originalPrice: 70000,
        discount: 21,
        sold: 178
    },
    {
        id: 9,
        name: 'Demon Slayer - Box Set Complete',
        category: 'hot',
        categoryLabel: 'Hot',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 890000,
        originalPrice: 1200000,
        discount: 26,
        sold: 92
    },
    {
        id: 10,
        name: 'My Hero Academia - Volume 30',
        category: 'hot',
        categoryLabel: 'Hot',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 42000,
        originalPrice: 55000,
        discount: 24,
        sold: 156
    },
    {
        id: 11,
        name: 'Jujutsu Kaisen - Special Edition',
        category: 'hot',
        categoryLabel: 'Hot',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 67000,
        originalPrice: 85000,
        discount: 21,
        sold: 123
    },
    {
        id: 12,
        name: 'Tokyo Revengers - Complete Set',
        category: 'hot',
        categoryLabel: 'Hot',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 750000,
        originalPrice: 950000,
        discount: 21,
        sold: 67
    }
])

const bestsellerProducts = ref([
    {
        id: 13,
        name: 'The Psychology of Money',
        category: 'bestseller',
        categoryLabel: 'Bestseller',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 180000,
        originalPrice: 220000,
        discount: 18,
        sold: 445
    },
    {
        id: 14,
        name: 'Atomic Habits',
        category: 'bestseller',
        categoryLabel: 'Bestseller',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 195000,
        originalPrice: 240000,
        discount: 19,
        sold: 523
    },
    {
        id: 15,
        name: 'The Seven Husbands of Evelyn Hugo',
        category: 'bestseller',
        categoryLabel: 'Bestseller',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 165000,
        originalPrice: 200000,
        discount: 18,
        sold: 367
    },
    {
        id: 16,
        name: 'Where the Crawdads Sing',
        category: 'bestseller',
        categoryLabel: 'Bestseller',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 175000,
        originalPrice: 210000,
        discount: 17,
        sold: 289
    },
    {
        id: 17,
        name: 'The Thursday Murder Club',
        category: 'bestseller',
        categoryLabel: 'Bestseller',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 185000,
        originalPrice: 230000,
        discount: 20,
        sold: 234
    },
    {
        id: 18,
        name: 'Educated: A Memoir',
        category: 'bestseller',
        categoryLabel: 'Bestseller',
        image: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177623.jpg',
        currentPrice: 190000,
        originalPrice: 235000,
        discount: 19,
        sold: 198
    }
])
</script>

<style scoped>
.trend-section {
    background-color: #f8f9fa;
}

.section-title {
    color: #2c3e50;
    font-size: 1.8rem;
}

.nav-pills .nav-link {
    background-color: transparent;
    border: 2px solid #dee2e6;
    color: #6c757d;
    font-weight: 500;
    border-radius: 25px;
    transition: all 0.3s ease;
}

.nav-pills .nav-link:hover {
    background-color: #dc3545;
    color: white;
    border-color: #dc3545;
    transform: translateY(-2px);
}

.nav-pills .nav-link.active {
    background-color: #dc3545;
    border-color: #dc3545;
    color: white;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.tab-content {
    min-height: 400px;
}

.btn-outline-danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

@media (max-width: 768px) {
    .section-title {
        font-size: 1.5rem;
    }
    
    .nav-pills {
        flex-direction: column;
        align-items: center;
    }
    
    .nav-pills .nav-link {
        margin-bottom: 0.5rem;
        width: 200px;
        text-align: center;
    }
    
    .col-6 {
        margin-bottom: 1rem;
    }
}

@media (max-width: 576px) {
    .section-header {
        text-align: center;
    }
    
    .d-flex.align-items-center.gap-2 {
        justify-content: center;
    }
}
</style>
