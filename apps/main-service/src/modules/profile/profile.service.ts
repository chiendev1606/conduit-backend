import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../users/user.service';
import { ProfileResponseWrapperDto } from './dto/profile-response.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async getProfileByUsername({
    username,
    currentUser,
  }: {
    username: string;
    currentUser: User;
  }) {
    const existingUser = await this.userService.findOrFailByUsername(username);
    const following = existingUser.following.some(
      (user) => user.id === currentUser.id,
    );

    return new ProfileResponseWrapperDto(existingUser, following);
  }

  async followUser({
    username,
    currentUser,
  }: {
    username: string;
    currentUser: User;
  }) {
    const followingUser = await this.userService.findOrFailByUsername(username);

    const user = await this.userService.followUserByUserId({
      currentUserId: currentUser.id,
      followingUserId: followingUser.id,
    });

    return new ProfileResponseWrapperDto(user, true);
  }

  async unfollowUser({
    username,
    currentUser,
  }: {
    username: string;
    currentUser: User;
  }) {
    const followingUser = await this.userService.findOrFailByUsername(username);

    const user = await this.userService.unfollowUserByUserId({
      currentUserId: currentUser.id,
      unFollowingUserId: followingUser.id,
    });

    return new ProfileResponseWrapperDto(user, false);
  }
}
