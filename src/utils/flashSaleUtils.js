/**
 * Flash Sale utility functions
 * Xử lý countdown timer và flash sale logic chung cho toàn bộ ứng dụng
 */

/**
 * Tạo countdown timer cho flash sale
 * @param {number} flashSaleEndTime - Thời gian kết thúc flash sale (timestamp)
 * @param {number} serverTime - Server time để sync (timestamp) 
 * @param {function} onExpired - Callback khi flash sale hết hạn
 * @param {function} onUpdate - Callback cập nhật countdown display
 * @param {string} format - Format hiển thị ('full', 'compact', 'hms')
 * @returns {object} - Object chứa timer và method để clear
 */
export function createFlashSaleCountdown(flashSaleEndTime, serverTime, onExpired, onUpdate, format = 'full') {
  if (!flashSaleEndTime) {
    console.warn('flashSaleEndTime is required for countdown')
    return null
  }
  
  // Tính time difference để sync với server
  const timeDiff = serverTime ? (serverTime - Date.now()) : 0
  
  const timer = setInterval(() => {
    const now = Date.now() + timeDiff // Sync với server time
    const remaining = flashSaleEndTime - now
    
    if (remaining <= 0) {
      clearInterval(timer)//stop countdown
      if (onExpired) {
        onExpired()
      }
    } else {
      const countdown = formatCountdownTime(remaining, format)
      if (onUpdate) {
        onUpdate(countdown)
      }
    }
  }, 1000)
  
  return {
    timer,
    clear: () => clearInterval(timer)
  }
}

/**
 * Format countdown time thành string hiển thị
 * @param {number} remaining - Thời gian còn lại (milliseconds)
 * @param {string} format - Format hiển thị ('full', 'compact', 'hms')
 * @returns {string} - Countdown string
 */
export function formatCountdownTime(remaining, format = 'hms') {
  if (remaining <= 0) {
    return format === 'compact' ? 'Hết hạn' : '00:00:00'
  }
  
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
  
  switch (format) {
    case 'full':
      if (days > 0) {
        return `${days} ngày ${hours} giờ`
      } else if (hours > 0) {
        return `${hours} giờ ${minutes} phút`
      } else if (minutes > 0) {
        return `${minutes} phút ${seconds} giây`
      } else {
        return `${seconds} giây`
      }
      
    case 'compact':
      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
      } else {
        return `${seconds}s`
      }
      
    case 'hms':
    default:
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}

/**
 * Kiểm tra xem flash sale có còn hiệu lực không
 * @param {number} flashSaleEndTime - Thời gian kết thúc flash sale
 * @param {number} serverTime - Server time để sync
 * @returns {boolean} - true nếu còn hiệu lực
 */
export function isFlashSaleActive(flashSaleEndTime, serverTime = null) {
  if (!flashSaleEndTime) return false
  
  const now = serverTime ? serverTime : Date.now()
  return flashSaleEndTime > now
}

/**
 * Tạo flash sale countdown manager cho multiple items
 * @param {Array} items - Danh sách items có flash sale
 * @param {function} onItemExpired - Callback khi một item hết hạn flash sale
 * @param {function} onUpdate - Callback cập nhật UI
 * @param {string} format - Format hiển thị ('full', 'compact', 'hms')
 * @returns {object} - Manager object
 */
export function createFlashSaleManager(items, onItemExpired, onUpdate, format = 'full') {
  const timers = new Map()
  
  const startCountdown = (item) => {
    console.log('Checking item for countdown:', item.id, 'itemType:', item.itemType, 'flashSaleEndTime:', item.flashSaleEndTime)
    if (!item.flashSaleEndTime || item.itemType !== 'FLASH_SALE') {
      console.log('Skipping item:', item.id, 'reason: no flashSaleEndTime or not FLASH_SALE')
      return
    }
    
    const countdown = createFlashSaleCountdown(
      item.flashSaleEndTime,
      item.serverTime,
      () => {
        // Flash sale hết hạn
        timers.delete(item.id)
        if (onItemExpired) {
          onItemExpired(item)
        }
      },
      (countdownText) => {
        if (onUpdate) {
          onUpdate(item.id, countdownText)
        }
      },
      format // Truyền format vào
    )
    
    console.log('Created countdown for item:', item.id, 'countdown:', countdown)
    
    if (countdown) {
      timers.set(item.id, countdown)
    }
  }
  
  const stopCountdown = (itemId) => {
    const timer = timers.get(itemId)
    if (timer) {
      timer.clear()
      timers.delete(itemId)
    }
  }
  
  const stopAllCountdowns = () => {
    timers.forEach(timer => timer.clear())
    timers.clear()
  }
  
  // Khởi tạo countdown cho tất cả items
  items.forEach(item => {
    if (item.itemType === 'FLASH_SALE' && item.flashSaleEndTime) {
      startCountdown(item)
    }
  })
  
  return {
    startCountdown,
    stopCountdown,
    stopAllCountdowns,
    getActiveTimers: () => Array.from(timers.keys())
  }
}