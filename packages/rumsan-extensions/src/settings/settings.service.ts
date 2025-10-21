import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@rumsan/prisma/client';
import { Setting, SettingDataType } from '@rumsan/sdk';
import { paginator, PaginatorTypes } from '@rumsan/sdk/utils';
import { PROTECTED_SETTINGS } from '../constants';
import { CreateSettingsDto, ListSettingsDto, UpdateSettingsDto } from './dtos';
import { settingsUtils } from './settings.utils';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

// type PrismaClientType = Omit<
//   PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
//   '$on' | '$connect' | '$disconnect' | '$use' | '$transaction' | '$extends'
// >;

@Injectable()
export class SettingsService {
  private static data: any = {};
  constructor(private prisma: PrismaClient) {}

  public static get(path: string) {
    const keys = path.split('.');
    let value = SettingsService.data;

    for (let key of keys) {
      key = key.toUpperCase();
      if (!value[key]) {
        throw new Error(`Setting '${key}' not found.`);
      }
      value = value[key];
    }

    return value;
  }

  async getPublic(name: string) {
    // Ensure that the name is stored in uppercase
    const uppercaseName = settingsUtils.changeToUpperCase(name);
    const publicSetting = await this.prisma.setting.findUnique({
      where: { name: uppercaseName, isPrivate: false },
    });
    if (!publicSetting) {
      throw new Error(`Public setting '${uppercaseName}' not found`); // You can customize the error message
    }
    return publicSetting;
  }

  async list(query: ListSettingsDto) {
    const AND_CONDITIONS: Record<string, any>[] = [];

    if (query.name)
      AND_CONDITIONS.push({
        name: { contains: query.name, mode: 'insensitive' },
      });

    if (query.private !== undefined)
      AND_CONDITIONS.push({
        isPrivate: query.private,
      });

    if (query.readOnly !== undefined)
      AND_CONDITIONS.push({
        isReadOnly: query.readOnly,
      });

    const conditions = AND_CONDITIONS.length ? { AND: AND_CONDITIONS } : {};

    const select = {
      name: true,
      dataType: true,
      isPrivate: true,
      isReadOnly: true,
      requiredFields: true,
      value: true,
    };

    const rData = await paginate(
      this.prisma.setting,
      {
        where: { ...conditions },
        select,
      },
      {
        page: query.page,
        perPage: query.perPage,
      },
    );

    rData.data = rData.data?.map((item: any) => ({
      ...item,
      value: item.isPrivate ? PROTECTED_SETTINGS : item.value,
      requiredFields: item.isPrivate
        ? [PROTECTED_SETTINGS]
        : item.requiredFields,
    }));

    return rData;
  }

  async load() {
    const publicSettings = await this.prisma.setting.findMany();
    const result: any = {};
    for (const setting of publicSettings) {
      result[setting.name] = setting.value;
    }
    Logger.log('Settings Loaded from Database', SettingsService.name);
    SettingsService.data = result;
  }

  async getSettingsByName(name: string) {
    const setting = await this.prisma.setting.findUnique({
      where: {
        name,
      },
    });

    if (!setting) {
      throw new Error('Setting not Found.');
    }

    return setting;
  }

  async update(name: string, dto: UpdateSettingsDto) {
    const { isPrivate, isReadOnly, value: dtoValue, requiredFields } = dto;

    name = settingsUtils.changeToUpperCase(name);
    const setting = await this.getSettingsByName(name);

    settingsUtils.validateReadOnly(setting);
    let value = dtoValue;
    const requiredFieldsArray =
      settingsUtils.formatRequiredFields(requiredFields);

    const dataType = settingsUtils.getDataType(value);

    // Handle value if Object
    if (dataType == SettingDataType.OBJECT) {
      value = settingsUtils.handleObjectValue(value, requiredFieldsArray);
    } else {
      // If value isn't an object, ensure no required fields
      requiredFieldsArray.length = 0;
    }
    const updatedData = await this.prisma.setting.update({
      where: {
        name,
      },
      data: {
        value,
        requiredFields: requiredFieldsArray,
        isPrivate,
        isReadOnly,
      },
    });
    this.load();
    return updatedData;
  }

  private listValidSettingsName() {
    return Object.keys(SettingsService.data).join(', ');
  }

  //   Ensures that the name is stored in uppercase.
  //   Converts the items in requiredFields to uppercase if they exist.
  //   Checks if value is an object and not an array or null.
  //   Validates that the value object has all the properties specified in requiredFields in a case-insensitive manner.
  //   Capitalizes keys of the value object without changing the values.
  //   If value is not an o,bject, it sets requiredFields to an empty array [].

  //DO NOT EXPOSE THIS USING CONTROLLER
  async create(createSettingDto: CreateSettingsDto, prisma: any = this.prisma) {
    const {
      name: originalName,
      value: dtoValue,
      requiredFields,
      isReadOnly,
      isPrivate,
    } = createSettingDto;

    const name = settingsUtils.changeToUpperCase(originalName);
    let value = dtoValue;
    const requiredFieldsArray =
      settingsUtils.formatRequiredFields(requiredFields);

    const dataType = settingsUtils.getDataType(value);

    // Handle value if it's an Object
    if (dataType === SettingDataType.OBJECT) {
      value = settingsUtils.handleObjectValue(value, requiredFieldsArray);
    } else {
      // If 'value' is not an object, ensure no required fields
      requiredFieldsArray.length = 0;
    }

    await settingsUtils.ensureSettingDoesNotExist(name, prisma);

    const newSetting = await prisma.setting.create({
      data: {
        name,
        value,
        dataType,
        requiredFields: requiredFieldsArray,
        isReadOnly,
        isPrivate,
      },
    });

    this.load();
    return newSetting;
  }

  //DO NOT EXPOSE THIS USING CONTROLLER
  async bulkCreate(createSettingDtos: CreateSettingsDto[]) {
    const createdSettings: Setting[] = [];
    await this.prisma.$transaction(async (prisma) => {
      for (const createSettingDto of createSettingDtos) {
        const newSetting = await this.create(createSettingDto, prisma);
        createdSettings.push(newSetting);
      }
    });
    return createdSettings;
  }

  //DO NOT EXPOSE THIS USING CONTROLLER
  async delete(name: string) {
    // Ensure that the name is stored in uppercase
    const uppercaseName = settingsUtils.changeToUpperCase(name);

    // Check if the setting exists in the database
    const existingSetting = await this.prisma.setting.findUnique({
      where: { name: uppercaseName },
    });

    if (!existingSetting) {
      throw new Error(
        `Setting '${uppercaseName}' not found. Valid settings: ${this.listValidSettingsName()}`,
      );
    }

    // Delete the setting
    await this.prisma.setting.delete({ where: { name: uppercaseName } });

    return this.listAll();
  }

  //DO NOT EXPOSE THIS USING CONTROLLER
  async listAll() {
    return this.prisma.setting.findMany();
  }

  async getByName(name: string) {
    const uppercaseName = name.toUpperCase();

    const rData = await this.prisma.setting.findUnique({
      where: { name: uppercaseName },
      select: {
        name: true,
        dataType: true,
        isPrivate: true,
        isReadOnly: true,
        requiredFields: true,
        value: true,
      },
    });

    if (rData?.isPrivate) {
      rData.value = PROTECTED_SETTINGS;
      rData.requiredFields = [PROTECTED_SETTINGS];
    }

    return rData;
  }
}
