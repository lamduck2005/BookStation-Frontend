import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token (nếu có)vào header của mỗi request 
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// client.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if(error.response && error.response.status === 401) {
//       showToast('error', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
//       clearAuth();
//       window.location.href = '/auth';
//     }
//     return Promise.reject(error);
//   }
// );

export default client;