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
                                class="nav-link px-4 py-2" 
                                :class="{ active: activeTab === 'daily' }"
                                type="button" 
                                @click="switchTab('daily')"
                            >
                                Xu Hướng
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button 
                                class="nav-link px-4 py-2" 
                                :class="{ active: activeTab === 'hot' }"
                                type="button" 
                                @click="switchTab('hot')"
                            >
                                Sách HOT - Giảm Sốc
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Tab content -->
            <div class="tab-content" id="trendTabsContent">
                <div class="books-container" :class="{ 'loading-state': loading }">
                    <!-- Books display -->
                    <div class="row g-3" v-if="currentBooks.length > 0">
                        <div class="col-lg-2 col-md-4 col-sm-6 col-6" v-for="book in currentBooks" :key="book.id">
                            <ProductCard :product="book" />
                        </div>
                    </div>

                    <!-- No data message -->
                    <div v-else-if="!loading" class="text-center py-5">
                        <i class="bi bi-search fs-1 text-muted"></i>
                        <h5 class="mt-3 text-muted">Không tìm thấy sản phẩm</h5>
                        <p class="text-muted">Chưa có sản phẩm xu hướng nào</p>
                    </div>

                    <!-- Simple loading overlay -->
                    <div v-if="loading" class="loading-spinner-overlay">
                        <div class="spinner-border text-danger" role="status">
                            <span class="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- View more / Load more section -->
            <div class="row mt-4">
                <div class="col-12 text-center">
                    <!-- View more button (when in preview mode) -->
                    <button 
                        v-if="isPreviewMode && hasMoreData" 
                        class="btn btn-outline-danger btn-lg px-5 py-2 me-3"
                        @click="viewMoreBooks"
                        :disabled="loading"
                    >
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        <span v-else>
                            Xem thêm {{ remainingCount > 0 ? `(${remainingCount} sách khác)` : 'sản phẩm' }}
                            <i class="bi bi-arrow-right ms-2"></i>
                        </span>
                    </button>

                    <!-- Load more button (when in full mode with pagination) -->
                    <button 
                        v-if="!isPreviewMode && hasNextPage" 
                        class="btn btn-primary px-4 py-2 me-3 btn-load-more"
                        @click="loadMoreBooks"
                        :disabled="loadingMore"
                    >
                        <span v-if="loadingMore" class="spinner-border spinner-border-sm me-2"></span>
                        {{ loadingMore ? 'Đang tải...' : 'Tải thêm' }}
                    </button>

                    <!-- Collapse button (when in full mode) -->
                    <button 
                        v-if="!isPreviewMode" 
                        class="btn btn-outline-secondary px-4 py-2"
                        @click="collapseToPreview"
                        :disabled="loading"
                    >
                        <i class="bi bi-chevron-up me-1"></i>
                        Thu gọn
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ProductCard from '@/components/common/ProductCard.vue'
import { getTrendingBooks, getTrendingPreview, getTrendingFullList } from '@/services/client/trending.js'

// Reactive data
const activeTab = ref('daily') // 'daily' hoặc 'hot'
const loading = ref(false)
const loadingMore = ref(false)
const isPreviewMode = ref(true)

// Data
const currentBooks = ref([])
const totalElements = ref(0)
const totalPages = ref(0)
const currentPage = ref(0)
const hasNextPage = ref(false)

// Computed properties
const currentTrendingType = computed(() => {
    return activeTab.value === 'daily' ? 'DAILY_TRENDING' : 'HOT_DISCOUNT'
})

const hasMoreData = computed(() => {
    return totalElements.value > currentBooks.value.length
})

const remainingCount = computed(() => {
    return Math.max(0, totalElements.value - currentBooks.value.length)
})

// Methods
const switchTab = async (tab) => {
    if (activeTab.value === tab) return
    
    activeTab.value = tab
    isPreviewMode.value = true
    currentPage.value = 0
    await loadPreviewData()
}

const loadPreviewData = async () => {
    loading.value = true
    
    try {
        console.log('Loading preview data for:', currentTrendingType.value)
        const response = await getTrendingPreview(currentTrendingType.value)
        
        if (response.status === 200) {
            currentBooks.value = response.data.content || []
            totalElements.value = response.data.totalElements || 0
            totalPages.value = response.data.totalPages || 0
            hasNextPage.value = !response.data.last || false
        }
    } catch (error) {
        console.error('Error loading preview data:', error)
        currentBooks.value = []
        
        if (error.response?.status === 404) {
            console.log('API endpoint not found')
        }
    } finally {
        loading.value = false
    }
}

const loadFullData = async (page = 0, append = false) => {
    if (append) {
        loadingMore.value = true
    } else {
        loading.value = true
    }
    
    try {
        console.log('Loading full data for:', currentTrendingType.value, 'page:', page)
        const response = await getTrendingFullList(currentTrendingType.value, page, 20)
        
        if (response.status === 200) {
            const newBooks = response.data.content || []
            
            if (append) {
                currentBooks.value = [...currentBooks.value, ...newBooks]
                currentPage.value = page
            } else {
                currentBooks.value = newBooks
                currentPage.value = 0
            }
            
            totalElements.value = response.data.totalElements || 0
            totalPages.value = response.data.totalPages || 0
            hasNextPage.value = !response.data.last || false
            
            console.log('Updated books count:', currentBooks.value.length)
        }
    } catch (error) {
        console.error('Error loading data:', error)
        if (!append) {
            currentBooks.value = []
        }
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}

const viewMoreBooks = async () => {
    isPreviewMode.value = false
    await loadFullData(0, false)
}

const loadMoreBooks = async () => {
    if (!hasNextPage.value || loadingMore.value) return
    await loadFullData(currentPage.value + 1, true)
}

const collapseToPreview = async () => {
    isPreviewMode.value = true
    currentPage.value = 0
    await loadPreviewData()
}

// Lifecycle
onMounted(async () => {
    await loadPreviewData()
})
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
    position: relative;
}

/* Loading spinner styles */
.books-container {
    min-height: 300px;
    position: relative;
}

.loading-state {
    opacity: 0.6;
    pointer-events: none;
}

.loading-spinner-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.btn-outline-danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* Loading and empty states */
.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}

/* Load more button animation */
.btn-load-more {
    transition: all 0.3s ease;
}

.btn-load-more:hover:not([disabled]) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

/* Button enhancements */
.btn {
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-1px);
}

.btn:disabled {
    transform: none;
}

/* Responsive design */
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
