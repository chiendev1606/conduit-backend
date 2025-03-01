import { DatabaseServices } from '@conduit/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationQuery } from '@conduit/decorators';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesServices {
  constructor(private readonly db: DatabaseServices) {}

  async findAll() {
    return this.db.article.findMany();
  }

  async findOne(id: string) {
    return this.db.article.findUnique({
      where: { id },
      include: {
        favorites: true,
        emotions: true,
        comments: true,
        tags: true,
      },
    });
  }

  async findArticlesByIdOrThrow(id: string) {
    const article = await this.db.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async getArticleList({ pagination }: { pagination: PaginationQuery }) {
    const { page, size } = pagination;
    const [total, articles] = await Promise.all([
      this.db.article.count(),
      this.db.article.findMany({
        skip: (page - 1) * size,
        take: size,
        include: {
          tags: true,
        },
      }),
    ]);

    return { articles, total, page, size };
  }

  async getArticleById(id: string) {
    return this.db.article.findUnique({
      where: { id },
      include: {
        favorites: true,
        emotions: true,
        tags: true,
        comments: true,
      },
    });
  }

  async getArticlesByUserId({
    userId,
    pagination,
  }: {
    userId: string;
    pagination: PaginationQuery;
  }) {
    const { page, size } = pagination;
    const [total, articles] = await Promise.all([
      this.db.article.count({
        where: { createdBy: userId },
      }),
      this.db.article.findMany({
        where: { createdBy: userId },
        skip: (page - 1) * size,
        take: size,
        include: {
          favorites: true,
          emotions: true,
          tags: true,
          comments: true,
        },
      }),
    ]);

    return {
      articles,
      total,
      page,
      size,
    };
  }

  async createArticle(body: CreateArticleDto) {
    const tags = await this.db.$transaction(
      body.tags.map((tag) =>
        this.db.tag.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag },
        }),
      ),
    );

    return this.db.article.create({
      data: {
        title: body.title,
        content: body.content,
        contentMd: body.contentMd,
        createdBy: body.createdBy,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { id: tag.id },
            create: { name: tag.name },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
  }

  async updateArticle({ id, body }: { id: string; body: CreateArticleDto }) {
    const existingArticle = await this.db.article.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!existingArticle) {
      throw new NotFoundException('Article not found');
    }

    let tags = [];
    if (body.tags && body.tags.length > 0) {
      tags = await this.db.$transaction(
        body.tags.map((tag) =>
          this.db.tag.upsert({
            where: { name: tag },
            update: {},
            create: { name: tag },
          }),
        ),
      );
    }

    return this.db.article.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        contentMd: body.contentMd,
        tags: {
          set: [],
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        tags: true,
      },
    });
  }
}
