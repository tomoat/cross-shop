import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, ForbiddenException, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { OrdersService } from "./orders.service";
import { Order, $Enums } from "generated/prisma/client";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { OrderWithItems } from "../../types/order";
import { RequestWithUser } from "../../types/user";

@Controller("orders")
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async createOrder(
    @Body()
    data: {
      items: Array<{ productId: string; quantity: number }>;
      shippingAddress: string;
      paymentMethod: $Enums.PaymentMethod;
    },
    @Req() req: RequestWithUser
  ) {
    return this.ordersService.createOrder(req.user.id, data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("from-cart")
  async createOrderFromCart(
    @Body()
    data: {
      shippingAddress: string;
      paymentMethod: $Enums.PaymentMethod;
    },
    @Req() req: RequestWithUser
  ) {
    return this.ordersService.createOrderFromCart(req.user.id, data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async findAll(@Req() req: RequestWithUser) {
    // 管理员可以查看所有订单，普通用户只能查看自己的订单
    if (req.user.role === $Enums.Role.ADMIN) {
      return this.ordersService.findAll();
    }
    return this.ordersService.getUserOrders(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  async findById(@Param("id") id: string, @Req() req: RequestWithUser): Promise<OrderWithItems> {
    const order = await this.ordersService.findById(id);
    // 验证权限：管理员或订单所有者
    if (req.user.role !== $Enums.Role.ADMIN && order.userId !== req.user.id) {
      throw new ForbiddenException("Access denied");
    }
    return order;
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id/status")
  async updateStatus(@Param("id") id: string, @Body() data: { status: $Enums.OrderStatus }, @Req() req: RequestWithUser): Promise<Order> {
    // 只有管理员可以更新订单状态
    if (req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("Access denied");
    }
    return this.ordersService.updateStatus(id, data.status);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async deleteOrder(@Param("id") id: string, @Req() req: RequestWithUser): Promise<Order> {
    const order = await this.ordersService.findById(id);
    // 验证权限：管理员或订单所有者
    if (req.user.role !== $Enums.Role.ADMIN && order.userId !== req.user.id) {
      throw new ForbiddenException("Access denied");
    }
    return this.ordersService.deleteOrder(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("user/me")
  async getUserOrders(@Req() req: RequestWithUser): Promise<Order[]> {
    return this.ordersService.getUserOrders(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stats/summary")
  async getOrderStats(@Req() req: RequestWithUser) {
    // 只有管理员可以查看统计信息
    if (req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("Access denied");
    }
    return this.ordersService.getOrderStats();
  }

  // 微服务消息处理器
  @MessagePattern("orders.create")
  async createOrderMicroservice(
    @Payload()
    data: {
      userId: string;
      items: Array<{ productId: string; quantity: number }>;
      shippingAddress: string;
      paymentMethod: $Enums.PaymentMethod;
    }
  ) {
    try {
      const order = await this.ordersService.createOrder(data.userId, data);
      return { success: true, order };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern("orders.find_by_id")
  async findOrderById(@Payload() data: { id: string }) {
    try {
      const order = await this.ordersService.findById(data.id);
      return { success: true, order };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern("orders.update_status")
  async updateOrderStatus(@Payload() data: { id: string; status: $Enums.OrderStatus }) {
    try {
      const order = await this.ordersService.updateStatus(data.id, data.status);
      return { success: true, order };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern("orders.get_stats")
  async getOrderStatsMicroservice() {
    try {
      const stats = await this.ordersService.getOrderStats();
      return { success: true, stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
