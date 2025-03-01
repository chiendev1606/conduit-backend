import { DatabaseServices } from '@conduit/database';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesServices } from '../articles/articles.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationQuery } from '@conduit/decorators';

@Injectable()
export class CommentsService {
  constructor(
    private readonly db: DatabaseServices,
    private readonly articlesService: ArticlesServices,
  ) {}

  async createComment(body: CreateCommentDto, userId: string) {
    const { content, articleId } = body;
    await this.articlesService.findArticlesByIdOrThrow(articleId);
    await this.db.comment.create({ data: { content, articleId, userId } });
    return 'Comment created successfully';
  }

  async checkUserOwnership(commentId: string, userId: string) {
    const comment = await this.findCommentByIdOrThrow(commentId);
    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }
  }

  async deleteComment(commentId: string, userId: string) {
    await this.checkUserOwnership(commentId, userId);
    await this.db.comment.delete({ where: { id: commentId } });
    return 'Comment deleted successfully';
  }

  async findCommentByIdOrThrow(commentId: string) {
    const comment = await this.db.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async updateComment({
    body,
    userId,
    commentId,
  }: {
    body: CreateCommentDto;
    userId: string;
    commentId: string;
  }) {
    await this.checkUserOwnership(commentId, userId);
    await this.db.comment.update({
      where: { id: commentId },
      data: { content: body.content, articleId: body.articleId },
    });
    return 'Comment updated successfully';
  }

  async getCommentsByArticleId({
    articleId,
    pagination,
  }: {
    articleId: string;
    pagination: PaginationQuery;
  }) {
    const { page, size } = pagination;
    const [total, comments] = await Promise.all([
      this.db.comment.count({ where: { articleId } }),
      this.db.comment.findMany({
        where: { articleId },
        skip: (page - 1) * size,
        take: size,
      }),
    ]);
    return { comments, total };
  }
}
