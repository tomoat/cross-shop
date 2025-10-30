import { ObjectType, Field, ID } from "@nestjs/graphql";
import { $Enums } from "generated/prisma/client";

/**
 * GraphQL User对象类型
 */
@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => String)
  role: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // 其他需要的字段
}
