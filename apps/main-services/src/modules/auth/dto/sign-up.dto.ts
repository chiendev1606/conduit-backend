import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CompareConfirmPassword } from 'libs/validators/src';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @CompareConfirmPassword()
  password: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @CompareConfirmPassword()
  confirmPassword: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}
