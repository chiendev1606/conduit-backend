import { ApiOperationDecorator } from '@conduit/decorators';
import { Identify } from '@conduit/decorators/identify.decorator';
import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowUserDto } from './dto/follow-user.dto';

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

  @Post('follow')
  @ApiOperationDecorator({
    summary: 'Follow user',
    description: 'Follow user',
    operationId: 'followUser',
  })
  async followUser(
    @Identify('id') userId: string,
    @Body() body: FollowUserDto,
  ) {
    return this.usersService.followUser({ userId, body });
  }

  @Post('unfollow')
  @ApiOperationDecorator({
    summary: 'Unfollow user',
    description: 'Unfollow user',
    operationId: 'unfollowUser',
  })
  async unfollowUser(
    @Identify('id') userId: string,
    @Body() body: FollowUserDto,
  ) {
    return this.usersService.unfollowUser({ userId, body });
  }
}
