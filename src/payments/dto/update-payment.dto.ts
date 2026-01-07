import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentDto } from './create-payment.dto';

class EditHistoryEntry {
  @IsString()
  editedAt: string;

  @IsString()
  editedBy: string;

  @IsString()
  reason: string;

  @IsOptional()
  previousValues?: any;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @IsString()
  @IsOptional()
  reviewedAt?: string;

  @IsString()
  @IsOptional()
  reviewedBy?: string;

  @IsString()
  @IsOptional()
  rejectedAt?: string;

  @IsString()
  @IsOptional()
  rejectedBy?: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditHistoryEntry)
  editHistory?: EditHistoryEntry[];
}
