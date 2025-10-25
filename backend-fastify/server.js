import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// 加载环境变量
dotenv.config();

// 获取当前文件和目录的路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建Fastify实例
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  }
});

// 连接数据库
connectDB();

// 配置CORS
fastify.register(cors, {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
});

// 配置文件上传
fastify.register(multipart, {
  limits: {
    fileSize: 10485760, // 10MB
    files: 10
  }
});

// 配置静态文件服务
fastify.register(staticPlugin, {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/'
});

// 注册路由
fastify.register(userRoutes, {
  prefix: '/api/users'
});

fastify.register(productRoutes, {
  prefix: '/api/products'
});

fastify.register(categoryRoutes, {
  prefix: '/api/categories'
});

fastify.register(orderRoutes, {
  prefix: '/api/orders'
});

fastify.register(cartRoutes, {
  prefix: '/api/cart'
});

// 健康检查端点
fastify.get('/api/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'cross-shop-backend'
  };
});

// 404处理
fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    error: 'Not Found',
    message: `Route ${request.url} not found`
  });
});

// 错误处理
fastify.setErrorHandler((error, request, reply) => {
  // 记录错误
  fastify.log.error(error);
  
  // 返回适当的错误响应
  reply.status(error.statusCode || 500).send({
    error: error.name || 'Internal Server Error',
    message: error.message || 'Something went wrong'
  });
});

// 启动服务器
const start = async () => {
  try {
    const port = process.env.PORT || 5000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    fastify.log.info(`Server running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGINT', async () => {
  fastify.log.info('Shutting down server...');
  await fastify.close();
  process.exit(0);
});

// 启动应用
start();

export default fastify;