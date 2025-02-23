import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Identify = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.userIdentify[data]
      ? request.userIdentify[data]
      : request.userIdentify;
  },
);
