import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { OrdersService } from "../orders/orders.service";
import { Payment, Order, Prisma, OrderItem, $Enums } from "generated/prisma/client";
import { PaymentWithOrder, PaymentStats, PaymentReport, PaymentMethodStats } from "../../types/payment";
import { OrderWithItems } from "src/types/order";

const Decimal = Prisma.Decimal;

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService
  ) {}

  async getOrderWithUser(orderId: string): Promise<OrderWithItems> {
    return this.ordersService.findById(orderId);
  }

  // 获取支付记录及其关联订单
  // PymentWithOrder 等价于 Payment & { order?: Order }
  async getPaymentWithOrder(id: string): Promise<PaymentWithOrder> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });
    if (!payment) {
      throw new NotFoundException("Payment not found");
    }
    return payment;
  }

  async createPayment(orderId: string, paymentMethod: $Enums.PaymentMethod): Promise<Payment> {
    // 验证订单状态
    const order = await this.ordersService.findById(orderId);

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.status !== $Enums.OrderStatus.PENDING) {
      throw new BadRequestException("Order is not pending");
    }

    // 计算订单总金额
    //const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalAmount = order.items
      .reduce((sum, item) => new Decimal(sum).plus(new Decimal(item.price).times(item.quantity)), new Decimal(0))
      .toNumber();

    // 在实际应用中，这里会调用支付网关API
    // 模拟支付处理
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const isPaymentSuccessful = true; // 假设支付成功

    if (!isPaymentSuccessful) {
      throw new BadRequestException("Payment failed");
    }

    // 创建支付记录
    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        amount: totalAmount,
        paymentMethod,
        transactionId,
        status: $Enums.PaymentStatus.COMPLETED,
        currency: $Enums.Currency.USD, // 添加必需的currency字段
      },
    });

    // 更新订单状态
    await this.ordersService.updateStatus(orderId, $Enums.OrderStatus.PAID);

    return payment;
  }

  async findAll(): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      include: { order: true },
    });
  }

  async findById(id: string): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    return payment;
  }

  async findByOrderId(orderId: string): Promise<PaymentWithOrder[]> {
    return this.prisma.payment.findMany({
      where: { orderId },
      include: { order: true },
    });
  }

  async refundPayment(paymentId: string, reason: string): Promise<Payment> {
    const payment = await this.findById(paymentId);

    if (payment.status !== $Enums.PaymentStatus.COMPLETED) {
      throw new BadRequestException("Only completed payments can be refunded");
    }

    // 检查订单是否已被取消
    const order = await this.ordersService.findById(payment.orderId);
    if (order.status !== $Enums.OrderStatus.PAID) {
      throw new BadRequestException("Only paid orders can be refunded");
    }

    // 在实际应用中，这里会调用支付网关的退款API
    const refundTransactionId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 更新支付状态
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: $Enums.PaymentStatus.REFUNDED,
        transactionId: refundTransactionId, // 使用transactionId字段而不是refundTransactionId
      },
    });

    // 更新订单状态 - 使用正确的订单状态枚举值
    await this.ordersService.updateStatus(payment.orderId, $Enums.OrderStatus.CANCELLED);

    return updatedPayment;
  }

  async getPaymentStats(): Promise<PaymentStats> {
    const payments = await this.prisma.payment.findMany();

    const stats: PaymentStats = {
      totalPayments: payments.length,
      successfulPayments: 0,
      failedPayments: 0,
      refundedPayments: 0,
      totalRevenue: 0,
      averagePaymentAmount: 0,
      revenueByMethod: {},
    };

    payments.forEach((payment) => {
      const amount = new Decimal(payment.amount).toNumber();
      
      if (payment.status === $Enums.PaymentStatus.COMPLETED) {
        stats.successfulPayments++;
        stats.totalRevenue += amount;
        
        // 按支付方式统计收入
        if (!stats.revenueByMethod[payment.paymentMethod]) {
          stats.revenueByMethod[payment.paymentMethod] = 0;
        }
        stats.revenueByMethod[payment.paymentMethod] += amount;
      } else if (payment.status === $Enums.PaymentStatus.FAILED) {
        stats.failedPayments++;
      } else if (payment.status === $Enums.PaymentStatus.REFUNDED) {
        stats.refundedPayments++;
      }
    });

    // 计算平均支付金额
    if (stats.successfulPayments > 0) {
      stats.averagePaymentAmount = stats.totalRevenue / stats.successfulPayments;
    }

    return stats;
  }

  /**
   * 生成支付报告
   * @param period 报告周期 (daily, weekly, monthly)
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 支付报告
   */
  async generatePaymentReport(
    period: string,
    startDate: Date,
    endDate: Date
  ): Promise<PaymentReport> {
    // 查询指定时间段的支付记录
    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });

    // 计算统计信息
    const stats: PaymentStats = {
      totalPayments: payments.length,
      successfulPayments: 0,
      failedPayments: 0,
      refundedPayments: 0,
      totalRevenue: 0,
      averagePaymentAmount: 0,
      revenueByMethod: {},
    };

    payments.forEach((payment) => {
      const amount = new Decimal(payment.amount).toNumber();
      
      if (payment.status === $Enums.PaymentStatus.COMPLETED) {
        stats.successfulPayments++;
        stats.totalRevenue += amount;
        
        // 按支付方式统计收入
        if (!stats.revenueByMethod[payment.paymentMethod]) {
          stats.revenueByMethod[payment.paymentMethod] = 0;
        }
        stats.revenueByMethod[payment.paymentMethod] += amount;
      } else if (payment.status === $Enums.PaymentStatus.FAILED) {
        stats.failedPayments++;
      } else if (payment.status === $Enums.PaymentStatus.REFUNDED) {
        stats.refundedPayments++;
      }
    });

    // 计算平均支付金额
    if (stats.successfulPayments > 0) {
      stats.averagePaymentAmount = stats.totalRevenue / stats.successfulPayments;
    }

    return {
      period,
      startDate,
      endDate,
      stats,
      payments: payments as PaymentWithOrder[],
    };
  }

  /**
   * 按时间周期获取预设报告
   * @param period 时间周期 (daily, weekly, monthly)
   * @returns 支付报告
   */
  async getPaymentReportByPeriod(period: string): Promise<PaymentReport> {
    const endDate = new Date();
    const startDate = new Date();

    // 设置时间范围
    switch (period) {
      case 'daily':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        throw new BadRequestException('Invalid period. Use daily, weekly, or monthly.');
    }

    return this.generatePaymentReport(period, startDate, endDate);
  }

  /**
   * 获取支付方式统计
   * @returns 支付方式统计列表
   */
  async getPaymentMethodStats(): Promise<PaymentMethodStats[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        status: $Enums.PaymentStatus.COMPLETED,
      },
    });

    // 按支付方式分组统计
    const methodStats: Record<string, { count: number; totalAmount: number }> = {};
    let grandTotal = 0;

    payments.forEach((payment) => {
      const amount = new Decimal(payment.amount).toNumber();
      
      if (!methodStats[payment.paymentMethod]) {
        methodStats[payment.paymentMethod] = { count: 0, totalAmount: 0 };
      }
      
      methodStats[payment.paymentMethod].count++;
      methodStats[payment.paymentMethod].totalAmount += amount;
      grandTotal += amount;
    });

    // 转换为要求的格式
    return Object.entries(methodStats).map(([method, data]) => ({
      method,
      count: data.count,
      totalAmount: data.totalAmount,
      percentage: grandTotal > 0 ? (data.totalAmount / grandTotal) * 100 : 0,
    }));
  }
}
