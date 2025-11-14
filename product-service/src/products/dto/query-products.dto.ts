import { IsOptional, IsString, IsInt, Min, IsIn, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../entities/product.entity';

export class QueryProductsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['name', 'price', 'createdAt', 'updatedAt', 'inventoryCount'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1])
  status?: ProductStatus;
}

