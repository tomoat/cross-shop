import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { CartService } from "./cart.service";
import type { Cart as CartType, CartItem as CartItemType } from "generated/prisma/client";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { Cart, CartItem } from "./cart.type";

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => Cart)
  @UseGuards(AuthGuard("jwt"))
  async getMyCart(@Context("req") req: Request): Promise<Cart> {
    const cart: CartType = await this.cartService.getUserCart((req.user as any).id);
    return this.mapToGraphQLCart(cart);
  }

  @Mutation(() => Cart)
  @UseGuards(AuthGuard("jwt"))
  async addToCart(
    @Args("productId") productId: string,
    @Args("quantity") quantity: number,
    @Context("req") req: Request
  ): Promise<Cart> {
    const cart: CartType = await this.cartService.addToCart((req.user as any).id, productId, quantity);
    return this.mapToGraphQLCart(cart);
  }

  @Mutation(() => Cart)
  @UseGuards(AuthGuard("jwt"))
  async updateCartItem(
    @Args("itemId") itemId: string,
    @Args("quantity") quantity: number,
    @Context("req") req: Request
  ): Promise<Cart> {
    const cart: CartType = await this.cartService.updateCartItem((req.user as any).id, itemId, quantity);
    return this.mapToGraphQLCart(cart);
  }

  @Mutation(() => Cart)
  @UseGuards(AuthGuard("jwt"))
  async removeFromCart(@Args("itemId") itemId: string, @Context("req") req: Request): Promise<Cart> {
    const cart: CartType = await this.cartService.removeFromCart((req.user as any).id, itemId);
    return this.mapToGraphQLCart(cart);
  }

  @Mutation(() => Cart)
  @UseGuards(AuthGuard("jwt"))
  async clearCart(@Context("req") req: Request): Promise<Cart> {
    const cart: CartType = await this.cartService.clearCart((req.user as any).id);
    return this.mapToGraphQLCart(cart);
  }

  @Query(() => Number)
  @UseGuards(AuthGuard("jwt"))
  async getCartTotal(@Context("req") req: Request): Promise<number> {
    const cart = await this.cartService.getUserCart((req.user as any).id);
    return cart.items.reduce((total, item) => total + Number(item.product?.price || 0) * item.quantity, 0);
  }

  // 将数据库购物车项类型转换为GraphQL购物车项类型
  // private mapToGraphQLCartItem(item: CartItemType): CartItem {
  //   return {
  //     id: item.id,
  //     cartId: item.cartId,
  //     productId: item.productId,
  //     quantity: item.quantity,
  //     price: Number(item.product?.price || 0),
  //     createdAt: item.createdAt,
  //     updatedAt: item.updatedAt,
  //   };
  // }

  // 将数据库购物车类型转换为GraphQL购物车类型
  //private mapToGraphQLCart(cart: CartType): Cart {
  private mapToGraphQLCart(cart: any): Cart {
    return {
      id: cart.id,
      userId: cart.userId,
      // items: (cart.items || []).map(item => this.mapToGraphQLCartItem(item)),
      // createdAt: cart.createdAt,
      // updatedAt: cart.updatedAt
      items: [], // 暂时返回空数组，需要从服务层获取完整数据
      createdAt: new Date(), // 使用当前时间作为默认值
      updatedAt: new Date(), // 使用当前时间作为默认值
    };
  }
}
