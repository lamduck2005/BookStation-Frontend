// Validation patterns và functions chung cho toàn bộ ứng dụng

// Regex patterns - chỉ giữ những cái thực sự cần thiết
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^0\d{9,10}$/,
  password: /^[a-zA-Z0-9]{6,20}$/,
  fullName: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸỳỵỷỹ\s]{2,50}$/u,
  comment: /^.{3,500}$/,
  biography: /^.{0,1000}$/,
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

  // Comment validation - khôi phục như cũ cho Review
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

  // Biography validation - cho Author (có thể để trống)
  biography: (biography) => {
    if (!biography) return null; // Biography có thể để trống
    if (biography.length > 1000) {
      return 'Tiểu sử không được vượt quá 1000 ký tự';
    }
    return null;
  },

  // Birth date validation - cho Author
  birthDate: (birthDate) => {
    if (!birthDate) return null; // Ngày sinh có thể để trống
    
    const birth = new Date(birthDate);
    const current = new Date();
    
    // Kiểm tra ngày hợp lệ
    if (isNaN(birth.getTime())) {
      return 'Ngày sinh không hợp lệ';
    }
    
    // Kiểm tra không phải tương lai
    if (birth > current) {
      return 'Ngày sinh không thể là ngày trong tương lai';
    }
    
    // Kiểm tra tuổi tối thiểu (18 tuổi)
    const age = current.getFullYear() - birth.getFullYear();
    const monthDiff = current.getMonth() - birth.getMonth();
    const dayDiff = current.getDate() - birth.getDate();
    
    if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
      return 'Tác giả phải từ 18 tuổi trở lên';
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
  },

  // Flash Sale validation functions
  flashSaleItem: {
    bookId: (bookId) => {
      if (!bookId) return 'Vui lòng chọn sách';
      return null;
    },
    
    discountPercentage: (percentage) => {
      if (!percentage && percentage !== 0) return 'Phần trăm giảm không được để trống';
      const num = Number(percentage);
      if (isNaN(num)) return 'Phần trăm giảm phải là số';
      if (num < 0 || num > 100) return 'Phần trăm giảm phải từ 0 đến 100';
      return null;
    },
    
    discountPrice: (price) => {
      if (!price && price !== 0) return 'Giá giảm không được để trống';
      const num = Number(price);
      if (isNaN(num)) return 'Giá giảm phải là số';
      if (num < 0) return 'Giá giảm phải lớn hơn hoặc bằng 0';
      return null;
    },
    
    stockQuantity: (quantity) => {
      if (!quantity && quantity !== 0) return 'Số lượng không được để trống';
      const num = Number(quantity);
      if (isNaN(num)) return 'Số lượng phải là số';
      if (!Number.isInteger(num)) return 'Số lượng phải là số nguyên';
      if (num <= 0) return 'Số lượng phải lớn hơn 0';
      return null;
    },
    
    maxPurchasePerUser: (maxPurchase) => {
      if (!maxPurchase && maxPurchase !== 0) return 'Giới hạn mỗi người không được để trống';
      const num = Number(maxPurchase);
      if (isNaN(num)) return 'Giới hạn mỗi người phải là số';
      if (!Number.isInteger(num)) return 'Giới hạn mỗi người phải là số nguyên';
      if (num <= 0) return 'Giới hạn mỗi người phải lớn hơn 0';
      return null;
    }
  },

  // Category validation functions
  category: {
    categoryName: (name) => {
      if (!name || name.trim() === '') return 'Tên danh mục không được để trống';
      if (name.trim().length < 2) return 'Tên danh mục phải có ít nhất 2 ký tự';
      if (name.trim().length > 100) return 'Tên danh mục không được vượt quá 100 ký tự';
      return null;
    },
    
    description: (description) => {
      if (!description) return null; // Mô tả có thể để trống
      if (description.length > 500) return 'Mô tả không được vượt quá 500 ký tự';
      return null;
    }
  },

  // Voucher validation functions
  voucher: {
    code: (code) => {
      if (!code || code.trim() === '') return 'Mã voucher không được để trống';
      if (code.trim().length < 3) return 'Mã voucher phải có ít nhất 3 ký tự';
      if (code.trim().length > 50) return 'Mã voucher không được vượt quá 50 ký tự';
      return null;
    },
    
    name: (name) => {
      if (!name || name.trim() === '') return 'Tên voucher không được để trống';
      if (name.trim().length < 2) return 'Tên voucher phải có ít nhất 2 ký tự';
      if (name.trim().length > 200) return 'Tên voucher không được vượt quá 200 ký tự';
      return null;
    },
    
    description: (description) => {
      if (!description) return null; // Mô tả có thể để trống
      if (description.length > 500) return 'Mô tả không được vượt quá 500 ký tự';
      return null;
    },
    
    voucherCategory: (category) => {
      if (!category || category.trim() === '') return 'Danh mục voucher không được để trống';
      return null;
    },
    
    discountType: (type) => {
      if (!type) return 'Loại giảm giá không được để trống';
      if (!['PERCENTAGE', 'FIXED_AMOUNT'].includes(type)) return 'Loại giảm giá không hợp lệ';
      return null;
    },
    
    discountPercentage: (percentage, discountType) => {
      if (discountType === 'PERCENTAGE') {
        if (!percentage && percentage !== 0) return 'Phần trăm giảm không được để trống';
        const num = Number(percentage);
        if (isNaN(num)) return 'Phần trăm giảm phải là số';
        if (num < 1 || num > 100) return 'Phần trăm giảm phải từ 1 đến 100';
      }
      return null;
    },
    
    discountAmount: (amount, discountType) => {
      if (discountType === 'FIXED_AMOUNT') {
        if (!amount && amount !== 0) return 'Số tiền giảm không được để trống';
        const num = Number(amount);
        if (isNaN(num)) return 'Số tiền giảm phải là số';
        if (num < 1) return 'Số tiền giảm phải lớn hơn 0';
      }
      return null;
    },
    
    startTime: (startTime) => {
      if (!startTime) return 'Thời gian bắt đầu không được để trống';
      const start = new Date(startTime);
      if (isNaN(start.getTime())) return 'Thời gian bắt đầu không hợp lệ';
      return null;
    },
    
    endTime: (endTime, startTime) => {
      if (!endTime) return 'Thời gian kết thúc không được để trống';
      const end = new Date(endTime);
      if (isNaN(end.getTime())) return 'Thời gian kết thúc không hợp lệ';
      
      if (startTime) {
        const start = new Date(startTime);
        if (end <= start) return 'Thời gian kết thúc phải sau thời gian bắt đầu';
      }
      return null;
    },
    
    minOrderValue: (value) => {
      if (value === '' || value === null || value === undefined) return null; // Có thể để trống
      const num = Number(value);
      if (isNaN(num)) return 'Giá trị đơn hàng tối thiểu phải là số';
      if (num < 0) return 'Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0';
      return null;
    },
    
    maxDiscountValue: (value) => {
      if (value === '' || value === null || value === undefined) return null; // Có thể để trống
      const num = Number(value);
      if (isNaN(num)) return 'Giá trị giảm tối đa phải là số';
      if (num < 0) return 'Giá trị giảm tối đa phải lớn hơn hoặc bằng 0';
      return null;
    },
    
    usageLimit: (limit) => {
      if (limit === '' || limit === null || limit === undefined) return null; // Có thể để trống
      const num = Number(limit);
      if (isNaN(num)) return 'Giới hạn sử dụng phải là số';
      if (!Number.isInteger(num)) return 'Giới hạn sử dụng phải là số nguyên';
      if (num < 1) return 'Giới hạn sử dụng phải lớn hơn 0';
      return null;
    },
    
    usageLimitPerUser: (limit) => {
      if (limit === '' || limit === null || limit === undefined) return null; // Có thể để trống
      const num = Number(limit);
      if (isNaN(num)) return 'Giới hạn sử dụng mỗi người phải là số';
      if (!Number.isInteger(num)) return 'Giới hạn sử dụng mỗi người phải là số nguyên';
      if (num < 1) return 'Giới hạn sử dụng mỗi người phải lớn hơn 0';
      return null;
    }
  },

  // Supplier validation functions
  supplier: {
    supplierName: (name) => {
      if (!name || name.trim() === '') return 'Tên nhà cung cấp không được để trống';
      if (name.trim().length < 2) return 'Tên nhà cung cấp phải có ít nhất 2 ký tự';
      if (name.trim().length > 100) return 'Tên nhà cung cấp không được vượt quá 100 ký tự';
      return null;
    },
    
    contactName: (name) => {
      if (!name || name.trim() === '') return 'Tên người liên hệ không được để trống';
      if (name.trim().length < 2) return 'Tên người liên hệ phải có ít nhất 2 ký tự';
      if (name.trim().length > 100) return 'Tên người liên hệ không được vượt quá 100 ký tự';
      return null;
    },
    
    email: (email) => {
      if (!email || email.trim() === '') return 'Email không được để trống';
      if (email.length > 100) return 'Email không được vượt quá 100 ký tự';
      if (!patterns.email.test(email)) {
        return 'Email không hợp lệ';
      }
      return null;
    },
    
    phoneNumber: (phone) => {
      if (!phone || phone.trim() === '') return 'Số điện thoại không được để trống';
      // Kiểm tra format: phải là 10 số và bắt đầu bằng 0
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return 'Số điện thoại phải có 10 số và bắt đầu bằng 0';
      }
      return null;
    },
    
    address: (address) => {
      if (!address || address.trim() === '') return 'Địa chỉ không được để trống';
      if (address.trim().length < 5) return 'Địa chỉ phải có ít nhất 5 ký tự';
      if (address.trim().length > 500) return 'Địa chỉ không được vượt quá 500 ký tự';
      return null;
    }
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
