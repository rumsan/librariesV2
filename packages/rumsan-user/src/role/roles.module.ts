import { Module } from '@nestjs/common';
import { PrismaClient } from '@rumsan/prisma/client';
import { AbilityModule } from '../ability/ability.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [AbilityModule.forRoot()],
  controllers: [RolesController],
  providers: [RolesService, PrismaClient],
  exports: [RolesService],
})
export class RolesModule {}
