import client from '@/utils/axios';

// Lấy danh sách người dùng (có phân trang, lọc)
export function fetchUsers(params) {
  return client.get('/api/users', { params });
}

// Lấy chi tiết người dùng
export function fetchUserDetail(id) {
  return client.get(`/api/users/${id}`);
}

// Lấy id user theo email
export function getUserIdByEmail(email) {
  return client.get('/api/users/userIdByEmail', { params: { email } });
}

// Lấy thông tin hạng người dùng
export function getUserRank(userID) {
  return client.get("/api/users/userRank", { params: { userID } });
}

// Cập nhật mật khẩu người dùng
export function updateUserPass(id, passCu, passMoi) {
  return client.put("/api/users/userPass", null, {
    params: {
      id: id,
      passCu: passCu,
      passMoi: passMoi,
    },
  });
}

// Tạo mới người dùng
export function createUser(data) {
  return client.post('/api/users', data);
}

// Cập nhật người dùng
export function updateUser(id, data) {
  return client.put(`/api/users/${id}`, data);
}

// Xóa người dùng
export function deleteUser(id) {
  return client.delete(`/api/users/${id}`);
}

// Đổi trạng thái người dùng
export function toggleUserStatus(id) {
  return client.patch(`/api/users/${id}/toggle-status`);
}

// Lấy danh sách users để chọn trong form tạo đơn hàng
export function getUsersForOrder() {
  return client.get('/api/users/dropdown');
}

// Lấy profile người dùng hiện tại
export function getProfile() {
  return client.get('/api/users/profile');
}

// Cập nhật profile người dùng hiện tại
export function updateProfile(id, data) {
  return client.put(`/api/users/profile/${id}`, data);
}

// Tìm user theo text
export function userpos(text) {
  return client.get(`/api/users/userpos`, { params: { text } });
}

// Thêm retailer
export function addretailer(data) {
  return client.post('/api/users/addretail', data);
}
