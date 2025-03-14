import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileQueryParamsDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
