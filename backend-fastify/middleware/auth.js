import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = (request, reply, done) => {
  try {
    // 从请求头获取token
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return reply.status(401).send({ message: '未授权，请登录' });
    }
    
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 将用户信息添加到请求对象
    request.user = decoded;
    
    done();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return reply.status(401).send({ message: '无效的令牌' });
    } else if (error.name === 'TokenExpiredError') {
      return reply.status(401).send({ message: '令牌已过期' });
    }
    return reply.status(500).send({ message: '服务器错误' });
  }
};

// 验证JWT令牌
const protect = async (request, reply) => {
  let token;
  
  if (request.headers.authorization && 
      request.headers.authorization.startsWith('Bearer')) {
    try {
      // 提取令牌
      token = request.headers.authorization.split(' ')[1];
      
      // 验证令牌
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 将用户信息添加到请求对象
      request.user = await User.findById(decoded.id).select('-password');
      
      return reply.continue();
    } catch (error) {
      return reply.status(401).send({ message: '未授权，请重新登录' });
    }
  }
  
  if (!token) {
    return reply.status(401).send({ message: '未提供授权令牌' });
  }
};

// 验证管理员权限
const admin = async (request, reply) => {
  if (request.user && request.user.role === 'admin') {
    return reply.continue();
  } else {
    return reply.status(403).send({ message: '无管理员权限' });
  }
};

export { protect, admin };