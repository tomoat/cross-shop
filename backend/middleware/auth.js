import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 保护路由的中间件
export const protect = async (ctx, next) => {
  let token;

  // 检查Authorization头
  const authorization = ctx.headers.authorization;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // 提取token
      token = authorization.split(' ')[1];

      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 获取用户信息（不包含密码）
      ctx.state.user = await User.findById(decoded.id).select('-password');

      await next();
    } catch (error) {
      ctx.status = 401;
      ctx.body = { message: '未授权，请重新登录' };
    }
  } else {
    ctx.status = 401;
    ctx.body = { message: '未提供认证令牌' };
  }
};

// 角色权限控制中间件
export const authorize = (...roles) => {
  return async (ctx, next) => {
    if (!ctx.state.user) {
      ctx.status = 401;
      ctx.body = { message: '未授权，请重新登录' };
      return;
    }
    
    if (!roles.includes(ctx.state.user.role)) {
      ctx.status = 403;
      ctx.body = {
        message: `角色 ${ctx.state.user.role} 无权访问此资源`
      };
      return;
    }
    
    await next();
  };
};

// 验证用户是否为资源所有者
export const isOwner = (resource, idField = '_id') => {
  return async (ctx, next) => {
    try {
      const item = await resource.findById(ctx.params.id);
      
      if (!item) {
        ctx.status = 404;
        ctx.body = { message: '资源不存在' };
        return;
      }
      
      // 检查用户是否为管理员或资源所有者
      if (item.user.toString() !== ctx.state.user.id && ctx.state.user.role !== 'admin') {
        ctx.status = 403;
        ctx.body = { message: '无权操作此资源' };
        return;
      }
      
      // 将资源存储在state中以便控制器使用
      ctx.state.resource = item;
      
      await next();
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: '服务器错误' };
    }
  };
};