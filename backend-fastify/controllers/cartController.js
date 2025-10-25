import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// 获取用户购物车
const getCart = async (request, reply) => {
  try {
    const cart = await Cart.findOne({ user: request.user.id })
      .populate('items.product', 'name price discountPrice images ratings');
    
    if (cart) {
      // 计算购物车总价和选中商品的总价
      let totalPrice = 0;
      let selectedPrice = 0;
      let totalItems = 0;
      let selectedItems = 0;
      
      cart.items.forEach(item => {
        const itemPrice = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
        totalPrice += itemPrice * item.quantity;
        totalItems += item.quantity;
        
        if (item.selected) {
          selectedPrice += itemPrice * item.quantity;
          selectedItems += item.quantity;
        }
      });
      
      reply.send({
        ...cart._doc,
        totalPrice,
        selectedPrice,
        totalItems,
        selectedItems
      });
    } else {
      // 如果没有购物车，返回空购物车
      reply.send({
        user: request.user.id,
        items: [],
        totalPrice: 0,
        selectedPrice: 0,
        totalItems: 0,
        selectedItems: 0
      });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 添加商品到购物车
const addToCart = async (request, reply) => {
  try {
    const { productId, quantity = 1, selected = true } = request.body;
    
    // 检查产品是否存在
    const product = await Product.findById(productId);
    if (!product) {
      return reply.status(404).send({ message: '产品不存在' });
    }
    
    // 检查库存
    if (product.quantity < quantity) {
      return reply.status(400).send({ message: '库存不足' });
    }
    
    // 查找或创建购物车
    let cart = await Cart.findOne({ user: request.user.id });
    
    if (!cart) {
      // 创建新购物车
      cart = new Cart({
        user: request.user.id,
        items: [{
          product: productId,
          quantity,
          selected
        }]
      });
    } else {
      // 检查商品是否已在购物车中
      const itemIndex = cart.items.findIndex(item => 
        item.product.toString() === productId
      );
      
      if (itemIndex > -1) {
        // 更新数量
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (product.quantity < newQuantity) {
          return reply.status(400).send({ message: '库存不足' });
        }
        cart.items[itemIndex].quantity = newQuantity;
        cart.items[itemIndex].selected = selected;
      } else {
        // 添加新商品
        cart.items.push({
          product: productId,
          quantity,
          selected
        });
      }
    }
    
    const updatedCart = await cart.save();
    reply.status(201).send(updatedCart);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 更新购物车商品
const updateCartItem = async (request, reply) => {
  try {
    const { quantity, selected } = request.body;
    const { itemId } = request.params;
    
    const cart = await Cart.findOne({ user: request.user.id });
    
    if (!cart) {
      return reply.status(404).send({ message: '购物车不存在' });
    }
    
    // 查找购物车中的商品
    const itemIndex = cart.items.findIndex(item => 
      item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
      return reply.status(404).send({ message: '购物车中没有此商品' });
    }
    
    // 检查库存
    if (quantity !== undefined) {
      const product = await Product.findById(cart.items[itemIndex].product);
      if (product.quantity < quantity) {
        return reply.status(400).send({ message: '库存不足' });
      }
      cart.items[itemIndex].quantity = quantity;
    }
    
    // 更新选中状态
    if (selected !== undefined) {
      cart.items[itemIndex].selected = selected;
    }
    
    const updatedCart = await cart.save();
    reply.send(updatedCart);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 删除购物车商品
const removeCartItem = async (request, reply) => {
  try {
    const { itemId } = request.params;
    
    const cart = await Cart.findOne({ user: request.user.id });
    
    if (!cart) {
      return reply.status(404).send({ message: '购物车不存在' });
    }
    
    // 过滤掉要删除的商品
    cart.items = cart.items.filter(item => 
      item._id.toString() !== itemId
    );
    
    const updatedCart = await cart.save();
    reply.send(updatedCart);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 清空购物车
const clearCart = async (request, reply) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: request.user.id },
      { items: [] },
      { new: true }
    );
    
    if (!cart) {
      return reply.status(404).send({ message: '购物车不存在' });
    }
    
    reply.send(cart);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 选择/取消选择所有商品
const toggleSelectAll = async (request, reply) => {
  try {
    const { selected } = request.body;
    
    const cart = await Cart.findOne({ user: request.user.id });
    
    if (!cart) {
      return reply.status(404).send({ message: '购物车不存在' });
    }
    
    // 更新所有商品的选中状态
    cart.items.forEach(item => {
      item.selected = selected;
    });
    
    const updatedCart = await cart.save();
    reply.send(updatedCart);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 获取购物车选中的商品
const getSelectedItems = async (request, reply) => {
  try {
    const cart = await Cart.findOne({ user: request.user.id })
      .populate('items.product', 'name price discountPrice images ratings');
    
    if (!cart) {
      return reply.send({ items: [], totalPrice: 0, totalItems: 0 });
    }
    
    // 过滤出选中的商品
    const selectedItems = cart.items.filter(item => item.selected);
    
    // 计算总价和总数量
    let totalPrice = 0;
    let totalItems = 0;
    
    selectedItems.forEach(item => {
      const itemPrice = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
      totalPrice += itemPrice * item.quantity;
      totalItems += item.quantity;
    });
    
    reply.send({
      items: selectedItems,
      totalPrice,
      totalItems
    });
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  toggleSelectAll,
  getSelectedItems
};