import { DatabaseServices } from '@conduit/database';
import { Injectable } from '@nestjs/common';
import { ArticlesServices } from '../articles/articles.service';
import { CreateEmotionDto } from './dto/create-emotion.dto';

@Injectable()
export class InteractionService {
  constructor(
    private readonly db: DatabaseServices,
    private readonly articlesService: ArticlesServices,
  ) {}

  async createEmotion({
    body,
    userId,
  }: {
    body: CreateEmotionDto;
    userId: string;
  }) {
    const { articleId, type } = body;
    await this.articlesService.findArticlesByIdOrThrow(articleId);

    await this.db.emotion.upsert({
      where: { userId_articleId: { userId, articleId } },
      update: { type },
      create: { articleId, userId, type },
    });

    return 'Emotion created successfully';
  }

  async deleteEmotion({
    userId,
    body,
  }: {
    userId: string;
    body: CreateEmotionDto;
  }) {
    const { articleId } = body;
    await this.db.emotion.delete({
      where: { userId_articleId: { userId, articleId } },
    });

    return 'Emotion deleted successfully';
  }

  async toggleFavorite({
    userId,
    body,
  }: {
    userId: string;
    body: CreateEmotionDto;
  }) {
    const { articleId } = body;
    await this.articlesService.findArticlesByIdOrThrow(articleId);
    const existingFavorite = await this.db.favorite.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });

    if (existingFavorite) {
      await this.db.favorite.delete({
        where: { userId_articleId: { userId, articleId } },
      });
    } else {
      await this.db.favorite.create({ data: { userId, articleId } });
    }

    return 'Favorite created successfully';
  }
}
