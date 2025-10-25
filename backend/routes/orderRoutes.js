import Router from 'koa-router';
const router = new Router();

import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder 
} from '../controllers/orderController.js';

import { protect, authorize } from '../middleware/auth.js';

// 创建订单（需要登录）
router.post('/', protect, createOrder);

// 获取订单列表（需要登录）
router.get('/', protect, getOrders);

// 获取单个订单详情（需要登录）
router.get('/:id', protect, getOrderById);

// 更新订单状态（需要管理员权限）
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

// 取消订单（需要登录）
router.put('/:id/cancel', protect, cancelOrder);

export default router;