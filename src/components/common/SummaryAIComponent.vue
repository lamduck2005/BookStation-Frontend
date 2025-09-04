<template>
    <div class="summary-ai-section mt-4">
        <h4 class="mb-4 section-title">
            <i class="fas fa-sparkles me-2 text-primary"></i>
            Tóm tắt tổng quan về sản phẩm
        </h4>
        
        <!-- Loading state -->
        <div v-if="isLoading" class="loading-container">
            <div class="spinner-border text-primary me-2" role="status">
                <span class="visually-hidden">Đang tạo tóm tắt...</span>
            </div>
            <span class="loading-text">Đang phân tích nội dung "{{ props.bookData.bookName || props.bookData.title }}" và tạo tóm tắt...</span>
        </div>

        <!-- Summary content -->
        <div v-else-if="displayedSummary || summary" class="summary-content">
            <div class="summary-header">
                <i class="fas fa-lightbulb text-warning me-2"></i>
                <span class="fw-bold">Nội dung tóm tắt </span>
                <span class="text-muted ms-2"> ( tóm tắt sử dụng AI, dữ liệu có thể có sai sót! )</span>
                <small class="text-muted ms-2" v-if="isFromCache">
                    (Đã lưu)
                </small>
            </div>
            <div class="summary-text mt-3" :class="{ 'fade-in-animation': !isFromCache }">
                <div v-html="displayedSummary || summary"></div>
            </div>
            <button 
                @click="handleRegenerateSummary" 
                class="btn btn-outline-primary btn-sm mt-3"
                :disabled="isLoading"
            >
                <i class="fas fa-magic me-1"></i>
                Tạo lại tóm tắt
            </button>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error-container">
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
            </div>
            <button 
                @click="handleGenerateSummary" 
                class="btn btn-primary mt-2"
                :disabled="isLoading"
            >
                <i class="fas fa-magic me-1"></i>
                Tóm tắt lại
            </button>
        </div>

        <!-- Initial state -->
        <div v-else class="initial-state">
            <button 
                @click="handleGenerateSummary" 
                class="btn btn-primary"
                :disabled="isLoading"
            >
                <i class="fas fa-sparkles me-1"></i>
                Tạo tóm tắt
            </button>
        </div>
    </div>
</template>

<script setup>
import aiService from '@/services/client/aiService';
import { ref, onMounted, onUnmounted, watch } from 'vue';

// Props
const props = defineProps({
    bookId: {
        type: [Number, String],
        required: true
    },
    bookData: {
        type: Object,
        required: true
    }
});

const summary = ref('');
const displayedSummary = ref('');
const isLoading = ref(false);
const error = ref('');
const isFromCache = ref(false);

let delayTimer = null;

const getCacheKey = (bookId) => `book_summary_${bookId}`;

const loadCachedSummary = () => {
    try {
        const cacheKey = getCacheKey(props.bookId);
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            const { summary: cachedSummary, bookId } = JSON.parse(cached);
            
            if (bookId == props.bookId) {
                summary.value = cachedSummary;
                isFromCache.value = true;
                return true;
            }
        }
    } catch (err) {
        console.error('Lỗi khi đọc cache:', err);
    }
    return false;
};

