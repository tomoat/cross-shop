import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import type { User as UserType } from "generated/prisma/client";
import { User } from "../users/user.type";
import { AuthResponse } from "./auth.type";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(
    @Args("email") email: string,
    @Args("password") password: string
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const accessToken = await this.authService.generateToken(user);
    // return { accessToken, user };
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Mutation(() => User)
  async register(
    @Args("name") name: string,
    @Args("email") email: string,
    @Args("password") password: string,
    @Args("role", { nullable: true }) role?: string
  ): Promise<User> {
    const user = await this.authService.register({ name, email, password });
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
