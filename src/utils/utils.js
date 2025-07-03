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


export const getUserId = () => {
  return 1; //fake user id
}