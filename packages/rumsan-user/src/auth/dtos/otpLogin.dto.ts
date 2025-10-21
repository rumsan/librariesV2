import { ApiProperty } from '@nestjs/swagger';
import { isCuid } from '@paralleldrive/cuid2';
import { AuthService } from '@rumsan/sdk/types';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class OtpDto {
  @ApiProperty({
    example: 'rumsan@maile.uk',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'EMAIL',
  })
  service?: AuthService | null;

  @ApiProperty({
    example: '105cd449-53f6-44e4-85f3-feaa7d762ffa',
  })
  @ValidateIf((o) => isCuid(o.clientId))
  @IsOptional()
  clientId?: string;
}

export class OtpLoginDto {
  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty()
  challenge: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: 'EMAIL',
  })
  service: AuthService | null;
}
