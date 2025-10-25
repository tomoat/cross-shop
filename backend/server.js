import Koa from 'koa';
import dotenv from 'dotenv';
import cors from '@koa/cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import connectDB from './config/db.js';
import routes from './routes/index.js';

// 加载环境变量
dotenv.config();

const app = new Koa();

// 连接数据库
connectDB();

// 配置CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  headers: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
};

// 应用CORS中间件，使用@koa/cors替代generator风格的koa-cors
app.use(cors({
  origin: (ctx) => {
    // 检查请求源是否在允许列表中
    const origin = ctx.request.header.origin;
    if (corsOptions.origin.includes(origin)) {
      return origin;
    }
    return corsOptions.origin[0]; // 默认返回第一个允许的源
  },
  allowMethods: corsOptions.methods,
  allowHeaders: corsOptions.headers,
  credentials: corsOptions.credentials
}));

// 解析请求体
app.use(bodyParser());

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 提供静态文件访问
app.use(serve(path.join(__dirname, 'uploads')));

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err.stack);
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.status === 404 ? '请求的资源不存在' : '服务器错误',
      error: err.message
    };
  }
});

// 使用路由
app.use(routes.routes());
app.use(routes.allowedMethods());

// 启动服务器
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  process.exit(1);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (err) => {
  console.error('未处理的Promise拒绝:', err);
  process.exit(1);
});