import { DynamicModule, Module } from '@nestjs/common';
import { PrismaClient } from '@rumsan/prisma/client';
import { AbilityModule } from '../ability/ability.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AbilityModule.forRoot()],
  providers: [UsersService, PrismaClient],
  exports: [UsersService],
})
export class UsersModule {
  public static forRoot(): DynamicModule {
    return {
      module: UsersModule,
      controllers: [UsersController],
    };
  }
}
