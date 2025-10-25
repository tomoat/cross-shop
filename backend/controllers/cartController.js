import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    获取购物车
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images');
    
    // 如果购物车不存在，创建一个空购物车
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }
    
    // 计算总金额和总数量
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    const totalItems = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
    
    res.status(200).json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        totalAmount,
        totalItems
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    添加商品到购物车
// @route   POST /api/cart/items
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedAttributes = [] } = req.body;
    
    // 验证产品
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: '产品不存在' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: '产品库存不足' });
    }
    
    // 获取或创建购物车
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }
    
    // 检查商品是否已在购物车中
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // 更新数量
      cart.items[existingItemIndex].quantity += quantity;
      
      // 确保不超过库存
      if (cart.items[existingItemIndex].quantity > product.stock) {
        return res.status(400).json({ message: '购物车数量超过库存' });
      }
    } else {
      // 添加新商品
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        currency: product.currency,
        selectedAttributes,
        addedAt: Date.now()
      });
    }
    
    await cart.save();
    
    // 重新获取购物车以包含产品详情
    cart = await Cart.findById(cart._id).populate('items.product', 'name price images');
    
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    更新购物车商品数量
// @route   PUT /api/cart/items/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;
    
    // 验证数量
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: '数量必须大于0' });
    }
    
    // 获取购物车
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: '购物车不存在' });
    }
    
    // 查找商品
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: '购物车中不存在此商品' });
    }
    
    // 验证库存
    const product = await Product.findById(cart.items[itemIndex].product);
    if (product.stock < quantity) {
      return res.status(400).json({ message: '产品库存不足' });
    }
    
    // 更新数量
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    // 重新获取购物车
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price images');
    
    res.status(200).json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    从购物车移除商品
// @route   DELETE /api/cart/items/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // 更新购物车，移除指定商品
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    ).populate('items.product', 'name price images');
    
    if (!cart) {
      return res.status(404).json({ message: '购物车不存在' });
    }
    
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    清空购物车
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    // 清空购物车
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );
    
    if (!cart) {
      return res.status(404).json({ message: '购物车不存在' });
    }
    
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};