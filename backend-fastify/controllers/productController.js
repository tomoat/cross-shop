import Product from '../models/Product.js';

// 获取所有产品
const getProducts = async (request, reply) => {
  try {
    // 解析查询参数
    const { keyword, category, brand, minPrice, maxPrice, sort, page = 1, limit = 10, featured, newArrival } = request.query;
    
    // 构建查询条件
    const query = {};
    
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (newArrival === 'true') {
      query.isNewArrival = true;
    }
    
    // 构建排序条件
    let sortBy = {};
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortBy.price = 1;
          break;
        case 'price-desc':
          sortBy.price = -1;
          break;
        case 'rating':
          sortBy.ratings = -1;
          break;
        case 'newest':
          sortBy.createdAt = -1;
          break;
        default:
          sortBy.createdAt = -1;
      }
    }
    
    // 计算总数
    const count = await Product.countDocuments(query);
    
    // 分页查询
    const products = await Product.find(query)
      .sort(sortBy)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('category', 'name');
    
    reply.send({
      products,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count
    });
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 获取单个产品详情
const getProductById = async (request, reply) => {
  try {
    const product = await Product.findById(request.params.id)
      .populate('category', 'name')
      .populate('reviews.user', 'username avatar');
    
    if (product) {
      reply.send(product);
    } else {
      reply.status(404).send({ message: '产品不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 创建新产品（管理员）
const createProduct = async (request, reply) => {
  try {
    const { name, description, price, discountPrice, quantity, category, brand, isFeatured, isNewArrival } = request.body;
    
    // 处理上传的图片
    const images = request.files?.images ? Array.isArray(request.files.images) ? 
      request.files.images.map(file => `/uploads/${file.newFilename}`) : 
      [`/uploads/${request.files.images.newFilename}`] : 
      [];
    
    const product = new Product({
      name,
      description,
      price: Number(price),
      discountPrice: Number(discountPrice) || 0,
      quantity: Number(quantity),
      category,
      brand,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
      images
    });
    
    const createdProduct = await product.save();
    reply.status(201).send(createdProduct);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 更新产品（管理员）
const updateProduct = async (request, reply) => {
  try {
    const { name, description, price, discountPrice, quantity, category, brand, isFeatured, isNewArrival } = request.body;
    
    const product = await Product.findById(request.params.id);
    
    if (product) {
      // 更新产品基本信息
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = Number(price) || product.price;
      product.discountPrice = discountPrice ? Number(discountPrice) : product.discountPrice;
      product.quantity = Number(quantity) || product.quantity;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.isFeatured = isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : product.isFeatured;
      product.isNewArrival = isNewArrival !== undefined ? (isNewArrival === 'true' || isNewArrival === true) : product.isNewArrival;
      
      // 处理新上传的图片
      if (request.files?.images) {
        const newImages = Array.isArray(request.files.images) ? 
          request.files.images.map(file => `/uploads/${file.newFilename}`) : 
          [`/uploads/${request.files.images.newFilename}`];
        product.images = [...product.images, ...newImages];
      }
      
      const updatedProduct = await product.save();
      reply.send(updatedProduct);
    } else {
      reply.status(404).send({ message: '产品不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 删除产品（管理员）
const deleteProduct = async (request, reply) => {
  try {
    const product = await Product.findById(request.params.id);
    
    if (product) {
      await product.remove();
      reply.send({ message: '产品删除成功' });
    } else {
      reply.status(404).send({ message: '产品不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 添加产品评论
const addReview = async (request, reply) => {
  try {
    const { rating, comment } = request.body;
    
    const product = await Product.findById(request.params.id);
    
    if (product) {
      // 检查用户是否已经评论过
      const alreadyReviewed = product.reviews.find(
        review => review.user.toString() === request.user.id
      );
      
      if (alreadyReviewed) {
        return reply.status(400).send({ message: '您已经评论过此产品' });
      }
      
      // 添加新评论
      const review = {
        user: request.user.id,
        rating: Number(rating),
        comment
      };
      
      product.reviews.push(review);
      
      // 更新产品评分
      product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
      
      await product.save();
      reply.status(201).send({ message: '评论添加成功' });
    } else {
      reply.status(404).send({ message: '产品不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
};