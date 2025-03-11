import { DatabaseServices } from '@conduit/database';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import config from '../../config';
import { comparePassword, hashPassword } from '../../utils/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseServices,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return this.db.user.findMany();
  }

  async findByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return this.db.user.findUnique({
      where: { username },
    });
  }

  async findById(id: string) {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  async findUserByUserIdOrThrow(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: CreateUserDto) {
    const [existingEmail, existingUsername] = await Promise.all([
      this.findByEmail(data.email),
      this.findByUsername(data.username),
    ]);

    if (existingEmail || existingUsername) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hashPassword(data.password);

    return this.db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        username: data.username,
      },
    });
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

  async login(data: LoginDto) {
    const user = await this.findByEmail(data.email);
    if (!user) {
      throw new BadRequestException('email or password is incorrect');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('email or password is incorrect');
    }

    return user;
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

  async generateJwt(user: User) {
    return this.jwtService.signAsync({
      iss: config.jwt.issuer,
      sub: user.id,
    });
  }
}
