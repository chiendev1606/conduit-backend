import { Identify } from '@conduit/decorators/identify.decorator';
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
import { ArticlesServices } from './articles.service';
import { Pagination } from '@conduit/decorators/pagination.decorator';
import { PaginationQuery } from '@conduit/decorators';
import { ApiOperationDecorator } from '@conduit/decorators/api-operation.decorator';
import { PaginationResponseInterceptor } from '@conduit/interceptors';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateEmotionDto } from '../interaction/dto/create-emotion.dto';
import { InteractionService } from '../interaction/interaction.service';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesServices,
    private readonly interactionService: InteractionService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get()
  @UseInterceptors(PaginationResponseInterceptor)
  @ApiOperationDecorator({
    summary: 'Get article list',
    description: 'Get article list',
    operationId: 'getArticleList',
  })
  async getArticleList(@Pagination() pagination: PaginationQuery) {
    return this.articlesService.getArticleList({ pagination });
  }

  @Get(':id')
  @ApiOperationDecorator({
    summary: 'Get article by id',
    description: 'Get article by id',
    operationId: 'getArticleById',
  })
  async getArticleById(@Param('id') id: string) {
    return this.articlesService.getArticleById(id);
  }

  @ApiOperationDecorator({
    summary: 'Get articles by user id',
    description: 'Get articles by user id',
    operationId: 'getArticlesByUserId',
  })
  @UseInterceptors(PaginationResponseInterceptor)
  @Get('feed')
  async getArticlesByUserId(
    @Pagination() pagination: PaginationQuery,
    @Identify('id') userId: string,
  ) {
    return this.articlesService.getArticlesByUserId({ userId, pagination });
  }

  @Post()
  @ApiOperationDecorator({
    summary: 'Create article',
    description: 'Create article',
    operationId: 'createArticle',
  })
  async createArticle(@Body() body: CreateArticleDto) {
    return this.articlesService.createArticle(body);
  }

  @Post('emotions')
  @ApiOperationDecorator({
    summary: 'Create emotion',
    description: 'Create emotion',
    operationId: 'createEmotion',
  })
  async createEmotion(
    @Body() body: CreateEmotionDto,
    @Identify('id') userId: string,
  ) {
    return this.interactionService.createEmotion({ body, userId });
  }

  @Delete('emotions')
  @ApiOperationDecorator({
    summary: 'Delete emotion',
    description: 'Delete emotion',
    operationId: 'deleteEmotion',
  })
  async deleteEmotion(
    @Body() body: CreateEmotionDto,
    @Identify('id') userId: string,
  ) {
    return this.interactionService.deleteEmotion({ userId, body });
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
    return this.articlesService.getArticlesByUserId({ userId, pagination });
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
    return this.commentsService.getCommentsByArticleId({
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
    return this.articlesService.updateArticle({ id, body });
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
    return this.commentsService.createComment(body, userId);
  }

  @Post(':id/favorites')
  @ApiOperationDecorator({
    summary: 'Toggle favorite',
    description: 'Toggle favorite',
    operationId: 'toggleFavorite',
  })
  async toggleFavorite(
    @Body() body: CreateEmotionDto,
    @Identify('id') userId: string,
  ) {
    return this.interactionService.toggleFavorite({ userId, body });
  }
}
