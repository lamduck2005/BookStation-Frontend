import apiClient from '@/utils/axios';

/**
 * Service for Order Statistics APIs
 * Base URLs:
 * - Basic Analytics: /api/order-statistics/
 * - Advanced Analytics: /api/advanced-analytics/
 */

// ========== BASIC ANALYTICS APIs ==========

/**
 * API #1: Get overview statistics for dashboard cards
 */
export const getOverviewStatistics = async () => {
  try {
    const response = await apiClient.get('/api/order-statistics/overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching overview statistics:', error);
    throw error;
  }
};

/**
 * API #2: Get revenue chart data
 * @param {string} period - "daily", "weekly", "monthly"
 * @param {number} days - Number of days to fetch (default: 30)
 */
export const getRevenueChart = async (period = 'daily', days = 30) => {
  try {
    const response = await apiClient.get('/api/order-statistics/revenue-chart', {
      params: { period, days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue chart:', error);
    throw error;
  }
};

/**
 * API #3: Get top selling products
 * @param {string} period - "today", "week", "month"
 * @param {number} limit - Number of top products (default: 10)
 */
export const getTopProducts = async (period = 'week', limit = 10) => {
  try {
    const response = await apiClient.get('/api/order-statistics/top-products', {
      params: { period, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};

/**
 * API #4: Get payment methods statistics
 * @param {string} period - "today", "week", "month"
 */
export const getPaymentMethodsStats = async (period = 'week') => {
  try {
    const response = await apiClient.get('/api/order-statistics/payment-methods', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods stats:', error);
    throw error;
  }
};

/**
 * API #5: Get location statistics for heatmap
 * @param {string} period - "today", "week", "month"
 */
export const getLocationStatistics = async (period = 'week') => {
  try {
    const response = await apiClient.get('/api/order-statistics/locations', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching location statistics:', error);
    throw error;
  }
};

/**
 * API #6: Get revenue comparison data
 */
export const getRevenueComparison = async () => {
  try {
    const response = await apiClient.get('/api/order-statistics/revenue-comparison');
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue comparison:', error);
    throw error;
  }
};

/**
 * API #7: Get customer analytics
 * @param {string} period - "today", "week", "month"
 */
export const getCustomerAnalytics = async (period = 'month') => {
  try {
    const response = await apiClient.get('/api/order-statistics/customers', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    throw error;
  }
};

/**
 * API #8: Get cross-sell suggestions for specific order
 * @param {number} orderId - Order ID
 * @param {number} limit - Number of suggestions (default: 5)
 */
export const getCrossSellSuggestions = async (orderId, limit = 5) => {
  try {
    const response = await apiClient.get(`/api/order-statistics/cross-sell/${orderId}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cross-sell suggestions:', error);
    throw error;
  }
};

// ========== ADVANCED ANALYTICS APIs ==========

/**
 * API #9: Get survival KPIs for business health
 */
export const getSurvivalKPIs = async () => {
  try {
    const response = await apiClient.get('/api/advanced-analytics/survival-kpis');
    return response.data;
  } catch (error) {
    console.error('Error fetching survival KPIs:', error);
    throw error;
  }
};

/**
 * API #10: Get opportunity radar data
 */
export const getOpportunityRadar = async () => {
  try {
    const response = await apiClient.get('/api/advanced-analytics/opportunity-radar');
    return response.data;
  } catch (error) {
    console.error('Error fetching opportunity radar:', error);
    throw error;
  }
};

/**
 * API #11: Get order health map
 */
export const getOrderHealthMap = async () => {
  try {
    const response = await apiClient.get('/api/advanced-analytics/order-health-map');
    return response.data;
  } catch (error) {
    console.error('Error fetching order health map:', error);
    throw error;
  }
};

/**
 * API #12: Get profit optimizer data
 */
export const getProfitOptimizer = async () => {
  try {
    const response = await apiClient.get('/api/advanced-analytics/profit-optimizer');
    return response.data;
  } catch (error) {
    console.error('Error fetching profit optimizer:', error);
    throw error;
  }
};

/**
 * API #13: Get real-time alerts
 */
export const getRealTimeAlerts = async () => {
  try {
    const response = await apiClient.get('/api/advanced-analytics/real-time-alerts');
    return response.data;
  } catch (error) {
    console.error('Error fetching real-time alerts:', error);
    throw error;
  }
};

/**
 * API #14: Execute quick actions
 * @param {object} actionData - Action configuration
 */
export const executeQuickAction = async (actionData) => {
  try {
    const response = await apiClient.post('/api/advanced-analytics/quick-actions', actionData);
    return response.data;
  } catch (error) {
    console.error('Error executing quick action:', error);
    throw error;
  }
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Format currency for display
 * @param {number} amount - Amount in VND
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (!amount) return '0₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format percentage for display
 * @param {number} value - Percentage value
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  if (!value && value !== 0) return '0%';
  return `${value.toFixed(1)}%`;
};

/**
 * Get alert level color class
 * @param {string} level - Alert level ("green", "yellow", "red")
 * @returns {string} CSS class name
 */
export const getAlertLevelClass = (level) => {
  const levelClasses = {
    'green': 'text-success bg-success-subtle',
    'yellow': 'text-warning bg-warning-subtle', 
    'red': 'text-danger bg-danger-subtle',
    'excellent': 'text-success bg-success-subtle',
    'concerning': 'text-warning bg-warning-subtle',
    'critical': 'text-danger bg-danger-subtle'
  };
  return levelClasses[level] || 'text-secondary bg-secondary-subtle';
};

/**
 * Get trend icon based on direction
 * @param {string} trend - Trend direction ("up", "down", "stable")
 * @returns {string} Icon class name
 */
export const getTrendIcon = (trend) => {
  const trendIcons = {
    'up': 'bi bi-arrow-up-right text-success',
    'down': 'bi bi-arrow-down-right text-danger',
    'stable': 'bi bi-arrow-right text-secondary'
  };
  return trendIcons[trend] || 'bi bi-arrow-right text-secondary';
};
