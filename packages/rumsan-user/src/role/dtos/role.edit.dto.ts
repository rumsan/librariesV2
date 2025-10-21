import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './roles.create.dto';

export class EditRoleDto extends PartialType(CreateRoleDto) {
  override name: string;
}
