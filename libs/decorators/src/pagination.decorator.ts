import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import _ from 'lodash';

export const Pagination = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const limit = _.chain(request).get('query.size', 10).toNumber().value();
    const page = _.chain(request).get('query.page', 1).toNumber().value();
    return { limit, page };
  },
);
