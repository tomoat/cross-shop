import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    创建订单
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    // 输入验证已在路由层处理

    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: '购物车为空' });
    }

    // 计算订单金额
    let totalPrice = 0;
    let taxPrice = 0;
    let shippingPrice = 0;

    // 创建订单项目数组
    const processedOrderItems = [];
    
    // 验证库存并计算价格
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `产品 ${item.product} 不存在` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} 库存不足` });
      }

      // 处理订单项目
      const orderItem = {
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        currency: product.currency,
        image: product.images.find(img => img.isMain)?.url || product.images[0]?.url || ''
      };

      processedOrderItems.push(orderItem);
      totalPrice += product.price * item.quantity;
    }

    // 计算运费（这里简化处理，实际可能更复杂）
    if (totalPrice > 0) {
      shippingPrice = totalPrice >= 100 ? 0 : 10; // 订单满100免运费
    }

    // 计算税费（示例：10%的税率）
    taxPrice = totalPrice * 0.1;

    // 创建订单
    const order = await Order.create({
      user: req.user._id,
      orderItems: processedOrderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice: totalPrice + taxPrice + shippingPrice,
      currency: processedOrderItems[0]?.currency || 'USD'
    });

    // 更新产品库存
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      product.salesCount += item.quantity;
      await product.save();
    }

    // 清空购物车
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取订单列表
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    
    // 普通用户只能查看自己的订单
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    
    // 按状态筛选
    if (status) {
      query.status = status;
    }
    
    // 计算总数
    const total = await Order.countDocuments(query);
    
    // 获取订单列表
    const orders = await Order.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.status(200).json({
      success: true,
      orders,
      page: parseInt(page, 10),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取单个订单详情
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username email');
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    // 验证权限：只能查看自己的订单或管理员可以查看所有订单
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权查看此订单' });
    }
    
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    更新订单状态
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, shippingCompany } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    // 更新订单状态
    if (status) {
      order.status = status;
      
      // 根据状态更新相关字段
      if (status === 'delivered' && !order.isDelivered) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
    }
    
    // 更新物流信息
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (shippingCompany) order.shippingCompany = shippingCompany;
    
    await order.save();
    
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    取消订单
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    // 验证权限
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权取消此订单' });
    }
    
    // 检查订单状态，只有待处理或处理中的订单可以取消
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ message: '当前状态的订单无法取消' });
    }
    
    // 更新订单状态
    order.status = 'cancelled';
    await order.save();
    
    // 恢复产品库存
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      product.stock += item.quantity;
      product.salesCount -= item.quantity;
      await product.save();
    }
    
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};