import Router from 'koa-router';
const router = new Router();

import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  addReview 
} from '../controllers/productController.js';

import { protect, authorize } from '../middleware/auth.js';

// 获取所有产品（公开）
router.get('/', getProducts);

// 获取单个产品详情（公开）
router.get('/:id', getProductById);

// 添加产品评论（需要登录）
router.post('/:id/reviews', protect, addReview);

// 创建产品（需要卖家或管理员权限）
router.post('/', protect, authorize('seller', 'admin'), createProduct);

// 更新产品（需要卖家或管理员权限）
router.put('/:id', protect, authorize('seller', 'admin'), updateProduct);

// 删除产品（需要卖家或管理员权限）
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

export default router;