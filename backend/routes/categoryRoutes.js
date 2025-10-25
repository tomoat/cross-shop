import Router from 'koa-router';
const router = new Router();

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

import { protect, authorize } from '../middleware/auth.js';

// 获取分类列表（公开）
router.get('/', getCategories);

// 获取单个分类详情（公开）
router.get('/:id', getCategoryById);

// 创建分类（需要管理员权限）
router.post('/', protect, authorize('admin'), createCategory);

// 更新分类（需要管理员权限）
router.put('/:id', protect, authorize('admin'), updateCategory);

// 删除分类（需要管理员权限）
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;