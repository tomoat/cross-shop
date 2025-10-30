import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "../users/user.type";

/**
 * GraphQL AuthResponse返回类型
 */
@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
