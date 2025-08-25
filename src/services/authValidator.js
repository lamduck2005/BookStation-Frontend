import { showAlert, showToast } from '@/utils/swalHelper'
import { clearAuth } from '@/utils/utils'
import client from '@/utils/axios'
import { navigateToError } from './navigation'

// Kiểm tra và validate token
const validateToken = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return

  try {
    await client.post('/api/auth/validate-token', {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  } catch (error) {
    if (error.response?.data) {
      const { status, message } = error.response.data
      handleInvalidAuth(message, status)
    } else if (error.response?.status === 401) {
      handleInvalidAuth('Phiên đăng nhập đã hết hạn', 401)
    }
  }
}

// Xử lý khi auth không hợp lệ
const handleInvalidAuth = (message, statusCode) => {
  clearAuth()
  showAlert("Ui có lỗi rồi!", message, "error", "Tôi đã hiểu")
  navigateToError(statusCode, message)
}

// Luôn chạy validation mỗi 5 giây
window.authValidationInterval = setInterval(validateToken, 5000)
