import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
});

export const generateQr = async (params = {}) => {
  const response = await apiClient.get('/qr', { params });
  return response.data; // Trả về chuỗi base64 của ảnh QR
};