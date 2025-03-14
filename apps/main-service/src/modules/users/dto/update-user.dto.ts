import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  profileUrl?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export class RequestUpdateUserDto {
  @ApiProperty({
    description: 'The user to update',
    type: UpdateUserDto,
  })
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user: UpdateUserDto;
}
