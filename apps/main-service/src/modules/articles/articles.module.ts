import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesServices } from './articles.service';
import { CommentsModule } from '../comments/comments.module';
import { InteractionModule } from '../interactions/interaction.module';

@Module({
  imports: [CommentsModule, InteractionModule],
  controllers: [ArticlesController],
  providers: [ArticlesServices],
  exports: [ArticlesServices],
})
export class ArticlesModule {}
