import crypto from 'crypto';

export const generateHash = (obj: any): string => {
  return crypto.createHash('md5').update(JSON.stringify(obj)).digest('hex');
};

export const booleanFilters = (filters: any, field: string) => {
  if (!filters) return filters;
  let filterField = filters[field];
  if (filterField) {
    if (typeof filterField === 'string') filterField = [filterField];

    if (filterField.indexOf('true') > -1 && filterField.indexOf('false') > -1)
      delete filters[field];
    else if (filterField.indexOf('true') > -1) filters[field] = true;
    else filters[field] = false;
  }
  return filters;
};
