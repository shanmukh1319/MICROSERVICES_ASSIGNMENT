import { IsString, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  quantity: number;
}

