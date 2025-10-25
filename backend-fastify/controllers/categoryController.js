import Category from '../models/Category.js';
import Product from '../models/Product.js';

// 获取所有分类
const getCategories = async (request, reply) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    reply.send(categories);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 获取单个分类详情
const getCategoryById = async (request, reply) => {
  try {
    const category = await Category.findById(request.params.id);
    
    if (category) {
      reply.send(category);
    } else {
      reply.status(404).send({ message: '分类不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 创建新分类（管理员）
const createCategory = async (request, reply) => {
  try {
    const { name, description, parent, icon } = request.body;
    
    // 检查分类名称是否已存在
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return reply.status(400).send({ message: '分类名称已存在' });
    }
    
    // 创建分类
    const category = new Category({
      name,
      description,
      parent,
      icon,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    });
    
    const createdCategory = await category.save();
    reply.status(201).send(createdCategory);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 更新分类（管理员）
const updateCategory = async (request, reply) => {
  try {
    const { name, description, parent, icon, isActive } = request.body;
    
    const category = await Category.findById(request.params.id);
    
    if (category) {
      // 检查新名称是否已被其他分类使用
      if (name && name !== category.name) {
        const nameExists = await Category.findOne({ name, _id: { $ne: request.params.id } });
        if (nameExists) {
          return reply.status(400).send({ message: '分类名称已存在' });
        }
        category.name = name;
        category.slug = name.toLowerCase().replace(/\s+/g, '-');
      }
      
      category.description = description || category.description;
      category.parent = parent !== undefined ? parent : category.parent;
      category.icon = icon || category.icon;
      category.isActive = isActive !== undefined ? isActive : category.isActive;
      
      const updatedCategory = await category.save();
      reply.send(updatedCategory);
    } else {
      reply.status(404).send({ message: '分类不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 删除分类（管理员）
const deleteCategory = async (request, reply) => {
  try {
    const categoryId = request.params.id;
    
    // 检查是否有子分类
    const hasSubCategories = await Category.findOne({ parent: categoryId });
    if (hasSubCategories) {
      return reply.status(400).send({ message: '该分类下有子分类，无法删除' });
    }
    
    // 检查是否有产品使用此分类
    const productCount = await Product.countDocuments({ category: categoryId });
    if (productCount > 0) {
      return reply.status(400).send({ message: '该分类下有产品，无法删除' });
    }
    
    const category = await Category.findById(categoryId);
    
    if (category) {
      await category.remove();
      reply.send({ message: '分类删除成功' });
    } else {
      reply.status(404).send({ message: '分类不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 获取分类的产品
const getCategoryProducts = async (request, reply) => {
  try {
    const { page = 1, limit = 10, sort } = request.query;
    const categoryId = request.params.id;
    
    // 检查分类是否存在
    const category = await Category.findById(categoryId);
    if (!category) {
      return reply.status(404).send({ message: '分类不存在' });
    }
    
    // 构建查询条件
    const query = { category: categoryId };
    
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
    
    // 分页查询产品
    const products = await Product.find(query)
      .sort(sortBy)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('name price discountPrice images ratings');
    
    reply.send({
      category: {
        id: category._id,
        name: category.name,
        description: category.description
      },
      products,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count
    });
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 获取分类树结构
const getCategoryTree = async (request, reply) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    
    // 构建分类树
    const buildCategoryTree = (categories, parentId = null) => {
      const categoryList = [];
      const filteredCategories = categories.filter(category => category.parent == parentId);
      
      for (const category of filteredCategories) {
        categoryList.push({
          ...category._doc,
          children: buildCategoryTree(categories, category._id)
        });
      }
      
      return categoryList;
    };
    
    const categoryTree = buildCategoryTree(categories);
    reply.send(categoryTree);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  getCategoryTree
};