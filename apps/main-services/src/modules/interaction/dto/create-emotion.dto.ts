import { EmotionEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmotionDto {
  @IsString()
  @IsNotEmpty()
  articleId: string;

  @IsEnum(EmotionEnum)
  @IsNotEmpty()
  type: EmotionEnum;
}
