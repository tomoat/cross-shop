import axios from 'axios';
import Cookies from 'js-cookie';

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从cookie获取token
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 处理错误
    const { response } = error;

    if (response) {
      // 服务器返回错误状态码
      switch (response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          Cookies.remove('token');
          Cookies.remove('userInfo');
          window.location.href = '/login';
          break;
        case 403:
          console.error('没有权限访问此资源');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error(`请求错误: ${response.data.message || '未知错误'}`);
      }
      return Promise.reject(response.data);
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络错误，请检查您的网络连接');
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

// API 方法封装
export const userAPI = {
  // 用户注册
  register: (data) => api.post('/users/register', data),
  // 用户登录
  login: (data) => api.post('/users/login', data),
  // 获取当前用户信息
  getProfile: () => api.get('/users/me'),
  // 更新用户信息
  updateProfile: (data) => api.put('/users/me', data),
  // 修改密码
  changePassword: (data) => api.put('/users/change-password', data)
};

export const productAPI = {
  // 获取产品列表
  getProducts: (params) => api.get('/products', { params }),
  // 获取产品详情
  getProductById: (id) => api.get(`/products/${id}`),
  // 添加产品评论
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  // 创建产品（卖家/管理员）
  createProduct: (data) => api.post('/products', data),
  // 更新产品（卖家/管理员）
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  // 删除产品（卖家/管理员）
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

// 分类API
export const categoryAPI = {
  // 获取分类列表
  getCategories: () => api.get('/categories')
};

// 保持向后兼容
export const getCategories = () => api.get('/categories');

// 获取产品列表（直接导出，供组件使用）
export const getProducts = (params) => api.get('/products', { params });

// 添加产品评论（直接导出，供组件使用）
export const addReview = (productId, data) => api.post(`/products/${productId}/reviews`, data);

// 添加商品到购物车（直接导出，供组件使用）
export const addToCart = (data) => api.post('/cart/items', data);

// 获取产品详情（直接导出，供组件使用）
export const getProductById = (id) => api.get(`/products/${id}`);

// 清空购物车（直接导出，供组件使用）
export const clearCart = () => api.delete('/cart');

// 获取购物车信息（直接导出，供组件使用）
export const getCart = () => api.get('/cart');

// 移除购物车商品（直接导出，供组件使用）
export const removeCartItem = (itemId) => api.delete(`/cart/items/${itemId}`);

// 更新购物车商品数量（直接导出，供组件使用）
export const updateCartItem = (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity });

// 添加收货地址（直接导出，供组件使用）
export const addAddress = (data) => api.post('/addresses', data);

// 创建订单（直接导出，供组件使用）
export const createOrder = (data) => api.post('/orders', data);

// 获取用户地址列表（直接导出，供组件使用）
export const getAddresses = () => api.get('/addresses');

// 获取用户收藏商品（直接导出，供组件使用）
export const getFavoriteProducts = () => api.get('/users/favorites');

// 获取用户订单列表（直接导出，供组件使用）
export const getOrders = () => api.get('/orders');

// 移除收藏商品（直接导出，供组件使用）
export const removeFavoriteProduct = (productId) => api.delete(`/users/favorites/${productId}`);

// 更新用户资料（直接导出，供组件使用）
export const updateUserProfile = (data) => api.put('/users/me', data);

// 取消订单（直接导出，供组件使用）
export const cancelOrder = (orderId) => api.put(`/orders/${orderId}/cancel`);

// 获取订单详情（直接导出，供组件使用）
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);

// 支付订单（直接导出，供组件使用）
export const payOrder = (orderId, paymentData) => api.put(`/orders/${orderId}/pay`, paymentData);

// 管理员登录（直接导出，供组件使用）
export const adminLogin = (data) => api.post('/admin/login', data);

// 获取仪表盘统计数据（直接导出，供组件使用）
export const getDashboardStats = () => api.get('/admin/dashboard/stats');

// 获取最近订单（直接导出，供组件使用）
export const getRecentOrders = () => api.get('/admin/dashboard/recent-orders');

export const orderAPI = {
  // 创建订单
  createOrder: (data) => api.post('/orders', data),
  // 获取订单列表
  getOrders: (params) => api.get('/orders', { params }),
  // 获取订单详情
  getOrderById: (id) => api.get(`/orders/${id}`),
  // 更新订单状态（管理员）
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  // 取消订单
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`)
};

export const cartAPI = {
  // 获取购物车
  getCart: () => api.get('/cart'),
  // 添加商品到购物车
  addToCart: (data) => api.post('/cart/items', data),
  // 更新购物车商品数量
  updateCartItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  // 从购物车移除商品
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  // 清空购物车
  clearCart: () => api.delete('/cart')
};