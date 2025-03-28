import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;
}

export class RequestLoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: {
      email: 'mahmood.koech287@bluewin.org',
      password: '12345678',
    },
  })
  @ValidateNested()
  @Type(() => LoginDto)
  user: LoginDto;
}
