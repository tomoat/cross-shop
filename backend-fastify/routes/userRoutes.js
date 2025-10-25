import { registerUser, loginUser, getMe, updateUser, changePassword, getUsers, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const userRoutes = async (fastify, options) => {
  // 注册用户
  fastify.post('/register', registerUser);
  
  // 用户登录
  fastify.post('/login', loginUser);
  
  // 获取当前用户信息
  fastify.get('/profile', {
    preHandler: protect
  }, getMe);
  
  // 更新用户信息
  fastify.put('/profile', {
    preHandler: protect
  }, updateUser);
  
  // 更改密码
  fastify.put('/password', {
    preHandler: protect
  }, changePassword);
  
  // 获取所有用户（管理员）
  fastify.get('/', {
    preHandler: [protect, admin]
  }, getUsers);
  
  // 删除用户（管理员）
  fastify.delete('/:id', {
    preHandler: [protect, admin]
  }, deleteUser);
};

export default userRoutes;