import { ApiProperty } from '@nestjs/swagger';

export class AuthorDto {
  @ApiProperty({
    description: 'Username of the author',
    type: String,
    example: 'John Doe',
  })
  username: string;
  @ApiProperty({
    description: 'Bio of the author',
    type: String,
    example: 'I am a software engineer',
  })
  bio: string;
  @ApiProperty({
    description: 'Image of the author',
    type: String,
    example: 'https://example.com',
  })
  image: string;

  @ApiProperty({
    description: 'Following status of the author',
    type: Boolean,
    example: true,
  })
  following?: boolean;
}

export class ArticleResponseDto {
  @ApiProperty({
    description: 'Slug of the article',
    type: String,
    example: 'john-doe',
  })
  slug: string;
  @ApiProperty({
    description: 'Title of the article',
    type: String,
    example: 'My first article',
  })
  title: string;
  @ApiProperty({
    description: 'Description of the article',
    type: String,
    example: 'This is a description of my first article',
  })
  description: string;
  @ApiProperty({
    description: 'Body of the article',
    type: String,
    example: 'This is the body of my first article',
  })
  body: string;
  @ApiProperty({
    description: 'Tag list of the article',
    type: [String],
    example: ['tag1', 'tag2'],
  })
  tagList: string[];
  @ApiProperty({
    description: 'Created at date of the article',
    type: Date,
    example: '2025-03-15T02:55:46.764Z',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'Updated at date of the article',
    type: Date,
    example: '2025-03-15T02:55:46.764Z',
  })
  updatedAt: Date;
  @ApiProperty({
    description: 'Favorited status of the article',
    type: Boolean,
    example: true,
  })
  favorited: boolean;
  @ApiProperty({
    description: 'Favorites count of the article',
    type: Number,
    example: 10,
  })
  favoritesCount: number;
  @ApiProperty({
    description: 'Author of the article',
    type: AuthorDto,
  })
  author: AuthorDto;
}

export class ArticlesResponseDto {
  @ApiProperty({
    description: 'List of articles',
    type: ArticleResponseDto,
  })
  articles: ArticleResponseDto[];

  @ApiProperty({
    description: 'Total number of articles',
    type: Number,
    example: 10,
  })
  articlesCount: number;
}

export class ArticlesResponseWrapperDto {
  @ApiProperty({
    description: 'Article response',
    type: ArticleResponseDto,
  })
  articles: ArticleResponseDto[];

  @ApiProperty({
    description: 'Total number of articles',
    type: Number,
    example: 10,
  })
  articlesCount: number;

  constructor(articles: ArticleResponseDto[], articlesCount: number) {
    this.articles = articles;
    this.articlesCount = articlesCount;
  }
}
