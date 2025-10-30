# Cross Shop API

一个基于NestJS的跨店铺电商平台后端API，支持用户认证、产品管理、订单处理和支付集成。

## 技术栈

- **框架**: NestJS
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT + Passport.js
- **微服务**: NATS
- **API**: RESTful + GraphQL
- **验证**: class-validator

## 功能特性

- 用户认证与授权
- 用户资料管理
- 产品CRUD操作
- 分类管理
- 订单处理（创建、查询、更新状态）
- 支付集成
- 微服务通信
- GraphQL API支持

## 目录结构

```
cross-shop/
├── src/
│   ├── modules/
│   │   ├── auth/         # 认证模块
│   │   ├── users/        # 用户模块
│   │   ├── products/     # 产品模块
│   │   ├── categories/   # 分类模块
│   │   ├── orders/       # 订单模块
│   │   └── payments/     # 支付模块
│   ├── prisma/           # Prisma配置
│   ├── microservices/    # 微服务配置
│   ├── types/            # 类型定义
│   ├── app.module.ts     # 主模块
│   ├── app.controller.ts # 主控制器
│   ├── app.service.ts    # 主服务
│   └── main.ts           # 应用入口
├── prisma/               # Prisma schema
├── .env                  # 环境变量
├── nest-cli.json         # Nest CLI配置
├── package.json          # 项目依赖
└── README.md             # 项目说明
```

### 系统现有统计功能

项目中确实包含一些基础的统计功能：

1. 订单统计
   - 可通过 /orders/stats/summary 端点访问（仅限管理员）
   - 在 orders.service.ts 中实现了 getOrderStats() 方法
   - 提供订单总数、各状态订单数量、总收入和平均订单价值等数据

2. 支付统计
   - 可通过 /payments/stats/summary 端点访问（仅限管理员）
   - 在 payments.service.ts 中实现了 getPaymentStats() 方法
   - 提供支付总数、已完成支付数、已退款支付数、总金额和净金额等数据

3. 类型定义
   - 在 src/types/payment.ts 中定义了 PaymentReport 接口，但没有相应的实现代码

## 安装与运行

### 前置条件

- Node.js 16+
- PostgreSQL
- NATS服务器

### 安装步骤

1. 克隆项目

```bash
git clone <repository-url>
cd cross-shop
```

2. 安装依赖

```bash
pnpm install
```

3. 配置环境变量

复制 `.env` 文件并修改相应配置：

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

4. 数据库迁移

```bash
npx prisma migrate dev --name init
```

5. 生成Prisma客户端

```bash
npx prisma generate
```

6. 启动服务

```bash
# 开发模式
pnpm start:dev

# 生产模式
pnpm build
pnpm start:prod
```

## API端点

### RESTful API

- **认证**: `/auth/*`
- **用户**: `/users/*`
- **产品**: `/products/*`
- **分类**: `/categories/*`
- **订单**: `/orders/*`
- **支付**: `/payments/*`

### GraphQL

访问 `/graphql` 查看GraphQL Playground。

实现的功能：

1. 类型安全的配置访问 - 所有配置都有明确的TypeScript类型定义
2. 集中管理的配置服务 - 应用程序的所有配置都通过ConfigService统一管理
3. 环境变量验证 - 启动时自动验证必需的环境变量是否存在且格式正确
4. 多环境支持 - 支持development、production等不同环境的配置
5. 默认值处理 - 为可选配置项提供合理的默认值
6. 配置分组 - 将配置按功能（应用、数据库、JWT、GraphQL、NATS）进行分组

使用方法： 要在任何服务或控制器中使用配置，只需注入ConfigService即可：

```ts
import { ConfigService } from "../config";

@Injectable()
export class ExampleService {
  constructor(private configService: ConfigService) {}

  someMethod() {
    // 访问应用配置
    const port = this.configService.app.port;

    // 访问数据库配置
    const dbUrl = this.configService.database.url;

    // 访问JWT配置
    const jwtSecret = this.configService.jwt.secret;

    // 访问GraphQL配置
    const graphqlPath = this.configService.graphql.path;

    // 访问NATS配置
    const natsUrl = this.configService.nats.url;
  }
}
```

## 微服务

使用NATS作为消息代理，支持以下消息模式：

- `users.find_by_id`
- `products.find_by_id`
- `products.update_stock`
- `orders.create`
- `orders.find_by_id`
- `orders.update_status`
- `payments.create`

## 开发指南

### 运行测试

```bash
npm run test
npm run test:e2e
```

### 代码规范

使用ESLint和Prettier进行代码格式化：

```bash
npm run lint
npm run format
```

## 部署

### Docker

项目可以使用Docker容器化部署：

```bash
docker build -t cross-shop-api .
docker run -p 3000:3000 --env-file .env cross-shop-api
```

## 许可证

MIT
