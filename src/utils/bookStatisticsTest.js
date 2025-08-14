/**
 * 🧪 TEST CASE: Book Statistics API v4.0 - Timestamp Fix
 * 
 * Kiểm tra xem API có hoạt động đúng với timestamp format không
 */

// Test 1: Summary API với custom period
console.log('=== TEST 1: Summary API - Custom Period ===');
const testSummary = async () => {
  const { getBookStatsSummary } = await import('@/services/admin/bookStatistics');
  
  try {
    // Test với string dates (YYYY-MM-DD) - should convert to timestamp
    const response = await getBookStatsSummary(
      'custom',
      '2025-08-01',  // fromDate string  
      '2025-08-13'   // toDate string
    );
    
    console.log('✅ Summary API Response:', response);
  } catch (error) {
    console.error('❌ Summary API Error:', error);
  }
};

// Test 2: Details API với date string
console.log('=== TEST 2: Details API - Date Conversion ===');
const testDetails = async () => {
  const { getBookStatsDetails } = await import('@/services/admin/bookStatistics');
  
  try {
    // Test với string date (YYYY-MM-DD) - should convert to timestamp
    const response = await getBookStatsDetails(
      'day',
      '2025-08-13',  // date string - should convert to 1723507200000
      10
    );
    
    console.log('✅ Details API Response:', response);
  } catch (error) {
    console.error('❌ Details API Error:', error);
  }
};

// Test 3: Details API với timestamp number
console.log('=== TEST 3: Details API - Direct Timestamp ===');
const testDetailsWithTimestamp = async () => {
  const { getBookStatsDetails } = await import('@/services/admin/bookStatistics');
  
  try {
    // Test với timestamp number trực tiếp
    const timestamp = new Date('2025-08-13').getTime(); // 1723507200000
    const response = await getBookStatsDetails(
      'day',
      timestamp,  // timestamp number
      10
    );
    
    console.log('✅ Details API with Timestamp Response:', response);
  } catch (error) {
    console.error('❌ Details API with Timestamp Error:', error);
  }
};

// Expected URL formats sau khi fix:
console.log('=== EXPECTED API URLS ===');
console.log('Summary Custom:', 'GET /api/books/statistics/summary?period=custom&fromDate=1722470400000&toDate=1723507200000');
console.log('Details Day:', 'GET /api/books/statistics/details?period=day&date=1723507200000&limit=10');

export { testSummary, testDetails, testDetailsWithTimestamp };
