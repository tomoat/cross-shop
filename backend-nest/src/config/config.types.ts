/**
 * 应用配置接口
 */
export interface AppConfig {
  port: number;
  environment: string;
  apiPrefix: string;
}

/**
 * 数据库配置接口
 */
export interface DatabaseConfig {
  url: string;
  log: string[];
}

/**
 * JWT配置接口
 */
export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

/**
 * GraphQL配置接口
 */
export interface GraphqlConfig {
  path: string;
  playground: boolean;
  debug: boolean;
}

/**
 * NATS配置接口
 */
export interface NatsConfig {
  url: string;
  queue: string;
}

/**
 * 环境变量配置接口
 */
export interface EnvironmentVariables {
  // 应用配置
  PORT?: number;
  NODE_ENV?: string;
  API_PREFIX?: string;

  // 数据库配置
  DATABASE_URL: string;

  // JWT配置
  JWT_SECRET: string;
  JWT_EXPIRES_IN?: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN?: string;

  // GraphQL配置
  GRAPHQL_PATH?: string;
  GRAPHQL_PLAYGROUND?: boolean;
  GRAPHQL_DEBUG?: boolean;

  // NATS配置
  NATS_URL?: string;
  NATS_QUEUE?: string;
}