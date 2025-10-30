import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsResolver } from './products.resolver';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [ProductsService, PrismaService, ProductsResolver],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}