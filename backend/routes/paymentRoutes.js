import Router from 'koa-router';
const router = new Router();

import {
  createPaymentIntent,
  handleWebhook,
  verifyPaymentStatus,
  requestRefund
} from '../controllers/paymentController.js';

import { protect, authorize } from '../middleware/auth.js';

// 创建支付意向（需要登录）
router.post('/create-intent', protect, createPaymentIntent);

// 处理支付回调（公开，来自支付网关）
router.post('/webhook', handleWebhook);

// 验证支付状态（需要登录）
router.get('/:orderId/status', protect, verifyPaymentStatus);

// 申请退款（需要登录）
router.post('/:orderId/refund', protect, requestRefund);

export default router;