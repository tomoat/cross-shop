import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// 创建订单
const createOrder = async (request, reply) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = request.body;
    
    if (orderItems && orderItems.length === 0) {
      return reply.status(400).send({ message: '购物车为空' });
    }
    
    // 获取产品信息并计算订单金额
    const productIds = orderItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    
    let totalPrice = 0;
    let itemsPrice = 0;
    
    // 验证库存并计算价格
    for (const item of orderItems) {
      const product = products.find(p => p._id.toString() === item.product.toString());
      
      if (!product) {
        return reply.status(404).send({ message: `产品 ${item.product} 不存在` });
      }
      
      if (product.quantity < item.quantity) {
        return reply.status(400).send({ message: `产品 ${product.name} 库存不足` });
      }
      
      const itemPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      itemsPrice += itemPrice * item.quantity;
    }
    
    // 计算配送费和总价（示例：订单超过99免运费）
    const shippingPrice = itemsPrice >= 99 ? 0 : 10;
    const taxPrice = itemsPrice * 0.08; // 8%的税费示例
    totalPrice = itemsPrice + shippingPrice + taxPrice;
    
    // 创建订单
    const order = new Order({
      orderItems,
      user: request.user.id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false
    });
    
    const createdOrder = await order.save();
    
    // 减少库存
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity }
      });
    }
    
    reply.status(201).send(createdOrder);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 获取我的订单
const getMyOrders = async (request, reply) => {
  try {
    const { page = 1, limit = 10 } = request.query;
    
    const count = await Order.countDocuments({ user: request.user.id });
    const orders = await Order.find({ user: request.user.id })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    reply.send({
      orders,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count
    });
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 获取订单详情
const getOrderById = async (request, reply) => {
  try {
    const order = await Order.findById(request.params.id)
      .populate('user', 'username email')
      .populate('orderItems.product', 'name price discountPrice images');
    
    if (order) {
      // 检查是否是订单所有者或管理员
      if (order.user._id.toString() !== request.user.id && request.user.role !== 'admin') {
        return reply.status(403).send({ message: '无权访问此订单' });
      }
      
      reply.send(order);
    } else {
      reply.status(404).send({ message: '订单不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 支付订单
const payOrder = async (request, reply) => {
  try {
    const { paymentResult } = request.body;
    
    const order = await Order.findById(request.params.id);
    
    if (order) {
      // 检查是否是订单所有者
      if (order.user.toString() !== request.user.id) {
        return reply.status(403).send({ message: '无权操作此订单' });
      }
      
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentResult.id,
        status: paymentResult.status,
        update_time: paymentResult.update_time,
        email_address: paymentResult.email_address
      };
      
      const updatedOrder = await order.save();
      reply.send(updatedOrder);
    } else {
      reply.status(404).send({ message: '订单不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 确认收货
const deliverOrder = async (request, reply) => {
  try {
    const order = await Order.findById(request.params.id);
    
    if (order) {
      // 检查是否是订单所有者
      if (order.user.toString() !== request.user.id) {
        return reply.status(403).send({ message: '无权操作此订单' });
      }
      
      // 检查订单是否已支付
      if (!order.isPaid) {
        return reply.status(400).send({ message: '订单尚未支付' });
      }
      
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      
      const updatedOrder = await order.save();
      reply.send(updatedOrder);
    } else {
      reply.status(404).send({ message: '订单不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 取消订单
const cancelOrder = async (request, reply) => {
  try {
    const order = await Order.findById(request.params.id);
    
    if (order) {
      // 检查是否是订单所有者或管理员
      if (order.user.toString() !== request.user.id && request.user.role !== 'admin') {
        return reply.status(403).send({ message: '无权操作此订单' });
      }
      
      // 检查订单状态
      if (order.isDelivered) {
        return reply.status(400).send({ message: '订单已送达，无法取消' });
      }
      
      order.status = 'cancelled';
      order.cancelledAt = Date.now();
      
      const updatedOrder = await order.save();
      
      // 如果已支付，需要处理退款逻辑
      if (order.isPaid) {
        // 这里可以添加退款逻辑，比如调用支付平台的退款API
        // refundOrder(order);
      }
      
      // 恢复库存
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity }
        });
      }
      
      reply.send(updatedOrder);
    } else {
      reply.status(404).send({ message: '订单不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 获取所有订单（管理员）
const getOrders = async (request, reply) => {
  try {
    const { page = 1, limit = 10, status } = request.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    
    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('user', 'username email');
    
    reply.send({
      orders,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count
    });
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 发货（管理员）
const shipOrder = async (request, reply) => {
  try {
    const { trackingNumber, shippingCompany } = request.body;
    
    const order = await Order.findById(request.params.id);
    
    if (order) {
      // 检查订单是否已支付
      if (!order.isPaid) {
        return reply.status(400).send({ message: '订单尚未支付，无法发货' });
      }
      
      order.status = 'shipped';
      order.shippedAt = Date.now();
      order.trackingNumber = trackingNumber;
      order.shippingCompany = shippingCompany;
      
      const updatedOrder = await order.save();
      reply.send(updatedOrder);
    } else {
      reply.status(404).send({ message: '订单不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

export {
  createOrder,
  getMyOrders,
  getOrderById,
  payOrder,
  deliverOrder,
  cancelOrder,
  getOrders,
  shipOrder
};