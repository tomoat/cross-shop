import { Cart, CartItem } from "generated/prisma/client";
import { Product } from "generated/prisma/client";

// 购物车商品扩展接口，包含产品信息
export interface CartItemWithProduct extends CartItem {
  product: Product;
}

// 购物车扩展接口，包含商品信息
export interface CartWithItems extends Cart {
  items: CartItemWithProduct[];
}

// 创建购物车商品DTO
export interface AddToCartDto {
  productId: string;
  quantity: number;
}

// 更新购物车商品DTO
export interface UpdateCartItemDto {
  quantity: number;
}

// 购物车统计信息
export interface CartStats {
  totalItems: number;
  totalProducts: number;
  subTotal: number;
}