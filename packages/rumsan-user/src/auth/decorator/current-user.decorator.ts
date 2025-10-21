import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CUI } from '@rumsan/sdk/types';

export const CurrentUser = createParamDecorator(
  (data: undefined, ctx: ExecutionContext): CUI => {
    //(ctx: ExecutionContext): CurrentUserInterface => {
    const request = ctx.switchToHttp().getRequest();
    // if (data) {
    //   return request.user[data];
    // }
    return request.user;
  },
);

export const CU = CurrentUser;
