import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  // 应用配置
  @IsOptional()
  @IsNumber()
  PORT?: number = 3000;

  @IsOptional()
  @IsString()
  NODE_ENV?: string = 'development';

  @IsOptional()
  @IsString()
  API_PREFIX?: string = 'api';

  // 数据库配置
  @IsNotEmpty()
  @IsString()
  DATABASE_URL!: string;

  // JWT配置
  @IsNotEmpty()
  @IsString()
  JWT_SECRET!: string;

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string = '24h';

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_SECRET!: string;

  @IsOptional()
  @IsString()
  JWT_REFRESH_EXPIRES_IN?: string = '7d';

  // GraphQL配置
  @IsOptional()
  @IsString()
  GRAPHQL_PATH?: string = '/graphql';

  @IsOptional()
  GRAPHQL_PLAYGROUND?: boolean = true;

  @IsOptional()
  GRAPHQL_DEBUG?: boolean = true;

  // NATS配置
  @IsOptional()
  @IsString()
  NATS_URL?: string = 'nats://localhost:4222';

  @IsOptional()
  @IsString()
  NATS_QUEUE?: string = 'cross-shop';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.map((error) => Object.values(error.constraints || {}).join(', ')).join('\n'));
  }

  return validatedConfig;
}