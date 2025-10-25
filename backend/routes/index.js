import Router from 'koa-router';
const router = new Router();

// 导入路由模块
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import cartRoutes from './cartRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import addressRoutes from './addressRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import fileRoutes from './fileRoutes.js';

// 挂载路由
router.use('/api/users', userRoutes.routes(), userRoutes.allowedMethods());
router.use('/api/products', productRoutes.routes(), productRoutes.allowedMethods());
router.use('/api/orders', orderRoutes.routes(), orderRoutes.allowedMethods());
router.use('/api/cart', cartRoutes.routes(), cartRoutes.allowedMethods());
router.use('/api/categories', categoryRoutes.routes(), categoryRoutes.allowedMethods());
router.use('/api/addresses', addressRoutes.routes(), addressRoutes.allowedMethods());
router.use('/api/payments', paymentRoutes.routes(), paymentRoutes.allowedMethods());
router.use('/api/files', fileRoutes.routes(), fileRoutes.allowedMethods());

// 健康检查路由
router.get('/health', async (ctx) => {
  ctx.status = 200;
  ctx.body = { status: 'ok', message: '服务运行正常' };
});

export default router;