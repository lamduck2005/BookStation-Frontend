import client from "../../utils/axios.js";

/**
 * Gọi API lấy danh sách Supplier sử dụng axios đã cấu hình
 * 
 * @param {Object} params - Các tham số truy vấn như page, size, supplierName, status
 * @returns {Promise<Object>} - Kết quả trả về từ API gồm danh sách nhà cung cấp và thông tin phân trang
 */
export const getSuppliers = async (params = {}) => {
  try {
    const response = await client.get("/api/suppliers", { params });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    throw error;
  }
};

/**
 * Lấy danh sách nhà cung cấp cho dropdown
 * 
 * @returns {Promise<Object>} - Kết quả trả về là danh sách {id, name} trong trường data của response
 */
export const getSuppliersDropdown = async () => {
  try {
    const response = await client.get('/api/suppliers/dropdown');
    // API này khác với các API khác, có wrapper format ApiResponse
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhà cung cấp dropdown:', error);
    throw error;
  }
};

/**
 * Thêm mới nhà cung cấp
 * 
 * @param {Object} payload - Dữ liệu nhà cung cấp mới
 * @returns {Promise<Object>} - Kết quả trả về từ API (void response)
 */
export const createSupplier = async (payload) => {
  try {
    // Đảm bảo có trường createdBy và updatedBy
    if (!payload.createdBy) payload.createdBy = "admin";
    if (!payload.updatedBy) payload.updatedBy = payload.createdBy;
    
    const response = await client.post("/api/suppliers", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm nhà cung cấp:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin nhà cung cấp
 * Note: API PUT không có ID trong path mà trong request body
 * 
 * @param {Object} payload - Dữ liệu cập nhật (phải có trường id)
 * @returns {Promise<Object>} - Kết quả trả về từ API (void response)
 */
export const updateSupplier = async (payload) => {
  try {
    // Đảm bảo có trường updatedBy
    if (!payload.updatedBy) payload.updatedBy = "admin";
    
    // Kiểm tra id bắt buộc phải có
    if (!payload.id) {
      throw new Error("Thiếu ID của nhà cung cấp cần cập nhật");
    }
    
    const response = await client.put("/api/suppliers", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật nhà cung cấp:", error);
    throw error;
  }
};

/**
 * Xoá nhà cung cấp
 * 
 * @param {number} id - ID của nhà cung cấp cần xoá
 * @returns {Promise<Object>} - Kết quả trả về từ API (void response)
 */
export const deleteSupplier = async (id) => {
  try {
    const response = await client.delete(`/api/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xoá nhà cung cấp:", error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái nhà cung cấp
 * 
 * @param {number} id - ID của nhà cung cấp
 * @param {number} status - Trạng thái mới (1: Hoạt động, 0: Không hoạt động)
 * @param {string} updatedBy - Người cập nhật
 * @returns {Promise<Object>} - Kết quả trả về từ API (void response)
 */
export const upStatusSupplier = async (id, status, updatedBy) => {
  try {
    const response = await client.patch(`/api/suppliers/status`, null, {
      params: { id, status, updatedBy },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái nhà cung cấp:", error);
    throw error;
  }
};
