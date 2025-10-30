import { Module, OnModuleInit } from "@nestjs/common";
import { GraphQLModule, registerEnumType } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MicroserviceModule } from "./microservices/microservice.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ProductsModule } from "./modules/products/products.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { CartModule } from "./modules/cart/cart.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "./config";
import * as path from "path";
import { $Enums } from "generated/prisma/client";

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: path.join(process.cwd(), "src/graphql/schema.gql"),
        playground: configService.graphql.playground,
        introspection: configService.app.environment !== 'production',
        path: configService.graphql.path,
        buildSchemaOptions: {
          dateScalarMode: "timestamp",
        },
      }),
    }),
    MicroserviceModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    // 注册所有Prisma生成的枚举类型到GraphQL
    registerEnumType($Enums.Role, {
      name: 'Role',
      description: '用户角色枚举',
    });
    
    registerEnumType($Enums.Currency, {
      name: 'Currency',
      description: '货币类型枚举',
    });
    
    registerEnumType($Enums.OrderStatus, {
      name: 'OrderStatus',
      description: '订单状态枚举',
    });
    
    registerEnumType($Enums.PaymentStatus, {
      name: 'PaymentStatus',
      description: '支付状态枚举',
    });
    
    registerEnumType($Enums.PaymentMethod, {
      name: 'PaymentMethod',
      description: '支付方式枚举',
    });
  }
}
