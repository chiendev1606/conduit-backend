import { IsNotEmpty, IsString } from 'class-validator';
import { ArticleResponseDto } from './article-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FavoriteArticleDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class FavoriteArticleResponseDto {
  @ApiProperty({
    description: 'The article',
    type: ArticleResponseDto,
  })
  article: ArticleResponseDto;
}

export class FavoriteArticleResponseWrapperDto {
  @ApiProperty({
    description: 'The article',
    type: ArticleResponseDto,
  })
  article: ArticleResponseDto;

  constructor(article: ArticleResponseDto) {
    this.article = article;
  }
}
