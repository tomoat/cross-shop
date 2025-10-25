# 跨境商城前端系统

## 项目简介

这是一个现代化的跨境电商平台前端系统，基于React 19开发，提供完整的购物体验，包括产品浏览、搜索、购物车管理、下单结算、用户认证等功能。系统支持多角色（普通用户、管理员、卖家），拥有响应式设计，适配各种设备屏幕。

## 技术栈

- **核心框架**: React 19.1.1
- **构建工具**: Vite 7.1.7
- **路由管理**: React Router 6.21.1
- **状态管理**: React Context API
- **UI组件库**: Ant Design 5.11.5
- **HTTP客户端**: Axios 1.6.2
- **数据请求**: React Query 5.28.4
- **表单处理**: React Hook Form 7.49.2
- **认证处理**: JWT Decode 4.0.0, JS Cookie 3.0.5
- **样式处理**: CSS Modules
- **代码规范**: ESLint

## 功能特性

### 用户功能
- 用户注册与登录
- 个人信息管理
- 地址管理
- 订单历史查看
- 购物车管理
- 收藏夹功能（预留）

### 产品功能
- 产品列表展示
- 产品详情查看
- 产品分类浏览
- 产品搜索与筛选
- 轮播图推荐
- 热门商品展示

### 购物功能
- 购物车添加/删除/更新
- 购物车商品数量调整
- 购物车总价计算
- 多地址选择
- 订单提交
- 支付流程（预留接口）

### 管理功能
- 管理员后台（路由已配置，待实现）
- 卖家后台（路由已配置，待实现）
- 角色权限控制

## 项目结构

```
src/
├── assets/          # 静态资源文件
├── components/      # 公共组件
│   ├── Footer.jsx   # 页脚组件
│   ├── Navbar.jsx   # 导航栏组件
│   └── routes/      # 路由相关组件
├── context/         # 上下文管理
│   ├── AuthContext.jsx  # 认证上下文
│   └── useAuth.js       # 认证Hook
├── pages/           # 页面组件
│   ├── admin/       # 管理员页面
│   ├── Home.jsx     # 首页
│   ├── ProductList.jsx  # 产品列表页
│   ├── ProductDetail.jsx # 产品详情页
│   ├── Cart.jsx     # 购物车页面
│   ├── Checkout.jsx # 结算页面
│   ├── Login.jsx    # 登录页面
│   ├── Register.jsx # 注册页面
│   ├── Profile.jsx  # 个人中心
│   └── OrderDetail.jsx  # 订单详情
├── styles/          # 样式文件
├── utils/           # 工具函数
│   ├── api.js       # API请求封装
│   ├── routes.jsx   # 路由配置
│   └── animations.js # 动画效果
├── App.jsx          # 应用入口组件
├── main.jsx         # 主入口文件
└── index.css        # 全局样式
```

## 安装与运行

### 环境要求
- Node.js 16.x 或更高版本
- npm, yarn 或 pnpm

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

运行后，访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
# 使用pnpm
pnpm build

# 或使用npm
npm run build

# 或使用yarn
yarn build
```

构建后的文件将输出到 `dist` 目录。

### 代码规范检查

```bash
# 使用pnpm
pnpm lint

# 或使用npm
npm run lint

# 或使用yarn
yarn lint
```

## API接口对接

前端系统通过Axios与后端API进行通信，主要API路径如下：

- 用户相关: `/api/users/*`
- 产品相关: `/api/products/*`
- 订单相关: `/api/orders/*`
- 购物车相关: `/api/cart/*`
- 分类相关: `/api/categories/*`
- 地址相关: `/api/addresses/*`
- 支付相关: `/api/payments/*`

详细的API接口定义请参考后端文档。

## 认证机制

系统使用JWT（JSON Web Token）进行用户认证，认证流程如下：

1. 用户登录成功后，后端返回JWT token
2. 前端将token存储在Cookie中
3. 后续请求通过Authorization header携带token
4. 通过AuthContext管理用户登录状态和权限

## 响应式设计

系统采用响应式设计，适配以下屏幕尺寸：

- 桌面端: 1024px及以上
- 平板端: 768px - 1023px
- 移动端: 480px及以下

## 优化措施

- **代码分割**: 使用React.lazy和Suspense实现组件懒加载
- **图片优化**: 支持响应式图片（待实现）
- **性能优化**: 使用React Query缓存API请求
- **动画效果**: 添加适当的过渡动画提升用户体验

## 待开发功能

- 产品评价系统
- 支付集成
- 多语言支持
- 深色模式
- 更多管理功能

## 许可证

MIT License
