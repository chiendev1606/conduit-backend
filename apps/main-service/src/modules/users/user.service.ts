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
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
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
      include: {
        following: true,
      },
    });
  }

  async findOrFailByUsername(username: string) {
    const user = await this.db.user.findUnique({
      where: { username },
      include: {
        following: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: number) {
    return this.db.user.findUnique({
      where: { id },
    });
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

  async updateUserById({
    userId,
    data,
  }: {
    userId: number;
    data: UpdateUserDto;
  }) {
    const { password, ...userData } = data;

    const [user, existingUser] = await Promise.all([
      this.findById(userId),
      this.findByUsername(userData.username),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (existingUser) {
      throw new BadRequestException('username already exists');
    }

    const updatedData: Partial<User> = {
      ...userData,
    };

    if (password) {
      updatedData.password = await hashPassword(password);
    }

    return this.db.user.update({
      where: { id: userId },
      data: updatedData,
    });
  }

  async followUserByUserId({
    currentUserId,
    followingUserId,
  }: {
    currentUserId: number;
    followingUserId: number;
  }) {
    return await this.db.user.update({
      where: { id: currentUserId },
      data: {
        following: {
          connect: { id: followingUserId },
        },
      },
    });
  }

  async unfollowUserByUserId({
    currentUserId,
    unFollowingUserId,
  }: {
    currentUserId: number;
    unFollowingUserId: number;
  }) {
    return await this.db.user.update({
      where: { id: currentUserId },
      data: {
        following: {
          disconnect: { id: unFollowingUserId },
        },
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

  async generateJwt(user: User) {
    return this.jwtService.signAsync({
      iss: config.jwt.issuer,
      sub: user.id,
    });
  }
}
