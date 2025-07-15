import axiosClient from '@/utils/axios'

/**
 * Cart API Services
 */

// Add item to cart
export const addToCart = async (cartData) => {
  try {
    const response = await axiosClient.post('/api/carts/items', cartData)
    return response
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

// Get cart items for user
export const getCartItems = async (userId) => {
  try {
    const response = await axiosClient.get(`/api/carts/items/user/${userId}`)
    return response
  } catch (error) {
    console.error('Error getting cart items:', error)
    throw error
  }
}

// Update cart item quantity
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    console.log(`Calling API: PUT /api/carts/items/${cartItemId}?quantity=${quantity}`)
    const response = await axiosClient.put(`/api/carts/items/${cartItemId}?quantity=${quantity}`)
    console.log('API Response:', response)
    return response
  } catch (error) {
    console.error('Error updating cart item:', error)
    throw error
  }
}

// Remove item from cart
export const removeCartItem = async (cartItemId) => {
  try {
    const response = await axiosClient.delete(`/api/carts/items/${cartItemId}`)
    return response
  } catch (error) {
    console.error('Error removing cart item:', error)
    throw error
  }
}

// Update selected state for cart item - theo document
export const selectCartItem = async (cartItemId, isSelected) => {
  try {
    const response = await axiosClient.put(`/api/carts/items/${cartItemId}/select`, {
      selected: isSelected
    })
    return response
  } catch (error) {
    console.error('Error updating selected state:', error)
    throw error
  }
}

// Validate cart trước khi checkout - theo document 
export const validateCart = async (userId) => {
  try {
    const response = await axiosClient.post(`/api/carts/user/${userId}/validate`)
    return response
  } catch (error) {
    console.error('Error validating cart:', error)
    throw error
  }
}

export default {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
  selectCartItem,
  validateCart
}
