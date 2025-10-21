import { SettingDataType } from '@rumsan/sdk';

export const settingsUtils = {
  changeToUpperCase(value: string) {
    return value.toUpperCase();
  },

  formatRequiredFields(fields?: string[]): string[] {
    return fields
      ? fields.map((field) => settingsUtils.changeToUpperCase(field))
      : [];
  },

  handleObjectValue(value: any, requiredFields: string[]): any {
    const formattedValue = settingsUtils.capitalizeObjectKeys(value);
    if (requiredFields.length > 0) {
      settingsUtils.validateRequiredFields(formattedValue, requiredFields);
      return settingsUtils.filterObjectByRequiredFields(
        formattedValue,
        requiredFields,
      );
    }
    return formattedValue;
  },

  validateRequiredFields(value: Record<string, any>, requiredFields: string[]) {
    const missingFields = requiredFields.filter(
      (field) => !Object.keys(value).includes(field),
    );
    if (missingFields.length > 0) {
      throw new Error(
        `Required fields missing in 'value' object: ${missingFields.join(', ')}`,
      );
    }
  },

  filterObjectByRequiredFields(
    value: Record<string, any>,
    requiredFields: string[],
  ): Record<string, any> {
    return Object.keys(value)
      .filter((key) => requiredFields.includes(key))
      .reduce(
        (filtered: Record<string, any>, key: string) => {
          filtered[key] = value[key];
          return filtered;
        },
        {} as Record<string, any>,
      );
  },

  capitalizeObjectKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      // Return the value if it's not an object
      return obj;
    }

    if (Array.isArray(obj)) {
      // Return the array as is since we only capitalize the first level of keys
      return obj;
    }

    // Process only the first level of key-value pairs in the object
    const upperCaseObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        upperCaseObj[key.toUpperCase()] = obj[key];
      }
    }
    return upperCaseObj;
  },

  async ensureSettingDoesNotExist(name: string, prisma: any) {
    const existingSetting = await prisma.setting.findUnique({
      where: { name },
    });

    if (existingSetting) {
      throw new Error('Setting with this name already exists.');
    }
  },

  validateReadOnly(setting: any) {
    if (setting.isReadOnly) {
      throw new Error(
        `Setting ${setting.name} is read only and cannot be updated`,
      );
    }
  },

  getDataType(value: string | number | boolean | object): SettingDataType {
    if (typeof value === 'string') {
      return SettingDataType.STRING;
    } else if (typeof value === 'number') {
      return SettingDataType.NUMBER;
    } else if (typeof value === 'boolean') {
      return SettingDataType.BOOLEAN;
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      return SettingDataType.OBJECT;
    }
    throw new Error(`Invalid data type for 'value': ${typeof value}`);
  },
};