const saveSummaryToCache = (summaryText) => {
    try {
        const cacheKey = getCacheKey(props.bookId);
        const cacheData = {
            bookId: props.bookId,
            summary: summaryText,
            timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (err) {
        console.error('Lỗi khi lưu cache:', err);
    }
};

const displaySummary = (text) => {
    summary.value = text;
    displayedSummary.value = text;
};

const generateSummaryContent = () => {
    const bookJson = JSON.stringify(props.bookData, null, 2);
    
    return `
DỮ LIỆU SÁCH (JSON):
${bookJson}

YÊU CẦU PHÂN TÍCH:
Bạn là một trợ lí ảo tại website bán sách BookStation. 

Hãy phân tích dữ liệu JSON trên và tạo một bài phân tích sách hấp dẫn, bao gồm:

1. **Tóm tắt nội dung**: Nêu ngắn gọn về cuốn sách này (2-3 câu)
2. **Điểm nổi bật của sách**: Tại sao nên đọc sách này? Giá trị mang lại?
3. **Đánh giá tổng quan**: Hãy nhận xét về độ phổ biến nhưng không dùng con số chính xác


HƯỚNG DẪN:
- Viết bằng tiếng Việt, giọng điệu thân thiện và chuyên nghiệp, không dùng từ ngữ quá cầu kỳ.
- Tập trung vào việc phân tích sách hơn là kích thích nhu cầu mua sách
- Nội dung sách có thể không đúng với thực tế, chỉ nên dùng dữ liệu có sẵn từ json, không được tạo ra dữ liệu mới, không tham khảo từ nguồn khác
- Không nhắc đến giá cả và số lượng bán
- Độ dài khoảng 100-150 từ, trả về dạng html, không cần dùng thẻ <p>, chỉ nên dùng các thẻ như <i>, <u>, <b>, <br>,... không dùng thẻ header và <ul>, <ol>, <li>, 
- Không cần format JSON trong response, không được dùng kí tự đặc biệt, trình bày dễ đọc dễ hiểu sao cho người nào cũng hiểu về sách này
    `.trim();
};

const handleGenerateSummary = async (skipCache = false) => {
    if (!skipCache && loadCachedSummary()) {
        return;
    }

    clearTimers();
    summary.value = '';
    displayedSummary.value = '';
    error.value = '';
    isFromCache.value = false;
    
    isLoading.value = true;
    
    delayTimer = setTimeout(async () => {
        try {
            const content = generateSummaryContent();
            const summaryResult = await aiService.generateSummary(content);
            
            saveSummaryToCache(summaryResult);
            
            displaySummary(summaryResult);
            
        } catch (err) {
            console.error('Lỗi khi tạo tóm tắt:', err);
            error.value = 'Không thể tạo tóm tắt AI. Vui lòng thử lại.';
        } finally {
            isLoading.value = false;
        }
    }, 3000);
};

const handleRegenerateSummary = () => {
    handleGenerateSummary(true);
};

const clearTimers = () => {
    if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
    }
};

watch(() => props.bookId, (newBookId, oldBookId) => {
    if (newBookId !== oldBookId) {
        clearTimers();
        summary.value = '';
        displayedSummary.value = '';
        error.value = '';
        isFromCache.value = false;
        handleGenerateSummary();
    }
});

onMounted(() => {
    handleGenerateSummary();
});

onUnmounted(() => {
    clearTimers();
});
</script>

<style scoped>
.summary-ai-section {
    max-width: 1200px;
    margin: 0 auto;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 123, 255, 0.1);
}

.section-title {
    color: #2c3e50;
    font-weight: 600;
    /* text-align: center; */
    position: relative;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5.5%;
    transform: translateX(-50%);
    width: 95px;
    height: 3px;
    background: linear-gradient(90deg, #f700ff, #6c5ce7);
    border-radius: 2px;
}

.section-title i {
    font-size: 1.2em;
    animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(5deg); }
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(45deg, #e3f2fd, #f3e5f5);
    border-radius: 15px;
    border: 2px dashed #007bff;
}

.loading-text {
    font-size: 1.1rem;
    color: #495057;
    font-weight: 500;
    text-align: center;
    margin-top: 1rem;
}

.summary-content {
    background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
    border-radius: 15px;
    padding: 1.5rem;
    border-left: 4px solid #28a745;
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.1);
    animation: slideInUp 0.5s ease-out;
}

.summary-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e9ecef;
}

.summary-text {
    font-size: 1.05rem;
    line-height: 1.6;
    color: #495057;
    background: white;
    padding: 1.25rem;
    border-radius: 10px;
    border: 1px solid #dee2e6;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
    min-height: 60px;
}

.summary-text.fade-in-animation {
    animation: fadeInGradual 2s ease-out forwards;
}

.summary-text div {
    opacity: 1;
}

.fade-in-animation div {
    animation: textAppear 2s ease-out forwards;
}

@keyframes fadeInGradual {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes textAppear {
    0% {
        opacity: 0;
        filter: blur(2px);
        transform: scale(0.95);
    }
    50% {
        opacity: 0.7;
        filter: blur(1px);
        transform: scale(0.98);
    }
    100% {
        opacity: 1;
        filter: blur(0);
        transform: scale(1);
    }
}

.error-container {
    text-align: center;
}

.error-container .alert {
    border-radius: 15px;
    border: none;
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2);
    margin-bottom: 1rem;
}

.initial-state {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%);
    border-radius: 15px;
    border: 2px dashed #28a745;
}

.btn {
    border-radius: 25px;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.spinner-border {
    width: 2rem;
    height: 2rem;
}

/* Responsive design */
@media (max-width: 768px) {
    .summary-ai-section {
        padding: 1rem;
        margin: 0 1rem;
    }
    
    .loading-container,
    .summary-content,
    .initial-state {
        padding: 1rem;
    }
    
    .summary-text {
        font-size: 1rem;
        padding: 1rem;
    }
    
    .loading-text {
        font-size: 1rem;
    }
}

/* Animation for summary appearance */

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>