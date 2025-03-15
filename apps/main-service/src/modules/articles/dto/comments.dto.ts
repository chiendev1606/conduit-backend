import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AuthorDto } from './article-response.dto';

export class CommentQueryDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class DeleteCommentQueryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The slug of the article',
    type: String,
    example: 'slug',
  })
  slug: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    description: 'The id of the comment',
    type: Number,
    example: 1,
  })
  id: number;
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class CreateCommentRequestDto {
  @ApiProperty({
    description: 'The body of the comment',
    type: CreateCommentDto,
    example: { body: 'This is a comment' },
  })
  @ValidateNested()
  @Type(() => CreateCommentDto)
  comment: CreateCommentDto;
}

export class CommentResponseDto {
  @ApiProperty({
    description: 'The id of the comment',
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The created at date of the comment',
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the comment',
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The body of the comment',
    type: String,
    example: 'This is a comment',
  })
  body: string;

  @ApiProperty({
    description: 'The author of the comment',
    type: AuthorDto,
    example: { id: 1, username: 'John Doe', email: 'john.doe@example.com' },
  })
  author: AuthorDto;
}

export class CreateCommentResponseWrapperDto {
  @ApiProperty({
    description: 'The comment',
    type: CommentResponseDto,
    example: {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      body: 'This is a comment',
      author: {
        id: 1,
        username: 'John Doe',
        email: 'john.doe@example.com',
        bio: 'This is a bio',
        image: 'https://example.com/image.png',
      },
    },
  })
  comment: CommentResponseDto;

  constructor(comment: CommentResponseDto) {
    this.comment = comment;
  }
}

export class GetCommentsResponseDto {
  @ApiProperty({
    description: 'The comments',
    type: [CommentResponseDto],
    example: [
      {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        body: 'This is a comment',
        author: {
          id: 1,
          username: 'John Doe',
          email: 'john.doe@example.com',
          bio: 'This is a bio',
          image: 'https://example.com/image.png',
        },
      },
    ],
  })
  comments: CommentResponseDto[];

  constructor(comments: CommentResponseDto[]) {
    this.comments = comments;
  }
}
