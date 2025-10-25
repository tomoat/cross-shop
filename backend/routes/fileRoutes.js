import Router from 'koa-router';
const router = new Router();

import {
  uploadProductImages,
  uploadUserAvatar,
  deleteFile,
  getFileList
} from '../controllers/fileController.js';

import { protect, authorize } from '../middleware/auth.js';
import { uploadProductImages as uploadProductMulter, uploadUserAvatar as uploadAvatarMulter } from '../middleware/upload.js';

// 上传产品图片（需要卖家或管理员权限）
router.post('/products', 
  protect, 
  authorize('seller', 'admin'), 
  uploadProductMulter.array('images'), 
  uploadProductImages
);

// 上传用户头像（需要登录）
router.post('/avatar', 
  protect, 
  uploadAvatarMulter.single('avatar'), 
  uploadUserAvatar
);

// 删除文件（根据类型判断权限）
router.delete('/:type/:filename', protect, deleteFile);

// 获取文件列表（需要管理员权限）
router.get('/:type', protect, authorize('admin'), getFileList);

export default router;