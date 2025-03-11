import { ApiOperationDecorator } from '@conduit/decorators/api-operation.decorator';
import { Identify } from '@conduit/decorators/identify.decorator';
import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { CommentsServices } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsServices) {}

  @Put(':id')
  @ApiOperationDecorator({
    summary: 'Update comment',
    description: 'Update comment',
    operationId: 'updateComment',
  })
  async updateComment(
    @Param('id') commentId: string,
    @Body() body: CreateCommentDto,
    @Identify('id') userId: string,
  ) {
    return this.commentsService.updateComment({ body, userId, commentId });
  }

  @ApiOperationDecorator({
    summary: 'Delete comment',
    description: 'Delete comment',
    operationId: 'deleteComment',
  })
  @Delete(':id')
  async deleteComment(
    @Param('id') commentId: string,
    @Identify('id') userId: string,
  ) {
    return this.commentsService.deleteComment(commentId, userId);
  }
}
