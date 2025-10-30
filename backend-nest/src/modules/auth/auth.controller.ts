import { Controller, Post, Body, Get, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { User } from "generated/prisma/client";
import { RequestWithUser } from "../../types/user";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Req() req: RequestWithUser): Promise<{
    access_token: string;
    user: { id: string; email: string; name: string; role: string };
  }> {
    return this.authService.login(req.user);
  }

  @Post("register")
  async register(@Body() body: { email: string; password: string; name: string }): Promise<Omit<User, "password">> {
    return this.authService.register(body);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  getProfile(@Req() req: RequestWithUser): any {
    return req.user;
  }

  // 微服务消息处理器
  @MessagePattern("auth.login")
  async microserviceLogin(@Payload() data: { email: string; password: string }) {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }
    return this.authService.login(user);
  }

  @MessagePattern("auth.verify")
  async verifyToken(@Payload() data: { token: string }) {
    try {
      const payload = await this.authService.verifyToken(data.token);
      return { success: true, payload };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
