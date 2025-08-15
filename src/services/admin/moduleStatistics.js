import client from '@/utils/axios';

/**
 * Service gọi các client thống kê cho các module
 * Dựa trên tài liệu STATISTICS_client_DOCUMENTATION.md
 */

// =========== USER STATISTICS ===========
export const getUserStatistics = async () => {
  try {
    const response = await client.get('/api/statistics/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
};

// =========== RANK STATISTICS ===========
export const getRankStatistics = async () => {
  try {
    const response = await client.get('/api/statistics/ranks');
    return response.data;
  } catch (error) {
    console.error('Error fetching rank statistics:', error);
    throw error;
  }
};

// =========== POINT STATISTICS ===========
export const getPointStatistics = async () => {
  try {
    const response = await client.get('/api/statistics/points');
    return response.data;
  } catch (error) {
    console.error('Error fetching point statistics:', error);
    throw error;
  }
};

// =========== PUBLISHER STATISTICS ===========
export const getPublisherStatistics = async () => {
  try {
    const response = await client.get('/api/statistics/publishers');
    return response.data;
  } catch (error) {
    console.error('Error fetching publisher statistics:', error);
    throw error;
  }
};

// =========== SUPPLIER STATISTICS ===========
export const getSupplierStatistics = async () => {
  try {
    const response = await client.get('/api/statistics/suppliers');
    return response.data;
  } catch (error) {
    console.error('Error fetching supplier statistics:', error);
    throw error;
  }
};

// =========== UTILITY FUNCTIONS ===========
export const formatCurrency = (amount) => {
  if (!amount) return '0 VND';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatNumber = (number) => {
  if (!number) return '0';
  return new Intl.NumberFormat('vi-VN').format(number);
};

export const formatPercentage = (value) => {
  if (!value) return '0%';
  return `${Number(value).toFixed(1)}%`;
};
