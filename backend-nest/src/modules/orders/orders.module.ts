import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersResolver } from './orders.resolver';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CartModule } from '../cart/cart.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), forwardRef(() => CartModule)],
  providers: [OrdersService, PrismaService, ProductsService, OrdersResolver],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}