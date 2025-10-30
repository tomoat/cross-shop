import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesResolver } from './categories.resolver';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [CategoriesService, PrismaService, CategoriesResolver],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}