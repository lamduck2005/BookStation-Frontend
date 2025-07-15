import client from '@/utils/axios';

// Lấy danh sách nhà xuất bản
export const getPublishers = async (params = {}) => {
  try {
    const response = await client.get('/api/publishers', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhà xuất bản:', error);
    throw error;
  }
};

// Lấy danh sách nhà xuất bản cho dropdown
export const getPublishersDropdown = async () => {
  try {
    const response = await client.get('/api/publishers/dropdown');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhà xuất bản dropdown:', error);
    throw error;
  }
};

// Tạo nhà xuất bản mới
export const createPublisher = async (publisherData) => {
  try {
    const response = await client.post('/api/publishers', publisherData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo nhà xuất bản:', error);
    throw error;
  }
};

// Cập nhật nhà xuất bản
export const updatePublisher = async (id, publisherData) => {
  try {
    // Gửi PUT đúng chuẩn REST: id trên URL, body không cần id
    const response = await client.put(`/api/publishers/${id}`, publisherData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật nhà xuất bản:', error);
    throw error;
  }
};

// Xóa nhà xuất bản
export const deletePublisher = async (id) => {
  try {
    const response = await client.delete(`/api/publishers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa nhà xuất bản:', error);
    throw error;
  }
};

// Cập nhật trạng thái nhà xuất bản
export const updatePublisherStatus = async (id, status, updatedBy) => {
  try {
    const response = await client.patch(`/api/publishers/${id}/status?status=${status}&updatedBy=${updatedBy}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái nhà xuất bản:', error);
    throw error;
  }
};
export const getAllPublishers = async () => {
try {
const response = await client.get('/api/publishers/getall');
console.log("Response from getAllPublishers:", response.data);
    return response.data.data; // Assuming the data is in the 'data' field of the response
}catch (error) {

    console.error("Error fetching publishers:", error);
    throw error;
  }


}
