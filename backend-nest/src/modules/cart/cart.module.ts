import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { CartResolver } from "./cart.resolver";
import { PrismaService } from "../../prisma/prisma.service";
import { ProductsService } from "../products/products.service";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [CartService, PrismaService, ProductsService, CartResolver],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
