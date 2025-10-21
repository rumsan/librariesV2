import { DynamicModule, Module } from '@nestjs/common';
import { PrismaClient } from '@rumsan/prisma/client';
import { SignupConfig } from '@rumsan/sdk/types';
import { UsersModule } from '../user/users.module';
import { SignupController } from './signups.controller';
import { SignupsService } from './signups.service';

@Module({
  imports: [UsersModule],
  controllers: [SignupController],
  exports: [SignupsService, PrismaClient],
})
export class SignupModule {
  static forRoot(options: SignupConfig): DynamicModule {
    return {
      module: SignupModule,

      providers: [
        {
          provide: 'SIGNUP_CONFIG',
          useValue: options,
        },
        SignupsService,
      ],
    };
  }
}
