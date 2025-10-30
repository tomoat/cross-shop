import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, ForbiddenException, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CategoriesService } from "./categories.service";
import { Category } from "generated/prisma/client";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { RequestWithUser } from "../../types/user";

@Controller("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Category> {
    return this.categoriesService.findById(id);
  }

  @Get(":id/products")
  async getCategoryWithProducts(@Param("id") id: string): Promise<Category> {
    return this.categoriesService.getCategoryWithProducts(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async create(@Body() data: { name: string; description?: string }, @Req() req: RequestWithUser): Promise<Category> {
    // 检查是否为管理员
    if (req.user.role !== "ADMIN") {
      throw new ForbiddenException("Only administrators can create categories");
    }
    return this.categoriesService.create(data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id")
  async update(@Param("id") id: string, @Body() data: Partial<Category>, @Req() req: RequestWithUser): Promise<Category> {
    // 检查是否为管理员
    if (req.user.role !== "ADMIN") {
      throw new ForbiddenException("Only administrators can update categories");
    }
    return this.categoriesService.update(id, data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async delete(@Param("id") id: string, @Req() req: RequestWithUser): Promise<Category> {
    // 检查是否为管理员
    if (req.user.role !== "ADMIN") {
      throw new ForbiddenException("Only administrators can delete categories");
    }
    return this.categoriesService.delete(id);
  }

  // 微服务消息处理器
  @MessagePattern("categories.find_all")
  async findAllCategories() {
    return this.categoriesService.findAll();
  }

  @MessagePattern("categories.find_by_id")
  async findCategoryById(@Payload() data: { id: string }) {
    try {
      const category = await this.categoriesService.findById(data.id);
      return { success: true, category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
