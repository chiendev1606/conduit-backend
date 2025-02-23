import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../utils/bcrypt';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(body: SignUpDto) {
    return this.usersService.createUser(body);
  }

  async login(body: LoginDto) {
    const user = await this.usersService.findUserByEmail(body.email);
    if (!user) {
      throw new BadRequestException('email or password is incorrect');
    }

    const isPasswordValid = await comparePassword(body.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('email or password is incorrect');
    }

    return user;
  }
}
