import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}
