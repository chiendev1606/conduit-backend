import { Module } from '@nestjs/common';
import { CommentsServices } from './comments.service';

@Module({
  providers: [CommentsServices],
  exports: [CommentsServices],
})
export class CommentsModule {}
