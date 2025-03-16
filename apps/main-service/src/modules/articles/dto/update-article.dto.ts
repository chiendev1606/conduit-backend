import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ArticleResponseDto } from './article-response.dto';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'The title of the article',
    example: 'My first article',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'The description of the article',
    example: 'This is a description of my first article',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'The body of the article',
    example: 'This is the body of my first article',
  })
  body: string;
}

export class RequestUpdateArticleDto {
  @ApiProperty({
    description: 'The article to update',
    type: UpdateArticleDto,
  })
  @ValidateNested()
  @Type(() => UpdateArticleDto)
  article: UpdateArticleDto;
}

export class UpdateArticleResponseWrapperDto {
  @ApiProperty({
    description: 'The article',
    type: ArticleResponseDto,
  })
  article: ArticleResponseDto;

  constructor(article: ArticleResponseDto) {
    this.article = article;
  }
}
