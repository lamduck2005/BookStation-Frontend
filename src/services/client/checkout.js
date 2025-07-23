import axiosClient from '@/utils/axios'

/**
 * Checkout Session API Services
 * 
 * Luồng sử dụng:
 * 1. Từ Cart -> tạo checkout session -> redirect đến checkout page
 * 2. Ở checkout page -> update session (địa chỉ, voucher, payment method)
 * 3. Validate session trước khi đặt hàng
 * 4. Tạo order từ session
 */

/**
 * Tạo checkout session từ cart - API mới theo documentation
 * @param {number} userId - ID của user
 * @returns {Promise} Response chứa checkout session
 */
export const createSessionFromCart = async (userId) => {
  try {
    console.log(`Creating checkout session from cart for user: ${userId}`)
    const response = await axiosClient.post(`/api/checkout-sessions/from-cart?userId=${userId}`)
    console.log('Create session response:', response)
    return response
  } catch (error) {
    console.error('Error creating checkout session from cart:', error)
    throw error
  }
}

/**
 * Tạo checkout session với dữ liệu tùy chỉnh - Theo API documentation mới
 * @param {Object} sessionData - Dữ liệu checkout session với các trường:
 *   - items: [{bookId, quantity}] (required)
 *   - addressId: number (optional)
 *   - shippingMethod: string (optional) - "STANDARD", "EXPRESS"
 *   - estimatedDeliveryFrom: number (optional) - timestamp
 *   - estimatedDeliveryTo: number (optional) - timestamp
 *   - paymentMethod: string (optional) - "COD", "BANK_TRANSFER", "VNPAY"
 *   - selectedVoucherIds: number[] (optional) - tối đa 2
 *   - notes: string (optional)
 * @param {number} userId - ID của user
 * @returns {Promise} Response chứa checkout session
 */
export const createCheckoutSession = async (sessionData, userId) => {
  try {
    console.log('Creating custom checkout session:', sessionData)
    const response = await axiosClient.post(`/api/checkout-sessions?userId=${userId}`, sessionData)
    console.log('Create custom session response:', response)
    return response
  } catch (error) {
    console.error('Error creating custom checkout session:', error)
    throw error
  }
}

/**
 * Cập nhật checkout session - Tất cả trường đều optional theo documentation
 * @param {number} sessionId - ID của checkout session
 * @param {number} userId - ID của user
 * @param {Object} updateData - Dữ liệu cập nhật (tất cả trường optional):
 *   - items: [{bookId, quantity}] (optional)
 *   - addressId: number (optional) 
 *   - shippingMethod: string (optional) - "STANDARD", "EXPRESS"
 *   - estimatedDeliveryFrom: number (optional) - timestamp
 *   - estimatedDeliveryTo: number (optional) - timestamp
 *   - paymentMethod: string (optional) - "COD", "BANK_TRANSFER", "VNPAY"
 *   - selectedVoucherIds: number[] (optional) - tối đa 2
 *   - notes: string (optional)
 * @returns {Promise} Response chứa checkout session đã cập nhật
 */
export const updateCheckoutSession = async (sessionId, userId, updateData) => {
  try {
    console.log(`Updating checkout session ${sessionId} for user ${userId}:`, updateData)
    const response = await axiosClient.put(`/api/checkout-sessions/${sessionId}?userId=${userId}`, updateData)
    console.log('Update session response:', response)
    return response
  } catch (error) {
    console.error('Error updating checkout session:', error)
    throw error
  }
}

/**
 * Lấy checkout session theo ID
 * @param {number} sessionId - ID của checkout session
 * @param {number} userId - ID của user (để security check)
 * @returns {Promise} Response chứa checkout session
 */
export const getCheckoutSession = async (sessionId, userId) => {
  try {
    console.log(`Getting checkout session ${sessionId} for user ${userId}`)
    const response = await axiosClient.get(`/api/checkout-sessions/${sessionId}?userId=${userId}`)
    console.log('Get session response:', response)
    return response
  } catch (error) {
    console.error('Error getting checkout session:', error)
    throw error
  }
}

/**
 * Lấy checkout session mới nhất của user
 * @param {number} userId - ID của user
 * @returns {Promise} Response chứa checkout session mới nhất
 */
export const getLatestCheckoutSession = async (userId) => {
  try {
    console.log(`Getting latest checkout session for user: ${userId}`)
    const response = await axiosClient.get(`/api/checkout-sessions/latest?userId=${userId}`)
    console.log('Latest session response:', response)
    return response
  } catch (error) {
    console.error('Error getting latest checkout session:', error)
    throw error
  }
}

/**
 * Lấy danh sách checkout sessions của user (history)
 * @param {number} userId - ID của user
 * @param {number} page - Trang (default: 0)
 * @param {number} size - Kích thước trang (default: 10)
 * @returns {Promise} Response chứa danh sách sessions
 */
