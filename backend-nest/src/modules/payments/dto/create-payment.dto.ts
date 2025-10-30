import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}

export class RefundPaymentDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}