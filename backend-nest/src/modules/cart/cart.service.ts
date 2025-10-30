import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cart, CartItem, Prisma } from 'generated/prisma/client';
import { ProductsService } from '../products/products.service';
import { CartWithItems, CartStats } from '../../types/cart';
const Decimal = Prisma.Decimal;

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  // 获取用户购物车
  async getUserCart(userId: string): Promise<CartWithItems> {
    // 查找或创建购物车
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      // 创建新购物车
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    }

    return cart as CartWithItems;
  }

  // 添加商品到购物车
  async addToCart(userId: string, productId: string, quantity: number): Promise<CartWithItems> {
    // 验证商品是否存在且库存充足
    const product = await this.productsService.findById(productId);
    if (product.stock < quantity) {
      throw new BadRequestException(`Insufficient stock for product ${product.name}`);
    }

    // 获取用户购物车
    let cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      // 创建新购物车
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    // 检查购物车中是否已存在该商品
    const existingItem = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      // 更新数量
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // 添加新商品到购物车
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // 返回更新后的购物车
    return this.getUserCart(userId);
  }

  // 更新购物车商品数量
  async updateCartItem(userId: string, itemId: string, quantity: number): Promise<CartWithItems> {
    if (quantity <= 0) {
      return this.removeFromCart(userId, itemId);
    }

    // 查找购物车和商品项
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!cartItem || cartItem.cartId !== cart.id) {
      throw new NotFoundException('Cart item not found');
    }

    // 验证库存
    if (cartItem.product.stock < quantity) {
      throw new BadRequestException(`Insufficient stock for product ${cartItem.product.name}`);
    }

    // 更新数量
    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getUserCart(userId);
  }

  // 从购物车移除商品
  async removeFromCart(userId: string, itemId: string): Promise<CartWithItems> {
    // 查找购物车和商品项
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!cartItem || cartItem.cartId !== cart.id) {
      throw new NotFoundException('Cart item not found');
    }

    // 删除商品项
    await this.prisma.cartItem.delete({ where: { id: itemId } });

    return this.getUserCart(userId);
  }

  // 清空购物车
  async clearCart(userId: string): Promise<CartWithItems> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // 删除所有购物车商品
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return this.getUserCart(userId);
  }

  // 计算购物车统计信息
  calculateCartStats(cart: CartWithItems): CartStats {
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalProducts = cart.items.length;
    
    // 计算小计金额
    const subTotal = cart.items.reduce((sum, item) => {
      return sum.plus(new Decimal(item.product.price).times(item.quantity));
    }, new Decimal(0)).toNumber();

    return {
      totalItems,
      totalProducts,
      subTotal,
    };
  }

  // 检查购物车中是否有足够的库存
  async validateCartStock(cartId: string): Promise<boolean> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId },
      include: { product: true },
    });

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return false;
      }
    }

    return true;
  }
}