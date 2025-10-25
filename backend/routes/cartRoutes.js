import Router from 'koa-router';
const router = new Router();

import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../controllers/cartController.js';

import { protect } from '../middleware/auth.js';

// 获取购物车（需要登录）
router.get('/', protect, getCart);

// 添加商品到购物车（需要登录）
router.post('/items', protect, addToCart);

// 更新购物车商品数量（需要登录）
router.put('/items/:itemId', protect, updateCartItem);

// 从购物车移除商品（需要登录）
router.delete('/items/:itemId', protect, removeFromCart);

// 清空购物车（需要登录）
router.delete('/', protect, clearCart);

export default router;