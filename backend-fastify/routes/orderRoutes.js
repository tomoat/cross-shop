import { createOrder, getMyOrders, getOrderById, payOrder, deliverOrder, cancelOrder, getOrders, shipOrder } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const orderRoutes = async (fastify, options) => {
  // 创建订单
  fastify.post('/', {
    preHandler: protect
  }, createOrder);
  
  // 获取我的订单
  fastify.get('/myorders', {
    preHandler: protect
  }, getMyOrders);
  
  // 获取订单详情
  fastify.get('/:id', {
    preHandler: protect
  }, getOrderById);
  
  // 支付订单
  fastify.put('/:id/pay', {
    preHandler: protect
  }, payOrder);
  
  // 确认收货
  fastify.put('/:id/deliver', {
    preHandler: protect
  }, deliverOrder);
  
  // 取消订单
  fastify.put('/:id/cancel', {
    preHandler: protect
  }, cancelOrder);
  
  // 获取所有订单（管理员）
  fastify.get('/', {
    preHandler: [protect, admin]
  }, getOrders);
  
  // 发货（管理员）
  fastify.put('/:id/ship', {
    preHandler: [protect, admin]
  }, shipOrder);
};

export default orderRoutes;