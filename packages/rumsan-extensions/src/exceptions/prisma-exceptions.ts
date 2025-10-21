//import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaClientKnownRequestError } from '@rumsan/prisma/client/runtime/library';
import { shortenPrismaMessage } from '../utils/prisma.utils';

export const PrismaFriendlyErrorMessage = (
  exception: PrismaClientKnownRequestError,
) => {
  let message = exception.message || 'Error occured';
  let httpCode = 500;

  if (exception.code === 'P2002') {
    let field = 'Unknown';
    if (
      exception.meta !== undefined &&
      exception.meta['target'] !== undefined
    ) {
      field = (<[]>exception.meta['target']).join('.');
    }
    message = `Duplicate entry in [${field}] is not allowed.`;
  } else if (exception.code === 'P2025') {
    httpCode = 404;
  } else {
    message = shortenPrismaMessage(exception.message);
  }
  return { message, httpCode };
};

// case 'P2002': {
//   const status = HttpStatus.CONFLICT;
//   response.status(status).send({
//     statusCode: status,
//     message: message,
//   });
//   break;
// }
// case 'P2025': {
//   const status = HttpStatus.BAD_REQUEST;
//   response.status(status).send({
//     statusCode: status,
//     message: message,
//   });
//   break;
// }
