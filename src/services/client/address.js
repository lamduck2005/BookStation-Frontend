import client from "../../utils/axios.js";
import { getUserId } from "../../utils/utils.js";


export const getAddresses = async () => {
  const userId = getUserId();
  return client.get(`/api/addresses`, { params: { userId } });
};

// Hàm lấy địa chỉ mặc định của user
export const getDefaultAddress = async () => {
  const userId = getUserId();
  // Giả sử API trả về địa chỉ mặc định ở endpoint này
  return client.get(`/api/addresses/default`, { params: { userId } });
};

export const getAddress = async (id) => client.get(`/api/addresses/${id}`);

export const addAddress = async (data) => {
  const userId = getUserId();
  return client.post(`/api/addresses`, { ...data, userId });
};

export const addAddressAtAdmin = async (data, userId) => {
  console.log('=== DEBUG addAddressAtAdmin: data =', data);
  console.log('=== DEBUG addAddressAtAdmin: userId =', userId);
  const payload = { ...data, userId };
  console.log('=== DEBUG addAddressAtAdmin: final payload =', payload);
  return client.post(`/api/addresses`, payload);
};

export const updateAddress = async (id, data) => client.put(`/api/addresses/${id}`, data);

// export const deleteAddress = async (id) => client.delete(`/api/addresses/${id}`);

export const disableAddress = async (id) => client.patch(`/api/addresses/${id}/disable`);

