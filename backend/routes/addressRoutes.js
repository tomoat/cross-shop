import Router from 'koa-router';
const router = new Router();

import {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';

import { protect } from '../middleware/auth.js';

// 获取用户所有地址（需要登录）
router.get('/', protect, getUserAddresses);

// 获取单个地址详情（需要登录）
router.get('/:id', protect, getAddressById);

// 创建新地址（需要登录）
router.post('/', protect, createAddress);

// 更新地址（需要登录）
router.put('/:id', protect, updateAddress);

// 删除地址（需要登录）
router.delete('/:id', protect, deleteAddress);

// 设置默认地址（需要登录）
router.put('/:id/default', protect, setDefaultAddress);

export default router;