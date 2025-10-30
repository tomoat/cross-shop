import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { $Enums } from "generated/prisma/client";

/**
 * GraphQL Product对象类型
 */
@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => String)
  currency: string;

  @Field()
  stock: number;

  @Field(() => ID)
  categoryId: string;

  @Field(() => ID)
  sellerId: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
