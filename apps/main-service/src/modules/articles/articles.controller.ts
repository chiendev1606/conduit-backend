import { PaginationQuery } from '@conduit/decorators';
import { ApiOperationDecorator } from '@conduit/decorators/api-operation.decorator';
import { Identify } from '@conduit/decorators/identify.decorator';
import { Pagination } from '@conduit/decorators/pagination.decorator';
import { PaginationResponseInterceptor } from '@conduit/interceptors';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsServices } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { CreateEmotionDto } from '../interactions/dto/create-emotion.dto';
import { InteractionService } from '../interactions/interaction.service';
import { ArticlesServices } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articleServices: ArticlesServices,
    private readonly interactionServices: InteractionService,
    private readonly commentsServices: CommentsServices,
  ) {}

  @Get()
  @UseInterceptors(PaginationResponseInterceptor)
  @ApiOperationDecorator({
    summary: 'Get article list',
    description: 'Get article list',
    operationId: 'getArticleList',
  })
  async getArticleList(@Pagination() pagination: PaginationQuery) {
    return this.articleServices.getArticleList({ pagination });
  }

  @Get(':id')
  @ApiOperationDecorator({
    summary: 'Get article by id',
    description: 'Get article by id',
    operationId: 'getArticleById',
  })
  async getArticleById(@Param('id') id: string) {
    return this.articleServices.getArticleById(id);
  }

  @ApiOperationDecorator({
    summary: 'Get articles by user id',
    description: 'Get articles by user id',
    operationId: 'getArticlesByUserId',
  })
  @UseInterceptors(PaginationResponseInterceptor)
  @Get('users-feed')
  async getArticlesByUserId(
    @Pagination() pagination: PaginationQuery,
    @Identify('id') userId: string,
  ) {
    return this.articleServices.getPersonalFeed({ userId, pagination });
  }

  @Post()
  @ApiOperationDecorator({
    summary: 'Create article',
    description: 'Create article',
    operationId: 'createArticle',
  })
  async createArticle(@Body() body: CreateArticleDto) {
    return this.articleServices.createArticle(body);
  }

  @Post(':id/emotions')
  @ApiOperationDecorator({
    summary: 'Create emotion',
    description: 'Create emotion',
    operationId: 'createEmotion',
  })
  async createEmotion(
    @Body() body: CreateEmotionDto,
    @Identify('id') userId: string,
    @Param('id') articleId: string,
  ) {
    return this.articleServices.createEmotionForArticle({
      userId,
      body,
      articleId,
    });
  }

  @Delete(':id/emotions')
  @ApiOperationDecorator({
    summary: 'Delete emotion',
    description: 'Delete emotion',
    operationId: 'deleteEmotion',
  })
  async deleteEmotion(
    @Param('id') articleId: string,
    @Identify('id') userId: string,
  ) {
    return this.articleServices.deleteEmotionForArticle({
      userId,
      articleId,
    });
  }

  @Get('users')
  @ApiOperationDecorator({
    summary: 'Get users by article id',
    description: 'Get users by article id',
    operationId: 'getUsersByArticleId',
  })
  @UseInterceptors(PaginationResponseInterceptor)
  async getUsersByArticleId(
    @Identify('id') userId: string,
    @Pagination() pagination: PaginationQuery,
  ) {
    return this.articleServices.getArticlesByUserId({ userId, pagination });
  }

  @Get(':id/comments')
  @ApiOperationDecorator({
    summary: 'Get comments by article id',
    description: 'Get comments by article id',
    operationId: 'getCommentsByArticleId',
  })
  @UseInterceptors(PaginationResponseInterceptor)
  async getCommentsByArticleId(
    @Param('id') articleId: string,
    @Pagination() pagination: PaginationQuery,
  ) {
    return this.commentsServices.getCommentsByArticleId({
      articleId,
      pagination,
    });
  }

  @Put(':id')
  @ApiOperationDecorator({
    summary: 'Update article',
    description: 'Update article',
    operationId: 'updateArticle',
  })
  async updateArticle(@Body() body: CreateArticleDto, @Param('id') id: string) {
    return this.articleServices.updateArticle({ id, body });
  }

  @Post(':id/comments')
  @ApiOperationDecorator({
    summary: 'Create comment',
    description: 'Create comment',
    operationId: 'createComment',
  })
  async createComment(
    @Body() body: CreateCommentDto,
    @Identify('id') userId: string,
  ) {
    return this.articleServices.createCommentInArticle({
      body,
      userId,
    });
  }

  @Post(':id/favorites')
  @ApiOperationDecorator({
    summary: 'Create favorite',
    description: 'Create favorite',
    operationId: 'createFavorite',
  })
  async createFavorite(
    @Identify('id') userId: string,
    @Param('id') articleId: string,
  ) {
    return this.interactionServices.createFavorite({ userId, articleId });
  }

  @Delete(':id/favorites')
  @ApiOperationDecorator({
    summary: 'Delete favorite',
    description: 'Delete favorite',
    operationId: 'deleteFavorite',
  })
  async deleteFavorite(
    @Identify('id') userId: string,
    @Param('id') articleId: string,
  ) {
    return this.articleServices.deleteFavoriteForArticle({
      userId,
      articleId,
    });
  }

  @Get('favorites')
  @ApiOperationDecorator({
    summary: 'Get favorite articles',
    description: 'Get favorite articles',
    operationId: 'getFavoriteArticles',
  })
  @UseInterceptors(PaginationResponseInterceptor)
  async getFavoriteArticles(
    @Pagination() pagination: PaginationQuery,
    @Identify('id') userId: string,
  ) {
    return this.articleServices.getFavoriteArticleByUserId({
      userId,
      pagination,
    });
  }
}
