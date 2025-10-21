import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaClient } from '@rumsan/prisma/client';
import { AuthsController } from './auths.controller';
import { AuthsService } from './auths.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({}), PassportModule, ConfigModule],
  controllers: [AuthsController],
  providers: [AuthsService, JwtStrategy, PrismaClient],
  exports: [AuthsService],
})
export class AuthsModule {}
