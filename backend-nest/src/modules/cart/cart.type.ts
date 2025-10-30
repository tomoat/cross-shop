import { ObjectType, Field, ID, Float } from "@nestjs/graphql";

// GraphQL CartItem对象类型
@ObjectType()
export class CartItem {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  cartId: string;

  @Field(() => ID)
  productId: string;

  @Field()
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

// GraphQL Cart对象类型
@ObjectType()
export class Cart {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => [CartItem])
  items: CartItem[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}