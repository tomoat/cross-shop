import { IsString, IsNumber, Min, Max, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Min(2)
  @Max(100)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsString({ each: true })
  categoryIds: string[];

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  sku?: string;
}