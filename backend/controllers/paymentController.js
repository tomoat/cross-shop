import Order from '../models/Order.js';

// 注意：这里是模拟支付处理，实际应用中需要集成真实的支付网关

// @desc    创建支付意向
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // 验证订单是否存在且属于当前用户
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    if (order.isPaid) {
      return res.status(400).json({ message: '订单已经支付' });
    }
    
    // TODO: 集成真实的支付网关（如Stripe、PayPal等）
    // 这里是模拟支付意向创建
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      amount: order.totalPrice * 100, // 通常支付网关需要金额乘以100（分）
      currency: order.currency,
      status: 'requires_payment_method',
      client_secret: `cs_test_${Math.random().toString(36).substring(2, 15)}`,
      created_at: Date.now()
    };
    
    // 保存支付意向ID到订单
    order.paymentIntentId = paymentIntent.id;
    await order.save();
    
    res.status(200).json({
      success: true,
      paymentIntent
    });
  } catch (error) {
    res.status(500).json({ message: '创建支付意向失败', error: error.message });
  }
};

// @desc    处理支付回调
// @route   POST /api/payments/webhook
// @access  Public (来自支付网关)
export const handleWebhook = async (req, res) => {
  try {
    // TODO: 实际应用中，需要验证webhook签名
    const event = req.body;
    
    // 根据事件类型处理不同的支付状态
    switch (event.type) {
      case 'payment_intent.succeeded': {
        // 支付成功
        const { id: paymentIntentId, metadata } = event.data.object;
        
        // 更新订单状态
        const order = await Order.findOne({ paymentIntentId });
        if (order) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.status = 'processing';
          order.paymentResult = {
            id: paymentIntentId,
            status: 'succeeded',
            update_time: new Date().toISOString(),
            email_address: event.data.object.receipt_email || order.user.email
          };
          await order.save();
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        // 支付失败
        const { id: paymentIntentId } = event.data.object;
        
        // 更新订单状态
        const order = await Order.findOne({ paymentIntentId });
        if (order) {
          order.status = 'payment_failed';
          await order.save();
        }
        break;
      }
      default:
        // 其他事件类型
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: 'Webhook处理失败' });
  }
};

// @desc    验证支付状态
// @route   GET /api/payments/:orderId/status
// @access  Private
export const verifyPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // 验证订单是否存在且属于当前用户
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    // TODO: 实际应用中，这里应该调用支付网关的API来验证最新的支付状态
    // 这里返回订单中的支付状态
    res.status(200).json({
      success: true,
      orderId: order._id,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      paymentMethod: order.paymentMethod,
      paymentResult: order.paymentResult,
      status: order.status
    });
  } catch (error) {
    res.status(500).json({ message: '验证支付状态失败', error: error.message });
  }
};

// @desc    申请退款
// @route   POST /api/payments/:orderId/refund
// @access  Private
export const requestRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    // 验证订单是否存在且属于当前用户
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    if (!order.isPaid) {
      return res.status(400).json({ message: '未支付的订单无法退款' });
    }
    
    if (order.status === 'refunded') {
      return res.status(400).json({ message: '订单已经退款' });
    }
    
    // 检查是否可以退款（根据订单状态）
    if (!['delivered', 'processing', 'shipped'].includes(order.status)) {
      return res.status(400).json({ message: '当前订单状态不允许退款' });
    }
    
    // TODO: 实际应用中，这里应该调用支付网关的退款API
    // 这里是模拟退款处理
    const refundId = `re_${Date.now()}`;
    
    // 更新订单状态
    order.status = 'refunded';
    order.refundInfo = {
      refundId,
      amount: order.totalPrice,
      reason: reason || '用户申请退款',
      requestedAt: Date.now(),
      status: 'processing'
    };
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: '退款申请已提交',
      refundId,
      order
    });
  } catch (error) {
    res.status(500).json({ message: '申请退款失败', error: error.message });
  }
};