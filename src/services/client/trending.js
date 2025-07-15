import client from '@/utils/axios';

// Lấy danh sách sách trending
export const getTrendingBooks = async (trendingRequest) => {
  try {
    console.log('🚀 Calling trending API with:', trendingRequest);
    
    const response = await client.post('/api/books/trending', trendingRequest, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ Trending API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi gọi API trending:', error);
    throw error;
  }
};

// Preview mode - Hiển thị vài sách đầu (10 items cho homepage)
export const getTrendingPreview = async (type = 'DAILY_TRENDING') => {
  return await getTrendingBooks({
    type: type,
    page: 0,
    size: 10 // Tăng từ 5 lên 10 để hiển thị đủ sản phẩm
  });
};

// Full list mode - Hiển thị danh sách đầy đủ (pagination)
export const getTrendingFullList = async (type = 'DAILY_TRENDING', page = 0, size = 20) => {
  return await getTrendingBooks({
    type: type,
    page: page,
    size: size
  });
};

// Hot discount với filters (không còn filters theo tài liệu mới)
export const getHotDiscountWithFilters = async (page = 0, size = 20) => {
  const request = {
    type: 'HOT_DISCOUNT',
    page: page,
    size: size
  };
  return await getTrendingBooks(request);
};

// Daily trending (không còn filters theo tài liệu mới)
export const getDailyTrendingWithFilters = async (page = 0, size = 20) => {
  const request = {
    type: 'DAILY_TRENDING',
    page: page,
    size: size
  };
  return await getTrendingBooks(request);
};

// Load more / Pagination (chỉ type, page, size)
export const loadMoreTrending = async (type, currentPage, itemsPerPage = 10) => {
  return await getTrendingBooks({
    type: type,
    page: currentPage,
    size: itemsPerPage
  });
};
