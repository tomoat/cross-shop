import { Payment, Order, User } from "generated/prisma/client";

/**
 * 支付记录与订单关联的类型
 */
export interface PaymentWithOrder extends Payment {
  order?: Order;
}

/**
 * 支付记录与订单和用户关联的类型
 */
export interface PaymentWithOrderAndUser extends Payment {
  order?: Order & { user: User };
}

/**
 * 创建支付所需的数据结构
 */
export interface CreatePaymentData {
  orderId: string;
  amount: number;
  paymentMethod: string;
  currency?: string;
  transactionId?: string;
}

/**
 * 更新支付状态所需的数据结构
 */
export interface UpdatePaymentData {
  status?: string;
  transactionId?: string;
  refundAmount?: number;
  refundReason?: string;
}

/**
 * 支付统计信息
 */
export interface PaymentStats {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  refundedPayments: number;
  totalRevenue: number;
  averagePaymentAmount: number;
  revenueByMethod: Record<string, number>;
}

/**
 * 支付方法统计
 */
export interface PaymentMethodStats {
  method: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

/**
 * 支付报告数据结构
 */
export interface PaymentReport {
  period: string; // 例如: "daily", "weekly", "monthly"
  startDate: Date;
  endDate: Date;
  stats: PaymentStats;
  payments: PaymentWithOrder[];
}