import { AllConfigType } from '@/config/config.type';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@repo/mysql-typeorm';
import { verifyPassword } from '@repo/nest-common';
import { Repository } from 'typeorm';
import { UserResDto } from '../user/dto/user.dto';
import { LoginReqDto } from './dto/login.dto';
import { JwtPayloadType } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async login(dto: LoginReqDto): Promise<UserResDto> {
    const { email, password } = dto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    const isPasswordValid =
      user && (await verifyPassword(password, user.password));

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const token = await this.createToken({ id: user.id });

    return {
      user: {
        ...user,
        token,
      },
    };
  }

  async verifyAccessToken(token: string): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException();
    }

    return payload;
  }

  async createToken(data: { id: number }): Promise<string> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const accessToken = await this.jwtService.signAsync(
      {
        id: data.id,
      },
      {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      },
    );

    return accessToken;
  }
}
