import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  /**
   * 获取应用配置
   */
  get app() {
    return {
      port: this.getNumber('PORT', 3000),
      environment: this.getString('NODE_ENV', 'development'),
      apiPrefix: this.getString('API_PREFIX', 'api'),
    };
  }

  /**
   * 获取数据库配置
   */
  get database() {
    return {
      url: this.getString('DATABASE_URL'),
      log: this.app.environment === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    };
  }

  /**
   * 获取JWT配置
   */
  get jwt() {
    return {
      secret: this.getString('JWT_SECRET'),
      expiresIn: this.getString('JWT_EXPIRES_IN', '24h'),
      refreshSecret: this.getString('JWT_REFRESH_SECRET'),
      refreshExpiresIn: this.getString('JWT_REFRESH_EXPIRES_IN', '7d'),
    };
  }

  /**
   * 获取GraphQL配置
   */
  get graphql() {
    return {
      path: this.getString('GRAPHQL_PATH', '/graphql'),
      playground: this.getBoolean('GRAPHQL_PLAYGROUND', true),
      debug: this.getBoolean('GRAPHQL_DEBUG', true),
    };
  }

  /**
   * 获取NATS配置
   */
  get nats() {
    return {
      url: this.getString('NATS_URL', 'nats://localhost:4222'),
      queue: this.getString('NATS_QUEUE', 'cross-shop'),
    };
  }

  /**
   * 获取字符串配置
   */
  private getString(key: string, defaultValue?: string): string {
    const value = this.configService.get<string>(key);
    if (value === undefined && defaultValue === undefined) {
      throw new Error(`Configuration key "${key}" is required`);
    }
    return value ?? defaultValue!;
  }

  /**
   * 获取数字配置
   */
  private getNumber(key: string, defaultValue?: number): number {
    const value = this.configService.get<string>(key);
    if (value === undefined) {
      if (defaultValue === undefined) {
        throw new Error(`Configuration key "${key}" is required`);
      }
      return defaultValue;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      throw new Error(`Configuration key "${key}" must be a number`);
    }

    return numValue;
  }

  /**
   * 获取布尔配置
   */
  private getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.configService.get<string>(key);
    if (value === undefined) {
      if (defaultValue === undefined) {
        throw new Error(`Configuration key "${key}" is required`);
      }
      return defaultValue;
    }

    return value.toLowerCase() === 'true';
  }

  /**
   * 获取数组配置
   */
  private getArray(key: string, separator: string = ',', defaultValue?: string[]): string[] {
    const value = this.configService.get<string>(key);
    if (value === undefined) {
      if (defaultValue === undefined) {
        throw new Error(`Configuration key "${key}" is required`);
      }
      return defaultValue;
    }

    return value.split(separator).map((item) => item.trim());
  }
}