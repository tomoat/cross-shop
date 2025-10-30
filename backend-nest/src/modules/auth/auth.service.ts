import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { Role, User } from "generated/prisma/client";
import { JwtPayload } from "../../types/user";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, "password"> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    user: Omit<User, "password">
  ): Promise<{ access_token: string; user: { id: string; email: string; name: string; role: string } }> {
    const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role as string };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as string,
      },
    };
  }

  async register(data: { email: string; password: string; name: string }): Promise<Omit<User, "password">> {
    // 检查用户是否已存在
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 创建用户
    try {
      const newUser = await this.usersService.create({
        ...data,
        password: hashedPassword,
        role: "USER", // 默认角色
      });

      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      if (error.code === "P2002") {
        throw new BadRequestException("Email already exists");
      }
      throw error;
    }
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify(token);
      return payload as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }

  generateToken(
    user: Omit<
      { name: string; id: string; email: string; password: string; role: Role; createdAt: Date; updatedAt: Date },
      "password"
    >
  ) {
    const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role as string };
    return this.jwtService.sign(payload);
  }
}
