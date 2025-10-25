import Product from '../models/Product.js';

// @desc    获取所有产品
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, keyword, page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    
    const query = {};
    
    // 按类别筛选
    if (category) {
      query.category = category;
    }
    
    // 关键词搜索
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    // 计算总数
    const total = await Product.countDocuments(query);
    
    // 获取产品列表
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('seller', 'username')
      .sort({ [sort]: order })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.status(200).json({
      success: true,
      products,
      page: parseInt(page, 10),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取单个产品详情
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('seller', 'username email');
    
    if (!product) {
      return res.status(404).json({ message: '产品不存在' });
    }
    
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    创建新产品
// @route   POST /api/products
// @access  Private (Seller/Admin)
export const createProduct = async (req, res) => {
  try {
    // 输入验证已在路由层处理
    
    // 确保用户是卖家或管理员
    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权创建产品' });
    }
    
    const { name, description, price, category, images, stock, shippingInfo } = req.body;
    
    // 创建产品
    const product = await Product.create({
      name,
      description,
      price,
      category,
      seller: req.user._id,
      images: images || [],
      stock: stock || 0,
      shippingInfo: shippingInfo || {}
    });
    
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    更新产品
// @route   PUT /api/products/:id
// @access  Private (Seller/Admin)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, stock, shippingInfo, isActive } = req.body;
    
    // 查找产品
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: '产品不存在' });
    }
    
    // 验证权限
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权更新此产品' });
    }
    
    // 更新产品字段
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (images !== undefined) product.images = images;
    if (stock !== undefined) product.stock = stock;
    if (shippingInfo !== undefined) product.shippingInfo = shippingInfo;
    if (isActive !== undefined) product.isActive = isActive;
    
    product.updatedAt = Date.now();
    
    product = await product.save();
    
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    删除产品
// @route   DELETE /api/products/:id
// @access  Private (Seller/Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: '产品不存在' });
    }
    
    // 验证权限
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权删除此产品' });
    }
    
    await product.remove();
    
    res.status(200).json({ success: true, message: '产品已删除' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    添加产品评论
// @route   POST /api/products/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // 验证评分
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: '评分必须在1-5之间' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: '产品不存在' });
    }
    
    // 检查用户是否已经评论过
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: '您已经评论过此产品' });
    }
    
    // 添加新评论
    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
      createdAt: Date.now()
    };
    
    product.reviews.push(review);
    
    // 保存产品
    await product.save();
    
    res.status(201).json({ success: true, message: '评论已添加' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};