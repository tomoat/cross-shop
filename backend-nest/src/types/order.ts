import { Order, OrderItem, Product, User } from "generated/prisma/client";

export interface OrderItemWithProduct extends OrderItem {
  product: Product;
}

export interface OrderWithItems extends Order {
  items: OrderItemWithProduct[];
  user: User;
}

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}
