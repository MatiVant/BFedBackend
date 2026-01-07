import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class FileDto {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsString()
  @IsOptional()
  uploadedAt?: string;
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  amount: number;

  @IsEnum(['monthly', 'quarterly', 'annual', 'other'])
  type: 'monthly' | 'quarterly' | 'annual' | 'other';

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FileDto)
  file?: FileDto;

  @IsString()
  @IsOptional()
  adminNotes?: string;

  @IsString()
  @IsOptional()
  status?: 'pending' | 'approved' | 'rejected';

  @IsString()
  @IsOptional()
  createdAt?: string;

  @IsString()
  @IsOptional()
  approvedAt?: string;

  @IsString()
  @IsOptional()
  approvedBy?: string;

  @IsString()
  @IsOptional()
  attachmentName?: string;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;
}
