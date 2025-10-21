import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@rumsan/extensions/dtos/pagination.dto';
import { SignupStatus } from '@rumsan/sdk/types';
import { EnumUtils } from '@rumsan/sdk/utils';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class SignupListDto extends PaginationDto {
  @ApiProperty({
    example: 'pending',
    description: 'Signup status',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @IsIn(EnumUtils.enumToArray(SignupStatus))
  status: SignupStatus;

  @IsIn(['status', 'createdAt'])
  override sort: string = 'createdAt';
  override order: 'asc' | 'desc' = 'desc';
}
