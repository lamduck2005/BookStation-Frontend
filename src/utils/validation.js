// Validation patterns và functions chung cho toàn bộ ứng dụng

// Regex patterns - chỉ giữ những cái thực sự cần thiết
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^0\d{9,10}$/,
  password: /^[a-zA-Z0-9]{6,20}$/,
  fullName: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸỳỵỷỹ\s]{2,50}$/u,
  comment: /^.{3,500}$/,
  rating: /^[1-5]$/,
  status: /^[01]$/
};

// Validation functions
export const validate = {
  // Required field
  required: (value, fieldName = 'Trường này') => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} không được để trống`;
    }
    return null;
  },

  // Email validation - đồng bộ với AuthPage.vue
  email: (email) => {
    if (!email) return 'Email không được để trống';
    if (email.length > 50) return 'Email tối đa 50 ký tự';
    if (!patterns.email.test(email)) {
      return 'Email không hợp lệ';
    }
    return null;
  },

  // Phone validation
  phone: (phone) => {
    if (!phone) return null; // Phone có thể để trống
    if (!patterns.phone.test(phone)) {
      return 'Số điện thoại không hợp lệ (bắt đầu bằng 0, 10-11 số)';
    }
    return null;
  },

  // Password validation - đồng bộ với AuthPage.vue
  password: (password) => {
    if (!password) return 'Mật khẩu không được để trống';
    if (password.length < 6 || password.length > 20) {
      return 'Mật khẩu phải từ 6 đến 20 ký tự';
    }
    if (!patterns.password.test(password)) {
      return 'Mật khẩu chỉ được chứa chữ hoa, chữ thường và số, không dấu cách, không ký tự đặc biệt';
    }
    return null;
  },

  // Full name validation - đồng bộ với AuthPage.vue
  fullName: (fullName) => {
    if (!fullName) return 'Họ tên không được để trống';
    if (fullName.length < 2 || fullName.length > 50) {
      return 'Tên phải từ 2 đến 50 ký tự';
    }
    if (!patterns.fullName.test(fullName)) {
      return 'Tên không được chứa ký tự đặc biệt';
    }
    return null;
  },

  // Number validation
  number: (value, fieldName = 'Giá trị', options = {}) => {
    const { min, max, allowNegative = false } = options;
    
    if (value === null || value === undefined || value === '') {
      return `${fieldName} không được để trống`;
    }
    
    const num = Number(value);
    if (isNaN(num)) {
      return `${fieldName} phải là số`;
    }
    
    if (!allowNegative && num < 0) {
      return `${fieldName} phải lớn hơn hoặc bằng 0`;
    }
    
    if (min !== undefined && num < min) {
      return `${fieldName} phải lớn hơn hoặc bằng ${min}`;
    }
    
    if (max !== undefined && num > max) {
      return `${fieldName} phải nhỏ hơn hoặc bằng ${max}`;
    }
    
    return null;
  },

  // Comment validation
  comment: (comment) => {
    if (!comment) return 'Bình luận không được để trống';
    if (comment.length < 3) {
      return 'Bình luận phải có ít nhất 3 ký tự';
    }
    if (comment.length > 500) {
      return 'Bình luận không được vượt quá 500 ký tự';
    }
    return null;
  },

  // Rating validation
  rating: (rating) => {
    if (!rating) return 'Đánh giá không được để trống';
    const num = Number(rating);
    if (isNaN(num) || num < 1 || num > 5) {
      return 'Đánh giá phải từ 1 đến 5';
    }
    return null;
  },

  // Status validation (0 hoặc 1)
  status: (status) => {
    if (status === null || status === undefined || status === '') {
      return 'Trạng thái không được để trống';
    }
    if (status !== 0 && status !== 1 && status !== '0' && status !== '1') {
      return 'Trạng thái phải là 0 hoặc 1';
    }
    return null;
  }
};

// Helper function để validate nhiều fields
export const validateForm = (validations) => {
  for (const validation of validations) {
    if (validation !== null) {
      return validation;
    }
  }
  return null;
};

// Export default
export default {
  patterns,
  validate,
  validateForm
};
