import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'The email of the user',
    example: 'test@test.com',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'The password of the user',
    example: 'password',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'The username of the user',
    example: 'username',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class RequestCreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
    type: String,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
