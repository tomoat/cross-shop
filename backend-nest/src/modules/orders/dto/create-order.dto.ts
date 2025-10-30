import { IsString, IsArray, IsNumber, Min } from 'class-validator';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  items: OrderItemDto[];

  @IsString()
  shippingAddress: string;

  @IsString()
  paymentMethod: string;
}