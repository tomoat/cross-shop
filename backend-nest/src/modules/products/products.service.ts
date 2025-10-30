import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Product, $Enums } from "generated/prisma/client";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    params: {
      skip?: number;
      take?: number;
      categoryId?: string;
      search?: string;
    } = {}
  ): Promise<Product[]> {
    const { skip = 0, take = 10, categoryId, search } = params;

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }];
    }

    return this.prisma.product.findMany({
      where,
      skip,
      take,
      include: { category: true, seller: true },
    });
  }

  async findById(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, seller: true },
    });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  async create(data: {
    name: string;
    description: string;
    price: number;
    currency?: $Enums.Currency;
    stock: number;
    categoryId: string;
    sellerId: string;
    images?: string[];
  }): Promise<Product> {
    return this.prisma.product.create({
      data: {
        ...data,
        currency: data.currency || $Enums.Currency.USD,
      },
    });
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === "P2025") {
        // Prisma record not found error code
        throw new NotFoundException("Product not found");
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      if (error.code === "P2025") {
        // Prisma record not found error code
        throw new NotFoundException("Product not found");
      }
      throw error;
    }
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findById(id);
    if (product.stock + quantity < 0) {
      throw new BadRequestException("Insufficient stock");
    }
    return this.prisma.product.update({
      where: { id },
      data: { stock: product.stock + quantity },
    });
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { sellerId },
      include: { category: true },
    });
  }
}
