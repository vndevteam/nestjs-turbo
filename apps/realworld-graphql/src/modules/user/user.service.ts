import { ErrorCode } from '@/constants/error-code.constant';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationException } from '@repo/graphql';
import { UserEntity } from '@repo/postgresql-typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CreateUserInput, UpdateUserInput } from './dto/user.dto';
import { User } from './model/user.model';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async get(currentUser: { id: number; token: string }): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({
      id: currentUser.id,
    });

    return { ...user, token: currentUser.token };
  }

  async create(input: CreateUserInput): Promise<User> {
    const { username, email, password } = input;

    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (user) {
      throw new ValidationException(ErrorCode.E001);
    }

    const newUser = this.userRepository.create({ username, email, password });
    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }

  async update(userId: number, input: UpdateUserInput) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new ValidationException(ErrorCode.E002);
    }

    const savedUser = await this.userRepository.save({
      id: userId,
      ...input,
    });

    return {
      ...user,
      ...savedUser,
    };
  }
}
