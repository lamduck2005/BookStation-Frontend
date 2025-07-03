import client from '@/utils/axios';

// Lấy danh sách suppliers
export const getSuppliers = async (params = {}) => {
  try {
    const response = await client.get('/api/suppliers', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách suppliers:', error);
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

// Tạo supplier mới
export const createSupplier = async (supplierData) => {
  try {
    const response = await client.post('/api/suppliers', supplierData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo supplier:', error);
    throw error;
  }
};

// Cập nhật supplier
export const updateSupplier = async (supplierData) => {
  try {
    const response = await client.put('/api/suppliers', supplierData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật supplier:', error);
    throw error;
  }
};

// Xóa supplier
export const deleteSupplier = async (id) => {
  try {
    const response = await client.delete(`/api/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa supplier:', error);
    throw error;
  }
};

// Cập nhật trạng thái supplier
export const updateSupplierStatus = async (id, status, updatedBy) => {
  try {
    const response = await client.patch(`/api/suppliers/status`, null, {
      params: { id, status, updatedBy }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái supplier:', error);
    throw error;
  }
};

// Lấy chi tiết supplier
export const getSupplierById = async (id) => {
  try {
    const response = await client.get(`/api/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết supplier:', error);
    throw error;
  }
};
