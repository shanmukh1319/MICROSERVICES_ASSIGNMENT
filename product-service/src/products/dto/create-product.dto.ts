import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsIn,
  Min,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(0)
  price: number;

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

