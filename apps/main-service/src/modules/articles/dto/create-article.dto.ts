import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Article, User } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ArticleResponseDto } from './article-response.dto';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the article',
    example: 'My first article',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the article',
    example: 'This is a description of my first article',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The body of the article',
    example: 'This is the body of my first article',
  })
  body: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The tag list of the article',
    example: ['tag1', 'tag2'],
  })
  tagList: string[];
}

export class RequestCreateArticleDto {
  @ApiProperty({
    description: 'The article to create',
    type: CreateArticleDto,
  })
  @ValidateNested()
  @Type(() => CreateArticleDto)
  article: CreateArticleDto;
}

export class CreateArticleResponseDtoWrapper {
  @ApiProperty({
    description: 'The article created',
    type: ArticleResponseDto,
  })
  article: ArticleResponseDto;

  constructor(
    articleData: Article,
    tagList: string[],
    author: Omit<User, 'password'>,
  ) {
    this.article = {
      author,
      body: articleData.body,
      createdAt: articleData.createdAt,
      description: articleData.description,
      slug: articleData.slug,
      tagList,
      title: articleData.title,
      updatedAt: articleData.updatedAt,
      favorited: true,
      favoritesCount: 0,
    };
  }
}
