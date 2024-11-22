import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@repo/mysql-typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtServiceValue: Partial<Record<keyof JwtService, jest.Mock>>;
  let configServiceValue: Partial<Record<keyof ConfigService, jest.Mock>>;
  let userRepositoryValue: Partial<
    Record<keyof Repository<UserEntity>, jest.Mock>
  >;

  beforeAll(async () => {
    configServiceValue = {
      get: jest.fn(),
    };

    jwtServiceValue = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    userRepositoryValue = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: configServiceValue,
        },
        {
          provide: JwtService,
          useValue: jwtServiceValue,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryValue,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