export const getUserCheckoutSessions = async (userId, page = 0, size = 10) => {
  try {
    console.log(`Getting checkout sessions for user ${userId}, page: ${page}, size: ${size}`)
    const response = await axiosClient.get(`/api/checkout-sessions/user?userId=${userId}&page=${page}&size=${size}`)
    console.log('User sessions response:', response)
    return response
  } catch (error) {
    console.error('Error getting user checkout sessions:', error)
    throw error
  }
}

/**
 * Validate checkout session trước khi đặt hàng
 * @param {number} sessionId - ID của checkout session
 * @param {number} userId - ID của user
 * @returns {Promise} Response chứa kết quả validation
 */
export const validateCheckoutSession = async (sessionId, userId) => {
  try {
    console.log(`Validating checkout session ${sessionId} for user ${userId}`)
    const response = await axiosClient.post(`/api/checkout-sessions/${sessionId}/validate?userId=${userId}`)
    console.log('Validation response:', response)
    return response
  } catch (error) {
    console.error('Error validating checkout session:', error)
    throw error
  }
}

/**
 * Tạo đơn hàng từ checkout session
 * @param {number} sessionId - ID của checkout session
 * @param {number} userId - ID của user
 * @returns {Promise} Response chứa order ID
 */
export const createOrderFromSession = async (sessionId, userId) => {
  try {
    console.log(`Creating order from session ${sessionId} for user ${userId}`)
    const response = await axiosClient.post(`/api/checkout-sessions/${sessionId}/create-order?userId=${userId}`)
    console.log('Create order response:', response)
    return response
  } catch (error) {
    console.error('Error creating order from session:', error)
    throw error
  }
}

/**
 * Tính lại giá cho checkout session
 * @param {number} sessionId - ID của checkout session
 * @param {number} userId - ID của user
 * @returns {Promise} Response chứa session với giá đã được tính lại
 */
export const recalculateSessionPricing = async (sessionId, userId) => {
  try {
    console.log(`Recalculating pricing for session ${sessionId}`)
    const response = await axiosClient.patch(`/api/checkout-sessions/${sessionId}/recalculate?userId=${userId}`)
    console.log('Recalculate response:', response)
    return response
  } catch (error) {
    console.error('Error recalculating session pricing:', error)
    throw error
  }
}

/**
 * Gia hạn checkout session
 * @param {number} sessionId - ID của checkout session
 * @param {number} userId - ID của user
 * @param {number} additionalMinutes - Số phút gia hạn thêm (default: 30)
 * @returns {Promise} Response chứa session đã gia hạn
 */
export const extendCheckoutSession = async (sessionId, userId, additionalMinutes = 30) => {
  try {
    console.log(`Extending session ${sessionId} by ${additionalMinutes} minutes`)
    const response = await axiosClient.patch(`/api/checkout-sessions/${sessionId}/extend?userId=${userId}&additionalMinutes=${additionalMinutes}`)
    console.log('Extend session response:', response)
    return response
  } catch (error) {
    console.error('Error extending checkout session:', error)
    throw error
  }
}

/**
 * Đánh dấu checkout session là hoàn thành
 * @param {number} sessionId - ID của checkout session
 * @param {number} userId - ID của user
 * @returns {Promise} Response chứa session đã hoàn thành
 */
export const markSessionCompleted = async (sessionId, userId) => {
  try {
    console.log(`Marking session ${sessionId} as completed`)
    const response = await axiosClient.patch(`/api/checkout-sessions/${sessionId}/complete?userId=${userId}`)
    console.log('Mark completed response:', response)
    return response
  } catch (error) {
    console.error('Error marking session as completed:', error)
    throw error
  }
}

/**
 * Xóa checkout session
 * @param {number} sessionId - ID của checkout session
 * @param {number} userId - ID của user
 * @returns {Promise} Response xác nhận xóa
 */
export const deleteCheckoutSession = async (sessionId, userId) => {
  try {
    console.log(`Deleting checkout session ${sessionId}`)
    const response = await axiosClient.delete(`/api/checkout-sessions/${sessionId}?userId=${userId}`)
    console.log('Delete session response:', response)
    return response
  } catch (error) {
    console.error('Error deleting checkout session:', error)
    throw error
  }
}

export const createVNPayPaymentUrl = async (sessionId, userId) => {
  try {
    const response = await axiosClient.post(`/api/payment/vnpay/create-url?sessionId=${sessionId}&userId=${userId}`)
    return response
  } catch (error) {
    console.error('Error creating VNPay payment URL:', error)
    throw error
  }
}

// Export tất cả functions
export default {
  // Session Management
  createSessionFromCart,
  createCheckoutSession,
  updateCheckoutSession,
  getCheckoutSession,
  getLatestCheckoutSession,
  getUserCheckoutSessions,
  deleteCheckoutSession,
  
  // Validation & Order Creation
  validateCheckoutSession,
  createOrderFromSession,
  
  // Utility functions
  recalculateSessionPricing,
  extendCheckoutSession,
  markSessionCompleted,
  createVNPayPaymentUrl
}
