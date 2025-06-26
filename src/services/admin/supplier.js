import client from "../../utils/axios.js";

// Gọi API lấy danh sách Supplier sử dụng axios đã cấu hình
export const getSuppliers = async (params = {}) => {
  try {
    const response = await client.get("/api/suppliers", { params });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách supplier:", error);
    throw error;
  }
};

// Thêm mới supplier
export const createSupplier = async (payload) => {
  try {
    const response = await client.post("/api/suppliers", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm supplier:", error);
    throw error;
  }
};

// Cập nhật thông tin supplier
export const updateSupplier = async (payload) => {
  try {
    const response = await client.put("/api/suppliers", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật supplier:", error);
    throw error;
  }
};
// Xoá supplier
export const deleteSupplier = async (id) => {
  try {
    const response = await client.delete(`/api/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xoá supplier:", error);
    throw error;
  }
};

// upStatus supplier
export const upStatusSupplier = async (id, status, updatedBy) => {
  try {
    const response = await client.patch(`/api/suppliers/status`, null, {
      params: { id, status, updatedBy },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái supplier:", error);
    throw error;
  }
};
