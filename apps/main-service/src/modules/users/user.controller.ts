import { ApiOperationDecorator, Public } from '@conduit/decorators';
import { Identify } from '@conduit/decorators/identify.decorator';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { RequestCreateUserDto } from './dto/create-user.dto';
import { RequestLoginDto } from './dto/login.dto';
import { RequestUpdateUserDto } from './dto/update-user.dto';
import { UserResponseWrapperDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller()
@ApiTags('users')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get('/user')
  @ApiBearerAuth()
  @ApiOperationDecorator({
    summary: 'Get current user',
    description: 'Get current user',
    operationId: 'getCurrentUser',
    type: UserResponseWrapperDto,
  })
  async getProfile(@Identify() user: User) {
    const token = await this.userService.generateJwt(user);
    return new UserResponseWrapperDto(user, token);
  }

  @Put('/user')
  @ApiBearerAuth()
  @ApiOperationDecorator({
    summary: 'Update user profile',
    description: 'Update user profile',
    operationId: 'updateUser',
    type: UserResponseWrapperDto,
  })
  async updateUser(@Identify() user: User, @Body() body: RequestUpdateUserDto) {
    if (Object.keys(body.user).length === 0) {
      throw new UnprocessableEntityException('At least one field is required');
    }

    return this.userService.updateUserById({
      userId: user.id,
      data: body.user,
    });
  }

  @Post('/users')
  @ApiOperationDecorator({
    summary: 'Create user',
    description: 'Create user',
    operationId: 'Create a new user',
    type: UserResponseWrapperDto,
  })
  async createUser(@Body() data: RequestCreateUserDto) {
    try {
      this.logger.log('[createUser] Creating user...');
      const user = await this.userService.createUser(data.user);
      const token = await this.userService.generateJwt(user);
      this.logger.log('[createUser] User created successfully');
      return new UserResponseWrapperDto(user, token);
    } catch (error) {
      this.logger.error('[createUser] Error creating user', error);
      throw error;
    }
  }

  @Post('/users/login')
  @Public()
  @ApiOperationDecorator({
    summary: 'Login user',
    description: 'Login user',
    operationId: 'Login user',
    type: UserResponseWrapperDto,
  })
  async login(@Body() data: RequestLoginDto) {
    try {
      this.logger.log('[login] Logging in user...');
      const user = await this.userService.login(data.user);
      const token = await this.userService.generateJwt(user);
      this.logger.log('[login] User logged in successfully');
      return new UserResponseWrapperDto(user, token);
    } catch (error) {
      this.logger.error('[login] Error logging in user', error);
      throw error;
    }
  }
}
