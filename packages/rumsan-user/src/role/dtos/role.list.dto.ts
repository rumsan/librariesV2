import { PaginationDto } from '@rumsan/extensions/dtos/pagination.dto';
import { IsIn } from 'class-validator';

export class ListRoleDto extends PaginationDto {
  @IsIn(['createdAt'])
  override sort: string = 'createdAt';
  override order: 'asc' | 'desc' = 'desc';
}
