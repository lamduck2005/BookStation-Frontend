import router from '@/router';

// Chuyển hướng đến trang lỗi
export const navigateToError = (status = 404, message = 'Trang không tồn tại') => {
  router.push({
    path: '/error',
    query: { status, message }
  });
};

// Chuyển hướng đến trang lỗi với query params
export const navigateToErrorWithQuery = (params) => {
  router.push({
    path: '/error',
    query: params
  });
};


// Xử lý lỗi chung
export const handleError = (error, defaultMessage = 'Đã xảy ra lỗi') => {
  const status = error?.status || error?.response?.status || 500;
  const message = error?.message || error?.response?.data?.message || defaultMessage;
  
  navigateToError(status, message);
};