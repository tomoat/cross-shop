import {
  Resolver,
  Query,
  Args,
  Mutation,
  Context,
} from "@nestjs/graphql";
import { OrdersService } from "./orders.service";
import type { Order as OrderType } from "generated/prisma/client";
import { $Enums } from "generated/prisma/client";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { Order, OrderItem } from "./order.type";

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => [Order])
  @UseGuards(AuthGuard("jwt"))
  async getMyOrders(@Context("req") req: Request): Promise<Order[]> {
    // return this.ordersService.findByUserId((req.user as any).id);
    const orders: OrderType[] = await this.ordersService.getUserOrders((req.user as any).id);
    return orders.map(this.mapToGraphQLOrder.bind(this));
  }

  @Query(() => [Order])
  @UseGuards(AuthGuard("jwt"))
  async getAllOrders(@Context("req") req: Request): Promise<Order[]> {
    // 只有管理员可以查看所有订单
    if ((req.user as any).role !== $Enums.Role.ADMIN) {
      throw new Error("Access denied");
    }
    const orders: OrderType[] = await this.ordersService.findAll();
    return orders.map(this.mapToGraphQLOrder.bind(this));
  }

  @Query(() => Order)
  @UseGuards(AuthGuard("jwt"))
  async getOrderById(@Args("id") id: string, @Context("req") req: Request): Promise<Order> {
    const order: OrderType = await this.ordersService.findById(id);
    // 只有管理员或订单所有者可以查看订单详情
    if ((req.user as any).role !== $Enums.Role.ADMIN && (req.user as any).id !== order.userId) {
      throw new Error("Access denied");
    }
    return this.mapToGraphQLOrder(order);
  }

  @Mutation(() => Order)
  @UseGuards(AuthGuard("jwt"))
  async createOrder(
    @Args("shippingAddress") shippingAddress: string,
    @Args("paymentMethod") paymentMethod: $Enums.PaymentMethod,
    @Context("req") req: Request
  ): Promise<Order> {
    // 从购物车创建订单
    const order: OrderType = await this.ordersService.createOrderFromCart((req.user as any).id, {
      shippingAddress,
      paymentMethod,
    });
    return this.mapToGraphQLOrder(order);
  }

  @Mutation(() => Order)
  @UseGuards(AuthGuard("jwt"))
  async updateOrderStatus(
    @Args("id") id: string,
    @Args("status") status: $Enums.OrderStatus,
    @Context("req") req: Request
  ): Promise<Order> {
    // 只有管理员可以更新订单状态
    if ((req.user as any).role !== $Enums.Role.ADMIN) {
      throw new Error("Access denied");
    }
    const order: OrderType = await this.ordersService.updateStatus(id, status);
    return this.mapToGraphQLOrder(order);
  }

  // 将数据库订单项类型转换为GraphQL订单项类型
  private mapToGraphQLOrderItem(item: any): OrderItem {
    return {
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: Number(item.price),
    };
  }

  // 将数据库订单类型转换为GraphQL订单类型
  // private mapToGraphQLOrder(order: OrderType): Order {
  private mapToGraphQLOrder(order: any): Order {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      shippingAddress: order.shippingAddress,
      // items: (order.items || []).map(item => this.mapToGraphQLOrderItem(item)),
      items: [], // 暂时返回空数组，需要从服务层获取完整数据
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
