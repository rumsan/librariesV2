import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { tRC } from '@rumsan/sdk/types';
import { AuthsService } from './auths.service';
import {
  ChallengeDto,
  GoogleAuthDto,
  OtpDto,
  OtpLoginDto,
  WalletLoginDto,
} from './dtos';

@Controller('auth')
@ApiTags('Auth')
export class AuthsController {
  constructor(private authService: AuthsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  loginOtp(@Body() dto: OtpLoginDto, @xRC() rdetails: tRC) {
    return this.authService.loginByOtp(dto, rdetails);
  }

  @HttpCode(HttpStatus.OK)
  @Post('otp')
  getOtp(@Body() dto: OtpDto, @xRC() rdetails: tRC) {
    return this.authService.getOtp(dto, rdetails);
  }

  @Post('wallet')
  walletLogin(@Body() dto: WalletLoginDto, @xRC() rdetails: tRC) {
    return this.authService.loginByWallet(dto, rdetails);
  }

  @Post('google')
  googleLogin(@Body() dto: GoogleAuthDto, @xRC() rdetails: tRC) {
    return this.authService.loginByGoogle(dto, rdetails);
  }
  @Post('challenge')
  getChallenge(@Body() dto: ChallengeDto, @xRC() rdetails: tRC) {
    return this.authService.getChallengeForWallet(dto, rdetails);
  }
}
