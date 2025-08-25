// Hàm debounce: trì hoãn thực thi hàm cho đến khi ngừng gọi một khoảng thời gian
export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Chuyển datetime-local thành timestamp milliseconds (không đổi timezone)
export function datetimeLocalToTimestamp(datetimeLocal) {
  if (!datetimeLocal) return null;
  // Thêm giây vào cuối để tạo thành ISO string hoàn chỉnh
  const datetimeWithSeconds = datetimeLocal + ':00';
  return new Date(datetimeWithSeconds).getTime();
}

// Chuyển timestamp milliseconds thành datetime-local (không đổi timezone)
export function timestampToDatetimeLocal(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  // Format thành YYYY-MM-DDTHH:MM
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  document.cookie = 'authToken=; Max-Age=0; path=/;';
}

// Giải mã JWT (lấy payload)
export const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Lấy user object từ token
export const getUserFromToken = () => parseJwt(localStorage.getItem('authToken'));

// Lấy từng trường nhỏ
export const getUserId = () => getUserFromToken()?.id;
export const getUserEmail = () => getUserFromToken()?.email;
export const getUserFullName = () => getUserFromToken()?.fullName;
export const getUserRole = () => getUserFromToken()?.role;
export const getUserPhone = () => getUserFromToken()?.phone;


// Format currency function
export const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Format date functions
export const toDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
};

export const toTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('vi-VN', { hour12: false });
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('vi-VN', { hour12: false });
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN');
};
