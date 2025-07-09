/**
 * Notification utility for showing toast messages
 */

export const showNotification = (type, message) => {
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  }
  
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    info: '#17a2b8',
    warning: '#ffc107'
  }
  
  // Create notification element
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
    cursor: pointer;
  `
  
  notification.innerHTML = `${icons[type]} ${message}`
  
  // Add animation CSS if not exists
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style')
    style.id = 'notification-styles'
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `
    document.head.appendChild(style)
  }
  
  document.body.appendChild(notification)
  
  // Auto hide after 4 seconds
  const hideNotification = () => {
    notification.style.animation = 'slideOut 0.3s ease-in'
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }
  
  setTimeout(hideNotification, 4000)
  
  // Allow click to close
  notification.addEventListener('click', hideNotification)
}

export default {
  showNotification
}
