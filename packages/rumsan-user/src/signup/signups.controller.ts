import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../ability/ability.decorator';
import { AbilitiesGuard } from '../ability/ability.guard';
import { JwtGuard } from '../auth/guard';
import { ACTIONS, APP, SUBJECTS } from '../constants';
import {
  SignupApproveDto,
  SignupEmailDto,
  SignupListDto,
  SignupPhoneDto,
  SignupWalletDto,
} from './dtos';
import { SignupsService } from './signups.service';

@Controller('signup')
@ApiTags('Signup')
@ApiBearerAuth(APP.JWT_BEARER)
export class SignupController {
  constructor(private service: SignupsService) {}

  @Post('email')
  signupUsingEmail(@Body() dto: SignupEmailDto) {
    return this.service.signup(dto);
  }

  @Post('phone')
  signupUsingPhone(@Body() dto: SignupPhoneDto) {
    return this.service.signup(dto);
  }

  @Post('wallet')
  signupUsingWallet(@Body() dto: SignupWalletDto) {
    return this.service.signup(dto);
  }

  @Post('social')
  signupUsingSocial(@Body() dto: SignupWalletDto) {
    return this.service.signup(dto);
  }

  @Get('')
  list(@Query() dto: SignupListDto) {
    return this.service.list(dto);
  }

  @Post('approve')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.MANAGE, subject: SUBJECTS.USER })
  approve(@Body() dto: SignupApproveDto) {
    return this.service.approve(dto);
  }
}
