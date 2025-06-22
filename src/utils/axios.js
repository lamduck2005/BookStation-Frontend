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

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung ở đây nếu muốn
    return Promise.reject(error);
  }
);

export default client;