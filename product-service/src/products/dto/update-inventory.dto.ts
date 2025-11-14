import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

