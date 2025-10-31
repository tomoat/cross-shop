# 跨境商城系统

## 项目概述

这是一个完整的跨境电商平台系统，提供从用户浏览商品到完成订单支付的全流程功能。系统采用现代化的前后端分离架构，包含前端React应用和两个后端服务实现（Koa和Fastify）。

## 技术栈

### 前端
- **框架**: React 19.1.1
- **构建工具**: Vite 7.1.7
- **路由**: React Router 6.21.1
- **UI组件库**: Ant Design 5.11.5
- **HTTP客户端**: Axios
- **状态管理**: Context API
- **样式**: CSS Modules

### 后端 (Koa版本)
- **运行环境**: Node.js
- **Web框架**: Koa 2.x
- **数据库**: MongoDB + Mongoose
- **认证**: JWT (JSON Web Tokens)
- **CORS**: @koa/cors
- **路由**: koa-router
- **日志**: log4js

### 后端 (Fastify版本)
- **运行环境**: Node.js
- **Web框架**: Fastify
- **数据库**: MongoDB + Mongoose
- **认证**: JWT
- **路由**: Fastify路由系统

### 后端 (NestJS版本)
- **运行环境**: Node.js
- **Web框架**: NestJS
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT + Passport.js
- **微服务**: NATS
- **API**: RESTful + GraphQL

## 功能特性

### 用户管理
- 用户注册、登录、登出
- 个人信息管理
- 地址管理
- 管理员权限控制

### 商品系统
- 商品分类管理
- 商品列表展示
- 商品详情页
- 商品搜索功能
- 商品图片上传

### 购物车
- 添加/删除商品
- 修改商品数量
- 查看购物车
- 批量操作

### 订单系统
- 创建订单
- 订单状态管理
- 订单历史查询
- 订单详情查看

### 支付系统
- 集成支付接口
- 支付状态回调

## 项目结构

```
cross-shop/
├── backend/          # Koa.js后端服务
│   ├── config/       # 配置文件
│   ├── controllers/  # 控制器
│   ├── middleware/   # 中间件
│   ├── models/       # 数据模型
│   ├── routes/       # 路由
│   └── server.js     # 服务器入口
├── backend-fastify/  # Fastify后端服务
│   ├── config/       # 配置文件
│   ├── controllers/  # 控制器
│   ├── middleware/   # 中间件
│   ├── models/       # 数据模型
│   ├── routes/       # 路由
│   ├── scripts/      # 脚本文件
│   └── server.js     # 服务器入口
├── backend-nest/     # NestJS后端服务
│   ├── src/          # 源代码
│   │   ├── modules/  # 功能模块
│   │   ├── prisma/   # Prisma配置
│   │   └── microservices/ # 微服务配置
│   ├── prisma/       # Prisma schema
│   └── main.ts       # 应用入口
└── frontend/         # React前端应用
    ├── public/       # 静态资源
    ├── src/          # 源代码
    │   ├── assets/   # 资源文件
    │   ├── components/ # 组件
    │   ├── context/  # 上下文
    │   ├── pages/    # 页面
    │   ├── styles/   # 样式
    │   └── utils/    # 工具函数
    └── vite.config.js # Vite配置
```

## 环境要求

- Node.js 18.x 或更高版本
- MongoDB 4.x 或更高版本
- pnpm 包管理器

## 安装与运行

### 前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
pnpm install

# 开发模式运行
pnpm dev

# 构建生产版本
pnpm build
```

### 后端 (Koa版本)

```bash
# 进入后端目录
cd backend

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件，设置数据库连接等信息

# 启动服务
pnpm start
```

### 后端 (Fastify版本)

```bash
# 进入Fastify后端目录
cd backend-fastify

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件，设置数据库连接等信息

# 启动服务
pnpm dev
```

### 后端 (NestJS版本)

```bash
# 进入NestJS后端目录
cd backend-nest

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件，设置数据库连接等信息

# 数据库迁移
npx prisma migrate dev --name init
npx prisma generate

# 开发模式启动
pnpm start:dev

# 生产模式启动
pnpm build
pnpm start:prod
```

## API接口文档

系统提供了完整的RESTful API接口，主要包括：

### 用户相关
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息

### 商品相关
- `GET /api/products` - 获取商品列表
- `GET /api/products/:id` - 获取商品详情
- `POST /api/products` - 新增商品（管理员）
- `PUT /api/products/:id` - 更新商品（管理员）
- `DELETE /api/products/:id` - 删除商品（管理员）

### 购物车相关
- `GET /api/cart` - 获取购物车
- `POST /api/cart` - 添加商品到购物车
- `PUT /api/cart/:itemId` - 更新购物车商品数量
- `DELETE /api/cart/:itemId` - 从购物车移除商品

### 订单相关
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情

## 数据模型

### User
- id: ObjectId
- username: String
- email: String
- password: String (加密存储)
- role: String ('user', 'admin')
- createdAt: Date
- updatedAt: Date

### Product
- id: ObjectId
- name: String
- description: String
- price: Number
- stock: Number
- category: ObjectId (关联Category)
- images: [String]
- createdAt: Date
- updatedAt: Date

### Category
- id: ObjectId
- name: String
- description: String

### Cart
- id: ObjectId
- user: ObjectId (关联User)
- items: [
  {
    product: ObjectId (关联Product),
    quantity: Number,
    price: Number
  }
]
- totalAmount: Number

### Order
- id: ObjectId
- user: ObjectId (关联User)
- items: [
  {
    product: ObjectId (关联Product),
    quantity: Number,
    price: Number
  }
]
- totalAmount: Number
- shippingAddress: Object (地址信息)
- paymentMethod: String
- orderStatus: String ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
- createdAt: Date
- updatedAt: Date

## 安全措施

- 使用JWT进行身份认证
- 密码加密存储
- 输入验证和清洗
- CORS配置
- 敏感信息通过环境变量管理

## 开发建议

1. 前后端开发可以并行进行，通过API接口规范保持对接
2. 开发时使用开发环境配置，生产环境使用正式配置
3. 建议使用Postman等工具测试API接口
4. 提交代码前执行ESLint检查

## 许可证

MIT License

## 联系信息

如有问题或建议，请联系项目维护者。