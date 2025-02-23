import { DatabaseService } from '@conduit/database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { hashPassword } from '../utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.user.findMany();
  }

  async findUserByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
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
}
