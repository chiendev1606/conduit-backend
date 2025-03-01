import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesServices } from './articles.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesServices],
  exports: [ArticlesServices],
})
export class ArticlesModule {}
