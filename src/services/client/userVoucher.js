import axiosClient from "@/utils/axios";

/**
 * Cart API Services
 */

// Add item to cart
// export const addToCart = async (cartData) => {
//   try {
//     const response = await axiosClient.post("/api/carts/items", cartData);
//     return response;
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     throw error;
//   }
// };

// Get vouvher user items for user
export const getUserVoucher = async (userId) => {
  try {
    const response = await axiosClient.get(
      `/api/vouchers/userVoucher/${userId}`
    );
    return response;
  } catch (error) {
    console.error("Error getting userVoucher items:", error);
    throw error;
  }
};

// Get vouvher user items for user
export const getVoucherWithNewUser = async () => {
  try {
    const response = await axiosClient.get(`/api/vouchers/new`);
    return response;
  } catch (error) {
    console.error("Error getting Voucher with new user items:", error);
    throw error;
  }
};

export const getVoucherWithNewUserId = async (userId) => {
  try {
    console.log("userId:", userId);
    const response = await axiosClient.get(`/api/vouchers/new/${userId}`);
    return response;
  } catch (error) {
    console.error("Error getting Voucher with new user items:", error);
    throw error;
  }
};

export const addVoucherForNewuser = async (request) => {
  try {
    const response = await axiosClient.post(
      `/api/vouchers/NewVoucher`,
      request
    );
    console.log("Response from addVoucherForNewuser:", response);
    return response;
  } catch (error) {
    console.error("Error adding Voucher for new user:", error);
    throw error;
  }
};
