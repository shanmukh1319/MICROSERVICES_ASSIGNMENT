import { IsOptional, IsString, IsInt, Min, IsIn, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities/order.entity';

export class QueryOrdersDto {
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
  @IsIn(['orderNumber', 'totalAmount', 'createdAt', 'updatedAt', 'status'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status?: OrderStatus;
}

