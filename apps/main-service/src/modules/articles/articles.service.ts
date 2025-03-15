import { DatabaseServices } from '@conduit/database';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article, Prisma } from '@prisma/client';
import slugify from 'slugify';
import { CreateArticleDto } from './dto/create-article.dto';
import { FindArticlesQueryDto } from './dto/find-articles-query.dto';
import { GetFeedsDto } from './dto/get-feeds.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UserService } from '../users/user.service';
import { CreateCommentDto } from './dto/comments.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly databaseService: DatabaseServices,
    private readonly userService: UserService,
  ) {}

  async findOrFailArticleBySlug(slug: string) {
    const article = await this.databaseService.article.findUnique({
      where: { slug },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  checkOwnership(article: Article, userId: number) {
    if (article.authorId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this article',
      );
    }
  }

  async findArticles(query: FindArticlesQueryDto) {
    const { tag, author, favorited, offset, limit } = query;

    const AND: Prisma.ArticleWhereInput[] = [];
    if (tag) {
      AND.push({
        tagList: {
          some: { name: tag },
        },
      });
    }

    if (author) {
      AND.push({
        author: {
          username: author,
        },
      });
    }

    if (favorited) {
      AND.push({
        favoritedBy: {
          some: { id: favorited },
        },
      });
    }

    const [articleCount, articles] = await Promise.all([
      this.databaseService.article.count({
        where: {
          AND,
        },
      }),
      this.databaseService.article.findMany({
        where: {
          AND,
        },
        skip: offset,
        take: limit,
        include: {
          tagList: {
            select: {
              name: true,
            },
          },
          author: true,
          favoritedBy: true,
        },
      }),
    ]);

    return {
      articles,
      articleCount,
    };
  }

  async createArticle(body: CreateArticleDto, userId: number) {
    const article = await this.databaseService.article.create({
      data: {
        author: {
          connect: {
            id: userId,
          },
        },
        tagList: {
          connectOrCreate: body.tagList.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        slug: this.generateSlug(body.title),
        title: body.title,
        description: body.description,
        body: body.body,
      },
      include: {
        tagList: true,
        author: {
          select: {
            id: true,
            username: true,
            image: true,
            bio: true,
            email: true,
          },
        },
        favoritedBy: true,
      },
    });
    return article;
  }

  async getArticleBySlug(slug: string) {
    const article = await this.databaseService.article.findUnique({
      where: { slug },
      include: {
        tagList: true,
        author: {
          select: {
            id: true,
            username: true,
            image: true,
            bio: true,
            email: true,
            followedBy: true,
          },
        },
        favoritedBy: true,
      },
    });
    return article;
  }

  private generateSlug(title: string) {
    return slugify(title, { lower: true, strict: true }) + '-' + Date.now();
  }

  async updateArticle(slug: string, body: UpdateArticleDto, userId: number) {
    const article = await this.findOrFailArticleBySlug(slug);
    this.checkOwnership(article, userId);
    const updatedArticle = await this.databaseService.article.update({
      where: { slug },
      data: {
        title: body.title,
        description: body.description,
        body: body.body,
      },
      include: {
        tagList: true,
        author: {
          select: {
            id: true,
            username: true,
            image: true,
            bio: true,
            followedBy: true,
          },
        },
        favoritedBy: true,
      },
    });
    return updatedArticle;
  }

  async deleteArticle(slug: string, userId: number) {
    const article = await this.findOrFailArticleBySlug(slug);
    this.checkOwnership(article, userId);
    await this.databaseService.article.delete({ where: { slug } });
  }

  async getFeeds(userId: number, query: GetFeedsDto) {
    const { offset, limit } = query;
    const followingIds = await this.userService.findAllFollowing(userId);

    const [articleCount, articles] = await Promise.all([
      this.databaseService.article.count({
        where: {
          author: { id: { in: followingIds } },
        },
      }),
      this.databaseService.article.findMany({
        where: {
          author: { id: { in: followingIds } },
        },
        skip: offset,
        take: limit,
        include: {
          tagList: true,
          author: {
            select: {
              id: true,
              username: true,
              image: true,
              bio: true,
              followedBy: true,
            },
          },
          favoritedBy: true,
        },
      }),
    ]);

    return {
      articles,
      articleCount,
    };
  }

  async favoriteArticle(slug: string, userId: number) {
    await this.findOrFailArticleBySlug(slug);
    const updatedArticle = await this.databaseService.article.update({
      where: { slug },
      data: { favoritedBy: { connect: { id: userId } } },
      include: {
        tagList: true,
        author: {
          select: {
            id: true,
            username: true,
            image: true,
            bio: true,
            followedBy: true,
          },
        },
        favoritedBy: true,
      },
    });
    return updatedArticle;
  }

  async unfavoriteArticle(slug: string, userId: number) {
    await this.findOrFailArticleBySlug(slug);
    const updatedArticle = await this.databaseService.article.update({
      where: { slug },
      data: { favoritedBy: { disconnect: { id: userId } } },
      include: {
        tagList: true,
        author: {
          select: {
            id: true,
            username: true,
            image: true,
            bio: true,
            followedBy: true,
          },
        },
        favoritedBy: true,
      },
    });
    return updatedArticle;
  }

  async createComment(slug: string, data: CreateCommentDto, userId: number) {
    await this.findOrFailArticleBySlug(slug);
    const user = await this.userService.findById(userId);
    const comment = await this.databaseService.comment.create({
      data: {
        body: data.body,
        article: { connect: { slug } },
        author: { connect: { id: userId } },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
            bio: true,
            email: true,
          },
        },
      },
    });
    return {
      ...comment,
      author: {
        ...comment.author,
        following: user.following.some((following) => following.id === userId),
      },
    };
  }

  async getComments(slug: string) {
    const comments = await this.databaseService.comment.findMany({
      where: { article: { slug } },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
            bio: true,
            email: true,
          },
        },
      },
    });
    return comments;
  }

  async deleteComment(slug: string, id: number, userId: number) {
    const article = await this.findOrFailArticleBySlug(slug);
    this.checkOwnership(article, userId);
    return this.databaseService.comment.delete({ where: { id } });
  }
}
