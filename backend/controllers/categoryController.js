import Category from '../models/Category.js';

// @desc    获取所有分类
// @route   GET /api/categories
// @access  Public
export const getCategories = async (ctx) => {
  try {
    const { parent, isActive, sort } = ctx.query;
    
    const query = {};
    
    if (parent === 'root') {
      query.parentCategory = null;
    } else if (parent) {
      query.parentCategory = parent;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    let sortBy = { sortOrder: 1, name: 1 };
    if (sort === 'name') {
      sortBy = { name: 1 };
    } else if (sort === 'created') {
      sortBy = { createdAt: -1 };
    }
    
    const categories = await Category.find(query)
      .populate('subcategories', 'name description icon image sortOrder isActive')
      .sort(sortBy);
    
    ctx.status = 200;
    ctx.body = {
      success: true,
      count: categories.length,
      categories
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '服务器错误', error: error.message };
  }
};

// @desc    获取单个分类
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (ctx) => {
  try {
    const category = await Category.findById(ctx.params.id)
      .populate('subcategories', 'name description icon image sortOrder isActive');
    
    if (!category) {
      ctx.status = 404;
      ctx.body = { message: '分类不存在' };
      return;
    }
    
    ctx.status = 200;
    ctx.body = { success: true, category };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '服务器错误', error: error.message };
  }
};

// @desc    创建分类
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (ctx) => {
  try {
    const { name, description, parentCategory, icon, image, sortOrder, isActive } = ctx.request.body;
    
    // 简单验证输入
    if (!name || name.trim() === '') {
      ctx.status = 400;
      ctx.body = { message: '分类名称不能为空' };
      return;
    }
    
    if (name.length > 100) {
      ctx.status = 400;
      ctx.body = { message: '分类名称长度不能超过100个字符' };
      return;
    }
    
    // 检查分类名称是否已存在
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      ctx.status = 400;
      ctx.body = { message: '分类名称已存在' };
      return;
    }
    
    // 如果有父分类，验证父分类是否存在
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        ctx.status = 400;
        ctx.body = { message: '父分类不存在' };
        return;
      }
    }
    
    const category = await Category.create({
      name,
      description,
      parentCategory: parentCategory || null,
      icon,
      image,
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    ctx.status = 201;
    ctx.body = { success: true, category };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '服务器错误', error: error.message };
  }
};

// @desc    更新分类
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (ctx) => {
  try {
    const { name, description, parentCategory, icon, image, sortOrder, isActive } = ctx.request.body;
    
    // 简单验证输入
    if (name && name.length > 100) {
      ctx.status = 400;
      ctx.body = { message: '分类名称长度不能超过100个字符' };
      return;
    }
    
    let category = await Category.findById(ctx.params.id);
    
    if (!category) {
      ctx.status = 404;
      ctx.body = { message: '分类不存在' };
      return;
    }
    
    // 检查分类名称是否已存在（排除当前分类）
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        ctx.status = 400;
        ctx.body = { message: '分类名称已存在' };
        return;
      }
    }
    
    // 如果有父分类，验证父分类是否存在且不是自身或自身的子分类
    if (parentCategory) {
      if (parentCategory === category._id.toString()) {
        ctx.status = 400;
        ctx.body = { message: '分类不能设置为自身的父分类' };
        return;
      }
      
      // 检查是否会形成循环引用
      const isChild = await checkIfChildCategory(ctx.params.id, parentCategory);
      if (isChild) {
        ctx.status = 400;
        ctx.body = { message: '不能将子分类设置为父分类，会形成循环引用' };
        return;
      }
      
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        ctx.status = 400;
        ctx.body = { message: '父分类不存在' };
        return;
      }
    }
    
    // 更新分类字段
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
    if (icon !== undefined) category.icon = icon;
    if (image !== undefined) category.image = image;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (isActive !== undefined) category.isActive = isActive;
    
    category.updatedAt = Date.now();
    
    category = await category.save();
    
    // 重新获取以包含虚拟字段
    category = await Category.findById(category._id)
      .populate('subcategories', 'name description icon image sortOrder isActive');
    
    ctx.status = 200;
    ctx.body = { success: true, category };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '服务器错误', error: error.message };
  }
};

// @desc    删除分类
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (ctx) => {
  try {
    const category = await Category.findById(ctx.params.id);
    
    if (!category) {
      ctx.status = 404;
      ctx.body = { message: '分类不存在' };
      return;
    }
    
    // 检查是否有子分类
    const subcategories = await Category.find({ parentCategory: ctx.params.id });
    if (subcategories.length > 0) {
      ctx.status = 400;
      ctx.body = { message: '请先删除该分类下的所有子分类' };
      return;
    }
    
    // 检查是否有产品使用此分类
    const products = await Category.model('Product').countDocuments({ category: ctx.params.id });
    if (products > 0) {
      ctx.status = 400;
      ctx.body = { message: '该分类下还有产品，无法删除' };
      return;
    }
    
    await category.remove();
    
    ctx.status = 200;
    ctx.body = { success: true, message: '分类已删除' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '服务器错误', error: error.message };
  }
};

// 辅助函数：检查一个分类是否是另一个分类的子分类（防止循环引用）
async function checkIfChildCategory(parentId, childId) {
  const category = await Category.findById(childId);
  if (!category) return false;
  if (category.parentCategory === null) return false;
  if (category.parentCategory.toString() === parentId) return true;
  return await checkIfChildCategory(parentId, category.parentCategory);
}