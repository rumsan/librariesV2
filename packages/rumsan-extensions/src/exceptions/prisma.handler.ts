import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@rumsan/prisma/client/runtime/library';
import { PRISMA_ERROR_TO_HTTP } from '../constants/prisma.types';

export const handleClientKnownRequestError = (
  error: PrismaClientKnownRequestError,
) => {
  if (PRISMA_ERROR_TO_HTTP[error.code]) {
    return {
      statusCode: PRISMA_ERROR_TO_HTTP[error.code],
      message:
        error.meta?.['cause'] ||
        (error.meta?.['message'] as string) ||
        'Internal Server Error.',
    };
  }

  return {
    statusCode: 500,
    message: 'Internal Server Error.',
  };
};

export const handleClientUnknownRequestError = (
  error: PrismaClientUnknownRequestError,
) => {
  return {
    statusCode: 'UNKNOWN',
    message: error.message || 'Internal Server Error.',
  };
};
