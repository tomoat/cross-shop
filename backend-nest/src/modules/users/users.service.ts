import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { User, Prisma } from "generated/prisma/client";
import { UserProfile } from "../../types/user";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      if (error.code === 'P2002') { // Prisma unique constraint error
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.prisma.user.update({ where: { id }, data });
    } catch (error) {
      if (error.code === 'P2025') { // Prisma record not found error code
        throw new NotFoundException("User not found");
      }
      throw error;
    }
  }

  async delete(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') { // Prisma record not found error code
        throw new NotFoundException("User not found");
      }
      throw error;
    }
  }

  async createProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    await this.findById(userId);

    try {
      // 使用Prisma的upsert操作来处理创建或更新
      // 这里使用$executeRaw因为直接操作表
      await this.prisma.$executeRaw`
        INSERT INTO user_profile (userId, bio, avatar, phone, address) 
        VALUES (${userId}, ${data.bio || null}, ${data.avatar || null}, ${data.phone || null}, ${data.address || null})
        ON CONFLICT (userId) 
        DO UPDATE SET 
          bio = ${data.bio || undefined} ?? user_profile.bio,
          avatar = ${data.avatar || undefined} ?? user_profile.avatar,
          phone = ${data.phone || undefined} ?? user_profile.phone,
          address = ${data.address || undefined} ?? user_profile.address,
          updatedAt = NOW()
      `;

      // 查询创建/更新后的资料
      const profile = await this.getProfile(userId);
      if (!profile) {
        throw new Error('Failed to create/update profile');
      }
      return profile;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Profile already exists for this user');
      }
      throw error;
    }
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    await this.findById(userId);

    try {
      const profile = await this.prisma.$queryRaw<Array<UserProfile>>`
        SELECT * FROM user_profile WHERE userId = ${userId}
      `;

      return profile.length > 0 ? profile[0] : null;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const user = await this.findById(userId);

    const updatedProfile = await this.prisma.$queryRaw<Array<UserProfile>>`
      UPDATE user_profile 
      SET 
        bio = ${data.bio},
        avatar = ${data.avatar},
        phone = ${data.phone},
        address = ${data.address},
        updatedAt = NOW()
      WHERE userId = ${userId}
      RETURNING *
    `;

    if (updatedProfile.length === 0) {
      throw new NotFoundException("Profile not found");
    }

    return updatedProfile[0];
  }
}
