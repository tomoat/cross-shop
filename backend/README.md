# 跨境商城后端系统

## 项目简介

这是一个基于Koa.js开发的跨境电商平台后端系统，提供完整的RESTful API接口，支持用户认证、产品管理、订单处理、购物车管理等核心功能。系统采用MongoDB作为数据存储，使用JWT进行身份认证，支持文件上传和多角色权限管理。

## 技术栈

- **核心框架**: Koa.js 2.15.3
- **数据库**: MongoDB 7.x + Mongoose 7.6.3
- **身份认证**: JWT (jsonwebtoken 9.0.2)
- **路由管理**: koa-router 12.0.1
- **请求解析**: koa-bodyparser 4.4.1
- **文件上传**: @koa/multer 3.0.2
- **CORS支持**: @koa/cors 5.0.0
- **静态文件**: koa-static 5.0.0
- **环境配置**: dotenv 16.3.1
- **密码加密**: bcryptjs 2.4.3
- **开发工具**: nodemon 3.0.1

## 功能特性

### 用户管理
- 用户注册与登录
- 个人信息管理
- 密码重置
- 用户角色管理（普通用户、管理员、卖家）
- JWT令牌生成与验证

### 产品管理
- 产品CRUD操作
- 产品分类管理
- 产品搜索与筛选
- 产品图片上传
- 产品库存管理

### 订单管理
- 订单创建与查询
- 订单状态更新
- 订单历史记录
- 订单详情查看

### 购物车管理
- 添加/删除/更新购物车商品
- 购物车商品数量调整
- 购物车总价计算
- 用户购物车持久化存储

### 地址管理
- 收货地址CRUD操作
- 设置默认地址
- 地址验证

### 支付系统
- 支付接口预留
- 支付状态管理

### 文件管理
- 图片上传
- 静态资源访问
- 文件类型验证

## 项目结构

```
backend/
├── config/           # 配置文件
│   └── db.js         # 数据库连接配置
├── controllers/      # 控制器
│   ├── addressController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── fileController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── productController.js
│   └── userController.js
├── middleware/       # 中间件
│   ├── auth.js       # 认证中间件
│   └── upload.js     # 文件上传中间件
├── models/           # 数据模型
│   ├── Address.js
│   ├── Cart.js
│   ├── Category.js
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── routes/           # 路由配置
│   ├── addressRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── fileRoutes.js
│   ├── index.js      # 路由入口
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── uploads/          # 上传文件存储目录
├── .env              # 环境变量配置
├── package.json      # 项目配置
├── pnpm-lock.yaml
└── server.js         # 服务器入口文件
```

## 安装与运行

### 环境要求
- Node.js 16.x 或更高版本
- MongoDB 4.x 或更高版本
- npm, yarn 或 pnpm

### 配置环境变量

在项目根目录创建 `.env` 文件，配置以下环境变量：

```dotenv
# 数据库连接信息
MONGO_URI=mongodb://localhost:27017/cross-shop

# 服务器配置
PORT=5000

# JWT密钥
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# CORS配置
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 安装依赖

```bash
# 使用pnpm（推荐）
pnpm install

# 或使用npm
npm install

# 或使用yarn
yarn install
```

### 开发环境运行

```bash
# 使用pnpm
pnpm dev

# 或使用npm
npm run dev

# 或使用yarn
yarn dev
```

服务器启动后，默认运行在 http://localhost:5000

### 生产环境运行

```bash
# 使用pnpm
pnpm start

# 或使用npm
npm start

