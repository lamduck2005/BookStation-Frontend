import client from "../../utils/axios.js";

// Lấy danh sách voucher
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

// Cập nhật voucher
export const updateVouchers = async (payload) => {
  try {
    const response = await client.put("/api/vouchers", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật vouchers:", error);
    throw error;
  }
};

// Xoá voucher
export const deleteVouchers = async (id) => {
  try {
    const response = await client.delete(`/api/vouchers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xoá vouchers:", error);
    throw error;
  }
};

// Cập nhật trạng thái voucher
export const upStatusVouchers = async (id, status, updatedBy) => {
  try {
    const response = await client.patch(`/api/vouchers/status`, null, {
      params: { id, status, updatedBy },
    });
    // Sau khi cập nhật trạng thái voucher thành công
    window.dispatchEvent(new Event("voucher-status-updated"));
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái vouchers:", error);
    throw error;
  }
};

// Lấy danh sách user theo voucherId
export const getUsersByVoucherId = async (voucherId) => {
  try {
    const response = await client.get(`/api/vouchers/newVoucher/${voucherId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách user theo voucherId:", error);
    throw error;
  }
};

// Phát voucher cho tất cả user
export const giveVoucherToAll = async (voucherId) => {
  try {
    const response = await client.post(
      `/api/vouchers/voucher-to-all?voucherId=${voucherId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi phát voucher:", error);
    throw error;
  }
};

// ✅ Thêm API lấy thống kê voucher
export const getVoucherStats = async () => {
  try {
    const response = await client.get("/api/vouchers/stats");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê voucher:", error);
    throw error;
  }
};

