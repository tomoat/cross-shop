import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { CategoriesService } from "./categories.service";
import type { Category as CategoryType } from "generated/prisma/client";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { Category } from "./category.type";

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category])
  async getAllCategories(): Promise<Category[]> {
    const categories: CategoryType[] = await this.categoriesService.findAll();
    return categories.map((category) => this.mapToGraphQLCategory(category));
  }

  @Query(() => Category)
  async getCategoryById(@Args("id") id: string): Promise<Category> {
    const category: CategoryType = await this.categoriesService.findById(id);
    return this.mapToGraphQLCategory(category);
  }

  @Mutation(() => Category)
  @UseGuards(AuthGuard("jwt"))
  async createCategory(
    @Args("name") name: string,
    @Context("req") req: Request,
    @Args("description", { nullable: true }) description?: string
  ): Promise<Category> {
    // 只有管理员可以创建类别
    if ((req.user as any).role !== "ADMIN") {
      throw new Error("Access denied");
    }
    const category: CategoryType = await this.categoriesService.create({
      name,
      description,
    });
    return this.mapToGraphQLCategory(category);
  }

  @Mutation(() => Category)
  @UseGuards(AuthGuard("jwt"))
  async updateCategory(
    @Args("id") id: string,
    @Context("req") req: Request,
    @Args("name", { nullable: true }) name?: string,
    @Args("description", { nullable: true }) description?: string
  ): Promise<Category> {
    // 只有管理员可以更新类别
    if ((req.user as any).role !== "ADMIN") {
      throw new Error("Access denied");
    }
    const category: CategoryType = await this.categoriesService.update(id, {
      name,
      description,
    });
    return this.mapToGraphQLCategory(category);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard("jwt"))
  async deleteCategory(@Args("id") id: string, @Context("req") req: Request): Promise<boolean> {
    // 只有管理员可以删除类别
    if ((req.user as any).role !== "ADMIN") {
      throw new Error("Access denied");
    }
    await this.categoriesService.delete(id);
    return true;
  }

  // 将数据库分类类型转换为GraphQL分类类型
  //private mapToGraphQLCategory(category: CategoryType): Category {
  private mapToGraphQLCategory(category: any): Category {
    return {
      id: category.id,
      name: category.name,
      // description: category.description ?? undefined,
      // createdAt: category.createdAt,
      // updatedAt: category.updatedAt,
      description: category.description || "",
      createdAt: new Date(), // 使用当前时间作为默认值
      updatedAt: new Date(), // 使用当前时间作为默认值
    };
  }
}
