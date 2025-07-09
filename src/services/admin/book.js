import client from '@/utils/axios';

// Lấy danh sách sách
export const getBooks = async (params = {}) => {
  try {
    const response = await client.get('/api/books', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error);
    throw error;
  }
};

// Lấy danh sách authors dropdown (BẮT BUỘC cho form tạo/sửa sách)
export const getAuthorsDropdown = async () => {
  try {
    const response = await client.get('/api/authors/dropdown');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách authors dropdown:', error);
    throw error;
  }
};

// Lấy danh sách categories dropdown
export const getCategoriesDropdown = async () => {
  try {
    const response = await client.get('/api/categories/dropdown');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách categories dropdown:', error);
    throw error;
  }
};

// Lấy danh sách suppliers dropdown
export const getSuppliersDropdown = async () => {
  try {
    const response = await client.get('/api/suppliers/dropdown');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách suppliers dropdown:', error);
    throw error;
  }
};

// Tạo sách mới
export const createBook = async (bookData) => {
  try {
    console.log('=== DEBUG: Sending data to backend ===');
    console.log('Book data:', bookData);
    
    const response = await client.post('/api/books', bookData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('=== DEBUG: Response from backend ===');
    console.log('Response:', response);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo sách:', error);
    throw error;
  }
};

// Cập nhật sách
export const updateBook = async (id, bookData) => {
  try {
    const response = await client.put(`/api/books/${id}`, bookData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật sách:', error);
    throw error;
  }
};

// Xóa sách
export const deleteBook = async (id) => {
  try {
    const response = await client.delete(`/api/books/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa sách:', error);
    throw error;
  }
};

// Lấy chi tiết sách
export const getBookById = async (id) => {
  try {
    const response = await client.get(`/api/books/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sách:', error);
    throw error;
  }
};

// Chuyển trạng thái sách
export const toggleBookStatus = async (id) => {
  try {
    const response = await client.patch(`/api/books/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi chuyển trạng thái sách:', error);
    throw error;
  }
};
export const getBooksClient = async (params = {}) => {
  try {
    const response = await client.get('/api/books/client', { params });
    // console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error);
    throw error;
  }
};