# 或使用yarn
yarn start
```

## API接口文档

### 健康检查
- **GET** `/health` - 服务健康状态检查

### 用户相关API
- **POST** `/api/users/register` - 用户注册
- **POST** `/api/users/login` - 用户登录
- **GET** `/api/users/profile` - 获取用户信息（需要认证）
- **PUT** `/api/users/profile` - 更新用户信息（需要认证）
- **POST** `/api/users/logout` - 用户登出

### 产品相关API
- **GET** `/api/products` - 获取产品列表（支持筛选和分页）
- **GET** `/api/products/:id` - 获取产品详情
- **POST** `/api/products` - 创建产品（需要管理员/卖家权限）
- **PUT** `/api/products/:id` - 更新产品（需要管理员/卖家权限）
- **DELETE** `/api/products/:id` - 删除产品（需要管理员/卖家权限）

### 分类相关API
- **GET** `/api/categories` - 获取分类列表
- **POST** `/api/categories` - 创建分类（需要管理员权限）
- **GET** `/api/categories/:id` - 获取分类详情
- **PUT** `/api/categories/:id` - 更新分类（需要管理员权限）
- **DELETE** `/api/categories/:id` - 删除分类（需要管理员权限）

### 购物车相关API
- **GET** `/api/cart` - 获取用户购物车（需要认证）
- **POST** `/api/cart` - 添加商品到购物车（需要认证）
- **PUT** `/api/cart/:itemId` - 更新购物车商品数量（需要认证）
- **DELETE** `/api/cart/:itemId` - 从购物车移除商品（需要认证）
- **DELETE** `/api/cart` - 清空购物车（需要认证）

### 订单相关API
- **GET** `/api/orders` - 获取用户订单列表（需要认证）
- **GET** `/api/orders/:id` - 获取订单详情（需要认证）
- **POST** `/api/orders` - 创建订单（需要认证）
- **PUT** `/api/orders/:id` - 更新订单状态（需要管理员/卖家权限）

### 地址相关API
- **GET** `/api/addresses` - 获取用户地址列表（需要认证）
- **POST** `/api/addresses` - 添加新地址（需要认证）
- **PUT** `/api/addresses/:id` - 更新地址（需要认证）
- **DELETE** `/api/addresses/:id` - 删除地址（需要认证）
- **PUT** `/api/addresses/:id/default` - 设置默认地址（需要认证）

### 支付相关API
- **POST** `/api/payments/process` - 处理支付（需要认证）
- **GET** `/api/payments/config` - 获取支付配置

### 文件上传API
- **POST** `/api/files/upload` - 上传文件（支持图片等）

## 数据模型

### User 模型
- `name`: 用户名
- `email`: 邮箱（唯一）
- `password`: 密码（加密存储）
- `role`: 用户角色（user/admin/seller）
- `avatar`: 头像URL
- `phone`: 电话号码
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### Product 模型
- `name`: 产品名称
- `description`: 产品描述
- `price`: 价格
- `category`: 分类ID
- `images`: 图片URL数组
- `stock`: 库存数量
- `rating`: 评分
- `reviews`: 评价数量
- `seller`: 卖家ID
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### Order 模型
- `user`: 用户ID
- `orderItems`: 订单项数组
- `shippingAddress`: 收货地址
- `paymentMethod`: 支付方式
- `paymentResult`: 支付结果
- `totalPrice`: 订单总价
- `status`: 订单状态
- `isPaid`: 是否已支付
- `paidAt`: 支付时间
- `isDelivered`: 是否已发货
- `deliveredAt`: 发货时间
- `createdAt`: 创建时间

### Cart 模型
- `user`: 用户ID
- `items`: 购物车商品数组
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

## 认证与授权

### JWT认证流程
1. 用户登录成功后，服务器生成JWT令牌
2. 客户端存储令牌（通常在Cookie中）
3. 后续请求通过Authorization header携带令牌：`Bearer {token}`
4. 服务器验证令牌有效性和用户权限

### 权限控制
- **普通用户**：只能访问和管理自己的订单、购物车、地址等
- **卖家**：可以管理自己的产品和订单
- **管理员**：拥有全部权限，可以管理所有资源

## 安全措施

- 密码使用bcryptjs加密存储
- 使用JWT进行身份认证，支持令牌过期
- 实现CORS配置，限制跨域访问
- 输入验证和参数检查
- 文件上传类型和大小限制
- 错误处理和日志记录

## 部署说明

### Docker部署（推荐）

可以使用Docker Compose进行容器化部署，包含MongoDB和Node.js服务。

### 传统部署

1. 安装Node.js和MongoDB
2. 克隆代码库
3. 配置环境变量
4. 安装依赖
5. 启动MongoDB服务
6. 启动Node.js应用

## 性能优化

- 数据库索引优化
- 路由中间件分层
- 错误处理优化
- 请求日志记录
- 静态文件缓存

## 待开发功能

- 支付集成（支付宝、PayPal等）
- 库存管理优化
- 产品评价系统
- 搜索功能增强
- 数据分析和统计
- 消息通知系统

## 许可证

MIT License