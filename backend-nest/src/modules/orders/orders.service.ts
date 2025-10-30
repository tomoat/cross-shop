import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Order, OrderItem, Product, User, Prisma, $Enums } from "generated/prisma/client";
import { ProductsService } from "../products/products.service";
import { CartService } from "../cart/cart.service";
import { OrderWithItems } from "../../types/order";
// import Decimal from "decimal.js";
const Decimal = Prisma.Decimal;

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  async createOrder(
    userId: string,
    data: {
      items: Array<{ productId: string; quantity: number }>;
      shippingAddress: string;
      paymentMethod: $Enums.PaymentMethod;
    }
  ): Promise<Order> {
    // 验证所有产品是否存在且库存充足
    let totalAmount = new Decimal(0);
    const itemsWithPrices = [];

    for (const item of data.items) {
      const product = await this.productsService.findById(item.productId);
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }
      // 计算总金额
      totalAmount = totalAmount.plus(new Decimal(product.price).times(item.quantity));
      itemsWithPrices.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 创建订单
    const order = await this.prisma.order.create({
      data: {
        userId,
        status: $Enums.OrderStatus.PENDING,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        totalAmount,
        items: {
          create: itemsWithPrices,
        },
      },
      include: {
        items: true,
      },
    });

    // 更新库存
    for (const item of data.items) {
      await this.productsService.updateStock(item.productId, -item.quantity);
    }

    return order;
  }

  // 从购物车创建订单
  async createOrderFromCart(
    userId: string,
    data: {
      shippingAddress: string;
      paymentMethod: $Enums.PaymentMethod;
    }
  ): Promise<Order> {
    // 获取用户购物车
    const cart = await this.cartService.getUserCart(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException("Cart is empty");
    }

    // 验证库存
    const hasEnoughStock = await this.cartService.validateCartStock(cart.id);
    if (!hasEnoughStock) {
      throw new BadRequestException("Some products are out of stock");
    }

    // 准备订单商品数据
    const items = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    // 使用现有的创建订单方法
    const order = await this.createOrder(userId, {
      items,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
    });

    // 清空购物车
    await this.cartService.clearCart(userId);

    return order;
  }

  async findAll(userId?: string): Promise<Order[]> {
    const where: Prisma.OrderWhereInput = {};
    if (userId) {
      where.userId = userId;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string): Promise<OrderWithItems> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    return order as OrderWithItems;
  }

  // @UseGuards(AuthGuard('jwt'))
  /**
   * 获取用户订单
   * @param userId 用户ID
   * @returns 用户订单列表
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    // return this.findAll(userId);
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateStatus(id: string, status: $Enums.OrderStatus): Promise<Order> {
    const order = await this.findById(id);

    // 验证状态转换
    const validTransitions: Record<$Enums.OrderStatus, $Enums.OrderStatus[]> = {
      [$Enums.OrderStatus.PENDING]: [$Enums.OrderStatus.PAID, $Enums.OrderStatus.CANCELLED],
      [$Enums.OrderStatus.PAID]: [$Enums.OrderStatus.SHIPPED, $Enums.OrderStatus.CANCELLED],
      [$Enums.OrderStatus.SHIPPED]: [$Enums.OrderStatus.DELIVERED],
      [$Enums.OrderStatus.DELIVERED]: [],
      [$Enums.OrderStatus.CANCELLED]: [],
      COMPLETED: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new BadRequestException(`Invalid status transition from ${order.status} to ${status}`);
    }

    // 如果取消订单，恢复库存
    if (status === $Enums.OrderStatus.CANCELLED) {
      for (const item of order.items) {
        await this.productsService.updateStock(item.productId, item.quantity);
      }
    }

    // 更新订单状态
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async deleteOrder(id: string): Promise<Order> {
    // 检查订单是否存在
    const order = await this.findById(id);

    // 只有待处理的订单可以删除
    if (order.status !== $Enums.OrderStatus.PENDING) {
      throw new BadRequestException("Only pending orders can be deleted");
    }

    // 恢复库存
    for (const item of order.items) {
      await this.productsService.updateStock(item.productId, item.quantity);
    }

    // 删除订单（级联删除订单项）
    return this.prisma.order.delete({ where: { id } });
  }

  async getOrderStats(): Promise<{ [key: string]: number }> {
    const orders = await this.prisma.order.findMany({
      include: {
        items: true,
      },
    });

    const stats = {
      totalOrders: orders.length,
      pendingOrders: 0,
      paidOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      refundedOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
    };

    orders.forEach((order) => {
      //stats[`${order.status.toLowerCase()}Orders`]++;
      // 根据订单状态更新统计
      switch (order.status) {
        case $Enums.OrderStatus.PENDING:
          stats.pendingOrders++;
          break;
        case $Enums.OrderStatus.PAID:
          stats.paidOrders++;
          break;
        case $Enums.OrderStatus.SHIPPED:
          stats.shippedOrders++;
          break;
        case $Enums.OrderStatus.DELIVERED:
          stats.deliveredOrders++;
          break;
        case $Enums.OrderStatus.CANCELLED:
          stats.cancelledOrders++;
          break;
      }

      // 计算订单总金额
      // const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderTotal = order.items
        .reduce((sum, item) => new Decimal(sum).plus(new Decimal(item.price).times(item.quantity)), new Decimal(0))
        .toNumber();

      if (order.status !== $Enums.OrderStatus.CANCELLED && order.status !== $Enums.OrderStatus.PENDING) {
        stats.totalRevenue += orderTotal;
      }
    });

    // 计算平均订单价值
    const validOrders = orders.filter(
      (order) => order.status !== $Enums.OrderStatus.CANCELLED && order.status !== $Enums.OrderStatus.PENDING
    );
    stats.averageOrderValue = validOrders.length > 0 ? stats.totalRevenue / validOrders.length : 0;

    return stats;
  }
}
