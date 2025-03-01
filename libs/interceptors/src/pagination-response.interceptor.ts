import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

type PaginationResponse = {
  total: number;
  page: number;
  size: number;
};

@Injectable()
export class PaginationResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(({ total, size, page, ...rest }: PaginationResponse) => ({
        ...rest,
        meta: {
          total,
          page,
          size,
        },
      })),
    );
  }
}
