import { IsNumber, IsOptional } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetFeedsDto {
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
  limit?: number = 20;
}
