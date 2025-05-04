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

  async create(dto: CreateUserInput): Promise<User> {
    const { username, email, password } = dto;

    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (user) {
      throw new ValidationException(ErrorCode.E001);
    }

    const newUser = this.userRepository.create({ username, email, password });
    const savedUser = await this.userRepository.save(newUser);

    return {
      ...savedUser,
      token: await this.authService.createToken({ id: savedUser.id }),
    };
  }

  async update(dto: UpdateUserInput) {
    const user = await this.userRepository.findOneBy({ id: dto.id });

    if (!user) {
      throw new ValidationException(ErrorCode.E002);
    }

    const savedUser = await this.userRepository.save({
      id: user.id,
      ...dto,
    });

    return {
      ...savedUser,
      token: await this.authService.createToken({ id: savedUser.id }),
    };
  }
}
