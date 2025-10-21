import { ApiProperty } from '@nestjs/swagger';
import { isCuid } from '@paralleldrive/cuid2';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class WalletLoginDto {
  @IsString()
  @IsNotEmpty()
  signature: `0x${string}`;

  @IsString()
  @IsNotEmpty()
  challenge: string;
}

export class WalletLoginChallengeDto {
  @ApiProperty({
    example: '105cd449-53f6-44e4-85f3-feaa7d762ffa',
  })
  @ValidateIf((o) => isCuid(o.clientId))
  @IsOptional()
  clientId: string;
}
