import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSettingsDto, ListSettingsDto, UpdateSettingsDto } from './dtos';
import { SettingsService } from './settings.service';

@Controller('settings')
@ApiTags('Settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('')
  list(@Query() query: ListSettingsDto) {
    return this.settingsService.list(query);
  }

  @Post('')
  create(@Body() createSettingsDto: CreateSettingsDto) {
    return this.settingsService.create(createSettingsDto);
  }

  @Get(':name')
  get(@Param('name') name: string) {
    return this.settingsService.getByName(name);
  }

  @Patch(':name')
  update(@Param('name') name: string, @Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(name, dto);
  }
}
