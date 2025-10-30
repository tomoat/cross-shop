import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, ForbiddenException, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { User, Profile } from "generated/prisma/client";
import { UserProfile, RequestWithUser } from "../../types/user";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<User[]> {
    // 只有管理员可以查看所有用户
    if (req.user.role !== "ADMIN") {
      throw new ForbiddenException("Only administrators can view all users");
    }
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  async findById(@Param("id") id: string, @Req() req: RequestWithUser): Promise<User> {
    // 只有用户本人或管理员可以查看用户详情
    if (id !== req.user.id && req.user.role !== "ADMIN") {
      throw new ForbiddenException("You can only view your own profile or are not admin");
    }
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id")
  async update(@Param("id") id: string, @Body() data: Partial<User>, @Req() req: RequestWithUser): Promise<User> {
    // 只有用户本人或管理员可以更新用户信息
    if (id !== req.user.id && req.user.role !== "ADMIN") {
      throw new ForbiddenException("You can only update your own profile or are not admin");
    }
    return this.usersService.update(id, data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async delete(@Param("id") id: string, @Req() req: RequestWithUser): Promise<User> {
    // 只有用户本人或管理员可以删除用户
    if (id !== req.user.id && req.user.role !== "ADMIN") {
      throw new ForbiddenException("You can only delete your own account or are not admin");
    }
    return this.usersService.delete(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post(":id/profile")
  async createProfile(@Param("id") id: string, @Body() data: Partial<UserProfile>, @Req() req: RequestWithUser): Promise<UserProfile> {
    // 只有用户本人或管理员可以创建个人资料
    if (id !== req.user.id && req.user.role !== "ADMIN") {
      throw new ForbiddenException("You can only create your own profile or are not admin");
    }
    return this.usersService.createProfile(id, data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id/profile")
  async getProfile(@Param("id") id: string, @Req() req: RequestWithUser): Promise<UserProfile | null> {
    // 只有用户本人或管理员可以查看个人资料
    if (id !== req.user.id && req.user.role !== "ADMIN") {
      throw new ForbiddenException("You can only view your own profile or are not admin");
    }
    return this.usersService.getProfile(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id/profile")
  async updateProfile(@Param("id") id: string, @Body() data: Partial<UserProfile>, @Req() req: RequestWithUser): Promise<UserProfile> {
    // 只有用户本人或管理员可以更新个人资料
    if (id !== req.user.id && req.user.role !== "ADMIN") {
      throw new ForbiddenException("You can only update your own profile or are not admin");
    }
    return this.usersService.createProfile(id, data);
  }

  // 微服务消息处理器
  @MessagePattern("users.find_by_id")
  async findUserById(@Payload() data: { id: string }) {
    try {
      const user = await this.usersService.findById(data.id);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern("users.update")
  async updateUser(@Payload() data: { id: string; updates: Partial<User> }) {
    try {
      const user = await this.usersService.update(data.id, data.updates);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
