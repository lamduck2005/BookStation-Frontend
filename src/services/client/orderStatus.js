import axiosInstance from '@/utils/axios.js'

// Cache cho danh sách trạng thái để tránh gọi API nhiều lần
let statusesCache = null

/**
 * Lấy danh sách tất cả trạng thái đơn hàng từ API
 */
export const getAllOrderStatuses = async () => {
  try {
    // Sử dụng cache nếu đã có
    if (statusesCache) {
      return { data: statusesCache }
    }
    
    const response = await axiosInstance.get('/api/orders/order-statuses')
    
    // Lưu vào cache
    if (response.data && response.data.data) {
      statusesCache = response.data.data
    }
    
    return response.data
  } catch (error) {
    console.error('Error fetching order statuses:', error)
    throw error
  }
}

/**
 * Mapping icon cho từng trạng thái
 */
const getStatusIcon = (statusValue) => {
  const iconMap = {
    'PENDING': 'bi-clock',
    'CONFIRMED': 'bi-check-circle',
    'SHIPPED': 'bi-truck',
    'DELIVERED': 'bi-check2-circle',
    'DELIVERY_FAILED': 'bi-exclamation-triangle',
    'REDELIVERING': 'bi-arrow-repeat',
    'RETURNING_TO_WAREHOUSE': 'bi-arrow-left-circle',
    'CANCELED': 'bi-x-circle',
    'REFUND_REQUESTED': 'bi-arrow-return-left',
    'AWAITING_GOODS_RETURN': 'bi-hourglass-split',
    'GOODS_RECEIVED_FROM_CUSTOMER': 'bi-check-square',
    'GOODS_RETURNED_TO_WAREHOUSE': 'bi-house',
    'REFUNDING': 'bi-arrow-clockwise',
    'REFUNDED': 'bi-check-circle-fill',
    'PARTIALLY_REFUNDED': 'bi-check-circle'
  }
  
  return iconMap[statusValue] || 'bi-question-circle'
}

/**
 * Lấy trạng thái tiến trình cho một đơn hàng cụ thể dựa trên API
 * @param {string} currentStatus - Trạng thái hiện tại của đơn hàng
 * @param {string} orderType - Loại đơn hàng (ONLINE, COUNTER)
 * @returns {Promise<Array>} Mảng các trạng thái theo thứ tự tiến trình
 */
export const getOrderProgressStatuses = async (currentStatus, orderType = 'ONLINE') => {
  try {
    // Lấy danh sách tất cả trạng thái từ API
    const response = await getAllOrderStatuses()
    const allStatuses = response.data || []
    
    // Chuyển đổi thành format có icon
    const statusesWithIcons = allStatuses.map(status => ({
      value: status.value,
      displayName: status.displayName,
      icon: getStatusIcon(status.value)
    }))
    
    // Định nghĩa các luồng trạng thái dựa trên logic business
    const flowMappings = {
      // Luồng bình thường
      normal: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'],
      
      // Luồng hủy đơn
      canceled: ['PENDING', 'CANCELED'],
      
      // Luồng hoàn trả hoàn toàn
      fullRefund: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'REFUND_REQUESTED', 'REFUNDING', 'REFUNDED'],
      
      // Luồng hoàn trả một phần
      partialRefund: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'REFUND_REQUESTED', 'REFUNDING', 'PARTIALLY_REFUNDED'],
      
      // Luồng giao hàng thất bại và giao lại
      deliveryFailed: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERY_FAILED', 'REDELIVERING'],
      
      // Luồng trả hàng về kho
      returning: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERY_FAILED', 'RETURNING_TO_WAREHOUSE'],
      
      // Luồng hoàn trả phức tạp (với các bước trung gian)
      complexRefund: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'REFUND_REQUESTED', 'AWAITING_GOODS_RETURN', 'GOODS_RECEIVED_FROM_CUSTOMER', 'GOODS_RETURNED_TO_WAREHOUSE', 'REFUNDING', 'REFUNDED']
    }
    
    // Xác định luồng dựa trên trạng thái hiện tại
    let flowSequence = []
    
    switch (currentStatus) {
      case 'CANCELED':
        flowSequence = flowMappings.canceled
        break
        
      case 'REFUNDED':
        flowSequence = flowMappings.fullRefund
        break
        
      case 'PARTIALLY_REFUNDED':
        flowSequence = flowMappings.partialRefund
        break
        
      case 'DELIVERY_FAILED':
        flowSequence = flowMappings.normal.concat(['DELIVERY_FAILED'])
        break
        
      case 'REDELIVERING':
        flowSequence = flowMappings.deliveryFailed
        break
        
      case 'RETURNING_TO_WAREHOUSE':
        flowSequence = flowMappings.returning
        break
        
      case 'REFUND_REQUESTED':
      case 'REFUNDING':
        flowSequence = flowMappings.fullRefund
        break
        
      case 'AWAITING_GOODS_RETURN':
      case 'GOODS_RECEIVED_FROM_CUSTOMER':
      case 'GOODS_RETURNED_TO_WAREHOUSE':
        flowSequence = flowMappings.complexRefund
        break
        
      default:
        flowSequence = flowMappings.normal
        break
    }
    
    // Lọc và sắp xếp các trạng thái theo luồng
    const progressStatuses = flowSequence
      .map(statusValue => statusesWithIcons.find(s => s.value === statusValue))
      .filter(status => status !== undefined)
    
    return progressStatuses
    
  } catch (error) {
    console.error('Error getting order progress statuses:', error)
    
    // Fallback về luồng cơ bản nếu API lỗi
    return [
      { value: 'PENDING', displayName: 'Chờ xử lý', icon: 'bi-clock' },
      { value: 'CONFIRMED', displayName: 'Đã xác nhận', icon: 'bi-check-circle' },
      { value: 'SHIPPED', displayName: 'Đang giao hàng', icon: 'bi-truck' },
      { value: 'DELIVERED', displayName: 'Đã giao hàng', icon: 'bi-check2-circle' }
    ]
  }
}

/**
 * Kiểm tra xem một trạng thái có được hoàn thành không
 * @param {string} status - Trạng thái cần kiểm tra
 * @param {string} currentStatus - Trạng thái hiện tại của đơn hàng
 * @param {Array} progressFlow - Luồng tiến trình
 * @returns {string} 'completed', 'current', 'pending'
 */
export const getStatusState = (status, currentStatus, progressFlow) => {
  const currentIndex = progressFlow.findIndex(s => s.value === currentStatus)
  const statusIndex = progressFlow.findIndex(s => s.value === status)
  
  if (statusIndex < currentIndex) {
    return 'completed'
  } else if (statusIndex === currentIndex) {
    return 'current'
  } else {
    return 'pending'
  }
}
