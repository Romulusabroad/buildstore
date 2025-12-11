
import { IsString, IsNumber, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  site_id: string;

  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  compare_at_price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @IsOptional()
  inventory_quantity?: number;
}

export class UpdateProductDto extends CreateProductDto {}
