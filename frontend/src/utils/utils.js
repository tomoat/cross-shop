import process from 'node:process';
// 格式化价格
export const formatPrice = (price, currency = '¥') => {
  if (typeof price !== 'number') {
    return `${currency}0.00`;
  }
  return `${currency}${price.toFixed(2)}`;
};

// 格式化日期
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 验证邮箱
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// 验证密码强度
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { isValid: false, message: '密码长度至少6位' };
  }
  return { isValid: true };
};

// 生成唯一ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 计算购物车总价
export const calculateCartTotal = (cartItems) => {
  if (!Array.isArray(cartItems)) return 0;
  return cartItems.reduce((total, item) => {
    if (item && item.price && item.quantity) {
      return total + (item.price * item.quantity);
    }
    return total;
  }, 0);
};

// 计算购物车商品总数
export const calculateCartItemsCount = (cartItems) => {
  if (!Array.isArray(cartItems)) return 0;
  return cartItems.reduce((count, item) => {
    if (item && item.quantity) {
      return count + item.quantity;
    }
    return count;
  }, 0);
};

// 获取图片URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.png';

  // 如果是完整URL，直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // 否则拼接基础URL
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${baseUrl}${imagePath}`;
};

// 处理错误响应
export const handleApiError = (error) => {
  if (error.response) {
    // 服务器返回错误状态码
    return error.response.data?.message || '请求失败，请稍后重试';
  } else if (error.request) {
    // 请求已发出但没有收到响应
    return '网络异常，请检查您的网络连接';
  } else {
    // 请求配置出错
    return error.message || '请求失败，请稍后重试';
  }
};

// 防抖函数
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 节流函数
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 深拷贝对象
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) {
    const cloneArr = [];
    for (let i = 0; i < obj.length; i++) {
      cloneArr[i] = deepClone(obj[i]);
    }
    return cloneArr;
  }
  if (obj instanceof Object) {
    const cloneObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloneObj[key] = deepClone(obj[key]);
      }
    }
    return cloneObj;
  }
};

// 截断文本
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// 获取订单状态文本
export const getOrderStatusText = (status) => {
  const statusMap = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    delivered: '已收货',
    cancelled: '已取消',
    refunded: '已退款'
  };
  return statusMap[status] || '未知状态';
};

// 获取订单状态颜色
export const getOrderStatusColor = (status) => {
  const colorMap = {
    pending: 'warning',
    paid: 'processing',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error',
    refunded: 'default'
  };
  return colorMap[status] || 'default';
};