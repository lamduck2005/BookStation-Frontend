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

// Preview mode - Hiển thị vài sách đầu (5 items)
export const getTrendingPreview = async (type = 'DAILY_TRENDING') => {
  return await getTrendingBooks({
    type: type,
    page: 0,
    size: 5
  });
};

// Full list mode - Hiển thị danh sách đầy đủ
export const getTrendingFullList = async (type = 'DAILY_TRENDING', page = 0, size = 20) => {
  return await getTrendingBooks({
    type: type,
    page: page,
    size: size
  });
};

// Hot discount với filters
export const getHotDiscountWithFilters = async (filters = {}) => {
  const request = {
    type: 'HOT_DISCOUNT',
    page: 0,
    size: 20,
    ...filters
  };
  return await getTrendingBooks(request);
};

// Daily trending với filters
export const getDailyTrendingWithFilters = async (filters = {}) => {
  const request = {
    type: 'DAILY_TRENDING',
    page: 0,
    size: 20,
    ...filters
  };
  return await getTrendingBooks(request);
};

// Load more / Pagination
export const loadMoreTrending = async (type, currentPage, itemsPerPage = 10, filters = {}) => {
  return await getTrendingBooks({
    type: type,
    page: currentPage,
    size: itemsPerPage,
    ...filters
  });
};
