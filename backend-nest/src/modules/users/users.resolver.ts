import { Resolver, Query, Args, Mutation, Context, ID } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import type { User as UserType } from "generated/prisma/client";
import { $Enums } from "generated/prisma/client";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { User } from "./user.type";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(AuthGuard("jwt"))
  async getAllUsers(@Context("req") req: Request): Promise<User[]> {
    // 只有管理员可以查看所有用户
    if ((req.user as any).role !== "ADMIN") {
      throw new Error("Access denied");
    }
    const users: UserType[] = await this.usersService.findAll();
    return users.map(this.mapToGraphQLUser);
  }

  @Query(() => User)
  @UseGuards(AuthGuard("jwt"))
  async getCurrentUser(@Context("req") req: Request): Promise<User> {
    const user: UserType = await this.usersService.findById((req.user as any).id);
    return this.mapToGraphQLUser(user);
  }

  @Query(() => User)
  @UseGuards(AuthGuard("jwt"))
  async getUserById(@Args("id") id: string, @Context("req") req: Request): Promise<User> {
    // 只有管理员或用户自己可以查看用户详情
    if ((req.user as any).role !== "ADMIN" && (req.user as any).id !== id) {
      throw new Error("Access denied");
    }
    const user: UserType = await this.usersService.findById(id);
    return this.mapToGraphQLUser(user);
  }

  // 将数据库用户类型转换为GraphQL用户类型
  private mapToGraphQLUser(user: UserType): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
