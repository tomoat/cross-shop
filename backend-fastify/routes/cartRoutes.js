import { getCart, addToCart, updateCartItem, removeCartItem, clearCart, toggleSelectAll, getSelectedItems } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const cartRoutes = async (fastify, options) => {
  // 获取用户购物车
  fastify.get('/', {
    preHandler: protect
  }, getCart);
  
  // 添加商品到购物车
  fastify.post('/', {
    preHandler: protect
  }, addToCart);
  
  // 更新购物车商品
  fastify.put('/items/:itemId', {
    preHandler: protect
  }, updateCartItem);
  
  // 删除购物车商品
  fastify.delete('/items/:itemId', {
    preHandler: protect
  }, removeCartItem);
  
  // 清空购物车
  fastify.delete('/', {
    preHandler: protect
  }, clearCart);
  
  // 选择/取消选择所有商品
  fastify.put('/select-all', {
    preHandler: protect
  }, toggleSelectAll);
  
  // 获取购物车选中的商品
  fastify.get('/selected', {
    preHandler: protect
  }, getSelectedItems);
};

export default cartRoutes;