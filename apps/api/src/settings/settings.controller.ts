import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingDataType } from '@rumsan/prisma';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findAll() {
    return this.settingsService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return this.settingsService.findOne(name);
  }

  @Post()
  async create(@Body() data: {
    name: string;
    value: any;
    dataType: SettingDataType;
    requiredFields?: string[];
    isReadOnly?: boolean;
    isPrivate?: boolean;
  }) {
    return this.settingsService.create(data);
  }

  @Put(':name')
  async update(@Param('name') name: string, @Body() data: {
    value?: any;
    dataType?: SettingDataType;
    requiredFields?: string[];
    isReadOnly?: boolean;
    isPrivate?: boolean;
  }) {
    return this.settingsService.update(name, data);
  }

  @Delete(':name')
  async delete(@Param('name') name: string) {
    return this.settingsService.delete(name);
  }
}