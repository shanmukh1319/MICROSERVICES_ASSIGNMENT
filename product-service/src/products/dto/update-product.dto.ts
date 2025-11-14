import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  Min,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  sku?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(0)
  price?: number;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  currency?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  inventoryCount?: number;

  @IsNumber()
  @IsOptional()
  @IsIn([0, 1])
  status?: ProductStatus;
}

