import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview } from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const productRoutes = async (fastify, options) => {
  // 获取所有产品
  fastify.get('/', getProducts);
  
  // 获取单个产品详情
  fastify.get('/:id', getProductById);
  
  // 添加产品评论
  fastify.post('/:id/reviews', {
    preHandler: protect
  }, addReview);
  
  // 创建新产品（管理员）
  fastify.post('/', {
    preHandler: [protect, admin, upload.single('images')]
  }, createProduct);
  
  // 更新产品（管理员）
  fastify.put('/:id', {
    preHandler: [protect, admin, upload.single('images')]
  }, updateProduct);
  
  // 删除产品（管理员）
  fastify.delete('/:id', {
    preHandler: [protect, admin]
  }, deleteProduct);
};

export default productRoutes;