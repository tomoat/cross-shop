import { ObjectType, Field, ID, Float, registerEnumType } from "@nestjs/graphql";
import { $Enums } from "generated/prisma/client";

// 注册订单状态枚举
registerEnumType($Enums.OrderStatus, {
  name: "OrderStatus",
});

// GraphQL OrderItem对象类型
@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  orderId: string;

  @Field(() => ID)
  productId: string;

  @Field()
  quantity: number;

  @Field(() => Float)
  price: number;
}

// GraphQL Order对象类型
@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => $Enums.OrderStatus)
  status: $Enums.OrderStatus;

  @Field(() => Float)
  totalAmount: number;

  @Field()
  shippingAddress: string;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}