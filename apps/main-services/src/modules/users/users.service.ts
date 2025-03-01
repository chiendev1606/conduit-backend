import { DatabaseServices } from '@conduit/database';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { hashPassword } from '../../utils/bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowUserDto } from './dto/follow-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseServices) {}

  async findAll() {
    return this.db.user.findMany();
  }

  async findUserByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  async findUserByUserIdOrThrow(userId: string) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserById(id: string) {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  async createUser(body: SignUpDto) {
    const { password, ...userData } = body;

    const existingUser = await this.findUserByEmail(userData.email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await this.db.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    });

    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async updateUser({ userId, body }: { userId: string; body: UpdateUserDto }) {
    const { password, ...userData } = body;

    const existingUser = await this.findUserByUserIdOrThrow(userId);

    const hashedPassword = await hashPassword(password);

    return this.db.user.update({
      where: { id: userId },
      data: {
        ...existingUser,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileUrl: userData.profileUrl,
      },
    });
  }

  async followUser({ userId, body }: { userId: string; body: FollowUserDto }) {
    const { userId: followingId } = body;

    await this.db.follow.create({
      data: {
        followerId: userId,
        followingId,
      },
    });

    return 'User followed successfully';
  }

  async unfollowUser({
    userId,
    body,
  }: {
    userId: string;
    body: FollowUserDto;
  }) {
    const { userId: followingId } = body;

    await this.db.follow.delete({
      where: { followerId_followingId: { followerId: userId, followingId } },
    });

    return 'User unfollowed successfully';
  }
}
