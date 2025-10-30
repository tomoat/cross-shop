import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { ProductsService } from "./products.service";
import type { Product as ProductType } from "generated/prisma/client";
import { Prisma, $Enums } from "generated/prisma/client";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { Product } from "./product.type";

const Decimal = Prisma.Decimal;

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [Product])
  async getAllProducts(
    @Args("categoryId", { nullable: true }) categoryId?: string,
    @Args("search", { nullable: true }) search?: string,
    @Args("page", { defaultValue: 1 }) page?: number,
    @Args("limit", { defaultValue: 10 }) limit?: number
  ): Promise<Product[]> {
    const skip = page && page > 0 ? (page - 1) * (limit || 10) : 0;
    const take = limit || 10;
    const products: ProductType[] = await this.productsService.findAll({ categoryId, search, skip, take });
    return products.map(this.mapToGraphQLProduct);
  }

  @Query(() => Product)
  async getProductById(@Args("id") id: string): Promise<Product> {
    const product: ProductType = await this.productsService.findById(id);
    return this.mapToGraphQLProduct(product);
  }

  @Mutation(() => Product)
  @UseGuards(AuthGuard("jwt"))
  async createProduct(
    @Context("req") req: Request,
    @Args("name") name: string,
    @Args("description") description: string,
    @Args("price") price: number,
    @Args("stock") stock: number,
    @Args("categoryId") categoryId: string,
    @Args("sellerId") sellerId: string,
    @Args("currency", { nullable: true }) currency?: $Enums.Currency,
    @Args("images", { nullable: true, type: () => [String] }) images?: string[]
  ): Promise<Product> {
    // 检查权限
    if ((req.user as any).role !== "ADMIN" && (req.user as any).id !== sellerId) {
      throw new Error("Access denied");
    }

    const createdProduct: ProductType = await this.productsService.create({
      name,
      description,
      price: Number(price),
      stock,
      categoryId,
      sellerId,
      currency,
      images: images || [],
    });
    return this.mapToGraphQLProduct(createdProduct);
  }

  @Mutation(() => Product)
  @UseGuards(AuthGuard("jwt"))
  async updateProduct(
    @Args("id") id: string,
    @Context("req") req: Request,
    @Args("name", { nullable: true }) name?: string,
    @Args("description", { nullable: true }) description?: string,
    @Args("price", { nullable: true }) price?: number,
    @Args("stock", { nullable: true }) stock?: number,
    @Args("categoryId", { nullable: true }) categoryId?: string,
    @Args("currency", { nullable: true }) currency?: $Enums.Currency,
    @Args("images", { nullable: true, type: () => [String] }) images?: string[]
  ): Promise<Product> {
    // 只有管理员可以更新产品
    if ((req.user as any).role !== "ADMIN") {
      throw new Error("Access denied");
    }

    const updatedProduct: ProductType = await this.productsService.update(id, {
      name,
      description,
      price: price ? new Decimal(price) : undefined,
      stock,
      categoryId,
      currency,
      images,
    });
    return this.mapToGraphQLProduct(updatedProduct);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard("jwt"))
  async deleteProduct(@Args("id") id: string, @Context("req") req: Request): Promise<boolean> {
    // 只有管理员可以删除产品
    if ((req.user as any).role !== "ADMIN") {
      throw new Error("Access denied");
    }
    await this.productsService.delete(id);
    return true;
  }

  // 将数据库产品类型转换为GraphQL产品类型
  private mapToGraphQLProduct(product: ProductType): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      currency: product.currency,
      stock: product.stock,
      categoryId: product.categoryId,
      sellerId: product.sellerId,
      images: product.images,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
