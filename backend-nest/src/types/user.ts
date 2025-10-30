import { User } from "generated/prisma/client";
import { Request } from "express";

// 自定义UserProfile接口，因为无法从@prisma/client导入
export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 扩展User模型，包含个人资料信息
export interface UserWithProfile extends User {
  profile?: UserProfile;
}

// 扩展Request对象，添加user属性
export interface RequestWithUser extends Request {
  user: User;
}

// JWT载荷接口
export interface JwtPayload {
  sub: string; // 用户ID
  email: string;
  role: string;
}
