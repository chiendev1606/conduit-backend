import { ApiOperationDecorator } from '@conduit/decorators';
import { Identify } from '@conduit/decorators/identify.decorator';
import { Body, Controller, Get, Logger, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { RequestCreateUserDto } from './dto/create-user.dto';
import { UserResponseWrapperDto } from './dto/user-response.dto';
import { RequestLoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  private readonly logger: Logger;
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperationDecorator({
    summary: 'Get user profile',
    description: 'Get user profile',
    operationId: 'getProfile',
  })
  async getProfile(@Identify('id') userId: string) {
    return this.usersService.findById(userId);
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

  @Post('users')
  @ApiOperationDecorator({
    summary: 'Create user',
    description: 'Create user',
    operationId: 'Create a new user',
    type: UserResponseWrapperDto,
  })
  async createUser(@Body() data: RequestCreateUserDto) {
    try {
      this.logger.log('[createUser] Creating user...');
      const user = await this.usersService.createUser(data.user);
      const token = await this.usersService.generateJwt(user);
      this.logger.log('[createUser] User created successfully');
      return new UserResponseWrapperDto(user, token);
    } catch (error) {
      this.logger.error('[createUser] Error creating user', error);
      throw error;
    }
  }

  @Post('users/login')
  @ApiOperationDecorator({
    summary: 'Login user',
    description: 'Login user',
    operationId: 'Login user',
    type: UserResponseWrapperDto,
  })
  async login(@Body() data: RequestLoginDto) {
    try {
      this.logger.log('[login] Logging in user...');
      const user = await this.usersService.login(data.user);
      const token = await this.usersService.generateJwt(user);
      this.logger.log('[login] User logged in successfully');
      return new UserResponseWrapperDto(user, token);
    } catch (error) {
      this.logger.error('[login] Error logging in user', error);
      throw error;
    }
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
