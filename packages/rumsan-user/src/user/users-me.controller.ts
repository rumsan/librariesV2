import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { CUI, tRC } from '@rumsan/sdk/types';
import { CU, CurrentUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { APP } from '../constants';
import { UpdateUserDto } from './dtos';
import { UsersService } from './users.service';

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard)
export class UsersMeController {
  constructor(private userService: UsersService) {}

  @Get()
  async getMe(@CurrentUser() cu: CUI) {
    const user = await this.userService.get(cu.cuid);
    return { ...user, permissions: cu.permissions, roles: cu.roles };
  }

  @Patch()
  updateMe(@CU() cu: CUI, @Body() dto: UpdateUserDto, @xRC() rdetails: tRC) {
    return this.userService.updateMe(cu.cuid, dto, rdetails);
  }
}
