import { ApiOperationDecorator } from '@conduit/decorators';
import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProfileResponseWrapperDto } from './dto/profile-response.dto';
import { ProfileService } from './profile.service';
import { Identify } from '@conduit/decorators/identify.decorator';
import { User } from '@prisma/client';
import { ProfileQueryParamsDto } from './dto/profile-query-params.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @ApiOperationDecorator({
    summary: 'Get profile by username',
    description: 'Get profile by username',
    operationId: 'getProfileByUsername',
    type: ProfileResponseWrapperDto,
  })
  async getProfile(
    @Param() queryParams: ProfileQueryParamsDto,
    @Identify() user: User,
  ) {
    return this.profileService.getProfileByUsername({
      username: queryParams.username,
      currentUser: user,
    });
  }

  @Post(':username/follow')
  @ApiOperationDecorator({
    summary: 'Follow a user',
    description: 'Follow a user',
    operationId: 'followUser',
    type: ProfileResponseWrapperDto,
  })
  async followUser(
    @Param() queryParams: ProfileQueryParamsDto,
    @Identify() user: User,
  ) {
    const result = await this.profileService.followUser({
      username: queryParams.username,
      currentUser: user,
    });

    return new ProfileResponseWrapperDto(result, true);
  }

  @Delete(':username/follow')
  @ApiOperationDecorator({
    summary: 'unfollow a user',
    description: 'unfollow a user',
    operationId: 'unfollowUser',
    type: ProfileResponseWrapperDto,
  })
  async unfollowUser(
    @Param() queryParams: ProfileQueryParamsDto,
    @Identify() user: User,
  ) {
    const result = await this.profileService.unfollowUser({
      username: queryParams.username,
      currentUser: user,
    });

    return new ProfileResponseWrapperDto(result, false);
  }
}
