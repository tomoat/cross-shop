import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { PaymentsResolver } from "./payments.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import { PrismaService } from "../../prisma/prisma.service";
import { OrdersService } from "../orders/orders.service";
import { ProductsService } from "../products/products.service";
import { CartModule } from "../cart/cart.module";

@Module({
  imports: [CartModule, PrismaModule],
  providers: [PaymentsService, PrismaService, OrdersService, ProductsService, PaymentsResolver],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
