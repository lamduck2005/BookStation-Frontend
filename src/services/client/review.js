import client from '../../utils/axios.js'

//lấy all status 
export const getReviewsOfBook = async (bookId, params = {}) => {
  return await client.get(`/api/books/${bookId}/reviews`, { params })
}

export const getBookAverage = async (bookId) => {
  return await client.get(`/api/books/${bookId}/reviews/average`)
}

// Lấy review đã chấp nhận & chỉnh sửa (published)
export const getBookPublishedReviews = async (bookId, params = {}) => {
  return await client.get(`/api/books/${bookId}/reviews/published`, { params })
}

export const getBookPublishedAverage = async (bookId) => {
  return await client.get(`/api/books/${bookId}/reviews/published-average`)
}


export const createReview = async (bookId, body) => {
  return await client.post(`/api/books/${bookId}/reviews`, body)
}

export const updateReview = async (bookId, reviewId, body) => {
  return await client.put(`/api/books/${bookId}/reviews/${reviewId}`, body)
}

export const hasPurchasedBook = async (bookId, userId) => {
  return await client.get(`/api/books/${bookId}/reviews/purchased`, { params: { userId } })
}

export const canCreateReview = async (bookId, userId) => {
  return await client.get(`/api/books/${bookId}/reviews/can-create`, { params: { userId } })
}

export const canEditReview = async (bookId, userId) => {
  return await client.get(`/api/books/${bookId}/reviews/can-edit`, { params: { userId } })
}

export const getUserReview = async (bookId, userId) => {
  return await client.get(`/api/books/${bookId}/reviews/by-user`, { params: { userId } })
}


