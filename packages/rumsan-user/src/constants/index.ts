export { ERRORS } from './errors';
export * from './events';

//TODO: Move to rumsan-sdk
// For Ability Guard
export const ACTIONS = {
  MANAGE: 'manage',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  READ: 'read',
  VERIFY: 'verify',
  APPROVE: 'approve',
  RESTORE: 'restore',
};

// For Ability Guard
export const SUBJECTS = {
  ALL: 'all',
  PUBLIC: 'public',
  USER: 'user',
  ROLE: 'role',
};

//TODO: Move to rumsan-sdk
export const APP = {
  JWT_BEARER: 'JWT',
};

//TODO: Move to rumsan-sdk
export const CLIENT_TOKEN_LIFETIME = 600;
