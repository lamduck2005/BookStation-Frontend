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
