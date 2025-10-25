import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getCategoryProducts, getCategoryTree } from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';

const categoryRoutes = async (fastify, options) => {
  // 获取所有分类
  fastify.get('/', getCategories);
  
  // 获取分类树结构
  fastify.get('/tree', getCategoryTree);
  
  // 获取单个分类详情
  fastify.get('/:id', getCategoryById);
  
  // 获取分类的产品
  fastify.get('/:id/products', getCategoryProducts);
  
  // 创建新分类（管理员）
  fastify.post('/', {
    preHandler: [protect, admin]
  }, createCategory);
  
  // 更新分类（管理员）
  fastify.put('/:id', {
    preHandler: [protect, admin]
  }, updateCategory);
  
  // 删除分类（管理员）
  fastify.delete('/:id', {
    preHandler: [protect, admin]
  }, deleteCategory);
};

export default categoryRoutes;