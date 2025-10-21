import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@rumsan/prisma/client';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Global()
@Module({
  controllers: [SettingsController],
  providers: [PrismaClient, SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {
  constructor(private readonly settingsService: SettingsService) {
    settingsService.load();
  }
}
