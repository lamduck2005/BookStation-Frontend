import axios from '@/utils/axios';

// Lấy danh sách người dùng (có phân trang, lọc)
export function fetchUsers(params) {
  return axios.get('/api/users', { params });
}

// Lấy chi tiết người dùng
export function fetchUserDetail(id) {
  return axios.get(`/api/users/${id}`);
}

// Tạo mới người dùng
export function createUser(data) {
  return axios.post('/api/users', data);
}

// Cập nhật người dùng
export function updateUser(id, data) {
  return axios.put(`/api/users/${id}`, data);
}

// Xóa người dùng
export function deleteUser(id) {
  return axios.delete(`/api/users/${id}`);
}

// Đổi trạng thái người dùng
export function toggleUserStatus(id) {
  return axios.patch(`/api/users/${id}/toggle-status`);
}

// Lấy danh sách users để chọn trong form tạo đơn hàng
export function getUsersForOrder() {
  return axios.get('/api/users/dropdown');
}
