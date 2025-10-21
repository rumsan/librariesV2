import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@rumsan/sdk/types';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto implements UpdateUserDto {
  @ApiProperty({
    example: 'FEMALE',
    description: 'Gender of the User',
  })
  @IsOptional()
  @IsString()
  @IsEnum(Gender)
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';

  @ApiProperty({
    description: 'Custom details of the User',
  })
  @IsOptional()
  details: Record<string, any>;

  @ApiProperty({
    example: 'jane@rumsan.com',
    description: 'Email of the User',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '9841234567',
    description: 'Phone number of the User',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Wallet address of the User',
  })
  @IsString()
  @IsOptional()
  wallet?: string;
}
