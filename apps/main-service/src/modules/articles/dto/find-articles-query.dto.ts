import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindArticlesQueryDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The tag of the article',
    example: 'tag',
  })
  @Transform(({ value }) => value.trim())
  tag?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The author of the article',
    example: 'author',
  })
  @Transform(({ value }) => value.trim())
  author?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'The favorited user id of the article',
    example: '1',
  })
  @Type(() => Number)
  favorited?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The offset of the article',
    example: 0,
  })
  @Type(() => Number)
  offset?: number = 0;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The limit of the article',
    example: 10,
  })
  @Type(() => Number)
  limit?: number = 10;
}
