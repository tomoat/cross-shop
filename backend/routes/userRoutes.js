import Router from 'koa-router';
const router = new Router();

import { 
  registerUser, 
  loginUser, 
  getMe, 
  updateProfile,
  changePassword 
} from '../controllers/userController.js';

import { protect } from '../middleware/auth.js';

// 注册路由
router.post('/register', registerUser);

// 登录路由
router.post('/login', loginUser);

// 获取当前用户信息
router.get('/me', protect, getMe);

// 更新用户信息
router.put('/me', protect, updateProfile);

// 修改密码
router.put('/change-password', protect, changePassword);

export default router;