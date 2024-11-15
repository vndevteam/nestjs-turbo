import { ErrorCode } from '@/constants/error-code.constant';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationException } from '@repo/api';
import { UserEntity } from '@repo/database-typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CreateUserReqDto } from './dto/create-user.dto';
import { UpdateUserReqDto } from './dto/update-user.dto';
import { UserResDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async get(currentUser: { id: number; token: string }): Promise<UserResDto> {
    const user = await this.userRepository.findOneByOrFail({
      id: currentUser.id,
    });

    return { user: { ...user, token: currentUser.token } };
  }

  async create(dto: CreateUserReqDto): Promise<UserResDto> {
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
      user: {
        ...savedUser,
        token: await this.authService.createToken({ id: savedUser.id }),
      },
    };
  }

  async update(
    userId: number,
    userData: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new ValidationException(ErrorCode.E002);
    }

    const savedUser = await this.userRepository.save({
      id: userId,
      ...userData,
    });

    return {
      user: {
        ...savedUser,
        token: await this.authService.createToken({ id: savedUser.id }),
      },
    };
  }
}
