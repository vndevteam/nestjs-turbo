import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@repo/mysql-typeorm';
import { UserFollowsEntity } from '@repo/mysql-typeorm/entities/user-follows.entity';
import { Repository } from 'typeorm';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let userRepositoryValue: Partial<
    Record<keyof Repository<UserEntity>, jest.Mock>
  >;
  let userFollowsRepositoryValue: Partial<
    Record<keyof Repository<UserFollowsEntity>, jest.Mock>
  >;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryValue,
        },
        {
          provide: getRepositoryToken(UserFollowsEntity),
          useValue: userFollowsRepositoryValue,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
