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

// Lấy danh sách books dropdown (id, name) cho order
export const getBooksDropdown = async (params = {}) => {
  try {
    const response = await client.get('/api/books/dropdown', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách books dropdown:', error);
    throw error;
  }
};

// Lấy danh sách books dropdown (for order creation)
export const getBooksForOrder = async () => {
  try {
    const response = await client.get('/api/books');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách books cho order:', error);
    throw error;
  }
};

// Fallback getBooksDropdown nếu API chưa sẵn sàng
export const getBooksDropdownFallback = async () => {
  return Promise.resolve({
    status: 200,
    message: "Thành công",
    data: [
      { id: 1, title: 'Clean Code', price: 350000, isFlashSale: false },
      { id: 2, title: 'Design Patterns', price: 420000, isFlashSale: true },
      { id: 3, title: 'Refactoring', price: 380000, isFlashSale: false },
      { id: 4, title: 'The Pragmatic Programmer', price: 450000, isFlashSale: false },
      { id: 5, title: 'Effective Java', price: 390000, isFlashSale: true },
      { id: 6, title: 'JavaScript: The Good Parts', price: 320000, isFlashSale: false },
      { id: 7, title: 'You Don\'t Know JS', price: 280000, isFlashSale: true },
      { id: 8, title: 'Eloquent JavaScript', price: 300000, isFlashSale: false },
      { id: 9, title: 'Head First Design Patterns', price: 400000, isFlashSale: false },
      { id: 10, title: 'Spring Boot in Action', price: 480000, isFlashSale: false }
    ]
  });
};

// ✅ Lấy danh sách BookFormat enum values
export const getBookFormats = () => {
  return [
    { value: 'HARDCOVER', label: 'Bìa cứng' },
    { value: 'PAPERBACK', label: 'Bìa mềm' },
    { value: 'AUDIOBOOK', label: 'Sách nói' },
    { value: 'EBOOK', label: 'Sách điện tử' },
    { value: 'MAGAZINE', label: 'Tạp chí' },
    { value: 'COMIC', label: 'Truyện tranh' },
    { value: 'TEXTBOOK', label: 'Sách giáo khoa' },
    { value: 'NOTEBOOK', label: 'Sổ tay' },
    { value: 'JOURNAL', label: 'Nhật ký' },
    { value: 'WORKBOOK', label: 'Sách bài tập' }
  ];
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
    console.log('=== DEBUG: Updating book with ID:', id);
    console.log('Update data:', bookData);
    console.log('Update data.images:', bookData.images);
    
    const response = await client.put(`/api/books/${id}`, bookData);
    
    console.log('=== DEBUG: Update response ===');
    console.log('Response data:', response.data);
    console.log('Response data.images:', response.data?.images);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật sách:', error);
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
export const getBookByIdCategory = async (id, text) => {
  try {
    const response = await client.get(`/api/books/bycategoryid/${id}`, {
      params: { text }
    });
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error);
    throw error;
  }
}
export const fetchFlashSaleProducts = async () => {
  try {
    const response = await client.get(`/api/books/flashsale/books`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error);
    throw error;
  }
}

// ✅ Validate quantity - API mới
export const validateQuantity = async (bookId, quantity) => {
  try {
    const response = await client.post('/api/books/validate-quantity', {
      bookId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi validate quantity:', error);
    throw error;
  }
}

// ✅ API Tính giá sách theo tài liệu BOOK_PRICE_CALCULATION_API.md
export const calculatePrice = async (bookId, discountValue = null, discountPercent = null, discountActive = false) => {
  try {
    const payload = {
      bookId,
      discountActive
    };
    
    // Chỉ gửi 1 trong 2: discountValue hoặc discountPercent
    if (discountValue !== null && discountValue !== '' && discountValue > 0) {
      payload.discountValue = parseFloat(discountValue);
    } else if (discountPercent !== null && discountPercent !== '' && discountPercent > 0) {
      payload.discountPercent = parseFloat(discountPercent);
    }
    
    const response = await client.post('/api/books/calculate-price', payload);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tính giá sách:', error);
    throw error;
  }
}
export const fetchBookSearch = async (text) => {
  try {
    const response = await client.get(`/api/books/searchbook`,{params: { text }});
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error);
    throw error;
  }
}
export const getActiveBooksWithStock = async () => {
  try {
    const response = await client.get('/api/books/active-with-stock');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy sách có sẵn và đang hoạt động:', error);
    throw error;
  }
};
export const getActiveBooksForEdit = async () => {
  try {
    const response = await client.get('/api/books/active-for-edit');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy sách có sẵn và đang hoạt động:', error);
    throw error;
  }
};

// Lấy danh sách đơn hàng đang xử lý của sách
export const getBookProcessingOrders = async (bookId) => {
  try {
    const response = await client.get(`/api/books/${bookId}/processing-orders`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy đơn hàng đang xử lý cho sách ${bookId}:`, error);
    throw error;
  }
};

// Lấy sách theo ISBN (dùng cho POS quét barcode/ISBN)
export const getBookByIsbn = async (isbn) => {
  try {
    const response = await client.get(`/api/books/isbn/${encodeURIComponent(isbn)}`);
    // Backend trả: { status, message, data: { ...book } }
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy sách theo ISBN:', error);
    throw error;
  }
};
