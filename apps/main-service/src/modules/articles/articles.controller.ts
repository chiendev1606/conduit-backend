import { ApiOperationDecorator, Public } from '@conduit/decorators';
import { Identify } from '@conduit/decorators/identify.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { ArticlesResponseWrapperDto } from './dto/article-response.dto';
import {
  CreateCommentRequestDto,
  CreateCommentResponseWrapperDto,
  GetCommentsResponseDto,
} from './dto/comments.dto';
import {
  CreateArticleResponseDtoWrapper,
  RequestCreateArticleDto,
} from './dto/create-article.dto';
import { FavoriteArticleResponseWrapperDto } from './dto/favorite-article.dto';
import { FindArticleBySlugResponseDtoWrapper } from './dto/find-article-by-slug.dto';
import { FindArticlesQueryDto } from './dto/find-articles-query.dto';
import { GetFeedsDto } from './dto/get-feeds.dto';
import {
  RequestUpdateArticleDto,
  UpdateArticleResponseWrapperDto,
} from './dto/update-article.dto';
import { GetPopularTagsResponseWrapperDto } from './dto/tag-response.dto';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperationDecorator({
    summary: 'Get articles',
    description: 'Get articles',
    operationId: 'getArticles',
    type: ArticlesResponseWrapperDto,
  })
  @Public()
  async getArticles(
    @Query() query: FindArticlesQueryDto,
    @Identify('id') userId: number,
  ) {
    const { articleCount, articles } = await this.articlesService.findArticles(
      query,
      userId,
    );
    return new ArticlesResponseWrapperDto(
      articles.map((article) => ({
        ...article,
        favorited: article.favoritedBy.some((user) => user.id === userId),
        favoritesCount: article.favoritedBy.length,
        tagList: article.tagList.map((tag) => tag.name),
      })),
      articleCount,
    );
  }

  @Get('feeds')
  @ApiOperationDecorator({
    summary: 'Get feeds',
    description: 'Get feeds',
    operationId: 'getFeeds',
    type: ArticlesResponseWrapperDto,
  })
  @ApiBearerAuth()
  async getFeeds(@Identify('id') userId: number, @Query() query: GetFeedsDto) {
    const { articleCount, articles } = await this.articlesService.getFeeds(
      userId,
      query,
    );
    return new ArticlesResponseWrapperDto(
      articles.map((article) => ({
        ...article,
        tagList: article.tagList.map((tag) => tag.name),
        author: {
          ...article.author,
          following: true,
        },
        favorited: article.favoritedBy.some((user) => user.id === userId),
        favoritesCount: article.favoritedBy.length,
      })),

      articleCount,
    );
  }

  @Post()
  @ApiOperationDecorator({
    summary: 'Create article',
    description: 'Create article',
    operationId: 'createArticle',
    type: CreateArticleResponseDtoWrapper,
  })
  @ApiBearerAuth()
  async createArticle(
    @Body() data: RequestCreateArticleDto,
    @Identify('id') userId: number,
  ) {
    const article = await this.articlesService.createArticle(
      data.article,
      userId,
    );

    return new CreateArticleResponseDtoWrapper(
      article,
      article.tagList.map((tag) => tag.name),
      article.author as any,
    );
  }

  @Get('tags')
  @Public()
  @ApiOperationDecorator({
    summary: 'Get popular tags',
    description: 'Get popular tags',
    operationId: 'getPopularTags',
    type: GetPopularTagsResponseWrapperDto,
  })
  async getPopularTags() {
    const tags = await this.articlesService.getPopularTags();
    return new GetPopularTagsResponseWrapperDto(tags);
  }

  @Get(':slug')
  @Public()
  @ApiOperationDecorator({
    summary: 'Get article by slug',
    description: 'Get article by slug',
    operationId: 'getArticleBySlug',
    type: FindArticleBySlugResponseDtoWrapper,
  })
  async getArticleBySlug(
    @Identify('id') userId: number,
    @Param('slug') slug: string,
  ) {
    const article = await this.articlesService.getArticleBySlug(slug);
    const isFollowing = article.author.followedBy.some(
      (user) => user.id === userId,
    );
    return new FindArticleBySlugResponseDtoWrapper({
      author: {
        ...article.author,
        following: isFollowing,
      },
      body: article.body,
      createdAt: article.createdAt,
      description: article.description,
      slug: article.slug,
      tagList: article.tagList.map((tag) => tag.name),
      title: article.title,
      updatedAt: article.updatedAt,
      favorited: article.favoritedBy.some((user) => user.id === userId),
      favoritesCount: article.favoritedBy.length,
    });
  }

  @Put(':slug')
  @ApiOperationDecorator({
    summary: 'Update article',
    description: 'Update article',
    operationId: 'updateArticle',
    type: RequestUpdateArticleDto,
  })
  @ApiBearerAuth()
  async updateArticle(
    @Param('slug') slug: string,
    @Body() data: RequestUpdateArticleDto,
    @Identify('id') userId: number,
  ) {
    const article = await this.articlesService.updateArticle(
      slug,
      data.article,
      userId,
    );
    const isFollowing = article.author.followedBy.some(
      (user) => user.id === userId,
    );
    return new UpdateArticleResponseWrapperDto({
      ...article,
      author: {
        ...article.author,
        following: isFollowing,
      },
      favorited: article.favoritedBy.some((user) => user.id === userId),
      favoritesCount: article.favoritedBy.length,
      tagList: article.tagList.map((tag) => tag.name),
    });
  }

  @Delete(':slug')
  @ApiOperationDecorator({
    summary: 'Delete article',
    description: 'Delete article',
    operationId: 'deleteArticle',
    type: ArticlesResponseWrapperDto,
  })
  @ApiBearerAuth()
  async deleteArticle(
    @Param('slug') slug: string,
    @Identify('id') userId: number,
  ) {
    await this.articlesService.deleteArticle(slug, userId);
  }

  @Post(':slug/favorite')
  @ApiOperationDecorator({
    summary: 'Favorite article',
    description: 'Favorite article',
    operationId: 'favoriteArticle',
    type: FavoriteArticleResponseWrapperDto,
  })
  @ApiBearerAuth()
  async favoriteArticle(
    @Param('slug') slug: string,
    @Identify('id') userId: number,
  ) {
    const article = await this.articlesService.favoriteArticle(slug, userId);
    return new FavoriteArticleResponseWrapperDto({
      ...article,
      favorited: true,
      favoritesCount: article.favoritedBy.length,
      tagList: article.tagList.map((tag) => tag.name),
    });
  }

  @Delete(':slug/favorite')
  @ApiOperationDecorator({
    summary: 'Unfavorite article',
    description: 'Unfavorite article',
    operationId: 'unfavoriteArticle',
    type: FavoriteArticleResponseWrapperDto,
  })
  @ApiBearerAuth()
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @Identify('id') userId: number,
  ) {
    const article = await this.articlesService.unfavoriteArticle(slug, userId);
    return new FavoriteArticleResponseWrapperDto({
      ...article,
      favorited: false,
      favoritesCount: article.favoritedBy.length,
      tagList: article.tagList.map((tag) => tag.name),
    });
  }

  @Post(':slug/comments')
  @ApiOperationDecorator({
    summary: 'Create comment',
    description: 'Create comment',
    operationId: 'createComment',
    type: CreateCommentResponseWrapperDto,
  })
  @ApiBearerAuth()
  async createComment(
    @Param('slug') slug: string,
    @Body() data: CreateCommentRequestDto,
    @Identify('id') userId: number,
  ) {
    const comment = await this.articlesService.createComment(
      slug,
      data.comment,
      userId,
    );
    return new CreateCommentResponseWrapperDto({
      id: comment.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      body: comment.body,
      author: comment.author,
    });
  }

  @Get(':slug/comments')
  @ApiOperationDecorator({
    summary: 'Get comments',
    description: 'Get comments',
    operationId: 'getComments',
    type: GetCommentsResponseDto,
  })
  async getComments(@Param('slug') slug: string) {
    const comments = await this.articlesService.getComments(slug);
    return new GetCommentsResponseDto(
      comments.map((comment) => ({
        id: comment.id,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        body: comment.body,
        author: comment.author,
      })),
    );
  }

  @Delete(':slug/comments/:id')
  @ApiOperationDecorator({
    summary: 'Delete comment',
    description: 'Delete comment',
    operationId: 'deleteComment',
  })
  @ApiBearerAuth()
  async deleteComment(
    @Param('slug') slug: string,
    @Param('id') id: number,
    @Identify('id') userId: number,
  ) {
    await this.articlesService.deleteComment(slug, id, userId);
  }

  @Put(':slug/comments/:id')
  @ApiOperationDecorator({
    summary: 'Update comment',
    description: 'Update comment',
    operationId: 'updateComment',
    type: CreateCommentResponseWrapperDto,
  })
  @ApiBearerAuth()
  async updateComment(
    @Param('slug') slug: string,
    @Param('id') id: number,
    @Body() data: CreateCommentRequestDto,
    @Identify('id') userId: number,
  ) {
    const comment = await this.articlesService.updateComment(
      slug,
      id,
      data.comment,
      userId,
    );
    return new CreateCommentResponseWrapperDto({
      id: comment.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      body: comment.body,
      author: comment.author,
    });
  }
}
