import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, ValidateNested } from 'class-validator';

export class TagDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  count: number;
}

export class GetPopularTagsResponseDto {
  @ApiProperty({ type: [TagDto] })
  @Type(() => TagDto)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  tags: TagDto[];

  constructor(tags: TagDto[]) {
    this.tags = tags;
  }
}

export class GetPopularTagsResponseWrapperDto {
  @ApiProperty({
    type: [TagDto],
    example: [
      { id: 1, name: 'tag1', count: 10 },
      { id: 2, name: 'tag2', count: 5 },
    ],
  })
  @Type(() => TagDto)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  tags: TagDto[];

  constructor(tags: TagDto[]) {
    this.tags = tags;
  }
}
