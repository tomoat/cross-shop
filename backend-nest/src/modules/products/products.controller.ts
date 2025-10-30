import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProductsService } from "./products.service";
import { Product, $Enums } from "generated/prisma/client";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { RequestWithUser } from "../../types/user";

@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query("skip") skip?: number,
    @Query("take") take?: number,
    @Query("categoryId") categoryId?: string,
    @Query("search") search?: string
  ): Promise<Product[]> {
    return this.productsService.findAll({ skip, take, categoryId, search });
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Product> {
    return this.productsService.findById(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async create(
    @Body()
    data: {
      name: string;
      description: string;
      price: number;
      currency?: $Enums.Currency;
      stock: number;
      categoryId: string;
      images?: string[];
    },
    @Req() req: RequestWithUser
  ): Promise<Product> {
    return this.productsService.create({
      ...data,
      sellerId: req.user.id,
    });
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body()
    data: Partial<Product>,
    @Req() req: RequestWithUser
  ): Promise<Product> {
    // 获取产品信息检查权限
    const product = await this.productsService.findById(id);
    // 只有卖家本人或管理员可以更新产品
    if (product.sellerId !== req.user.id && req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("You can only update your own products or are not admin");
    }
    return this.productsService.update(id, data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async delete(@Param("id") id: string, @Req() req: RequestWithUser): Promise<Product> {
    // 获取产品信息检查权限
    const product = await this.productsService.findById(id);
    // 只有卖家本人或管理员可以删除产品
    if (product.sellerId !== req.user.id && req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("You can only delete your own products or are not admin");
    }
    return this.productsService.delete(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("seller/:sellerId")
  async getProductsBySeller(@Param("sellerId") sellerId: string): Promise<Product[]> {
    return this.productsService.getProductsBySeller(sellerId);
  }

  // 微服务消息处理器
  @MessagePattern("products.find_by_id")
  async findProductById(@Payload() data: { id: string }) {
    try {
      const product = await this.productsService.findById(data.id);
      return { success: true, product };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern("products.update_stock")
  async updateProductStock(@Payload() data: { id: string; quantity: number }) {
    try {
      const product = await this.productsService.updateStock(data.id, data.quantity);
      return { success: true, product };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
