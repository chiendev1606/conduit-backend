import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Identify } from '@conduit/decorators/identify.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Identify('id') userId: string) {
    return this.usersService.findUserById(userId);
  }
}
