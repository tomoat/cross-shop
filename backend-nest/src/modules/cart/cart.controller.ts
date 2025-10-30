import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../../types/user';
import { CartWithItems, CartStats, AddToCartDto, UpdateCartItemDto } from '../../types/cart';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private cartService: CartService) {}

  // 获取当前用户的购物车
  @Get()
  async getCart(@Req() req: RequestWithUser): Promise<{ cart: CartWithItems; stats: CartStats }> {
    const cart = await this.cartService.getUserCart(req.user.id);
    const stats = this.cartService.calculateCartStats(cart);
    return { cart, stats };
  }

  // 添加商品到购物车
  @Post('items')
  async addToCart(@Req() req: RequestWithUser, @Body() data: AddToCartDto): Promise<{ cart: CartWithItems; stats: CartStats }> {
    const cart = await this.cartService.addToCart(
      req.user.id,
      data.productId,
      data.quantity,
    );
    const stats = this.cartService.calculateCartStats(cart);
    return { cart, stats };
  }

  // 更新购物车商品数量
  @Put('items/:itemId')
  async updateCartItem(
    @Req() req: RequestWithUser,
    @Param('itemId') itemId: string,
    @Body() data: UpdateCartItemDto,
  ): Promise<{ cart: CartWithItems; stats: CartStats }> {
    const cart = await this.cartService.updateCartItem(
      req.user.id,
      itemId,
      data.quantity,
    );
    const stats = this.cartService.calculateCartStats(cart);
    return { cart, stats };
  }

  // 从购物车移除商品
  @Delete('items/:itemId')
  async removeFromCart(
    @Req() req: RequestWithUser,
    @Param('itemId') itemId: string,
  ): Promise<{ cart: CartWithItems; stats: CartStats }> {
    const cart = await this.cartService.removeFromCart(req.user.id, itemId);
    const stats = this.cartService.calculateCartStats(cart);
    return { cart, stats };
  }

  // 清空购物车
  @Delete()
  async clearCart(@Req() req: RequestWithUser): Promise<{ cart: CartWithItems; stats: CartStats }> {
    const cart = await this.cartService.clearCart(req.user.id);
    const stats = this.cartService.calculateCartStats(cart);
    return { cart, stats };
  }
}