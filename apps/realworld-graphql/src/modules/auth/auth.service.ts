import { AllConfigType } from '@/config/config.type';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadType } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
  ) {}

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
}
