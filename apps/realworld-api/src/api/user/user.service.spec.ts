import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@repo/mysql-typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let authServiceValue: Partial<Record<keyof AuthService, jest.Mock>>;
  let userRepositoryValue: Partial<
    Record<keyof Repository<UserEntity>, jest.Mock>
  >;

  beforeAll(async () => {
    authServiceValue = {
      createToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: AuthService,
          useValue: authServiceValue,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryValue,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
