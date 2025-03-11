import { DatabaseServices } from '@conduit/database';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmotionDto } from './dto/create-emotion.dto';

@Injectable()
export class InteractionService {
  constructor(private readonly db: DatabaseServices) {}

  async createEmotion({
    body,
    userId,
    articleId,
  }: {
    body: CreateEmotionDto;
    userId: string;
    articleId: string;
  }) {
    const { type } = body;

    await this.db.emotion.upsert({
      where: { userId_articleId: { userId, articleId } },
      update: { type },
      create: { articleId, userId, type },
    });

    return 'Emotion created successfully';
  }

  async deleteEmotion({
    userId,
    articleId,
  }: {
    userId: string;
    articleId: string;
  }) {
    await this.db.emotion.delete({
      where: { userId_articleId: { userId, articleId } },
    });

    return 'Emotion deleted successfully';
  }

  async findUniqueFavorite({
    userId,
    articleId,
  }: {
    userId: string;
    articleId: string;
  }) {
    return this.db.favorite.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
  }

  async createFavorite({
    userId,
    articleId,
  }: {
    userId: string;
    articleId: string;
  }) {
    const existingFavorite = await this.findUniqueFavorite({
      userId,
      articleId,
    });

    if (existingFavorite)
      throw new BadRequestException('Article already favorite');

    await this.db.favorite.create({ data: { userId, articleId } });

    return 'Favorite created successfully';
  }

  async deleteFavorite({
    userId,
    articleId,
  }: {
    userId: string;
    articleId: string;
  }) {
    const existingFavorite = await this.findUniqueFavorite({
      userId,
      articleId,
    });

    if (!existingFavorite) throw new NotFoundException('Favorite not found');

    await this.db.favorite.delete({
      where: { userId_articleId: { userId, articleId } },
    });
  }
}
