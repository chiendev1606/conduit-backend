import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ArticleResponseDto } from './article-response.dto';

export class FindArticleBySlugDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class FindArticleBySlugResponseDtoWrapper {
  @ApiProperty({
    description: 'The article',
    type: ArticleResponseDto,
  })
  article: ArticleResponseDto;

  constructor(article: ArticleResponseDto) {
    this.article = article;
  }
}
