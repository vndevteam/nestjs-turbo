import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticleEntity, UserEntity } from '@repo/mysql-typeorm';
import { Repository } from 'typeorm';
import { FavoriteService } from './favorite.service';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let articleRepositoryValue: Partial<
    Record<keyof Repository<ArticleEntity>, jest.Mock>
  >;
  let userRepositoryValue: Partial<
    Record<keyof Repository<UserEntity>, jest.Mock>
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: articleRepositoryValue,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryValue,
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
