import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { Setting, SettingDataType } from '@rumsan/prisma';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Setting[]> {
    return this.prisma.setting.findMany();
  }

  async findOne(name: string): Promise<Setting | null> {
    return this.prisma.setting.findUnique({
      where: { name },
    });
  }

  async create(data: {
    name: string;
    value: any;
    dataType: SettingDataType;
    requiredFields?: string[];
    isReadOnly?: boolean;
    isPrivate?: boolean;
  }): Promise<Setting> {
    return this.prisma.setting.create({
      data: {
        name: data.name,
        value: data.value,
        dataType: data.dataType,
        requiredFields: data.requiredFields || [],
        isReadOnly: data.isReadOnly || false,
        isPrivate: data.isPrivate || true,
      },
    });
  }

  async update(name: string, data: {
    value?: any;
    dataType?: SettingDataType;
    requiredFields?: string[];
    isReadOnly?: boolean;
    isPrivate?: boolean;
  }): Promise<Setting> {
    return this.prisma.setting.update({
      where: { name },
      data,
    });
  }

  async delete(name: string): Promise<Setting> {
    return this.prisma.setting.delete({
      where: { name },
    });
  }
}