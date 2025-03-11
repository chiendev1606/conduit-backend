import { EmotionEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateEmotionDto {
  @IsEnum(EmotionEnum)
  @IsNotEmpty()
  type: EmotionEnum;
}
