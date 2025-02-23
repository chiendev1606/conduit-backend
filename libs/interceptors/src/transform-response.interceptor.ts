import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { omit } from 'lodash';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const omitFields = ['password'];

    return next.handle().pipe(
      map((data) => ({
        status: statusCode,
        data: omit(data, omitFields),
      })),
    );
  }
}
