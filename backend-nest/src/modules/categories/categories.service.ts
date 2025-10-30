import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Category } from "generated/prisma/client";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: { products: false }, // 不包含产品以避免大量数据
    });
  }

  async findById(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return category;
  }

  async create(data: { name: string; description?: string }): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    try {
      return await this.prisma.category.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') { // Prisma record not found error code
        throw new NotFoundException("Category not found");
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Category> {
    // 检查是否有产品使用此分类
    const products = await this.prisma.product.findMany({ where: { categoryId: id } });
    if (products.length > 0) {
      throw new BadRequestException("Cannot delete category with existing products");
    }

    try {
      return await this.prisma.category.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') { // Prisma record not found error code
        throw new NotFoundException("Category not found");
      }
      throw error;
    }
  }

  async getCategoryWithProducts(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return category;
  }
}
