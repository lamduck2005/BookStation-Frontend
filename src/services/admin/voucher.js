import client from "../../utils/axios.js";

// Gọi API lấy danh sách Supplier sử dụng axios đã cấu hình
export const getVouchers = async (params = {}) => {
  try {
    const response = await client.get("/api/vouchers", { params });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách voucher:", error);
    throw error;
  }
};

// Thêm mới voucher
export const createVouchers = async (payload) => {
  try {
    const response = await client.post("/api/vouchers", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm vouchers:", error);
    throw error;
  }
};

// Cập nhật thông tin vouchers
export const updateVouchers = async (payload) => {
  try {
    const response = await client.put("/api/vouchers", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật vouchers:", error);
    throw error;
  }
};
// Xoá supplier
export const deleteVouchers = async (id) => {
  try {
    const response = await client.delete(`/api/vouchers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xoá vouchers:", error);
    throw error;
  }
};

// upStatus supplier
export const upStatusVouchers = async (id, status, updatedBy) => {
  try {
    const response = await client.patch(`/api/vouchers/status`, null, {
      params: { id, status, updatedBy },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái vouchers:", error);
    throw error;
  }
};
