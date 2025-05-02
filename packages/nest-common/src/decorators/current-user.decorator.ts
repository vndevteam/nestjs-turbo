import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request['user']; // request['user'] is set in the AuthGuard

    return data ? user?.[data] : user;
  },
);
