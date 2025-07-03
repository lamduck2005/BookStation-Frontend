import axios from '@/utils/axios.js'

/**
 * Lấy chi tiết sách theo ID
 * @param {number} id - ID của sách
 * @returns {Promise} Response từ API
 */
export const getBookDetail = async (id) => {
  try {
    const response = await axios.get(`/api/books/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching book detail:', error)
    throw error
  }
}
