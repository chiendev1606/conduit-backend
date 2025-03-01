import { ApiOperationDecorator } from '@conduit/decorators';
import { Identify } from '@conduit/decorators/identify.decorator';
import { Body, Controller, Get, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperationDecorator({
    summary: 'Get user profile',
    description: 'Get user profile',
    operationId: 'getProfile',
  })
  async getProfile(@Identify('id') userId: string) {
    return this.usersService.findUserById(userId);
  }

  @Put('profile')
  @ApiOperationDecorator({
    summary: 'Update user profile',
    description: 'Update user profile',
    operationId: 'updateProfile',
  })
  async updateProfile(
    @Identify('id') userId: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUser({ userId, body });
  }
}
