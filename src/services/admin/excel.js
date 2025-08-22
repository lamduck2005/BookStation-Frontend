import client from '../../utils/axios.js';

// ===== DATA EXPORT APIs =====

// Export Hạng Thành Viên
export const exportRanks = async () => {
  try {
    const response = await client.get('/api/excel/ranks');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export hạng thành viên:', error);
    throw error;
  }
};

// Export Sách
export const exportBooks = async () => {
  try {
    const response = await client.get('/api/excel/books');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export sách:', error);
    throw error;
  }
};

// Export Người Dùng
export const exportUsers = async () => {
  try {
    const response = await client.get('/api/excel/users');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export người dùng:', error);
    throw error;
  }
};

// Export Đơn Hàng
export const exportOrders = async () => {
  try {
    const response = await client.get('/api/excel/orders');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export đơn hàng:', error);
    throw error;
  }
};

// Export Đánh Giá
export const exportReviews = async () => {
  try {
    const response = await client.get('/api/excel/reviews');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export đánh giá:', error);
    throw error;
  }
};

// Export Thể Loại
export const exportCategories = async () => {
  try {
    const response = await client.get('/api/excel/categories');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export thể loại:', error);
    throw error;
  }
};

// Export Tác Giả
export const exportAuthors = async () => {
  try {
    const response = await client.get('/api/excel/authors');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export tác giả:', error);
    throw error;
  }
};

// Export Nhà Xuất Bản
export const exportPublishers = async () => {
  try {
    const response = await client.get('/api/excel/publishers');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export nhà xuất bản:', error);
    throw error;
  }
};

// Export Voucher
export const exportVouchers = async () => {
  try {
    const response = await client.get('/api/excel/vouchers');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export voucher:', error);
    throw error;
  }
};

// Export Nhà Cung Cấp
export const exportSuppliers = async () => {
  try {
    const response = await client.get('/api/excel/suppliers');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export nhà cung cấp:', error);
    throw error;
  }
};

// Export Điểm
export const exportPoints = async () => {
  try {
    const response = await client.get('/api/excel/points');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export điểm:', error);
    throw error;
  }
};

// Export Flash Sales
export const exportFlashSales = async () => {
  try {
    const response = await client.get('/api/excel/flashsales');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi export flash sales:', error);
    throw error;
  }
};

// ===== FIELDS MAPPING APIs =====

// Get Fields Mapping cho Hạng Thành Viên
export const getRankFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/ranks');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping hạng thành viên:', error);
    throw error;
  }
};

// Get Fields Mapping cho Sách
export const getBookFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/books');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping sách:', error);
    throw error;
  }
};

// Get Fields Mapping cho Người Dùng
export const getUserFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/users');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping người dùng:', error);
    throw error;
  }
};

// Get Fields Mapping cho Đơn Hàng
export const getOrderFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/orders');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping đơn hàng:', error);
    throw error;
  }
};

// Get Fields Mapping cho Đánh Giá
export const getReviewFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/reviews');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping đánh giá:', error);
    throw error;
  }
};

// Get Fields Mapping cho Thể Loại
export const getCategoryFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/categories');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping thể loại:', error);
    throw error;
  }
};

// Get Fields Mapping cho Tác Giả
export const getAuthorFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/authors');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping tác giả:', error);
    throw error;
  }
};

// Get Fields Mapping cho Nhà Xuất Bản
export const getPublisherFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/publishers');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping nhà xuất bản:', error);
    throw error;
  }
};

// Get Fields Mapping cho Voucher
export const getVoucherFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/vouchers');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping voucher:', error);
    throw error;
  }
};

// Get Fields Mapping cho Nhà Cung Cấp
export const getSupplierFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/suppliers');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping nhà cung cấp:', error);
    throw error;
  }
};

// Get Fields Mapping cho Điểm
export const getPointFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/points');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping điểm:', error);
    throw error;
  }
};

// Get Fields Mapping cho Flash Sales
export const getFlashSaleFields = async () => {
  try {
    const response = await client.get('/api/excel/fields/flashsales');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy fields mapping flash sales:', error);
    throw error;
  }
};
